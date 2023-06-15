import dayjs, { Dayjs } from 'dayjs';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DatePickerSlotsComponents } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { fDate } from '@/utils/formatTime';

const ResponsiveDatePicker = styled(DatePicker)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: 150,
    '.MuiInputBase-input': {
      fontSize: 14,
    },
  },
  [theme.breakpoints.down('sm')]: {
    width: 100,
    '.MuiInputBase-input': {
      fontSize: 8,
    },
  },
}));

function DatePickerCustom({
  date,
  label,
  onChangeDate,
  ...other
}: {
  date: string | Date;
  label: string;
  onChangeDate: (value: string, label: string) => void;
} & DatePickerSlotsComponents<Dayjs>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <DemoContainer components={['DateTimePicker']} sx={{ width: 350 }}> */}
      <Box>
        <ResponsiveDatePicker
          format='DD-MM-YYYY'
          label={label}
          value={dayjs(date, 'YYYY-MM-DD')}
          onChange={(newValue) =>
            onChangeDate(fDate(newValue as unknown as Date, 'YYYY-MM-DD'), label)
          }
          slotProps={{
            textField: {
              color: 'secondary',
              focused: true,
            },
          }}
          {...other}
        />
      </Box>
      {/* </DemoContainer> */}
    </LocalizationProvider>
  );
}

export default DatePickerCustom;
