import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { AxiosError } from "axios";
import { apiClient } from "@/services/core/api-client";
import type { ApiResponse } from "@/services/core/types";
import type { Mailbox, EmailsData, ThreadDetail } from "./types";

const axiosBaseQuery: BaseQueryFn<
    {
        url: string;
        method?: string;
        data?: unknown;
        params?: unknown;
    },
    unknown,
    AxiosError | { status?: number; message: string; data?: unknown }
> = async ({ url, method = "GET", data, params }) => {
    try {
        const client = apiClient.getClient();
        const result = await client({
            url,
            method,
            data,
            params,
        });
        return { data: result.data };
    } catch (axiosError) {
        const err = axiosError as AxiosError;
        return {
            error: {
                status: err.response?.status,
                message: err.message || "An unknown error occurred",
                data: err.response?.data,
            },
        };
    }
};

export const mailboxesApi = createApi({
    reducerPath: "mailboxesApi",
    baseQuery: axiosBaseQuery,
    tagTypes: ["Mailboxes", "Emails", "Thread"],
    endpoints: (builder) => ({
        // Get all mailboxes
        getMailboxes: builder.query<Mailbox[], void>({
            query: () => ({
                url: "/api/v1/mailboxes",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<Mailbox[]>) => response.data || [],
            providesTags: ["Mailboxes"],
            // Cache strategy
            keepUnusedDataFor: 5 * 60, // 5 minutes
        }),

        // Get emails from mailbox with pagination support (legacy - for backward compatibility)
        getMailboxEmails: builder.query<
            EmailsData,
            { labelId: string; q?: string; pageToken?: string }
        >({
            query: ({ labelId, q, pageToken }) => ({
                url: `/api/v1/mailboxes/${labelId}/emails`,
                method: "GET",
                params: {
                    ...(q && { q }),
                    ...(pageToken && { pageToken }),
                },
            }),
            transformResponse: (response: ApiResponse<EmailsData>) =>
                response.data || { emails: [], resultSizeEstimate: 0 },
            providesTags: (_result, _error, { labelId }) => [{ type: "Emails", id: labelId }],
            keepUnusedDataFor: 5 * 60, // 5 minutes
        }),

        // Infinite query for emails - optimized for infinite scroll
        // Generics: <ResultType, QueryArg, PageParam>
        infiniteQueryGetMailboxEmails: builder.infiniteQuery<
            EmailsData,
            { labelId: string; q?: string },
            string | undefined
        >({
            infiniteQueryOptions: {
                initialPageParam: undefined,
                getNextPageParam: (lastPage) => lastPage.nextPageToken,
            },
            query: ({ queryArg, pageParam }) => ({
                url: `/api/v1/mailboxes/${queryArg.labelId}/emails`,
                method: "GET",
                params: {
                    ...(queryArg.q && { q: queryArg.q }),
                    ...(pageParam && { pageToken: pageParam }),
                },
            }),
            transformResponse: (response: ApiResponse<EmailsData>) =>
                response.data || { emails: [], resultSizeEstimate: 0 },
            providesTags: (_result, _error, { labelId }) => [{ type: "Emails", id: labelId }],
            // Cache strategy for infinite queries
            keepUnusedDataFor: 5 * 60, // 5 minutes - prevents re-fetching when switching mailboxes
        }),

        // Get thread details with all messages
        getThreadDetail: builder.query<ThreadDetail, string>({
            query: (threadId) => ({
                url: `/api/v1/threads/${threadId}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<ThreadDetail>) =>
                response.data || { id: "", snippet: "", historyId: "", messages: [] },
            providesTags: (_result, _error, threadId) => [{ type: "Thread", id: threadId }],
            keepUnusedDataFor: 5 * 60, // 5 minutes
        }),
    }),
});

export const { useGetMailboxesQuery, useGetMailboxEmailsQuery, useGetThreadDetailQuery } =
    mailboxesApi;
