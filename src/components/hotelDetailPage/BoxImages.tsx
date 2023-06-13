import * as React from 'react';
import Box from '@mui/material/Box';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import Button from '@mui/material/Button';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CardCover from '@mui/joy/CardCover/CardCover';
import useMediaQuery from '@mui/material/useMediaQuery';

interface IValue {
  totalImages: number;
  totalCols: number;
  colsFirstImg: number;
  rowHeight: number;
}

let valueResponsive: IValue = {
  totalImages: 7,
  totalCols: 5,
  colsFirstImg: 2,
  rowHeight: 200,
};

function BoxImages({
  imagesHotel,
  setIsModalImagesOpen,
  hotelName,
}: {
  imagesHotel: string[];
  setIsModalImagesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hotelName: string;
}) {
  const matches = useMediaQuery('(max-width:900px)');

  if (matches) {
    valueResponsive = {
      totalImages: 5,
      totalCols: 4,
      colsFirstImg: 4,
      rowHeight: 100,
    };
  } else {
    valueResponsive = {
      totalImages: 7,
      totalCols: 5,
      colsFirstImg: 2,
      rowHeight: 200,
    };
  }

  React.useEffect(() => {}, [matches]);

  return (
    <>
      <Box position='relative'>
        <ImageList
          variant='quilted'
          cols={valueResponsive.totalCols}
          rowHeight={valueResponsive.rowHeight}
        >
          {imagesHotel.slice(0, valueResponsive.totalImages).map((item, i) => (
            <ImageListItem
              sx={{
                cursor: 'pointer',
              }}
              key={i}
              cols={i === 0 ? valueResponsive.colsFirstImg : 1}
              rows={i === 0 ? 2 : 1}
              onClick={() => setIsModalImagesOpen(true)}
            >
              <img src={item} alt={hotelName} loading='lazy' />
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
          sx={{
            position: 'absolute',
            borderRadius: 10,
            bottom: 22,
            left: 4,
            bgcolor: 'background.defaultChannel',
            '&:hover': {
              bgcolor: 'common.onBackground',
              color: 'primary.dark',
            },
          }}
          onClick={() => setIsModalImagesOpen(true)}
          startIcon={<CameraAltIcon />}
        >
          See all Hotel
        </Button>
      </Box>
    </>
  );
}

export default BoxImages;
