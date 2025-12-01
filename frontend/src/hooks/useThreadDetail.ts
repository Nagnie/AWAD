import { useGetThreadDetailQuery } from "@/services/tanstack-query";

/**
 * Hook để lấy thread detail
 */
export const useThreadDetail = (threadId: string) => {
    const { data, isPending, isError, error, refetch } = useGetThreadDetailQuery(
        threadId,
        !!threadId
    );

    return {
        threadDetail: data,
        isLoading: isPending,
        error: isError ? error?.message : null,
        refetch,
    };
};
