import { useFormContext, Controller } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { PropsForm } from '@/utils/interface';

export const ResponsiveTextField = styled(TextField)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: 500,
  },
}));

function FTextField({ name, typeInput, min, max, ...other }: PropsForm & TextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <ResponsiveTextField
          type={typeInput}
          autoComplete='true'
          {...field}
          value={field.value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (typeInput === 'number') {
              const value = parseInt(event.target.value, 10);

              if (!event.target.value) {
                return field.onChange('');
              }
              if (typeof max === 'number' && value > max)
                return field.onChange(field.value);
              if (typeof min === 'number' && value < min)
                return field.onChange(field.value);

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
