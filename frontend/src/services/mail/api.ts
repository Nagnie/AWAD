/**
 * Mail API endpoints
 */

import axios from "axios";
import type { Email, EmailsResponse, Mailbox } from "./types";

type RawPerson = { name?: string; email?: string };
type RawAttachment = { name?: string; fileName?: string; size?: string };
type RawEmail = {
    id?: number | string;
    mailboxId?: string;
    from?: RawPerson;
    to?: RawPerson[];
    cc?: RawPerson[] | string;
    subject?: string;
    preview?: string;
    body?: string;
    bodyHtml?: string;
    bodyText?: string;
    timestamp?: string;
    isRead?: boolean;
    isStarred?: boolean;
    attachments?: RawAttachment[];
};

const api = axios.create({
    baseURL: "http://localhost:4000",
    timeout: 5000,
});

function htmlToText(html: string | undefined) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
}

function mapRawToEmail(r: RawEmail): Email {
    const toList = (r.to || []).map((t) => `${t?.name ?? ""} <${t?.email ?? ""}>`).join(", ");
    const ccValue = Array.isArray(r.cc)
        ? (r.cc as RawPerson[])
              .map((t) => (t?.name && t?.email ? `${t.name} <${t.email}>` : ""))
              .filter(Boolean)
              .join(", ")
        : typeof r.cc === "string"
        ? r.cc
        : undefined;

    return {
        id: Number(r.id),
        from: `${r.from?.name ?? ""} <${r.from?.email ?? ""}>`,
        to: toList,
        cc: ccValue || undefined,
        subject: r.subject || "",
        preview: r.preview || "",
        body: htmlToText(r.bodyHtml) || r.body || r.bodyText || "",
        bodyHtml: r.bodyHtml || undefined,
        timestamp: r.timestamp || "",
        isRead: !!r.isRead,
        isStarred: !!r.isStarred,
        attachments:
            r.attachments?.map((a) => ({
                name: a.fileName || a.name || "file",
                size: a.size || "",
            })) || undefined,
    } as Email;
}

export const mailApi = {
    /**
     * Lấy danh sách mailboxes
     */
    getMailboxes: async (): Promise<Mailbox[]> => {
        try {
            const res = await api.get<Mailbox[]>("/mailboxes");
            return res.data;
        } catch (error) {
            const err = error as { message: string };
            console.error("Error fetching mailboxes:", err.message);
            throw new Error(`Failed to fetch mailboxes: ${err.message}`);
        }
    },

    /**
     * Lấy emails từ mailbox
     */
    getMailboxEmails: async (
        mailboxId: string,
        opts?: { offset?: number; limit?: number; q?: string }
    ): Promise<EmailsResponse> => {
        try {
            const params: Record<string, string | number | undefined> = {};
            const offset = Math.max(opts?.offset ?? 0, 0);
            const limit = Math.min(Math.max(opts?.limit ?? 20, 1), 100);
            params._start = offset;
            params._limit = limit;
            if (opts?.q && opts.q.trim()) {
                params.q = opts.q.trim();
            }

            // For "starred" mailbox, fetch all emails and filter by isStarred
            if (mailboxId === "starred") {
                const res = await api.get<RawEmail[]>(`/emails`, { params: { q: opts?.q } });
                const raw = Array.isArray(res.data) ? res.data : [];
                let items: Email[] = raw.map(mapRawToEmail);

                items = items.filter((e) => e.isStarred);
                const total = items.length;
                items = items.slice(offset, offset + limit);
                const hasMore = offset + limit < total;

                return { items, total, hasMore };
            }

            // For regular mailboxes
            const res = await api.get<RawEmail[]>(`/mailboxes/${mailboxId}/emails`, { params });
            const raw = Array.isArray(res.data) ? res.data : [];
            const items: Email[] = raw.map(mapRawToEmail);

            let total = parseInt(res.headers["x-total-count"] || String(items.length), 10);
            if (items.length < limit) {
                total = offset + items.length;
            }

            const hasMore = offset + limit < total;
            return { items, total, hasMore };
        } catch (error) {
            const err = error as { message: string };
            console.error(`Error fetching emails from mailbox ${mailboxId}:`, err.message);
            throw new Error(`Failed to fetch mailbox emails: ${err.message}`);
        }
    },

    /**
     * Lấy email theo ID
     */
    getEmailById: async (id: number): Promise<Email> => {
        try {
            const res = await api.get<RawEmail>(`/emails/${id}`);
            return mapRawToEmail(res.data);
        } catch (error) {
            const err = error as { message: string };
            console.error(`Error fetching email ${id}:`, err.message);
            throw new Error(`Failed to fetch email: ${err.message}`);
        }
    },

    /**
     * Lấy tất cả emails
     */
    getAllEmails: async (opts?: {
        offset?: number;
        limit?: number;
        q?: string;
    }): Promise<EmailsResponse> => {
        try {
            const params: Record<string, string | number | undefined> = {};
            const offset = Math.max(opts?.offset ?? 0, 0);
            const limit = Math.min(Math.max(opts?.limit ?? 100, 1), 100);
            params._start = offset;
            params._limit = limit;
            if (opts?.q && opts.q.trim()) {
                params.q = opts.q.trim();
            }

            const res = await api.get<RawEmail[]>(`/emails`, { params });
            const raw = Array.isArray(res.data) ? res.data : [];
            const items: Email[] = raw.map(mapRawToEmail);
            const total = parseInt(res.headers["x-total-count"] || String(items.length), 10);
            const hasMore = offset + limit < total;
            return { items, total, hasMore };
        } catch (error) {
            const err = error as { message: string };
            console.error("Error fetching all emails:", err.message);
            throw new Error(`Failed to fetch emails: ${err.message}`);
        }
    },

    /**
     * Update email status
     */
    updateEmail: async (
        id: number,
        updates: { isRead?: boolean; isStarred?: boolean }
    ): Promise<Email> => {
        try {
            const res = await api.patch<RawEmail>(`/emails/${id}`, updates);
            return mapRawToEmail(res.data);
        } catch (error) {
            const err = error as { message: string };
            console.error(`Error updating email ${id}:`, err.message);
            throw new Error(`Failed to update email: ${err.message}`);
        }
    },
};
