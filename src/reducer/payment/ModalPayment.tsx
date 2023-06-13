import React from 'react';
import { useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import LoadingButton from '@mui/lab/LoadingButton';
import dayjs from 'dayjs';
import { customScrollbar } from '@utils/utils';
import { RootState, useAppDispatch } from '@/app/store';
import { IBookingRes } from '@/utils/interface';
import BasicModal from '@/components/modal/BasicModal';
import { EStatusIBooking, EStatusRedux } from '@/utils/enum';
import { fetchGetBookings, fetchPaymentBooking } from './payment.slice';
import { fToNow } from '@/utils/formatTime';

const styleBox = {
  height: 'auto',
  overflowX: 'hidden',
  ml: 'auto',
  mr: 'auto',
  mt: 1,
  px: 3,
  maxHeight: 300,
  ...customScrollbar,
};

function ModalPayment({
  bookingPending,
  isOpenModal,
  setIsOpenModal,
}: {
  bookingPending: IBookingRes;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const time =
    dayjs(bookingPending?.createdAt).unix() +
    (bookingPending?.duration as number) / 1000 -
    dayjs().unix();

  const [isShowPw, setIsShowPw] = React.useState<boolean>(false);
  const [timeExpires, setTimeExpires] = React.useState<number>(time <= 0 ? 0 : time);
  const [isEmptyInput, setIsEmptyInput] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('Tuan310797');
  const { status, errorPaymentBooking, targetBooking, statusPayment } = useSelector(
    (state: RootState) => state.payment
  );
  const dispatch = useAppDispatch();

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password) return setIsEmptyInput(true);
    if (bookingPending)
      return dispatch(
        fetchPaymentBooking({
          password,
          bookingId: bookingPending._id as string,
          hotelId: bookingPending.hotelId._id,
          total: bookingPending.total as number,
        })
      );
    return false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPassword(e.target.value);
    if (e.target.value) setIsEmptyInput(false);
  };

  React.useEffect(() => {
    if (status === EStatusRedux.succeeded && !targetBooking) setIsOpenModal(false);
  }, [status]);

  const numberDay =
    parseInt(
      fToNow(bookingPending.endDate, bookingPending.startDate, true).slice(0, 1),
      10
    ) + 1 || 2;

  const refInterval = React.useRef<null | NodeJS.Timer>(null);

  React.useEffect(() => {
    if (timeExpires > 0)
      refInterval.current = setInterval(() => setTimeExpires((e) => e - 1), 1000);

    if (refInterval.current && !timeExpires) {
      setIsOpenModal(false);
      if (statusPayment === EStatusIBooking.PENDING)
        fetchGetBookings({ page: 1, status: EStatusIBooking.PENDING });
      clearInterval(refInterval.current);
    }
    return () => {
      if (refInterval.current) clearInterval(refInterval.current);
    };
  }, [timeExpires]);

  return (
    <BasicModal
      open={isOpenModal}
      setOpen={setIsOpenModal}
      sx={{ p: 0, width: 600, height: 'auto' }}
      disableGutters
    >
      {bookingPending && (
        <Card sx={{ height: '100%' }}>
          <form onSubmit={handelSubmit} style={{ height: '100%' }}>
            <Stack p={4} height='100%'>
              <Typography
                variant='h4'
                color='primary.dark'
                textAlign='center'
                textTransform='uppercase'
              >
                {bookingPending.hotelId.hotelName}
              </Typography>
              {errorPaymentBooking && (
                <Alert severity='warning' sx={{ bgcolor: 'transparent' }}>
                  {errorPaymentBooking}
                </Alert>
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Stack mt={3} sx={{ ...styleBox }}>
                  <Stack flexDirection='row' justifyContent='space-between'>
                    <Typography>
                      {dayjs(bookingPending.startDate).format('DD-MM-YYYY')} -{' '}
                      {dayjs(bookingPending.endDate).format('DD-MM-YYYY')}
                    </Typography>
                    <Typography>
                      {numberDay} days {(numberDay as number) - 1}{' '}
                      {(numberDay as number) - 1 < 2 ? 'night' : 'nights'}
                    </Typography>
                  </Stack>
                  {bookingPending.rooms.map((room, i) => (
                    <Box key={i}>
                      <Stack flexDirection='row' justifyContent='space-between'>
                        <Box>
                          <Typography>Room name: {room.roomTypeId.nameOfRoom}</Typography>
                          <Typography>Quantity : {room.quantity}</Typography>
                        </Box>
                        <Typography>Price: {room.roomTypeId.price}</Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
                <Typography textAlign='end' variant='h4'>
                  Total:{' '}
                  {Math.round(((bookingPending.total as number) + Number.EPSILON) * 100) /
                    100}
                </Typography>
              </Box>
              <TextField
                sx={{ mt: 1 }}
                value={password}
                name='password'
                label='Password'
                onChange={handleChange}
                type={isShowPw ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => setIsShowPw((e) => !e)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge='end'
                      >
                        {isShowPw ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={isEmptyInput}
                helperText={isEmptyInput && 'Password not empty'}
              />
              <LoadingButton loading={status === EStatusRedux.pending} type='submit'>
                Confirm
              </LoadingButton>
              {timeExpires !== 0 && (
                <Typography textAlign='center'>
                  Expires at:{' '}
                  {Math.floor(timeExpires / 60) < 10
                    ? `0${Math.floor(timeExpires / 60)}`
                    : `${Math.floor(timeExpires / 60)}`}
                  :
                  {timeExpires - Math.floor(timeExpires / 60) * 60 < 10
                    ? `0${timeExpires - Math.floor(timeExpires / 60) * 60}`
                    : timeExpires - Math.floor(timeExpires / 60) * 60}
                </Typography>
              )}
            </Stack>
          </form>
        </Card>
      )}
    </BasicModal>
  );
}

export default ModalPayment;
