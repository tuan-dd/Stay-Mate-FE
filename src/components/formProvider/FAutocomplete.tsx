import { useFormContext, Controller } from 'react-hook-form';

import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import { PropsForm } from '@/utils/interface';
import { ResponsiveTextField } from './FTextField';

const ResponsiveAutocomplete = styled(Autocomplete)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: 200,
    '.MuiInputBase-input': {
      fontSize: 14,
    },
  },
}));
export default function FAutocomplete({
  name,
  options,
  label,
  placeholder,
  ...other
}: PropsForm) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
        <ResponsiveAutocomplete
          sx={{ pt: '8px' }}
          fullWidth
          value={field.value}
          freeSolo
          onChange={(_event, newInputValue) => field.onChange(newInputValue)}
          options={options as (string | number)[]}
          renderInput={(params) => (
            <ResponsiveTextField
              placeholder={placeholder}
              focused
              onChange={(e) => field.onChange(e.target.value)}
              {...params}
              {...other}
              label={label}
              inputRef={ref}
              error={invalid}
              helperText={error?.message}
              variant='outlined'
              fullWidth
              color='secondary'
            />
          )}
        />
      )}
    />
  );
}
