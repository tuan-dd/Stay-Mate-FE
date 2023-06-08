import { useFormContext, Controller } from 'react-hook-form';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { PropsForm } from '@/utils/interface';

function FMultiCheckbox({ name, label, options, ...other }: PropsForm) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        // field.value is option[] filter value no checked , if choose add again to field.value
        const onSelected = (selectedOption: string | number) =>
          field.value.includes(selectedOption)
            ? field.value.filter((value: string | number) => value !== selectedOption)
            : [...field.value, selectedOption];

        return (
          <FormGroup>
            {(options as (string | number)[]).map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={field.value.includes(option)}
                    onChange={() => field.onChange(onSelected(option))}
                  />
                }
                label={option}
                {...other}
              />
            ))}
          </FormGroup>
        );
      }}
    />
  );
}

export default FMultiCheckbox;
