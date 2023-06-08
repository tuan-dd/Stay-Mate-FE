import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import Chip from '@mui/joy/Chip';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import StarRateIcon from '@mui/icons-material/StarRate';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { IHotel, IRoom } from '@/utils/interface';
import { fDate } from '@/utils/formatTime';
import { urlImagesTrending } from '@/utils/images';

const style = {
  '&:hover, &:focus-within': {
    opacity: 1,
  },
  opacity: 0,
  transition: '0.1s ease-in',
  background:
    'linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.00345888) 63.94%, rgba(0,0,0,0.014204) 65.89%, rgba(0,0,0,0.0326639) 67.83%, rgba(0,0,0,0.0589645) 69.78%, rgba(0,0,0,0.0927099) 71.72%, rgba(0,0,0,0.132754) 73.67%, rgba(0,0,0,0.177076) 75.61%, rgba(0,0,0,0.222924) 77.56%, rgba(0,0,0,0.267246) 79.5%, rgba(0,0,0,0.30729) 81.44%, rgba(0,0,0,0.341035) 83.39%, rgba(0,0,0,0.367336) 85.33%, rgba(0,0,0,0.385796) 87.28%, rgba(0,0,0,0.396541) 89.22%, rgba(0,0,0,0.4) 91.17%)',
};

export default function CartHotel({
  data,
  index,
}: {
  data: IHotel<IRoom[]>;
  index: number;
}) {
  // const newDAte = fData

  const objectParams = {
    destination: data.hotelName,
    country: data.country,
    city: data.city,
    startDate: fDate(undefined),
    endDate: fDate(new Date().getTime() + 1000 * 60 * 60 * 24),
    rooms: '1',
    adults: '2',
    children: '0',
  };

  const searchParams = `/hotel/${data._id}?${new URLSearchParams(
    objectParams
  ).toString()}`;

  const navigate = useNavigate();
  return (
    <Card
      sx={{
        bgcolor: 'white',
        boxShadow: 'none',
        width: '100%',
        transition: 'all 0.5s ease-out',
        '--Card-padding': '0px',
        '&:hover': {
          transform: 'scale(1.1)',
        },
      }}
    >
      <Box sx={{ position: 'relative', borderBottom: '0px' }}>
        <AspectRatio
          ratio='4.5/4.5'
          objectFit='fill'
          sx={{
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          <figure>
            <img
              src={urlImagesTrending[index]}
              loading='lazy'
              alt='Yosemite by Casey Horner'
            />
          </figure>
        </AspectRatio>
        <CardCover className='gradient-cover' sx={style}>
          <Box onClick={() => navigate(searchParams)}>
            <Box
              sx={{
                display: 'flex',
                flexGrow: 1,
                alignSelf: 'flex-end',
                pb: 1,
              }}
            >
              <Button
                size='sm'
                onClick={() => navigate(searchParams)}
                sx={{
                  margin: 'auto',
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.main' },
                }}
              >
                <Typography
                  sx={{
                    '&:hover': { color: 'primary.dark' },
                    color: 'white',
                  }}
                >
                  Book now
                </Typography>
              </Button>
            </Box>
          </Box>
        </CardCover>
      </Box>
      <Divider />
      <Stack gap={1} p={1} alignItems='center'>
        <Chip sx={{ bgcolor: 'primary.main', maxWidth: 150 }}>
          <Typography
            noWrap
            sx={{
              color: 'success.contrastText',
              fontSize: '14px',
              fontWeight: 'md',
            }}
          >
            {data.hotelName}
          </Typography>
        </Chip>
        <Stack
          sx={{
            p: 0.1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <Chip
            variant='outlined'
            color='success'
            size='sm'
            sx={{
              bgcolor: 'primary.dark',
              border: 1,
              borderColor: 'primary.dark',
              color: 'primary.contrastText',
              borderRadius: 'sm',
              wordWrap: 'break-word',
            }}
          >
            City: {data.city}
          </Chip>
          <Link
            href='#dribbble-shot'
            level='body3'
            underline='none'
            endDecorator={<StarRateIcon />}
            sx={{
              fontWeight: 'md',
              ml: 'auto',
              color: 'primary.dark',
              '&:hover': { color: 'danger.plainColor' },
            }}
          >
            {data.star}
          </Link>
        </Stack>
      </Stack>
    </Card>
  );
}
