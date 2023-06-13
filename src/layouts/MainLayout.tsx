import { Outlet } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import ModalVoucherNewUser from '@components/modal/ModalVoucherNewUser';
import ModalSignIn from '@components/modal/ModalSignIn';
import ModalSignUp from '@components/modal/ModalSignUp';
import AlertMsg from '@components/AlertMsg';
import MainFooter from './MainFooter';
import NavigationListener from '@/components/NavigationListener';
import MainHeader from './MainHeader';

function MainLayout() {
  const [isOpenModalVoucher, setIsOpenModalVoucher] = useState<boolean>(false);
  const [isOpenModalSignIn, setIsOpenModalSignIn] = useState<boolean>(false);
  const [isOpenModalSignUp, setIsOpenModalSignUp] = useState<boolean>(false);

  // useEffect(() => {
  //   setIsOpenModalVoucher(true);
  // }, []);

  return (
    <Stack position='relative'>
      <NavigationListener />
      <MainHeader setIsOpenModalSignIn={setIsOpenModalSignIn} />
      <Outlet context={{ setIsOpenModalSignIn }} />
      <ModalVoucherNewUser
        isOpenModal={isOpenModalVoucher}
        setIsOpenModal={setIsOpenModalVoucher}
        setIsOpenSignIn={setIsOpenModalSignIn}
      />
      <ModalSignIn
        isOpenModal={isOpenModalSignIn}
        setIsOpenModal={setIsOpenModalSignIn}
        setIsOpenModalSignUp={setIsOpenModalSignUp}
      />
      <ModalSignUp
        isOpenModal={isOpenModalSignUp}
        setIsOpenModal={setIsOpenModalSignUp}
        setIsOpenModalSignIn={setIsOpenModalSignIn}
      />
      <AlertMsg />
      <MainFooter />
    </Stack>
  );
}

export default MainLayout;
