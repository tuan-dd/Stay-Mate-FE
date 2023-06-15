import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { fetchDeleteOrder } from '@reducer/cart/cart.slice';
import { EPackage } from '@utils/enum';
import FormCart from '@reducer/cart/FormCart';
import { fToNow } from '@utils/formatTime';
import useMediaQuery from '@mui/material/useMediaQuery';

import { RootState, useAppDispatch } from '@/app/store';

function CartPage() {
  const matchesMobile = useMediaQuery('(max-width:500px)');
  const navigate = useNavigate();
  const { cart } = useSelector((state: RootState) => state.cart, shallowEqual);
  const { targetBooking, isCreateBookingSuccess } = useSelector(
    (state: RootState) => state.payment,
    shallowEqual
  );
  const dispatch = useAppDispatch();

  const totalOrders = React.useMemo(() => {
    if (cart) {
      return cart?.orders.map((order) =>
        order.rooms
          .map((room) => {
            const numberDays =
              parseInt(fToNow(order.endDate, order.startDate, true).slice(0, 1), 10) || 1;

            return room.roomTypeId.price * room.quantity * numberDays;
          })
          .reduce((pre, cur) => pre + cur)
      );
    }
    return null;
  }, [cart?.orders]) || [null];
  const isDisable = cart?.orders.map(
    (order) => order.hotelId.isDelete || order.hotelId.package === EPackage.FREE
  ) || [false];

  const handelDeleteOrder = (index: number) => {
    if (cart)
      dispatch(
        fetchDeleteOrder({ createdAt: cart.orders[index].createdAt as Date, index })
      );
  };

  React.useEffect(() => {
    if (targetBooking && isCreateBookingSuccess) {
      navigate(`/account?bookingId=${targetBooking._id}`);
    }
  }, [targetBooking, isCreateBookingSuccess]);

  return (
    <Container maxWidth='md'>
      <Stack mt={18} spacing={2}>
        {cart?.orders.length ? (
          cart.orders.map((order, i) => (
            <Card key={i}>
              <FormCart
                order={order}
                totalOrder={totalOrders[i] || 0}
                i={i}
                isDisable={isDisable[i]}
                handelDeleteOrder={handelDeleteOrder}
              />
            </Card>
          ))
        ) : (
          <Stack alignItems='center' spacing={2} height='35vh'>
            <Box>
              <img
                src='https://cdn6.agoda.net/images/kite-js/illustrations/athena/baggage/group.svg'
                alt='icon'
                loading='lazy'
                width={matchesMobile ? '70px' : '100px'}
                height={matchesMobile ? '70px' : '100px'}
              />
            </Box>
            <Typography>Your cart is empty</Typography>
            <Button onClick={() => navigate('/')} variant='contained'>
              Search for travel
            </Button>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

export default CartPage;
