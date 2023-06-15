/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LuggageIcon from '@mui/icons-material/Luggage';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import ModalPayment from '@reducer/payment/ModalPayment';
import {
  fetchGetTargetBooking,
  setIsCreateBookingSuccess,
} from '@reducer/payment/payment.slice';
import { IBookingRes, IConTextRouter } from '@utils/interface';
import { EStatusIBooking } from '@utils/enum';
import { fetchGetReviewsByUser } from '@reducer/review/review.slice';
import useMediaQuery from '@mui/material/useMediaQuery';
import Cookies from 'js-cookie';
import User from '@/reducer/user/User';
import Payment from '@/reducer/payment/Payment';
import Review from '@/reducer/review/Review';
import ColorTabs from '@/components/ColorTabs';
import { RootState, useAppDispatch } from '@/app/store';

const tabs = [
  {
    name: 'My Booking',
    component: <Payment />,
    icon: <LuggageIcon fontSize='medium' />,
  },
  {
    name: 'Reviews',
    component: <Review />,
    icon: <RateReviewIcon fontSize='medium' />,
  },
  {
    name: 'Account',
    component: <User />,
    icon: <ManageAccountsIcon fontSize='medium' />,
  },
];

const ResponsiveStack = styled(Stack)(({ theme }) => ({
  maxWidth: '80vw',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    flexDirection: 'column',
  },
}));

const ResponsiveCard = styled(Card)(({ theme }) => ({
  minWidth: 400,
  paddingLeft: 160,
  paddingTop: 10,
  border: 'none',
  borderRadius: '0px',
  backgroundColor: theme.vars.palette.secondary.main,
  [theme.breakpoints.down('lg')]: {
    paddingLeft: 80,
    minWidth: 300,
  },
  [theme.breakpoints.down('md')]: {
    paddingLeft: 2,
  },
}));

function AccountPage() {
  const { setIsOpenModalSignIn } = useOutletContext<IConTextRouter>();
  const matches900px = useMediaQuery('(max-width:900px)');
  const matches500px = useMediaQuery('(max-width:500px)');
  const [searchParams] = useSearchParams();
  const tabQuery = searchParams.get('tab');
  const numberBookingsRef = React.useRef<number>(0);
  const numberReviewsRef = React.useRef<number>(0);
  const [nameComponent, setNameComponent] = React.useState<string>(
    tabQuery || tabs[0].name
  );

  const [isOpenModalPayment, setIsOpenModalPayment] = React.useState<boolean>(false);
  const bookingRef = React.useRef<IBookingRes | null>(null);

  const is2FA = useSelector((state: RootState) => state.auth.is2FA, shallowEqual);

  const { targetBooking, isCreateBookingSuccess, statusPayment, count } = useSelector(
    (state: RootState) => state.payment,
    shallowEqual
  );

  const review = useSelector((state: RootState) => state.review, shallowEqual);

  const dispatch = useAppDispatch();

  const bookingId = searchParams.get('bookingId');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setNameComponent(newValue);
  };

  React.useEffect(() => {
    if (is2FA) {
      if (!targetBooking && bookingId) dispatch(fetchGetTargetBooking(bookingId));
    }
  }, [bookingId, is2FA]);

  React.useEffect(() => {
    if (bookingId && targetBooking && is2FA) {
      if (targetBooking.status === EStatusIBooking.PENDING) {
        setIsOpenModalPayment(true);
        bookingRef.current = targetBooking;
        if (isCreateBookingSuccess) dispatch(setIsCreateBookingSuccess(false));
      }
    }
  }, [targetBooking, is2FA, bookingId]);

  const oneItemGetReviewsRef = React.useRef<NodeJS.Timeout | null>(null);

  if (!oneItemGetReviewsRef.current) {
    oneItemGetReviewsRef.current = setTimeout(
      () => dispatch(fetchGetReviewsByUser({ isReview: false, page: 1 })),
      1500
    );
  }

  if (statusPayment === EStatusIBooking.PENDING) {
    numberBookingsRef.current = count;
  }

  if (!review.isReview) {
    numberReviewsRef.current = review.count;
  }

  React.useEffect(() => {
    if (!is2FA && !Cookies.get('userId')) {
      setIsOpenModalSignIn(true);
    }
  }, [is2FA]);

  if (!is2FA && !Cookies.get('userId')) {
    return (
      <Container maxWidth={false} disableGutters>
        <div style={{ minHeight: '40vh' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters>
      <ResponsiveStack flexDirection='row' mt={12} minHeight='50vh' columnGap={2}>
        <ResponsiveCard>
          <ColorTabs
            numberBadge={[numberBookingsRef.current, numberReviewsRef.current, 0]}
            tabs={tabs}
            value={nameComponent}
            handleChange={handleChange}
            orientation={matches900px ? 'horizontal' : 'vertical'}
            sx={{
              borderRight: 1,
              borderColor: 'divider',
              minHeight: matches900px ? 'auto' : 300,
            }}
            sxTab={{
              minHeight: 70,
              pl: matches500px ? 2 : 10,
              color: 'white',
            }}
          />
        </ResponsiveCard>
        {tabs.map(
          (tab) =>
            tab.name === nameComponent && (
              <Box sx={{ mt: 1, width: '100%' }} key={tab.name}>
                {tab.component}
              </Box>
            )
        )}
      </ResponsiveStack>
      {bookingRef.current && (
        <ModalPayment
          setIsOpenModal={setIsOpenModalPayment}
          isOpenModal={isOpenModalPayment}
          bookingPending={bookingRef.current}
        />
      )}
    </Container>
  );
}

export default AccountPage;
