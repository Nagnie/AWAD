import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { mailboxesKeys } from "@/services/mailboxes/queryKeys";
import type { ModifyEmailDto } from "./types";
import type { EmailMessage, EmailsData } from "@/services/mailboxes/types";
import {
    markEmailAsRead,
    markEmailAsUnread,
    starEmail,
    unstarEmail,
    deleteEmail,
    batchDeleteEmails,
    modifyEmail,
    batchModifyEmails,
} from "./api";

// Helper type for update function
type EmailsDataOrInfinite = EmailsData | InfiniteData<EmailsData, string | undefined>;

const updateEmailInCache = (
    oldData: EmailsDataOrInfinite | undefined,
    emailId: string,
    updateFn: (email: EmailMessage) => EmailMessage
): EmailsDataOrInfinite | undefined => {
    if (!oldData) return oldData;

    // Handle infinite query
    if ("pages" in oldData) {
        return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
                ...page,
                emails: page.emails.map((e: EmailMessage) => (e.id === emailId ? updateFn(e) : e)),
            })),
        };
    }

    // Handle regular query
    if ("emails" in oldData) {
        return {
            ...oldData,
            emails: oldData.emails.map((e: EmailMessage) => (e.id === emailId ? updateFn(e) : e)),
        };
    }

    return oldData;
};

// Mutation: Mark email as read
export const useMarkAsReadMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markEmailAsRead,
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
        mutationFn: markEmailAsUnread,
        onMutate: async (emailId: string) => {
            // Cancel ongoing queries
            await queryClient.cancelQueries({ queryKey: mailboxesKeys.emails() });

            // Snapshot old data
            const previousData = queryClient.getQueriesData({
                queryKey: mailboxesKeys.emails(),
            });

            // Optimistic update - update all email queries
            queryClient.setQueriesData(
                { queryKey: mailboxesKeys.emails() },
                (oldData: EmailsDataOrInfinite | undefined) => {
                    return updateEmailInCache(oldData, emailId, (e) => ({
                        ...e,
                        isUnread: true,
                    }));
                }
            );

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
        mutationFn: starEmail,
        onMutate: async (emailId: string) => {
            await queryClient.cancelQueries({ queryKey: mailboxesKeys.emails() });

            const previousData = queryClient.getQueriesData({
                queryKey: mailboxesKeys.emails(),
            });

            queryClient.setQueriesData(
                { queryKey: mailboxesKeys.emails() },
                (oldData: EmailsDataOrInfinite | undefined) => {
                    return updateEmailInCache(oldData, emailId, (e) => ({
                        ...e,
                        isStarred: true,
                    }));
                }
            );

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
        mutationFn: unstarEmail,
        onMutate: async (emailId: string) => {
            await queryClient.cancelQueries({ queryKey: mailboxesKeys.emails() });

            const previousData = queryClient.getQueriesData({
                queryKey: mailboxesKeys.emails(),
            });

            queryClient.setQueriesData(
                { queryKey: mailboxesKeys.emails() },
                (oldData: EmailsDataOrInfinite | undefined) => {
                    return updateEmailInCache(oldData, emailId, (e) => ({
                        ...e,
                        isStarred: false,
                    }));
                }
            );

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
        mutationFn: deleteEmail,
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
        mutationFn: batchDeleteEmails,
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
        mutationFn: ({ emailId, modifyDto }: { emailId: string; modifyDto: ModifyEmailDto }) =>
            modifyEmail(emailId, modifyDto),
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
        mutationFn: batchModifyEmails,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.emails() });
            queryClient.invalidateQueries({ queryKey: mailboxesKeys.threads() });
        },
    });
};
