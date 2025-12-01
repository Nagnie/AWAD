// Core
export { api, apiClient } from "./core";
export type { ApiResponse } from "./core";

// Auth
export { authApi } from "./auth";
export type {
    GoogleLoginRequest,
    GoogleLoginResponse,
    RefreshTokenResponse,
    LogoutResponse,
    AuthUser,
} from "./auth";

// Mail
export { mailApi } from "./mail";
export type { Email, Mailbox, Folder, EmailsResponse } from "./mail";

// Mailboxes
export { useGetMailboxesQuery, useGetMailboxEmailsQuery } from "./mailboxes";
export type { Mailbox as MailboxData, EmailMessage, EmailHeader, EmailsData } from "./mailboxes";
