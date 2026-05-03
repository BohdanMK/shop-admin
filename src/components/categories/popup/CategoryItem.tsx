import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "@/context/SnackbarContext";
import { Box, Button, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { useCategoriesStore } from "@/store/categoriesStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FileUploadField from "../../ui/FileUploadField";
import type { Upload } from "@/store/uploadsStore";
import FilePrev from "../../ui/FilePrev";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const createCategorySchema = z.object({
  title: z.string().trim().min(1, "Category title is required"),
  imageId: z.string().nullable(),
  image: z.string().nullable(),
});

type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

interface CreateCategoryProps {
  onCreateSuccess?: () => void;
  categoryData?: {
    title: string;
    imageId: string | null;
    image: string | null;
  };
  type?: "create" | "edit";
  categoryId?: string;
}

const CreateCategory = ({
  onCreateSuccess,
  categoryData,
  type = "create",
  categoryId,
}: CreateCategoryProps) => {
  const { t } = useTranslation(["forms", "messages", "common"]);
  const { showSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<Upload | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      title: "",
      imageId: null,
      image: null,
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setValue("imageId", null, { shouldDirty: true, shouldValidate: true });
      setValue("image", null, { shouldDirty: true });
      setUploadedFile(null);
    }
  };

  const handleUploadSuccess = (upload: Upload) => {
    setValue("imageId", upload.fileId, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("image", upload.filePath, { shouldDirty: true });
    setUploadedFile(upload);
    console.log(
      "Upload successful, file ID:",
      upload.fileId,
      "file path:",
      upload.filePath,
    );
  };

  const handleUploadError = (error: unknown) => {
    console.error("Upload failed:", error);
    setValue("imageId", null, { shouldDirty: true, shouldValidate: true });
    setValue("image", null, { shouldDirty: true });
    setUploadedFile(null);
  };

  const onSubmit = async (formData: CreateCategoryFormValues) => {
    console.log(formData);
    try {
      if (type === "edit" && categoryId && categoryData) {
        await useCategoriesStore
          .getState()
          .updateCategory(categoryId, formData);
        showSnackbar({
          message: t("messages:categoryUpdated"),
          severity: "success",
        });
      } else {
        await useCategoriesStore.getState().createCategory(formData);
        showSnackbar({
          message: t("messages:categoryCreated"),
          severity: "success",
        });
      }
      if (onCreateSuccess) {
        onCreateSuccess();
      }
    } catch (error) {
      console.error("Failed to create category:", error);
      showSnackbar({ message: error as string, severity: "error" });
    }
  };

  const deleteFile = () => {
    setValue("imageId", null, { shouldDirty: true, shouldValidate: true });
    setValue("image", null, { shouldDirty: true });
    setUploadedFile(null);
  };

  useEffect(() => {
    if (categoryData) {
      reset({
        title: categoryData.title,
        imageId: categoryData.imageId,
        image: categoryData.image,
      });

      if (categoryData.image) {
        const normalizedPath = categoryData.image.replace(/\\/g, "/");
        const imageName = normalizedPath.split("/").pop() || "category-image";
        const isAbsoluteUrl = /^https?:\/\//i.test(categoryData.image);

        setUploadedFile({
          fileId: categoryData.imageId || "",
          fileName: imageName,
          filePath: categoryData.image,
          fileUrl: isAbsoluteUrl ? categoryData.image : "",
          mimeType: "image/*",
        });
      } else {
        setUploadedFile(null);
      }
    } else {
      setUploadedFile(null);
    }
  }, [categoryData, reset]);

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleOpen}
        data-testid={
          type === "create" ? "category-open-btn" : "category-edit-btn"
        }
      >
        {" "}
        {type === "create"
          ? t("forms:createCategory")
          : t("forms:editCategory")}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {type === "create"
              ? t("forms:createNewCategory")
              : t("forms:editCategory")}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {t("forms:fillCategoryDetails")}
          </Typography>
          <Box
            component="form"
            sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              id="category-title"
              label={t("forms:categoryTitle")}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register("title")}
              slotProps={{
                htmlInput: { "data-testid": "category-title-input" },
              }}
            />

            {uploadedFile && (
              <FilePrev file={uploadedFile} onDetelete={deleteFile} />
            )}
            {watch("imageId") && (
              <Typography variant="body2">
                {t("forms:uploadedImageId")}: {watch("imageId")}
              </Typography>
            )}
            <FileUploadField
              label={t("forms:uploadCategoryImage")}
              onFileChange={handleFileChange}
              autoUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              dataTestId="category-image-upload"
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              data-testid="category-submit-btn"
            >
              {t("common:submit")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateCategory;
