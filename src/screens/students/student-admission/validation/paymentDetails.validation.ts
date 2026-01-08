import * as yup from 'yup';

export const paymentDetailsValidation = yup.object().shape({
  totalPayment: yup.number().typeError('Total payment is required').required('Total payment is required'),
  partPayment: yup.string().required('Part payment selection is required'),
  coupon: yup.mixed().nullable(), // Allow both string and object types
  paymentAfterDiscount: yup.mixed().nullable(),
  discountAmount: yup.mixed().nullable(),
  firstInstallment: yup.string().required('First installment status is required'),
  numberOfInstallments: yup.string().required('Number of installments is required'),
  amount: yup.number().typeError('Amount is required').required('Amount is required'),
  paymentDate: yup.date().nullable(),
  description: yup.string().nullable(),
}); 