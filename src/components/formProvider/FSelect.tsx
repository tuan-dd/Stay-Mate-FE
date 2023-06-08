import { useFormContext, Controller } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { PropsForm } from '@/utils/interface';

function FSelect({ name, children, ...other }: PropsForm & TextFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          value={field.value}
          onChange={(e) => field.onChange(e)}
          // SelectProps={{ native: true }}
          error={!!error}
          helperText={error?.message}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}

export default FSelect;
