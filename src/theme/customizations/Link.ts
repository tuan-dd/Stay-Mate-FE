import { Components } from '@mui/material';

function Link(): Components {
  return {
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
  };
}

export default Link;
