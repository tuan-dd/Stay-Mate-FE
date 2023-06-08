import Stack from '@mui/material/Stack';
import ListCardHotel from '@/components/homepage/ListCardHotel';
import FormSearchHotels from '@/components/FormSearchHotels';
import ListCountry from '@/components/homepage/ListCountry';

function HomePage() {
  return (
    <>
      <Stack
        justifyContent='center'
        sx={{
          height: '55vh',
          backgroundImage: 'url(logo_3.jpg)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          borderRadius: 'none',
        }}
      >
        <FormSearchHotels />
      </Stack>
      <ListCountry />
      <ListCardHotel />
    </>
  );
}

export default HomePage;
