import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CheckIcon from '@mui/icons-material/Check';

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
  return (
    <BasicModal
      open={isOpenModal}
      setOpen={setIsOpenModal}
      disableGutters
      sx={{
        height: 'auto',
        width: '1100px',
        p: 2.5,
        left: '60%',
        borderRadius: 10,
        border: 'solid 0.5px',
      }}
    >
      <Grid container spacing={4}>
        {amenities.map((e) => (
          <Grid key={e.name} item xs={2} borderRadius={10}>
            <Stack alignItems='center'>
              {e.url ? (
                <Stack
                  bgcolor='white'
                  width={45}
                  height={45}
                  justifyContent='center'
                  alignItems='center'
                  p={1}
                >
                  <img src={e.url as string} alt={e.name} width='30px' />
                </Stack>
              ) : (
                <CheckIcon
                  sx={{
                    bgcolor: 'white',
                    color: 'secondary.main',
                    width: 45,
                    height: 45,
                  }}
                />
              )}

              <Typography
                sx={{
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
