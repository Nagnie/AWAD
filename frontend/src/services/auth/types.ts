export interface GoogleLoginRequest {
    code: string;
}

export interface AuthUser {
    email: string;
    name: string;
}

export interface GoogleLoginResponse {
    accessToken: string;
    user: AuthUser;
}

export interface RefreshTokenResponse {
    accessToken: string;
}

export interface LogoutResponse {
    message: string;
}
