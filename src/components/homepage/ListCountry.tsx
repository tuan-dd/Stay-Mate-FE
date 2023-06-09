import Stack from '@mui/material/Stack';
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useColorScheme, useTheme } from '@mui/joy/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { urlCountryLight, nameCountry, urlCountryDark } from '@utils/images';
import { fDate } from '@utils/formatTime';

const convertObjectParams = (name: string) => ({
  country: name,
  startDate: fDate(undefined),
  endDate: fDate(new Date().getTime() + 1000 * 60 * 60 * 24),
  rooms: '1',
  adults: '2',
  children: '0',
});

const styleArrow = {
  position: 'absolute',
  display: 'flex',
  zIndex: 15,
  justifyContent: 'center',
  alignContent: 'center',
  height: '40px',
  width: '40px',
  bgcolor: ' rgba(255, 255, 255, 0.305)',
  p: 0,
  opacity: 0.9,
  ':hover': {
    opacity: 1,
  },
};
const customCss = {
  position: 'absolute',
  height: '100%',
  width: 60,
  top: 0,
};

function ListCountry() {
  const { mode } = useColorScheme();
  const theme = useTheme();
  const navigate = useNavigate();

  const handelClickCity = (index: number) => {
    const objectParams = convertObjectParams(nameCountry[index]);
    const searchParams = `/search/?${new URLSearchParams(objectParams).toString()}`;
    navigate(searchParams);
  };
  const listRef = React.useRef<HTMLDivElement>(null);

  const scroll = (id: string) => {
    if (listRef.current) {
      if (id === 'right') {
        listRef.current.scrollTo({
          left: 1000,
          behavior: 'smooth',
        });
      } else if (id === 'left') {
        listRef.current.scrollTo({
          left: -500,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <Container sx={{ maxWidth: 1200, mt: 10, position: 'relative' }} disableGutters>
      <Box
        sx={{
          ...customCss,
          background: `linear-gradient(to left, rgba(255, 255, 255, 0),${theme.vars.palette.background.default})`,
          left: 0,
        }}
      />

      <Typography
        textAlign='center'
        variant='h4'
        textTransform='uppercase'
        mb={2}
        fontWeight={560}
      >
        Popular destinations
      </Typography>
      <IconButton
        onClick={() => scroll('right')}
        sx={{
          ...styleArrow,
          top: '50%',
          right: '0vw',
        }}
      >
        <ArrowForwardIosIcon
          sx={{
            fontSize: 20,
            color: 'black',
            opacity: 0.5,
          }}
        />
      </IconButton>
      <Stack
        flexDirection='row'
        columnGap={3}
        sx={{ overflow: 'hidden', p: 1 }}
        ref={listRef}
      >
        {nameCountry.map((name, i) => (
          <Box
            key={name}
            onClick={() => handelClickCity(i)}
            sx={{
              flexGrow: 1,
              textTransform: 'capitalize',
              cursor: 'pointer',
              ':hover': {
                color: 'primary.main',
              },
            }}
          >
            <Stack alignItems='center' spacing={2}>
              <Box width='140px' height='140px'>
                <img
                  src={mode === 'light' ? urlCountryLight[i] : urlCountryDark[i]}
                  alt={name}
                  loading='lazy'
                  width='100%'
                  height='100%'
                />
              </Box>
              <Typography variant='body2' fontSize={18}>
                {name}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
      <IconButton
        onClick={() => scroll('left')}
        sx={{
          ...styleArrow,
          top: '50%',
          left: 3,
          pl: 1,
        }}
      >
        <ArrowBackIosIcon
          sx={{
            fontSize: 20,
            color: 'black',
            opacity: 0.5,
          }}
        />
      </IconButton>
      <Box
        sx={{
          ...customCss,
          background: `linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.vars.palette.background.default})`,
          right: 0,
        }}
      />
    </Container>
  );
}

export default ListCountry;
