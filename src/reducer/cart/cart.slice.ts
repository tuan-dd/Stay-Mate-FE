/* eslint-disable @typescript-eslint/no-use-before-define */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { ICartReq, ICartRes, IOrderRes, IResponse } from '@utils/interface';
import { EStatusRedux } from '@utils/enum';
import apiService from '@/app/server';
import { createAppAsyncThunk } from '../auth/auth.slice';
import { createToast } from '@/utils/utils';

interface ICartRedux {
  status: EStatusRedux;
  errorMessage: string;
  cart: ICartRes | null;
}

const initialState: ICartRedux = {
  status: EStatusRedux.idle,
  cart: null,
  errorMessage: '',
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeCartAfterCreateBooking: (state, action: PayloadAction<number>) => {
      state.cart?.orders.splice(action.payload, 1);
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCart.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchCreateCart.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchCreateOrder.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchUpdateOrder.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchDeleteOrder.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      state.cart = action.payload.data;
    });
    builder.addCase(fetchCreateCart.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      state.cart = action.payload;
    });
    builder.addCase(fetchCreateOrder.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      const newOrder = action.payload.order;

      if (state.cart?.orders.length !== action.payload.orders?.length) {
        newOrder.createdAt = action.payload.orders?.at(-1)?.createdAt;
        state.cart?.orders.push(newOrder);
        createToast('Add to cart successfully, payment and go now ye ye', 'success');
      } else if (state.cart) {
        const { orders } = state.cart;
        const indexOrder = orders?.findIndex((order) => {
          const isSameStartDate =
            dayjs(order.startDate).format('YYYY-MM-DD') === newOrder.startDate;
          const isSameEndDate =
            dayjs(order.endDate).format('YYYY-MM-DD') === newOrder.endDate;
          const isSameHotelId = order.hotelId._id === newOrder.hotelId._id;
          return isSameEndDate && isSameHotelId && isSameStartDate;
        });

        if (indexOrder > -1) {
          const updateOrder = orders[indexOrder];

          const indexRoom = updateOrder.rooms.findIndex(
            (room) => room.roomTypeId._id === newOrder.rooms[0].roomTypeId._id
          );
          if (indexRoom > -1)
            updateOrder.rooms[indexRoom].quantity = newOrder.rooms[0].quantity;

          if (indexRoom === -1)
            updateOrder.rooms = [...updateOrder.rooms, newOrder.rooms[0]];
        }
        state.cart.orders = orders;
        createToast('Add to cart successfully, payment and go now ye ye', 'success');
      }
    });
    builder.addCase(fetchUpdateOrder.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      const { i, updateOrder } = action.payload;
      if (state.cart) {
        state.cart.orders[i] = updateOrder;
      }
    });
    builder.addCase(fetchDeleteOrder.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (state.cart) {
        state.cart.orders.splice(action.payload, 1);
        createToast('Delete order successfully', 'info');
      }
    });

    builder.addCase(fetchCart.rejected, (state, action) => {
      state.status = EStatusRedux.error;

      state.errorMessage = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchCreateCart.rejected, (state, action) => {
      state.status = EStatusRedux.error;

      state.errorMessage = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchCreateOrder.rejected, (state, action) => {
      state.status = EStatusRedux.error;

      state.errorMessage = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchUpdateOrder.rejected, (state, action) => {
      state.status = EStatusRedux.error;

      state.errorMessage = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchDeleteOrder.rejected, (state, action) => {
      state.status = EStatusRedux.error;

      state.errorMessage = action.error.message || 'some thing wrong';
    });
  },
});

export const fetchCart = createAppAsyncThunk('cart/fetchCart', async () => {
  const response = await apiService.get<IResponse<ICartRes>>('/cart');
  return response.data;
});

export const fetchCreateCart = createAppAsyncThunk(
  'cart/fetchCreateCart',
  async (order: IOrderRes) => {
    const newOrder = convertReq(order);

    const response = await apiService.post<IResponse<ICartReq>>('/cart', {
      ...newOrder,
    });

    const userId = Cookies.get('userId') as string;
    if (response.data.data) {
      order.createdAt = response.data.data.orders[0].createdAt;
    }
    const newCart: ICartRes = { userId, isActive: true, orders: [order] };
    return newCart;
  }
);

export const fetchCreateOrder = createAppAsyncThunk(
  'cart/fetchCreateOrder',
  async (order: IOrderRes) => {
    const newOrder = convertReq(order);

    const response = await apiService.post<IResponse<ICartReq>>('/cart', { ...newOrder });

    return { order, orders: response.data.data?.orders };
  }
);

export const fetchUpdateOrder = createAppAsyncThunk(
  'cart/fetchUpdateOrder',
  async ({ updateOrder, i }: { updateOrder: IOrderRes; i: number }) => {
    const newOrder = convertReq(updateOrder);

    await apiService.put('/cart', { ...newOrder, createdAt: updateOrder.createdAt });

    return { updateOrder, i };
  }
);

export const fetchDeleteOrder = createAppAsyncThunk(
  'cart/fetchDeleteOrder',
  async ({ createdAt, index }: { createdAt: Date; index: number }) => {
    await apiService.delete(`/cart?createdAt=${createdAt}`);

    return index;
  }
);

function convertReq(order: IOrderRes) {
  return {
    hotelId: order.hotelId._id,
    startDate: order.startDate,
    endDate: order.endDate,
    rooms: order.rooms.map((room) => ({
      roomTypeId: room.roomTypeId._id,
      quantity: room.quantity,
    })),
  };
}

export const { removeCartAfterCreateBooking } = cartSlice.actions;
export default cartSlice.reducer;
