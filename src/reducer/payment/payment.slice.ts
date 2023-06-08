/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateBalance } from '../user/user.slice';
import apiService from '@/app/server';
import { IResponse, IBookingRes } from '@/utils/interface';
import { EStatusIBooking, EStatusRedux } from '@/utils/enum';
import { removeCartAfterCreateBooking } from '../cart/cart.slice';
import { createAppAsyncThunk } from '../auth/auth.slice';
import { createToast } from '@/utils/utils';

export interface IBookingResCustom extends IBookingRes {
  errorMessage?: string;
}

export interface IPaymentRedux {
  isInitial: boolean;
  status: EStatusRedux;
  statusPayment: EStatusIBooking | null;
  targetBooking: IBookingRes | null;
  isCreateBookingSuccess: boolean;
  bookings: IBookingResCustom[];
  page: number;
  count: number;
  errorMessage: string;
  errorPaymentBooking: string;
  errorMessageCreateBooking: string;
  errorMessageChargeOrWithdraw: string;
}
const initialState: IPaymentRedux = {
  status: EStatusRedux.idle,
  isInitial: false,
  statusPayment: null,
  targetBooking: null,
  isCreateBookingSuccess: false,
  bookings: [],
  page: 1,
  count: 0,
  errorMessage: '',
  errorPaymentBooking: '',
  errorMessageCreateBooking: '',
  errorMessageChargeOrWithdraw: '',
};

interface ISetStatusPayment {
  id: string;
  status: EStatusIBooking;
}

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setIsCreateBookingSuccess: (state, action: PayloadAction<boolean>) => {
      state.isCreateBookingSuccess = action.payload;
    },
    setStatusPayment: (state, action: PayloadAction<ISetStatusPayment>) => {
      state.bookings.forEach((booking) => {
        if (booking._id === action.payload.id) {
          booking.status = action.payload.status;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCreateBooking.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.isCreateBookingSuccess = false;
      state.errorMessageCreateBooking = '';
    });
    builder.addCase(fetchPaymentBooking.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorPaymentBooking = '';
    });
    builder.addCase(fetchCancelBooking.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchCharge.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
      state.errorMessageChargeOrWithdraw = '';
    });
    builder.addCase(fetchWithdraw.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
      state.errorMessageChargeOrWithdraw = '';
    });
    builder.addCase(fetchGetBookings.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchGetTargetBooking.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchCreateBooking.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      state.isCreateBookingSuccess = true;
      state.count -= 1;
      const newBooking = action.payload;

      state.targetBooking = newBooking;
    });
    builder.addCase(fetchPaymentBooking.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (state.bookings[0].status === EStatusIBooking.PENDING) {
        state.bookings.forEach((booking) => {
          if (booking._id === action.payload) {
            booking.status = EStatusIBooking.SUCCESS;
          }
        });
        createToast('Payment booking success, have a great vacation', 'success');
      }
      if (state.targetBooking?._id === action.payload) {
        state.targetBooking = null;
      }
    });
    builder.addCase(fetchCancelBooking.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      state.bookings.forEach((payment) => {
        if (payment._id === action.payload) {
          payment.status = EStatusIBooking.CANCEL;
          createToast('Sorry for the bad experience', 'info');
        }
      });
    });
    builder.addCase(fetchCharge.fulfilled, (state) => {
      state.status = EStatusRedux.succeeded;
      createToast('Take a break from work, and go on a trip ye ye', 'success');
    });
    builder.addCase(fetchWithdraw.fulfilled, (state) => {
      state.status = EStatusRedux.succeeded;
      createToast('Withdraw successfully', 'info');
    });
    builder.addCase(fetchGetBookings.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload.data) {
        if (action.payload.page === 1) {
          state.bookings = action.payload.data.bookings;
        } else {
          state.bookings = [...state.bookings, ...action.payload.data.bookings];
        }
        state.count = action.payload.data.count;
        state.page = action.payload.page;
        state.statusPayment = action.payload.data.bookings[0].status as EStatusIBooking;
      }
    });
    builder.addCase(fetchGetTargetBooking.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload) {
        state.targetBooking = action.payload;
      }
    });

    builder.addCase(fetchCreateBooking.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessageCreateBooking = action.payload || 'some thing wrong';
    });
    builder.addCase(fetchPaymentBooking.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorPaymentBooking = action.payload || 'some thing wrong';
    });
    builder.addCase(fetchCancelBooking.rejected, (state, action) => {
      state.bookings.forEach((booking) => {
        if (booking._id === action.meta.arg.bookingId) {
          booking.errorMessage = action.payload;
        }
      });
      state.status = EStatusRedux.error;
    });
    builder.addCase(fetchCharge.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessageChargeOrWithdraw = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchWithdraw.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessageChargeOrWithdraw = action.payload || 'some thing wrong';
    });
    builder.addCase(fetchGetBookings.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      if (state.statusPayment !== action.meta.arg.status) {
        state.bookings = [];
        state.count = 0;
      }
      state.statusPayment = action.meta.arg.status;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchGetTargetBooking.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
  },
});

export const fetchCreateBooking = createAppAsyncThunk(
  'payment/fetchCreateBooking',
  async (
    { newBooking, i }: { newBooking: IBookingRes; i?: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await apiService.post<IResponse<IBookingRes>>(
        '/payment/create-booking',
        {
          rooms: newBooking.rooms.map((room) => ({
            roomTypeId: room.roomTypeId._id,
            quantity: room.quantity,
          })),
          createdAt: newBooking.createdAt,
          hotelId: newBooking.hotelId._id,
          startDate: newBooking.startDate,
          endDate: newBooking.endDate,
        }
      );

      if (response.data.data) {
        response.data.data.hotelId = newBooking.hotelId;
        response.data.data.rooms = newBooking.rooms;
      }
      if (typeof i === 'number') dispatch(removeCartAfterCreateBooking(i));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message as string);
    }
  }
);

export const fetchPaymentBooking = createAppAsyncThunk(
  'payment/fetchPaymentBooking',
  async (
    {
      password,
      bookingId,
      hotelId,
      total,
    }: {
      password: string;
      bookingId: string;
      hotelId: string;
      total: number;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await apiService.put<IResponse>('/payment/payment-booking', {
        password,
        bookingId,
        hotelId,
      });
      dispatch(updateBalance(-total));
      return bookingId;
    } catch (error: any) {
      return rejectWithValue(error.message as string);
    }
  }
);

export const fetchCancelBooking = createAppAsyncThunk(
  'payment/fetchCancelBooking',
  async (
    { bookingId, hotelId, total }: { bookingId: string; hotelId: string; total: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await apiService.put<IResponse>('/payment/cancel-booking', {
        bookingId,
        hotelId,
      });
      dispatch(updateBalance(total));
      return bookingId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface IGetBookings {
  bookings: IBookingRes[];
  count: number;
}
export const fetchGetBookings = createAppAsyncThunk(
  'payment/fetchGetBooking',
  async ({ page = 1, status }: { page: number; status: EStatusIBooking }) => {
    const response = await apiService.get<IResponse<IGetBookings>>('/payment/booking', {
      params: { page, status },
    });

    return { data: response.data.data, page };
  }
);

export const fetchGetTargetBooking = createAppAsyncThunk(
  'payment/fetchGetTargetBooking',
  async (bookingId: string) => {
    const response = await apiService.get<IResponse<IBookingRes>>(
      `/payment/detail/${bookingId}`
    );

    return response.data.data;
  }
);

export const fetchCharge = createAppAsyncThunk(
  'payment/fetchCharge',
  async (balance: number, { dispatch }) => {
    try {
      await apiService.put<IResponse>('/payment/charge', {
        balance,
      });
      dispatch(updateBalance(balance));
      return 'oke';
    } catch (error) {
      return error;
    }
  }
);

export const fetchWithdraw = createAppAsyncThunk(
  'payment/fetchWithdraw',
  async (
    { withdraw, password }: { password: string; withdraw: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await apiService.put<IResponse>('/payment/withdraw', {
        withdraw,
        password,
      });
      dispatch(updateBalance(-withdraw));
      return 'oke';
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const { setIsCreateBookingSuccess } = paymentSlice.actions;
export default paymentSlice.reducer;
