import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import type { ProductDTO } from "@/dto/types/products.dto";
import type { Upload } from '@/store/uploadsStore';
import ProductComponentFormMain from "@/components/product/productComponentForm/ProductComponentFormMain";

export type ProductComponentsFormValues = {
    components: Array<{
        name: string;
        image: {
            src: string;
            alt: string;
        };
    }>;
};

interface ProductComponentFormProps {
    product?: ProductDTO;
    productId?: string;
    typeActions: "create" | "edit";
    onSubmit?: (data: ProductComponentsFormValues) => Promise<void> | void;
}

const getDefaultValues = (product?: ProductDTO): ProductComponentsFormValues => ({
    components: product?.components?.length
            ? product.components.map((component) => ({
                name: component.name,
                image: {
                    src: component.image?.src ?? "",
                    alt: component.image?.alt ?? "",
                },
            }))
            : [
                {
                    name: "",
                    image: { src: "", alt: "" },
                },
            ],
});

const ProductComponentForm = ({ product, productId, typeActions, onSubmit: onSubmitProp }: ProductComponentFormProps) => {
    const { t } = useTranslation(['forms'])
    const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: Upload | null }>({});

    const methods = useForm<ProductComponentsFormValues>({
        defaultValues: getDefaultValues(product),
    });

    const {
        control,
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "components",
    });

    useEffect(() => {
        reset(getDefaultValues(product));
        setUploadedFiles({});
    }, [product, reset]);

    const handleUploadSuccess = (index: number, upload: Upload) => {
        setUploadedFiles((prev) => ({
            ...prev,
            [index]: upload,
        }));
    };

    const handleUploadError = (index: number, _error: unknown) => {
        setUploadedFiles((prev) => ({
            ...prev,
            [index]: null,
        }));
    };

    const handleDeletePreview = (index: number) => {
        setValue(`components.${index}.image.src`, "", { shouldDirty: true, shouldValidate: true });
        setUploadedFiles((prev) => ({
            ...prev,
            [index]: null,
        }));
    };

    const handleFormSubmit = async (data: ProductComponentsFormValues) => {
        if (onSubmitProp) {
            await onSubmitProp(data);
            return;
        }

        console.log("Product components submit", { typeActions, productId, data });
    };

    return (
        <FormProvider {...methods}>
            <Box
                component="form"
                noValidate
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                onSubmit={handleSubmit(handleFormSubmit)}
            >
                <Typography variant="h6">{t('forms:productComponents')}</Typography>

                <ProductComponentFormMain
                    fields={fields}
                    watch={watch}
                    uploadedFiles={uploadedFiles}
                    onRemove={remove}
                    onDeletePreview={handleDeletePreview}
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                />

                <Button
                    type="button"
                    sx={{ mt: 1, alignSelf: "flex-start" }}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() =>
                        append({
                            name: "",
                            image: { src: "", alt: "" },
                        })
                    }
                    data-testid="product-add-component-btn"
                >
                    {t('forms:addComponent')}
                </Button>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button type="submit" variant="contained" disabled={isSubmitting} data-testid="product-components-submit-btn">
                        {typeActions === "create" ? t('forms:createComponents') : t('forms:saveComponents')}
                    </Button>
                </Stack>
            </Box>
        </FormProvider>
    );
}

export default ProductComponentForm;