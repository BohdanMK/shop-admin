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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { useOrdersStore } from "@/store/ordersStore";

type OrderStatus = "pending" | "confirmed" | "processing";

interface FilterState {
  name: string;
  phone: string;
  cityName: string;
  status: OrderStatus | "";
}

interface OrdersFilterProps {}

const OrdersFilter = ({}: OrdersFilterProps) => {
  const { t } = useTranslation(["common", "tables"]);
  const [open, setOpen] = useState(false);
  const setFilters = useOrdersStore((state) => state.setFilters);
  const ordersOptions = useOrdersStore((state) => state.ordersOptions);
  const [local, setLocal] = useState<FilterState>({
    name: ordersOptions.name ?? "",
    phone: ordersOptions.phone ?? "",
    cityName: ordersOptions.cityName ?? "",
    status: ordersOptions.status ?? "",
  });
  useEffect(() => {
    setLocal({
      name: ordersOptions.name ?? "",
      phone: ordersOptions.phone ?? "",
      cityName: ordersOptions.cityName ?? "",
      status: ordersOptions.status ?? "",
    });
  }, [
    ordersOptions.name,
    ordersOptions.phone,
    ordersOptions.cityName,
    ordersOptions.status,
  ]);

  const activeCount = [
    ordersOptions.name?.trim(),
    ordersOptions.phone?.trim(),
    ordersOptions.cityName?.trim(),
    ordersOptions.status?.trim(),
  ].filter(Boolean).length;

  const handleApply = () => {
    setFilters({
      name: local.name.trim() || undefined,
      phone: local.phone.trim() || undefined,
      cityName: local.cityName.trim() || undefined,
      status: (local.status.trim() as OrderStatus) || undefined,
    });
    setOpen(false);
  };

  const handleReset = () => {
    const empty: FilterState = {
      name: "",
      phone: "",
      cityName: "",
      status: "",
    };
    setLocal(empty);
    setFilters({
      name: undefined,
      phone: undefined,
      cityName: undefined,
      status: undefined,
    });
    setOpen(false);
  };

  return (
    <>
      <Badge badgeContent={activeCount} color="primary">
        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          onClick={() => setOpen(true)}
          data-testid="orders-filter-open-btn"
        >
          {t("common:filters")}
        </Button>
      </Badge>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 300,
            p: 2,
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

          {/* Search */}
          <Typography variant="subtitle2" mb={1}>
            {t("common:searchByName")}
          </Typography>
          <TextField
            size="small"
            placeholder={t("common:searchPlaceholder")}
            value={local.name}
            onChange={(e) =>
              setLocal((prev) => ({ ...prev, name: e.target.value }))
            }
            fullWidth
            sx={{ mb: 3 }}
            slotProps={{
              htmlInput: { "data-testid": "orders-filter-name-input" },
            }}
            InputLabelProps={{ shrink: true }}
          />

          {/*status select*/}
          <FormControl size="small" fullWidth sx={{ mb: 3 }}>
            <InputLabel id="status-label">
              {t("tables:orders.status")}
            </InputLabel>
            <Select
              labelId="status-label"
              value={local.status}
              label={t("tables:orders.status")}
              onChange={(e) =>
                setLocal((prev) => ({
                  ...prev,
                  status: e.target.value as OrderStatus | "",
                }))
              }
              data-testid="orders-filter-status-select"
            >
              <MenuItem value="">{t("common:all")}</MenuItem>
              <MenuItem value="pending">{t("tables:orders.pending")}</MenuItem>
              <MenuItem value="confirmed">
                {t("tables:orders.confirmed")}
              </MenuItem>
              <MenuItem value="processing">
                {t("tables:orders.processing")}
              </MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: "auto" }}>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" justifyContent="space-between">
              <Button
                onClick={handleReset}
                data-testid="orders-filter-reset-btn"
              >
                {t("common:reset")}
              </Button>
              <Button
                variant="contained"
                onClick={handleApply}
                data-testid="orders-filter-apply-btn"
              >
                {t("common:apply")}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default OrdersFilter;
