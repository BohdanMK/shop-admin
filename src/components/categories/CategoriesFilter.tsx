import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Drawer,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
  Stack,
  Badge,
} from "@mui/material";
import { useCategoriesStore } from "@/store/categoriesStore";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

interface FilterState {
  search: string;
}

const CategoriesFilter = () => {
  const { t } = useTranslation(["common", "filters"]);
  const [open, setOpen] = useState(false);
  const setFilters = useCategoriesStore((state) => state.setFilters);
  const categoriesOptions = useCategoriesStore(
    (state) => state.categoriesOptions,
  );

  const [local, setLocal] = useState<FilterState>({
    search: categoriesOptions.search ?? "",
  });

  useEffect(() => {
    setLocal({
      search: categoriesOptions.search ?? "",
    });
  }, [categoriesOptions.search]);

  const activeCount = [categoriesOptions.search?.trim()].filter(Boolean).length;

  const handleApply = () => {
    setFilters({
      search: local.search,
    });
    setOpen(false);
  };

  const handleReset = () => {
    const empty: FilterState = {
      search: "",
    };
    setLocal(empty);
    setFilters(empty);
    setOpen(false);
  };

  return (
    <>
      <Badge badgeContent={activeCount} color="primary">
        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          onClick={() => setOpen(true)}
          data-testid="categories-filter-open-btn"
        >
          {t("common:filters")}
        </Button>
      </Badge>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 320,
            p: 3,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">{t("common:filters")}</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 3 }} />
          <Typography variant="subtitle2" mb={1}>
            {t("common:searchByName")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={local.search}
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              setLocal((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder={t("filters:categoryPlaceholder")}
            slotProps={{
              htmlInput: { "data-testid": "categories-filter-search-input" },
            }}
          />
          <Box
            sx={{
              mt: "auto",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={handleReset}
              data-testid="categories-filter-reset-btn"
            >
              {t("common:reset")}
            </Button>
            <Button
              variant="contained"
              onClick={handleApply}
              data-testid="categories-filter-apply-btn"
            >
              {t("common:apply")}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default CategoriesFilter;
