/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import ColorTabs from '@/components/ColorTabs';
import { EStatusIBooking } from '@/utils/enum';
import { RootState, useAppDispatch } from '@/app/store';
import { fetchGetBookings } from './payment.slice';
import CardBooking from './CardBooking';
import { throttle } from '@/utils/utils';

const tabs = [
  { name: 'pending', statusPayment: EStatusIBooking.PENDING, severityStatus: 'info' },
  { name: 'paid', statusPayment: EStatusIBooking.SUCCESS, severityStatus: 'success' },
  { name: 'stayed', statusPayment: EStatusIBooking.STAY, severityStatus: 'success' },
  { name: 'unpaid', statusPayment: EStatusIBooking.DECLINE, severityStatus: 'error' },
  { name: 'cancel', statusPayment: EStatusIBooking.CANCEL, severityStatus: 'error' },
];

function Payment() {
  const matches600px = useMediaQuery('(max-width:600px)');
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
          sxTab={{ justifyContent: 'center', minWidth: matches600px ? 70 : 120, p: 0 }}
        />
        <Stack spacing={3} mt={3}>
          {bookings.length ? (
            bookings.map((booking, i) => (
              <Box key={i}>
                <CardBooking
                  booking={booking}
                  i={i}
                  severityStatus={
                    tabs[index].severityStatus as 'success' | 'error' | 'info'
                  }
                />
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
