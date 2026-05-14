import { useQuery } from "@tanstack/react-query"
import { getPosts, getTodos } from "./api"
import { IWorkSpace } from "@/types/workspace"

export const useGetTodos = () => {
    return useQuery({
        queryKey: ['todos'],
        queryFn: () =>
            getTodos().then(res => {
                return res as IWorkSpace[]
            })
        ,
        enabled: true
    })
}

export const useGetPosts = () => {
    return useQuery({
        queryKey: ['posts'],
        queryFn: () =>
            getPosts().then(res => {
                return res as IWorkSpace[]
            })
        ,
        enabled: true
    })
}