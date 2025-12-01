export {
    emailApi,
    useBatchDeleteEmailsMutation,
    useDeleteEmailMutation,
    useModifyEmailMutation,
    useBatchModifyEmailsMutation,
    useMarkAsReadMutation,
    useMarkAsUnreadMutation,
    useStarEmailMutation,
    useUnstarEmailMutation,
    useMoveToTrashMutation,
    useMoveToInboxMutation,
    useArchiveEmailMutation,
    useUntrashEmailMutation,
} from "./api";
export type {
    DeleteBatchEmailDto,
    BatchModifyEmailDto,
    ModifyEmailDto,
    BatchOperationResponse,
} from "./types";
