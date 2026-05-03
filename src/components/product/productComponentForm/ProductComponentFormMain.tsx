import { Stack, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import type { ProductComponentsFormValues } from "@/components/product/ProductComponentForm";
import type { Upload } from "@/store/uploadsStore";
import ProductComponentFormMedia from "@/components/product/productComponentForm/ProductComponentFormMedia";

interface ProductComponentFormMainProps {
  fields: any[];
  watch: any;
  uploadedFiles: { [key: number]: Upload | null };
  onRemove: (index: number) => void;
  onDeletePreview: (index: number) => void;
  onUploadSuccess: (index: number, upload: Upload) => void;
  onUploadError: (index: number, error: unknown) => void;
}

const ProductComponentFormMain = ({
  fields,
  watch,
  uploadedFiles,
  onRemove,
  onDeletePreview,
  onUploadSuccess,
  onUploadError,
}: ProductComponentFormMainProps) => {
  const { t } = useTranslation(["forms"]);
  const { register } = useFormContext<ProductComponentsFormValues>();

  return (
    <Stack spacing={2}>
      {fields.map((field, index) => {
        const imageSrc = watch(`components.${index}.image.src`);
        const imageAlt = watch(`components.${index}.image.alt`);
        const uploadedFile = uploadedFiles[index] || null;

        return (
          <Stack
            key={field.id}
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            alignItems="stretch"
          >
            <ProductComponentFormMedia
              index={index}
              imageSrc={imageSrc}
              imageAlt={imageAlt}
              uploadedFile={uploadedFile}
              onDeletePreview={() => onDeletePreview(index)}
              onUploadSuccess={(upload) => onUploadSuccess(index, upload)}
              onUploadError={(error) => onUploadError(index, error)}
            />
            <Stack spacing={1} flex={1}>
              <TextField
                label={t("forms:componentName")}
                fullWidth
                {...register(`components.${index}.name` as const)}
                slotProps={{
                  htmlInput: { "data-testid": "component-name-input" },
                }}
              />
              <TextField
                label={t("forms:componentImageAlt")}
                fullWidth
                {...register(`components.${index}.image.alt` as const)}
                slotProps={{
                  htmlInput: { "data-testid": "component-image-alt-input" },
                }}
              />
            </Stack>
            <IconButton
              color="error"
              aria-label="delete component"
              onClick={() => onRemove(index)}
              disabled={fields.length === 1}
              sx={{ mt: 4 }}
              data-testid="component-delete-btn"
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default ProductComponentFormMain;
