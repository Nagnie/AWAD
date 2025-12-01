import { useCallback } from "react";
import { mailboxesApi } from "@/services/mailboxes";
import type { EmailMessage, EmailsData } from "@/services/mailboxes/types";

interface UseMailboxEmailsInfiniteProps {
    labelId: string;
    q?: string;
}

export function useMailboxEmailsInfinite({ labelId, q }: UseMailboxEmailsInfiniteProps) {
    // RTK Query tự động handle caching dựa trên labelId và q
    const { data, isLoading, isFetching, error, hasNextPage, fetchNextPage, refetch } =
        mailboxesApi.useInfiniteQueryGetMailboxEmailsInfiniteQuery(
            { labelId, q },
            {
                refetchOnMountOrArgChange: false,
                refetchOnFocus: false,
            }
        );

    // Accumulate emails from all pages - RTK Query already handles this via merge()
    const emails: EmailMessage[] = data?.pages?.flatMap((page: EmailsData) => page.emails) || [];

    const loadNextPage = useCallback(() => {
        if (hasNextPage && !isFetching) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetching, fetchNextPage]);

    const resetPagination = useCallback(() => {
        refetch();
    }, [refetch]);

    return {
        emails,
        isLoading,
        isFetching,
        error,
        hasNextPage: !!hasNextPage,
        loadNextPage,
        resetPagination,
        refetch,
    };
}
