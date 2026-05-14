const UserDetailSkeleton = () => {
    return (
        <div
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm animate-pulse"
            aria-busy="true"
        >
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Name
                    </span>
                    <div className="h-4 w-full rounded bg-slate-200" />
                </div>

                <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Username
                    </span>
                    <div className="h-4 w-full rounded bg-slate-200" />
                </div>

                <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Email
                    </span>
                    <div className="h-4 w-full rounded bg-slate-200" />
                </div>

                <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Phone
                    </span>
                    <div className="h-4 w-full rounded bg-slate-200" />
                </div>

                <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Website
                    </span>
                    <div className="h-4 w-full rounded bg-slate-200" />
                </div>

                <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Company
                    </span>
                    <div className="h-4 w-full rounded bg-slate-200" />
                </div>

                <div className="md:col-span-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Address
                    </span>
                    <div className="h-4 w-full rounded bg-slate-200" />
                </div>
            </div>
        </div>
    )
}

export default UserDetailSkeleton