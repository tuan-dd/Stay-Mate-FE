import { useColorScheme } from '@mui/joy/styles';
import IconButton from '@mui/material/IconButton';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
// import React from 'react';

export default function ModeToggle() {
  const { mode, setMode } = useColorScheme();

  return (
    <IconButton
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      sx={{ backgroundColor: (theme) => theme.palette.secondary.light }}
    >
      {mode === 'dark' ? (
        <DarkMode
          fontSize='large'
          sx={{ color: 'black', ':hover': { color: 'whitesmoke' } }}
        />
      ) : (
        <LightMode
          fontSize='large'
          sx={{ color: 'whitesmoke', ':hover': { color: 'black' } }}
        />
      )}
    </IconButton>
  );
}
