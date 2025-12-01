import { useGetThreadDetailQuery } from "@/services/tanstack-query";

/**
 * Hook để lấy thread detail
 */
export const useThreadDetail = (threadId: string, enabled = false) => {
    console.log("🚀 ~ useThreadDetail ~ threadId:", threadId, "enabled:", enabled);
    const { data, isPending, isError, error, refetch } = useGetThreadDetailQuery(threadId, enabled);
    console.log("🚀 ~ useThreadDetail ~ isPending:", isPending, "data:", data);

    return {
        threadDetail: data,
        isLoading: enabled ? isPending : false, // Nếu không enabled, không show loading
        error: isError ? error?.message : null,
        refetch,
    };
};
