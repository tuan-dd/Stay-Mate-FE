import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import FSlider from '../formProvider/FSlider';
import { FMultiCheckbox, FRadioGroup } from '../formProvider';
import { ERoomAmenities } from '@/utils/enum';

const CustomDivider = styled(Divider)({
  borderBottomWidth: 3,
  marginBottom: 3,
});

const styleBox = {
  height: 'auto',
  overflowX: 'hidden',
  ml: 'auto',
  mr: 'auto',
  mt: 1.5,

  maxHeight: 300,
  '::-webkit-scrollbar': { width: 12, bgcolor: 'transparent' },
  '::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
    bgcolor: 'primary.dark',
  },
  '::-webkit-scrollbar-track': {
    borderRadius: '10px',
    WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
    bgcolor: '#F5F5F5',
  },
};
const optionLabelStarRating = new Array(5)
  .fill('null')
  .map((_e, i) => <Rating name='read-only' value={i + 1} readOnly />);

const optionBedType = ['king', 'queen', 'double', 'single'];
const imageBed = [
  'https://res.cloudinary.com/diz2mh63x/image/upload/v1685859653/icons/image_part_162_ltdjze.png',
  'https://res.cloudinary.com/diz2mh63x/image/upload/v1685859653/icons/image_part_164_vkuxpl.png',
  'https://res.cloudinary.com/diz2mh63x/image/upload/v1685859665/icons/image_part_125_vtpoo0.png',
  'https://res.cloudinary.com/diz2mh63x/image/upload/v1685859665/icons/image_part_124_dwrdg5.png',
];
const styleText = {
  textAlign: 'center',
  fontSize: 22,
  mt: 1,
  color: 'primary.dark',
  textTransform: 'capitalize',
};
const optionLabelBed = optionBedType.map((e, i) => (
  <Stack flexDirection='row' alignItems='center'>
    <Stack
      width='40px'
      height='40px'
      bgcolor='white'
      alignItems='center'
      justifyContent='center'
    >
      <img src={imageBed[i]} alt={e} width='30px' height='30px' />
    </Stack>
    <Typography component='span' variant='body1' ml={2} textTransform='capitalize'>
      {e} bed
    </Typography>
  </Stack>
));

function FromSearchFilter({ handelReset }: { handelReset: () => void }) {
  return (
    <>
      <Stack spacing={2}>
        <Typography sx={styleText}>Your budget</Typography>
        <CustomDivider />
        <FSlider name='budget' min={0} max={2000} label='Your budget ' />
        <Typography sx={styleText}>Room amenities</Typography>
        <CustomDivider />
        <Box sx={styleBox}>
          <FMultiCheckbox options={Object.values(ERoomAmenities)} name='roomAmenities' />
        </Box>
        <Typography sx={styleText}>Star</Typography>
        <CustomDivider />
        <FRadioGroup
          name='star'
          options={[1, 2, 3, 4, 5]}
          getOptionLabel={optionLabelStarRating}
        />
        <Typography sx={styleText}>Bed Types</Typography>
        <CustomDivider />
        <FRadioGroup
          name='bedType'
          options={optionBedType}
          getOptionLabel={optionLabelBed}
        />
        <Typography sx={styleText}>Room Offers</Typography>
        <CustomDivider />
        <FRadioGroup
          name='mealType'
          options={['breakfast', 'dinner', 'parking', 'lunch']}
          getOptionLabel={['Breakfast', 'Dinner', 'Parking', 'Lunch']}
        />
        <CustomDivider />
        <Button onClick={() => handelReset()} variant='contained'>
          Clear all
        </Button>
      </Stack>
    </>
  );
}

export default FromSearchFilter;
