import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { IHotel, IResponse, IRoom } from '@utils/interface';
import apiService from '@app/server';
import { IResponseGetHotels } from '@utils/loader';
import LoadingScreen from '../LoadingScreen';
import CartHotel from './CartHotel';

// xs sm md lg xl

// TODO loading
function ListCardHotel() {
  const [dateHotelFiveStar, setDateHotelFiveStar] = React.useState<
    IHotel<IRoom[]>[] | []
  >([]);

  React.useEffect(() => {
    const getDateHotelFiveStar = async () => {
      try {
        const response = await apiService.get<IResponse<IResponseGetHotels>>(
          '/hotel?star=4'
        );

        if (response.data.data)
          setDateHotelFiveStar(response.data.data.result.slice(0, 10));
      } catch (error) {
        setDateHotelFiveStar([]);
      }
    };
    getDateHotelFiveStar();
  }, []);
  return (
    <Container
      sx={{
        marginTop: '40px',
        p: 4,
        position: 'relative',
        width: '90%',
        bgcolor: 'rgba(182,235,251,255)',
        borderRadius: 15,
      }}
    >
      <Stack>
        <Typography variant='h4' mb={3} textAlign='center' fontWeight={560}>
          TOP TRENDING HOTELS
        </Typography>
        {!dateHotelFiveStar.length ? (
          <Stack minHeight={200} justifyContent='center'>
            <LoadingScreen />
          </Stack>
        ) : (
          <Grid container spacing={3}>
            {dateHotelFiveStar.map((hotel, i) => (
              <Grid item xs={6} sm={4} md={4} lg={3} xl={2.4} key={i}>
                <CartHotel data={hotel} index={i} />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}

export default ListCardHotel;
