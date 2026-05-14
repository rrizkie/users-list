'use client'

import { queryClient } from "@/services/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"

const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient} >
            {children}
        </QueryClientProvider>
    )
}

export default Provider