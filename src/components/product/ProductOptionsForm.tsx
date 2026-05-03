import { useEffect } from "react";
import { useTranslation } from 'react-i18next'
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import type { ProductDTO, ProductOptionGroupDTO } from "@/dto/types/products.dto";
import ProductOptionsFormMain from "@/components/product/productOptionsForm/ProductOptionsFormMain";


export type ProductOptionsFormValues = {
    optionGroups: ProductOptionGroupDTO[];
};

interface ProductOptionsFormProps {
    product?: ProductDTO;
    productId?: string;
    typeActions: "create" | "edit";
    onSubmit?: (data: ProductOptionsFormValues) => Promise<void> | void;
}

const getDefaultValues = (product?: ProductDTO): ProductOptionsFormValues => ({
    optionGroups: product?.optionGroups?.length ? product.optionGroups : [],
});



const ProductOptionsForm = ({ product, productId, typeActions, onSubmit: onSubmitProp }: ProductOptionsFormProps) => {
    const { t } = useTranslation(['forms'])
    const methods = useForm<ProductOptionsFormValues>({
        defaultValues: getDefaultValues(product),
    });

    const {
        control,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({
        control,
        name: "optionGroups",
    });

    useEffect(() => {
        reset(getDefaultValues(product));
    }, [product, reset]);

    const handleFormSubmit = async (data: ProductOptionsFormValues) => {
        if (onSubmitProp) {
            await onSubmitProp(data);
            return;
        }

        console.log("Product options submit", { typeActions, productId, data });
    };

    return (
        <FormProvider {...methods}>
            <Box
                component="form"
                noValidate
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                onSubmit={handleSubmit(handleFormSubmit)}
            >
                <Typography variant="h6">{t('forms:productOptionGroups')}</Typography>

                <ProductOptionsFormMain
                    fields={groupFields}
                    onRemove={removeGroup}
                />

                <Button
                    type="button"
                    sx={{ mt: 1, alignSelf: "flex-start" }}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() =>
                        appendGroup({
                            id: "",
                            name: t('forms:newOptionGroup'),
                            type: "single",
                            required: false,
                            minSelected: undefined,
                            maxSelected: undefined,
                            values: [{ id: "1", label: t('forms:newOption') }],
                        })
                    }
                    data-testid="product-add-option-group-btn"
                >
                    {t('forms:addOptionGroup')}
                </Button>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" disabled={isSubmitting} data-testid="product-options-submit-btn">
                        {typeActions === "create" ? t('forms:createOptionGroups') : t('forms:saveOptionGroups')}
                    </Button>
                </Stack>
            </Box>
        </FormProvider>
    );
}

export default ProductOptionsForm;