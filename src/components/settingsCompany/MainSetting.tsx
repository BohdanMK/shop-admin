import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { CompanyInfoDTO } from "@/dto/types/companyInfo";
import { useSnackbar } from "@/context/SnackbarContext";
import { extractErrorMessage } from "@/helpers/extractErrorMessage";
import { useCompanyInfoStore } from "@/store/companyInfo";
import LogoFormMedia from "@/components/settingsCompany/settingForm/LogoFormMedia";

const MainSetting = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { showSnackbar } = useSnackbar();
  const updateCompanyInfo = useCompanyInfoStore((state) => state.updateCompanyInfo);

  const {
    register,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext<CompanyInfoDTO>();

  const handleMainSubmit = async () => {
    const isValid = await trigger([
      "companyTitle",
      "companyLogo.src",
      "companyLogo.alt",
    ]);

    if (!isValid) {
      return;
    }

    try {
      setIsSaving(true);
      await updateCompanyInfo(getValues());
      showSnackbar({ message: "Налаштування збережено", severity: "success" });
    } catch (error) {
      showSnackbar({
        message: extractErrorMessage(error, "Не вдалося зберегти налаштування"),
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "40vw" }}>
    <Typography variant="h6">Main settings</Typography>

    <TextField
      label="Назва компанії"
      fullWidth
      {...register("companyTitle")}
      error={Boolean(errors.companyTitle)}
      helperText={errors.companyTitle?.message ?? ""}
      slotProps={{ htmlInput: { 'data-testid': 'company-title-input' } }}
    />

    <LogoFormMedia />

    <TextField
      label="Alt текст логотипа"
      fullWidth
      {...register("companyLogo.alt")}
      error={Boolean(errors.companyLogo?.alt)}
      helperText={errors.companyLogo?.alt?.message ?? ""}
      slotProps={{ htmlInput: { 'data-testid': 'company-logo-alt-input' } }}
    />

    <Stack direction="row" justifyContent="flex-end">
      <Button variant="contained" onClick={handleMainSubmit} disabled={isSaving} data-testid="company-main-save-btn">
        Зберегти
      </Button>
    </Stack>
  </Box>
  );
};

export default MainSetting
