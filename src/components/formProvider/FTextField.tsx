import { useFormContext, Controller } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { PropsForm } from '@/utils/interface';

function FTextField({ name, typeInput, min, max, ...other }: PropsForm & TextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          type={typeInput}
          autoComplete='true'
          {...field}
          value={field.value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (typeInput === 'number') {
              const value = parseInt(event.target.value, 10);
              if (typeof max === 'number' && value > max)
                return field.onChange(field.value);
              if (typeof min === 'number' && value < min)
                return field.onChange(field.value);
              if (!value && value !== 0) {
                return field.onChange('');
              }
              return field.onChange(value);
            }
            return field.onChange(event.target.value);
          }}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}
export default FTextField;
