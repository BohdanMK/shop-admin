import { useEffect } from "react";
import { useTranslation } from 'react-i18next'
import {
    Box,
    Button,
    Stack,
    Typography,
} from "@mui/material";
import { useCategoriesStore } from "@/store/categoriesStore";
import type { SelectChangeEvent } from '@mui/material/Select';
import { useForm, FormProvider } from "react-hook-form";
import type { ProductDTO } from "@/dto/types/products.dto";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ProductFormMedia from "@/components/product/productForm/ProductFormMedia";
import ProductFormMain from "@/components/product/productForm/ProductFormMain";

export type ProductFormValues = z.infer<typeof createProductSchema>;

interface ProductFormProps {
    product?: ProductDTO;
    productId?: string;
    typeActions: "create" | "edit";
    onSubmit?: (data: ProductFormValues) => Promise<void> | void;
}

const createProductSchema = z.object({
    title: z.string().trim().min(1, 'Product title is required'),
    image: z.object({
        src: z.string().trim().min(1, 'Product image is required'),
        alt: z.string().trim().min(1, 'Image alt text is required'),
    }),
    isOnSale: z.boolean(),
    salePrice: z.number().nullable(),
    weightGrams: z.number(),
    price: z.object({
        amount: z.number(),
        currency: z.literal("UAH"),
    }),
    ctaLabel: z.string().trim(),
    categoryId: z.string().trim().min(1, 'Category is required'),
    categoryName: z.string().trim().min(1, 'Category name is required'),
    subCategoryId: z.string().trim().min(1, 'Subcategory is required'),
    subCategoryName: z.string().trim().min(1, 'Subcategory name is required'),
});

const getDefaultValues = (product?: ProductDTO): ProductFormValues => ({
    title: product?.title ?? "",
    image: {
        src: product?.image?.src ?? "",
        alt: product?.image?.alt ?? "",
    },
    isOnSale: product?.isOnSale ?? false,
    salePrice: typeof product?.salePrice === "number" ? product.salePrice : null,
    weightGrams: product?.weightGrams ?? 0,
    price: {
        amount: product?.price?.amount ?? 0,
        currency: "UAH",
    },
    ctaLabel: product?.ctaLabel ?? "",
    categoryId: product?.categoryId ?? "",
    categoryName: product?.categoryName ?? "",
    subCategoryId: product?.subCategoryId ?? "",
    subCategoryName: product?.subCategoryName ?? "",
});

const ProductForm = ({ product, productId, typeActions, onSubmit: onSubmitProp }: ProductFormProps) => {
    const { t } = useTranslation(['forms'])
    const categories = useCategoriesStore((state) => state.categories);
    const fetchSubCategories = useCategoriesStore((state) => state.fetchSubCategories);
    const subCategories = useCategoriesStore((state) => state.subCategories);

    const methods = useForm<ProductFormValues>({
        resolver: zodResolver(createProductSchema),
        defaultValues: getDefaultValues(product),
    });

    const {
        watch,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = methods;


    const categoryId = watch("categoryId");

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value;

        setValue("categoryId", selectedId, {
            shouldDirty: true,
            shouldValidate: true,
        });

        const selectedCategory = categories.find(
            (cat) => (cat._id ?? cat.id) === selectedId
        );

        setValue("categoryName", selectedCategory?.title ?? "", {
            shouldDirty: true,
            shouldValidate: true,
        });

        setValue("subCategoryId", "", { shouldDirty: true, shouldValidate: true });
        setValue("subCategoryName", "", { shouldDirty: true, shouldValidate: true });
    };

    const handleSubCategoryChange = (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value;
        setValue("subCategoryId", selectedId, {
            shouldDirty: true,
            shouldValidate: true,
        });

        const selectedSubCategory = subCategories.find(
            (subCat) => (subCat._id ?? subCat.id) === selectedId
        );
        setValue("subCategoryName", selectedSubCategory?.title ?? "", {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const handleFormSubmit = async (data: ProductFormValues) => {
        if (onSubmitProp) {
            console.log("Product form submit", { typeActions, productId, data });
            await onSubmitProp(data);
            return;
        }
    };


    useEffect(() => {
        if (categoryId) {
            void fetchSubCategories(categoryId);
        }
    }, [categoryId, fetchSubCategories]);



    return (
        <FormProvider {...methods}>
            <Box
                component="form"
                noValidate
                sx={{ display: "flex", flexDirection: "column", gap: 2, width: "60%", marginX: "auto" }}
                onSubmit={handleSubmit(handleFormSubmit)}
            >

                <Typography variant="h6">
                    {typeActions === "create" ? t('forms:createProduct') : t('forms:editProduct')}
                </Typography>

                <ProductFormMedia product={product} getDefaultValues={getDefaultValues} />

                <ProductFormMain
                    handleCategoryChange={handleCategoryChange}
                    handleSubCategoryChange={handleSubCategoryChange}
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button type="submit" variant="contained" disabled={isSubmitting} data-testid="product-submit-btn">
                        {typeActions === "create" ? t('forms:createProduct') : t('forms:saveChanges')}
                    </Button>
                </Stack>
            </Box>
        </FormProvider>
    );
};

export default ProductForm;