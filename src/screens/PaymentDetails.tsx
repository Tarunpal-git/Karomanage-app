import Grid from '@mui/material/Grid';
import React, { useEffect, useState, useMemo, forwardRef } from 'react';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, MenuItem, Select, TextField, InputAdornment, Box, Chip, Tooltip, Autocomplete } from '@mui/material';
import ListItemText from '@mui/material/ListItemText'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Icon from 'src/@core/components/icon'
import Coupon from 'src/pages/coupons/couponPopup'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import EventNoteIcon from '@mui/icons-material/EventNote'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import InstallmentAmountPopup from 'src/views/studentView/InstallmentAmountPopup'
import { stringReduce } from 'src/@core/hooks/stringReducer';

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 370

    }
  }
}

interface installments {
  description: string;
  date: DateType;
  amount: number | null;
  status: String
}
interface Payment {
  coupon: string
  partPayment: string
  divideInstallment: any
  firstPaymentInstallment: string
  numberOfInstallments: string
  totalPaymentAmount: Number
  discountedPayment: Number
  discountAmount: Number
  installments: installments[];
}
const PaymentDetails = ({ setActiveStep,
  setOpen, user, setNewCoupon, activeStep,
  couponListData, setSnackbarColor, permission, setOpenBackPopup }: any) => {
  const CustomInput = forwardRef(({ ...props }: any, ref) => {
    return <TextField inputRef={ref} {...props} sx={{ width: '100%' }} />
  })
  const [openCouponDialog, setOpenCouponDialog] = useState<boolean>(false)
  const [coupon, setCoupon] = useState<any>(null)
  const [installmentStatus, setInstallmentStatus] = useState<any>()
  const [installmentArray, setInstallmentArray] = useState<any>([])
  const [installmentAmountPopup, setInstallmentAmountPopup] = useState<boolean>(false)
  const [amountAndType, setAmountAndType] = useState<any>({
    type: "",
    amount: "",
    total: ""
  })

  const [filteredCouponList, setFilteredCouponList] = useState(couponListData);

  // Update filteredCouponList if couponListData prop changes
  useEffect(() => {
    setFilteredCouponList(couponListData);
  }, [couponListData]);
  const onSubmit = () => {

    const getPaymentValues = paymentValues(); // Typed as Payment
    const installments = getPaymentValues.installments;
    // const installments: any = watch('installments');

    if (installments && Array.isArray(installments)) {
      const updatedInstallments = installments.map((installment, index) => {
        if (watch("firstPaymentInstallment") === "pay") {
          return {
            ...installment,
            status: index === 0 ? "paid" : "due", // First installment "paid", others "due"
          };
        } else {
          return {
            ...installment,
            status: "due", // All installments "due" in the else condition
          };
        }
      });

      // Update the form state
      setValue("installments", updatedInstallments);
    }
    let totalAmount: number = 0
    // let installments:any=paymentValues().installments;
    for (let singleInstallment of installments) {
      const installmentAmount = singleInstallment?.amount ?? 0;
      totalAmount = totalAmount + installmentAmount;

    }
    // paymentValues().installments.reduce((accumulator: number, currentValue: any) => {
    //   totalAmount = totalAmount + currentValue?.amount
    //   // return (paymentValues().installments?.length * currentValue?.amount);
    // }, 0);

    let compareValue: any = coupon ? watchValues?.discountedPayment : watchValues?.totalPaymentAmount;

    if (totalAmount === compareValue) {
      setAmountAndType({
        type: "",
        amount: "",
        total: ""
      })


      setInstallmentAmountPopup(false)

      sessionStorage.setItem('studentPaymentDetails', JSON.stringify({
        ...paymentValues(),
        coupon: coupon,
      }));
      setActiveStep(activeStep + 1);
    } else if (totalAmount > compareValue!) {
      let exceededAmount = totalAmount - compareValue!;
      setAmountAndType({ type: "Exceeds", total: compareValue, amount: exceededAmount })
      setInstallmentAmountPopup(true)
    } else if (totalAmount < compareValue!) {

      let shortfallAmount = compareValue! - totalAmount;
      setAmountAndType({ type: "Short", total: compareValue, amount: shortfallAmount })
      setInstallmentAmountPopup(true)
    }
  };


  const defaultPaymentValues = {
    totalPaymentAmount: 0,
    discountedPayment: NaN,
    discountAmount: NaN,
    partPayment: 'false',
    numberOfInstallments: '1',
    firstPaymentInstallment: '',
    divideInstallment: '',
    coupon: '',
    installments: []
  };

  const paymentSchema = yup.object().shape({
    totalPaymentAmount: yup.number().required(),
    discountedPayment: yup
      .mixed()
      .test('is-valid', 'Discounted payment must be non-negative or NaN', (value) => {
        return isNaN(value) || (typeof value === 'number' && value >= 0);
      })
      .required('This field is required'),
    discountAmount: yup
      .mixed()
      .test('is-valid', 'Discounted Amount must be non-negative or NaN', (value) => {
        return isNaN(value) || (typeof value === 'number' && value >= 0);
      })
      .required('This field is required'),
    partPayment: yup.string().required(),
    firstPaymentInstallment: yup.string().required(),
    numberOfInstallments: yup.string().when('partPayment', {
      is: 'true',
      then: yup.string().required(),
      otherwise: yup.string(),
    }),
    coupon: yup.object().nullable().default(undefined),
    installments: yup
      .array()
      .of(
        yup.object().shape({
          description: yup
            .string()
            .max(25, 'Your input is too long. max(25 characters)')
            .matches(/^[a-zA-Z][a-zA-Z\s]*$/, 'Insert only normal characters')
            .transform((value, originalValue) => (originalValue === '' ? undefined : value)),
          date: yup
            .string()
            .required('This field is required')
            .transform((value, originalValue) => (originalValue === '' ? undefined : value))
            .nullable(),
          amount: yup
            .number()
            .required('This field is required')
            .typeError('This field is required')
            .min(0, 'Amount must be a non-negative number')
          // .test('is-integer', 'Amount must be a integer', (value: any) => Number.isInteger(value) && value >= 0)
          ,
        })
      )
  });


  const {
    reset: paymentReset,
    control: paymentControl,
    getValues: paymentValues,
    handleSubmit: handlePaymentSubmit,
    setValue,
    watch,
    formState: { errors: paymentErrors },
    clearErrors
  } = useForm<Payment>({
    defaultValues: defaultPaymentValues,
    resolver: yupResolver(paymentSchema)
  });

  const watchValues = watch()

  const { fields, append, remove, replace, update } = useFieldArray({
    control: paymentControl,
    name: 'installments',
  });

  // Update installments when numberOfInstallments or discountedPayment changes

  // useEffect(() => {
  //   const numberOfInstallments: any = watchValues.numberOfInstallments;
  //   const totalAmount: any = watchValues.couponName && coupon ? watchValues?.discountedPayment : watchValues.totalPaymentAmount;
  //   const installmentAmount: any = Math.round(totalAmount / (numberOfInstallments))

  //   if (numberOfInstallments) {
  //     const count = parseInt(numberOfInstallments, 10);
  //     // Check if the current number of installments is different from the new count
  //     const newInstallments: any = Array.from({ length: count }, () => ({
  //       description: '',
  //       date: null,
  //       amount: installmentAmount,
  //     }));
  //     replace(newInstallments);
  //   } else {
  //     replace([]);
  //   }
  // }, [watchValues.numberOfInstallments,
  // watchValues.discountedPayment,
  // watchValues.totalPaymentAmount,
  //   replace, watchValues.divideInstallment]);


  // useEffect(() => {
  //   const partPayment: boolean = watchValues.partPayment === 'true';
  //   const numberOfInstallments: any = watchValues.numberOfInstallments;
  //   const totalAmount: any = watchValues.coupon && coupon ? watchValues?.discountedPayment : watchValues.totalPaymentAmount;
  //   const divideInstallment: string = watchValues.divideInstallment;
  //   const installmentAmount: any = (totalAmount / (numberOfInstallments));

  //   if (partPayment) {
  //     if (numberOfInstallments && divideInstallment === 'equal') {
  //       const count = parseInt(numberOfInstallments, 10);

  //       const newInstallments: any = Array.from({ length: count }, (_, index) => {
  //         if (index === count - 1) {
  //           return {
  //             description: '',
  //             date: null,
  //             amount: totalAmount - installmentAmount * (count - 1),
  //           };
  //         }
  //         return {
  //           description: '',
  //           date: null,
  //           amount: installmentAmount,
  //         };
  //       });
  //       replace(newInstallments);
  //     }
  //     else if (numberOfInstallments && divideInstallment === 'custom') {
  //       const count = parseInt(numberOfInstallments, 10);
  //       const newInstallments: any = Array.from({ length: count }, () => ({
  //         description: '',
  //         date: null,
  //         amount: installmentAmount,
  //       }));

  //       replace(newInstallments);
  //       return;
  //     } else {
  //       replace([]);
  //     }
  //   } else {

  //     replace([
  //       {
  //         description: '',
  //         date: null,
  //         amount: totalAmount,
  //         status: ''
  //       },
  //     ]);
  //   }
  // }, [
  //   watchValues.partPayment,
  //   watchValues.numberOfInstallments,
  //   watchValues.discountedPayment,
  //   watchValues.totalPaymentAmount,
  //   watchValues.divideInstallment,
  //   replace,
  // ]);

  useEffect(() => {
    const partPayment: boolean = watchValues.partPayment === 'true';
    const numberOfInstallments: number = parseInt(watchValues.numberOfInstallments, 10) || 1;
    const totalAmount: number = watchValues.coupon && coupon
      ? Number(watchValues.discountedPayment) || 0
      : Number(watchValues.totalPaymentAmount) || 0;

    const divideInstallment: string = watchValues.divideInstallment;

    // Installment Amount Calculation
    let installmentAmount: number = Math.floor(totalAmount / numberOfInstallments);
    let remainingAmount: number = totalAmount - (installmentAmount * numberOfInstallments);

    if (partPayment) {
      if (numberOfInstallments && divideInstallment === 'equal') {
        const newInstallments: any = Array.from({ length: numberOfInstallments }, (_, index) => ({
          description: '',
          date: null,
          amount: installmentAmount + (index === 0 ? remainingAmount : 0), // Extra amount first installment me add
        }));

        replace(newInstallments);
      }
      else if (numberOfInstallments && divideInstallment === 'custom') {
        const newInstallments: any = Array.from({ length: numberOfInstallments }, () => ({
          description: '',
          date: null,
          amount: installmentAmount,
        }));

        replace(newInstallments);
      } else {
        replace([]);
      }
    } else {
      replace([
        {
          description: '',
          date: null,
          amount: totalAmount,
          status: ''
        },
      ]);
    }
  }, [
    watchValues.partPayment,
    watchValues.numberOfInstallments,
    watchValues.discountedPayment,
    watchValues.totalPaymentAmount,
    watchValues.divideInstallment,
    replace,
  ]);

  const [couponTotalAmount, setCouponTotalAmount] = useState<any>()
  const [couponTotalDiscount, setCouponTotalDiscount] = useState<any>()
  useEffect(() => {
    setCouponTotalAmount(watchValues.totalPaymentAmount)
    setCouponTotalDiscount(watchValues.discountedPayment)
  }, [watchValues.coupon])



  // Adjust other installments when the first installment changes
  // watchValues?.firstPaymentInstallment === "pay"
  // useEffect(() => {
  //   const installments: any = watch('installments');
  //   if (installments && installments.length > 1) {
  //     const firstInstallmentAmount = (parseFloat(installments[0].amount));
  //     const totalAmount: any = watchValues.coupon && coupon ? watchValues.discountedPayment : watchValues.totalPaymentAmount;
  //     const remainingAmount: any = totalAmount - firstInstallmentAmount;
  //     const remainingInstallments = installments.length - 1;

  //     // Calculate the base amount per installment
  //     const baseAmountPerInstallment = (remainingAmount / remainingInstallments);
  //     const remainder = remainingAmount % remainingInstallments;

  //     for (let i = 1; i < installments.length; i++) {
  //       // Distribute the remainder to the first few installments to ensure total amount matches exactly
  //       const amount = baseAmountPerInstallment + (i <= remainder ? 1 : 0);

  //       update(i, {
  //         ...installments[i],
  //         amount: amount // Ensure this is an integer
  //       });
  //     }
  //   }
  // }, [watch('installments')[0]?.amount, watchValues.discountedPayment, watchValues.totalPaymentAmount, update]);


  useEffect(() => {
    const installments: any = watch('installments');
    if (installments && installments.length > 1) {
      const totalAmount: any = watchValues.coupon && coupon
        ? (typeof watchValues.discountedPayment === 'string'
          ? parseFloat(watchValues.discountedPayment)
          : watchValues.discountedPayment)
        : (typeof watchValues.totalPaymentAmount === 'string'
          ? parseFloat(watchValues.totalPaymentAmount)
          : watchValues.totalPaymentAmount);
      const firstInstallmentAmount = parseFloat(installments[0].amount);


      let remainingAmount = totalAmount - firstInstallmentAmount;
      let remainingInstallments = installments.length - 1;

      // Calculate equal base amount per installment in decimal
      let baseAmountPerInstallment = remainingAmount / remainingInstallments;


      // Calculate remainder to distribute extra amount correctly
      const remainder = remainingAmount % remainingInstallments;
      // Round all installments except last, and adjust the last one
      let adjustedInstallments = [];
      let sum = firstInstallmentAmount;

      for (let i = 1; i < installments.length; i++) {
        let amount = parseFloat(baseAmountPerInstallment.toFixed(2)); // Ensure two decimal places
        sum += amount;

        // If last installment, adjust to ensure exact totalAmount
        if (i === installments.length - 1) {
          amount += (totalAmount - sum); // Adjust last installment
        }

        adjustedInstallments.push({
          ...installments[i],
          amount: amount
        });
      }

      // Update installments
      adjustedInstallments.forEach((installment, i) => {
        update(i + 1, installment); // i+1 because first installment is already set
      });
    }
  }, [watch('installments')[0]?.amount, watchValues.discountedPayment, watchValues.totalPaymentAmount, update]);

  useEffect(() => {
    if (sessionStorage.getItem('studentCourseAndBatch') !== null) {
      const studentCourseAndBatch: any = sessionStorage.getItem('studentCourseAndBatch');
      const studentValuesSession = JSON.parse(studentCourseAndBatch);
      setValue("totalPaymentAmount", studentValuesSession?.courseFee);
      if (studentValuesSession?.installments) {
        setInstallmentArray(Array.from({ length: studentValuesSession?.installments }, (_, index) => index + 1))
      }
    }
  }, [sessionStorage, setValue]);

  const discountedPayment = useMemo(() => {
    if (watchValues?.coupon && coupon) {
      let totalAmount: any = watchValues?.totalPaymentAmount
      totalAmount = parseInt(totalAmount)
      const couponValue = parseInt(coupon.couponValue);
      if (coupon.couponType === 'Percentage') {
        return (totalAmount - (totalAmount * couponValue) / 100);
      } else {
        return (totalAmount - couponValue);
      }
    }
    return NaN;
  }, [watchValues, coupon]);

  useEffect(() => {
    if (discountedPayment <= 0) {
      setValue('numberOfInstallments', '1')
      setValue('partPayment', 'false')
      setValue('firstPaymentInstallment', 'pay')
      setValue("divideInstallment", '');
    }
    setValue('discountedPayment', discountedPayment);
  }, [discountedPayment, setValue]);

  const labelText: any = "Are you paying first installment right now? *"

  return (
    <>
      <form onSubmit={handlePaymentSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Payment Details
            </Typography>
            <Typography variant='caption' component='p'>
              Enter Payment Information
            </Typography>
          </Grid>

          <Grid item xs={3} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='totalPaymentAmount'
                control={paymentControl}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Total payment amount '
                    disabled
                    error={Boolean(paymentErrors.totalPaymentAmount)}
                    placeholder='Total payment amount '
                    aria-describedby='stepper-linear-totalPaymentAmount'
                    autoComplete='off'
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      min: 0
                    }}
                  />
                )}
              />
              {paymentErrors.totalPaymentAmount && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-courseName'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={3} sm={4}>
            <FormControl fullWidth>
              <InputLabel
                id='validation-basic-select'
                error={Boolean(paymentErrors.partPayment)}
                htmlFor='validation-basic-select'
              >
                Part payment *
              </InputLabel>
              <Controller
                name='partPayment'
                control={paymentControl}
                render={({ field: { value, onChange } }) => (
                  <Select
                    value={value}
                    label='Part payment *'
                    onChange={onChange}
                    error={Boolean(paymentErrors.partPayment)}
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                  >
                    <MenuItem
                      disabled={(watchValues?.discountedPayment as number) <= 0}
                      value='true' onClick={() => {
                        setValue("numberOfInstallments", '2');
                        setValue("divideInstallment", 'equal');
                      }}>Yes
                    </MenuItem>

                    <MenuItem value='false' onClick={() => {
                      setValue("divideInstallment", '');
                      setValue("numberOfInstallments", '1');
                    }}>No</MenuItem>
                  </Select>
                )}
              />
              {paymentErrors.partPayment && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-partPayment'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {watchValues?.partPayment == 'true' && (<Grid item xs={3} sm={4}>
            <FormControl fullWidth>
              <InputLabel
                id='validation-basic-select'
                error={Boolean(paymentErrors.divideInstallment)}
                htmlFor='validation-basic-select'
              >
                Divide Installments *
              </InputLabel>
              <Controller
                name='divideInstallment'
                control={paymentControl}
                render={({ field: { value, onChange } }) => (
                  <Select
                    value={value}
                    label='Divide installments *'
                    onChange={onChange}
                    disabled={((watchValues?.discountedPayment as number) <= 0 || watchValues?.partPayment == "false")}
                    error={Boolean(paymentErrors.divideInstallment)}
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                  >
                    <MenuItem
                      value='equal'
                    >Equal
                    </MenuItem>

                    <MenuItem value='custom'
                    >Custom</MenuItem>
                  </Select>
                )}
              />
              {paymentErrors.partPayment && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-partPayment'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
          </Grid>)}

          <Grid item xs={12} sm={10} mt={4} mb={-2}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', }} className='capitalize'>
              Apply coupon 🎁
            </Typography>
          </Grid >

          {/* <Grid item xs={6} sm={5.4}>
            <FormControl fullWidth>
              <InputLabel
                id='validation-basic-select'
                error={Boolean(paymentErrors.couponName)}
                htmlFor='validation-basic-select'
              >
                Coupon
              </InputLabel>
              <Controller
                name='couponName'
                control={paymentControl}
                render={({ field: { value, onChange } }) => (
                  <Select
                    value={value}
                    label='Coupon'
                    onChange={onChange}
                    MenuProps={MenuProps}
                    error={Boolean(paymentErrors.couponName)}
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                    endAdornment={
                      value ? (
                        <InputAdornment position="end">
                          <Icon
                            className='iconContainer'
                            aria-label="clear coupon selection"
                            onClick={() => { onChange(''), setCoupon(null) }}
                            style={{
                              cursor: 'pointer',
                              fontSize: '20px',
                              margin: '15px',
                              transition: 'background-color 0.3s'
                            }}
                            icon='bx:x'
                          />
                        </InputAdornment>
                      ) : null
                    }
                  >
                    {couponListData && couponListData?.length > 0 ? (
                      couponListData?.map((name: any) => (

                        <MenuItem key={name?.couponId} value={name?.couponName} onClick={() => {
                          setValue('couponName', name?.couponName);
                          setCoupon(name);
                        }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                            <Tooltip
                              title={`${name?.couponName?.charAt(0)?.toUpperCase() + name?.couponName?.slice(1)} `}
                              placement={"top"}>
                              <span>
                                {stringReduce(`${name?.couponName?.charAt(0)?.toUpperCase() + name?.couponName?.slice(1)}`, 30)}
                              </span>
                            </Tooltip>
                            {name?.couponType === 'Percentage' ? (
                              <Chip label={`${name?.couponValue} %`} size="small" />
                            ) : (
                              <Chip label={`${name?.couponValue} Flat`} size="small" />
                            )}
                          </Box>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <ListItemText primary='No data found' />
                      </MenuItem>
                    )}
                  </Select>
                )}
              />
              {paymentErrors.couponName && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-couponName'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
          </Grid> */}

          <Grid item xs={6} sm={5.4}>
            <FormControl fullWidth>
              <Controller
                name="coupon"
                control={paymentControl}
                render={({ field: { value, onChange } }) => {
                  const typedValue: any = value;
                  return (
                    <Autocomplete
                      options={couponListData || []}
                      getOptionLabel={(option) => option?.couponName || ''}
                      value={couponListData?.find(
                        (item: any) => item?.couponName === typedValue?.couponName
                      ) || null}
                      onChange={(_, selectedOption) => {
                        if (selectedOption) {
                          setValue('coupon', selectedOption);
                          setCoupon(selectedOption);
                        } else {
                          setValue('coupon', '');
                          setCoupon(null);
                        }
                        clearErrors('discountedPayment');
                        fields.forEach((_, index) => clearErrors(`installments.${index}.amount`));
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option?.couponName === value?.couponName
                      }
                      blurOnSelect={false}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Coupon"
                          variant="outlined"
                          error={Boolean(paymentErrors.coupon)}

                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {typedValue && (
                                  <Chip
                                    label={
                                      coupon?.couponType === 'Percentage'
                                        ? `${coupon.couponValue}%`
                                        : `${coupon.couponValue} Flat`
                                    }
                                    size="small"
                                    sx={{ marginRight: 1 }} // Add spacing between the chip and the clear icon
                                  />
                                )}

                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props: any, option: any) => (
                        <Box
                          {...props}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          width="100%"
                        >
                          <Tooltip
                            title={`${option.couponName?.charAt(0)?.toUpperCase()}${option.couponName?.slice(1)}`}
                            placement="bottom"
                          >
                            <span>{option.couponName}</span>
                          </Tooltip>
                          <Chip
                            label={
                              option.couponType === 'Percentage'
                                ? `${option.couponValue}%`
                                : `${option.couponValue} Flat`
                            }
                            size="small"
                          />
                        </Box>
                      )}
                    />

                  );
                }}
              />
              {paymentErrors.coupon && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {paymentErrors.coupon.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>


          <Grid item xs={1} sm={0} mt={0.6}>
            {permission?.some((obj: any) => obj?.title === 'Coupons' && obj?.action?.includes('create')) && (
              <AddCircleIcon
                style={{ marginTop: '12px', cursor: 'pointer' }}
                onClick={() => {
                  setOpenCouponDialog(true)
                }}
                color='primary'
              />
            )}
          </Grid>

          <Grid item xs={12} sm={5.9} ml={-8.3}>
            <FormControl fullWidth>
              <Controller
                name='discountedPayment'
                control={paymentControl}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Payment after discount'
                    disabled
                    error={Boolean(paymentErrors.discountedPayment)}
                    placeholder='Payment after discount'
                    aria-describedby='stepper-linear-discountedPayment'
                    autoComplete='off'
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      min: 0
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        ...(paymentErrors.discountedPayment && {
                          borderColor: 'red',
                          '&.Mui-disabled': {
                            '& fieldset': {
                              borderColor: 'red',
                            },
                          },
                        }),
                      },
                    }}
                  />
                )}
              />
              {paymentErrors.discountedPayment && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-discountedPayment'>
                  {paymentErrors.discountedPayment.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", gap: "20px" }}>

            <Grid item xs={3} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name="discountAmount"
                  control={paymentControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={couponTotalAmount - discountedPayment}
                      label="Discount amount"
                      disabled
                      error={Boolean(paymentErrors.discountAmount)}
                      placeholder="Discount amount"
                      aria-describedby="stepper-linear-discountAmount"
                      autoComplete="off"
                      InputLabelProps={{
                        shrink: true, // Force the label to shrink
                      }}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        min: 0,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          ...(paymentErrors.discountAmount && {
                            borderColor: 'red',
                            "&.Mui-disabled": {
                              "& fieldset": {
                                borderColor: 'red',
                              },
                            },
                          }),
                        },
                      }}
                    />
                  )}
                />
                {paymentErrors.discountAmount && (
                  <FormHelperText sx={{ color: "error.main" }} id="stepper-linear-discountAmount">
                    {paymentErrors.discountAmount.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={3} sm={4}>
              <FormControl fullWidth>
                <InputLabel
                  id='validation-basic-select'
                  error={Boolean(paymentErrors.firstPaymentInstallment)}
                  htmlFor='validation-basic-select'
                >
                  <Tooltip title={'Are you paying first installment right now ?'}>
                    <span>{stringReduce('Are you paying first installment right now? *', 30)}</span>
                  </Tooltip>
                </InputLabel>
                <Controller
                  name='firstPaymentInstallment'
                  control={paymentControl}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      label={<span>{stringReduce('Are you paying first installment right now? *', 30)} </span>}
                      onChange={onChange}
                      error={Boolean(paymentErrors.firstPaymentInstallment)}
                      labelId='validation-basic-select'
                      aria-describedby='validation-basic-select'
                    >
                      <MenuItem value='pay'>Pay</MenuItem>
                      <MenuItem value='due'
                        disabled={(watchValues?.discountedPayment as number) <= 0}
                      >Due</MenuItem>
                    </Select>
                  )}
                />
                {paymentErrors.firstPaymentInstallment && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-firstPaymentInstallment'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={3} sm={4}>
              <FormControl fullWidth>
                <InputLabel
                  id='validation-basic-select'
                  error={Boolean(paymentErrors.numberOfInstallments)}
                  htmlFor='validation-basic-select'
                >
                  Number of installments *
                </InputLabel>
                <Controller
                  name='numberOfInstallments'
                  control={paymentControl}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      label='Number of installments *'
                      onChange={onChange}
                      disabled={watchValues?.partPayment == "false"}
                      // MenuProps={MenuProps}
                      error={Boolean(paymentErrors.numberOfInstallments)}
                      labelId='validation-basic-select'
                      aria-describedby='validation-basic-select'
                    >
                      {installmentArray && installmentArray?.length > 0 ? (
                        installmentArray?.map((id: any, index: any) => {
                          if (index != 0 && watchValues?.partPayment == "true") {
                            return (<MenuItem key={id} value={id}>
                              {id}
                            </MenuItem>)
                          } else if (watchValues?.partPayment == "false") {
                            return (<MenuItem key={id} value={id} >
                              {id}
                            </MenuItem>)
                          }

                        })
                      ) : (
                        <MenuItem disabled>
                          <ListItemText primary='No data found' />
                        </MenuItem>
                      )}
                    </Select>
                  )}
                />
                {paymentErrors.numberOfInstallments && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-numberOfInstallments'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

          </Grid>

          {fields.map((field, index) => (
            <React.Fragment key={field.id}>

              <Grid item xs={3} sm={4}>
                <FormControl fullWidth>
                  <DatePickerWrapper>
                    <Controller
                      name={`installments.${index}.date` as `installments.${number}.date`}
                      control={paymentControl}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          dateFormat='dd/MM/yyyy'
                          selected={value}
                          showYearDropdown
                          showMonthDropdown
                          yearDropdownItemNumber={50}
                          onChange={e => onChange(e)}
                          autoComplete="off"
                          placeholderText='DD/MM/YYYY'
                          // maxDate={watchValues?.firstPaymentInstallment === "pay" && index === 0 ? new Date() : undefined}
                          // minDate={new Date()}
                          customInput={
                            <CustomInput
                              value={value}
                              onChange={(e: any) => onChange(e)}
                              label='Date *'
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <EventNoteIcon />
                                  </InputAdornment>
                                ),
                                readOnly: true,
                              }}
                              error={Boolean(paymentErrors.installments?.[index]?.date)}
                              aria-describedby='validation-basic-date'
                            />
                          }
                        />
                      )}
                    />
                  </DatePickerWrapper>
                  {paymentErrors.installments?.[index]?.date && (
                    <FormHelperText sx={{ color: 'error.main' }} id={`validation-basic-date-${index}`}>
                      {paymentErrors.installments?.[index]?.date && paymentErrors.installments?.[index]?.date?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={3} sm={4}>
                <FormControl fullWidth>
                  <Controller
                    name={`installments.${index}.amount` as `installments.${number}.amount`}
                    control={paymentControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Amount *'
                        type='number'
                        disabled={fields.length === 1 || watchValues?.divideInstallment === "equal"}
                        placeholder='Amount *'
                        error={Boolean(paymentErrors.installments?.[index]?.amount)}
                        aria-describedby={`validation-basic-amount-${index}`}
                        autoComplete='new-amount'
                        inputProps={{
                          maxLength: 512,
                          inputMode: 'numeric',
                          onKeyDown: (e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault();
                            }
                          },
                          onWheel: (e: any) => e.target.blur(), // Blurs the input field to prevent value change
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value)); // Ensure empty values don't convert to NaN
                        }}
                      />
                    )}
                  />
                  {paymentErrors.installments?.[index]?.amount && (
                    <FormHelperText sx={{ color: 'error.main' }} id={`validation-basic-amount-${index}`}>
                      {paymentErrors.installments?.[index]?.amount?.message}
                    </FormHelperText>
                  )}
                </FormControl>

              </Grid>

              <Grid item xs={3} sm={4}>
                <FormControl fullWidth>
                  <Controller
                    name={`installments.${index}.description` as `installments.${number}.description`}
                    control={paymentControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Description'
                        placeholder='Description'
                        error={Boolean(paymentErrors.installments?.[index]?.description)}
                        aria-describedby={`validation-basic-description-${index}`}
                        autoComplete='new-description'
                        inputProps={{ maxLength: 512 }}
                      />
                    )}
                  />
                  {paymentErrors.installments?.[index]?.description && (
                    <FormHelperText sx={{ color: 'error.main' }} id={`validation-basic-description-${index}`}>
                      {paymentErrors.installments?.[index]?.description && paymentErrors.installments?.[index]?.description?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </React.Fragment>
          ))}

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button size='large' variant='outlined' color='secondary'
              onClick={() => {
                if (Number.isNaN(watchValues?.discountedPayment)
                  && watchValues?.partPayment == 'false'
                  && watchValues?.numberOfInstallments == '1'
                  && watchValues?.firstPaymentInstallment == ''
                  && watchValues?.divideInstallment == ''
                  && watchValues?.coupon == ''
                ) {
                  setActiveStep((prevActiveStep: any) => prevActiveStep - 1)
                } else {
                  setOpenBackPopup(true)
                }
              }}>
              Back
            </Button>
            <Button
              size='large'
              type='submit'
              variant='contained'
            >
              Next
            </Button>
          </Grid>

        </Grid>

      </form >

      <Coupon
        openCouponDialog={openCouponDialog}
        setOpenCouponDialog={setOpenCouponDialog}
        user={user}
        setSnackbarColor={setSnackbarColor}
        setOpen={setOpen}
        setNewCoupon={setNewCoupon}
      />

      {installmentAmountPopup &&
        <InstallmentAmountPopup
          setInstallmentAmountPopup={setInstallmentAmountPopup}
          installmentAmountPopup={installmentAmountPopup}
          amountAndType={amountAndType}
        />
      }
    </>
  );
};

export default PaymentDetails;
