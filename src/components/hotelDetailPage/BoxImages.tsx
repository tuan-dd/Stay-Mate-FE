import Box from '@mui/material/Box';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import Button from '@mui/material/Button';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CardCover from '@mui/joy/CardCover/CardCover';
import React from 'react';
// import { styled } from '@mui/material/styles';

function BoxImages({
  imagesHotel,
  setIsModalImagesOpen,
  hotelName,
}: {
  imagesHotel: string[];
  setIsModalImagesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hotelName: string;
}) {
  return (
    <>
      <Box position='relative'>
        <ImageList variant='quilted' cols={5} rowHeight={200}>
          {imagesHotel.slice(0, 7).map((item, i) => (
            <ImageListItem
              sx={{
                cursor: 'pointer',
              }}
              key={i}
              cols={i === 0 ? 2 : 1}
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
