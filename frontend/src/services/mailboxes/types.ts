export interface Mailbox {
    id: string;
    name: string;
    messageListVisibility?: "hide" | "show";
    labelListVisibility?: "labelHide" | "labelShow";
    type: "system" | "user";
    messagesTotal: number;
    messagesUnread: number;
    threadsTotal: number;
    threadsUnread: number;
}

export interface EmailHeader {
    subject: string;
    from: string;
    to: string;
    date: string;
}

export interface EmailMessage {
    id: string;
    threadId: string;
    labelIds: string[];
    snippet: string;
    sizeEstimate: number;
    historyId: string;
    internalDate: string;
    header: EmailHeader;
    isUnread: boolean;
    isStarred: boolean;
    isImportant: boolean;
    messageCount?: number;
    participantEmails?: string;
}

export interface EmailsData {
    nextPageToken?: string;
    resultSizeEstimate: number;
    emails: EmailMessage[];
}
