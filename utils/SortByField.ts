export const SortByField = (data: any[], field: string | null, direction: 'asc' | "desc" | null) => {
    if (direction === null || field === null) return data


    return [...data].sort((a, b) => {
        const valueA = a[field]
        const valueB = b[field]

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return direction === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA)
        }

        return direction === 'asc'
            ? valueA - valueB
            : valueB - valueA
    })
}