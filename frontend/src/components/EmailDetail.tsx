import { useRef, useState } from "react";
import {
    Reply,
    ReplyAll,
    Forward,
    Download,
    ChevronLeft,
    Star,
    Mail,
    Trash,
    FileText,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateLong } from "@/lib/utils";
import type { ThreadMessage } from "@/services/mailboxes/types";
import { useTheme } from "@/components/theme-provider";

interface EmailDetailProps {
    message: ThreadMessage | null;
    onBack?: () => void;
    onToggleStar?: (messageId: string) => void;
    onMarkAsUnread?: (messageId: string) => void;
    onDelete?: (messageId: string) => void;
}

export function EmailDetail({
    message,
    onBack,
    onToggleStar,
    onMarkAsUnread,
    onDelete,
}: EmailDetailProps) {
    const { theme } = useTheme();
    const [isIframeLoading, setIsIframeLoading] = useState(false);
    console.log("🚀 ~ EmailDetail ~ isIframeLoading:", isIframeLoading);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    if (!message) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Select an email to view details</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="pt-6 pb-4 px-8 shrink-0">
                <div className="flex items-center gap-2">
                    {onBack && (
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onBack}>
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    )}
                    <div className="flex gap-3 flex-wrap flex-1">
                        <Button variant="ghost" size="sm" className="cursor-pointer">
                            <Reply className="w-4 h-4 mr-1 text-mail-foreground" />
                            Reply
                        </Button>
                        <Button variant="ghost" size="sm" className="cursor-pointer">
                            <ReplyAll className="w-4 h-4 mr-1 text-mail-foreground" />
                            Reply All
                        </Button>
                        <Button variant="ghost" size="sm" className="cursor-pointer">
                            <Forward className="w-4 h-4 mr-1 text-mail-foreground" />
                            Forward
                        </Button>
                    </div>
                    {onToggleStar && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            onClick={() => onToggleStar(message.id)}
                        >
                            <Star
                                className={`w-5 h-5 ${
                                    message.isStarred ? "fill-yellow-400 text-yellow-400" : ""
                                }`}
                            />
                        </Button>
                    )}
                    {onMarkAsUnread && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            onClick={() => onMarkAsUnread(message.id)}
                        >
                            <Mail className="w-5 h-5" />
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            onClick={() => onDelete(message.id)}
                        >
                            <Trash className="w-5 h-5 text-red-500" />
                        </Button>
                    )}
                </div>
            </div>

            <ScrollArea className="flex-1 overflow-hidden">
                <div className="py-4 px-8">
                    <h1 className="text-2xl font-bold mb-4">{message.headers.subject}</h1>

                    <div className="space-y-2 mb-6 text-sm border-b pb-4">
                        <div className="flex gap-2">
                            <span className="text-muted-foreground w-16">From:</span>
                            <span>{message.headers.from}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-muted-foreground w-16">To:</span>
                            <span>{message.headers.to}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-muted-foreground w-16">Date:</span>
                            <span>{formatDateLong(message.headers.date)}</span>
                        </div>
                    </div>

                    {/* Display HTML content in iframe if available, fallback to plain text */}
                    {message.body.htmlBody ? (
                        <div className="overflow-hidden mb-6">
                            {isIframeLoading && (
                                <div className="flex items-center justify-center p-8 gap-2 text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Loading email content...</span>
                                </div>
                            )}
                            <iframe
                                ref={iframeRef}
                                className={`w-full border-0 ${isIframeLoading ? "hidden" : ""}`}
                                title="Email content"
                                srcDoc={`<!DOCTYPE html>
                                <html>
                                <head>
                                    <meta charset="UTF-8">
                                    <base target="_blank">
                                    <style>
                                        body {
                                            font-family: Arial, sans-serif;
                                            font-size: 13px;
                                            color: ${theme === "dark" ? "#FFFFFF" : "#000000"};
                                            margin: 0;
                                            overflow-y: hidden;
                                            background-color: ${
                                                theme === "dark" ? "#101828" : "white"
                                            };
                                        }
                                        .gmail_quote_container {
                                            margin-top: 20px;
                                        }
                                        .gmail_attr {
                                            color: ${theme === "dark" ? "#AAAAAA" : "#666666"};
                                            font-size: 12px;
                                            margin-bottom: 8px;
                                        }
                                        .gmail_quote {
                                            margin: 0px 0px 0px 0.8ex;
                                            border-left: 1px solid rgb(204, 204, 204);
                                            padding-left: 1ex;
                                            color: ${theme === "dark" ? "#AAAAAA" : "#666666"};
                                        }
                                        blockquote {
                                            margin: 0;
                                            padding-left: 1ex;
                                            border-left: 1px solid #ccc;
                                            color: ${theme === "dark" ? "#AAAAAA" : "#666666"};
                                        }
                                        img {
                                            max-width: 100%;
                                            height: auto;
                                        }
                                        a {
                                            color: #1155cc;
                                            text-decoration: none;
                                        }
                                        a:hover {
                                            text-decoration: underline;
                                        }
                                    </style>
                                </head>
                                <body>
                                    ${message.body.htmlBody}
                                </body>
                                </html>`}
                                sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
                                onLoad={(e) => {
                                    const iframe = e.currentTarget;
                                    try {
                                        const height =
                                            iframe.contentDocument?.documentElement.scrollHeight;
                                        if (height) {
                                            iframe.style.height = height + "px";
                                        }
                                    } catch (err) {
                                        console.error("Error calculating iframe height:", err);
                                    }
                                    setIsIframeLoading(false);
                                }}
                                onLoadStart={() => setIsIframeLoading(true)}
                            />
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap mb-6">
                            {message.body.textBody || message.snippet}
                        </p>
                    )}

                    {/* Attachments */}
                    {message.body.attachments && message.body.attachments.length > 0 && (
                        <div className="border-t pt-4">
                            <h3 className="font-semibold mb-3">
                                Attachments ({message.body.attachments.length})
                            </h3>
                            <div className="space-y-2">
                                {message.body.attachments.map((attachment, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 bg-secondary border rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <div className="font-medium">
                                                    {attachment.filename}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {(attachment.size / 1024).toFixed(2)} KB
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="cursor-pointer"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
