import { useQuery } from "@tanstack/react-query"
import { getUser, getUsers } from "./api"
import { IUser } from "@/types/users"

export const useGetUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () =>
            getUsers().then(res => {
                return res as IUser[]
            })
        ,
        enabled: true
    })
}

export const useGetUser = (id: number) => {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () =>
            getUser(id).then(res => {
                return res as IUser
            })
        ,
        enabled: !!id
    })
}
