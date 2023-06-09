/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { IUser, IResponse, JwtPayloadUser } from '@utils/interface';
import { setAllCookie, setHeaders, setKeyHeader } from '@utils/jwt';
import apiService from '@app/server';
import { EKeyHeader, EStatusRedux } from '@utils/enum';
import { AppDispatch, RootState } from '@app/store';
import { fetchUser, logOut, setUser } from '../user/user.slice';

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();

export interface IAuth {
  status: EStatusRedux;
  isSignIn: boolean;
  is2FA: boolean;
  email: string;
  errorMessage: string;
  remainGuess: 5;
}

export interface ILogin {
  email: string;
  password: string;
}

const initialState: IAuth = {
  status: EStatusRedux.idle,
  isSignIn: false,
  is2FA: false,
  email: '',
  errorMessage: '',
  remainGuess: 5,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<string>) => {
      state.isSignIn = true;
      state.is2FA = true;
      state.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLogin.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetch2FA.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchNewAccessToken.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchSignOut.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      const { email } = action.payload;
      state.email = email;
      state.isSignIn = true;
    });

    builder.addCase(fetch2FA.fulfilled, (state) => {
      state.status = EStatusRedux.succeeded;
      state.is2FA = true;
    });

    builder.addCase(fetchNewAccessToken.fulfilled, (state) => {
      state.status = EStatusRedux.succeeded;
    });

    builder.addCase(fetchSignOut.fulfilled, (state) => {
      state = { ...initialState };
      return state;
    });

    builder.addCase(fetchLogin.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });

    builder.addCase(fetch2FA.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.remainGuess -= 1;
      state.errorMessage = action.error.message || 'some thing wrong';
    });

    builder.addCase(fetchNewAccessToken.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });

    builder.addCase(fetchSignOut.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
  },
});

export const fetchLogin = createAppAsyncThunk(
  'auth/fetchLogin',
  async ({ email, password }: ILogin) => {
    const response = await apiService.post<IResponse>('/auth/sign-in', {
      email,
      password,
    });
    const { data } = response;
    return { data, email };
  }
);

interface IResponseFetch2FA extends IUser {
  accessToken: string;
  refreshToken: string;
}

export const fetch2FA = createAppAsyncThunk(
  'auth/fetchCode',
  async (code: number | string, { getState, dispatch }) => {
    const state = getState();
    // console.log(code);
    const response = await apiService.post<IResponse<IResponseFetch2FA>>(
      '/auth/authcode',
      {
        sixCode: code,
        email: state.auth.email,
      }
    );
    const user = response.data.data;
    if (user !== null) {
      setAllCookie(false, {
        userId: user._id,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });

      // console.log('accessToken', accessToken);
      setKeyHeader(user.accessToken, EKeyHeader.ACCESS_TOKEN);

      setKeyHeader(user._id, EKeyHeader.USER_ID);
      dispatch(setUser(response.data));
    }
    return response.data;
  }
);

export const fetchNewAccessToken = createAppAsyncThunk(
  'auth/fetchNewAccessToken',
  async (_, { dispatch }) => {
    setHeaders();

    const response = await apiService.get<IResponse<string>>('/auth/new-access-token', {
      withCredentials: true,
    });

    const newAccessToken = response.data.data;

    if (typeof newAccessToken === 'string') {
      setKeyHeader(newAccessToken, EKeyHeader.ACCESS_TOKEN);
      Cookie.set('accessToken', newAccessToken, {
        httpOnly: false,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });

      const payload = jwtDecode<JwtPayloadUser>(newAccessToken);

      dispatch(authSlice.actions.setAuth(payload.email));

      dispatch(fetchUser());
    }

    return response.data;
  }
);

export const fetchSignOut = createAppAsyncThunk(
  'auth/fetchSignOut',
  async (_, { dispatch }) => {
    const response = await apiService.post('/auth/sign-out');
    setHeaders(true);
    setAllCookie(true);
    dispatch(logOut());
    return response.data;
  }
);

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;
