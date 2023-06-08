import { Stack, Typography, Button } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';

import { FAutocomplete, FTextField, FormProvider } from '@/components/formProvider';

interface IContact {
  userAsk: string;
  userName: string;
  emailUser: string;
  subject: string;
  detail: string;
}
const userAsk = ['Can`t sign in', 'Can`t sign up', 'Can`t booking'];

const defaultValues: IContact = {
  userAsk: '',
  userName: '',
  emailUser: '',
  subject: '',
  detail: '',
};
function Contact() {
  const methods = useForm<IContact>({
    defaultValues,
  });
  const onSubmit: SubmitHandler<IContact> = async () => {};
  return (
    <Stack mt={12} alignItems='center' justifyContent='center' spacing={2}>
      <Typography variant='h2'>Contact Us</Typography>
      <FormProvider onSubmit={onSubmit} {...methods}>
        <Stack width={700} spacing={2} alignItems='center'>
          <FAutocomplete
            name='userAsk'
            label='What can we help'
            placeholder='Choose or write you want'
            options={[...userAsk]}
          />
          <FTextField name='userName' label='Your Name' focused />
          <FTextField
            name='emailUser'
            label='Email'
            placeholder='Email address register with your account'
            focused
          />
          <FTextField name='subject' label='Subject' focused />
          <FTextField
            name='detail'
            placeholder='Describe your problem'
            multiline
            rows={4}
            focused
          />
          <Button
            type='submit'
            size='large'
            variant='contained'
            sx={{ bgcolor: 'primary.dark' }}
          >
            Submit
          </Button>
        </Stack>
      </FormProvider>
    </Stack>
  );
}

export default Contact;
