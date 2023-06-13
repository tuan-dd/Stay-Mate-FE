import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import { Link as LinkRouter } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { ResponsiveStack } from '@/pages/SearchPage';

interface IBreadcrumbs {
  value: string;
  link: string;
}

export const ResponsiveLink = styled(LinkRouter)(({ theme }) => ({
  fontSize: 20,
  color: theme.vars.palette.primary.dark,
  textDecoration: 'underline',
  [theme.breakpoints.down('lg')]: {
    fontSize: 14,
  },
  [theme.breakpoints.down('md')]: {
    fontSize: 14,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 9,
  },
}));
export const ResponsiveTypography = styled(Typography)(({ theme }) => ({
  paddingTop: 2,
  textDecoration: 'underline',
  fontSize: 22,
  [theme.breakpoints.down('lg')]: {
    fontSize: 18,
  },
  [theme.breakpoints.down('md')]: {
    fontSize: 15,
  },
  [theme.breakpoints.down('sm')]: {
    paddingTop: 5,
    fontSize: 12,
  },
}));

function BreadcrumbsDetail({
  breadcrumbs,
  setIsModalMapOpen,
}: {
  breadcrumbs: IBreadcrumbs[];
  setIsModalMapOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <ResponsiveStack
        mt={2}
        spacing={1}
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
      >
        <Stack flexDirection='row' alignItems='center'>
          <Breadcrumbs separator='›'>
            <ResponsiveLink color='primary.dark' to={breadcrumbs[0].link}>
              {breadcrumbs[0].value}
            </ResponsiveLink>
            <ResponsiveLink color='primary.dark' to={breadcrumbs[1].link}>
              {breadcrumbs[1].value}
            </ResponsiveLink>
            <ResponsiveLink to={breadcrumbs[2].link}>
              {breadcrumbs[2].value}
            </ResponsiveLink>
            <ResponsiveTypography
              color='primary'
              sx={{ textDecoration: 'underline', textTransform: 'upperCase' }}
            >
              {breadcrumbs[3].value}
            </ResponsiveTypography>
          </Breadcrumbs>
        </Stack>
        <Button
          onClick={() => setIsModalMapOpen(true)}
          sx={{ width: 120, display: { xs: 'flex', md: 'none' }, fontSize: 10 }}
          variant='contained'
        >
          See Map
        </Button>
        <Button
          onClick={() => setIsModalMapOpen(true)}
          sx={{ width: 200, display: { xs: 'none', md: 'flex' } }}
          variant='contained'
        >
          See Map
        </Button>
      </ResponsiveStack>
    </>
  );
}

export default BreadcrumbsDetail;
