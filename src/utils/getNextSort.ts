export type SortOrder = 'asc' | 'desc' | undefined;

export const getNextSort = <T extends string>(
    currentSortBy: T | undefined,
    currentOrder: SortOrder,
    column: T
) => {
    if (currentSortBy !== column) {
        return { sortBy: column, sortOrder: 'asc' as const };
    }

    if (currentOrder === 'asc') {
        return { sortBy: column, sortOrder: 'desc' as const };
    }

    if (currentOrder === 'desc') {
        return { sortBy: undefined, sortOrder: undefined };
    }

    return { sortBy: column, sortOrder: 'asc' as const };
};