/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { createSlice } from '@reduxjs/toolkit';
import apiService from '@app/server';
import { IResponse, IReview } from '@utils/interface';
import { EStatusRedux } from '@utils/enum';
import { cloudinaryUploads } from '@utils/cloudinary';
import { createAppAsyncThunk } from '../auth/auth.slice';
import { createToast } from '@/utils/utils';

export interface IReviewRedux {
  status: EStatusRedux;
  reviews: IReview[];
  reviewOrReplyByHotel: IReview[];
  isReview: boolean;
  errorMessage: string;
  page: number;
  count: number;
}

const initialState: IReviewRedux = {
  status: EStatusRedux.idle,
  isReview: false,
  reviews: [],
  reviewOrReplyByHotel: [],
  errorMessage: '',
  page: 1,
  count: 0,
};

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCreateReview.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchGetReviewsByUser.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchUpdateReview.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchCreateReview.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload) {
        const newReview = action.payload;
        const index = state.reviews.findIndex((review) => review._id === newReview._id);
        const { context, starRating, images } = action.payload;

        state.reviews[index].images = images || [];
        state.reviews[index].starRating = starRating;
        state.reviews[index].context = context;

        createToast('Thank you for review', 'success');
      }
    });
    builder.addCase(fetchGetReviewsByUser.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload.data) {
        if (!state.reviews.length) {
          state.isReview = action.payload.isReview;
          state.reviews = action.payload.data.reviews;
        } else if (
          state.isReview === action.payload.isReview &&
          state.page !== action.payload.page
        ) {
          state.reviews = state.reviews.concat(action.payload.data.reviews);
        } else if (state.isReview !== action.payload.isReview) {
          state.isReview = action.payload.isReview;

          state.reviews = action.payload.data.reviews;
        }
        state.count = action.payload.data.count;
        state.page = action.payload.page;
      }
    });
    builder.addCase(fetchUpdateReview.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload) {
        const newReview = action.payload;
        const index = state.reviews.findIndex((review) => review._id === newReview._id);
        if (action.payload.isDelete) {
          state.reviews.splice(index, 1);
        } else {
          const { context, starRating, images } = action.payload;
          state.reviews[index].images = images || [];
          state.reviews[index].starRating = starRating;
          state.reviews[index].context = context;
        }
        createToast('Update review successfully', 'success');
      }
    });

    builder.addCase(fetchCreateReview.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchGetReviewsByUser.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      if (state.isReview !== action.meta.arg.isReview) {
        state.isReview = action.meta.arg.isReview;
        state.page = action.meta.arg.page;
        state.reviews = [];
      }
      state.errorMessage = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchUpdateReview.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
  },
});

interface IResGetReviews {
  reviews: IReview[];
  count: number;
}

export const fetchGetReviewsByUser = createAppAsyncThunk(
  'review/fetchGetReviewsByUser',
  async ({
    isReview,
    page,
    limit = 10,
  }: {
    isReview: boolean;
    page: number;
    limit?: number;
  }) => {
    const response = await apiService.get<IResponse<IResGetReviews>>('review/user', {
      params: { isReview, page, limit },
    });
    return { data: response.data.data, isReview, page };
  }
);

export const fetchCreateReview = createAppAsyncThunk(
  'review/fetchCreateReview',
  async (
    {
      _id,
      context,
      images,
      starRating,
      hotelId,
    }: {
      _id: string;
      context: string;
      images: any[];
      starRating: number;
      hotelId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      if (typeof images[0] === 'string' || !images.length) {
        await apiService.post<IResponse<IReview>>(`review/${_id}`, {
          context,
          starRating,
          images,
          hotelId,
        });

        return {
          _id,
          context,
          starRating,
          images: images as string[],
        };
      }
      const url = await cloudinaryUploads(images);
      if (typeof url === 'object') {
        await apiService.post<IResponse<IReview>>(`review/${_id}`, {
          context,
          hotelId,
          starRating,
          images: url,
        });

        return {
          _id,
          context,
          starRating,
          images: url,
        };
      }
      return false;
    } catch (error: any) {
      return rejectWithValue(error.message as string);
    }
  }
);

export const fetchUpdateReview = createAppAsyncThunk(
  'review/fetchUpdateReview',
  async (
    {
      _id,
      context,
      images,
      starRating,
      isDelete = false,
    }: {
      _id: string;
      context: string;
      images: any[];
      starRating: number;
      isDelete: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const isAllUrl = images.every((img) => typeof img === 'string');
      if (isAllUrl || !images.length) {
        await apiService.put<IResponse<IReview[]>>(`review/${_id}`, {
          context,
          starRating,
          images,
          isDelete,
        });

        return {
          _id,
          context,
          starRating,
          images: images as string[],
          isDelete,
        };
      }
      const url = await cloudinaryUploads(images);
      if (typeof url === 'object') {
        await apiService.put<IResponse<IReview[]>>(`review/${_id}`, {
          context,
          starRating,
          images: url,
          isDelete,
        });

        return {
          _id,
          context,
          starRating,
          images: url,
          isDelete,
        };
      }
      return false;
    } catch (error: any) {
      return rejectWithValue(error.message as string);
    }
  }
);

export default reviewSlice.reducer;
