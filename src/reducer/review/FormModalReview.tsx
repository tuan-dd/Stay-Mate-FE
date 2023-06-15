import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FTextField, FUploadImages, FormProvider } from '@components/formProvider';
import BasicModal from '@components/modal/BasicModal';
import { IReview } from '@utils/interface';
import { EStatusRedux } from '@utils/enum';
import { RootState, useAppDispatch } from '@app/store';
import useMediaQuery from '@mui/material/useMediaQuery';
import { fetchCreateReview, fetchUpdateReview } from './review.slice';
import { customScrollbar } from '@/utils/utils';

interface IDefaultValues {
  images: any[];
  content: string;
  starRating: number;
}

const checkInput = z.object({
  images: z.array(z.any()),
  content: z.string().min(1),
  starRating: z.number().min(0.5).or(z.string()),
});

const styleGrid = {
  width: '100%',
  height: 200,
  overflowX: 'hidden',
  ...customScrollbar,
};

function FromModalReview({
  review,
  isOpenModal,
  setIsOpenModal,
}: {
  review: IReview;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const matches900px = useMediaQuery('(max-width:900px)');

  const defaultValues: IDefaultValues = {
    images: review?.images || [],
    content: review?.context as string,
    starRating: review?.starRating || 0,
  };

  const methods = useForm<IDefaultValues>({
    defaultValues,
    resolver: zodResolver(checkInput),
  });
  const { setValue, watch, reset } = methods;

  const { status } = useSelector(
    (state: RootState) => ({
      isReview: state.review.isReview,
      status: state.review.status,
    }),
    shallowEqual
  );
  const dispatch = useAppDispatch();

  const handleDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles) {
        const files = acceptedFiles;
        const imagesWatch = watch();
        if (files) {
          setValue('images', [
            ...imagesWatch.images,
            ...files.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            ),
          ]);
        }
      }
    },
    [setValue]
  );

  const onSubmit: SubmitHandler<IDefaultValues> = (data) => {
    const { images, content, starRating } = data;
    if (review.starRating > 0) {
      dispatch(
        fetchUpdateReview({
          images,
          context: content,
          starRating,
          _id: review._id,
          isDelete: false,
        })
      );
    } else {
      dispatch(
        fetchCreateReview({
          images,
          context: content,
          starRating,
          _id: review._id,
          hotelId: review.hotel.hotelId,
        })
      );
    }
  };

  React.useEffect(() => {
    reset(defaultValues);
  }, [review]);

  return (
    <BasicModal
      open={isOpenModal}
      setOpen={setIsOpenModal}
      sx={{
        p: 0,
        width: matches900px ? '90%' : 900,
        maxHeight: 600,
      }}
      disableGutters
    >
      <Box p={2}>
        <FormProvider onSubmit={onSubmit} {...methods}>
          <Stack spacing={2} pt={2}>
            <FTextField name='content' label='Content' focused />
            <FTextField
              name='starRating'
              type='number'
              label='Star Rating'
              inputProps={{ min: 0.5, max: 5, step: 0.5 }}
              focused
            />
            <FUploadImages
              name='images'
              accept={{
                'image/*': ['.jpeg', '.jpg', '.png'],
              }}
              maxSize={5145728}
              onDrop={handleDrop}
              sxGrid={{ ...styleGrid }}
            />
            <LoadingButton type='submit' loading={status === EStatusRedux.pending}>
              Submit
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Box>
    </BasicModal>
  );
}

export default FromModalReview;
