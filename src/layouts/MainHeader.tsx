import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { shallowEqual, useSelector } from 'react-redux';
import Logo from '@components/Logo';
import ModeToggle from '@components/ModeToggle';
import { fetchCart } from '@reducer/cart/cart.slice';
import { fetchUser } from '@reducer/user/user.slice';
import { fetchNewAccessToken, fetchSignOut } from '@reducer/auth/auth.slice';
import { ERole } from '@utils/enum';
import { decoded, setAllCookie } from '@utils/jwt';
import { RootState, useAppDispatch } from '@app/store';

const pages = ['Help Center', 'Contact', null] as const;
type Pages = (typeof pages)[number];

const settings = ['Account', 'Logout', null] as const;
type Settings = (typeof settings)[number];

function MainHeader({
  setIsOpenModalSignIn,
}: {
  setIsOpenModalSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const currentUser = useSelector(
    (state: RootState) => state.user.currentUser,
    shallowEqual
  );
  const is2FA = useSelector((state: RootState) => state.auth.is2FA, shallowEqual);
  const orders = useSelector((state: RootState) => state.cart.cart?.orders, shallowEqual);

  // const { currentUser } = user;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (!is2FA) {
      setIsOpenModalSignIn(true);
    } else {
      setAnchorElUser(event.currentTarget);
    }
  };

  const handleCloseNavMenu = (page: Pages) => {
    if (!page) return setAnchorElNav(null);

    setAnchorElNav(null);
    return navigate(`${page.toLowerCase().replace(/\s+/g, '')}`);
  };

  const handleCloseAccountMenu = (setting: Settings) => {
    if (!setting) {
      setAnchorElUser(null);
    } else if (setting === 'Logout') {
      dispatch(fetchSignOut());
      navigate('/');
    } else {
      navigate(`${setting.toLowerCase()}`);
    }
    setAnchorElUser(null);
  };

  const handelClickBalance = () => {
    if (currentUser) {
      navigate('/account?tab=Account');
    } else {
      setIsOpenModalSignIn(true);
    }
  };

  React.useEffect(() => {
    try {
      const accessToken = decoded(Cookies.get('accessToken'));
      const refreshToken = decoded(Cookies.get('refreshToken'));
      if (accessToken) {
        dispatch(fetchUser());
      } else if (refreshToken) {
        dispatch(fetchNewAccessToken());
      } else {
        setAllCookie(true);
      }
    } catch (error) {
      setAllCookie(true);
    }
  }, []);

  React.useEffect(() => {
    if (currentUser) dispatch(fetchCart());
  }, [currentUser]);

  const handelClickCustomButton = (value: string) => navigate(`/${value.toLowerCase()}`);

  let CustomButton: JSX.Element | undefined;

  if (currentUser?.role === ERole.ADMIN) {
    CustomButton = (
      <Button onClick={() => handelClickCustomButton('Admin')}>Admin</Button>
    );
  } else if (currentUser?.role === ERole.HOTELIER) {
    CustomButton = (
      <Button onClick={() => handelClickCustomButton('Dashboard')}>Dashboard</Button>
    );
  } else {
    CustomButton = undefined;
  }

  return (
    <AppBar
      sx={{
        position: 'absolute',
        bgcolor: 'common.backgroundChannel',
        boxShadow: 'none',
        p: 1,
      }}
    >
      <Container maxWidth={false} sx={{ height: 80 }}>
        <Toolbar>
          {/* mobile */}
          <Logo
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, width: 50, height: 50 }}
          />

          <Typography
            variant='h5'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'UseUrban',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'primary.dark',
              textDecoration: 'none',
            }}
          >
            Stay Mate
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{
                  my: 2,
                  color: 'secondary.contrastText',
                  display: 'block',
                  fontWeight: 500,
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu(null)}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                  <Typography textAlign='center' color='secondary.contrastText'>
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Logo
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, width: 50, height: 50 }}
          />
          <Typography
            variant='h5'
            noWrap
            component='a'
            href=''
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              color: 'primary.dark',
              flexGrow: 1,
              fontFamily: 'UseUrban',
              fontWeight: 700,
              letterSpacing: '.3rem',
              textDecoration: 'none',
            }}
          >
            Stay Mate
          </Typography>

          {/* box Menu and card */}
          <Stack sx={{ flexGrow: 0 }} flexDirection='row' gap={3} alignItems='center'>
            <ModeToggle />
            {CustomButton}
            <IconButton onClick={() => navigate('/cart')}>
              <Badge badgeContent={orders?.length || 0} color='error'>
                <ShoppingCartIcon sx={{ color: 'primary.contrastText', fontSize: 30 }} />
              </Badge>
            </IconButton>

            <Tooltip title='Open settings'>
              <Stack alignItems='center'>
                <IconButton onClick={handleOpenAccountMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={currentUser?.name}
                    src={currentUser?.avatar}
                    sx={{
                      borderColor: 'black',
                      border: '1px solid black',
                      width: 50,
                      height: 50,
                    }}
                  />
                </IconButton>
                {currentUser?.name && (
                  <Typography
                    fontFamily='monospace'
                    sx={{ filter: ' brightness(1.75)', fontWeight: 600 }}
                  >
                    {currentUser?.name}
                  </Typography>
                )}
              </Stack>
            </Tooltip>
            <Button onClick={handelClickBalance}>
              <Typography
                fontWeight={900}
                color='rgb(155, 70, 201)'
                fontSize={24}
                fontFamily='monospace'
                sx={{ filter: 'brightness(1.25)' }}
              >
                {Math.round(
                  ((currentUser?.account.balance as number) + Number.EPSILON) * 100
                ) / 100 || 0}{' '}
                $
              </Typography>
            </Button>
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={() => handleCloseAccountMenu(null)}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleCloseAccountMenu(setting)}>
                  <Typography textAlign='center'>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default MainHeader;
