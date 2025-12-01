import { useQuery, useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { apiClient } from "@/services/core/api-client";
import type { ApiResponse } from "@/services/core/types";
import type { Mailbox, EmailsData, ThreadDetail } from "@/services/mailboxes/types";

const mailboxesKeys = {
    all: ["mailboxes"] as const,
    lists: () => [...mailboxesKeys.all, "list"] as const,
    list: () => [...mailboxesKeys.lists()] as const,
    emails: () => [...mailboxesKeys.all, "emails"] as const,
    emailsList: (labelId: string, q?: string) =>
        [...mailboxesKeys.emails(), { labelId, q }] as const,
    threads: () => [...mailboxesKeys.all, "threads"] as const,
    thread: (threadId: string) => [...mailboxesKeys.threads(), threadId] as const,
};

// Query: Get all mailboxes
export const useGetMailboxesQuery = () => {
    return useQuery({
        queryKey: mailboxesKeys.list(),
        queryFn: async () => {
            const client = apiClient.getClient();
            const response = await client.get<ApiResponse<Mailbox[]>>("/api/v1/mailboxes");
            return response.data.data || [];
        },
    });
};

// Query: Get emails from mailbox with pagination
export const useGetMailboxEmailsQuery = (labelId: string, q?: string) => {
    return useQuery({
        queryKey: mailboxesKeys.emailsList(labelId, q),
        queryFn: async () => {
            const client = apiClient.getClient();
            const response = await client.get<ApiResponse<EmailsData>>(
                `/api/v1/mailboxes/${labelId}/emails`,
                {
                    params: {
                        ...(q && { q }),
                    },
                }
            );
            return response.data.data || { emails: [], resultSizeEstimate: 0 };
        },
        enabled: !!labelId,
    });
};

// Infinite Query: Get emails with infinite scroll
export const useInfiniteQueryGetMailboxEmails = (labelId: string, q?: string) => {
    return useInfiniteQuery<
        EmailsData,
        Error,
        InfiniteData<EmailsData, string | undefined>,
        readonly [
            "mailboxes",
            "emails",
            { readonly labelId: string; readonly q: string | undefined }
        ],
        string | undefined
    >({
        queryKey: mailboxesKeys.emailsList(labelId, q),
        queryFn: async ({ pageParam }) => {
            const client = apiClient.getClient();
            const response = await client.get<ApiResponse<EmailsData>>(
                `/api/v1/mailboxes/${labelId}/emails`,
                {
                    params: {
                        ...(q && { q }),
                        ...(pageParam && { pageToken: pageParam }),
                    },
                }
            );
            return response.data.data || { emails: [], resultSizeEstimate: 0 };
        },
        getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
        initialPageParam: undefined,
        enabled: !!labelId,
    });
};

// Query: Get thread details
export const useGetThreadDetailQuery = (threadId: string, enabled = true) => {
    return useQuery({
        queryKey: mailboxesKeys.thread(threadId),
        queryFn: async () => {
            const client = apiClient.getClient();
            const response = await client.get<ApiResponse<ThreadDetail>>(
                `/api/v1/threads/${threadId}`
            );
            return response.data.data || { id: "", snippet: "", historyId: "", messages: [] };
        },
        enabled: enabled && !!threadId,
    });
};

export { mailboxesKeys };
