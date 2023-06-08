import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import { fDate } from '@/utils/formatTime';

function DatePickerCustom({
  date,
  label,
  onChangeDate,
  ...other
}: {
  date: string | Date;
  label: string;
  onChangeDate: (value: string, label: string) => void;
} & DatePickerProps<Dayjs>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']} sx={{ width: 350 }}>
        <Box>
          <DatePicker
            format='DD-MM-YYYY'
            label={label}
            value={dayjs(date, 'YYYY-MM-DD')}
            onChange={(newValue) => onChangeDate(fDate(newValue, 'YYYY-MM-DD'), label)}
            slotProps={{
              textField: {
                color: 'secondary',
                focused: true,
              },
            }}
            {...other}
          />
        </Box>
      </DemoContainer>
    </LocalizationProvider>
  );
}

export default DatePickerCustom;
