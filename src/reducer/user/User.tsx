import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useForm, SubmitHandler } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FTextField, FUploadAvatar, FormProvider } from '@components/formProvider';
import { EStatusRedux } from '@utils/enum';
import { Pros, deleteValueNull } from '@utils/utils';
import { IUpdateUser, fetchUpdateUser } from './user.slice';
import { RootState, useAppDispatch } from '@/app/store';
import FormChargeAndWithdraw from './FormChargeAndWithdraw';

const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

const validDefaultValues = z
  .object({
    avatar: z.any(),
    name: z.string().min(2),
    password: z.string().optional(),
    newPassword: z
      .string()
      .optional()
      .refine((data) => {
        if (typeof data === 'string' && data.length) {
          return regex.test(data);
        }
        return true;
      }, 'Password contain at least one numeric digit, one uppercase and one lowercase letter,min 6 max 20'),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword)
        return data.newPassword === data.confirmPassword && data.password;
      return true;
    },
    {
      message: "New password don't match or password not empty ",
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword) return data.newPassword !== data.password;
      return true;
    },
    {
      message: 'Password not same new password ',
      path: ['password'],
    }
  );

function User() {
  const [isShowPw, setIsShowPw] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const matches900px = useMediaQuery('(max-width:900px)');
  const { currentUser, status } = useSelector(
    (state: RootState) => state.user,
    shallowEqual
  );

  const defaultValues: IUpdateUser = {
    avatar: currentUser?.avatar || '',
    name: currentUser?.name || '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  };
  const methods = useForm<IUpdateUser>({
    defaultValues,
    resolver: zodResolver(validDefaultValues),
  });

  const { setValue, reset } = methods;

  const onSubmit: SubmitHandler<IUpdateUser> = (data) => {
    const filterNull: Pros<IUpdateUser> = deleteValueNull(data);
    dispatch(fetchUpdateUser({ ...filterNull }));
  };

  React.useEffect(() => {
    reset(defaultValues);
  }, [currentUser]);

  const handleDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles) {
        const file = acceptedFiles[0];

        if (file) {
          setValue(
            'avatar',
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          );
        }
      }
    },
    [setValue]
  );

  return (
    <>
      <FormProvider {...methods} onSubmit={onSubmit}>
        <Stack
          mt={2}
          flexDirection={matches900px ? 'column' : 'row'}
          sx={{ width: matches900px ? '85%' : '100%', height: '100%', mx: 'auto' }}
        >
          <Card
            sx={{
              py: 10,
              px: 3,
              textAlign: 'center',

              borderTopRightRadius: matches900px ? 12 : 0,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: matches900px ? 0 : 12,
            }}
          >
            <FUploadAvatar
              name='avatar'
              accept={{
                'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
              }}
              maxSize={4145728}
              onDrop={handleDrop}
            />
            <Typography
              variant='caption'
              sx={{
                mt: 2,
                display: 'block',
              }}
            >
              Allowed *.jpeg, *.jpg, *.png, *.gif max size of 4 MB
            </Typography>
          </Card>
          <Card
            sx={{
              textAlign: 'center',
              p: 4,
              flexGrow: 1,
              borderTopLeftRadius: 0,
              borderTopRightRadius: matches900px ? 0 : 12,
              borderBottomLeftRadius: matches900px ? 12 : 0,
            }}
          >
            <Stack spacing={3}>
              <FTextField name='name' label='Name' focused />
              <FTextField
                type={isShowPw ? 'text' : 'password'}
                name='password'
                label='Password'
                focused
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
                type={isShowPw ? 'text' : 'password'}
                name='newPassword'
                label='New Password'
                focused
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
                type={isShowPw ? 'text' : 'password'}
                name='confirmPassword'
                label='Confirm Password'
                focused
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
            <Stack alignItems='center' sx={{ mt: 3 }}>
              <LoadingButton
                type='submit'
                variant='contained'
                sx={{ width: '100%' }}
                loading={status === EStatusRedux.pending}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Stack>
      </FormProvider>
      <FormChargeAndWithdraw />
    </>
  );
}

export default User;
