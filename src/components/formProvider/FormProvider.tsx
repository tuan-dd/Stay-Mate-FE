/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormProvider as RHFormProvider, FormProviderProps } from 'react-hook-form';

interface Props extends FormProviderProps<any, any> {
  onSubmit?: (data: any) => void;
}

export default function FormProvider({ onSubmit, children, ...methods }: Props) {
  if (typeof onSubmit !== 'undefined') {
    return (
      <RHFormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}> {children}</form>
      </RHFormProvider>
    );
  }
  return (
    <RHFormProvider {...methods}>
      <form> {children}</form>
    </RHFormProvider>
  );
}
