import React from 'react';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import cloneDeep from 'lodash/cloneDeep';
import Card from '@mui/material/Card';
import dayjs from 'dayjs';
import { ImageList, ImageListItem } from '@mui/material';
import { IResponse, IReview } from '@/utils/interface';
import apiService from '@/app/server';
import { fToNow } from '@/utils/formatTime';
import ModalImages from '../modal/ModalImages';

interface IReviewAndReplies extends IReview {
  reply?: IReview | null;
}

// tree-shaking and purge
// TODO avoid magic number
// const DATE_TIME_SLUG = 1682178766015;

function Reviews({ idHotel, count }: { idHotel: string; count: number }) {
  const [reviews, setReviews] = React.useState<IReviewAndReplies[]>([]);
  const [isOpenModalImages, setIsOpenModalImages] = React.useState<boolean>(false);
  const imageListRef = React.useRef<string[]>([]);
  const [page, setPage] = React.useState<number>(1);

  async function getReviews() {
    try {
      const response = await apiService.get<IResponse<IReview[]>>(
        `/review?hotelId=${idHotel}&page=${page}&limit=10`
      );

      if (response.data.data) {
        setReviews(response.data.data);
      }
    } catch (error) {
      setReviews([]);
    }
  }

  React.useEffect(() => {
    if (count) getReviews();
  }, [page]);

  if (!count) {
    return (
      <Stack
        sx={{ border: 'solid 1px' }}
        flexDirection='row'
        justifyContent='space-between'
        p={2}
      >
        <Typography variant='h5'>There are no reviews yet</Typography>
        <Typography variant='h5'>Contact Hotelier</Typography>
      </Stack>
    );
  }

  function handelOpenImages(i: number) {
    setIsOpenModalImages(true);
    imageListRef.current = reviews[i].images;
  }

  const getRepliesInReview = async (id: string, index: number) => {
    if (reviews[index].reply) return;
    try {
      const response = await apiService.get<IResponse<IReview>>(
        `/review?hotelId=${idHotel}&parent_slug=${id}`
      );

      const newUpdate = cloneDeep(reviews);
      newUpdate[index].reply = response.data.data;

      setReviews(newUpdate);
    } catch (error) {
      setReviews(reviews);
    }
  };

  return (
    <Box>
      <Stack spacing={2}>
        {reviews.length !== 0 &&
          reviews.map((review, i) => (
            <Card key={review.slug} sx={{ p: 2, minHeight: 300, flexGrow: 1 }}>
              <Stack flexDirection='row' columnGap={2} minHeight={280}>
                <Box width={420}>
                  <Typography variant='h4' color='primary'>
                    Star Rating: {review.starRating}
                  </Typography>
                  <Typography variant='body1'>Author: {review.author.name}</Typography>
                  <Typography variant='body1'>
                    Stayed
                    {` ${
                      (dayjs(review.endDate).unix() - dayjs(review.startDate).unix()) /
                      86400
                    } night in ${dayjs(review.startDate).format('MMMM YYYY')} `}
                  </Typography>
                  {review.images.length > 0 && (
                    <Stack alignItems='center' width={400} height={200}>
                      <ImageList cols={3} rowHeight={130} sx={{ mt: 2 }}>
                        {review.images.slice(0, 3).map((image, index) => (
                          <ImageListItem key={index} cols={1} rows={1}>
                            <img
                              src={image}
                              alt={review.hotel.name}
                              loading='lazy'
                              width='50px'
                              height='50px'
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                      <Button onClick={() => handelOpenImages(i)}>See All images</Button>
                    </Stack>
                  )}
                </Box>
                <Divider orientation='vertical' flexItem />
                <Stack minWidth={200}>
                  <Typography variant='h5'>Room Types order</Typography>
                  <CardActions>
                    {review.rooms?.map((room) => (
                      <Typography
                        variant='body1'
                        key={room.name}
                        color='primary'
                        onClick={() => {}}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {room.quantity} {room.name}
                      </Typography>
                    ))}
                  </CardActions>
                </Stack>
                <Divider orientation='vertical' flexItem />
                <Box sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      minHeight: '45%',
                      border: 'solid 1px',
                      mb: 1,
                      p: 1,
                      position: 'relative',
                      borderRadius: 5,
                    }}
                  >
                    <Typography variant='body1'>{review.context}</Typography>
                    <Typography textAlign='end' variant='body2' color='text.primary'>
                      {fToNow(review.updatedAt)}
                    </Typography>
                    <Divider />
                    {review.isReply && (
                      <Button
                        sx={{ position: 'absolute', bottom: 8, right: 5, mt: 1 }}
                        onClick={() => getRepliesInReview(review.slug as string, i)}
                      >
                        See Hotelier Reply
                      </Button>
                    )}
                  </Box>
                  {review.reply && (
                    <Box
                      sx={{ border: 'solid 1px', p: 1, borderRadius: 5, height: '45%' }}
                    >
                      <Typography>{review.reply.context}</Typography>
                      <Typography textAlign='end' variant='body2' color='text.primary'>
                        {fToNow(review.updatedAt)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
            </Card>
          ))}
      </Stack>
      <Stack alignItems='end'>
        <Pagination
          sx={{ mt: 2 }}
          count={Math.ceil(count / 3)}
          color='primary'
          onChange={(_event: React.ChangeEvent<unknown>, value: number) => setPage(value)}
        />
      </Stack>
      <ModalImages
        isOpenModal={isOpenModalImages}
        setIsOpenModal={setIsOpenModalImages}
        images={imageListRef.current}
      />
    </Box>
  );
}

export default Reviews;
