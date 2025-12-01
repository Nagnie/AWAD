export {
    useGetMailboxesQuery,
    useGetMailboxEmailsQuery,
    useInfiniteQueryGetMailboxEmails,
    useGetThreadDetailQuery,
} from "./useMailboxesQueries";
export { fetchMailboxes, fetchMailboxEmails, fetchThreadDetail } from "./api";
export type { Mailbox, EmailMessage, EmailHeader, EmailsData, ThreadDetail } from "./types";
