import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IActions } from '@/utils/interface';

const ResponsiveSpeedDial = styled(SpeedDial)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '.MuiButtonBase-root': {
      width: 30,
      height: 30,
    },
  },
}));

export default function BasicSpeedDial({
  hidden,
  actions,
  handelClick,
}: {
  hidden: boolean;
  actions: IActions[] | string[];
  handelClick: (value?: string) => void;
}) {
  const matchesMobile = useMediaQuery('(max-width:600px)');
  return (
    <ResponsiveSpeedDial
      hidden={hidden}
      open={!hidden}
      ariaLabel='SpeedDial basic example'
      sx={{ position: 'fixed', bottom: '2vh', right: 15, color: 'black' }}
      icon={
        <ArrowUpwardIcon
          onClick={() => handelClick()}
          fontSize={matchesMobile ? 'inherit' : 'large'}
        />
      }
    >
      {actions.map((action, i) => {
        if (typeof action === 'object')
          return (
            <SpeedDialAction
              key={i}
              sx={{ textTransform: 'capitalize' }}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handelClick(action.name)}
            />
          );
        return (
          <SpeedDialAction
            key={i}
            sx={{ textTransform: 'capitalize' }}
            icon={action}
            tooltipTitle={action}
            onClick={() => handelClick(action)}
          />
        );
      })}
    </ResponsiveSpeedDial>
  );
}
