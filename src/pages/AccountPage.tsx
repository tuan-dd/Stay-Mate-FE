import React from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LuggageIcon from '@mui/icons-material/Luggage';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import User from '@/reducer/user/User';
import Payment from '@/reducer/payment/Payment';
import Review from '@/reducer/review/Review';
import ColorTabs from '@/components/ColorTabs';
import { RootState, useAppDispatch } from '@/app/store';
import ModalPayment from '@/reducer/payment/ModalPayment';
import {
  fetchGetTargetBooking,
  setIsCreateBookingSuccess,
} from '@/reducer/payment/payment.slice';
import { IBookingRes } from '@/utils/interface';
import { EStatusIBooking } from '@/utils/enum';
import { fetchGetReviewsByUser } from '@/reducer/review/review.slice';

const tabs = [
  {
    name: 'My Booking',
    component: <Payment />,
    icon: <LuggageIcon fontSize='large' />,
  },
  {
    name: 'Reviews',
    component: <Review />,
    icon: <RateReviewIcon fontSize='large' />,
  },
  {
    name: 'Account',
    component: <User />,
    icon: <ManageAccountsIcon fontSize='large' />,
  },
];

function AccountPage() {
  const [searchParams] = useSearchParams();
  const tabQuery = searchParams.get('tab');
  const navigate = useNavigate();
  const [nameComponent, setNameComponent] = React.useState<string>(
    tabQuery || tabs[0].name
  );

  const [isOpenModalPayment, setIsOpenModalPayment] = React.useState<boolean>(false);
  const bookingRef = React.useRef<IBookingRes | null>(null);

  const is2FA = useSelector((state: RootState) => state.auth.is2FA, shallowEqual);

  const { targetBooking, isCreateBookingSuccess, statusPayment, count } = useSelector(
    (state: RootState) => state.payment
  );

  const review = useSelector((state: RootState) => state.review);
  const dispatch = useAppDispatch();

  const bookingId = searchParams.get('bookingId');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setNameComponent(newValue);
  };

  React.useEffect(() => {
    if (!targetBooking && bookingId) dispatch(fetchGetTargetBooking(bookingId));
  }, [bookingId]);

  React.useEffect(() => {
    if (bookingId && targetBooking) {
      if (targetBooking.status === EStatusIBooking.PENDING) {
        if (isCreateBookingSuccess) dispatch(setIsCreateBookingSuccess(false));
        setIsOpenModalPayment(true);
        bookingRef.current = targetBooking;
      }
    }
  }, [targetBooking]);

  const oneItemGetReviewsRef = React.useRef<NodeJS.Timeout | null>(null);

  if (!oneItemGetReviewsRef.current) {
    oneItemGetReviewsRef.current = setTimeout(
      () => dispatch(fetchGetReviewsByUser({ isReview: false, page: 1 })),
      1500
    );
  }

  const numberBookingsRef = React.useRef<number>(0);

  if (statusPayment === EStatusIBooking.PENDING) {
    numberBookingsRef.current = count;
  }

  const numberReviewsRef = React.useRef<number>(0);

  if (!review.isReview) {
    numberReviewsRef.current = review.count;
  }

  React.useEffect(() => {
    if (!is2FA) {
      navigate('/');
    }
  }, [is2FA]);

  return (
    <Container maxWidth={false} disableGutters>
      <Stack flexDirection='row' mt={12} minHeight='50vh' maxWidth='80vw' columnGap={2}>
        <Card
          sx={{
            minWidth: 400,
            pl: 15,
            border: 'none',
            borderRadius: '0px',
            bgcolor: 'rgba(1, 170, 228, 0.4)',
            pt: 1,
          }}
        >
          <ColorTabs
            numberBadge={[numberBookingsRef.current, numberReviewsRef.current, 0]}
            tabs={tabs}
            value={nameComponent}
            handleChange={handleChange}
            orientation='vertical'
            sx={{ borderRight: 1, borderColor: 'divider', minHeight: 300 }}
            sxTab={{ fontSize: 20, minHeight: 70, pl: 10 }}
          />
        </Card>
        {tabs.map(
          (tab) =>
            tab.name === nameComponent && (
              <Box sx={{ mt: 1, width: '100%' }} key={tab.name}>
                {tab.component}
              </Box>
            )
        )}
      </Stack>
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
