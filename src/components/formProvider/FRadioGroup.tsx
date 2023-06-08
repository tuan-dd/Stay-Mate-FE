import { useFormContext, Controller } from 'react-hook-form';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import { PropsForm } from '@/utils/interface';

function FRadioGroup({ name, options, getOptionLabel, ...other }: PropsForm) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <RadioGroup
            {...field}
            {...other}
            onChange={(_event, value) => field.onChange(value)}
          >
            <Stack rowGap={1}>
              {(options as (string | number)[]).map((option, i) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={getOptionLabel?.length ? getOptionLabel[i] : option}
                />
              ))}
            </Stack>
          </RadioGroup>
          {!!error && (
            <FormHelperText error sx={{ px: 2 }}>
              {error.message}
            </FormHelperText>
          )}
        </>
      )}
    />
  );
}

export default FRadioGroup;
