import { useState } from 'react';
import { useFormContext } from "react-hook-form";
import { FormHelperText, Stack } from "@mui/material";
import { useSnackbar } from "@/context/SnackbarContext";
import { extractErrorMessage } from "@/helpers/extractErrorMessage";
import FileUploadField from '@/components/ui/FileUploadField';
import type { CompanyInfoDTO } from "@/dto/types/companyInfo";
import type { Upload } from '@/store/uploadsStore';
import FilePrev from '@/components/ui/FilePrev';

const LogoFormMedia = () => {
	const [uploadedFile, setUploadedFile] = useState<Upload | null>(null);
	const { showSnackbar } = useSnackbar();

	const {
		setValue,
		getValues,
		watch,
		formState: { errors },
	} = useFormContext<CompanyInfoDTO>();

	const logoSrc = watch("companyLogo.src");
	const logoAlt = watch("companyLogo.alt");

	const handleFileChange = (file: File | null) => {
		if (!file) {
			setValue("companyLogo.src", "", { shouldDirty: true, shouldValidate: true });
			setUploadedFile(null);
		}
	};

	const handleUploadSuccess = (upload: Upload) => {
		setValue("companyLogo.src", upload.filePath || upload.fileUrl, { shouldDirty: true, shouldValidate: true });
		if (!getValues("companyLogo.alt")) {
			setValue("companyLogo.alt", upload.fileName, { shouldDirty: true, shouldValidate: true });
		}
		setUploadedFile(upload);
	};

	const handleUploadError = (error: unknown) => {
		setValue("companyLogo.src", "", { shouldDirty: true, shouldValidate: true });
		setUploadedFile(null);
		showSnackbar({
			message: extractErrorMessage(error, "Не вдалося завантажити логотип"),
			severity: "error",
		});
	};

	const handleDeletePreview = () => {
		setValue("companyLogo.src", "", { shouldDirty: true, shouldValidate: true });
		setUploadedFile(null);
	};

	return (
		<Stack spacing={1}>
			{logoSrc ? (
				<FilePrev
					file={
						uploadedFile
							? uploadedFile
							: {
								  fileName: logoSrc.split("/").pop() || logoAlt || "Company logo",
								  filePath: logoSrc,
								  fileUrl: logoSrc.startsWith("http") ? logoSrc : undefined,
								  mimeType: "image/*",
							  }
					}
					onDetelete={handleDeletePreview}
				/>
			) : null}

			<FileUploadField
				label="Завантажити логотип"
				onFileChange={handleFileChange}
				accept="image/*"
				autoUpload
				onUploadSuccess={handleUploadSuccess}
				onUploadError={handleUploadError}
				dataTestId="company-logo-upload"
			/>

			{errors.companyLogo?.src?.message ? (
				<FormHelperText error>{errors.companyLogo.src.message}</FormHelperText>
			) : null}
		</Stack>
	);
};

export default LogoFormMedia;