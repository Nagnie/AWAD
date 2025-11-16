import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useUsersStats = () => {
    return useQuery({
        queryKey: ['userStats'],
        queryFn: dashboardAPI.getUserStats,
    })
}

export const useUsersList = (params?: UsersListParams) => {
    return useQuery({
        queryKey: ['usersList', params],
        queryFn: () => dashboardAPI.getUsers(params),
        placeholderData: keepPreviousData,
    })
}