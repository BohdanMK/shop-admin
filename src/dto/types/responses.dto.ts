export interface PaginatedResponse<T> {
    items: T[];
    limit: number;
    page: number;
    total: number;
    totalPages: number;
}