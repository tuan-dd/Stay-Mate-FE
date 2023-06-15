import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { LoadingButton } from '@mui/lab';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Divider } from '@mui/material';
import { urlImagesTrending } from '@/utils/images';
import { fDate } from '@/utils/formatTime';
import { EStatusIBooking, EStatusRedux } from '@/utils/enum';
import { RootState, useAppDispatch } from '@/app/store';
import {
  IBookingResCustom,
  fetchCancelBooking,
  fetchGetTargetBooking,
} from './payment.slice';

const ResponsiveStack = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const ResponsiveStackTwo = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

function CardBooking({
  booking,
  i,
  severityStatus,
}: {
  booking: IBookingResCustom;
  i: number;
  severityStatus: 'success' | 'error' | 'info';
}) {
  const status = useSelector((state: RootState) => state.payment.status, shallowEqual);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const matches900px = useMediaQuery('(max-width:900px)');

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
    <Card sx={{ width: matches900px ? '90%' : '100%', marginX: 'auto' }}>
      <ResponsiveStack flexDirection='row' marginX='auto'>
        <Box
          width={matches900px ? '80%' : 300}
          height={matches900px ? 130 : 300}
          marginX='auto'
        >
          <img
            src={urlImagesTrending[i]}
            alt={booking.hotelId.hotelName}
            width='100%'
            height='100%'
          />
        </Box>
        {matches900px && <Divider sx={{ mt: 1 }} orientation='horizontal' flexItem />}
        <Stack padding={1.5} flexGrow={1}>
          <ResponsiveStackTwo
            flexDirection='row'
            justifyContent='space-between'
            spacing={1}
            flexGrow={1}
          >
            <Stack spacing={1}>
              <Typography
                onClick={() => navigate(searchParams)}
                textTransform='capitalize'
                color='primary'
                fontSize={matches900px ? 14 : 18}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {booking.hotelId.hotelName}
              </Typography>
              <Typography fontSize={matches900px ? 12 : 14}>
                Reservation code: {booking._id?.slice(11)}
              </Typography>

              {booking.rooms.map((room, index) => (
                <Typography
                  fontSize={matches900px ? 12 : 18}
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

              <Alert severity={severityStatus} sx={{ bgcolor: 'transparent', p: 0 }}>
                {booking.status}
              </Alert>
            </Stack>
            {matches900px && <Divider orientation='horizontal' flexItem />}
            <Stack flexDirection='row' justifyContent='flex-end' columnGap={1}>
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
            {matches900px && <Divider orientation='horizontal' flexItem />}
          </ResponsiveStackTwo>
          <Stack alignItems='flex-end'>
            {booking.status === EStatusIBooking.SUCCESS && (
              <Stack>
                <Alert
                  severity='warning'
                  sx={{
                    bgcolor: 'transparent',
                    fontSize: 12,
                    justifyContent: 'flex-end',
                  }}
                >
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
              </Stack>
            )}
            {booking.status === EStatusIBooking.PENDING && (
              <Box width={80} mr={2}>
                <Button onClick={() => handelPayment()}>Payment</Button>
              </Box>
            )}
          </Stack>
        </Stack>
      </ResponsiveStack>
    </Card>
  );
}

export default CardBooking;
