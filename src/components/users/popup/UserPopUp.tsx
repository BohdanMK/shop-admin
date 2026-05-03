import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { UserDTO } from "@/dto/types/users.dto";
import { useSnackbar } from "@/context/SnackbarContext";
import { Box, Button, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUsersStore } from "@/store/usersStore";

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

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  userName: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user", "moderator"], {
    message: "Role must be either admin or user",
  }),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

interface UserPopUpProps {
  user?: UserDTO;
  type?: "create" | "edit";
  userId?: string;
  onUpdateSuccess?: () => void;
}

const UserPopUp = ({ user, type, userId, onUpdateSuccess }: UserPopUpProps) => {
  const { t } = useTranslation(["forms", "messages", "common"]);
  const { showSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const updateUser = useUsersStore((state) => state.updateUser);
  const createUser = useUsersStore((state) => state.createUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      userName: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (data: CreateUserFormValues) => {
    try {
      if (type === "create") {
        await createUser(data);
        showSnackbar({
          message: t("messages:userCreated"),
          severity: "success",
        });
      } else if (type === "edit" && userId) {
        await updateUser(userId, data);
        showSnackbar({
          message: t("messages:userUpdated"),
          severity: "success",
        });
      }

      reset();
      handleClose();
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error) {
      showSnackbar({
        message: error instanceof Error ? error.message : String(error),
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (type === "edit" && user) {
      reset({
        name: user.name,
        userName: user.userName,
        email: user.email,
        password: "", // Password is not pre-filled for security reasons
        role: user.role,
      });
    }
  }, [type, user, reset]);

  return (
    <div>
      {type === "edit" ? (
        <IconButton
          color="primary"
          onClick={handleOpen}
          size="small"
          data-testid="user-edit-btn"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          onClick={handleOpen}
          data-testid="user-open-btn"
        >
          {t("common:newUser")}
        </Button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {type === "create" ? t("forms:createUser") : t("forms:editUser")}
          </Typography>
          <TextField
            label={t("forms:userName")}
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            slotProps={{ htmlInput: { "data-testid": "user-name-input" } }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t("forms:userLogin")}
            fullWidth
            margin="normal"
            {...register("userName")}
            error={!!errors.userName}
            helperText={errors.userName?.message}
            slotProps={{ htmlInput: { "data-testid": "user-username-input" } }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t("forms:userEmail")}
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            slotProps={{ htmlInput: { "data-testid": "user-email-input" } }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t("forms:userPassword")}
            type="password"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{ htmlInput: { "data-testid": "user-password-input" } }}
          />
          <FormControl fullWidth sx={{ mb: "20px" }}>
            <Select
              defaultValue="user"
              {...register("role")}
              error={!!errors.role}
              data-testid="user-role-select"
            >
              <MenuItem value="admin">{t("forms:roleAdmin")}</MenuItem>
              <MenuItem value="user">{t("forms:roleUser")}</MenuItem>
              <MenuItem value="moderator">{t("forms:roleModerator")}</MenuItem>
            </Select>
            {errors.role && (
              <Typography color="error">{errors.role.message}</Typography>
            )}
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            data-testid="user-submit-btn"
          >
            {t("common:submit")}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UserPopUp;
