import api from "../interceptor/api";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { User } from "../types/types";
import type { RegisterForm } from "../types/types";
import type { LoginForm } from "../types/types";
import type { UserResponseMe } from "../types/user";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Record<string, string> | null;
  success: boolean;
  isAuth: boolean;
  otpSend: boolean;
  tempRegisterData: RegisterForm | null;
  authCheck: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuth: false,
  success: false,
  otpSend: false,
  tempRegisterData: null,
  authCheck: false,
};

//* Auth Me - проверка авторизации
export const authMe = createAsyncThunk<
  User,
  void,
  { rejectValue: Record<string, string> }
>("auth/me", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<User>("/auth/me");
    console.log("Данные Me", response.data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.errors || "Не авторизован");
  }
});

//* Otp Reigster */
export const sendOtp = createAsyncThunk<
  void,
  RegisterForm,
  { rejectValue: Record<string, string> }
>("auth/sendOtp", async (formRegister, { rejectWithValue, dispatch }) => {
  try {
    console.log("redux ", formRegister);
    dispatch(saveTempRegisterData(formRegister));
    console.log("redux ", formRegister);
    const response = await api.post("/auth/request-otp", formRegister);
  } catch (err: any) {
    dispatch(clearTempRegisterData());
    return rejectWithValue(err.response?.data?.errors || "Ошибка отп");
  }
});

//* Reigster */
export const confirmOtpAndRegister = createAsyncThunk<
  User,
  { otpCode: string },
  { rejectValue: Record<string, string>; state: { auth: AuthState } }
>(
  "auth/confirmOtpAndRegister",
  async ({ otpCode }, { getState, rejectWithValue }) => {
    const tempData = getState().auth.tempRegisterData;
    if (!tempData) {
      return rejectWithValue({ general: "Нет данных для регистрации" });
    }
    try {
      const response = await api.post("/auth/register", {
        ...tempData,
        otpCode,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.errors || { general: "Ошибка регистрации" }
      );
    }
  }
);
//* Login */
export const login = createAsyncThunk<
  User,
  LoginForm,
  { rejectValue: Record<string, string> }
>("auth/login", async (formLogin, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", formLogin);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.errors || { general: "Ошибка регистрации" }
    );
  }
});

//* Forgot Password */
export const forgotPassword = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: Record<string, string> }
>("auth/forgotPassword", async ({ email }, { rejectWithValue }) => {
  if (!email) {
    return rejectWithValue({ email: "Email обязателен" });
  }

  try {
    await api.post("/auth/forgot-password", { email });
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.errors || { general: "Ошибка отправки email" }
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.otpSend = false;
      state.tempRegisterData = null;
    },
    saveTempRegisterData: (state, action: PayloadAction<RegisterForm>) => {
      state.tempRegisterData = action.payload;
    },
    clearTempRegisterData: (state) => {
      state.tempRegisterData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //* Reigster */
      .addCase(confirmOtpAndRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(confirmOtpAndRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.error = null;
        state.success = true;
      })
      .addCase(confirmOtpAndRegister.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload ?? { general: "Ошибка регистрации" };
      })

      //* Otp Reigster */
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpSend = false;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSend = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? { general: "Ошибка отправки Otp " };
      })

      //* Login */
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.success = true;
        state.error = null;
        state.tempRegisterData = null;
        state.otpSend = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload ?? { general: "Ошибка входа" };
      })

      //* Forgot Password */
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload ?? { general: "Ошибка сброса пароля" };
      })

      .addCase(authMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.authCheck = true;
      })
      .addCase(authMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuth = false;
        state.authCheck = true;
        state.error = action.payload ?? {
          general: "Ошибка обновления страницы",
        };
      });
  },
});
export default authSlice.reducer;
export const {
  clearError,
  logout,
  saveTempRegisterData,
  clearTempRegisterData,
} = authSlice.actions;
