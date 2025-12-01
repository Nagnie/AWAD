export interface DeleteBatchEmailDto {
    ids: string[];
}

export interface BatchModifyEmailDto {
    ids?: string[];
    addLabelIds?: string[];
    removeLabelIds?: string[];
}

export interface ModifyEmailDto {
    addLabelIds?: string[];
    removeLabelIds?: string[];
}

export interface BatchOperationResponse {
    success: boolean;
    modified?: number;
    deleted?: number;
}
