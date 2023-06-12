import React from 'react';
import Card from '@mui/material/Card';
import { z } from 'zod';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import Stack from '@mui/material/Stack';
import CardCover from '@mui/joy/CardCover/CardCover';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IHotel, IRoom } from '@/utils/interface';
import { urlImagesRooms, urlImagesRoomsLove, urlImagesTrending } from '@/utils/images';
import ModalImages from '../modal/ModalImages';

const isUrl = z.string().url();

export const ResponsiveStack = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));
export const ResponsiveDiv = styled('div')(({ theme }) => ({
  width: 400,
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

function CardHotel({
  hotel,
  index,
  handelNavigateDetail,
}: {
  hotel: IHotel<IRoom[]>;
  index: number;
  handelNavigateDetail: (id: string, index: number) => void;
}) {
  const [isOpenModalImages, setIsOpenModalImages] = React.useState<boolean>(false);

  const imagesHotel = React.useMemo<string[]>(() => {
    if (isUrl.safeParse(hotel.images[0]).success) {
      if (hotel.images.length > 4) {
        return hotel.images;
      }
      return [
        ...hotel.images,
        urlImagesTrending[index],
        ...urlImagesRoomsLove,
        ...urlImagesRooms,
      ];
    }
    return [urlImagesTrending[index], ...urlImagesRoomsLove, ...urlImagesRooms];
  }, []);

  const mealType = hotel.roomTypeIds.reduce((acc, loc) => {
    if (acc.mealType && !loc.mealType) {
      return acc;
    }

    if (!acc.mealType && loc.mealType) {
      return loc;
    }

    if (acc.mealType && loc.mealType)
      return acc.mealType?.length < loc.mealType?.length ? loc : acc;

    if (!acc.mealType && !loc.mealType) return loc;
    return loc;
  });

  const priceSmallest = React.useMemo<number>(() => {
    const small = hotel.roomTypeIds.reduce((acc, loc) =>
      acc.price < loc.price ? acc : loc
    );
    return small.price;
  }, [hotel]);

  return (
    <Card sx={{ cursor: 'pointer', width: '100%' }}>
      <CardActionArea sx={{ width: '100%' }}>
        <ResponsiveStack flexDirection='row' columnGap={1}>
          <ResponsiveDiv>
            <ImageList
              variant='quilted'
              cols={4}
              rowHeight={45}
              sx={{ m: 0, width: '100%' }}
            >
              {imagesHotel.slice(0, 4).map((item, i) => (
                <ImageListItem
                  sx={{
                    cursor: 'pointer',
                  }}
                  key={i}
                  cols={i === 0 ? 4 : 1}
                  rows={i === 0 ? 4 : 1}
                  onClick={() => setIsOpenModalImages(true)}
                >
                  <img src={item} alt={hotel.hotelName} loading='lazy' />
                  <CardCover
                    sx={{
                      transition: 'all .30s ease-in-out',
                      '&:hover': { backgroundColor: 'common.backgroundChannel' },
                    }}
                  />
                </ImageListItem>
              ))}
              <ImageListItem
                sx={{
                  cursor: 'pointer',
                }}
                key={4}
                cols={1}
                rows={1}
                onClick={() => setIsOpenModalImages(true)}
              >
                <img src={imagesHotel[4]} alt={hotel.hotelName} loading='lazy' />
                <CardCover
                  sx={{
                    width: '100%',
                    height: '100%',

                    transition: 'all .30s ease-in-out',
                    backgroundColor: 'rgba(7, 22, 36, 0.752)',
                  }}
                >
                  <Typography color='success.contrastText'>See all</Typography>
                </CardCover>
              </ImageListItem>
              {mealType.mealType && (
                <Box
                  sx={{
                    position: 'absolute',
                    width: 'auto',
                    p: 0.5,
                    zIndex: 3,
                    height: 'auto',
                    margin: '10px -2px',
                    borderRadius: 5,
                    bgcolor: 'success.darker',
                  }}
                >
                  <div>
                    <Typography variant='body2' color='success.contrastText'>
                      {mealType.mealType}
                    </Typography>
                  </div>
                </Box>
              )}
            </ImageList>
          </ResponsiveDiv>
          <Stack flexDirection='row' flexGrow={1} p={1}>
            <Box
              sx={{ flexGrow: 1 }}
              onClick={() => handelNavigateDetail(hotel._id, index)}
            >
              <Stack spacing={1} mt={1}>
                <Typography>{hotel.hotelName}</Typography>
                <Rating readOnly value={hotel.star} size='small' />
                <Typography>Address: {hotel.address}</Typography>
                <Typography>Type: {hotel.propertyType}</Typography>
              </Stack>
            </Box>
            <Divider orientation='vertical' flexItem />
            <Box
              sx={{ minWidth: 230 }}
              onClick={() => handelNavigateDetail(hotel._id, index)}
            >
              <Stack justifyContent='space-around' alignItems='center' height='100%'>
                <Box>
                  <Typography>
                    Star Rating:&nbsp;&nbsp;&nbsp;&nbsp;
                    <Typography
                      component='span'
                      variant='h2'
                      fontWeight='600'
                      color='success.light'
                    >
                      {Math.round(
                        ((hotel.starRating.starAverage / 5) * 10 + Number.EPSILON) * 100
                      ) / 100}
                    </Typography>
                  </Typography>
                  {hotel.starRating.countReview > 0 ? (
                    <Typography> Review: {hotel.starRating.countReview}</Typography>
                  ) : (
                    <Typography variant='body2'>There are no reviews yet</Typography>
                  )}
                </Box>
                <Typography
                  variant='h4'
                  fontWeight='500'
                  color='#e12d2d'
                  sx={{ filter: `brightness(170%)` }}
                >
                  <Typography component='span' variant='body2'>
                    Lowest room rate:
                  </Typography>
                  &nbsp;{Math.round((priceSmallest + Number.EPSILON) * 100) / 100}$
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </ResponsiveStack>
        <ModalImages
          isOpenModal={isOpenModalImages}
          setIsOpenModal={setIsOpenModalImages}
          images={imagesHotel}
        />
      </CardActionArea>
    </Card>
  );
}

export default CardHotel;
