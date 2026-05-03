import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "react-i18next";

const AuthForm = () => {
  const { login } = useAuthStore();
  const { t } = useTranslation(["auth", "common"]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (error) {
      alert(
        `${t("auth:loginError")}: ${error instanceof Error ? error.message : t("common:unknownError")}`,
      );
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, width: 400 }}>
      <Typography variant="h5" mb={3} textAlign="center">
        {t("auth:title")}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label={t("auth:username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
          slotProps={{ htmlInput: { "data-testid": "auth-username-input" } }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label={t("auth:password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          slotProps={{ htmlInput: { "data-testid": "auth-password-input" } }}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          data-testid="auth-submit-btn"
        >
          {t("auth:login")}
        </Button>
      </Box>
    </Paper>
  );
};

export default AuthForm;
