import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';

import { IReview } from '@/utils/interface';
import { fDate, fToNow } from '@/utils/formatTime';

const StyleGrid = {
  pr: 1,
  pt: 1,
  pb: 1,
  mt: 1,
  with: '100%',
  maxHeight: 200,
  overflowX: 'hidden',
  '::-webkit-scrollbar': { width: 12, bgcolor: 'transparent' },
  '::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
    bgcolor: 'primary.main',
  },
  '::-webkit-scrollbar-track': {
    borderRadius: '10px',
    WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
    bgcolor: '#F5F5F5',
  },
};
function CardReview({
  review,
  handelClick,
  i,
}: {
  i: number;
  review: IReview;
  handelClick: (index: number) => void;
}) {
  const navigate = useNavigate();

  const objectParams = {
    destination: review.hotel.name,
    startDate: fDate(undefined),
    endDate: fDate(new Date().getTime() + 1000 * 60 * 60 * 24),
    rooms: '1',
    adults: '2',
    children: '0',
  };

  const searchParams = `/hotel/${review.hotel.hotelId}?${new URLSearchParams(
    objectParams
  ).toString()}`;
  return (
    <Card key={review.slug} sx={{ p: 2, height: 'auto' }}>
      <Stack flexDirection='row' columnGap={2}>
        <Box width={280}>
          {review.starRating !== 0 && (
            <Typography variant='h5' color='primary'>
              Star Rating: {review.starRating}
            </Typography>
          )}
          <Typography
            onClick={() => navigate(searchParams)}
            textTransform='capitalize'
            color='primary'
            fontSize={16}
            sx={{
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {review.hotel.name}
          </Typography>
          <Typography fontSize={14}>Author: {review.author.name}</Typography>
          <Typography fontSize={14}>
            Stayed
            {` ${
              (dayjs(review.endDate).unix() - dayjs(review.startDate).unix()) / 86400
            } night in ${dayjs(review.startDate).format('MMMM YYYY')} `}
          </Typography>
          <Typography color='primary.dark'>Room Type :</Typography>
          {review.rooms?.map((room, index) => (
            <Typography
              variant='body1'
              key={index}
              color='primary'
              onClick={() => navigate(searchParams)}
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {room.quantity} {room.name}
            </Typography>
          ))}
          <Grid container spacing={1} sx={StyleGrid}>
            {review.images.map((img, indexImg) => (
              <Grid item xs={4} key={indexImg} sx={{ with: '100%', height: 100 }}>
                <img src={img} alt='imgReview' width='100%' height='100%' />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Divider orientation='vertical' flexItem />
        <Stack sx={{ flexGrow: 1, width: 500 }} alignItems='flex-end'>
          <Box
            sx={{
              width: '100%',
              minHeight: 150,
              flexGrow: 1,
              border: 'solid 1px',
              mb: 1,
              p: 1,
              borderRadius: 5,
            }}
          >
            <Typography variant='body1'>
              {(review.context as string).length > 1 ? review.context : 'No content'}
            </Typography>
            <Typography textAlign='end' variant='body2' color='text.primary'>
              {fToNow(review.updatedAt)}
            </Typography>
          </Box>
          <Box>
            <LoadingButton onClick={() => handelClick(i)}>
              {review.starRating ? 'edit' : 'Write review'}
            </LoadingButton>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}

export default CardReview;
