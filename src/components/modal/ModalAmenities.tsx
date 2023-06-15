import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CheckIcon from '@mui/icons-material/Check';
import useMediaQuery from '@mui/material/useMediaQuery';
import BasicModal from './BasicModal';

function ModalAmenities({
  isOpenModal,
  setIsOpenModal,
  amenities,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  amenities: {
    name: string;
    url: string | boolean;
  }[];
}) {
  const matches600px = useMediaQuery('(max-width:600px)');
  const matches1200px = useMediaQuery('(max-width:1200px)');

  const sizeBoxIcon = matches600px ? 25 : 45;
  return (
    <BasicModal
      open={isOpenModal}
      setOpen={setIsOpenModal}
      disableGutters
      sx={{
        height: 'auto',
        width: matches1200px ? '90%' : '1100px',
        p: 2.5,
        left: matches1200px ? '50%' : '60%',
        borderRadius: 10,
        border: 'solid 0.5px',
      }}
    >
      <Grid container spacing={4}>
        {amenities.map((e) => (
          <Grid key={e.name} item xs={3} borderRadius={10}>
            <Stack alignItems='center'>
              {e.url ? (
                <Stack
                  bgcolor='white'
                  width={sizeBoxIcon}
                  height={sizeBoxIcon}
                  justifyContent='center'
                  alignItems='center'
                  p={1}
                >
                  <img
                    src={e.url as string}
                    alt={e.name}
                    width={matches600px ? '15px' : '35px'}
                    loading='lazy'
                  />
                </Stack>
              ) : (
                <CheckIcon
                  sx={{
                    bgcolor: 'white',
                    color: 'secondary.main',
                    width: sizeBoxIcon,
                    height: sizeBoxIcon,
                  }}
                />
              )}

              <Typography
                sx={{
                  fontSize: matches600px ? 8 : 12,
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  '&:hover': {
                    overflow: 'visible',
                    zIndex: 500,
                  },
                }}
              >
                {e.name}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </BasicModal>
  );
}

export default ModalAmenities;
