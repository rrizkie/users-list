'use client'

import { useGetUser } from "@/services/users/query"
import { useParams, useRouter } from "next/navigation"
import UserDetailSkeleton from "./skeleton"
import { useGetPosts, useGetTodos } from "@/services/workspace/query"
import { useMemo } from "react"

const UserDetail = () => {
    const { push } = useRouter()
    const { id } = useParams()

    const { data: user, isFetching: loadingUser, isError: userError } = useGetUser(+id!)
    const { data: posts, isFetching: loadingPosts, isError: postsError } = useGetPosts()
    const { data: todos, isFetching: loadingTodos, isError: todosError } = useGetTodos()

    const loading = loadingUser || loadingPosts || loadingTodos
    const hasError = userError || postsError || todosError

    const filteredPosts = useMemo(() => {
        return posts?.filter(post => post.userId === user?.id)
    }, [posts, user])

    const pendingTodos = useMemo(() => {
        return todos?.filter(todo => todo.userId === user?.id && !todo.completed)
    }, [todos, user])

    const completedTodos = useMemo(() => {
        return todos?.filter(todo => todo.userId === user?.id && todo.completed)
    }, [todos, user])

    const handleBackToList = () => {
        push("/users")
    }

    if (hasError) {
        return (
            <div className="px-4 py-8">
                <div className="font-medium text-zinc-900 mb-4 cursor-pointer" onClick={handleBackToList}>
                    ← Back To List
                </div>
                <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    Failed to load user details. Please try again.
                </p>
            </div>
        )
    }

    return (
        <div className="px-4 py-8">
            <div className="font-medium text-zinc-900 mb-4 cursor-pointer" onClick={handleBackToList}>
                ← Back To List
            </div>

            {loading ? <UserDetailSkeleton /> : (
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div>
                            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Name
                            </span>
                            <p className="font-medium text-zinc-900">
                                {user?.name}
                            </p>
                        </div>

                        <div>
                            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Username
                            </span>
                            <p className="font-medium text-zinc-900">
                                {user?.username}
                            </p>
                        </div>

                        <div>
                            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Email
                            </span>
                            <p className="break-all font-medium text-zinc-900">
                                {user?.email}
                            </p>
                        </div>

                        <div>
                            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Phone
                            </span>
                            <p className="break-all font-medium text-zinc-900">
                                {user?.phone}
                            </p>
                        </div>

                        <div>
                            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Website
                            </span>
                            <p className="break-all font-medium text-zinc-900">
                                {user?.website}
                            </p>
                        </div>

                        <div>
                            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Company
                            </span>
                            <p className="break-all font-medium text-zinc-900">
                                {user?.company.name} ({user?.company.catchPhrase})
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Address
                            </span>
                            <p className="break-all font-medium text-zinc-900">
                                {user?.address.street} {user?.address.suite},{" "}
                                {user?.address.city}, {user?.address.zipcode}
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Total Posts ({filteredPosts?.length})
                            </span>
                            <ul className="flex flex-col gap-1 list-disc pl-4">
                                {filteredPosts?.map(post => (
                                    <li key={post.id}>
                                        <p className="break-all font-medium text-zinc-900">{post.body}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="md:col-span-1">
                            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Pending Todos ({pendingTodos?.length})
                            </span>
                            <div className="flex flex-col gap-1">
                                {pendingTodos?.map(pending => (
                                    <div key={pending.id}>
                                        <p className="break-all font-medium text-zinc-900">☐ {pending.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Completed Todos ({completedTodos?.length})
                            </span>
                            <div className="flex flex-col gap-1">
                                {completedTodos?.map(completed => (
                                    <div key={completed.id}>
                                        <p className="break-all font-medium text-zinc-900">☑ {completed.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}

export default UserDetail
