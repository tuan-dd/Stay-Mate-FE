import { Theme, Components } from '@mui/material';

function Card(theme: Theme): Components {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          position: 'relative',
          borderRadius: Number(theme.shape.borderRadius) * 3,
          border: 'solid 0.5px',
          zIndex: 0, // Fix Safari overflow: hidden with border radius
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: {
          variant: 'body2',
          marginTop: theme.spacing(0.5),
        },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
  };
}

export default Card;
