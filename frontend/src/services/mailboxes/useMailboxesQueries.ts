import { type InfiniteData, useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { fetchMailboxEmails, fetchMailboxes, fetchThreadDetail } from "./api";
import { mailboxesKeys } from "./queryKeys";

import type { EmailsData } from "./types";
// Query: Get all mailboxes
export const useGetMailboxesQuery = () => {
    return useQuery({
        queryKey: mailboxesKeys.list(),
        queryFn: fetchMailboxes,
    });
};

// Query: Get emails from mailbox with pagination
export const useGetMailboxEmailsQuery = (labelId: string, q?: string) => {
    return useQuery({
        queryKey: mailboxesKeys.emailsList(labelId, q),
        queryFn: () => fetchMailboxEmails(labelId, q),
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
        queryFn: ({ pageParam }) => fetchMailboxEmails(labelId, q, pageParam),
        getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
        initialPageParam: undefined,
        enabled: !!labelId,
    });
};

// Query: Get thread details
export const useGetThreadDetailQuery = (threadId: string, enabled = true) => {
    const isEnabled = enabled && !!threadId;
    return useQuery({
        queryKey: mailboxesKeys.thread(threadId),
        queryFn: () => fetchThreadDetail(threadId),
        enabled: isEnabled,
    });
};
