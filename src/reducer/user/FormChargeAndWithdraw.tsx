import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import { shallowEqual, useSelector } from 'react-redux';
import InputAdornment from '@mui/material/InputAdornment';
import { RootState, useAppDispatch } from '@app/store';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Card from '@mui/material/Card';
import { EStatusRedux } from '@/utils/enum';
import { fetchCharge, fetchWithdraw } from '../payment/payment.slice';

function FormChargeAndWithdraw() {
  const matches900px = useMediaQuery('(max-width:900px)');
  const matches600px = useMediaQuery('(max-width:600px)');
  const [isShowPwWithdraw, setIsShowPwWithdraw] = React.useState<boolean>(false);
  const [alertChargeOrWithdraw, setAlertChargeOrWithdraw] = React.useState<string>('');
  const [labelInput, setLabelInput] = React.useState<string>('Charge');
  const dispatch = useAppDispatch();

  const handelChange = (value: string) => {
    setLabelInput(value);
  };
  const balance = useSelector(
    (state: RootState) => state.user.currentUser?.account.balance,
    shallowEqual
  );

  const { errorMessageChargeOrWithdraw, statusPayment } = useSelector(
    (state: RootState) => ({
      errorMessageChargeOrWithdraw: state.payment.errorMessageChargeOrWithdraw,
      statusPayment: state.payment.status,
    }),
    shallowEqual
  );

  const hintMoney = React.useMemo<number[]>(() => {
    if (labelInput === 'Withdraw') {
      if (balance) {
        if (balance < 999) {
          return [Math.round(balance)];
        }
        return [100, 500, Math.round(balance)];
      }
      return [];
    }
    return [100, 500, 1000, 5000];
  }, [labelInput, balance]);

  const refInputChargeOrWithdraw = React.useRef<HTMLInputElement>(null);
  const refInputPasswordWithdraw = React.useRef<HTMLInputElement>(null);

  const onSubmitChargeOrWithdraw = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (refInputChargeOrWithdraw.current?.value) {
      if (labelInput === 'Withdraw' && refInputPasswordWithdraw.current?.value) {
        setAlertChargeOrWithdraw('');
        dispatch(
          fetchWithdraw({
            password: refInputPasswordWithdraw.current.value,
            withdraw: parseInt(refInputChargeOrWithdraw.current?.value, 10),
          })
        );
      } else if (labelInput === 'Charge') {
        setAlertChargeOrWithdraw('');
        dispatch(fetchCharge(parseInt(refInputChargeOrWithdraw.current?.value, 10)));
      } else {
        setAlertChargeOrWithdraw('Password and input balance not empty not empty ');
      }
    } else {
      setAlertChargeOrWithdraw('Password and input balance not empty not empty ');
    }
  };

  React.useEffect(() => {
    if (errorMessageChargeOrWithdraw)
      setAlertChargeOrWithdraw(errorMessageChargeOrWithdraw);
  }, [errorMessageChargeOrWithdraw]);

  const handelClickHint = (value: string) => {
    if (labelInput === 'Withdraw') {
      (document.querySelector('#Withdraw') as HTMLInputElement).value = value.toString();
    } else {
      (document.querySelector('#Charge') as HTMLInputElement).value = value.toString();
    }
  };

  return (
    <Card sx={{ width: matches900px ? '85%' : '100%', mx: 'auto', mt: 1, p: 2 }}>
      <Stack flexDirection='row' columnGap={3}>
        <Box flexGrow={1}>
          {hintMoney.map((value) => (
            <Button onClick={() => handelClickHint(value.toString())} key={value}>
              <Chip
                size={matches600px ? 'small' : 'medium'}
                color={labelInput === 'Charge' ? 'secondary' : 'error'}
                label={`${value}$`}
              />
            </Button>
          ))}
        </Box>
        {balance && (
          <Typography fontSize={matches600px ? 12 : 14}>
            Your balance {Math.round((balance + Number.EPSILON) * 100) / 100} $
          </Typography>
        )}
      </Stack>
      <form onSubmit={onSubmitChargeOrWithdraw}>
        <Stack
          mt={2}
          flexDirection={matches900px ? 'column' : 'row'}
          columnGap={2}
          spacing={1}
          alignItems='center'
        >
          <TextField
            inputRef={refInputChargeOrWithdraw}
            id={labelInput}
            label={`${labelInput} balance`}
            inputProps={{
              min: 1,
              max: labelInput === 'Withdraw' ? balance : null,
              step: 1,
            }}
            type='number'
            fullWidth
            focused
          />
          {labelInput === 'Withdraw' && (
            <TextField
              inputRef={refInputPasswordWithdraw}
              autoComplete='true'
              type={isShowPwWithdraw ? 'text' : 'password'}
              defaultValue='Tuan310797'
              name='passwordCharge'
              label='password'
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setIsShowPwWithdraw((e) => !e)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge='end'
                    >
                      {isShowPwWithdraw ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              focused
            />
          )}
          <RadioGroup
            value={labelInput}
            onChange={(_event, value) => handelChange(value)}
          >
            <Stack flexDirection={matches900px ? 'row' : 'column'}>
              <FormControlLabel control={<Radio />} label='Charge' value='Charge' />
              <FormControlLabel control={<Radio />} label='Withdraw' value='Withdraw' />
            </Stack>
          </RadioGroup>
          <LoadingButton
            type='submit'
            variant='contained'
            loading={statusPayment === EStatusRedux.pending}
            sx={{ fontSize: 15, width: matches900px ? 300 : 400, height: 50 }}
          >
            Confirm
          </LoadingButton>
        </Stack>
      </form>
      {alertChargeOrWithdraw && (
        <Stack alignItems='center'>
          <Alert sx={{ bgcolor: 'transparent' }} severity='error'>
            {alertChargeOrWithdraw}
          </Alert>
        </Stack>
      )}
    </Card>
  );
}

export default FormChargeAndWithdraw;
