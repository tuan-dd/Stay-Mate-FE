import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { IActions } from '@/utils/interface';

export default function BasicSpeedDial({
  hidden,
  actions,
  handelClick,
}: {
  hidden: boolean;
  actions: IActions[] | string[];
  handelClick: (value?: string) => void;
}) {
  return (
    <SpeedDial
      hidden={hidden}
      open={!hidden}
      ariaLabel='SpeedDial basic example'
      sx={{ position: 'fixed', bottom: '2vh', right: 15, color: 'black' }}
      icon={<ArrowUpwardIcon onClick={() => handelClick()} fontSize='large' />}
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
    </SpeedDial>
  );
}
