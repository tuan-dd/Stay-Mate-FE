import React, { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { z } from 'zod';
import RateReviewIcon from '@mui/icons-material/RateReview';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import ModalMap from '@components/modal/ModalMap';
import ModalImages from '@components/modal/ModalImages';
import BoxImages from '@components/hotelDetailPage/BoxImages';
import ColorTabs from '@components/ColorTabs';
import Overview from '@components/hotelDetailPage/Overview';
import Rooms from '@components/hotelDetailPage/Rooms';
import Reviews from '@components/hotelDetailPage/Reviews';
import { urlImagesRooms, urlImagesRoomsLove } from '@utils/images';
import { IHotel, IRoom } from '@utils/interface';
import BasicSpeedDial from '@components/SpeedDial';
import FormSearchHotels from '@components/FormSearchHotels';
import { styled } from '@mui/material/styles';
import { createToast, getDeleteFilter, throttle } from '@/utils/utils';
import BreadcrumbsDetail from '@/components/hotelDetailPage/BreadcrumbsDetail';

export interface IParams {
  country?: string;
  city?: string;
  destination?: string;
  startDate: string;
  endDate: string;
  rooms: string;
  adults: string;
  children?: string;
}

export interface IDataHotelDetail extends IParams {
  data: IHotel<IRoom[]>;
}

const isUrl = z.string().url();

const element = [
  { icon: <VisibilityIcon />, name: 'overview' },
  { icon: <BedroomParentIcon />, name: 'rooms' },
  { icon: <RateReviewIcon />, name: 'reviews' },
];

const ResponsiveStack = styled(Stack)(({ theme }) => ({
  padding: '0 130px 0 130px',
  paddingTop: 140,
  rowGap: 10,
  position: 'relative',
  pt: 15,
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
  },
}));

function HotelDetailPage() {
  const dateHotel = useLoaderData() as IDataHotelDetail;
  const [isModalMapOpen, setIsModalMapOpen] = React.useState<boolean>(false);
  const [isModalImagesOpen, setIsModalImagesOpen] = React.useState<boolean>(false);
  const [positionPage, setPositionPage] = React.useState<string>(element[0].name);
  const [isSpeedHidden, setIsSpeedHidden] = React.useState<boolean>(true);
  const alertAfterUpdateRef = React.useRef<number>(0);
  const objectParams: Omit<IDataHotelDetail, string> = getDeleteFilter(
    ['data', 'country', 'city', 'destination'],
    dateHotel
  );

  const searchParams = new URLSearchParams(objectParams).toString();
  const breadcrumbs = [
    { value: 'Home', link: '/' },
    {
      value: `Country: ${dateHotel?.data?.country}`,
      link: `/search?country=${dateHotel?.data?.country}&${searchParams}`,
    },
    {
      value: `City: ${dateHotel?.data?.city}`,
      link: `/search?city=${dateHotel?.data?.city}&${searchParams}`,
    },
    { value: `${dateHotel.data?.hotelName}`, link: '..' },
  ];

  const imagesHotel = useMemo<string[]>(() => {
    if (dateHotel.data?.images && isUrl.safeParse(dateHotel.data?.images[0]).success) {
      return dateHotel.data.images;
    }
    return [];
  }, []);

  const imagesAll = useMemo<string[]>(() => {
    const imagesRooms = dateHotel.data?.roomTypeIds.flatMap((room) =>
      isUrl.safeParse(room.images[0]).success ? room.images : [...urlImagesRooms]
    );

    return [...imagesRooms, ...imagesHotel, ...urlImagesRoomsLove];
  }, []);

  const handleChangePosition = (_event: React.SyntheticEvent, newValue: string) => {
    (document.querySelector(`#${newValue}`) as HTMLElement).scrollIntoView({
      behavior: 'smooth',
    });

    setPositionPage(newValue);
  };

  React.useEffect(() => {
    const evenListener = () => {
      const heightScroll = window.scrollY + window.innerHeight;
      return heightScroll > (document.documentElement.scrollHeight * 8) / 20
        ? setIsSpeedHidden(false)
        : setIsSpeedHidden(true);
    };

    const tHandler = throttle(evenListener, 150);
    window.addEventListener('scroll', tHandler);

    return () => window.removeEventListener('scroll', tHandler);
  }, []);

  const handleSpeedHidden = (value?: string) => {
    if (value)
      return (document.querySelector(`#${value}`) as HTMLElement).scrollIntoView({
        behavior: 'smooth',
      });

    return window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const roomAmenities = React.useMemo(() => {
    const a: string[] = [];
    dateHotel.data?.roomTypeIds.forEach((room) => {
      // if (room?.roomAmenities)
      room?.roomAmenities?.forEach((amenity) => {
        if (!a.includes(amenity)) {
          a.push(amenity);
        }
      });
    });
    return a;
  }, []);

  React.useEffect(() => {
    if (alertAfterUpdateRef.current > 1) {
      createToast('update success', 'success');
    }
    alertAfterUpdateRef.current += 1;
  }, [dateHotel]);

  return (
    <ResponsiveStack>
      <BreadcrumbsDetail
        setIsModalMapOpen={setIsModalMapOpen}
        breadcrumbs={breadcrumbs}
      />
      <BoxImages
        imagesHotel={imagesAll}
        setIsModalImagesOpen={setIsModalImagesOpen}
        hotelName={dateHotel.data?.hotelName}
      />
      <FormSearchHotels width='100%' marginTop='15px !important' />
      <ColorTabs
        numberBadge={[]}
        orientation='horizontal'
        value={positionPage}
        handleChange={handleChangePosition}
        tabs={[...element]}
      />
      <Overview
        id='overview'
        hotel={dateHotel.data}
        setIsModalMapOpen={setIsModalMapOpen}
        roomAmenities={roomAmenities}
      />
      <Typography variant='h3' id='rooms' textAlign='center' py={2}>
        {dateHotel.data.roomTypeIds?.length} Room Types
      </Typography>
      <Rooms dateHotel={dateHotel} />
      <Typography variant='h3' id='reviews' textAlign='center' py={2}>
        Reviews
      </Typography>
      <Reviews
        count={dateHotel.data.starRating?.countReview}
        idHotel={dateHotel.data._id}
      />
      <ModalMap
        isOpenModal={isModalMapOpen}
        setIsOpenModal={setIsModalMapOpen}
        lat={dateHotel.data?.latitude as number}
        lng={dateHotel.data?.longitude as number}
      />
      <ModalImages
        isOpenModal={isModalImagesOpen}
        setIsOpenModal={setIsModalImagesOpen}
        images={imagesAll}
      />
      <BasicSpeedDial
        hidden={isSpeedHidden}
        actions={element}
        handelClick={handleSpeedHidden}
      />
    </ResponsiveStack>
  );
}

export default HotelDetailPage;
