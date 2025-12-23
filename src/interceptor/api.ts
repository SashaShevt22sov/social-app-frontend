import axios from "axios";
import type { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _priority?: "high" | "normal" | "low";
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

class CircuitBreaker {
  private failureThreshold: number;
  private timeout: number;
  private failureCount: number;
  private state: "CLOSED" | "OPEN" | "HALF_OPEN";
  private nextAttempt: number;

  constructor(failureThreshold = 5, timeout = 30000) {
    this.failureThreshold = failureThreshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.state = "CLOSED";
    this.nextAttempt = Date.now();
  }

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() < this.nextAttempt) {
        throw new Error("Circuit breaker is OPEN");
      }
      this.state = "HALF_OPEN";
    }

    try {
      const result = await fn();
      this.success();
      return result;
    } catch (error) {
      this.failure();
      throw error;
    }
  }

  private success() {
    this.failureCount = 0;
    if (this.state === "HALF_OPEN") this.state = "CLOSED";
  }

  private failure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

// ---------------- Priority Queue ----------------
interface RequestItem {
  id: string;
  timestamp: number;
  resolve: (value: AxiosResponse) => void;
  reject: (reason?: any) => void;
  config: ExtendedAxiosRequestConfig;
}

class PriorityQueue {
  private high: RequestItem[] = [];
  private normal: RequestItem[] = [];
  private low: RequestItem[] = [];
  private maxSize: number;
  private currentSize = 0;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  add(
    request: Omit<RequestItem, "id" | "timestamp">,
    priority: "high" | "normal" | "low" = "normal"
  ): boolean {
    if (this.currentSize >= this.maxSize) {
      // Пытаемся освободить место, удаляя старые low priority запросы
      if (this.low.length > 0) {
        const oldest = this.low.shift();
        if (oldest) {
          oldest.reject(new Error("Request queue overflow"));
          this.currentSize--;
        }
      } else {
        return false;
      }
    }

    const item: RequestItem = {
      ...request,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };

    switch (priority) {
      case "high":
        this.high.push(item);
        break;
      case "low":
        this.low.push(item);
        break;
      default:
        this.normal.push(item);
        break;
    }

    this.currentSize++;
    return true;
  }

  getNext(): RequestItem | undefined {
    const item = this.high.shift() ?? this.normal.shift() ?? this.low.shift();
    if (item) this.currentSize--;
    return item;
  }

  isEmpty(): boolean {
    return (
      this.high.length === 0 &&
      this.normal.length === 0 &&
      this.low.length === 0
    );
  }

  clear() {
    // Отклоняем все pending запросы
    const rejectAll = (queue: RequestItem[]) => {
      queue.forEach((item) => {
        item.reject(new Error("Queue cleared"));
      });
    };

    rejectAll(this.high);
    rejectAll(this.normal);
    rejectAll(this.low);

    this.high = [];
    this.normal = [];
    this.low = [];
    this.currentSize = 0;
  }

  getSize(): number {
    return this.currentSize;
  }
}

// ---------------- Exponential Backoff ----------------
const exponentialBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries) throw error;

      // Не повторяем для определенных ошибок
      const axiosError = error as AxiosError;
      if (axiosError.response?.status && axiosError.response.status < 500) {
        throw error;
      }

      const delay = baseDelay * 2 ** i + Math.random() * 1000;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Max retries exceeded");
};

// ---------------- Retry Logic ----------------
const shouldRetryRequest = (error: AxiosError): boolean => {
  if (!error.config) return false;

  const config = error.config as ExtendedAxiosRequestConfig;
  if (config._retry) return fal;

  const method = error.config.method?.toLowerCase();
  if (!["get", "head", "options", "put", "patch"].includes(method || "")) {
    return false;
  }

  return (
    !error.response ||
    (error.response.status >= 500 && error.response.status < 600) ||
    error.code === "ECONNABORTED" ||
    error.code === "NETWORK_ERROR" ||
    error.response.status === 429
  );
};

const retryRequest = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 500
): Promise<T> => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries || !shouldRetryRequest(error as AxiosError)) {
        throw error;
      }

      const delay = baseDelay * 2 ** i + Math.random() * 200;
      console.log(`Retrying in ${Math.round(delay)}ms...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Retry failed");
};

// ---------------- EnterpriseTokenManager ----------------
interface TokenManagerConfig {
  failureThreshold?: number;
  timeout?: number;
  maxRetries?: number;
  baseDelay?: number;
  maxQueueSize?: number;
  silentRefreshInterval?: number;
}

class EnterpriseTokenManager {
  private refreshCall: Promise<AxiosResponse> | null = null;
  private isRefreshing = false;
  private failedQueue: PriorityQueue;
  private tokenMonitorInterval: number | null = null;
  private circuitBreaker: CircuitBreaker;
  private visibilityHandler: (() => void) | null = null;
  private lastRefreshTime: number | null = null;
  private bc: BroadcastChannel | null = null;
  private abortController: AbortController;
  private isClient: boolean;
  private config: Required<TokenManagerConfig>;

  private skipEndpoints = ["/refresh", "/logout", "/health", "/me"];
  private publicEndpoints = ["/", "/auth/register", "/auth/login", "/public"];

  constructor(config: TokenManagerConfig = {}) {
    this.config = {
      failureThreshold: config.failureThreshold ?? 5,
      timeout: config.timeout ?? 30000,
      maxRetries: config.maxRetries ?? 3,
      baseDelay: config.baseDelay ?? 1000,
      maxQueueSize: config.maxQueueSize ?? 100,
      silentRefreshInterval: config.silentRefreshInterval ?? 5 * 60 * 1000,
    };

    this.isClient = typeof window !== "undefined";
    this.failedQueue = new PriorityQueue(this.config.maxQueueSize);
    this.circuitBreaker = new CircuitBreaker(
      this.config.failureThreshold,
      this.config.timeout
    );
    this.abortController = new AbortController();

    if (this.isClient) {
      this.bc = new BroadcastChannel("auth");
      this.bc.onmessage = (msg) => {
        if (msg.data === "TOKEN_REFRESHED") {
          this.processQueue(null);
          this.lastRefreshTime = Date.now();
        }
      };
    }
  }

  private shouldIntercept(url?: string): boolean {
    if (!url) return false;
    return (
      !this.publicEndpoints.some((e) => url.includes(e)) &&
      !this.skipEndpoints.some((e) => url.includes(e))
    );
  }

  private isAuthError(error: AxiosError): boolean {
    return (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/login") &&
      !error.config?.url?.includes("/public")
    );
  }

  private addToQueue(
    config: ExtendedAxiosRequestConfig,
    priority: "high" | "normal" | "low" = "normal"
  ): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>((resolve, reject) => {
      const added = this.failedQueue.add({ resolve, reject, config }, priority);
      if (!added) {
        reject(new Error("Request queue is full"));
      }
    });
  }

  private async processQueue(error: AxiosError | null) {
    while (!this.failedQueue.isEmpty()) {
      const item = this.failedQueue.getNext();
      if (!item) continue;

      if (error) {
        item.reject(error);
      } else {
        try {
          const retryConfig: ExtendedAxiosRequestConfig = {
            ...item.config,
            _retry: true,
          };

          const response = await api(retryConfig);
          item.resolve(response);
        } catch (err) {
          item.reject(err);
        }
      }
    }
  }

  private async refreshToken(): Promise<AxiosResponse> {
    if (this.isRefreshing && this.refreshCall) {
      return this.refreshCall;
    }

    this.isRefreshing = true;
    this.abortController = new AbortController();

    this.refreshCall = this.circuitBreaker.call(() =>
      exponentialBackoff(
        () =>
          api.post("/refresh", null, {
            signal: this.abortController.signal,
          }),
        this.config.maxRetries,
        this.config.baseDelay
      )
    );

    try {
      const result = await this.refreshCall;
      await this.processQueue(null);
      this.lastRefreshTime = Date.now();
      this.bc?.postMessage("TOKEN_REFRESHED");
      return result;
    } catch (error) {
      await this.processQueue(error as AxiosError);
      const err = error as AxiosError;
      if (err.response?.status === 401) {
        this.handleCriticalAuthFailure(err);
      }
      throw error;
    } finally {
      this.isRefreshing = false;
      this.refreshCall = null;
    }
  }

  async handleError(error: AxiosError): Promise<AxiosResponse> {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (!originalRequest || !this.shouldIntercept(originalRequest.url)) {
      return Promise.reject(error);
    }

    // Если это ошибка аутентификации и мы еще не пытались обновить токен
    if (this.isAuthError(error) && !originalRequest._retry) {
      if (this.isRefreshing) {
        // Используем приоритет из конфига или по умолчанию
        const priority = originalRequest._priority || "normal";
        return this.addToQueue(originalRequest, priority);
      }

      try {
        await this.refreshToken();
        // Повторяем оригинальный запрос с флагом _retry
        const retryConfig: ExtendedAxiosRequestConfig = {
          ...originalRequest,
          _retry: true,
        };
        return api(retryConfig);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }

  private async refreshTokenSilently() {
    if (
      this.isRefreshing ||
      !this.lastRefreshTime ||
      Date.now() - this.lastRefreshTime < this.config.silentRefreshInterval
    ) {
      return;
    }

    try {
      await this.refreshToken();
    } catch (e) {
      console.debug("Silent refresh failed", e);
    }
  }

  private startTokenMonitor() {
    if (this.tokenMonitorInterval || !this.isClient) return;

    this.tokenMonitorInterval = window.setInterval(() => {
      this.refreshTokenSilently();
    }, this.config.silentRefreshInterval);
  }

  private stopTokenMonitor() {
    if (this.tokenMonitorInterval) {
      clearInterval(this.tokenMonitorInterval);
      this.tokenMonitorInterval = null;
    }
  }

  private setupVisibilityHandler() {
    if (!this.isClient) return;

    let hiddenTime: number | null = null;
    const MAX_IDLE_MS = 5 * 60 * 1000;

    this.visibilityHandler = () => {
      if (document.visibilityState === "hidden") {
        hiddenTime = Date.now();
      } else if (hiddenTime && Date.now() - hiddenTime >= MAX_IDLE_MS) {
        this.refreshTokenSilently();
        hiddenTime = null;
      }
    };

    document.addEventListener("visibilitychange", this.visibilityHandler);
  }

  private removeVisibilityHandler() {
    if (this.visibilityHandler && this.isClient) {
      document.removeEventListener("visibilitychange", this.visibilityHandler);
      this.visibilityHandler = null;
    }
    this.bc?.close();
  }

  private handleCriticalAuthFailure(error: AxiosError) {
    if (!this.isClient) return;

    localStorage.clear();
    sessionStorage.clear();

    const redirect = encodeURIComponent(
      window.location.pathname + window.location.search
    );

    setTimeout(() => {
      window.location.href = `/?session_expired=true&redirect=${redirect}`;
    }, 500);
  }

  init() {
    this.startTokenMonitor();
    this.setupVisibilityHandler();
  }

  destroy() {
    this.abortController.abort();
    this.stopTokenMonitor();
    this.failedQueue.clear();
    this.removeVisibilityHandler();
  }

  getQueueSize(): number {
    return this.failedQueue.getSize();
  }

  clearQueue() {
    this.failedQueue.clear();
  }

  async forceRefresh(): Promise<AxiosResponse> {
    this.lastRefreshTime = null;
    return this.refreshToken();
  }
}

// ---------------- Interceptors ----------------
const tokenManager = new EnterpriseTokenManager();

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    try {
      const result = await tokenManager.handleError(error);
      return result;
    } catch (err) {
      const e = err as AxiosError;

      if (
        shouldRetryRequest(e) &&
        e.config &&
        !(e.config as ExtendedAxiosRequestConfig)._retry
      ) {
        const retryConfig: ExtendedAxiosRequestConfig = {
          ...e.config,
          _retry: true,
        };

        return retryRequest(() => api(retryConfig), 3);
      }

      return Promise.reject(e);
    }
  }
);

if (typeof window !== "undefined") {
  tokenManager.init();
}

export default api;
export { tokenManager, EnterpriseTokenManager };
export type { TokenManagerConfig, ExtendedAxiosRequestConfig };
