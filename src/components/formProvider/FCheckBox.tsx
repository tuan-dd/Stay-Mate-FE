import { useFormContext, Controller } from 'react-hook-form';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { PropsForm } from '@/utils/interface';

// declare module '@mui/material' {
//   interface FormControlLabelProps {
//     control?: React.ReactElement<any, any>;
//   }
// }

function FCheckBox({ name, label, ...other }: PropsForm) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Checkbox {...field} checked={field.value} />}
        />
      }
      label={label}
      {...other}
    />
  );
}

export default FCheckBox;
