import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/core/api-client";
import type { ApiResponse } from "@/services/core/types";
import type {
    DeleteBatchEmailDto,
    BatchModifyEmailDto,
    ModifyEmailDto,
    BatchOperationResponse,
} from "@/services/email/types";
import type { EmailMessage } from "@/services/mailboxes/types";
import { mailboxesKeys } from "./useMailboxesQueries";

// Mutation: Mark email as read
export const useMarkAsReadMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (emailId: string) => {
            const client = apiClient.getClient();
            const response = await client.post<ApiResponse<EmailMessage>>(
                `/api/v1/emails/${emailId}/mark-as-read`
            );
            return response.data.data || ({} as EmailMessage);
        },
        onSuccess: () => {
            // Invalidate all email queries
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.emails() });
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.threads() });
        },
    });
};

// Mutation: Mark email as unread
export const useMarkAsUnreadMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (emailId: string) => {
            const client = apiClient.getClient();
            const response = await client.post<ApiResponse<EmailMessage>>(
                `/api/v1/emails/${emailId}/mark-as-unread`
            );
            return response.data.data || ({} as EmailMessage);
        },
        onMutate: async (emailId: string) => {
            // Cancel ongoing queries
            await queryClient.cancelQueries({ queryKey: mailboxesKeys.emails() });

            // Snapshot old data
            const previousData = queryClient.getQueriesData({
                queryKey: mailboxesKeys.emails(),
            });

            // Optimistic update - update all email queries
            queryClient.setQueriesData({ queryKey: mailboxesKeys.emails() }, (oldData: any) => {
                if (!oldData) return oldData;

                // Handle infinite query
                if (oldData.pages) {
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                            ...page,
                            emails: page.emails.map((e: EmailMessage) =>
                                e.id === emailId ? { ...e, isUnread: true } : e
                            ),
                        })),
                    };
                }

                // Handle regular query
                if (oldData.emails) {
                    return {
                        ...oldData,
                        emails: oldData.emails.map((e: EmailMessage) =>
                            e.id === emailId ? { ...e, isUnread: true } : e
                        ),
                    };
                }

                return oldData;
            });

            return { previousData };
        },
        onError: (_err, _variables, context) => {
            // Rollback on error
            if (context?.previousData) {
                context.previousData.forEach(([key, value]) => {
                    queryClient.setQueryData(key, value);
                });
            }
        },
        onSuccess: () => {
            // Refetch to sync with server
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.emails() });
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.threads() });
        },
    });
};

// Mutation: Star email
export const useStarEmailMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (emailId: string) => {
            const client = apiClient.getClient();
            const response = await client.post<ApiResponse<EmailMessage>>(
                `/api/v1/emails/${emailId}/star`
            );
            return response.data.data || ({} as EmailMessage);
        },
        onMutate: async (emailId: string) => {
            await queryClient.cancelQueries({ queryKey: mailboxesKeys.emails() });

            const previousData = queryClient.getQueriesData({
                queryKey: mailboxesKeys.emails(),
            });

            queryClient.setQueriesData({ queryKey: mailboxesKeys.emails() }, (oldData: any) => {
                if (!oldData) return oldData;

                if (oldData.pages) {
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                            ...page,
                            emails: page.emails.map((e: EmailMessage) =>
                                e.id === emailId ? { ...e, isStarred: true } : e
                            ),
                        })),
                    };
                }

                if (oldData.emails) {
                    return {
                        ...oldData,
                        emails: oldData.emails.map((e: EmailMessage) =>
                            e.id === emailId ? { ...e, isStarred: true } : e
                        ),
                    };
                }

                return oldData;
            });

            return { previousData };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousData) {
                context.previousData.forEach(([key, value]) => {
                    queryClient.setQueryData(key, value);
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.emails() });
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.threads() });
        },
    });
};

// Mutation: Unstar email
export const useUnstarEmailMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (emailId: string) => {
            const client = apiClient.getClient();
            const response = await client.post<ApiResponse<EmailMessage>>(
                `/api/v1/emails/${emailId}/unstar`
            );
            return response.data.data || ({} as EmailMessage);
        },
        onMutate: async (emailId: string) => {
            await queryClient.cancelQueries({ queryKey: mailboxesKeys.emails() });

            const previousData = queryClient.getQueriesData({
                queryKey: mailboxesKeys.emails(),
            });

            queryClient.setQueriesData({ queryKey: mailboxesKeys.emails() }, (oldData: any) => {
                if (!oldData) return oldData;

                if (oldData.pages) {
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                            ...page,
                            emails: page.emails.map((e: EmailMessage) =>
                                e.id === emailId ? { ...e, isStarred: false } : e
                            ),
                        })),
                    };
                }

                if (oldData.emails) {
                    return {
                        ...oldData,
                        emails: oldData.emails.map((e: EmailMessage) =>
                            e.id === emailId ? { ...e, isStarred: false } : e
                        ),
                    };
                }

                return oldData;
            });

            return { previousData };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousData) {
                context.previousData.forEach(([key, value]) => {
                    queryClient.setQueryData(key, value);
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.emails() });
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.threads() });
        },
    });
};

// Mutation: Delete email
export const useDeleteEmailMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (emailId: string) => {
            const client = apiClient.getClient();
            const response = await client.delete<ApiResponse<BatchOperationResponse>>(
                `/api/v1/emails/${emailId}`
            );
            return response.data.data || { success: false };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.emails() });
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.threads() });
        },
    });
};

// Mutation: Batch delete emails
export const useBatchDeleteEmailsMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dto: DeleteBatchEmailDto) => {
            const client = apiClient.getClient();
            const response = await client.delete<ApiResponse<BatchOperationResponse>>(
                "/api/v1/emails/batch-delete",
                { data: dto }
            );
            return response.data.data || { success: false };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.emails() });
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.threads() });
        },
    });
};

// Mutation: Modify email
export const useModifyEmailMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            emailId,
            modifyDto,
        }: {
            emailId: string;
            modifyDto: ModifyEmailDto;
        }) => {
            const client = apiClient.getClient();
            const response = await client.post<ApiResponse<EmailMessage>>(
                `/api/v1/emails/${emailId}/modify`,
                modifyDto
            );
            return response.data.data || ({} as EmailMessage);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.emails() });
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.threads() });
        },
    });
};

// Mutation: Batch modify emails
export const useBatchModifyEmailsMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dto: BatchModifyEmailDto) => {
            const client = apiClient.getClient();
            const response = await client.post<ApiResponse<BatchOperationResponse>>(
                "/api/v1/emails/batch-modify",
                dto
            );
            return response.data.data || { success: false };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.emails() });
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.threads() });
        },
    });
};
