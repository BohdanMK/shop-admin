import type { ISubCategoriesDTO } from "@/dto/types/subCategories.dto";
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
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

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

const createSubCategorySchema = z.object({
  title: z.string().trim().min(1, "Subcategory title is required"),
});

type CreateSubCategoryFormValues = z.infer<typeof createSubCategorySchema>;

interface CreateSubCategoryProps {
  onCreateSuccess?: () => void;
  categoryId: string;
  type?: "create" | "edit";
  subCategoryData?: ISubCategoriesDTO;
}

const CreateSubCategory = ({
  onCreateSuccess,
  categoryId,
  type = "create",
  subCategoryData,
}: CreateSubCategoryProps) => {
  const { t } = useTranslation(["forms", "messages", "common"]);
  const createSubCategory = useCategoriesStore(
    (state) => state.createSubCategory,
  );
  const updateSubCategory = useCategoriesStore(
    (state) => state.updateSubCategory,
  );

  const { showSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSubCategoryFormValues>({
    resolver: zodResolver(createSubCategorySchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: CreateSubCategoryFormValues) => {
    try {
      if (type === "edit" && subCategoryData) {
        await updateSubCategory(
          categoryId,
          subCategoryData._id ?? subCategoryData.id,
          data,
        );
        showSnackbar({
          message: t("messages:subcategoryUpdated"),
          severity: "success",
        });
        reset();
        handleClose();
        if (onCreateSuccess) {
          onCreateSuccess();
        }
        return;
      }
      await createSubCategory(categoryId, data);
      showSnackbar({
        message: t("messages:subcategoryCreated"),
        severity: "success",
      });
      reset();
      handleClose();
      if (onCreateSuccess) {
        onCreateSuccess();
      }
    } catch (error) {
      console.error("Failed to create subcategory:", error);
      showSnackbar({
        message: (error as Error).message ?? String(error),
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (subCategoryData && type === "edit") {
      setValue("title", subCategoryData.title);
    }
  }, [subCategoryData, type]);

  return (
    <div>
      {type === "create" && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          data-testid="subcategory-open-btn"
        >
          {t("forms:createSubcategory")}
        </Button>
      )}
      {type === "edit" && (
        <IconButton
          color="primary"
          onClick={handleOpen}
          data-testid="subcategory-edit-btn"
        >
          <EditIcon />
        </IconButton>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            {type === "create"
              ? t("forms:createSubcategory")
              : t("forms:editSubcategory")}
          </Typography>
          <TextField
            label={t("forms:subcategoryTitle")}
            fullWidth
            margin="normal"
            {...register("title")}
            error={!!errors.title}
            InputLabelProps={{ shrink: true }}
            helperText={errors.title ? errors.title.message : ""}
            slotProps={{
              htmlInput: { "data-testid": "subcategory-title-input" },
            }}
          />
          <Button
            sx={{ width: "100%" }}
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            data-testid="subcategory-submit-btn"
          >
            {t("common:submit")}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateSubCategory;
