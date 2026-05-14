'use client'

import { useGetUsers } from "@/services/users/query"
import UsersTable from "@/components/molecules/UsersTable"
import { useGetPosts, useGetTodos } from "@/services/workspace/query"



const Users = () => {
    const { data: users, isFetching: loadingUsers, isError: usersError } = useGetUsers()
    const { data: todos, isFetching: loadingTodos, isError: todosError } = useGetTodos()
    const { data: posts, isFetching: loadingPosts, isError: postsError } = useGetPosts()

    const loading = loadingUsers || loadingTodos || loadingPosts
    const hasError = usersError || todosError || postsError

    return (
        <div className="px-4 py-8">
            <h1 className="mb-6 text-2xl font-semibold">
                Users
            </h1>

            {hasError ? (
                <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    Failed to load users. Please try again.
                </p>
            ) : (
                <UsersTable data={users ?? []} posts={posts ?? []} todos={todos ?? []} loading={loading} />
            )}
        </div>
    )
}

export default Users
