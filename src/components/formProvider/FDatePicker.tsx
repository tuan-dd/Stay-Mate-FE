import dayjs from 'dayjs';
import { useFormContext, Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import { PropsForm } from '@/utils/interface';
import { fDate } from '@/utils/formatTime';

const ResponsiveDatePicker = styled(DatePicker)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: 200,
    '.MuiInputBase-input': {
      fontSize: 14,
    },
  },
}));

const ResponsiveBox = styled('div')(({ theme }) => ({
  width: 450,
  display: 'flex',
  justifyContent: 'center',
  mx: 'auto',
  marginTop: 9,
  borderRadius: 'none',
  [theme.breakpoints.down('md')]: {
    width: 200,
  },
}));

function FDatePicker({ name, label, ...other }: PropsForm) {
  const { control } = useFormContext();
  const matches = useMediaQuery('(min-width:1200px)');
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, ...field },
        fieldState: { error, invalid },
      }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* <ResponsiveDemoContainer components={['DateTimePicker']}> */}
          <ResponsiveBox>
            <ResponsiveDatePicker
              {...other}
              format='DD-MM-YYYY'
              label={label}
              value={dayjs(field.value, 'DD-MM-YYYY')}
              onChange={(newValue) => onChange(fDate(newValue as unknown as Date))}
              slotProps={{
                textField: {
                  focused: true,
                  // inputProps: { min: 0, style: { textAlign: 'center' } },
                  sx: {
                    '.MuiFormHelperText-root': {
                      textAlign: 'center',
                      color: 'text.primary',
                      fontSize: matches ? 12 : 9,
                    },
                  },
                  helperText: !!error && invalid ? error?.message : '',
                },
              }}
            />
          </ResponsiveBox>
          {/* </ResponsiveDemoContainer> */}
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
