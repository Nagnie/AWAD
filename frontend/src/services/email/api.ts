/**
 * Email Operations API using RTK Query
 * Handle modify, delete, star, archive, etc.
 */

import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { AxiosError } from "axios";
import { apiClient } from "@/services/core/api-client";
import type { ApiResponse } from "@/services/core/types";
import type {
    DeleteBatchEmailDto,
    BatchModifyEmailDto,
    ModifyEmailDto,
    BatchOperationResponse,
} from "./types";
import type { EmailMessage } from "../mailboxes/types";

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

export const emailApi = createApi({
    reducerPath: "emailApi",
    baseQuery: axiosBaseQuery,
    tagTypes: ["Email", "Emails"],
    endpoints: (builder) => ({
        // Delete multiple emails at once
        batchDeleteEmails: builder.mutation<BatchOperationResponse, DeleteBatchEmailDto>({
            query: (deleteBatchEmailDto) => ({
                url: "/api/v1/emails/batch-delete",
                method: "DELETE",
                data: deleteBatchEmailDto,
            }),
            transformResponse: (response: ApiResponse<BatchOperationResponse>) =>
                response.data || { success: false },
            invalidatesTags: ["Emails"],
        }),

        // Delete a single email
        deleteEmail: builder.mutation<BatchOperationResponse, string>({
            query: (emailId) => ({
                url: `/api/v1/emails/${emailId}`,
                method: "DELETE",
            }),
            transformResponse: (response: ApiResponse<BatchOperationResponse>) =>
                response.data || { success: false },
            invalidatesTags: ["Emails"],
        }),

        // Modify a single email (add/remove labels)
        modifyEmail: builder.mutation<EmailMessage, { emailId: string; modifyDto: ModifyEmailDto }>(
            {
                query: ({ emailId, modifyDto }) => ({
                    url: `/api/v1/emails/${emailId}/modify`,
                    method: "POST",
                    data: modifyDto,
                }),
                transformResponse: (response: ApiResponse<EmailMessage>) =>
                    response.data || ({} as EmailMessage),
                invalidatesTags: (_result, _error, { emailId }) => [
                    { type: "Email", id: emailId },
                    "Emails",
                ],
            }
        ), // Batch modify multiple emails
        batchModifyEmails: builder.mutation<BatchOperationResponse, BatchModifyEmailDto>({
            query: (batchModifyDto) => ({
                url: "/api/v1/emails/batch-modify",
                method: "POST",
                data: batchModifyDto,
            }),
            transformResponse: (response: ApiResponse<BatchOperationResponse>) =>
                response.data || { success: false },
            invalidatesTags: ["Emails"],
        }),

        // Mark email as read
        markAsRead: builder.mutation<EmailMessage, string>({
            query: (emailId) => ({
                url: `/api/v1/emails/${emailId}/mark-as-read`,
                method: "POST",
            }),
            transformResponse: (response: ApiResponse<EmailMessage>) =>
                response.data || ({} as EmailMessage),
            invalidatesTags: ["Emails"],
        }),

        // Mark email as unread
        markAsUnread: builder.mutation<EmailMessage, string>({
            query: (emailId) => ({
                url: `/api/v1/emails/${emailId}/mark-as-unread`,
                method: "POST",
            }),
            transformResponse: (response: ApiResponse<EmailMessage>) =>
                response.data || ({} as EmailMessage),
            invalidatesTags: ["Emails"],
        }),

        // Star an email
        starEmail: builder.mutation<EmailMessage, string>({
            query: (emailId) => ({
                url: `/api/v1/emails/${emailId}/star`,
                method: "POST",
            }),
            transformResponse: (response: ApiResponse<EmailMessage>) =>
                response.data || ({} as EmailMessage),
            invalidatesTags: ["Emails"],
        }),

        // Unstar an email
        unstarEmail: builder.mutation<EmailMessage, string>({
            query: (emailId) => ({
                url: `/api/v1/emails/${emailId}/unstar`,
                method: "POST",
            }),
            transformResponse: (response: ApiResponse<EmailMessage>) =>
                response.data || ({} as EmailMessage),
            invalidatesTags: ["Emails"],
        }),

        // Move email to trash
        moveToTrash: builder.mutation<EmailMessage, string>({
            query: (emailId) => ({
                url: `/api/v1/emails/${emailId}/move-to-trash`,
                method: "POST",
            }),
            transformResponse: (response: ApiResponse<EmailMessage>) =>
                response.data || ({} as EmailMessage),
            invalidatesTags: (_result, _error, emailId) => [
                { type: "Email", id: emailId },
                "Emails",
            ],
        }),

        // Move email back to inbox
        moveToInbox: builder.mutation<EmailMessage, string>({
            query: (emailId) => ({
                url: `/api/v1/emails/${emailId}/move-to-inbox`,
                method: "POST",
            }),
            transformResponse: (response: ApiResponse<EmailMessage>) =>
                response.data || ({} as EmailMessage),
            invalidatesTags: (_result, _error, emailId) => [
                { type: "Email", id: emailId },
                "Emails",
            ],
        }),

        // Archive an email
        archiveEmail: builder.mutation<EmailMessage, string>({
            query: (emailId) => ({
                url: `/api/v1/emails/${emailId}/archive`,
                method: "POST",
            }),
            transformResponse: (response: ApiResponse<EmailMessage>) =>
                response.data || ({} as EmailMessage),
            invalidatesTags: (_result, _error, emailId) => [
                { type: "Email", id: emailId },
                "Emails",
            ],
        }),

        // Restore email from trash
        untrashEmail: builder.mutation<EmailMessage, string>({
            query: (emailId) => ({
                url: `/api/v1/emails/${emailId}/untrash`,
                method: "POST",
            }),
            transformResponse: (response: ApiResponse<EmailMessage>) =>
                response.data || ({} as EmailMessage),
            invalidatesTags: (_result, _error, emailId) => [
                { type: "Email", id: emailId },
                "Emails",
            ],
        }),
    }),
});

export const {
    useBatchDeleteEmailsMutation,
    useDeleteEmailMutation,
    useModifyEmailMutation,
    useBatchModifyEmailsMutation,
    useMarkAsReadMutation,
    useMarkAsUnreadMutation,
    useStarEmailMutation,
    useUnstarEmailMutation,
    useMoveToTrashMutation,
    useMoveToInboxMutation,
    useArchiveEmailMutation,
    useUntrashEmailMutation,
} = emailApi;
