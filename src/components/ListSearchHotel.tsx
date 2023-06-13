import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import LoadingButton from '@mui/lab/LoadingButton';

import { FAutocomplete, FTextField, FDatePicker } from './formProvider';
import { cites } from '@/utils/enum';

const ResponsiveButton = styled(Button)(({ theme }) => ({
  minWidth: 250,
  height: 56,
  marginTop: 10,
  border: '2px solid',
  borderColor: 'secondary.main',
  [theme.breakpoints.down('md')]: {
    minWidth: 200,
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 150,
  },
}));
const ResponsiveTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    fontSize: 11,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 8,
  },
}));

const ResponsiveTypographySpan = styled('span')(({ theme }) => ({
  color: theme.vars.palette.text.secondary,
  [theme.breakpoints.down('lg')]: {
    fontSize: 9,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 7,
  },
}));

const occupancy = [
  { value: 'rooms', min: 1 },
  { value: 'adults', min: 1 },
  { value: 'children', min: 0 },
];

function ListSearchHotel({
  adults,
  child,
  rooms,
  isUpdate,
}: {
  child: string;
  adults: string;
  rooms: string;
  isUpdate: boolean;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const labelOccupancy = `${adults} adults, ${child} children`;

  const open = Boolean(anchorEl);
  return (
    <>
      <FAutocomplete name='destination' options={[...cites]} label='Destination' />
      <FDatePicker name='startDate' label='Start Date' />
      <FDatePicker name='endDate' label='End Date' />
      <ResponsiveButton
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant='outlined'
        endIcon={open ? <KeyboardArrowDownIcon /> : <KeyboardArrowLeftIcon />}
      >
        <ResponsiveTypography>
          {labelOccupancy} <br />
          <ResponsiveTypographySpan>{rooms} rooms</ResponsiveTypographySpan>
        </ResponsiveTypography>
      </ResponsiveButton>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {occupancy.map((e) => (
          <MenuItem
            sx={{
              '&.Mui-focusVisible': {
                bgcolor: 'none',
              },
            }}
            key={e.value}
          >
            <FTextField
              InputProps={{ inputProps: { min: e.min, max: 36, step: 1 } }}
              type='number'
              name={e.value}
              label={e.value.toUpperCase()}
              color='secondary'
              focused
            />
          </MenuItem>
        ))}
        <MenuItem>
          <Button type='submit'>submit</Button>
        </MenuItem>
      </Menu>
      <LoadingButton
        type='submit'
        variant='contained'
        sx={{
          height: 40,
          width: 150,
          backgroundColor: 'secondary',
          color: 'common.white',
          fontSize: 30,
          mt: 1,
        }}
      >
        {isUpdate ? (
          <Typography variant='body1'> Update</Typography>
        ) : (
          <SearchIcon fontSize='inherit' />
        )}
      </LoadingButton>
    </>
  );
}

export default ListSearchHotel;
