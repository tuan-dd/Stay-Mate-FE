/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FromSearchFilter from '@components/searchPage/FromSearchFilter';
import FormSearchHotels from '@components/FormSearchHotels';
import { FormProvider } from '@components/formProvider';
import CardHotel from '@components/searchPage/CardHotel';
import { IHotel, IResponse, IRoom } from '@utils/interface';
import apiService from '@app/server';
import LinearLoading from '@components/LinearLoading';
import { IResponseGetHotels } from '@utils/loader';
import { styled } from '@mui/material/styles';
import {
  Pros,
  TProsLodash,
  deleteValueNull,
  getDeleteFilter,
  throttle,
} from '@/utils/utils';
import { IParams } from './HotelDetailPage';

interface IDataHotelsRes extends IParams {
  result: IHotel<IRoom[]>[];
  count: number;
}
export type DefaultValues = {
  budget: number[];
  roomAmenities: string[];
  star: string;
  bedType: string;
  mealType: string;
};

const defaultValues: DefaultValues = {
  budget: [],
  roomAmenities: [],
  star: '',
  bedType: '',
  mealType: '',
};

interface IDataWatch {
  budget?: (number | undefined)[] | undefined;
  roomAmenities?: (string | undefined)[] | undefined;
  star?: string | undefined;
  bedType?: string | undefined;
  mealType?: string | undefined;
}

interface IQuery extends DefaultValues {
  price_gte: number;
  price_lte: number;
  rateDescription: string;
}

export const ResponsiveStack = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
  },
}));

function SearchPage() {
  const loaderData = useLoaderData() as IDataHotelsRes;
  const [page, setPage] = React.useState<number>(1);
  const [count, setCount] = React.useState<number>(loaderData.count);
  const [hotels, setHotels] = React.useState<IHotel<IRoom[]>[]>([]);
  const [isFinishGetDaTa, setIsFinishGetDaTa] = React.useState<boolean>(true);
  const isFinishGetDaTaRef = React.useRef(true);
  const isFetchNoData = React.useRef<boolean>(false);
  const refCheckValue = React.useRef<IDataWatch>(defaultValues);
  const objectParams: TProsLodash<any> = React.useMemo(
    () => getDeleteFilter(['result'], loaderData),
    [loaderData]
  );

  const navigate = useNavigate();
  const methods = useForm<DefaultValues>({
    defaultValues,
  });
  const { watch, reset } = methods;

  async function fetchPage() {
    setPage((e) => e + 1);
    try {
      isFinishGetDaTaRef.current = false;
      isFetchNoData.current = true;
      setIsFinishGetDaTa(false);

      const convertData = deleteValueNull(refCheckValue.current);

      if (convertData.budget) {
        convertData.price_gte = convertData.budget[0] as number;
        convertData.price_lte = convertData.budget[1] as number;
        delete convertData.budget;
      }
      if (convertData.bedType) {
        if (convertData.bedType === 'king')
          convertData.rateDescription = `${convertData.bedType} bed`;
        else {
          convertData.rateDescription = convertData.bedType;
        }
      }

      const newData = await apiService.get<IResponse<IResponseGetHotels>>('/hotel', {
        params: { ...objectParams, ...convertData, page: page + 1 },
      });
      if (newData.data.data && newData.data.data.result.length > 0) {
        const { result } = newData.data.data;
        isFetchNoData.current = false;
        setHotels((previousData) => [...previousData, ...result]);
      }

      isFinishGetDaTaRef.current = true;
      setIsFinishGetDaTa(true);
    } catch (error) {
      isFinishGetDaTaRef.current = true;
      setIsFinishGetDaTa(true);
      window.removeEventListener('scroll', tHandler);
    }
  }

  const onScroll = () => {
    const heightScroll = window.scrollY + window.innerHeight;

    if (heightScroll > (document.documentElement.scrollHeight * 180) / 200) {
      fetchPage();
    }
  };

  const tHandler = throttle(onScroll, 400);
  React.useEffect(() => {
    if (!isFetchNoData.current) window.addEventListener('scroll', tHandler);

    return () => window.removeEventListener('scroll', tHandler);
  }, [page, isFetchNoData.current]);

  const fetchFilter = React.useCallback(async (data: IDataWatch) => {
    refCheckValue.current = data;
    isFetchNoData.current = false;

    setPage(1);

    const convertData: Pros<IQuery> = deleteValueNull(data);

    if (convertData.budget) {
      convertData.price_gte = convertData.budget[0] as number;
      convertData.price_lte = convertData.budget[1] as number;
      delete convertData.budget;
    }
    if (convertData.bedType) {
      if (convertData.bedType === 'king')
        convertData.rateDescription = `${convertData.bedType} bed`;
      else {
        convertData.rateDescription = convertData.bedType;
      }
    }
    try {
      const newData = await apiService.get<IResponse<IResponseGetHotels>>('/hotel', {
        params: { ...objectParams, ...convertData, page: 1 },
      });
      if (newData.data.data) {
        setCount(newData.data.data.count);
        setHotels(newData.data.data.result);
      }
    } catch (error) {
      setHotels([]);
    }
  }, []);

  watch((data) => {
    if (JSON.stringify(data) !== JSON.stringify(refCheckValue.current)) {
      fetchFilter(data);
    }
  });

  const handelNavigateDetail = (id: string, index: number) => {
    objectParams.destination = loaderData.result[index].hotelName;
    objectParams.city = loaderData.result[index].city;
    objectParams.country = loaderData.result[index].country;
    const params = new URLSearchParams(objectParams).toString();
    navigate(`/hotel/${id}?${params}`);
  };

  React.useEffect(() => {
    isFetchNoData.current = false;
    setPage(1);
    setHotels(loaderData.result);
    reset(defaultValues);
  }, [loaderData.result]);

  const handelReset = () => {
    reset(defaultValues);
  };

  return (
    <>
      <Container maxWidth={false}>
        <Stack mt={16} spacing={3} alignItems='center' width='100%'>
          <FormSearchHotels marginTop='15px !important' width='80vw' />
          <ResponsiveStack flexDirection='row' columnGap={4} width='80vw'>
            <Box>
              <FormProvider {...methods}>
                <FromSearchFilter handelReset={handelReset} />
              </FormProvider>
            </Box>
            <Stack width='100%' spacing={1} position='relative'>
              {hotels.length > 0 && (
                <Typography variant='h5' sx={{ ml: 1 }}>
                  Found {count} {count === 1 ? 'hotel' : 'hotels'} in the city of{' '}
                  {hotels[0].city} form {hotels[0].country}
                </Typography>
              )}

              {hotels.length <= 0 ? (
                <Typography variant='h3' textAlign='center' mt={8}>
                  Not Found Hotel
                </Typography>
              ) : (
                hotels.map((hotel, index) => (
                  <Box
                    key={`${hotel.hotelName}_${index}`}
                    sx={{ position: 'relative', padding: 1, width: '100%' }}
                  >
                    <CardHotel
                      hotel={hotel}
                      index={index}
                      handelNavigateDetail={handelNavigateDetail}
                    />
                  </Box>
                ))
              )}
            </Stack>
          </ResponsiveStack>
        </Stack>
        {!isFinishGetDaTaRef.current && !isFinishGetDaTa && (
          <Box sx={{ mt: 5 }}>
            <LinearLoading />
          </Box>
        )}
      </Container>
    </>
  );
}

export default SearchPage;
