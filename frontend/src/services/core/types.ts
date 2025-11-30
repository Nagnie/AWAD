/**
 * Shared API type definitions
 */

export interface ApiResponse<T> {
    status: "success" | "error";
    message: string;
    data: T | null;
    metadata?: {
        timestamp: string;
        path?: string;
        [key: string]: string | number | boolean | undefined;
    };
}
