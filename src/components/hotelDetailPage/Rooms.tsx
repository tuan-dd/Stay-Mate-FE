import * as React from 'react';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import Button from '@mui/material/Button';
import CardCover from '@mui/joy/CardCover/CardCover';
import { z } from 'zod';
import CheckIcon from '@mui/icons-material/Check';
import { shallowEqual, useSelector } from 'react-redux';
import { Divider, TextField, Chip, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { EStatusRedux } from '@/utils/enum';
import { nameIcons, urlIcons, urlImagesRooms, urlImagesRoomsLove } from '@/utils/images';
import ModalImages from '../modal/ModalImages';
import ModalAmenities from '../modal/ModalAmenities';
import { IDataHotelDetail } from '@/pages/HotelDetailPage';
import { RootState, useAppDispatch } from '@/app/store';
import { fDate } from '@/utils/formatTime';
import { fetchCreateCart, fetchCreateOrder } from '@/reducer/cart/cart.slice';
import { fetchCreateBooking } from '@/reducer/payment/payment.slice';
import { IConTextRouter } from '@/utils/interface';

const isUrl = z.string().url();

interface IAmenitiesImage {
  name: string;
  url: string | boolean;
}

function convert(index: number, quantity: number, dateHotel: IDataHotelDetail) {
  return {
    hotelId: {
      _id: dateHotel.data._id,
      isDelete: false,
      star: dateHotel.data.star,
      package: dateHotel.data.package,
      starRating: dateHotel.data.starRating,
      hotelName: dateHotel.data.hotelName,
      city: dateHotel.data.city,
      country: dateHotel.data.country,
    },
    startDate: fDate(dateHotel.startDate, 'YYYY-MM-DD', 'DD-MM-YYYY'), // convert 'YYYY-MM-DD'
    endDate: fDate(dateHotel.endDate, 'YYYY-MM-DD', 'DD-MM-YYYY'),
    rooms: [
      {
        roomTypeId: {
          _id: dateHotel.data.roomTypeIds[index]._id,
          price: dateHotel.data.roomTypeIds[index].price,
          nameOfRoom: dateHotel.data.roomTypeIds[index].nameOfRoom,
          numberOfRoom: dateHotel.data.roomTypeIds[index].numberOfRoom,
        },
        quantity,
      },
    ],
  };
}
export default function Rooms({ dateHotel }: { dateHotel: IDataHotelDetail }) {
  const { setIsOpenModalSignIn } = useOutletContext<IConTextRouter>();
  const [isOpenModalImages, setIsOpenModalImages] = React.useState<boolean>(false);
  const [isOpenModalAmenities, setIsOpenModalAmenities] = React.useState<boolean>(false);
  const [imagesByRoom, setImagesByRoom] = React.useState<string[]>([]);
  const [amenitiesByRoom, setAmenitiesByRoom] = React.useState<IAmenitiesImage[]>([]);
  const rooms = dateHotel.data.roomTypeIds;

  const { cart, status } = useSelector((state: RootState) => state.cart);

  const { targetBooking, isCreateBookingSuccess, errorMessageCreateBooking } =
    useSelector((state: RootState) => state.payment, shallowEqual);

  const is2FA = useSelector((state: RootState) => state.auth.is2FA, shallowEqual);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const convertImagesRoom = React.useMemo<string[][]>(() => {
    const images = rooms.map((e, i) => {
      if (isUrl.safeParse(e.images[0]).success) {
        if (e.images.length >= 3) {
          return e.images;
        }
        return [...e.images, ...urlImagesRoomsLove];
      }
      return i === 0 || i === 1 ? [...urlImagesRoomsLove] : [...urlImagesRooms];
    });
    return images;
  }, [rooms]);

  const roomsAmenities = React.useMemo<
    { name: string; url: string | boolean }[][]
  >(() => {
    const result = rooms?.map((e) => {
      const convertIconInRateDescription: { name: string; url: string | boolean }[] = [];

      e.rateDescription?.split(',').forEach((value) => {
        const indexIcon = nameIcons.findIndex((i) => value.includes(i));

        if (indexIcon > -1) {
          convertIconInRateDescription.push({ name: value, url: urlIcons[indexIcon] });
        }
      });
      const convertIcon =
        e.roomAmenities?.map((amenities) => {
          const indexIcon = nameIcons.findIndex((i) => i === amenities);
          return indexIcon > -1
            ? { name: amenities, url: urlIcons[indexIcon] }
            : { name: amenities, url: false };
        }) || [];

      return [...convertIcon, ...convertIconInRateDescription];
    });

    return result;
  }, [rooms]);

  function handelOpenImages(i: number) {
    setIsOpenModalImages(true);
    setImagesByRoom([...convertImagesRoom[i]]);
  }

  function handelOpenAmenities(i: number) {
    setIsOpenModalAmenities(true);
    setAmenitiesByRoom([...roomsAmenities[i]]);
  }
  const handelAddCart = (index: number) => {
    if (!is2FA) return setIsOpenModalSignIn(true);
    const input = document.getElementById(`input${index}`) as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    const newOrder = convert(index, quantity, dateHotel);

    if (!cart) return dispatch(fetchCreateCart(newOrder));

    return dispatch(fetchCreateOrder(newOrder));
  };

  const indexRoomCreateBookingRef = React.useRef<number>(-1);

  const handelBooking = (index: number) => {
    if (!is2FA) return setIsOpenModalSignIn(true);
    const input = document.getElementById(`input${index}`) as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    const newBooking = convert(index, quantity, dateHotel);
    indexRoomCreateBookingRef.current = index;
    return dispatch(
      fetchCreateBooking({
        newBooking: {
          ...newBooking,
          total: dateHotel.data.roomTypeIds[index].price * quantity,
          duration: 0,
        },
      })
    );
  };

  React.useEffect(() => {
    if (targetBooking && isCreateBookingSuccess) {
      indexRoomCreateBookingRef.current = -1;
      navigate(`/account?bookingId=${targetBooking._id}`);
    }
  }, [targetBooking, isCreateBookingSuccess]);

  return (
    <Stack spacing={3}>
      {rooms.map((room, i) => (
        <Card
          key={`${room.nameOfRoom}_${i}`}
          sx={{
            flexGrow: 1,
            width: '100%%',
            border: 'solid 0.5px',
            p: 2,
            position: 'relative',
          }}
        >
          <Stack flexDirection='row' columnGap={2} alignItems='center'>
            <Stack maxWidth={500} minWidth={400} alignItems='center'>
              <ImageList
                variant='quilted'
                cols={2}
                rowHeight={80}
                sx={{ m: 0, width: '100%' }}
              >
                {convertImagesRoom[i].slice(0, 3).map((item, index) => (
                  <ImageListItem
                    sx={{
                      cursor: 'pointer',
                    }}
                    key={index}
                    cols={index === 0 ? 2 : 1}
                    rows={index === 0 ? 2 : 1}
                    onClick={() => handelOpenImages(i)}
                  >
                    <img src={item} alt={room.nameOfRoom} loading='lazy' />
                    <CardCover
                      sx={{
                        transition: 'all .30s ease-in-out',
                        '&:hover': { backgroundColor: 'common.backgroundChannel' },
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
              <Button
                onClick={() => handelOpenImages(i)}
                sx={{
                  mt: 0.5,
                  width: 200,
                  bgcolor: 'secondary.light',
                  '&:hover': {
                    color: 'primary.dark',
                  },
                }}
              >
                See all images
              </Button>
            </Stack>
            <Divider orientation='vertical' flexItem />
            <Stack minWidth={160} spacing={1}>
              <Typography variant='h5' color='primary.main' textAlign='center'>
                Amenities
              </Typography>
              {roomsAmenities[i].slice(0, 6).map((e) => (
                <Box key={e.name}>
                  {e.url ? (
                    <img
                      src={e.url as string}
                      alt={e.name}
                      width='25px'
                      height='25px'
                      loading='lazy'
                    />
                  ) : (
                    <CheckIcon
                      sx={{
                        bgcolor: 'white',
                        color: 'secondary.main',
                        width: '25px',
                        height: '25px',
                      }}
                    />
                  )}
                  &nbsp;
                  <Typography component='span' variant='body2' fontSize={13}>
                    {e.name}
                  </Typography>
                </Box>
              ))}
              {roomsAmenities[i].length > 6 && (
                <Typography
                  color='primary'
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => handelOpenAmenities(i)}
                >
                  See More
                </Typography>
              )}
            </Stack>
            <Divider orientation='vertical' flexItem />
            <CardContent
              sx={{
                flexGrow: 1,
                p: 0,
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '50%',
                width: '100%',
              }}
            >
              <Typography
                gutterBottom
                variant='h4'
                textTransform='uppercase'
                color='primary.main'
                textAlign='center'
              >
                {room.nameOfRoom}
              </Typography>
              <Grid container spacing={1} alignItems='center'>
                {room.rateDescription?.split(',').map((e) => (
                  <Grid item xs={6} key={e}>
                    <Chip label={e} sx={{ width: '100%', mx: 'auto' }} />
                  </Grid>
                ))}
              </Grid>
              {room.mealType && (
                <Typography
                  textAlign='center'
                  variant='body1'
                  color='primary.dark'
                  mt={1}
                >
                  Extra: {room.mealType}
                </Typography>
              )}
            </CardContent>
            <Divider orientation='vertical' flexItem />
            <CardActions>
              <Stack alignItems='center' spacing={2} width={220}>
                <Typography variant='h4'>
                  {Math.round((room.price + Number.EPSILON) * 100) / 100} $ / room
                </Typography>
                <TextField
                  defaultValue={
                    parseInt(dateHotel.rooms, 10) <= room.numberOfRoom
                      ? parseInt(dateHotel.rooms, 10)
                      : room.numberOfRoom
                  }
                  key={
                    parseInt(dateHotel.rooms, 10) <= room.numberOfRoom
                      ? parseInt(dateHotel.rooms, 10)
                      : room.numberOfRoom
                  }
                  id={`input${i}`}
                  type='number'
                  sx={{
                    maxWidth: 200,
                    width: 70,
                    '.MuiFormHelperText-root': {
                      textAlign: 'start',
                      width: 200,
                      ml: -8,
                      mt: 1,
                    },
                  }}
                  inputProps={{ min: 1, max: room.numberOfRoom, step: 1 }}
                  label='Order'
                  helperText={
                    parseInt(dateHotel.rooms, 10) > room.numberOfRoom
                      ? 'The amount of room is not enough for your order'
                      : ''
                  }
                  focused
                />
                <Typography color='primary.dark'>
                  Our last {room.numberOfRoom} rooms !
                </Typography>
                <LoadingButton
                  variant='contained'
                  sx={{ width: 150 }}
                  onClick={() => handelBooking(i)}
                >
                  Reserve
                </LoadingButton>

                <LoadingButton
                  variant='outlined'
                  sx={{ width: 150 }}
                  onClick={() => handelAddCart(i)}
                  loading={status === EStatusRedux.pending}
                >
                  Add to cart
                </LoadingButton>

                {errorMessageCreateBooking && indexRoomCreateBookingRef.current === i && (
                  <Button
                    variant='outlined'
                    onClick={() => navigate('/account?tab=Account')}
                    sx={{ maxWidth: 200, fontSize: 12 }}
                  >
                    It`s very cheap, recharge now 😜
                  </Button>
                )}
              </Stack>
            </CardActions>
          </Stack>
        </Card>
      ))}
      <ModalImages
        isOpenModal={isOpenModalImages}
        setIsOpenModal={setIsOpenModalImages}
        images={imagesByRoom}
      />
      <ModalAmenities
        isOpenModal={isOpenModalAmenities}
        setIsOpenModal={setIsOpenModalAmenities}
        amenities={amenitiesByRoom}
      />
    </Stack>
  );
}
