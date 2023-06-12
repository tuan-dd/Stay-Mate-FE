/* eslint-disable @typescript-eslint/no-empty-interface */
import { deepmerge } from '@mui/utils';
import type {} from '@mui/material/themeCssVarsAugmentation';
import {
  experimental_extendTheme as extendMuiTheme,
  PaletteColor,
  TypeText,
  TypeAction,
  Overlays,
  PaletteColorChannel,
  PaletteAlert,
  PaletteAppBar,
  PaletteAvatar,
  PaletteChip,
  PaletteFilledInput,
  PaletteLinearProgress,
  PaletteSlider,
  PaletteSkeleton,
  PaletteSnackbarContent,
  PaletteSpeedDialAction,
  PaletteStepConnector,
  PaletteStepContent,
  PaletteSwitch,
  PaletteTableCell,
  PaletteTooltip,
  Shadows,
  ZIndex,
} from '@mui/material/styles';
import colors from '@mui/joy/colors';
import {
  extendTheme as extendJoyTheme,
  FontSize,
  Theme as JoyTheme,
  ThemeVars as JoyThemeVars,
  ThemeCssVar as JoyThemeCssVar,
} from '@mui/joy/styles';

// Joy UI components
import { CommonColors } from '@mui/material/styles/createPalette';
import { TypeBackground, alpha } from '@mui/material';
import customizeComponents from './customizations';

// extends Joy theme to include tokens from Material UI
declare module '@mui/joy/styles' {
  interface Palette {
    secondary: PaletteColorChannel;
    error: PaletteColorChannel;
    dividerChannel: string;
    action: TypeAction;
    Alert: PaletteAlert;
    AppBar: PaletteAppBar;
    Avatar: PaletteAvatar;
    Chip: PaletteChip;
    FilledInput: PaletteFilledInput;
    LinearProgress: PaletteLinearProgress;
    Skeleton: PaletteSkeleton;
    Slider: PaletteSlider;
    SnackbarContent: PaletteSnackbarContent;
    SpeedDialAction: PaletteSpeedDialAction;
    StepConnector: PaletteStepConnector;
    StepContent: PaletteStepContent;
    Switch: PaletteSwitch;
    TableCell: PaletteTableCell;
    Tooltip: PaletteTooltip;
  }
  interface PalettePrimary extends PaletteColor {}
  interface PaletteInfo extends PaletteColor {}
  interface PaletteSuccess extends PaletteColor {}
  interface PaletteWarning extends PaletteColor {}
  interface PaletteCommon extends CommonColors {}
  interface PaletteText extends TypeText {}
  interface PaletteBackground extends TypeBackground {}

  interface ThemeVars {
    // attach to Joy UI `theme.vars`
    shadows: Shadows;
    overlays: Overlays;
    zIndex: ZIndex;
  }
}

type MergedThemeCssVar = { [k in JoyThemeCssVar]: true };

declare module '@mui/material/styles' {
  interface Theme {
    // put everything back to Material UI `theme.vars`
    vars: JoyTheme['vars'];
  }

  // makes Material UI theme.getCssVar() sees Joy theme tokens
  type ThemeCssVarOverrides = MergedThemeCssVar;
}

declare module '@mui/material/SvgIcon' {
  type SvgIconPropsSizeOverride = Record<keyof FontSize, true>;
  // Co s
  interface SvgIconPropsColorOverrides {
    danger: true;
    neutral: true;
  }
}

const PRIMARY = {
  lighter: '#C8FACD',
  light: '#5BE584',
  main: 'rgb(1, 170, 228)',
  dark: '#e76993',
  darker: 'rgba(198, 148, 9, 0.4)',
  contrastText: '#0b0b0b',
  black: '#f25c90',
};
const SECONDARY = {
  lighter: '#D6E4FF',
  light: 'rgba(182,235,251,255)',
  main: ' rgb(1, 170, 228)',
  dark: '#1939B7',
  darker: '#091A7A',
  contrastText: 'rgb(0, 0, 0)',
};
const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: '#FcFcFc',
};

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8),
};

declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter: string;
    darker: string;
    black: string;
  }
  interface PaletteColorChannel {
    main: string;
  }
}

// function ThemeProvider({ children }) {
const themeOptions = {
  palette: {
    primary: PRIMARY,
    secondary: SECONDARY,
    success: SUCCESS,
    text: {
      primary: GREY[900],
      secondary: GREY[600],
      disabled: GREY[500],
    },
    common: {
      onBackground: 'rgba(7, 22, 36, 0.376)',
      backgroundChannel: 'rgba(7, 22, 36, 0.15)',
    },
    background: {
      paper: '#fff',
      default: '#fff',
      neutral: GREY[200],
      defaultChannel: 'rgba(182,235,251,255)',
    },
    action: {
      active: GREY[600],
      hover: GREY[500_8],
      selected: GREY[500_16],
      disabled: GREY[500_80],
      disabledBackground: GREY[500_24],
      focus: GREY[500_24],
      hoverOpacity: 0.08,
      disabledOpacity: 0.48,
    },
  },
};

// interface PaletteColorChannel {
//   darker: string;
// }

const primaryIoy = {
  main: 'rgb(1, 170, 228)',
  dark: '#e76993',
  contrastText: '#fcfcfc',
  darker: 'rgba(198, 148, 9, 0.4)',
};

const successIoy = {
  main: colors.green[600],
  light: '#b7ff8d',
  darker: '#08660D',
  contrastText: '#fcfcfc',
};
const muiTheme = extendMuiTheme({
  cssVarPrefix: 'joy',
  colorSchemes: {
    light: {
      ...themeOptions,
    },
    dark: {
      palette: {
        primary: primaryIoy,
        secondary: {
          light: 'rgba(182,235,251,255)',
          main: 'rgb(1, 170, 228)',
          contrastText: 'rgb(255, 254, 254)',
        },
        success: successIoy,
        grey: colors.grey,
        error: {
          main: colors.red[600],
        },
        info: {
          main: colors.purple[600],
        },
        warning: {
          main: colors.yellow[300],
        },
        common: {
          white: '#FFF',
          background: 'rgba(7, 22, 36, 0)',
          onBackground: 'rgba(7, 22, 36, 0.862)',
          backgroundChannel: 'rgba(7, 22, 36, 0.15)',
        },
        divider: colors.grey[800],
        background: {
          defaultChannel: 'rgba(7, 22, 36, 0.48)',
          default: '#002233',
          paper: 'rgba(45, 56, 67, 0.768)',
        },
        text: {
          primary: GREY[900],
          secondary: GREY[600],
          disabled: GREY[500],
        },
      },
    },
  },
});

muiTheme.components = customizeComponents(muiTheme);

// console.log(muiTheme);

const joyTheme = extendJoyTheme();

const mergedTheme = {
  ...muiTheme,
  ...joyTheme,
  components: { ...muiTheme.components },
  colorSchemes: deepmerge(muiTheme.colorSchemes, joyTheme.colorSchemes),
  typography: {
    ...muiTheme.typography,
    ...joyTheme.typography,
  },
} as unknown as ReturnType<typeof extendJoyTheme>;

mergedTheme.generateCssVars = (colorScheme) => ({
  css: {
    ...muiTheme.generateCssVars(colorScheme).css,
    ...joyTheme.generateCssVars(colorScheme).css,
  },
  vars: deepmerge(
    muiTheme.generateCssVars(colorScheme).vars,
    joyTheme.generateCssVars(colorScheme).vars
  ) as unknown as JoyThemeVars,
});
mergedTheme.unstable_sxConfig = {
  ...muiTheme.unstable_sxConfig,
  ...joyTheme.unstable_sxConfig,
};

export default mergedTheme;
