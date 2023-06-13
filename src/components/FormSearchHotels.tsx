import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Stack from '@mui/material/Stack';
import { z } from 'zod';
import dayjs from 'dayjs';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { FormProvider } from './formProvider';
import { cites } from '@/utils/enum';
import { fDate } from '@/utils/formatTime';
import ListSearchHotel from './ListSearchHotel';

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

const startDate =
  dayjs().hour() > 22
    ? fDate(new Date(new Date().getTime() + 1000 * 60 * 60 * 24))
    : fDate(new Date());

const endDate =
  dayjs().hour() > 22
    ? fDate(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2))
    : fDate(new Date(new Date().getTime() + 1000 * 60 * 60 * 24));

function FormSearchHotels({
  width = '80vw',
  marginTop,
}: {
  width?: string | number;
  marginTop?: string | number;
}) {
  const ResponsiveTypographyStack = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.vars.palette.background.defaultChannel,
    [theme.breakpoints.down('md')]: {
      margin: 'auto',
      flexDirection: 'column',
      height: 350,
      width: 250,
      justifyContent: 'center',
      marginTop: 80,
    },
    [theme.breakpoints.down('sm')]: {
      height: 300,
      width: 200,
      marginTop: 100,
    },
    width,
    marginTop,
  }));
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const destination = searchParams.get('destination');

  const objectParams = { ...Object.fromEntries(searchParams.entries()) };

  const defaultValues: DefaultValues = {
    destination: objectParams.destination || cites[0],
    startDate:
      dayjs(objectParams.startDate, 'DD-MM-YYYY').isValid() && objectParams.startDate
        ? fDate(objectParams.startDate, 'DD-MM-YYYY', 'DD-MM-YYYY')
        : startDate,
    endDate:
      dayjs(objectParams.endDate, 'DD-MM-YYYY').isValid() && objectParams.endDate
        ? fDate(objectParams.endDate, 'DD-MM-YYYY', 'DD-MM-YYYY')
        : endDate,
    adults: Number(objectParams.adults) ? Number(objectParams.adults).toString() : '2',
    children: Number(objectParams.children)
      ? Number(objectParams.children).toString()
      : '0',
    rooms: Number(objectParams.rooms) ? Number(objectParams.rooms).toString() : '1',
  };
  const methods = useForm<DefaultValues>({
    defaultValues,
    resolver: zodResolver(inputValue),
  });

  const { watch } = methods;

  const dataWatch = watch();

  const { hotelId } = useParams();

  // change button when you in hotel page
  const isUpdate = React.useMemo(() => {
    if (hotelId && dataWatch.destination) {
      return destination?.toLowerCase() === dataWatch.destination?.toLowerCase();
    }
    return false;
  }, [dataWatch.destination, destination, hotelId]);

  const onSubmit: SubmitHandler<DefaultValues> = (data) => {
    if (hotelId && destination?.toLowerCase() === dataWatch.destination?.toLowerCase()) {
      (Object.keys(data) as Array<keyof DefaultValues>).forEach(
        (key: keyof DefaultValues) => {
          Object.keys(objectParams).forEach((keyParams) => {
            if (keyParams === key && objectParams[key] !== data[key])
              objectParams[key] = data[key].toString();
          });
        }
      );
      const params = new URLSearchParams(objectParams).toString();
      return navigate(`/hotel/${hotelId}?${params}`);
    }
    const params = new URLSearchParams(data).toString();

    return navigate(`/search?${params}`);
  };

  const occupancy = {
    adults: dataWatch.adults,
    rooms: dataWatch.rooms,
    child: dataWatch.children,
    isUpdate,
  };

  return (
    <>
      <FormProvider onSubmit={onSubmit} {...methods}>
        <ResponsiveTypographyStack columnGap={2}>
          <ListSearchHotel {...occupancy} />
        </ResponsiveTypographyStack>
      </FormProvider>
    </>
  );
}

export default FormSearchHotels;
