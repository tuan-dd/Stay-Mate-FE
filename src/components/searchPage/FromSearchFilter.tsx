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
import { customScrollbar } from '@/utils/utils';

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
  ...customScrollbar,
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
const ResponsiveTypography = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: 22,
  mt: 1,
  color: theme.vars.palette.primary.dark,
  textTransform: 'capitalize',
  [theme.breakpoints.down('lg')]: {
    fontSize: 18,
  },
}));

const ResponsiveStack = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 30,
    columnGap: 40,
    overflowY: 'hidden',
    position: 'relative',
    width: '100%',
    alignContent: 'flex-start',
    padding: 6,
    paddingLeft: 30,
    ...customScrollbar,
  },
}));

export const ResponsiveDiv = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('lg')]: {
    flexGrow: 1,

    height: 400,
    position: 'relative',
  },
}));

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
      <ResponsiveStack spacing={2} alignItems='flex-start'>
        <ResponsiveDiv>
          <ResponsiveTypography sx={{ mt: 3 }}>Your budget</ResponsiveTypography>
          <CustomDivider />
          <FSlider name='budget' min={0} max={2000} label='Your budget ' />
        </ResponsiveDiv>
        <ResponsiveDiv>
          <ResponsiveTypography>Room amenities</ResponsiveTypography>
          <CustomDivider />
          <Box sx={styleBox}>
            <FMultiCheckbox
              options={Object.values(ERoomAmenities)}
              name='roomAmenities'
            />
          </Box>
        </ResponsiveDiv>
        <ResponsiveDiv>
          <ResponsiveTypography>Star</ResponsiveTypography>
          <CustomDivider />
          <FRadioGroup
            name='star'
            options={[1, 2, 3, 4, 5]}
            getOptionLabel={optionLabelStarRating}
          />
        </ResponsiveDiv>
        <ResponsiveDiv>
          <ResponsiveTypography>Bed Types</ResponsiveTypography>
          <CustomDivider sx={{ mb: 1.5 }} />
          <FRadioGroup
            name='bedType'
            options={optionBedType}
            getOptionLabel={optionLabelBed}
          />
        </ResponsiveDiv>
        <ResponsiveDiv>
          <ResponsiveTypography>Room Offers</ResponsiveTypography>
          <CustomDivider />
          <FRadioGroup
            name='mealType'
            options={['breakfast', 'dinner', 'parking', 'lunch']}
            getOptionLabel={['Breakfast', 'Dinner', 'Parking', 'Lunch']}
          />
          <CustomDivider />
        </ResponsiveDiv>
        <Button
          onClick={() => handelReset()}
          variant='contained'
          sx={{ width: '100%', display: { md: 'none', lg: 'flex', xs: 'none' } }}
        >
          Clear all
        </Button>
        <Button
          onClick={() => handelReset()}
          variant='contained'
          sx={{
            height: 40,
            display: { md: 'flex', lg: 'none' },
            position: 'absolute',
            bottom: 10,
            left: '45%',
            width: 250,
          }}
        >
          Clear all
        </Button>
      </ResponsiveStack>
    </>
  );
}

export default FromSearchFilter;
