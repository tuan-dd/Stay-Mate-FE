import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { PropsForm } from '@/utils/interface';

interface ISlider extends PropsForm<number> {
  min: number;
  max: number;
}
const CustomSlider = styled(Slider)(({ theme }) => ({
  color: theme.vars.palette.primary.main,
  height: 8,
  minWidth: 200,
  MarginTop: 20,
  width: '100%',
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 40,
    height: 40,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: theme.vars.palette.primary.dark,
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
}));

function FSlider({ name, min, max }: ISlider) {
  const { control } = useFormContext();
  const [valueChange, setValueChange] = React.useState<[number, number]>([min, max]);

  function valuetext(value: number) {
    return `${value} $`;
  }
  const marks = [
    {
      value: min,
      label: `${min}$`,
    },
    {
      value: max,
      label: `${max}$`,
    },
  ];
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box sx={{ width: '100%', mt: 10 }}>
          <CustomSlider
            value={valueChange}
            min={min}
            max={max}
            marks={marks}
            valueLabelFormat={(value: number) => valuetext(value)}
            valueLabelDisplay='on'
            onMouseUp={() => field.onChange(valueChange)}
            onChange={(_event: Event, value: number | number[]) =>
              setValueChange(value as [number, number])
            }
          />
        </Box>
      )}
    />
  );
}

export default FSlider;
