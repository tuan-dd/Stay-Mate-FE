/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import * as React from 'react';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/app/store';
import BasicModal from './BasicModal';

const style = {
  borderColor: 'transparent',
  bgcolor: 'transparent',
};

const StyleIconClose = styled(IconButton)(({ theme }) => ({
  position: 'absolute' as const,
  top: 5,
  right: 2,
  zIndex: 10000,
  backgroundColor: theme.palette.secondary.light,
}));

export function IconClose({
  sx,
  setClose,
  ...other
}: { setClose: React.Dispatch<React.SetStateAction<boolean>> } & IconButtonProps) {
  return (
    <StyleIconClose {...other} sx={{ ...sx }} onClick={() => setClose(false)}>
      <CloseIcon fontSize='large' />
    </StyleIconClose>
  );
}

export default function ModalVoucherNewUser({
  isOpenModal,
  setIsOpenModal,
  setIsOpenSignIn,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { is2FA: isRightCode } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handelClose = () => {
    if (isRightCode) {
      navigate('/account');
    } else {
      setIsOpenSignIn(true);
    }
    setIsOpenModal(false);
  };

  return (
    <>
      <BasicModal
        open={isOpenModal}
        setOpen={setIsOpenModal}
        sx={{
          ...style,
        }}
      >
        <IconClose setClose={setIsOpenModal} />
        <img
          onClick={handelClose}
          height='100%'
          src='https://res.cloudinary.com/diz2mh63x/image/upload/v1686300156/Voucher_Cute_Animal_a6zhvp.png'
          alt='voucher'
          width='100%'
        />
      </BasicModal>
    </>
  );
}
