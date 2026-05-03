import { useState } from "react";
import { Box, Button, FormHelperText, Stack, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import type { CompanyInfoDTO } from "@/dto/types/companyInfo";
import { useSnackbar } from "@/context/SnackbarContext";
import { extractErrorMessage } from "@/helpers/extractErrorMessage";
import { useCompanyInfoStore } from "@/store/companyInfo";
import AboutDescriptionEditor from "@/components/settingsCompany/settingForm/AboutDescriptionEditor";

const AboutAsSettings = () => {
    const [isSaving, setIsSaving] = useState(false);
    const { showSnackbar } = useSnackbar();
    const updateCompanyInfo = useCompanyInfoStore((state) => state.updateCompanyInfo);

    const {
        control,
        trigger,
        getValues,
        formState: { errors },
    } = useFormContext<CompanyInfoDTO>();

    const handleAboutSubmit = async () => {
        const isValid = await trigger(["aboutDescription"]);

        if (!isValid) {
            return;
        }

        try {
            setIsSaving(true);
            await updateCompanyInfo(getValues());
            showSnackbar({ message: "Опис збережено", severity: "success" });
        } catch (error) {
            showSnackbar({
                message: extractErrorMessage(error, "Не вдалося зберегти опис"),
                severity: "error",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "40vw" }}>
            <Typography variant="h6">About settings</Typography>

            <Controller
                name="aboutDescription"
                control={control}
                render={({ field }) => (
                    <AboutDescriptionEditor
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        data-testid="company-about-editor"
                    />
                )}
            />

            {errors.aboutDescription?.message ? (
                <FormHelperText error>{errors.aboutDescription.message}</FormHelperText>
            ) : null}

            <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={handleAboutSubmit} disabled={isSaving} data-testid="company-about-save-btn">
                    Зберегти
                </Button>
            </Stack>
        </Box>
    );
};

export default AboutAsSettings;