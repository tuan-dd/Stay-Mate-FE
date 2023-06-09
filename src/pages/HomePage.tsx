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
          backgroundImage:
            'url(https://res.cloudinary.com/diz2mh63x/image/upload/v1686300155/logo_3_zvo3cy.jpg)',
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
