import { useFormContext, Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { PropsForm } from '@/utils/interface';

function FSwitch({ name, label, ...other }: PropsForm) {
  const { control } = useFormContext();
  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Switch {...field} checked={field.value} />}
        />
      }
      label={label}
      {...other}
    />
  );
}

export default FSwitch;
