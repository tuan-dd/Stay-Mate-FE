/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Box, Stack, Typography } from '@mui/material';
import ColorTabs from '@/components/ColorTabs';
import { EStatusIBooking } from '@/utils/enum';
import { RootState, useAppDispatch } from '@/app/store';
import { fetchGetBookings } from './payment.slice';
import CardBooking from './CardBooking';

import { throttle } from '@/utils/utils';

const tabs = [
  { name: 'pending', statusPayment: EStatusIBooking.PENDING },
  { name: 'paid', statusPayment: EStatusIBooking.SUCCESS },
  { name: 'stayed', statusPayment: EStatusIBooking.STAY },
  { name: 'unpaid', statusPayment: EStatusIBooking.DECLINE },
  { name: 'cancel', statusPayment: EStatusIBooking.CANCEL },
];

function Payment() {
  const [statusBooking, setStatusBooking] = React.useState<string>(tabs[0].name);
  const [page, setPage] = React.useState<number>(1);

  const { bookings, errorMessage } = useSelector(
    (state: RootState) => ({
      bookings: state.payment.bookings,
      errorMessage: state.payment.errorMessage,
    }),
    shallowEqual
  );
  const dispatch = useAppDispatch();
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setStatusBooking(newValue);
  };

  const index = tabs.findIndex((tab) => tab.name === statusBooking);

  React.useEffect(() => {
    if (index > -1) {
      dispatch(fetchGetBookings({ page: 1, status: tabs[index].statusPayment }));
    }
    setPage(1);
  }, [statusBooking]);

  const fetchPage = () => {
    if (errorMessage || !bookings.length)
      return window.removeEventListener('scroll', tHandler);

    if (index > -1) {
      setPage(page + 1);
      return dispatch(
        fetchGetBookings({ page: page + 1, status: tabs[index].statusPayment })
      );
    }
    return false;
  };

  const onScroll = () => {
    const heightScroll = window.scrollY + window.innerHeight;

    if (heightScroll > (document.documentElement.scrollHeight * 18) / 20) fetchPage();
  };

  const tHandler = throttle(onScroll, 400);

  React.useEffect(() => {
    if (!errorMessage.length || page === 1) {
      window.addEventListener('scroll', tHandler);
    }
    return () => window.removeEventListener('scroll', tHandler);
  }, [errorMessage, page, bookings]);

  return (
    <>
      <Box ml={1}>
        <ColorTabs
          tabs={tabs}
          numberBadge={[]}
          value={statusBooking}
          handleChange={handleChange}
          orientation='horizontal'
          sxTab={{ justifyContent: 'center', minWidth: 150, p: 0 }}
        />
        <Stack spacing={3} mt={3}>
          {bookings.length ? (
            bookings.map((booking, i) => (
              <Box key={i}>
                <CardBooking booking={booking} i={i} />
              </Box>
            ))
          ) : (
            <Box>
              <Typography>Not booking</Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </>
  );
}

export default Payment;
