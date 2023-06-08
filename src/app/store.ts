import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from '@/reducer/auth/auth.slice';
import userReducer from '@/reducer/user/user.slice';
import cartReducer from '@/reducer/cart/cart.slice';
import paymentReducer from '@/reducer/payment/payment.slice';
import reviewReducer from '@/reducer/review/review.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
    payment: paymentReducer,
    review: reviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
