import { api } from "./client";
import type { components } from "@/types/api";

export type LoginRequest = components["schemas"]["handler.loginRequest"];
export type LoginResponse = components["schemas"]["handler.LoginResponse"];

export const authApi = {
  login: (body: LoginRequest) =>
    api.post<LoginResponse>("/auth/login", body),
};
