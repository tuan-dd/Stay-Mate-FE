import { Theme, Components, CssVarsTheme } from '@mui/material';

function Tabs(theme: Omit<Theme, 'palette'> & CssVarsTheme): Components {
  return {
    MuiTab: {
      styleOverrides: {
        root: {
          paddingLeft: 4,
          fontWeight: 600,
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius,
          textTransform: 'capitalize',
          '&.Mui-selected': {
            color: theme.vars.palette.primary.dark,
          },
        },
        labelIcon: {
          minHeight: 48,
          flexDirection: 'row',
          '& > *:first-of-type': {
            marginBottom: 0,
            marginRight: theme.spacing(1),
          },
        },
        wrapped: {
          flexDirection: 'row',
          whiteSpace: 'nowrap',
        },
      },
    },
  };
}

export default Tabs;
