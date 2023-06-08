import { Link as LinkRouter } from 'react-router-dom';
import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import movieLogo from '@/logo.png';

interface ILogo {
  disable?: boolean;
  sx: SxProps;
}

function Logo({ disable = false, sx }: ILogo) {
  const logo = (
    <Box sx={{ height: 40, width: 40, ...sx }}>
      <img src={movieLogo} alt='logo' width='100%' height='100%' />
    </Box>
  );
  if (disable) {
    return logo;
  }
  return <LinkRouter to='/'>{logo}</LinkRouter>;
}

export default Logo;
