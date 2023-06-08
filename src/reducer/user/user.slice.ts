/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';
import apiService from '@/app/server';
import { IHotel, IResponse, IRoom, IUser } from '@/utils/interface';
import { setHeaders } from '@/utils/jwt';
import { AppDispatch, RootState } from '@/app/store';
import { setAuth } from '../auth/auth.slice';
import { EPackage, EPricePackage, EStatusRedux } from '@/utils/enum';
import { cloudinaryUpload } from '@/utils/cloudinary';
import { createToast } from '@/utils/utils';

/**
 * @getUser
 * @getHotel
 * @UpdateUser
 * @updateHotel
 */

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();

interface IUserRedux {
  status: EStatusRedux;
  currentUser: IUser | null;
  myHotels: IHotel<IRoom[]>[] | null;
  errorMessage: string;
}

const initialState: IUserRedux = {
  status: EStatusRedux.idle,
  currentUser: null,
  myHotels: null,
  errorMessage: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IResponse<IUser>>) => {
      state.status = EStatusRedux.succeeded;
      state.currentUser = action.payload.data;
      state.errorMessage = '';
    },
    logOut: (state) => {
      state = cloneDeep(initialState);
      return state;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.status = EStatusRedux.succeeded;
      state.errorMessage = '';
      (state.currentUser as IUser).account.balance += action.payload;
    },
    updateMemberShip: (state, action: PayloadAction<EPackage>) => {
      state.status = EStatusRedux.succeeded;
      state.errorMessage = '';
      (state.currentUser as IUser).account.balance -= EPricePackage[action.payload];

      if (state.myHotels) {
        const packageHotel = state.myHotels[0].package;

        if (action.payload === EPackage.MONTH && packageHotel === EPackage.FREE) {
          state.myHotels?.forEach((hotel) => {
            hotel.package = EPackage.MONTH;
          });
        } else if (action.payload === EPackage.WEEK && packageHotel === EPackage.MONTH) {
          state.myHotels?.forEach((hotel) => {
            hotel.package = EPackage.WEEK;
          });
        } else {
          state.myHotels?.forEach((hotel) => {
            hotel.package = EPackage.YEAR;
          });
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchCreateUser.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchUpdateUser.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      state.currentUser = action.payload.data;
    });

    builder.addCase(fetchCreateUser.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      state.currentUser = action.payload.data;
    });
    builder.addCase(fetchUpdateUser.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      const { name, avatar } = action.payload;
      if (state.currentUser) state.currentUser = { ...state.currentUser, name, avatar };
      createToast('Update success', 'info');
    });

    builder.addCase(fetchUser.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchCreateUser.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });

    builder.addCase(fetchUpdateUser.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
  },
});

export const fetchUser = createAppAsyncThunk(
  'user/fetchUser',
  async (_, { dispatch }) => {
    setHeaders();
    const response = await apiService.get<IResponse<IUser>>('/user/me');
    if (response.data.data?.email) dispatch(setAuth(response.data.data?.email));
    return response.data;
  }
);

export const fetchCreateUser = createAppAsyncThunk(
  'user/fetchCreateUser',
  async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await apiService.post<IResponse<IUser>>('/user/sign-up', {
      name,
      email,
      password,
    });
    return response.data;
  }
);

export interface IUpdateUser {
  name: string;
  avatar?: string | any;
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const fetchUpdateUser = createAppAsyncThunk(
  'user/fetchUpdateUser',
  async (updateUser: IUpdateUser) => {
    if (updateUser.avatar && typeof updateUser.avatar !== 'string') {
      updateUser.avatar = await cloudinaryUpload(updateUser.avatar);
    }
    await apiService.put<IResponse<IUser>>('/user/user-update', {
      ...updateUser,
    });

    return {
      name: updateUser.name,
      avatar: updateUser.avatar as string,
    };
  }
);

export const { setUser, updateBalance, logOut, updateMemberShip } = userSlice.actions;

export default userSlice.reducer;
