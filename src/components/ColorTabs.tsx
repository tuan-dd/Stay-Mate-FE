import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import { SxProps } from '@mui/material';
import { IActions } from '@utils/interface';
import { styled } from '@mui/material/styles';

const ResponsiveTab = styled(Tab)(({ theme }) => ({
  fontSize: 18,
  [theme.breakpoints.down('md')]: {
    fontSize: 16,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 12,
  },
}));

export default function ColorTabs({
  tabs,
  handleChange,
  value,
  orientation,
  sx,
  sxTab,
  numberBadge,
}: {
  tabs: string[] | IActions[];
  handleChange: (event: React.SyntheticEvent, newValue: string) => void;
  value: string;
  orientation: 'horizontal' | 'vertical';
  sx?: SxProps;
  sxTab?: SxProps;
  numberBadge: number[];
}) {
  return (
    <>
      <Tabs
        orientation={orientation}
        value={value}
        onChange={handleChange}
        textColor='secondary'
        indicatorColor='secondary'
        aria-label='secondary tabs example'
        sx={{ ...sx }}
      >
        {tabs.map((tab, i) => {
          if (typeof tab === 'string')
            return (
              <ResponsiveTab
                key={tab}
                value={tab}
                label={tab}
                sx={{ justifyContent: 'space-around', ...sxTab }}
              />
            );

          return (
            <ResponsiveTab
              key={tab.name}
              value={tab.name}
              label={tab.name}
              icon={
                <Badge
                  color='error'
                  badgeContent={numberBadge[i] || 0}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  {tab.icon}
                </Badge>
              }
              iconPosition='start'
              sx={{ justifyContent: 'flex-start', ...sxTab }}
            />
          );
        })}
      </Tabs>
    </>
  );
}
