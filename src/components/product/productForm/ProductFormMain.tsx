import type React from "react";
import {
    FormHelperText,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useTranslation } from 'react-i18next'
import { Controller } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "@/components/product/ProductForm";
import type { SelectChangeEvent } from '@mui/material/Select';
import { useCategoriesStore } from "@/store/categoriesStore";

interface ProductFormMainProps {
    handleCategoryChange: (event: SelectChangeEvent<string>) => void;
    handleSubCategoryChange: (event: SelectChangeEvent<string>) => void;
}

const ProductFormMain = ({
    handleCategoryChange,
    handleSubCategoryChange,
}: ProductFormMainProps) => {
    const { t } = useTranslation(['forms', 'common'])
    const categories = useCategoriesStore((state) => state.categories);
    const subCategories = useCategoriesStore((state) => state.subCategories);

    const {
        control,
        register,
        watch,
        formState: { errors },
    } = useFormContext<ProductFormValues>();


    const categoryId = watch("categoryId");
    const subCategoryId = watch("subCategoryId");
    const isOnSale = watch("isOnSale");

    const categoryOptions = categories.map((category) => ({
        value: category._id ?? category.id,
        label: category.title,
    }));

    const subCategoryOptions = subCategories.map((subCategory) => ({
        value: subCategory._id ?? subCategory.id,
        label: subCategory.title,
    }));
    return (
        <>
            <TextField
                    label={t('forms:productImageAlt')}
                    fullWidth
                    {...register("image.alt")}
                    error={Boolean(errors.image?.alt)}
                    helperText={errors.image?.alt?.message ?? ''}
                    slotProps={{ htmlInput: { 'data-testid': 'product-image-alt-input' } }}
                />
                <TextField
                    label={t('forms:productTitle')}
                    fullWidth
                    {...register("title")}
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message ?? ''}
                    slotProps={{ htmlInput: { 'data-testid': 'product-title-input' } }}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        label={t('forms:productPriceAmount')}
                        type="number"
                        fullWidth
                        {...register("price.amount", {
                            setValueAs: (value) => Number(value) || 0,
                        })}
                        error={Boolean(errors.price?.amount)}
                        helperText={errors.price?.amount?.message ?? ''}
                        slotProps={{ htmlInput: { 'data-testid': 'product-price-input' } }}
                    />
                    <TextField label={t('forms:currency')} value="UAH" fullWidth disabled slotProps={{ htmlInput: { 'data-testid': 'product-currency-input' } }} />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        label={t('forms:weightGrams')}
                        type="number"
                        fullWidth
                        {...register("weightGrams", {
                            setValueAs: (value) => Number(value) || 0,
                        })}
                        error={Boolean(errors.weightGrams)}
                        helperText={errors.weightGrams?.message ?? ''}
                        slotProps={{ htmlInput: { 'data-testid': 'product-weight-input' } }}
                    />
                    <TextField
                        label={t('forms:ctaLabel')}
                        fullWidth
                        {...register("ctaLabel")}
                        error={Boolean(errors.ctaLabel)}
                        helperText={errors.ctaLabel?.message ?? ''}
                        slotProps={{ htmlInput: { 'data-testid': 'product-cta-input' } }}
                    />
                </Stack>

                <Controller
                    control={control}
                    name="isOnSale"
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Switch checked={field.value} onChange={(event) => field.onChange(event.target.checked)} slotProps={{ input: { 'data-testid': 'product-on-sale-switch' } }} />}
                            label={t('forms:productOnSale')}
                        />
                    )}
                />

                {isOnSale ? (
                    <TextField
                        label={t('forms:salePrice')}
                        type="number"
                        fullWidth
                        {...register("salePrice", {
                            setValueAs: (value) => (value === "" ? null : Number(value)),
                        })}
                        error={Boolean(errors.salePrice)}
                        helperText={errors.salePrice?.message ?? ''}
                        slotProps={{ htmlInput: { 'data-testid': 'product-sale-price-input' } }}
                    />
                ) : null}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                    <FormControl fullWidth error={Boolean(errors.categoryId || errors.categoryName)}>
                        <InputLabel id="category-label">{t('common:category')}</InputLabel>
                        <Select
                            labelId="category-label"
                            value={categoryId}
                            label={t('common:category')}
                            onChange={handleCategoryChange}
                            data-testid="product-category-select"
                        >
                            {categoryOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value} data-testid={`product-category-option-${option.value}`}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.categoryId?.message ?? errors.categoryName?.message ?? ''}</FormHelperText>
                    </FormControl>

                    {/* <TextField label="Category name" fullWidth {...register("categoryName")} /> */}
                    <FormControl fullWidth error={Boolean(errors.subCategoryId || errors.subCategoryName)}>
                        <InputLabel id="subcategory-label">{t('forms:subcategory')}</InputLabel>
                        <Select
                            labelId="subcategory-label"
                            value={subCategoryId}
                            label={t('forms:subcategory')}
                            onChange={handleSubCategoryChange}
                            data-testid="product-subcategory-select"
                        >
                            {subCategoryOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value} data-testid={`product-subcategory-option-${option.value}`}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.subCategoryId?.message ?? errors.subCategoryName?.message ?? ''}</FormHelperText>
                    </FormControl>
                </Stack>
        </>
    );
}

export default ProductFormMain;