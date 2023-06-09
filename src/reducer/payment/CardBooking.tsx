import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { LoadingButton } from '@mui/lab';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { urlImagesTrending } from '@/utils/images';
import { fDate } from '@/utils/formatTime';
import { EStatusIBooking, EStatusRedux } from '@/utils/enum';
import { RootState, useAppDispatch } from '@/app/store';
import {
  IBookingResCustom,
  fetchCancelBooking,
  fetchGetTargetBooking,
} from './payment.slice';

function CardBooking({ booking, i }: { booking: IBookingResCustom; i: number }) {
  const status = useSelector((state: RootState) => state.payment.status, shallowEqual);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const objectParams = {
    destination: booking.hotelId.hotelName,
    country: booking.hotelId.country,
    city: booking.hotelId.city,
    startDate: fDate(undefined),
    endDate: fDate(new Date().getTime() + 1000 * 60 * 60 * 24),
    rooms: '1',
    adults: '2',
    children: '0',
  };

  const searchParams = `/hotel/${booking.hotelId._id}?${new URLSearchParams(
    objectParams
  ).toString()}`;

  const handelCancel = () => {
    dispatch(
      fetchCancelBooking({
        bookingId: booking._id as string,
        hotelId: booking.hotelId._id,
        total: booking.total,
      })
    );
  };

  const handelPayment = () => {
    navigate(`/account?bookingId=${booking._id}`);
    dispatch(fetchGetTargetBooking(booking._id as string));
  };

  return (
    <Card>
      <Stack>
        <Stack flexDirection='row'>
          <Box width={300} height={300}>
            <img
              src={urlImagesTrending[i]}
              alt={booking.hotelId.hotelName}
              width='100%'
              height='100%'
            />
          </Box>
          <Box padding={1.5} flexGrow={1}>
            <Stack flexDirection='row' justifyContent='space-between'>
              <Stack spacing={1}>
                <Typography
                  onClick={() => navigate(searchParams)}
                  textTransform='capitalize'
                  color='primary'
                  fontSize={18}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {booking.hotelId.hotelName}
                </Typography>
                <Typography fontSize={14}>
                  Reservation code: {booking._id?.slice(11)}
                </Typography>
                {booking.rooms.map((room, index) => (
                  <Typography
                    variant='body1'
                    key={index}
                    color='primary'
                    onClick={() => navigate(searchParams)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {room.quantity} {room.roomTypeId.nameOfRoom}
                  </Typography>
                ))}
                <Alert severity='success' sx={{ bgcolor: 'transparent', p: 0 }}>
                  {booking.status}
                </Alert>
              </Stack>
              <Stack flexDirection='row' ml={15} columnGap={1}>
                <Box>
                  <Typography textAlign='center' variant='body2'>
                    Check in
                  </Typography>
                  <Typography fontSize={14}>
                    {fDate(booking.startDate, 'HH:mm-DD-MM-YYYY')}
                  </Typography>
                </Box>
                <Box>
                  <Typography textAlign='center' variant='body2'>
                    Check out
                  </Typography>
                  <Typography fontSize={14}>
                    {fDate(booking.endDate, 'HH:mm-DD-MM-YYYY')}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
            <Box sx={{ position: 'absolute', bottom: 10, right: 4 }}>
              {booking.status === EStatusIBooking.SUCCESS && (
                <Box>
                  <Alert severity='info' sx={{ bgcolor: 'transparent', fontSize: 12 }}>
                    The room can only be canceled if done at least 12 hours before the
                    check-in time.
                  </Alert>
                  <LoadingButton
                    loading={status === EStatusRedux.pending}
                    onClick={() => handelCancel()}
                    sx={{ px: '90%', width: 100, fontSize: 10 }}
                  >
                    Cancel
                  </LoadingButton>
                  {booking.errorMessage && (
                    <Typography fontSize={12} color='red' textAlign='end' mr={2}>
                      {booking.errorMessage}
                    </Typography>
                  )}
                </Box>
              )}
              {booking.status === EStatusIBooking.PENDING && (
                <Box>
                  <Button onClick={() => handelPayment()}>Payment</Button>
                </Box>
              )}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}

export default CardBooking;
