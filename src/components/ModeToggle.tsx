import { useColorScheme } from '@mui/joy/styles';
import IconButton from '@mui/material/IconButton';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import { SvgIconTypeMap } from '@mui/material';

// import { SvgIconTypeMap } from '@mui/material';
// import React from 'react';

export default function ModeToggle({ ...custom }: SvgIconTypeMap['props']) {
  const { mode, setMode } = useColorScheme();

  return (
    <IconButton
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      sx={{ backgroundColor: (theme) => theme.palette.secondary.light }}
    >
      {mode === 'dark' ? (
        <DarkMode
          {...custom}
          sx={{ color: 'black', ':hover': { color: 'whitesmoke' } }}
        />
      ) : (
        <LightMode
          {...custom}
          sx={{ color: 'whitesmoke', ':hover': { color: 'black' } }}
        />
      )}
    </IconButton>
  );
}
