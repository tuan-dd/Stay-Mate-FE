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
import { debounce, isValidStartDate } from '@/utils/utils';
import { urlImagesTrending } from '@/utils/images';
import { IOrderRes } from '@/utils/interface';
import DatePickerCustom from './DatePicker';
import { useAppDispatch } from '@/app/store';
import { fetchDeleteOrder, fetchUpdateOrder } from '@/reducer/cart/cart.slice';
import { fDate } from '@/utils/formatTime';
import { fetchCreateBooking } from '../payment/payment.slice';

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
  const [timeStay, setTimeStay] = React.useState<[string, string]>([
    fDate(order.startDate, 'YYYY-MM-DD'),
    fDate(order.endDate, 'YYYY-MM-DD'),
  ]);
  const [isErrorDate, setIsErrorDate] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const updateOrder = cloneDeep(order);

  const handelBooking = () => {
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
        <Stack flexDirection='row' columnGap={1} alignItems='center'>
          <Box height='150px' maxWidth={200} minWidth={200}>
            <img
              src={urlImagesTrending[i]}
              loading='lazy'
              width='100%'
              height='100%'
              alt={order.hotelId.hotelName}
            />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              rowGap: 1,
              flexDirection: 'column',
            }}
          >
            <Typography>{order.hotelId.hotelName} </Typography>
            <Typography>{order.hotelId.city} </Typography>
            <Rating value={order.hotelId.star} size='small' readOnly />
            {isErrorDate && (
              <Alert severity='warning' sx={{ bgcolor: 'transparent' }}>
                A start date must be equal to or greater than today`s date and an end date
                is greater than the Start date
              </Alert>
            )}
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
          </Box>
          <IconButton
            onClick={() => handelDeleteOrder(i)}
            sx={{ position: 'absolute', top: 1, right: 1 }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              minWidth: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography>
              Estimated price:
              <Typography component='span' variant='h4' color='primary.dark'>
                {' '}
                {Math.ceil(totalOrder)}
              </Typography>
            </Typography>
            <Button onClick={() => handelBooking()} disabled={isDisable || isErrorDate}>
              BOOK NOW
            </Button>
          </Box>
        </Stack>
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
                  sx={{ width: 80 }}
                  inputProps={{
                    min: 0,
                    max: room.roomTypeId.numberOfRoom,
                    step: 1,
                  }}
                />
                <Chip
                  sx={{ bgcolor: 'primary.main', maxWidth: 150 }}
                  label={room.roomTypeId.nameOfRoom}
                />
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}

export default FormCart;
