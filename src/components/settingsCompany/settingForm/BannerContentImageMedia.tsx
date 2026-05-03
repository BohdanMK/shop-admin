import { useState } from "react";
import { FormHelperText, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useSnackbar } from "@/context/SnackbarContext";
import { extractErrorMessage } from "@/helpers/extractErrorMessage";
import type { CompanyInfoDTO } from "@/dto/types/companyInfo";
import FileUploadField from "@/components/ui/FileUploadField";
import FilePrev from "@/components/ui/FilePrev";
import type { Upload } from "@/store/uploadsStore";

type BannerImageKey = "image" | "bgImage";
type BannerImageAltKey = "imageAlt" | "bgImageAlt";

interface BannerContentImageMediaProps {
  index: number;
  imageKey?: BannerImageKey;
  imageAltKey?: BannerImageAltKey;
  label?: string;
}

const BannerContentImageMedia = ({
  index,
  imageKey = "image",
  imageAltKey = "imageAlt",
  label = "Завантажити зображення банера",
}: BannerContentImageMediaProps) => {
  const [uploadedFile, setUploadedFile] = useState<Upload | null>(null);
  const { showSnackbar } = useSnackbar();

  const {
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<CompanyInfoDTO>();

  const imagePath = `bannerContents.${index}.${imageKey}` as const;
  const imageAltPath = `bannerContents.${index}.${imageAltKey}` as const;

  const bannerImage = watch(imagePath);
  const bannerImageAlt = watch(imageAltPath);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setValue(imagePath, "", { shouldDirty: true, shouldValidate: true });
      setUploadedFile(null);
    }
  };

  const handleUploadSuccess = (upload: Upload) => {
    setValue(imagePath, upload.filePath || upload.fileUrl, { shouldDirty: true, shouldValidate: true });
    if (!getValues(imageAltPath)) {
      setValue(imageAltPath, upload.fileName, { shouldDirty: true, shouldValidate: true });
    }
    setUploadedFile(upload);
  };

  const handleUploadError = (error: unknown) => {
    setValue(imagePath, "", { shouldDirty: true, shouldValidate: true });
    setUploadedFile(null);
    showSnackbar({
      message: extractErrorMessage(error, "Не вдалося завантажити зображення банера"),
      severity: "error",
    });
  };

  const handleDeletePreview = () => {
    setValue(imagePath, "", { shouldDirty: true, shouldValidate: true });
    setUploadedFile(null);
  };

  return (
    <Stack spacing={1}>
      {bannerImage ? (
        <FilePrev
          file={
            uploadedFile
              ? uploadedFile
              : {
                  fileName: bannerImage.split("/").pop() || bannerImageAlt || "Banner image",
                  filePath: bannerImage,
                  fileUrl: bannerImage.startsWith("http") ? bannerImage : undefined,
                  mimeType: "image/*",
                }
          }
          onDetelete={handleDeletePreview}
        />
      ) : null}

      <FileUploadField
        label={label}
        onFileChange={handleFileChange}
        accept="image/*"
        autoUpload
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        dataTestId={`banner-${index}-${imageKey}-upload`}
      />

      {errors.bannerContents?.[index]?.[imageKey]?.message ? (
        <FormHelperText error>{errors.bannerContents[index]?.[imageKey]?.message}</FormHelperText>
      ) : null}
    </Stack>
  );
};

export default BannerContentImageMedia;