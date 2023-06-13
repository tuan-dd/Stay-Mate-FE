import { useTheme } from '@mui/joy/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Logo from '@/components/Logo';

const ResponsiveTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  [theme.breakpoints.down('md')]: {
    fontSize: 14,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 10,
  },
}));

const ResponsiveContent = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  color: theme.vars.palette.text.main,
  [theme.breakpoints.down('md')]: {
    fontSize: 12,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 8,
  },
}));

const ResponsiveLogo = styled(Typography)(({ theme }) => ({
  fontFamily: 'UseUrban',
  color: theme.vars.palette.primary.dark,
  fontWeight: 700,
  fontSize: 18,
  letterSpacing: '.2rem',
  [theme.breakpoints.down('md')]: {
    fontSize: 12,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 11,
  },
}));

function MainFooter() {
  const theme = useTheme();

  return (
    <>
      <svg
        id='visual'
        viewBox='0 0 960 200'
        width='100%'
        height='100%'
        xmlns='http://www.w3.org/2000/svg'
        version='1.1'
      >
        <rect
          x='0'
          y='0'
          width='100%'
          height='200'
          fill={theme.palette.background.default}
        />
        <path
          d='M0 155L14.5 147.7C29 140.3 58 125.7 87.2 121.8C116.3 118 145.7 125 174.8 133.2C204 141.3 233 150.7 262 148.5C291 146.3 320 132.7 349 124.3C378 116 407 113 436.2 120.2C465.3 127.3 494.7 144.7 523.8 150C553 155.3 582 148.7 611 145.5C640 142.3 669 142.7 698 140.7C727 138.7 756 134.3 785.2 130.2C814.3 126 843.7 122 872.8 127.8C902 133.7 931 149.3 945.5 157.2L960 165L960 201L945.5 201C931 201 902 201 872.8 201C843.7 201 814.3 201 785.2 201C756 201 727 201 698 201C669 201 640 201 611 201C582 201 553 201 523.8 201C494.7 201 465.3 201 436.2 201C407 201 378 201 349 201C320 201 291 201 262 201C233 201 204 201 174.8 201C145.7 201 116.3 201 87.2 201C58 201 29 201 14.5 201L0 201Z'
          fill={theme.vars.palette.secondary.main}
          strokeLinecap='round'
          strokeLinejoin='miter'
        />
      </svg>
      <Stack
        flexDirection='row'
        alignItems='center'
        p={2}
        width='100%'
        sx={{ bgcolor: 'secondary.main', borderRadius: 'none' }}
      >
        <Stack flexGrow={1} flexDirection='row' alignItems='center' columnGap={2}>
          <Logo
            sx={{
              width: 100,
              height: 100,
              ml: 10,
              display: { xs: 'none', md: 'none', lg: 'flex' },
            }}
          />
          <Logo
            sx={{
              width: 60,
              height: 60,
              ml: 4,
              display: { xs: 'none', md: 'flex', lg: 'none' },
            }}
          />
          <Logo
            sx={{
              width: 40,
              height: 40,
              ml: 1,
              display: { xs: 'flex', md: 'none', lg: 'none' },
            }}
          />
          <ResponsiveLogo>STAY MATE</ResponsiveLogo>
        </Stack>
        <Stack width='40%' minWidth={200} flexDirection='row'>
          <Stack flexGrow={1}>
            <ResponsiveTitle variant='h5' color='white'>
              RESOURCES
            </ResponsiveTitle>
            <ResponsiveContent>Agoda</ResponsiveContent>
            <ResponsiveContent>Material-UI</ResponsiveContent>
          </Stack>
          <Divider />
          <Stack flexGrow={1}>
            <ResponsiveTitle variant='h5' color='white'>
              COMPANY
            </ResponsiveTitle>
            <ResponsiveContent>About us</ResponsiveContent>
            <ResponsiveContent>Careers</ResponsiveContent>
          </Stack>
          <Stack flexGrow={1}>
            <ResponsiveTitle variant='h5' color='white'>
              HELP
            </ResponsiveTitle>
            <ResponsiveContent>Help center</ResponsiveContent>
            <ResponsiveContent>Contact</ResponsiveContent>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      <Box sx={{ flexGrow: 0, bgcolor: 'secondary.main', pt: 2, height: 80 }}>
        <Typography variant='h5' align='center' pb={2}>
          {`Copyright ©  ${new Date().getFullYear()}`}
          <Link color='inherit' href='tuandd.310797@gmail.com'>
            {' '}
            Make by Anh Tuấn{' '}
          </Link>
        </Typography>
      </Box>
    </>
  );
}

export default MainFooter;
