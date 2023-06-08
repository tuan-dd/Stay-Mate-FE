import * as React from 'react';
import { Alert, IconButton, InputAdornment, Stack, Typography, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Slide from '@mui/material/Slide';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { RootState, useAppDispatch } from '@/app/store';
import { FTextField, FormProvider } from '../formProvider';
import BasicModal from './BasicModal';
import { EStatusRedux } from '@/utils/enum';
import { fetchCreateUser } from '@/reducer/user/user.slice';

interface SignUpInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const defaultValue: SignUpInput = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const signUpInput = z
  .object({
    name: z.string().min(5),
    email: z.string().email(),
    password: z
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
        'Password contain at least one numeric digit, one uppercase and one lowercase letter,min 6 max 20'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // path of error
  });

export default function ModalSignUp({
  isOpenModal,
  setIsOpenModal,
  setIsOpenModalSignIn,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenModalSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isShowPw, setIsShowPw] = React.useState<boolean>(false);
  const { errorMessage, status, currentUser } = useSelector(
    (state: RootState) => state.user
  );
  const { isSignIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const methods = useForm<SignUpInput>({
    defaultValues: defaultValue,
    resolver: zodResolver(signUpInput),
  });

  const {
    formState: { isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<SignUpInput> = async (data) => {
    const { name, email, password } = data;
    dispatch(fetchCreateUser({ name, email, password }));
  };

  React.useEffect(() => {
    if (currentUser && !isSignIn) {
      setIsOpenModalSignIn(true);
      setIsOpenModal(false);
    }
  }, [currentUser, isSignIn]);

  return (
    <>
      <BasicModal open={isOpenModal} setOpen={setIsOpenModal}>
        <Slide direction='right' in={isOpenModal}>
          <Box>
            <Stack gap={1} mb={1}>
              <Typography
                variant='h4'
                fontFamily='UseUrban'
                color={(theme) => theme.palette.primary.dark}
                mb={1}
                textAlign='center'
              >
                Stay Mate
              </Typography>
              {errorMessage && <Alert severity='warning'>{errorMessage}</Alert>}
            </Stack>
            <FormProvider onSubmit={onSubmit} {...methods}>
              <Stack gap={2}>
                <FTextField name='name' label='Name' />
                <FTextField name='email' label='Email' />
                <FTextField
                  name='password'
                  label='Password'
                  type={isShowPw ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={() => setIsShowPw((e) => !e)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge='end'
                        >
                          {isShowPw ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FTextField
                  name='confirmPassword'
                  label='Confirm password'
                  type={isShowPw ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={() => setIsShowPw((e) => !e)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge='end'
                        >
                          {isShowPw ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <LoadingButton
                size='large'
                type='submit'
                variant='contained'
                loading={isSubmitting || status === EStatusRedux.pending}
                sx={{
                  mt: 1,
                  display: 'flex',
                  width: '100%',
                }}
              >
                Sign Up
              </LoadingButton>
            </FormProvider>
          </Box>
        </Slide>
      </BasicModal>
    </>
  );
}
