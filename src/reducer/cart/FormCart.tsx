/* eslint-disable prefer-destructuring */
import React from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { debounce, isValidStartDate } from '@/utils/utils';
import { urlImagesTrending } from '@/utils/images';
import { IOrderRes } from '@/utils/interface';
import DatePickerCustom from './DatePicker';
import { RootState, useAppDispatch } from '@/app/store';
import { fetchDeleteOrder, fetchUpdateOrder } from '@/reducer/cart/cart.slice';
import { fDate } from '@/utils/formatTime';
import { fetchCreateBooking } from '../payment/payment.slice';

const ResponsiveStack = styled(Stack)(({ theme }) => ({
  height: 300,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: 'auto',
    rowGap: 8,
  },

  [theme.breakpoints.down('sm')]: {},
}));

const ResponsiveStackTwo = styled(Stack)(({ theme }) => ({
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    columnGap: 10,
    flexDirection: 'row',
    width: '100%',
  },

  [theme.breakpoints.down('sm')]: {},
}));

const ResponsiveStackThree = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  [theme.breakpoints.down('sm')]: {},
}));
// const ResponsiveStackThree = styled(Stack)(({ theme }) => ({
//   [theme.breakpoints.down('md')]: {
//     flexDirection: 'column',
//   },

//   [theme.breakpoints.down('sm')]: {},
// }));

function FormCart({
  order,
  totalOrder,
  isDisable,
  i,
  handelDeleteOrder,
}: {
  order: IOrderRes;
  totalOrder: number;
  isDisable: boolean;
  i: number;
  handelDeleteOrder: (indexOrder: number) => void;
}) {
  const matchesMobile = useMediaQuery('(max-width:900px)');
  const [timeStay, setTimeStay] = React.useState<[string, string]>([
    fDate(order.startDate, 'YYYY-MM-DD'),
    fDate(order.endDate, 'YYYY-MM-DD'),
  ]);
  const [isErrorDate, setIsErrorDate] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const errorMessage = useSelector(
    (state: RootState) => state.payment.errorMessageCreateBooking
  );

  const updateOrder = cloneDeep(order);
  const navigate = useNavigate();
  const indexOrderCreateBookingRef = React.useRef<boolean>(false);

  const handelBooking = () => {
    if (!indexOrderCreateBookingRef.current) {
      dispatch(
        fetchCreateBooking({
          newBooking: {
            rooms: order.rooms,
            hotelId: order.hotelId,
            total: totalOrder,
            startDate: order.startDate,
            endDate: order.endDate,
            createdAt: order.createdAt,
            duration: 0,
          },
          i,
        })
      );
    }
    indexOrderCreateBookingRef.current = true;
  };

  const handelChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const index = order.rooms.findIndex((room) => room.roomTypeId._id === id);

    if (parseInt(e.target.value, 10) === 0) {
      updateOrder.rooms.splice(index, 1);
      if (!updateOrder.rooms.length) {
        return dispatch(
          fetchDeleteOrder({ createdAt: order.createdAt as Date, index: i })
        );
      }
      return dispatch(fetchUpdateOrder({ updateOrder, i }));
    }
    updateOrder.rooms[index].quantity = parseInt(e.target.value, 10);
    return dispatch(fetchUpdateOrder({ updateOrder, i }));
  };

  const handelChangeTimeStay = (date: string, label: string) => {
    let isValidStart = false;
    let isValidEnd = false;
    if (label === 'Start') {
      isValidStart = isValidStartDate(date);
      isValidEnd = dayjs(timeStay[1]).isAfter(date, 'day');
      // console.log(!isValidStart, isValidEnd, label);
      setTimeStay((e) => [date, e[1]]);
      if (isValidStart) {
        updateOrder.startDate = date;
        updateOrder.endDate = timeStay[1];
      }
    } else {
      isValidStart = isValidStartDate(timeStay[0]);
      isValidEnd = dayjs(date).isAfter(timeStay[0], 'day');

      setTimeStay((e) => [e[0], date]);
      if (isValidEnd) {
        updateOrder.startDate = timeStay[0];
        updateOrder.endDate = date;
      }
    }
    if (isValidStart && isValidEnd) {
      dispatch(fetchUpdateOrder({ updateOrder, i }));
      setIsErrorDate(false);
    } else {
      setIsErrorDate(true);
    }
  };

  const tDebounce = debounce(handelChangeQuantity, 700);

  React.useEffect(() => {
    setIsErrorDate(!isValidStartDate(timeStay[0]));
  }, []);

  return (
    <Stack p={1} spacing={2}>
      <Box>
        <ResponsiveStack flexDirection='row' columnGap={2} alignItems='center'>
          <Box
            height={matchesMobile ? '180px' : '150px'}
            width={matchesMobile ? '65%' : 200}
          >
            <img
              src={urlImagesTrending[i]}
              loading='lazy'
              width='100%'
              height='100%'
              alt={order.hotelId.hotelName}
            />
          </Box>
          <Divider orientation={matchesMobile ? 'horizontal' : 'vertical'} flexItem />
          <ResponsiveStackTwo
            spacing={2}
            sx={{
              flexGrow: 1,
              rowGap: 1,
            }}
          >
            <ResponsiveStackThree flexGrow={1}>
              <Typography fontSize={matchesMobile ? 12 : 20} color='primary.dark'>
                {order.hotelId.hotelName}{' '}
              </Typography>
              <Rating value={order.hotelId.star} size='small' readOnly />
            </ResponsiveStackThree>
            <Stack
              spacing={2}
              alignItems={matchesMobile ? 'center' : undefined}
              flexGrow={1}
            >
              <DatePickerCustom
                label='Start'
                date={timeStay[0]}
                onChangeDate={handelChangeTimeStay}
              />
              <DatePickerCustom
                label='End'
                date={timeStay[1]}
                onChangeDate={handelChangeTimeStay}
              />
            </Stack>
            {isErrorDate && (
              <Alert
                severity='warning'
                icon={
                  <PriorityHighIcon sx={{ display: matchesMobile ? 'none' : 'block' }} />
                }
                sx={{
                  bgcolor: 'transparent',
                  fontSize: matchesMobile ? 8 : 14,
                  width: matchesMobile ? 180 : '100%',
                  my: matchesMobile ? 'auto' : 0,
                  p: 0,
                }}
              >
                A start date must be equal to or greater than today`s date and an end date
                is greater than the Start date
              </Alert>
            )}
          </ResponsiveStackTwo>
          <Divider orientation={matchesMobile ? 'horizontal' : 'vertical'} flexItem />
          <Stack
            spacing={1}
            sx={{
              minWidth: 200,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography>
              Estimated price:
              <Typography component='span' variant='h4' color='primary.dark'>
                {' '}
                {Math.round((totalOrder + Number.EPSILON) * 100) / 100}
              </Typography>
            </Typography>
            <Button
              variant='contained'
              sx={{ mt: 1 }}
              onClick={() => handelBooking()}
              disabled={isDisable || isErrorDate}
            >
              Reserve
            </Button>
            {errorMessage && indexOrderCreateBookingRef.current && (
              <Button
                variant='outlined'
                onClick={() => navigate('/account?tab=Account')}
                sx={{ maxWidth: 200, fontSize: 12 }}
              >
                It`s very cheap, recharge now 😜
              </Button>
            )}
          </Stack>
        </ResponsiveStack>
      </Box>
      <Divider />
      <Box>
        <Grid container spacing={4}>
          {order.rooms.map((room, index) => (
            <Grid key={`${room.roomTypeId.nameOfRoom}${index}`} sm={6} item md={4}>
              <Stack alignItems='center' flexDirection='row' columnGap={1}>
                <TextField
                  disabled={isDisable || isErrorDate}
                  focused
                  defaultValue={room.quantity}
                  key={room.quantity}
                  type='number'
                  label='Quantity'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    tDebounce(e, room.roomTypeId._id)
                  }
                  sx={{
                    width: matchesMobile ? 60 : 80,

                    '.MuiFormLabel-root': {
                      fontSize: matchesMobile ? 10 : 16,
                    },
                    '.MuiInputBase-root': {
                      height: 40,
                    },
                    '.MuiInputBase-input': {
                      fontSize: matchesMobile ? 12 : 14,
                    },
                  }}
                  inputProps={{
                    min: 0,
                    max: room.roomTypeId.numberOfRoom,
                    step: 1,
                  }}
                />
                <Chip
                  sx={{ bgcolor: 'primary.main', fontSize: matchesMobile ? 8 : 12 }}
                  size={matchesMobile ? 'small' : 'medium'}
                  label={room.roomTypeId.nameOfRoom}
                />
              </Stack>
            </Grid>
          ))}
        </Grid>
        <IconButton
          onClick={() => handelDeleteOrder(i)}
          sx={{ position: 'absolute', top: 1, right: 1 }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Stack>
  );
}

export default FormCart;
