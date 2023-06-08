import dayjs from 'dayjs';
import { useFormContext, Controller } from 'react-hook-form';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import { PropsForm } from '@/utils/interface';
import { fDate } from '@/utils/formatTime';

function FDatePicker({ name, label, ...other }: PropsForm) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, ...field },
        fieldState: { error, invalid },
      }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
            components={['DateTimePicker']}
            sx={{ width: 600, borderRadius: 'none' }}
          >
            <Box>
              <DatePicker
                {...other}
                format='DD-MM-YYYY'
                label={label}
                value={dayjs(field.value, 'DD-MM-YYYY')}
                onChange={(newValue) => onChange(fDate(newValue as unknown as Date))}
                slotProps={{
                  textField: {
                    color: 'secondary',
                    focused: true,
                    // inputProps: { min: 0, style: { textAlign: 'center' } },
                    sx: { '.MuiFormHelperText-root': { textAlign: 'center' } },
                    helperText: !!error && invalid ? error?.message : '',
                  },
                }}
              />
            </Box>
          </DemoContainer>
        </LocalizationProvider>
      )}
    />
  );
}

export default FDatePicker;

/* <LocalizationProvider dateAdapter={AdapterDayjs}>
<DemoContainer components={['DateTimeField']}>
  <DateTimeField
    label='Controlled field'
    value={new Date()}
    onChange={(date) => field.onChange(dayjs(date).format('DD/MM/YYYY'))}
    helperText={error?.message}
    format='DD/MM/YYYY'
    inputProps={
      <TextField
        error={invalid}
        helperText={invalid ? error?.message : null}
        id='dateOfBirth'
        variant='standard'
        margin='dense'
        fullWidth
        color='primary'
      />
    }
    // {...other}
  />
</DemoContainer>
</LocalizationProvider> */
