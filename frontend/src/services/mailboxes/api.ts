import { apiClient } from "@/services/core/api-client";
import type { ApiResponse } from "@/services/core/types";
import type { Mailbox, EmailsData, ThreadDetail } from "./types";

/**
 * Get all mailboxes
 */
export const fetchMailboxes = async (): Promise<Mailbox[]> => {
    const client = apiClient.getClient();
    const response = await client.get<ApiResponse<Mailbox[]>>("/api/v1/mailboxes");
    return response.data.data || [];
};

/**
 * Get emails from mailbox with pagination support
 */
export const fetchMailboxEmails = async (
    labelId: string,
    q?: string,
    pageToken?: string
): Promise<EmailsData> => {
    const client = apiClient.getClient();
    const response = await client.get<ApiResponse<EmailsData>>(
        `/api/v1/mailboxes/${labelId}/emails`,
        {
            params: {
                ...(q && { q }),
                ...(pageToken && { pageToken }),
            },
        }
    );
    return response.data.data || { emails: [], resultSizeEstimate: 0 };
};

/**
 * Get thread details with all messages
 */
export const fetchThreadDetail = async (threadId: string): Promise<ThreadDetail> => {
    const client = apiClient.getClient();
    const response = await client.get<ApiResponse<ThreadDetail>>(`/api/v1/threads/${threadId}`);
    return response.data.data || { id: "", snippet: "", historyId: "", messages: [] };
};
