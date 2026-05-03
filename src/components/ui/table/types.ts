export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction<T> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'error' | 'warning' | 'success' | 'info';
  testId?: string;
  onClick?: (row: T, index: number, event?: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  render?: (row: T, index: number) => React.ReactNode;
  visible?: (row: T) => boolean;
}

export interface TablePaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TableSortState {
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
}

export interface TableFactoryProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  rowIdKey: keyof T;
  sortState?: TableSortState;
  onSort?: (sortBy: string | null, sortOrder: 'asc' | 'desc' | null) => void;
  paginationState?: TablePaginationState;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  selectedRows?: Set<string | number>;
  onRowSelect?: (rowId: string | number, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  showRowSelect?: boolean;
  showFilters?: boolean;
  onFilterChange?: (filters: Record<string, any>) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  maxHeight?: string | number;
}
