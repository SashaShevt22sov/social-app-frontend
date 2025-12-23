export interface CreateServerRequest {
  serverName: string;
}
export interface CreateServerResponse {
  id: number;
  serverName: string;
  description?: string | null;
}
export interface ServerList {
  id: number;
  serverName: string;
}
