import { Chip, Stack } from '@mui/material'

export interface ActiveFilter<TId extends string = string> {
    id: TId
    label: string
}

interface ActiveFiltersListProps<TId extends string = string> {
    filters: ActiveFilter<TId>[]
    onRemove: (id: TId) => void
}

const ActiveFiltersList = <TId extends string,>({ filters, onRemove }: ActiveFiltersListProps<TId>) => {
    if (!filters.length) return null

    return (
        <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
            {filters.map((filter) => (
                <Chip
                    key={filter.id}
                    label={filter.label}
                    onDelete={() => onRemove(filter.id)}
                    size="small"
                />
            ))}
        </Stack>
    )
}

export default ActiveFiltersList