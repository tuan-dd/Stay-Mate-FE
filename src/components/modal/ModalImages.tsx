import React from 'react';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import BasicModal from './BasicModal';
import { IconClose } from './ModalVoucherNewUser';

const styleButton = {
  position: 'absolute',
  zIndex: 15,
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  color: 'primary.dark',
  top: '45%',
  opacity: 0.9,
  ':hover': {
    opacity: 1,
  },
};

function ModalImages({
  isOpenModal,
  setIsOpenModal,
  images,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  images: string[];
}) {
  const [index, setIndex] = React.useState<number>(0);
  const matches600px = useMediaQuery('(max-width:600px)');

  React.useEffect(() => {
    setIndex(0);
  }, [images]);

  return (
    <BasicModal
      open={isOpenModal}
      setOpen={setIsOpenModal}
      disableGutters
      sx={{
        height: matches600px ? 400 : 600,
        width: matches600px ? 380 : 700,
        p: 0,
        border: 'none',
      }}
    >
      <IconClose setClose={setIsOpenModal} fontSize={matches600px ? 'small' : 'medium'} />
      <IconButton
        sx={{ ...styleButton, left: 1 }}
        onClick={() => setIndex((e) => (e === 0 ? images.length - 1 : e - 1))}
      >
        <ArrowBackIosIcon sx={{ fontSize: 30 }} />
      </IconButton>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderColor: 'transparent',
        }}
      >
        <CardCover>
          <img src={images[index]} srcSet={images[index]} loading='lazy' alt='hotel' />
        </CardCover>
      </Card>
      <IconButton
        sx={{ ...styleButton, right: -3 }}
        onClick={() => setIndex((e) => (e === images.length - 1 ? 0 : e + 1))}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 30 }} />
      </IconButton>
    </BasicModal>
  );
}

export default ModalImages;
