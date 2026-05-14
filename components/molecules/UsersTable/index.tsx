import { IUser } from "@/types/users"
import { useMemo, useState } from "react"
import debounce from 'lodash/debounce'
import { SortByField } from "@/utils/SortByField"
import { useRouter } from "next/navigation"
import { IWorkSpace } from "@/types/workspace"

type ITable = {
    data: IUser[],
    posts: IWorkSpace[],
    todos: IWorkSpace[],
    loading: boolean
}

const UsersTable = ({ data, posts, todos, loading }: ITable) => {
    const { push } = useRouter()
    const [search, setSearch] = useState('')
    const [sortField, setSortField] = useState<null | "name" | "email" | "website" | "totalPosts" | "completedTodos" | "pendingTodos">(null)
    const [sortDirection, setSortDirection] = useState<null | "asc" | "desc">(null)

    const combinedData = useMemo(() => {
        return data.map((user) => ({
            ...user,
            completedTodos: todos.filter(todo => todo.userId === user.id && todo.completed).length,
            pendingTodos: todos.filter(todo => todo.userId === user.id && !todo.completed).length,
            totalPosts: posts.filter(post => post.userId === user.id).length
        }))
    }, [data, posts, todos])

    const filteredData = useMemo(() => {
        return combinedData.filter((item) => {
            return item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase())
        })
    }, [combinedData, search])

    const displayData = useMemo(() => {
        return SortByField(filteredData, sortField, sortDirection)
    }, [sortField, sortDirection, filteredData])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const handleSort = (field: "name" | "email" | "website" | "totalPosts" | "completedTodos" | "pendingTodos") => {
        setSortField(field)
        setSortDirection(prev => prev === null ? "asc" : prev === "asc" ? "desc" : null)
    }

    const handleRowClick = (id: number) => {
        push(`/users/${id}`)
    }

    return (
        <>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    className="rounded-md border border-zinc-200 p-2"
                    onChange={debounce(handleSearch, 500)}
                />
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm md:block">
                <table className="w-full min-w-xl text-left text-sm">
                    <thead className="border-b border-zinc-200 bg-zinc-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-medium text-zinc-700">
                                Name <span className="cursor-pointer" onClick={() => handleSort("name")}>↑↓</span>
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium text-zinc-700">
                                Email <span className="cursor-pointer" onClick={() => handleSort("email")}>↑↓</span>
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium text-zinc-700">
                                Website <span className="cursor-pointer" onClick={() => handleSort("website")}>↑↓</span>
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium text-zinc-700">
                                Total Post <span className="cursor-pointer" onClick={() => handleSort("totalPosts")}>↑↓</span>
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium text-zinc-700">
                                Completed Todos <span className="cursor-pointer" onClick={() => handleSort("completedTodos")}>↑↓</span>
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium text-zinc-700">
                                Pending Todos <span className="cursor-pointer" onClick={() => handleSort("pendingTodos")}>↑↓</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                        {loading && (
                            <tr className="animate-pulse">
                                <td className="px-4 py-3">
                                    <div className="h-4 w-full rounded bg-slate-200" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-full rounded bg-slate-200" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-full rounded bg-slate-200" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-full rounded bg-slate-200" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-full rounded bg-slate-200" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 w-full rounded bg-slate-200" />
                                </td>
                            </tr>
                        )}
                        {!loading && displayData.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-3 font-medium text-zinc-900 text-center"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                        {displayData.map((item) => {
                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-zinc-50 cursor-pointer"
                                    onClick={() => handleRowClick(item.id)}
                                >
                                    <td className="px-4 py-3 font-medium text-zinc-900">
                                        {item.name}
                                    </td>
                                    <td className="max-w-56 truncate px-4 py-3 text-zinc-600">
                                        {item.email}
                                    </td>
                                    <td className="max-w-48 truncate px-4 py-3 text-zinc-600">
                                        {item.website}
                                    </td>
                                    <td className="max-w-48 truncate px-4 py-3 text-zinc-600 text-center">
                                        {item.totalPosts}
                                    </td>
                                    <td className="max-w-48 truncate px-4 py-3 text-zinc-600 text-center">
                                        {item.completedTodos}
                                    </td>
                                    <td className="max-w-48 truncate px-4 py-3 text-zinc-600 text-center">
                                        {item.pendingTodos}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <ul className="space-y-3 md:hidden">
                {displayData.map((item) => {
                    return (
                        <li
                            key={item.id}
                            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                        >
                            <div className="grid gap-2 text-sm">
                                <div>
                                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                        Name
                                    </span>
                                    <p className="font-medium text-zinc-900">
                                        {item.name}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                        Email
                                    </span>
                                    <p className="break-all text-zinc-600">
                                        {item.email}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                        Website
                                    </span>
                                    <p className="break-all text-zinc-600">
                                        {item.website}
                                    </p>
                                </div>
                                <div className="flex flex-row items-center justify-between gap-2">
                                    <div>
                                        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 wrap-break-word text-center w-full">
                                            Total Post
                                        </span>
                                        <p className="break-all text-zinc-600 text-center">
                                            {item.totalPosts}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 wrap-break-word text-center w-full">
                                            Completed Todos
                                        </span>
                                        <p className="break-all text-zinc-600 text-center">
                                            {item.completedTodos}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 wrap-break-word text-center w-full">
                                            Pending Todos
                                        </span>
                                        <p className="break-all text-zinc-600 text-center">
                                            {item.pendingTodos}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default UsersTable