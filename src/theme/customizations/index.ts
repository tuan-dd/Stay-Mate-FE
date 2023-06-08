import { Theme, Components, CssVarsTheme } from '@mui/material';
import Card from './Card';
import Tabs from './Tabs';
import Link from './Link';
import Stack from './Stack';

function customizeComponents(theme: Omit<Theme, 'palette'> & CssVarsTheme): Components {
  return { ...Tabs(theme), ...Card(theme), ...Link(), ...Stack(theme) };
}

export default customizeComponents;
