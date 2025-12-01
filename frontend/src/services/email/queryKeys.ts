export const emailKeys = {
    all: ["emails"] as const,
    mutations: () => [...emailKeys.all, "mutations"] as const,
};
