import { Theme, Components } from '@mui/material';

export default function Box(theme: Theme): Components {
  return {
    MuiStack: {
      defaultProps: {
        borderRadius: Number(theme.shape.borderRadius) * 3,
      },
    },
  };
}
