import {
  Stack,
  Button,
  TextField,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import type { ProductOptionsFormValues } from "@/components/product/ProductOptionsForm";

interface ProductOptionsFormMainProps {
  fields: any[];
  onRemove: (index: number) => void;
}

const ProductOptionsFormMain = ({
  fields,
  onRemove,
}: ProductOptionsFormMainProps) => {
  const { control } = useFormContext<ProductOptionsFormValues>();

  return (
    <Stack spacing={3}>
      {fields.map((groupField, groupIndex) => (
        <OptionGroupItem
          key={groupField.id}
          groupIndex={groupIndex}
          control={control}
          onRemove={() => onRemove(groupIndex)}
        />
      ))}
    </Stack>
  );
};

interface OptionGroupItemProps {
  groupIndex: number;
  control: any;
  onRemove: () => void;
  disabled?: boolean;
}

const OptionGroupItem = ({
  groupIndex,
  control,
  onRemove,
  disabled,
}: OptionGroupItemProps) => {
  const { t } = useTranslation(["forms"]);
  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({
    control,
    name: `optionGroups.${groupIndex}.values` as const,
  });

  return (
    <Stack
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Group Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Stack flex={1}>
          <Controller
            name={`optionGroups.${groupIndex}.name` as const}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("forms:groupName")}
                size="small"
                fullWidth
                slotProps={{
                  htmlInput: { "data-testid": "option-group-name-input" },
                }}
              />
            )}
          />
        </Stack>
        <IconButton
          color="error"
          size="small"
          aria-label="delete option group"
          onClick={onRemove}
          disabled={disabled}
          sx={{ ml: 1 }}
          data-testid="option-group-delete-btn"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Group Type */}
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <Controller
          name={`optionGroups.${groupIndex}.type` as const}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("forms:type")}
              size="small"
              select
              SelectProps={{
                native: true,
                inputProps: { "data-testid": "option-group-type-select" },
              }}
            >
              <option value="single">{t("forms:typeSingle")}</option>
              <option value="multiple">{t("forms:typeMultiple")}</option>
            </TextField>
          )}
        />
        <Stack>
          <Typography variant="caption" color="textSecondary">
            {t("forms:valuesCount", { count: valueFields.length })}
          </Typography>
        </Stack>
      </Stack>

      <Divider />

      {/* Values List */}
      <Stack spacing={1}>
        <Typography variant="subtitle2">{t("forms:optionValues")}</Typography>
        {valueFields.map((valueField, valueIndex) => (
          <Stack
            key={valueField.id}
            direction={{ xs: "column", sm: "row" }}
            gap={1}
            alignItems="flex-start"
            sx={{
              p: 1,
              bgcolor: "background.default",
              borderRadius: 0.5,
            }}
          >
            <Controller
              name={
                `optionGroups.${groupIndex}.values.${valueIndex}.label` as const
              }
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("forms:valueLabel", { index: valueIndex + 1 })}
                  size="small"
                  fullWidth
                  slotProps={{
                    htmlInput: { "data-testid": "option-value-label-input" },
                  }}
                />
              )}
            />
            <Controller
              name={
                `optionGroups.${groupIndex}.values.${valueIndex}.extraPrice.amount` as const
              }
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                  label={t("forms:valueExtraPrice", { index: valueIndex + 1 })}
                  size="small"
                  type="number"
                  slotProps={{
                    htmlInput: {
                      "data-testid": "option-value-extra-price-input",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body2" sx={{ mr: 0.5 }}>
                        +
                      </Typography>
                    ),
                    endAdornment: (
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        UAH
                      </Typography>
                    ),
                  }}
                />
              )}
            />

            <IconButton
              color="error"
              size="small"
              aria-label="delete value"
              onClick={() => removeValue(valueIndex)}
              data-testid="option-value-delete-btn"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      {/* Add Value Button */}
      <Button
        type="button"
        size="small"
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() =>
          appendValue({
            id: `value-${Date.now()}`,
            label: t("forms:newOption"),
          })
        }
        sx={{ alignSelf: "flex-start" }}
        data-testid="option-group-add-value-btn"
      >
        {t("forms:addValue")}
      </Button>
    </Stack>
  );
};

export default ProductOptionsFormMain;
