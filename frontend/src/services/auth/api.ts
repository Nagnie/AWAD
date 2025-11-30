/**
 * Auth API endpoints
 */

import api from "../core";
import type { ApiResponse } from "../core";
import type {
    GoogleLoginRequest,
    GoogleLoginResponse,
    RefreshTokenResponse,
    LogoutResponse,
} from "./types";

export const authApi = {
    /**
     * Google login với authorization code
     * POST /api/v1/auth/google-login
     */
    googleLogin: async (code: string, signal?: AbortSignal) => {
        const payload: GoogleLoginRequest = { code };
        const response = await api.post<ApiResponse<GoogleLoginResponse>>(
            "/api/v1/auth/google-login",
            payload,
            { signal }
        );
        return response.data;
    },

    /**
     * Refresh access token
     * POST /api/v1/auth/refresh
     * Refresh token được gửi trong cookie (withCredentials: true)
     */
    refreshToken: async (signal?: AbortSignal) => {
        const response = await api.post<ApiResponse<RefreshTokenResponse>>(
            "/api/v1/auth/refresh",
            {},
            { signal }
        );
        return response.data;
    },

    /**
     * Logout
     * POST /api/v1/auth/logout
     */
    logout: async (signal?: AbortSignal) => {
        const response = await api.post<ApiResponse<LogoutResponse>>(
            "/api/v1/auth/logout",
            {},
            { signal }
        );
        return response.data;
    },
};
