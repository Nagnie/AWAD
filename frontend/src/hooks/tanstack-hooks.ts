import {
    useGetMailboxesQuery,
    useInfiniteQueryGetMailboxEmails,
    useGetThreadDetailQuery,
} from "@/services/tanstack-query";

/**
 * Hook để lấy mailboxes data
 * Replaces RTK Query useMailboxes hook
 */
export const useMailboxesTanstack = () => {
    const { data = [], isPending, isError, error, refetch } = useGetMailboxesQuery();

    return {
        mailboxes: data,
        isLoading: isPending,
        error: isError ? error?.message : null,
        refetch,
    };
};

/**
 * Hook để lấy emails với infinite scroll
 * Replaces RTK Query useMailboxEmailsInfinite hook
 */
export const useMailboxEmailsInfiniteTanstack = ({
    labelId,
    q,
}: {
    labelId: string;
    q?: string;
}) => {
    const { data, hasNextPage, fetchNextPage, isFetching, isPending, error, isError } =
        useInfiniteQueryGetMailboxEmails(labelId, q);

    // Flatten pages into single array
    const emails = data?.pages.flatMap((page) => page.emails) || [];

    return {
        emails,
        isLoading: isPending,
        isFetching,
        error: isError ? error?.message : null,
        hasNextPage: hasNextPage ?? false,
        loadNextPage: fetchNextPage,
        resetPagination: () => {
            // TanStack Query handles this automatically on refetch
        },
        refetch: () => {
            // Refetch is built-in
        },
    };
};

/**
 * Hook để lấy thread detail
 */
export const useThreadDetailTanstack = (threadId: string) => {
    const { data, isPending, isError, error, refetch } = useGetThreadDetailQuery(
        threadId,
        !!threadId
    );

    return {
        threadDetail: data,
        isLoading: isPending,
        error: isError ? error?.message : null,
        refetch,
    };
};
