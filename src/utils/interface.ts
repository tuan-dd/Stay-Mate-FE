import { JwtPayload } from 'jwt-decode';
import React from 'react';
import {
  EKeyHeader,
  EPackage,
  EPropertyType,
  ERole,
  ERoomAmenities,
  EStatusIBooking,
} from './enum';

interface ITimestamps {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PropsForm<T = string | number | JSX.Element> {
  name: string;
  min?: number;
  max?: number;
  typeInput?: string;
  placeholder?: string;
  label?: string;
  options?: T[];
  getOptionLabel?: T[];
  children?: React.ReactNode[];
  helperText?: JSX.Element;
}

export interface JwtPayloadUser extends JwtPayload {
  email: string;
  role: ERole;
}

export type KeyHeaderValue =
  | EKeyHeader.ACCESS_TOKEN
  | EKeyHeader.USER_ID
  | EKeyHeader.REFRESH_TOKEN;

export interface IAccount {
  balance: number;
  virtualBalance: number;
}

export interface IUser extends ITimestamps {
  _id: string;
  name: string;
  email: string;
  account: IAccount;
  verify: boolean;
  avatar: string;
  role: ERole;
  isActive?: boolean;
}

interface IStarRating {
  countReview: number;
  starAverage: number;
}

export interface IHotel<T> extends ITimestamps {
  _id: string;
  hotelName: string;
  images: string[];
  address: string;
  city: string;
  country: string;
  zipCode: number;
  propertyType: EPropertyType;
  star: number;
  starRating: IStarRating;
  latitude: number;
  longitude: number;
  package: EPackage;
  userId?: string;
  roomTypeIds: T;
  isDelete?: boolean;
}

export interface IRoom extends ITimestamps {
  _id: string;
  roomAmenities: ERoomAmenities[];
  nameOfRoom: string;
  rateDescription: string;
  price: number;
  priceDiscount?: number;
  discount?: number;
  mealType?: string;
  taxType?: string;
  images: string[];
  numberOfRoom: number;
}

interface IAuthor {
  name: string;
  authorId: string;
  role: ERole;
}

interface IHotelReview {
  name: string;
  hotelId: string;
}

interface IRoomsInIReview {
  name: string;
  quantity: number;
}
export interface IReview extends ITimestamps {
  _id: string;
  context?: string;
  images: string[];
  starRating: number;
  slug?: string;
  startDate: Date;
  endDate: Date;
  parent_slug?: string;
  author: IAuthor;
  hotel: IHotelReview;
  rooms?: IRoomsInIReview[];
  bookingId: string;
  isReply?: boolean;
  isDelete?: boolean;
}

export interface IMembership extends ITimestamps {
  _id: string;
  userId: string;
  package: EPackage;
  timeStart?: Date;
  timeEnd?: Date;
  isExpire?: boolean;
}

// interface IRoomInIBookingReq {
//   roomTypeId: string;
//   quantity: number;
// }

export interface IBookingRes extends ITimestamps {
  _id?: string;
  total: number;
  status?: EStatusIBooking;
  rooms: IRoomCartRes[];
  userId?: string;
  hotelId: IHotelIdRes;
  startDate: string;
  endDate: string;
  duration: number;
}

interface IRoomTypeIdRes {
  _id: string;
  price: number;
  nameOfRoom: string;
  numberOfRoom: number;
}

export interface IRoomCartRes {
  roomTypeId: IRoomTypeIdRes;
  quantity: number;
}

interface IHotelIdRes {
  _id: string;
  package: EPackage;
  star: number;
  starRating: IStarRating;
  hotelName: string;
  city: string;
  country: string;
  isDelete: boolean;
}

export interface IOrderRes {
  hotelId: IHotelIdRes;
  startDate: string;
  endDate: string;
  createdAt?: Date;
  rooms: IRoomCartRes[];
}

export interface ICartRes extends ITimestamps {
  userId: string;
  isActive: boolean;
  orders: IOrderRes[];
}

export interface IRoomCartReq {
  roomTypeId: string;
  quantity: number;
}

export interface IOrderReq {
  hotelId: string;
  startDate: string;
  createdAt: Date;
  endDate: string;
  rooms: IRoomCartReq[];
}

export interface ICartReq extends ITimestamps {
  userId: string;
  isActive: boolean;
  orders: IOrderReq[];
}

export interface IResponse<T = any> {
  data: T | null;
  message: string;
}

export interface IActions {
  icon?: JSX.Element;
  name: string;
}

export interface IConTextRouter {
  setIsOpenModalSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}
