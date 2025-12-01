import { useGetMailboxesQuery } from "@/services/tanstack-query";

/**
 * Hook để lấy mailboxes data
 * Replaces RTK Query useMailboxes hook
 */
export const useMailboxes = () => {
    const { data = [], isPending, isError, error, refetch } = useGetMailboxesQuery();

    return {
        mailboxes: data,
        isLoading: isPending,
        error: isError ? error?.message : null,
        refetch,
    };
};
