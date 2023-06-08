import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { z } from 'zod';
import dayjs from 'dayjs';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { LoadingButton } from '@mui/lab';
import { FAutocomplete, FTextField, FormProvider } from './formProvider';
import { cites } from '@/utils/enum';
import FDatePicker from '@/components/formProvider/FDatePicker';
import { fDate } from '@/utils/formatTime';

type DefaultValues = {
  destination: string;
  startDate: string;
  endDate: string;
  rooms: string;
  adults: string;
  children: string;
};

const numericString = (schema: z.ZodTypeAny) =>
  z.preprocess((a) => {
    if (typeof a === 'string') {
      return parseInt(a, 10);
    }
    if (typeof a === 'number') {
      return a;
    }
    return undefined;
  }, schema) as z.ZodEffects<z.ZodTypeAny, number, number>;

const inputValue = z
  .object({
    destination: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    rooms: numericString(z.number().min(1)),
    adults: numericString(z.number().min(1)),
    children: numericString(z.number().min(0)),
  })
  .refine(
    (data) =>
      dayjs(data.endDate, 'DD-MM-YYYY').isAfter(
        dayjs(data.startDate, 'DD-MM-YYYY'),
        'day'
      ),
    {
      message: 'End date is greater than start date',
      path: ['endDate'], // path of error
    }
  )
  .refine(
    (data) => {
      const numberStartDate = dayjs(data.startDate, 'DD-MM-YYYY')
        .set('hour', 10)
        .set('minute', 0)
        .unix();
      const numberDayNow = dayjs().unix();
      const isValidStartDate = numberDayNow - numberStartDate < 60 * 60 * 24;
      return isValidStartDate;
    },
    {
      message: 'Start date must be equal to or greater than today`s date',
      path: ['startDate'], // path of error
    }
  );

const defaultValues: DefaultValues = {
  destination: cites[0],
  startDate: fDate(new Date()),
  endDate: fDate(new Date(new Date().getTime() + 1000 * 60 * 60 * 24)),
  rooms: '1',
  adults: '2',
  children: '0',
};

const occupancy = [
  { value: 'rooms', min: 1 },
  { value: 'adults', min: 1 },
  { value: 'children', min: 0 },
];

function FormSearchHotels() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const methods = useForm<DefaultValues>({
    defaultValues,
    resolver: zodResolver(inputValue),
  });

  const {
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const dataWatch = watch();

  const labelOccupancy = `${dataWatch.adults} adults, ${dataWatch.children} children`;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const destination = searchParams.get('destination');

  const { hotelId } = useParams();

  // change button when you in hotel page
  const isUpdate = React.useMemo(() => {
    if (hotelId && dataWatch.destination) {
      return destination?.toLowerCase() === dataWatch.destination?.toLowerCase();
    }
    return false;
  }, [dataWatch.destination, destination, hotelId]);

  React.useEffect(() => {
    const objectParams = { ...Object.fromEntries(searchParams.entries()) };
    Object.keys(objectParams).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(defaultValues, key)) {
        setValue(key as keyof DefaultValues, objectParams[key]);
      }
    });
  }, []);

  const onSubmit: SubmitHandler<DefaultValues> = (data) => {
    if (hotelId && destination?.toLowerCase() === dataWatch.destination?.toLowerCase()) {
      const objectParams = { ...Object.fromEntries(searchParams.entries()) };
      (Object.keys(data) as Array<keyof DefaultValues>).forEach(
        (key: keyof DefaultValues) => {
          Object.keys(objectParams).forEach((keyParams) => {
            if (keyParams === key && objectParams[key] !== data[key])
              objectParams[key] = data[key];
          });
        }
      );
      const params = new URLSearchParams(objectParams).toString();
      return navigate(`/hotel/${hotelId}?${params}`);
    }
    const params = new URLSearchParams(data).toString();
    // console.log(params);
    return navigate(`/search?${params}`);
  };

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <FormProvider onSubmit={onSubmit} {...methods}>
        <Stack
          flexDirection='row'
          p={3}
          alignItems='center'
          justifyContent='center'
          width='80vw'
          gap={5}
          mx='auto'
          sx={{ bgcolor: 'background.defaultChannel' }}
        >
          <FAutocomplete name='destination' options={[...cites]} label='Destination' />
          <FDatePicker name='startDate' label='Start Date' />
          <FDatePicker name='endDate' label='End Date' />
          <Button
            id='basic-button'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            variant='outlined'
            sx={{
              minWidth: 250,
              height: 56,
              fontSize: 10,
              mt: 1,
              border: '2px solid',
              borderColor: 'secondary.main',
            }}
            endIcon={open ? <KeyboardArrowDownIcon /> : <KeyboardArrowLeftIcon />}
          >
            <Typography>
              {labelOccupancy} <br />
              <Typography component='span' variant='subtitle2' color='GrayText'>
                {dataWatch.rooms} rooms
              </Typography>
            </Typography>
          </Button>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {occupancy.map((e) => (
              <MenuItem
                sx={{
                  '&.Mui-focusVisible': {
                    bgcolor: 'none',
                  },
                }}
                key={e.value}
              >
                <FTextField
                  InputProps={{ inputProps: { min: e.min, max: 36 } }}
                  type='number'
                  name={e.value}
                  label={e.value.toUpperCase()}
                  color='secondary'
                  focused
                />
              </MenuItem>
            ))}
            <MenuItem>
              <Button type='submit' onClick={handleClose}>
                submit
              </Button>
            </MenuItem>
          </Menu>
          <LoadingButton
            type='submit'
            loading={isSubmitting}
            variant='contained'
            sx={{
              height: 40,
              width: 150,
              backgroundColor: 'secondary',
              color: 'common.white',
              fontSize: 30,
              mt: 1,
            }}
          >
            {isUpdate ? (
              <Typography variant='body1'> Update</Typography>
            ) : (
              <SearchIcon fontSize='inherit' />
            )}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </>
  );
}

export default FormSearchHotels;
