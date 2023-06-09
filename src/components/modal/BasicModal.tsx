import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Container, { ContainerProps } from '@mui/material/Container';

const style = {
  position: 'absolute' as const,
  borderRadius: 10,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  outline: '0px solid transparent',
};

export default function BasicModal({
  children,
  open,
  setOpen,
  sx,
  ...other
}: {
  children: React.ReactNode | React.ReactNode[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & ContainerProps) {
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 1000,
          },
        }}
      >
        <Fade in={open}>
          <Container sx={{ ...style, ...sx }} {...other}>
            {children}
          </Container>
        </Fade>
      </Modal>
    </>
  );
}
