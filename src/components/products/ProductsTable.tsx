import { useState } from 'react';
import { useTranslation } from 'react-i18next'
import type { ProductDTO } from '@/dto/types/products.dto';
import { useProductsStore } from '@/store/productsStore';
import { formatCurrency } from '@/utils/currency';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonCopy from '@/components/ui/ButtonCopy';
import getImageUrl from '@/helpers/getImageUrl';
import TableFactory from '@/components/ui/table/TableFactory';
import type { TableColumn, TableAction, TableSortState } from '@/components/ui/table/types';
import ConfirmPopup from '@/components/ui/ConfirmPopup';

interface ProductsTableFactoryProps {
  productsList: ProductDTO[];
  onDeleteSuccess?: (productId: string) => void;
}

const ProductsTableFactory = ({
  productsList,
  onDeleteSuccess,
}: ProductsTableFactoryProps) => {
  const { t } = useTranslation(['tables', 'common'])
  const [confirmState, setConfirmState] = useState<{ anchorEl: HTMLElement; onConfirm: () => void } | null>(null)
  const navigate = useNavigate();

  const setSorting = useProductsStore((state) => state.setSorting);
  const productsOptions = useProductsStore((state) => state.productsOptions);
  const pagination = useProductsStore((state) => state.productsPagination);
  const setPage = useProductsStore((state) => state.setPage);
  const setPageLimit = useProductsStore((state) => state.setLimit);
  const normalizedSortBy = productsOptions.sortBy === 'price' ? 'price' : null;
  const sortState: TableSortState = {
    sortBy: normalizedSortBy,
    sortOrder: productsOptions.sortOrder ?? 'asc',
  };

  const columns: TableColumn<ProductDTO>[] = [
    {
      key: '_id',
      label: t('tables:products.id'),
      render: (value) => <ButtonCopy textToCopy={value} />,
      width: '120px',
    },
    {
      key: 'image',
      label: t('tables:products.image'),
      render: (value, row: ProductDTO) =>
        value?.src ? (
          <img
            src={getImageUrl(value.src)}
            alt={row.title}
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        ) : (
          t('tables:products.noImage')
        ),
      width: '70px',
      align: 'center',
    },
    {
      key: 'title',
      label: t('tables:products.name'),
      width: '260px',
    },
    {
      key: 'categoryName',
      label: t('tables:products.category'),
      render: (value) => value || t('tables:products.noCategory'),
      width: '180px',
    },
    {
        key: 'price',
        label: t('tables:products.price'),
        sortable: true,
        render: (value) =>
            formatCurrency(value.amount, value.currency),
        align: 'right',
        width: '140px',
    },
    {
      key: 'isOnSale',
      label: t('tables:products.promotion'),
      render: (value, row: ProductDTO) =>
        value
          ? `${t('tables:products.onSale')} ${
              row.salePrice
                ? `- ${formatCurrency(row.salePrice, row.price.currency)}`
                : ''
            }`
          : t('common:none'),
      width: '220px',
    },
  ];

  const actions: TableAction<ProductDTO>[] = [
    {
      id: 'view',
      label: t('common:view'),
      icon: <RemoveRedEyeIcon />,
      color: 'primary',
      testId: 'product-edit-btn',
      onClick: (product) => {
        navigate({
          pathname: `/products/${product._id}`,
          search: `?name=${encodeURIComponent(product.title)}`,
        });
      },
    },
    {
      id: 'delete',
      label: t('common:delete'),
      icon: <DeleteIcon />,
      color: 'error',
      testId: 'product-delete-btn',
      onClick: (product, _index, event) => {
        if (!product._id || !event) return;
        const productId = product._id
        setConfirmState({
          anchorEl: event.currentTarget,
          onConfirm: () => onDeleteSuccess?.(productId),
        })
      },
    },
  ];

  return (
    <>
      <TableFactory<ProductDTO>
          data={productsList}
          columns={columns}
          actions={actions}
          rowIdKey="_id"
          sortState={sortState}
          onSort={(sortBy, sortOrder) => {
            if (sortBy === null) {
              setSorting({ sortBy: undefined, sortOrder: undefined });
              return;
            }
            if (sortBy !== 'price' || sortOrder === null) return;
            setSorting({ sortBy, sortOrder });
          }}
          paginationState={pagination}
          onPageChange={setPage}
          onLimitChange={setPageLimit}
          showRowSelect={false}
            emptyMessage={t('tables:empty.products')}
      />
      <ConfirmPopup
          anchorEl={confirmState?.anchorEl ?? null}
          onClose={() => setConfirmState(null)}
          onConfirm={() => confirmState?.onConfirm()}
      />
    </>
  );
};

export default ProductsTableFactory;
