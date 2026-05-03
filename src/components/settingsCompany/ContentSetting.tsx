import { useState } from "react";
import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { CompanyInfoDTO } from "@/dto/types/companyInfo";
import { useSnackbar } from "@/context/SnackbarContext";
import { extractErrorMessage } from "@/helpers/extractErrorMessage";
import { useCompanyInfoStore } from "@/store/companyInfo";
import BannerContentImageMedia from "@/components/settingsCompany/settingForm/BannerContentImageMedia";

const ContentSetting = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { showSnackbar } = useSnackbar();
  const updateCompanyInfo = useCompanyInfoStore((state) => state.updateCompanyInfo);

  const {
    control,
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext<CompanyInfoDTO>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bannerContents",
  });

  const handleContentSubmit = async () => {
    const isValid = await trigger("bannerContents");

    if (!isValid) {
      return;
    }

    try {
      setIsSaving(true);
      await updateCompanyInfo(getValues());
      showSnackbar({ message: "Контент збережено", severity: "success" });
    } catch (error) {
      showSnackbar({
        message: extractErrorMessage(error, "Не вдалося зберегти контент"),
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
      <Typography variant="h6">Content settings</Typography>

      {fields.map((field, index) => (
        <Box
          key={field.id}
          sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1">Банер #{index + 1}</Typography>
            <IconButton
              color="error"
              onClick={() => remove(index)}
              disabled={fields.length <= 1}
              data-testid={`banner-${index}-delete-btn`}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <TextField
            label="Заголовок банера"
            fullWidth
            {...register(`bannerContents.${index}.title`)}
            error={Boolean(errors.bannerContents?.[index]?.title)}
            helperText={errors.bannerContents?.[index]?.title?.message ?? ""}
            slotProps={{ htmlInput: { 'data-testid': `banner-${index}-title-input` } }}
          />

          <TextField
            label="Підзаголовок банера"
            fullWidth
            {...register(`bannerContents.${index}.subtitle`)}
            error={Boolean(errors.bannerContents?.[index]?.subtitle)}
            helperText={errors.bannerContents?.[index]?.subtitle?.message ?? ""}
            slotProps={{ htmlInput: { 'data-testid': `banner-${index}-subtitle-input` } }}
          />
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" }, gap: 2 }}>

          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <BannerContentImageMedia index={index} />

            <TextField
              sx={{ mt: 3 }}
              label="Alt текст зображення"
              fullWidth
              {...register(`bannerContents.${index}.imageAlt`)}
              error={Boolean(errors.bannerContents?.[index]?.imageAlt)}
              helperText={errors.bannerContents?.[index]?.imageAlt?.message ?? ""}
              slotProps={{ htmlInput: { 'data-testid': `banner-${index}-image-alt-input` } }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <BannerContentImageMedia
              index={index}
              imageKey="bgImage"
              imageAltKey="bgImageAlt"
              label="Завантажити фонове зображення банера"
            />

            <TextField
              label="Alt текст фонового зображення"
              sx={{ mt: 3 }}
              fullWidth
              {...register(`bannerContents.${index}.bgImageAlt`)}
              error={Boolean(errors.bannerContents?.[index]?.bgImageAlt)}
              helperText={errors.bannerContents?.[index]?.bgImageAlt?.message ?? ""}
              slotProps={{ htmlInput: { 'data-testid': `banner-${index}-bg-image-alt-input` } }}
            />
          </Box>
          </Box>
        </Box>
      ))}

      <Stack direction="row" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={() => append({ title: "", subtitle: "", image: "", imageAlt: "" })}
          data-testid="banner-add-btn"
        >
          Add one
        </Button>

        <Button variant="contained" onClick={handleContentSubmit} disabled={isSaving} data-testid="company-content-save-btn">
          Зберегти
        </Button>
      </Stack>
    </Box>
  );
};

export default ContentSetting;
