import { useEffect, useState } from 'react'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from '@/context/SnackbarContext'
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Typography,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Controller, useFieldArray, useForm, type SubmitErrorHandler } from 'react-hook-form';
import { useProductsOptionsStore } from '@/store/productsOptions'
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ProductOptionGroupDTO, ProductOptionGroupPayloadDTO } from '@/dto/types/products.dto';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 700 },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ProductsOptionsSchema = z.object({
    name: z.string().trim().min(1, 'Option group title is required'),
    type: z.enum(['single', 'multiple'], { message: 'Invalid option group type' }),
    required: z.boolean(),
    minSelected: z.number().int().nonnegative().nullable(),
    maxSelected: z.number().int().nonnegative().nullable(),
    values: z.array(z.object({
        label: z.string().trim().min(1, 'Option value label is required'),
        description: z.string().trim().nullable(),
        extraPrice: z.number().nonnegative().nullable(),
    })),
});

type ProductsOptionsFormValues = z.infer<typeof ProductsOptionsSchema>;

interface ProductsOptionsBaseProps {
    onCreateSuccess?: () => void;
}

type ProductsOptionsCreateProps = ProductsOptionsBaseProps & {
    type?: 'create';
    ProductsOptionsPropsData?: ProductOptionGroupPayloadDTO;
    optionGroupId?: never;
};

type ProductsOptionsEditProps = ProductsOptionsBaseProps & {
    type: 'edit';
    ProductsOptionsPropsData: ProductOptionGroupDTO;
    optionGroupId: string;
};

type ProductsOptionsProps = ProductsOptionsCreateProps | ProductsOptionsEditProps;

const ProductsOptionsPopUp = (props: ProductsOptionsProps) => {
    const { t } = useTranslation(['forms', 'messages', 'common'])
    const { onCreateSuccess } = props
    const type = props.type ?? 'create'
    const optionGroupId = props.type === 'edit' ? props.optionGroupId : undefined
    const sourceData = props.ProductsOptionsPropsData

    const { showSnackbar } = useSnackbar()
    const [open, setOpen] = useState(false);
    const {  updateProductOptionGroup, createProductOptionGroup } = useProductsOptionsStore()

    const {
        control,
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProductsOptionsFormValues>({
        resolver: zodResolver(ProductsOptionsSchema),
        defaultValues: {
            name: '',
            type: 'single',
            required: false,
            minSelected: null,
            maxSelected: null,
            values: [{ label: '', description: null, extraPrice: null }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'values',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onSubmit = async (data: ProductsOptionsFormValues) => {
        try {
            if (type === 'create') {
                await createProductOptionGroup(data);
                showSnackbar({ message: t('common:create'), severity: 'success' });
            } else if (type === 'edit' && optionGroupId) {
                await updateProductOptionGroup(optionGroupId, data);
                showSnackbar({ message: t('common:update'), severity: 'success' });
            }
            reset();
            handleClose();
            if (onCreateSuccess) onCreateSuccess();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('common:unknownError');
            showSnackbar({ message: errorMessage, severity: 'error' });
        }
    };

    const onInvalid: SubmitErrorHandler<ProductsOptionsFormValues> = () => {
        showSnackbar({ message: t('messages:pleaseFixFormErrors'), severity: 'error' });
    };

    useEffect(() => {
        if (sourceData) {
            setValue('name', sourceData.name);
            setValue('type', sourceData.type);
            setValue('required', sourceData.required ?? false);
            setValue('minSelected', sourceData.minSelected ?? null);
            setValue('maxSelected', sourceData.maxSelected ?? null);
            setValue(
                'values',
                sourceData.values.map((value) => ({
                    label: value.label,
                    description: value.description ?? null,
                    extraPrice: typeof value.extraPrice === 'number'
                        ? value.extraPrice
                        : (value.extraPrice?.amount ?? null),
                }))
            );
        } else {
            reset();
        }
    }, [sourceData, setValue, reset]);


    return (
        <div>
            {type === 'create' ? (
                <Button variant="outlined" onClick={handleOpen} data-testid="option-group-open-btn">
                    {t('forms:optionGroupNew')}
                </Button>
            ) : (
                <IconButton color="primary" onClick={handleOpen} data-testid="option-group-edit-btn">
                    <EditIcon />
                </IconButton>
            )}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {type === 'create' ? t('forms:optionGroupCreate') : t('forms:optionGroupEdit')}
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
                        onSubmit={handleSubmit(onSubmit, onInvalid)}
                    >
                        <TextField
                            label={t('forms:groupName')}
                            {...register('name')}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            fullWidth
                            slotProps={{ htmlInput: { 'data-testid': 'option-group-name-input' } }}
                        />

                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <FormControl error={!!errors.type}>
                                    <FormLabel>{t('forms:type')}</FormLabel>
                                    <RadioGroup
                                        row
                                        value={field.value}
                                        onChange={(event) => field.onChange(event.target.value)}
                                    >
                                        <FormControlLabel value="single" control={<Radio slotProps={{ input: { 'data-testid': 'option-group-type-single' } }} />} label={t('forms:typeSingle')} />
                                        <FormControlLabel value="multiple" control={<Radio slotProps={{ input: { 'data-testid': 'option-group-type-multiple' } }} />} label={t('forms:typeMultiple')} />
                                    </RadioGroup>
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="required"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={field.value}
                                            onChange={(event) => field.onChange(event.target.checked)}
                                            slotProps={{ input: { 'data-testid': 'option-group-required-checkbox' } }}
                                        />
                                    }
                                    label={t('forms:required')}
                                />
                            )}
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <TextField
                                label={t('forms:minSelected')}
                                type="number"
                                {...register('minSelected', {
                                    setValueAs: (value) => (value === '' ? null : Number(value)),
                                })}
                                error={!!errors.minSelected}
                                helperText={errors.minSelected?.message}
                                slotProps={{ htmlInput: { 'data-testid': 'option-group-min-selected-input' } }}
                            />
                            <TextField
                                label={t('forms:maxSelected')}
                                type="number"
                                {...register('maxSelected', {
                                    setValueAs: (value) => (value === '' ? null : Number(value)),
                                })}
                                error={!!errors.maxSelected}
                                helperText={errors.maxSelected?.message}
                                slotProps={{ htmlInput: { 'data-testid': 'option-group-max-selected-input' } }}
                            />
                        </Box>

                        <Divider />
                        <Typography variant="subtitle1">{t('forms:values')}</Typography>
                        {fields.map((field, index) => (
                            <Box
                                key={field.id}
                                sx={{
                                    p: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    label={t('forms:valueLabel', { index: index + 1 })}
                                    {...register(`values.${index}.label` as const)}
                                    error={!!errors.values?.[index]?.label}
                                    helperText={errors.values?.[index]?.label?.message}
                                    fullWidth
                                    inputProps={{ 'data-testid': `option-value-${index}-label-input` }}
                                />
                                <TextField
                                    label={t('forms:valueDescription', { index: index + 1 })}
                                    {...register(`values.${index}.description` as const, {
                                        setValueAs: (value) => (value === '' ? null : value),
                                    })}
                                    error={!!errors.values?.[index]?.description}
                                    helperText={errors.values?.[index]?.description?.message}
                                    fullWidth
                                    inputProps={{ 'data-testid': `option-value-${index}-description-input` }}
                                />
                                <TextField
                                    label={t('forms:valueExtraPrice', { index: index + 1 })}
                                    type="number"
                                    {...register(`values.${index}.extraPrice` as const, {
                                        setValueAs: (value) => (value === '' ? null : Number(value)),
                                    })}
                                    error={!!errors.values?.[index]?.extraPrice}
                                    helperText={errors.values?.[index]?.extraPrice?.message}
                                    fullWidth
                                    inputProps={{ 'data-testid': `option-value-${index}-extra-price-input` }}
                                />
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                    data-testid={`option-value-${index}-remove-btn`}
                                >
                                    {t('forms:removeValue')}
                                </Button>
                            </Box>
                        ))}

                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => append({ label: '', description: null, extraPrice: null })}
                            data-testid="option-add-value-btn"
                        >
                            {t('forms:addValue')}
                        </Button>

                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} data-testid="option-group-submit-btn">
                            {type === 'create' ? t('common:create') : t('common:update')}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )

}

export default ProductsOptionsPopUp