import { Link as LinkRouter } from 'react-router-dom';
import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';

interface ILogo {
  disable?: boolean;
  sx?: SxProps;
}

function Logo({ disable = false, sx }: ILogo) {
  const logo = (
    <Box sx={{ height: 40, width: 40, ...sx }}>
      <img
        src='https://res.cloudinary.com/diz2mh63x/image/upload/v1686300155/logo_zacdwm.png'
        alt='logo'
        width='100%'
        height='100%'
        loading='lazy'
      />
    </Box>
  );
  if (disable) {
    return logo;
  }
  return <LinkRouter to='/'>{logo}</LinkRouter>;
}

export default Logo;
