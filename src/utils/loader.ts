import { LoaderFunctionArgs } from 'react-router-dom';
import apiService from '@/app/server';
import { IHotel, IResponse, IRoom } from './interface';
import { cites } from './enum';
import { fDate } from './formatTime';

export async function loaderHotel({ params, request }: LoaderFunctionArgs) {
  const { hotelId } = params;
  const url = new URL(request.url);
  const objectParams = { ...Object.fromEntries(url.searchParams.entries()) };
  if (!hotelId) throw new Error('Expected params.id');

  try {
    const response = await apiService.get<IResponse<IHotel<IRoom[]>>>(
      `/hotel/${hotelId}`,
      {
        params: {
          startDate: fDate(objectParams.startDate, 'YYYY-MM-DD', 'DD-MM-YYYY'),
          endDate: fDate(objectParams.endDate, 'YYYY-MM-DD', 'DD-MM-YYYY'),
        },
      }
    );
    return {
      data: response.data.data,
      ...objectParams,
    };
  } catch (error) {
    // throw  new error;
    return error;
  }
}
export interface IResponseGetHotels {
  result: IHotel<IRoom[]>[];
  count: number;
}

export async function loaderHotels({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const objectParams = {
    ...Object.fromEntries(url.searchParams.entries()),
  };

  if (typeof objectParams.destination === 'string') {
    const isCity = cites.includes(objectParams.destination);
    if (!isCity) {
      objectParams.hotelName = objectParams.destination;
    } else {
      objectParams.city = objectParams.destination;
    }
    delete objectParams.destination;
  }

  // const searchParams = new URLSearchParams(objectParams).toString();

  const response = await apiService.get<IResponse<IResponseGetHotels>>('/hotel', {
    params: { ...objectParams },
  });
  return {
    result: response.data.data?.result,
    count: response.data.data?.count,
    ...objectParams,
  };
}
