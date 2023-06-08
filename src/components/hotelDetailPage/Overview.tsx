import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import Box from '@mui/system/Box';
import CheckIcon from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';

import Divider from '@mui/material/Divider';
import { IHotel, IRoom } from '@/utils/interface';
import { nameIcons, urlIcons } from '@/utils/images';

const context =
  'The car parking and the Wi-Fi are always free, so you can stay in touch and come and go as you please. Conveniently situated in the Phường 5 part of Vung Tau, this property puts you close to attractions and interesting dining options. Don`t leave before paying a visit to the famous Vung Tau Light House. Rated with 5 stars, this high-quality property provides guests with access to massage, restaurant and hot tub on-site.';

function Overview({
  id,
  hotel,
  setIsModalMapOpen,
  roomAmenities,
}: {
  id: string;
  hotel: IHotel<IRoom[]>;
  setIsModalMapOpen: React.Dispatch<React.SetStateAction<boolean>>;
  roomAmenities: string[];
}) {
  const starRating = {
    integer: new Array(Math.floor(hotel.star)).fill(
      <StarIcon sx={{ color: 'yellow' }} />
    ),
    decimal: hotel.star % 1,
  };

  const highLights: { name: string; url: string }[] = [];

  roomAmenities?.forEach((amenities) => {
    const indexIcon = nameIcons.findIndex((e) => e === amenities);
    if (indexIcon > -1 && highLights.length < 6) {
      highLights.push({ name: amenities, url: urlIcons[indexIcon] });
    }
  });

  // console.log(hotel.roomTypeIds);
  return (
    <Stack id={id} flexDirection='row' gap={1}>
      <Stack sx={{ flex: '1 0 auto', width: '70%' }} gap={1}>
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Typography
              color='primary.dark'
              component='div'
              variant='h4'
              textTransform='uppercase'
              mb={1}
            >
              {hotel.hotelName}&nbsp;
              {starRating.integer.map((e, i) => (
                <Typography key={i} component='span'>
                  {e}
                </Typography>
              ))}
              {starRating.decimal !== 0 && <StarHalfIcon sx={{ color: 'yellow' }} />}
            </Typography>
            <Typography variant='body1'>
              {hotel.address ? hotel.address : hotel.city}&nbsp;&nbsp;
              <Typography
                component='span'
                color='primary'
                onClick={() => setIsModalMapOpen(true)}
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                SEE MAP
              </Typography>
            </Typography>
            <Divider />
            <Typography lineHeight={2} mt={1} variant='body1'>
              {context}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ border: 'solid 0.5px' }}>
          <CardContent>
            <Typography color='primary.dark' variant='h4'>
              HighLights
            </Typography>
          </CardContent>
          <Stack flexDirection='row' alignItems='center' justifyContent='center' py={4}>
            {highLights.map((e) => (
              <Stack
                width='100%'
                justifyContent='center'
                alignItems='center'
                flexGrow={1}
                spacing={1}
                key={e.name}
              >
                <Stack
                  bgcolor='white'
                  width={45}
                  height={45}
                  justifyContent='center'
                  alignItems='center'
                  p={1}
                >
                  <img src={e.url} alt={e.name} width='30px' />
                </Stack>

                <Typography component='label' variant='body2'>
                  {e.name}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Card>
      </Stack>
      <Stack gap={1}>
        <Card sx={{ border: 'solid 0.5px' }}>
          <CardContent>
            <Typography color='primary.dark' variant='h4'>
              Star Rating: {hotel.starRating?.starAverage}
            </Typography>
            <Typography variant='body2'>
              reviews: {hotel.starRating?.countReview}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ border: 'solid 0.5px', flex: '1 0 auto' }}>
          <CardContent>
            <Typography color='primary.dark' variant='h4'>
              Facilities
            </Typography>
            {roomAmenities.slice(0, 6).map((e) => (
              <Box key={e}>
                <CheckIcon /> <Typography component='span'>{e}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}

export default Overview;
