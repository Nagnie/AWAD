/**
 * Custom hook để fetch emails từ mailbox
 * Hỗ trợ infinite scroll pagination với pageToken
 * Accumulates emails từ các pages thay vì replace
 */

import { useGetMailboxEmailsQuery } from "@/services/mailboxes";
import { useCallback, useEffect, useState } from "react";
import type { EmailMessage } from "@/services/mailboxes";

interface UseMailboxEmailsOptions {
    labelId: string;
    q?: string;
}

export const useMailboxEmails = ({ labelId, q }: UseMailboxEmailsOptions) => {
    const [pageToken, setPageToken] = useState<string | undefined>(undefined);
    const [allEmails, setAllEmails] = useState<EmailMessage[]>([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const { data, isLoading, error, isFetching } = useGetMailboxEmailsQuery(
        { labelId, q, pageToken },
        { skip: !labelId }
    );

    // Khi labelId hoặc q thay đổi, reset pagination và emails
    useEffect(() => {
        setPageToken(undefined);
        setAllEmails([]);
        setIsFirstLoad(true);
    }, [labelId, q]);

    // Khi data thay đổi, accumulate emails
    useEffect(() => {
        if (data?.emails) {
            if (isFirstLoad) {
                // First load - replace dengan emails mới
                setAllEmails(data.emails);
                setIsFirstLoad(false);
            } else if (pageToken) {
                // Load next page - append emails
                setAllEmails((prev) => [...prev, ...data.emails]);
            }
        }
    }, [data?.emails, isFirstLoad, pageToken]);

    const loadNextPage = useCallback(() => {
        if (data?.nextPageToken) {
            setPageToken(data.nextPageToken);
        }
    }, [data?.nextPageToken]);

    const resetPagination = useCallback(() => {
        setPageToken(undefined);
        setAllEmails([]);
        setIsFirstLoad(true);
    }, []);

    return {
        emails: allEmails,
        nextPageToken: data?.nextPageToken,
        resultSizeEstimate: data?.resultSizeEstimate || 0,
        isLoading,
        isFetching,
        error,
        loadNextPage,
        resetPagination,
        hasNextPage: !!data?.nextPageToken,
    };
};
