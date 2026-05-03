import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { useSnackbar } from "@/context/SnackbarContext";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import BreadcrumbsList from "@/components/ui/BreadcrumbsList";
import TabPanel from "@/components/ui/TabPanel";
import { getProductDetailsBreadcrumbs } from "@/router/breadcrumbs";
import ProductForm, {
  type ProductFormValues,
} from "@/components/product/ProductForm";
import ProductComponentForm, {
  type ProductComponentsFormValues,
} from "@/components/product/ProductComponentForm";
import ProductOptionsForm, {
  type ProductOptionsFormValues,
} from "@/components/product/ProductOptionsForm";
import { useProductsStore } from "@/store/productsStore";
import { useCategoriesStore } from "@/store/categoriesStore";
import type { ProductDTO } from "@/dto/types/products.dto";
import { getTabA11yProps } from "@/utils/getTabA11yProps";
import { useUrlTabs } from "@/hooks/useUrlTabs";
import type { TabConfig } from "@/types/tab";

const ProductPage = () => {
  const { t } = useTranslation(["common", "product", "messages"]);
  const { showSnackbar } = useSnackbar();
  const fetchProductById = useProductsStore((state) => state.fetchProductById);
  const loading = useProductsStore((state) => state.isLoading);
  const errorUpdate = useProductsStore((state) => state.error);
  const productInfo = useProductsStore((state) => state.productInfo);
  const updateProduct = useProductsStore((state) => state.updateProduct);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const [searchParams] = useSearchParams();
  const { id: routeProductId } = useParams();
  const productName = searchParams.get("name") || t("common:productDetails");
  const productId = routeProductId || undefined;
  const typeActions = productId ? "edit" : "create";

  useEffect(() => {
    document.title = productName;
  }, [productName]);

  useEffect(() => {
    if (!productId) return;
    void fetchProductById(productId);
  }, [fetchProductById, productId]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const onSubmitForm = async (payload: Partial<ProductDTO>) => {
    if (!productId) return;

    try {
      await updateProduct(productId, payload);
      showSnackbar({
        message: t("messages:productUpdated"),
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to update product:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";
      showSnackbar({ message: errorMessage, severity: "error" });
    }
  };

  const handleBaseFormSubmit = async (data: ProductFormValues) => {
    const payload: Partial<ProductDTO> = {
      title: data.title,
      image: data.image,
      isOnSale: data.isOnSale,
      salePrice:
        data.isOnSale && data.salePrice !== null ? data.salePrice : undefined,
      weightGrams: data.weightGrams,
      price: data.price,
      ctaLabel: data.ctaLabel,
      categoryId: data.categoryId || undefined,
      categoryName: data.categoryName || undefined,
      subCategoryId: data.subCategoryId || undefined,
      subCategoryName: data.subCategoryName || undefined,
    };
    await onSubmitForm(payload);
  };

  const handleComponentFormSubmit = async (
    data: ProductComponentsFormValues,
  ) => {
    const payload: Partial<ProductDTO> = {
      components: data.components.map((component) => ({
        name: component.name,
        image: component.image,
      })),
    };

    await onSubmitForm(payload);
  };

  const handleOptionsFormSubmit = async (data: ProductOptionsFormValues) => {
    const payload: Partial<ProductDTO> = {
      optionGroups: data.optionGroups,
    };

    await onSubmitForm(payload);
  };

  const tabs: TabConfig[] = [
    {
      key: "base",
      enabled: true,
      label: t("product:baseTab"),
      content: (
        <>
          <ProductForm
            product={productInfo ?? undefined}
            productId={productId}
            typeActions={typeActions}
            onSubmit={handleBaseFormSubmit}
          />

          {typeActions !== "edit" ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {t("product:componentsAfterCreateHint")}
            </Typography>
          ) : null}
        </>
      ),
    },
    {
      key: "components",
      enabled: typeActions === "edit",
      label: t("product:componentsTab"),
      content: (
        <ProductComponentForm
          product={productInfo ?? undefined}
          productId={productId}
          typeActions="edit"
          onSubmit={handleComponentFormSubmit}
        />
      ),
    },
    {
      key: "options",
      enabled: typeActions === "edit",
      label: t("product:optionsTab"),
      content: (
        <ProductOptionsForm
          product={productInfo ?? undefined}
          productId={productId}
          typeActions="edit"
          onSubmit={handleOptionsFormSubmit}
        />
      ),
    },
  ].filter((tab) => tab.enabled);

  const { activeTab, handleTabChange } = useUrlTabs(tabs, "tab");

  return (
    <Box>
      <BreadcrumbsList list={getProductDetailsBreadcrumbs(t, productName)} />

      {loading ? (
        <Typography sx={{ mb: 2 }}>{t("common:loading")}</Typography>
      ) : null}
      {errorUpdate ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorUpdate}
        </Typography>
      ) : null}

      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{t("common:productDetails")}</Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="product tabs"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.key}
              label={tab.label}
              data-testid={`product-tab-${tab.key}`}
              {...getTabA11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ mt: 2 }}>
        {tabs.map((tab, index) => (
          <TabPanel
            key={tab.key}
            value={activeTab}
            index={index}
            dataTestId={`product-tabpanel-${tab.key}`}
          >
            {tab.content}
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
};

export default ProductPage;
