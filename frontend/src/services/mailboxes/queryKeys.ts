export const mailboxesKeys = {
    all: ["mailboxes"] as const,
    lists: () => [...mailboxesKeys.all, "list"] as const,
    list: () => [...mailboxesKeys.lists()] as const,
    emails: () => [...mailboxesKeys.all, "emails"] as const,
    emailsList: (labelId: string, q?: string) =>
        [...mailboxesKeys.emails(), { labelId, q }] as const,
    threads: () => [...mailboxesKeys.all, "threads"] as const,
    thread: (threadId: string) => [...mailboxesKeys.threads(), threadId] as const,
};
