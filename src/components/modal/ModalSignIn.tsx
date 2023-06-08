/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Stack,
  Box,
  InputAdornment,
  IconButton,
  Alert,
  Typography,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useSelector } from 'react-redux';
import Slide from '@mui/material/Slide';
import { RootState, useAppDispatch } from '@/app/store';
import { FCheckBox, FTextField, FormProvider } from '../formProvider';
import LoadingScreen from '../LoadingScreen';
import BasicModal from './BasicModal';
import { EStatusRedux } from '@/utils/enum';
import { fetch2FA, fetchLogin } from '@/reducer/auth/auth.slice';

interface ILoginInput {
  email: string;
  password: string;
  remember: boolean;
}

const loginInput = z.object({
  email: z.string().email(),
  password: z.string().max(50),
  remember: z.boolean(),
});

const defaultValuesLogin: ILoginInput = {
  email: 'tuanhuynh3457@gmail.com',
  password: 'Tuan310797',
  remember: false,
};

export default function ModalSignIn({
  isOpenModal,
  setIsOpenModal,
  setIsOpenModalSignUp,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenModalSignUp: React.Dispatch<React.SetStateAction<boolean>>; // TODO typo
}) {
  const [isShowPw, setIsShowPw] = React.useState<boolean>(false);
  const [isShowFormCode, setIsShowFormCode] = React.useState<boolean>(false);
  const { errorMessage, isSignIn, status } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useAppDispatch();

  const methods = useForm<ILoginInput>({
    defaultValues: defaultValuesLogin,
    resolver: zodResolver(loginInput),
  });
  const {
    formState: { isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<ILoginInput> = async (data) => {
    // console.log(data);
    // setIsShowFormCode(true);
    const { email, password } = data;
    dispatch(fetchLogin({ email, password }));
  };
  React.useEffect(() => {
    if (isSignIn) {
      setIsShowFormCode(true);
    } else {
      setIsShowFormCode(false);
    }
  }, [isSignIn]);

  return (
    <>
      <BasicModal open={isOpenModal} setOpen={setIsOpenModal}>
        {!isShowFormCode ? (
          <Box>
            <Stack gap={1} mb={2}>
              <Typography
                variant='h4'
                fontFamily='UseUrban'
                color='primary.dark'
                mb={1}
                textAlign='center'
              >
                Stay Mate
              </Typography>
              {errorMessage && <Alert severity='warning'>{errorMessage}</Alert>}
              <Alert severity='warning' sx={{ bgcolor: 'transparent' }}>
                Don’t have an account?
                <Typography
                  sx={{ textDecoration: 'underline' }}
                  variant='caption'
                  component={Button}
                  onClick={() => {
                    setIsOpenModal(false);
                    setIsOpenModalSignUp(true);
                  }}
                >
                  Get started
                </Typography>
              </Alert>
            </Stack>

            <FormProvider onSubmit={onSubmit} {...methods}>
              <Stack gap={2}>
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
                <FCheckBox name='remember' label='Remember' />
              </Stack>
              <LoadingButton
                size='large'
                type='submit'
                variant='contained'
                loading={isSubmitting || status === EStatusRedux.pending}
                sx={{
                  display: 'flex',
                  width: '100%',
                }}
              >
                Sign In
              </LoadingButton>
            </FormProvider>
          </Box>
        ) : (
          <InputTwoFA
            isShowFormCode={isShowFormCode}
            setIsShowFormCode={setIsShowFormCode}
            setIsOpenModalSignIn={setIsOpenModal}
          />
        )}
      </BasicModal>
    </>
  );
}

interface InputCode {
  code1: string | number;
  code2: string | number;
  code3: string | number;
  code4: string | number;
  code5: string | number;
  code6: string | number;
}

const defaultValuesCode: InputCode = {
  code1: '',
  code2: '',
  code3: '',
  code4: '',
  code5: '',
  code6: '',
};

const twoFAInput = z.object({
  code1: z.union([z.string(), z.number()]),
  code2: z.union([z.string(), z.number()]),
  code3: z.union([z.string(), z.number()]),
  code4: z.union([z.string(), z.number()]),
  code5: z.union([z.string(), z.number()]),
  code6: z.union([z.string(), z.number()]),
});

function InputTwoFA({
  isShowFormCode,
  setIsShowFormCode,
  setIsOpenModalSignIn,
}: {
  isShowFormCode: boolean;
  setIsShowFormCode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenModalSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { status, is2FA, errorMessage, remainGuess } = useSelector(
    (state: RootState) => state.auth
  );
  const methods = useForm<InputCode>({
    defaultValues: defaultValuesCode,
    resolver: zodResolver(twoFAInput),
  });
  const dispatch = useAppDispatch();

  const {
    watch,
    formState: { isSubmitting },
    reset,
  } = methods;

  const refPreventFetchApi = React.useRef<boolean>(false);
  // eslint-disable-next-line consistent-return
  watch((codeData, { name }) => {
    // name is field change
    let keyNextField = '';

    if (typeof name === 'string') {
      const id = parseInt(name.slice(4), 10);
      if (id < 6) keyNextField = `code${id + 1}`;
      // check all input field not empty
      const isFullCode = Object.values(codeData).every((e) => {
        if (typeof e === 'string') {
          return e.length > 0;
        }
        return e >= 0;
      });
      if (id === 6 && isFullCode && !refPreventFetchApi.current) {
        refPreventFetchApi.current = true;
        return onSubmit(codeData as InputCode);
      }
      // if value in this next input field empty the cursor will move to next
      const isNextInput =
        keyNextField.length &&
        !codeData[keyNextField as keyof InputCode] &&
        (codeData[name] || codeData[name] === 0);

      if (isNextInput) {
        return (document.getElementById(keyNextField) as HTMLInputElement).focus();
      }
    }
  });

  const onSubmit: SubmitHandler<InputCode> = async (data) => {
    const code = Object.values(data).join('');
    if (refPreventFetchApi.current) {
      dispatch(fetch2FA(code));
    }

    (document.getElementById('code1') as HTMLInputElement).focus();
  };

  React.useEffect(() => {
    if (remainGuess < 1) {
      setTimeout(() => {
        setIsOpenModalSignIn(true);
        setIsShowFormCode(false);
      }, 1500);
    }
    if (is2FA) {
      setIsShowFormCode(false);
      setIsOpenModalSignIn(false);
    }
    if (!is2FA && errorMessage) {
      setTimeout(() => {
        refPreventFetchApi.current = false;
      }, 1000);
      reset({ ...defaultValuesCode });
    }
  }, [is2FA, errorMessage]);

  return (
    <Box>
      <Slide direction='left' in={isShowFormCode}>
        <Stack justifyContent='center' alignContent='center' spacing={2}>
          <Typography variant='h4' textAlign='center'>
            Authentication Method
          </Typography>
          {errorMessage && <Alert severity='warning'>{errorMessage}</Alert>}
          <Typography variant='body2'>
            An authentication code has been sent to your Email. Enter the code to continue
            and be redirected. You only have 5 time
          </Typography>
          <FormProvider {...methods} onSubmit={onSubmit}>
            <Stack flexDirection='row' gap={1}>
              {Object.keys(defaultValuesCode).map((keyCode) => (
                <FTextField
                  key={keyCode}
                  min={0}
                  max={9}
                  color='secondary'
                  focused
                  sx={{
                    'input::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                  }}
                  typeInput='number'
                  name={keyCode}
                  id={keyCode}
                />
              ))}
            </Stack>
          </FormProvider>
          {(status === EStatusRedux.pending || isSubmitting) && (
            <LoadingScreen sx={{ position: 'relative' }} />
          )}
        </Stack>
      </Slide>
    </Box>
  );
}
