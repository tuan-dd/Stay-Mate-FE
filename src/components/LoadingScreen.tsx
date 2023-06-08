import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';

function LoadingScreen({ sx }: { sx?: SxProps }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        ...sx,
      }}
    >
      <CircularProgress sx={{ color: 'primary.dark' }} />
    </Box>
  );
}

export default LoadingScreen;
