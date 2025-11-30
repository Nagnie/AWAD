import { Injectable } from '@nestjs/common';
import { GmailService } from 'src/gmail/gmail.service';

@Injectable()
export class MailboxService {
    constructor(
        private readonly gmailService: GmailService
    ) {}

    async getLabels(
        userId: number
    ) {

        const labels = await this.gmailService.listLabels(userId);

        const call = labels.labels?.map(async (label) => {
            const fullLabel = await this.gmailService.getLabel(userId, label.id!);
            return fullLabel;
        });

        const detailedLabels = await Promise.all(call || []);

        return detailedLabels;
    }

    async getLabel(
        userId: number,
        labelId: string
    ) {
        return this.gmailService.getLabel(userId, labelId);
    }

    async getEmailsByLabel(userId: number, labelId: string, query?: string, pageToken?: string) {
        const emails = await this.gmailService.getEmailsByLabel(userId, labelId, query, pageToken);

        const call = emails.messages?.map(async (message) => {
            const fullMessage = await this.gmailService.getEmailMetadata(userId, message.id!);
            return fullMessage;
        });

        const detailedEmails = await Promise.all(call || []);

        return {
            nextPageToken: emails.nextPageToken,
            resultSizeEstimate: emails.resultSizeEstimate,
            emails: detailedEmails
        }
    }
}
