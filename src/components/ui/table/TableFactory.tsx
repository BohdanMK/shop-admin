import React from 'react';
import { useTranslation } from 'react-i18next'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Pagination,
  Stack,
  IconButton,
  Checkbox,
  CircularProgress,
  Box,
  Tooltip,
} from '@mui/material';
import type { TableFactoryProps, TableColumn } from './types';

const TableFactory = <T extends Record<string, any>>({
    data,
    columns,
    actions = [],
    rowIdKey,
    sortState,
    onSort,
    paginationState,
    onPageChange,
    onLimitChange,
    selectedRows = new Set(),
    onRowSelect,
    onSelectAll,
    showRowSelect = false,
    emptyMessage,
    isLoading = false,
    maxHeight = 'auto',
}: TableFactoryProps<T>) => {
    const { t } = useTranslation(['common', 'tables'])
    const resolvedEmptyMessage = emptyMessage ?? t('tables:empty.data')
    const handleSort = (key: string) => {
    if (!sortState) return;

        const isCurrentColumn = sortState.sortBy === key;
        if (!isCurrentColumn) {
        onSort?.(key, 'asc');
        return;
        }

        if (sortState.sortOrder === 'asc') {
        onSort?.(key, 'desc');
        return;
        }

        onSort?.(null, null);
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectAll?.(event.target.checked);
    };

    const handleSelectRow = (rowId: string | number) => {
        const isSelected = selectedRows.has(rowId);
        onRowSelect?.(rowId, !isSelected);
    };

  const isAllSelected =
    data.length > 0 && data.length === selectedRows.size;
  const isIndeterminate =
    selectedRows.size > 0 && selectedRows.size < data.length;

  const getColumnValue = (row: T, column: TableColumn<T>) => {
    const key = column.key as keyof T;
    return row[key];
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ maxHeight, overflow: 'auto', position: 'relative' }}
      >
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {showRowSelect && (
                <TableCell padding="checkbox" width="40">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}

              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  align={column.align || 'left'}
                  width={column.width}
                  sx={{ fontWeight: 600 }}
                >
                  {column.sortable && sortState && onSort ? (
                    <TableSortLabel
                      active={sortState.sortBy === column.key}
                      direction={
                        sortState.sortBy === column.key
                          ? sortState.sortOrder
                          : 'asc'
                      }
                      onClick={() => handleSort(String(column.key))}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}

              {actions.length > 0 && (
                <TableCell align="center" width="120">
                  {t('common:actions')}
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + (showRowSelect ? 1 : 0) + (actions.length > 0 ? 1 : 0)
                  }
                  align="center"
                  sx={{ py: 4 }}
                >
                  {resolvedEmptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const rowId = row[rowIdKey];
                const isSelected = selectedRows.has(rowId);

                return (
                  <TableRow
                    key={String(rowId)}
                    selected={isSelected}
                    hover
                    sx={{
                      backgroundColor: isSelected
                        ? 'rgba(33, 150, 243, 0.08)'
                        : 'inherit',
                      cursor: showRowSelect ? 'pointer' : 'default',
                    }}
                  >
                    {showRowSelect && (
                      <TableCell padding="checkbox" width="40">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                        />
                      </TableCell>
                    )}

                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        align={column.align || 'left'}
                      >
                        {column.render
                          ? column.render(getColumnValue(row, column), row, index)
                          : String(getColumnValue(row, column) ?? '-')}
                      </TableCell>
                    ))}

                    {actions.length > 0 && (
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          {actions
                            .filter((action) => !action.visible || action.visible(row))
                            .map((action) =>
                              action.render ? (
                                <React.Fragment key={action.id}>
                                  {action.render(row, index)}
                                </React.Fragment>
                              ) : (
                              <Tooltip
                                key={action.id}
                                title={action.label}
                                arrow
                              >
                                <IconButton
                                  size="small"
                                  color={action.color || 'default'}
                                  onClick={(e) => action.onClick?.(row, index, e)}
                                  sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}
                                  data-testid={action.testId}
                                >
                                  {action.icon}
                                </IconButton>
                              </Tooltip>
                            ))}
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    {paginationState && (
        <Stack
            sx={{
            mt: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 2,
            }}
        >
            <TablePagination
            component="div"
            ActionsComponent={() => null}
            count={paginationState.total}
            page={paginationState.page - 1}
            onPageChange={(_event, newPage) => onPageChange?.(newPage + 1)}
            rowsPerPage={paginationState.limit}
            onRowsPerPageChange={(event) => {
                onLimitChange?.(parseInt(event.target.value, 10));
            }}
            />
            <Pagination
            count={paginationState.totalPages}
            page={paginationState.page}
            onChange={(_event, value) => onPageChange?.(value)}
            />
        </Stack>
        )}
    </>
  );
};

export default TableFactory;
