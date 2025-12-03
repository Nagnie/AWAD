import { useGetThreadDetailQuery } from "@/services/tanstack-query";

/**
 * Hook để lấy thread detail
 */
export const useThreadDetail = (threadId: string, enabled = false) => {
    const { data, isPending, isError, error, refetch } = useGetThreadDetailQuery(threadId, enabled);

    return {
        threadDetail: data,
        isLoading: enabled ? isPending : false, // Nếu không enabled, không show loading
        error: isError ? error?.message : null,
        refetch,
    };
};
