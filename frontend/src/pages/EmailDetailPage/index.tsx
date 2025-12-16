import { Archive, ChevronLeft, FileText, Loader2, Mail, Send, Star, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { EmailDetail } from "@/pages/Dashboard/components/EmailDetail";
import ComposeEmail from "@/pages/Dashboard/components/ComposeEmail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMailboxes } from "@/hooks/useMailboxes";
import { useThreadDetail } from "@/hooks/useThreadDetail";
import { formatMailboxName } from "@/lib/utils";
import { type Folder } from "@/services/mail";
import type { ThreadMessage } from "@/services/mailboxes/types";

const mailboxIcons: Record<string, React.ReactNode> = {
    inbox: <Mail className="w-4 h-4" />,
    starred: <Star className="w-4 h-4" />,
    sent: <Send className="w-4 h-4" />,
    drafts: <FileText className="w-4 h-4" />,
    archive: <Archive className="w-4 h-4" />,
    trash: <Trash className="w-4 h-4" />,
};

export default function EmailDetailPage() {
    const navigate = useNavigate();
    const { emailId } = useParams<{ emailId: string }>();
    const [searchParams] = useSearchParams();

    const from = searchParams.get("from"); // 'search' or 'dashboard'
    const searchQuery = searchParams.get("q");
    const folderId = searchParams.get("folder");

    const { mailboxes, isLoading: isLoadingMailboxes } = useMailboxes();
    const [folders, setFolders] = useState<Folder[]>([]);
    const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([]);
    const [composeMode, setComposeMode] = useState<
        "compose" | "reply" | "reply_all" | "forward" | null
    >(null);
    const [replyData, setReplyData] = useState<
        | {
              emailId: string;
              threadId: string;
              subject: string;
              from: string;
              to: string;
              cc?: string;
              body?: string;
          }
        | undefined
    >();

    // Get thread details - need to get threadId first from email
    const { threadDetail, isLoading: isLoadingThread } = useThreadDetail(emailId || "", !!emailId);

    useEffect(() => {
        if (threadDetail?.messages) {
            setThreadMessages(threadDetail.messages);
        }
    }, [threadDetail?.messages]);

    // Setup folders
    useEffect(() => {
        if (mailboxes && mailboxes.length > 0) {
            const foldersData: Folder[] = mailboxes
                .filter(
                    (mailbox) =>
                        !mailbox.id.startsWith("CATEGORY_") &&
                        !mailbox.id.startsWith("YELLOW_") &&
                        !mailbox.id.startsWith("CHAT") &&
                        !mailbox.id.startsWith("DRAFT")
                )
                .map((mailbox) => ({
                    id: mailbox.id,
                    name: formatMailboxName(mailbox.name),
                    icon: mailboxIcons[mailbox.id.toLowerCase()] || <Mail className="w-4 h-4" />,
                    count: mailbox.messagesUnread || 0,
                }));
            setFolders(foldersData);
        }
    }, [mailboxes]);

    const handleBack = () => {
        if (from === "search" && searchQuery) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        } else if (folderId) {
            navigate(`/dashboard?folder=${folderId}`);
        } else if (from === "kanban") {
            navigate("/kanban");
        } else {
            navigate("/dashboard");
        }
    };

    const handleFolderClick = (folderId: string) => {
        navigate(`/dashboard?folder=${folderId}`);
    };

    return (
        <div className="h-[calc(100vh-64px)] flex">
            {/* Column 1: Folders (No active state) */}
            <aside className="w-64 lg:w-1/5 border-r">
                <div className="h-full flex flex-col bg-sidebar">
                    <div className="p-4 border-b">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="w-full justify-start cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            {from === "search"
                                ? "Back to Search"
                                : from === "kanban"
                                ? "Back to Kanban"
                                : "Back to Dashboard"}
                        </Button>
                    </div>

                    <ScrollArea className="flex-1">
                        {isLoadingMailboxes ? (
                            <div className="p-4 flex flex-col items-center justify-center gap-2">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Loading mailboxes...
                                </p>
                            </div>
                        ) : (
                            <nav className="p-2">
                                {folders.map((folder) => (
                                    <Button
                                        variant="ghost"
                                        key={folder.id}
                                        onClick={() => handleFolderClick(folder.id)}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-left text-muted-foreground hover:bg-accent"
                                    >
                                        {folder.icon}
                                        <span className="flex-1">{folder.name}</span>
                                        {folder.count ? (
                                            <Badge variant="secondary" className="ml-auto">
                                                {folder.count}
                                            </Badge>
                                        ) : null}
                                    </Button>
                                ))}
                            </nav>
                        )}
                    </ScrollArea>
                </div>
            </aside>

            {/* Column 2: Email Detail */}
            <div className="flex-col flex-1 flex overflow-hidden">
                {composeMode ? (
                    <ComposeEmail
                        mode={composeMode}
                        onClose={() => {
                            setComposeMode(null);
                            setReplyData(undefined);
                        }}
                        replyTo={replyData}
                    />
                ) : isLoadingThread ? (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin opacity-50" />
                            <p className="text-lg">Loading email...</p>
                        </div>
                    </div>
                ) : threadMessages.length > 0 ? (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="px-4 py-3 border-b">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleBack}
                                    className="cursor-pointer lg:hidden"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <h1 className="text-lg font-semibold truncate flex-1">
                                    {threadMessages[0]?.headers.subject || "Email"}
                                </h1>
                                {threadMessages.length > 1 && (
                                    <Badge variant="secondary">
                                        {threadMessages.length} messages
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 overflow-hidden">
                            <div className="divide-y">
                                {threadMessages.map((message) => (
                                    <EmailDetail
                                        key={message.id}
                                        message={message}
                                        onReply={(data) => {
                                            setReplyData(data);
                                            setComposeMode("reply");
                                        }}
                                        onReplyAll={(data) => {
                                            setReplyData(data);
                                            setComposeMode("reply_all");
                                        }}
                                        onForward={(data) => {
                                            setReplyData(data);
                                            setComposeMode("forward");
                                        }}
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Email not found</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBack}
                                className="mt-4 cursor-pointer"
                            >
                                Go Back
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
