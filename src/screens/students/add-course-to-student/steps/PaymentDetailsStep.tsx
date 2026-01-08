import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import responsive from '../../../../utils/responsive';
import Button from '../../../../@ui/button/Button';
import ScalableText from '../../../../@ui/scalable-text/ScalableText';
import { useForm } from 'react-hook-form';
import { useAddCourseToStudent } from '../AddCourseToStudentContext';
import Input from '../../../../@ui/input/Input';
import ControlledSelect from '../../../../@ui/controlled-select/ControlledSelect';
import DateInput from '../../../../@ui/date-input/DateInput';
import ThemeScrollView from '../../../../@ui/theme-scroll-view/ThemeScrollView';
import { COLORS } from '../../../../colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TScreenNavigator } from '../../../../types/navigator/screen-navigator';
import { useListCouponsQuery } from '../../../../apis/hooks/coupons/query/useListCoupons.query';
import { store } from '../../../../app/store';

const PART_PAYMENT_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

// Dynamic installment options will be generated based on course maxPaymentInstallment
const generateInstallmentOptions = (maxInstallments: number) => {
  const options = [];
  // Start from 2 (minimum for part payment) up to maxInstallments
  for (let i = 2; i <= maxInstallments; i++) {
    options.push({ label: i.toString(), value: i.toString() });
  }
  return options;
};

const DIVIDE_INSTALLMENT_OPTIONS = [
  { label: 'Equal', value: 'equal' },
  { label: 'Custom', value: 'custom' },
];

const FIRST_INSTALLMENT_OPTIONS = [
  { label: 'Pay', value: 'pay' },
  { label: 'Due', value: 'due' },
];

// Default coupon options - will be replaced by API data
const DEFAULT_COUPON_OPTIONS: CouponOption[] = [];

interface CouponOption {
  label: string;
  value: string;
  couponData?: any;
}

interface PaymentDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PaymentDetailsStep: React.FC<PaymentDetailsStepProps> = ({ onNext, onBack }) => {
  const { data, updateStepData } = useAddCourseToStudent();
  const [availableCoupons, setAvailableCoupons] = useState<CouponOption[]>(DEFAULT_COUPON_OPTIONS);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const navigation = useNavigation<TScreenNavigator>();
  const route = useRoute<any>();
  
  // Get organization data from store
  const organizationData = store.getState().organization.organization;
  const gstRuleData = organizationData?.gstRuleData;
  
  // Track when user is actively editing custom installment amounts to prevent auto-recalculation
  const [isEditingCustomInstallments, setIsEditingCustomInstallments] = useState(false);
  // Force re-render when installment amounts change
  const [installmentRenderKey, setInstallmentRenderKey] = useState(0);
  // Track if form has been submitted to show validation errors
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Function to manually reset editing flag (can be called from other places if needed)
  const resetEditingFlag = () => {
    setIsEditingCustomInstallments(false);
    console.log('Manually reset editing flag');
  };
  
  // Function to force recalculate installment amounts
  const forceRecalculateInstallments = () => {
    const partPayment = handler.watch('partPayment');
    const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
    const divideInstallment = handler.watch('divideInstallment');
    
    if (partPayment === 'yes' && numberOfInstallments > 1) {
      console.log('🔄 Force recalculating installments for', numberOfInstallments, 'installments');
      
      // Clear all existing amounts
      for (let i = 1; i <= 10; i++) {
        handler.setValue(`installmentAmount${i}`, '');
      }
      
      // Calculate new amounts - use paymentAfterGST if available (includes coupon discount and GST)
      const paymentAfterGST = handler.watch('paymentAfterGST');
      const totalPayment = parseFloat(handler.watch('totalPayment')) || 0;
      const baseAmount = !isNaN(paymentAfterGST) ? paymentAfterGST : totalPayment;
      
      console.log('🔄 Force recalculate base amounts:', {
        paymentAfterGST,
        totalPayment,
        baseAmount,
        selectedCoupon: selectedCoupon?.couponName
      });
      
      const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(baseAmount, numberOfInstallments);
      
      // Set new amounts
      for (let i = 1; i <= numberOfInstallments; i++) {
        const installmentAmount = installmentAmounts[i - 1];
        handler.setValue(`installmentAmount${i}`, installmentAmount);
        console.log(`🔄 Force recalculated installment ${i} to: ${installmentAmount}`);
      }
      
      // Force re-render
      setInstallmentRenderKey(prev => prev + 1);
      handler.trigger();
      
      // Also update the main amount field for equal installments
      if (divideInstallment === 'equal') {
        const firstInstallmentAmount = equalAmount + (remainder > 0 ? 1 : 0);
        handler.setValue('amount', firstInstallmentAmount);
        console.log(`🔄 Updated main amount field to: ${firstInstallmentAmount}`);
      }
    }
  };
  
  // Function to validate and adjust installment amounts to match total
  const validateAndAdjustInstallments = () => {
    const partPayment = handler.watch('partPayment');
    const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
    const divideInstallment = handler.watch('divideInstallment');
    
    if (partPayment === 'yes' && numberOfInstallments > 1 && divideInstallment === 'custom') {
      const totalAmount = handler.watch('paymentAfterGST') || parseFloat(handler.watch('totalPayment')) || 0;
      const currentInstallments = Array.from({ length: numberOfInstallments }, (_, i) => {
        const amount = parseFloat(handler.getValues(`installmentAmount${i + 1}`)) || 0;
        return amount;
      });
      
      const currentTotal = currentInstallments.reduce((sum, amount) => sum + amount, 0);
      const difference = totalAmount - currentTotal;
      
      console.log('🔍 Validating installment amounts:', {
        totalAmount,
        currentInstallments,
        currentTotal,
        difference
      });
      
      if (Math.abs(difference) > 0.01) { // Allow small rounding differences
        console.log('⚠️ Installment total mismatch detected, adjusting...');
        
        if (difference > 0) {
          // Add difference to last installment
          const lastInstallment = currentInstallments[numberOfInstallments - 1];
          const newLastAmount = lastInstallment + difference;
          handler.setValue(`installmentAmount${numberOfInstallments}`, newLastAmount.toString());
          console.log(`🔧 Adjusted last installment from ${lastInstallment} to ${newLastAmount}`);
        } else {
          // Subtract difference from last installment
          const lastInstallment = currentInstallments[numberOfInstallments - 1];
          const newLastAmount = Math.max(0, lastInstallment + difference);
          handler.setValue(`installmentAmount${numberOfInstallments}`, newLastAmount.toString());
          console.log(`🔧 Adjusted last installment from ${lastInstallment} to ${newLastAmount}`);
        }
      } else {
        console.log('✅ Installment amounts are valid');
      }
    }
  };
  
  // Fetch coupons from API
  const { data: couponsData, isLoading: couponsLoading, refetch: refetchCoupons } = useListCouponsQuery();
  
  // Get course fee from previous step data
  const courseFee = data.selectedCourse?.courseFee || 0;
  
  // Get max installments from course data
  const maxInstallments = data.selectedCourse?.maxPaymentInstallment || 2;
  
  // Generate dynamic installment options based on course max installments
  const installmentOptions = React.useMemo(() => {
    return generateInstallmentOptions(maxInstallments);
  }, [maxInstallments]);
  
  console.log('Course fee from context:', courseFee);
  console.log('Max installments from course:', maxInstallments);
  console.log('Generated installment options:', installmentOptions);
  
  const handler = useForm<any>({ 
    defaultValues: {
      totalPayment: data.totalPayment || courseFee,
      partPayment: data.partPayment || 'no',
      coupon: data.coupon || '',
      paymentAfterDiscount: data.paymentAfterDiscount || courseFee,
      discountAmount: data.discountAmount || 0,
      // GST fields
      cgstAmount: data.cgstAmount || 0,
      sgstAmount: data.sgstAmount || 0,
      totalGSTAmount: data.totalGSTAmount || 0,
      paymentAfterGST: data.paymentAfterGST || courseFee,
      gstinNumber: data.gstinNumber || gstRuleData?.gstinNumber || '',
      firstInstallment: data.firstInstallment || '',
      divideInstallment: data.divideInstallment || 'equal',
      numberOfInstallments: data.numberOfInstallments || ((data.partPayment === 'yes' ? '2' : '1')),
      paymentDate: data.paymentDate || null,
      amount: data.amount || courseFee,
      description: data.description || '',
      prevNumberOfInstallments: data.numberOfInstallments || ((data.numberOfInstallments || '1')),
    }, 
    mode: 'onSubmit', // Only validate on submit, not on change
    reValidateMode: 'onSubmit' // Only re-validate on submit
  });
  
  console.log('=== PAYMENT DETAILS STEP DEBUG ===');
  console.log('Context data:', data);
  console.log('Course fee from context:', courseFee);
  console.log('Max installments from course:', maxInstallments);
  console.log('Generated installment options:', installmentOptions);
  console.log('Current form values:', handler.getValues());
  console.log('Part payment value:', handler.watch('partPayment'));
  console.log('GST Rule Data:', gstRuleData);
  console.log('GST Inclusion Type:', gstRuleData?.inclusionType);
  console.log('Form state:', {
    hasSubmitted,
    errors: handler.formState.errors,
    isSubmitted: handler.formState.isSubmitted,
    isValidating: handler.formState.isValidating
  });
  console.log('=== END PAYMENT DETAILS STEP DEBUG ===');
  
  // Initialize payment amounts with course fee
  useEffect(() => {
    console.log('Course fee useEffect triggered, courseFee:', courseFee);
    if (courseFee > 0) {
      handler.setValue('totalPayment', courseFee);
      handler.setValue('paymentAfterDiscount', courseFee);
      handler.setValue('amount', courseFee);
      console.log('Course fee set in form:', courseFee);
    } else {
      // Set default values if no course fee
      const defaultAmount = 0;
      handler.setValue('totalPayment', defaultAmount);
      handler.setValue('paymentAfterDiscount', defaultAmount);
      handler.setValue('amount', defaultAmount);
      handler.setValue('discountAmount', 0);
    }
  }, [courseFee]);
  
  // Track context data changes
  useEffect(() => {
    console.log('Context data changed:', data);
    console.log('Course fee in context:', data.selectedCourse?.courseFee);
  }, [data]);
  
  // Reset editing flag when divideInstallment changes
  useEffect(() => {
    const divideInstallment = handler.watch('divideInstallment');
    if (divideInstallment === 'equal') {
      setIsEditingCustomInstallments(false);
      console.log('Reset editing flag - switched to equal installments');
    }
  }, [handler.watch('divideInstallment')]);
  
  // Reset editing flag when partPayment changes
  useEffect(() => {
    const partPayment = handler.watch('partPayment');
    if (partPayment === 'no') {
      setIsEditingCustomInstallments(false);
      console.log('Reset editing flag - switched to full payment');
    }
  }, [handler.watch('partPayment')]);
  
  // Monitor installment amount changes for debugging
  useEffect(() => {
    const partPayment = handler.watch('partPayment');
    const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
    const divideInstallment = handler.watch('divideInstallment');
    
    if (partPayment === 'yes' && numberOfInstallments > 1) {
      console.log('🔍 Monitoring installment amounts:', {
        partPayment,
        numberOfInstallments,
        divideInstallment,
        isEditingCustomInstallments
      });
      
      for (let i = 1; i <= numberOfInstallments; i++) {
        const amount = handler.watch(`installmentAmount${i}`);
        console.log(`🔍 Installment ${i} amount:`, amount);
      }
    }
  }, [
    handler.watch('partPayment'), 
    handler.watch('numberOfInstallments'), 
    handler.watch('divideInstallment'),
    handler.watch('installmentAmount1'),
    handler.watch('installmentAmount2'),
    handler.watch('installmentAmount3'),
    handler.watch('installmentAmount4'),
    handler.watch('installmentAmount5'),
    handler.watch('installmentAmount6')
  ]);

  // Auto-clear validation errors when dates are selected
  useEffect(() => {
    const subscription = handler.watch((value, { name }) => {
      // Check if the changed field is an installment date
      if (name && name.startsWith('installmentDate')) {
        const installmentNumber = name.replace('installmentDate', '');
        const dateValue = value[name];
        
        // If date is selected, clear the error
        if (dateValue) {
          handler.clearErrors(name);
          console.log(`✅ Auto-cleared error for ${name} when date was selected`);
        }
      }
      
      // Also watch for main payment date
      if (name === 'paymentDate' && value[name]) {
        handler.clearErrors('paymentDate');
        console.log('✅ Auto-cleared error for paymentDate when date was selected');
      }
    });
    return () => subscription.unsubscribe();
  }, [handler]);

  // Function to calculate GST amounts
  const calculateGSTAmounts = (baseAmount: number) => {
    if (!gstRuleData || gstRuleData.inclusionType === 'noGST') {
      return {
        cgstAmount: 0,
        sgstAmount: 0,
        totalGSTAmount: 0,
        amountAfterGST: baseAmount
      };
    }
    
    const cgstAmount = gstRuleData.cgstEnabled ? (baseAmount * gstRuleData.cgstPercentage) / 100 : 0;
    const sgstAmount = gstRuleData.sgstEnabled ? (baseAmount * gstRuleData.sgstPercentage) / 100 : 0;
    const totalGSTAmount = cgstAmount + sgstAmount;
    
    let amountAfterGST = baseAmount;
    if (gstRuleData.inclusionType === 'excluded') {
      // GST is added on top of base amount
      amountAfterGST = baseAmount + totalGSTAmount;
    } else if (gstRuleData.inclusionType === 'included') {
      // GST is already included in base amount
      amountAfterGST = baseAmount;
    }
    
    return {
      cgstAmount: Math.round(cgstAmount),
      sgstAmount: Math.round(sgstAmount),
      totalGSTAmount: Math.round(totalGSTAmount),
      amountAfterGST: Math.round(amountAfterGST)
    };
  };

  // Helper function to calculate and distribute installment amounts evenly
  const calculateAndDistributeInstallments = (baseAmount: number, numberOfInstallments: number) => {
    const equalAmount = Math.floor(baseAmount / numberOfInstallments);
    const remainder = baseAmount % numberOfInstallments;
    
    const installmentAmounts: string[] = [];
    for (let i = 1; i <= numberOfInstallments; i++) {
      const installmentAmount = equalAmount + (i <= remainder ? 1 : 0);
      installmentAmounts.push(installmentAmount.toString());
    }
    
    return {
      equalAmount,
      remainder,
      installmentAmounts
    };
  };

  // Dynamic calculations for payment amounts
  useEffect(() => {
    const totalPayment = parseFloat(handler.watch('totalPayment')) || 0;
    const partPayment = handler.watch('partPayment');
    const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
    const divideInstallment = handler.watch('divideInstallment');
    
    console.log('Calculation inputs:', { totalPayment, partPayment, numberOfInstallments, divideInstallment, selectedCoupon });
    
    // Skip automatic recalculation if user is actively editing custom installment amounts
    if (isEditingCustomInstallments && divideInstallment === 'custom') {
      console.log('🚫 SKIPPING automatic recalculation - user is editing custom installments');
      console.log('Editing flag:', isEditingCustomInstallments, 'Divide type:', divideInstallment);
      return;
    }
    
    // Calculate discount based on selected coupon
    let discountAmount = NaN;
    let paymentAfterDiscount = NaN;
    
    if (selectedCoupon && totalPayment > 0) {
      if (selectedCoupon.couponType === 'flat') {
        discountAmount = parseFloat(selectedCoupon.discountValue) || 0;
      } else if (selectedCoupon.couponType === 'percentage') {
        const percentageValue = parseFloat(selectedCoupon.discountValue) || 0;
        discountAmount = (totalPayment * percentageValue) / 100;
      }
      
      // Calculate payment after discount only when coupon is selected
      paymentAfterDiscount = Math.max(0, totalPayment - discountAmount);
    }
    
    // Calculate GST amounts based on payment after discount (or total payment if no discount)
    const baseAmountForGST = !isNaN(paymentAfterDiscount) ? paymentAfterDiscount : totalPayment;
    const gstAmounts = calculateGSTAmounts(baseAmountForGST);
    
    console.log('GST calculations:', {
      baseAmountForGST,
      gstAmounts,
      inclusionType: gstRuleData?.inclusionType
    });
    
    // Calculate amount based on part payment and installments
    let amount = totalPayment; // Default to total payment when no coupon
    
    if (selectedCoupon && !isNaN(paymentAfterDiscount)) {
      // Use payment after GST for amount calculation
      amount = gstAmounts.amountAfterGST;
      
      if (partPayment === 'yes' && numberOfInstallments > 1) {
        if (divideInstallment === 'equal') {
          // For equal installments, divide with proper remainder handling
          const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(gstAmounts.amountAfterGST, numberOfInstallments);
          
          // Update individual installment amounts for equal installments
          for (let i = 1; i <= numberOfInstallments; i++) {
            const installmentAmount = installmentAmounts[i - 1];
            const currentAmount = handler.getValues(`installmentAmount${i}`);
            
            // Only update if the amount has actually changed
            if (currentAmount !== installmentAmount) {
              handler.setValue(`installmentAmount${i}`, installmentAmount);
              console.log(`Updated installment ${i} from ${currentAmount} to ${installmentAmount}`);
            }
          }
          
          // Set main amount to first installment amount
          amount = equalAmount + (remainder > 0 ? 1 : 0);
        }
        // For custom installments, don't auto-calculate - let user edit
      } else if (partPayment === 'no') {
        // For full payment, amount is the same as payment after GST
        amount = gstAmounts.amountAfterGST;
      }
    } else {
      // When no coupon selected, use payment after GST for amount calculation
      amount = gstAmounts.amountAfterGST;
      
      if (partPayment === 'yes' && numberOfInstallments > 1) {
        if (divideInstallment === 'equal') {
          // For equal installments, divide with proper remainder handling
          const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(gstAmounts.amountAfterGST, numberOfInstallments);
          
          // Update individual installment amounts for equal installments
          for (let i = 1; i <= numberOfInstallments; i++) {
            const installmentAmount = installmentAmounts[i - 1];
            const currentAmount = handler.getValues(`installmentAmount${i}`);
            
            // Only update if the amount has actually changed
            if (currentAmount !== installmentAmount) {
              handler.setValue(`installmentAmount${i}`, installmentAmount);
              console.log(`Updated installment ${i} from ${currentAmount} to ${installmentAmount}`);
            }
          }
          
          // Set main amount to first installment amount
          amount = equalAmount + (remainder > 0 ? 1 : 0);
        }
        // For custom installments, don't auto-calculate - let user edit
      } else if (partPayment === 'no') {
        // For full payment, amount is the same as payment after GST
        amount = gstAmounts.amountAfterGST;
      }
    }
    
    // Update form values
    handler.setValue('discountAmount', Math.round(discountAmount));
    handler.setValue('paymentAfterDiscount', Math.round(paymentAfterDiscount));
    
    // Update GST-related form values
    handler.setValue('cgstAmount', gstAmounts.cgstAmount);
    handler.setValue('sgstAmount', gstAmounts.sgstAmount);
    handler.setValue('totalGSTAmount', gstAmounts.totalGSTAmount);
    handler.setValue('paymentAfterGST', gstAmounts.amountAfterGST);
    
    // Only update amount if it's equal installments or full payment
    if (partPayment === 'no' || (partPayment === 'yes' && divideInstallment === 'equal')) {
      handler.setValue('amount', amount);
    }
    
    console.log('Payment calculations:', {
      totalPayment,
      discountAmount,
      paymentAfterDiscount,
      gstAmounts,
      amount,
      numberOfInstallments,
      divideInstallment
    });
  }, [handler.watch('totalPayment'), handler.watch('partPayment'), handler.watch('numberOfInstallments'), handler.watch('divideInstallment'), selectedCoupon, gstRuleData]);

  // Convert API coupon data to dropdown options
  useEffect(() => {
    if (couponsData && couponsData.length > 0) {
      const couponOptions: CouponOption[] = couponsData.map((coupon: any) => ({
        label: `${coupon.couponName} - ${coupon.couponType === 'Flat' ? '₹' : '%'}${coupon.couponValue}`,
        value: coupon.couponId || coupon.couponName.toLowerCase().replace(/\s+/g, ''),
        couponData: coupon // Store full coupon data for reference
      }));
      setAvailableCoupons(couponOptions);
      console.log('🎫 Coupons loaded from API:', couponOptions);
    }
  }, [couponsData]);

  const onSubmit = (values: any) => {
    console.log('💰 === PAYMENT DETAILS STEP SUBMIT ===');
    console.log('Form values to save:', values);
    console.log('Current context data before update:', data);
    
    // Set submitted state to show validation errors
    setHasSubmitted(true);
    
    // Manual validation for payment dates and first installment
    const partPayment = values.partPayment;
    const numberOfInstallments = parseInt(values.numberOfInstallments) || 1;
    
    // Validate first installment status
    if (!values.firstInstallment) {
      return; // Error will be shown by UI validation
    }
    
    // Validate payment date for full payment
    if (partPayment === 'no' && !values.paymentDate) {
      handler.setError('paymentDate', { type: 'required', message: 'Payment date is required' });
      return;
    }
    
    // Validate installment dates for part payment - collect ALL errors first
    if (partPayment === 'yes') {
      let hasInstallmentDateErrors = false;
      let missingInstallments = [];
      
      // First pass: collect all missing installment dates
      for (let i = 1; i <= numberOfInstallments; i++) {
        const installmentDate = values[`installmentDate${i}`];
        if (!installmentDate) {
          handler.setError(`installmentDate${i}`, { type: 'required', message: `Installment ${i} date is required` });
          hasInstallmentDateErrors = true;
          missingInstallments.push(i);
        }
      }
      
      // If any installment dates are missing, show summary error and stop
      if (hasInstallmentDateErrors) {
        console.log('❌ Missing installment dates for installments:', missingInstallments);
        return;
      }
    }
    
    // Map form values to context structure
    const paymentData = {
      totalPayment: values.totalPayment || 0,
      partPayment: values.partPayment || 'no',
      coupon: (() => {
        // If coupon is selected, get the proper coupon data
        if (values.coupon && values.coupon !== '') {
          const selectedCoupon = availableCoupons.find((opt: CouponOption) => opt.value === values.coupon);
          if (selectedCoupon && selectedCoupon.couponData) {
            return {
              couponId: selectedCoupon.couponData.couponId,
              couponName: selectedCoupon.couponData.couponName,
              couponType: selectedCoupon.couponData.couponType,
              couponValue: selectedCoupon.couponData.couponValue
            };
          } else if (selectedCoupon) {
            // Fallback to label if couponData is not available
            return {
              couponId: selectedCoupon.value,
              couponName: selectedCoupon.label.split(' - ')[0],
              label: selectedCoupon.label
            };
          }
        }
        return '';
      })(),
      paymentAfterDiscount: values.paymentAfterDiscount || 0,
      discountAmount: values.discountAmount || 0,
      // GST-related fields
      cgstAmount: values.cgstAmount || 0,
      sgstAmount: values.sgstAmount || 0,
      totalGSTAmount: values.totalGSTAmount || 0,
      paymentAfterGST: values.paymentAfterGST || 0,
      gstinNumber: values.gstinNumber || gstRuleData?.gstinNumber || '',
      firstPaymentInstallment: values.firstInstallment || '',
      divideInstallment: values.divideInstallment || 'equal',
      numberOfInstallments: values.numberOfInstallments || '1',
      paymentDate: values.paymentDate || null,
      amount: values.amount || 0,
      description: values.description || '',
      // Add payment status based on firstInstallment selection
      paymentStatus: (values.firstInstallment === 'pay' ? 'paid' : 'due') as 'paid' | 'due',
      // Add installment details if part payment
      ...(values.partPayment === 'yes' && {
        installments: Array.from({ length: parseInt(values.numberOfInstallments) || 1 }, (_, index) => ({
          description: values[`installmentDescription${index + 1}`] || '',
          date: values[`installmentDate${index + 1}`] || null,
          amount: values[`installmentAmount${index + 1}`] || 0,
          // Set status based on firstInstallment selection
          status: (index === 0 && values.firstInstallment === 'pay') ? ('paid' as const) : ('due' as const)
        }))
      })
    };
    
    console.log('🎯 Payment status debug:', {
      firstInstallment: values.firstInstallment,
      paymentStatus: paymentData.paymentStatus,
      partPayment: values.partPayment,
      installments: paymentData.installments
    });
    
    console.log('Mapped payment data:', paymentData);
    
    updateStepData(paymentData);
    
    console.log('Context data after update:', data);
    console.log('💰 === END PAYMENT DETAILS STEP SUBMIT ===');
    
    onNext();
  };

  const handleAddCoupon = () => {
    console.log('🎫 Navigating to AddCoupon from PaymentDetailsStep');
    navigation.navigate('AddCoupon' as any, { returnScreen: 'AddCourseToStudent' });
  };

  return (
    <View style={styles.screenRoot}>
      <View style={styles.formCard}>
        <ThemeScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 20 }}>
          <ScalableText style={styles.sectionTitle} fontFamily="Medium">
            Payment Details
          </ScalableText>
          <ScalableText style={styles.stepIndicator} fontFamily="Regular">
            Step 2 of 3 - Enter Payment Information
          </ScalableText>
          
          <View style={styles.inputSpacing}>
            <ScalableText style={styles.inputLabel} fontFamily="Medium">
              Total Payment Amount*
            </ScalableText>
            <Input 
              handler={handler} 
              name="totalPayment" 
              label="Enter total payment amount"
              keyboardType="numeric" 
              containerStyles={styles.inputContainer}
              placeholder="Enter total payment amount"
              editable={false}
            />
          </View>
          
          <View style={styles.inputSpacing}>
            <ScalableText style={styles.inputLabel} fontFamily="Medium">
              Part Payment*
            </ScalableText>
            <ControlledSelect
              handler={handler}
              name="partPayment"
              label="Select payment type"
              options={PART_PAYMENT_OPTIONS}
              value={PART_PAYMENT_OPTIONS.find(opt => opt.value === handler.watch('partPayment')) || { label: 'No', value: 'no' }}
              dropdownButtonStyle={styles.inputContainer}
              onChangeValue={(selectedValue: string) => {
                console.log('Part payment changed to:', selectedValue);
                handler.setValue('partPayment', selectedValue);
                
                if (selectedValue === 'yes') {
                  // Set default to 2 installments for part payment
                  handler.setValue('numberOfInstallments', '2');
                  handler.setValue('divideInstallment', 'equal');
                  handler.setValue('firstInstallment', '');
                } else {
                  // Reset to single payment
                  handler.setValue('numberOfInstallments', '1');
                  handler.setValue('firstInstallment', '');
                }
              }}
            />
          </View>
          
          {/* Show divide installments only when part payment is yes */}
          {handler.watch('partPayment') === 'yes' && (
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Divide Installments*
              </ScalableText>
              <ControlledSelect
                handler={handler}
                name="divideInstallment"
                label="Select option"
                options={DIVIDE_INSTALLMENT_OPTIONS}
                value={DIVIDE_INSTALLMENT_OPTIONS.find(opt => opt.value === handler.watch('divideInstallment')) || { label: 'Equal', value: 'equal' }}
                dropdownButtonStyle={styles.inputContainer}
                onChangeValue={(selectedValue: string) => {
                  console.log('Divide installment changed to:', selectedValue);
                  handler.setValue('divideInstallment', selectedValue);
                  
                  const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
                  
                  if (selectedValue === 'equal') {
                    // If switching to equal, recalculate amounts
                    const paymentAfterGST = handler.watch('paymentAfterGST');
                    const totalPayment = parseFloat(handler.watch('totalPayment')) || 0;
                    
                    // Use paymentAfterGST if available, otherwise use totalPayment
                    const baseAmount = !isNaN(paymentAfterGST) ? paymentAfterGST : totalPayment;
                    const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(baseAmount, numberOfInstallments);
                    
                    // Update main amount field (first installment amount)
                    const firstInstallmentAmount = equalAmount + (remainder > 0 ? 1 : 0);
                    handler.setValue('amount', firstInstallmentAmount);
                    
                    // Update individual installment amounts with proper remainder distribution
                    for (let i = 1; i <= numberOfInstallments; i++) {
                      const installmentAmount = installmentAmounts[i - 1];
                      handler.setValue(`installmentAmount${i}`, installmentAmount);
                    }
                    
                    console.log('Recalculated equal amounts:', {
                      equalAmount,
                      baseAmount,
                      paymentAfterGST,
                      totalPayment,
                      numberOfInstallments
                    });
                  } else if (selectedValue === 'custom') {
                    // If switching to custom, initialize all installment amounts with calculated values
                    const paymentAfterGST = handler.watch('paymentAfterGST');
                    const totalPayment = parseFloat(handler.watch('totalPayment')) || 0;
                    
                    // Use paymentAfterGST if available, otherwise use totalPayment
                    const baseAmount = !isNaN(paymentAfterGST) ? paymentAfterGST : totalPayment;
                    const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(baseAmount, numberOfInstallments);
                    
                    console.log('🔄 Switching to custom mode - initializing installment amounts:', {
                      paymentAfterGST,
                      totalPayment,
                      baseAmount,
                      numberOfInstallments,
                      equalAmount,
                      remainder
                    });
                    
                    // Initialize all installment amounts with calculated values
                    for (let i = 1; i <= numberOfInstallments; i++) {
                      const installmentAmount = installmentAmounts[i - 1];
                      handler.setValue(`installmentAmount${i}`, installmentAmount);
                      console.log(`🔄 Initialized installment ${i} with amount: ${installmentAmount}`);
                    }
                  }
                }}
              />
            </View>
          )}
          
          <View style={styles.inputSpacing}>
            <ScalableText style={styles.inputLabel} fontFamily="Medium">
              Apply Coupon
            </ScalableText>
            <View style={styles.couponContainer}>
              {/* Show selected coupon in input field */}
              {selectedCoupon ? (
                <View style={styles.selectedCouponContainer}>
                  <View style={styles.selectedCouponInfo}>
                    <ScalableText style={styles.selectedCouponName} fontFamily="Medium">
                      {selectedCoupon.couponName}
                    </ScalableText>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeCouponButton}
                    onPress={() => {
                      setSelectedCoupon(null);
                      handler.setValue('coupon', '');
                      
                      // Force refresh installment amounts when coupon is removed
                      const partPayment = handler.watch('partPayment');
                      const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
                      
                      if (partPayment === 'yes' && numberOfInstallments > 1) {
                        // Temporarily reset editing flag to allow recalculation
                        setIsEditingCustomInstallments(false);
                        
                        // Force recalculate after a short delay
                        setTimeout(() => {
                          console.log('🔄 Coupon removed - forcing installment amount refresh');
                          forceRecalculateInstallments();
                        }, 100);
                      }
                    }}
                  >
                    <ScalableText style={styles.removeCouponText} fontFamily="Bold">×</ScalableText>
                  </TouchableOpacity>
                </View>
              ) : (
                /* Show dropdown when no coupon is selected */
                <ControlledSelect
                  handler={handler}
                  name="coupon"
                  label={couponsLoading ? "Loading coupons..." : "Select coupon"}
                  options={couponsLoading ? [{ label: 'Loading...', value: '' }] : availableCoupons}
                  value={availableCoupons.find((opt: CouponOption) => opt.value === handler.watch('coupon')) || { label: '', value: '' }}
                  dropdownButtonStyle={{ ...styles.inputContainer, flex: 1 }}
                  onChangeValue={(selectedValue: string) => {
                    console.log('Coupon selected:', selectedValue);
                    if (selectedValue) {
                      // Find the selected coupon object
                      const coupon = availableCoupons.find((opt: CouponOption) => opt.value === selectedValue);
                      if (coupon && coupon.value !== '') {
                        // Use real coupon data from API
                        const couponData = {
                          couponName: coupon.couponData?.couponName || coupon.label.split(' - ')[0],
                          couponType: coupon.couponData?.couponType?.toLowerCase() || (coupon.label.includes('₹') ? 'flat' : 'percentage'),
                          discountValue: coupon.couponData?.couponValue || parseInt(coupon.label.match(/\d+/)?.[0] || '0'),
                          couponId: coupon.couponData?.couponId
                        };
                        setSelectedCoupon(couponData);
                        console.log('Coupon data set:', couponData);
                        
                        // Force refresh installment amounts when coupon is selected
                        const partPayment = handler.watch('partPayment');
                        const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
                        const divideInstallment = handler.watch('divideInstallment');
                        
                        if (partPayment === 'yes' && numberOfInstallments > 1) {
                          // Temporarily reset editing flag to allow recalculation
                          setIsEditingCustomInstallments(false);
                          
                          // Force recalculate after a short delay to ensure coupon calculations are complete
                          setTimeout(() => {
                            console.log('🔄 Coupon selected - forcing installment amount refresh');
                            forceRecalculateInstallments();
                          }, 100);
                        }
                      } else {
                        setSelectedCoupon(null);
                      }
                      handler.setValue('coupon', selectedValue);
                    }
                  }}
                />
              )}
              <TouchableOpacity style={styles.addButton} onPress={handleAddCoupon}>
                <ScalableText style={styles.addButtonText} fontFamily="Bold">+</ScalableText>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.inputSpacing}>
            <ScalableText style={styles.inputLabel} fontFamily="Medium">
              Payment After Discount
            </ScalableText>
            <Input
              handler={handler}
              name="paymentAfterDiscount"
              label="Payment after discount"
              keyboardType="numeric" 
              containerStyles={styles.inputContainer}
              placeholder="0"
              editable={false}
            />
          </View>
          
          <View style={styles.inputSpacing}>
            <ScalableText style={styles.inputLabel} fontFamily="Medium">
              Discount Amount
            </ScalableText>
            <Input
              handler={handler} 
              name="discountAmount"
              label="Discount amount"
              keyboardType="numeric"
              containerStyles={styles.inputContainer}
              placeholder="0"
              editable={false}
            />
          </View>
          
          {/* GST Fields - Only show when GST is enabled and not included or noGST */}
          {gstRuleData && gstRuleData.inclusionType !== 'noGST' && gstRuleData.inclusionType !== 'included' && (
            <>
              {/* CGST Field */}
              {gstRuleData.cgstEnabled && (
                <View style={styles.inputSpacing}>
                  <ScalableText style={styles.inputLabel} fontFamily="Medium">
                    CGST ({gstRuleData.cgstPercentage}%)
                  </ScalableText>
                  <Input
                    handler={handler} 
                    name="cgstAmount"
                    label="CGST amount"
                    keyboardType="numeric"
                    containerStyles={styles.inputContainer}
                    placeholder="0"
                    editable={false}
                  />
                </View>
              )}
              
              {/* SGST Field */}
              {gstRuleData.sgstEnabled && (
                <View style={styles.inputSpacing}>
                  <ScalableText style={styles.inputLabel} fontFamily="Medium">
                    SGST ({gstRuleData.sgstPercentage}%)
                  </ScalableText>
                  <Input
                    handler={handler} 
                    name="sgstAmount"
                    label="SGST amount"
                    keyboardType="numeric"
                    containerStyles={styles.inputContainer}
                    placeholder="0"
                    editable={false}
                  />
                </View>
              )}
              
              {/* Total GST Amount */}
              <View style={styles.inputSpacing}>
                <ScalableText style={styles.inputLabel} fontFamily="Medium">
                  Total GST Amount
                </ScalableText>
                <Input
                  handler={handler} 
                  name="totalGSTAmount"
                  label="Total GST amount"
                  keyboardType="numeric"
                  containerStyles={styles.inputContainer}
                  placeholder="0"
                  editable={false}
                />
              </View>
              
              {/* Payment After GST */}
              <View style={styles.inputSpacing}>
                <ScalableText style={styles.inputLabel} fontFamily="Medium">
                  Payment After GST
                </ScalableText>
                <Input
                  handler={handler} 
                  name="paymentAfterGST"
                  label="Payment after GST"
                  keyboardType="numeric"
                  containerStyles={styles.inputContainer}
                  placeholder="0"
                  editable={false}
                />
              </View>
              
              {/* GSTIN Number */}
              <View style={styles.inputSpacing}>
                <ScalableText style={styles.inputLabel} fontFamily="Medium">
                  GSTIN Number
                </ScalableText>
                <Input
                  handler={handler} 
                  name="gstinNumber"
                  label="GSTIN number"
                  containerStyles={styles.inputContainer}
                  placeholder="Enter GSTIN number"
                  editable={false}
                  value={gstRuleData.gstinNumber}
                />
              </View>
            </>
          )}
          
          {/* Always show these fields regardless of part payment */}
          <View style={styles.inputSpacing}>
            <ScalableText style={styles.inputLabel} fontFamily="Medium">
              Are you paying first installment...*
            </ScalableText>
            <ControlledSelect
              handler={handler}
              name="firstInstallment"
              label="Select payment option"
              options={FIRST_INSTALLMENT_OPTIONS}
              value={handler.watch('firstInstallment') ? FIRST_INSTALLMENT_OPTIONS.find(opt => opt.value === handler.watch('firstInstallment')) || { label: 'Select payment option', value: '' } : { label: 'Select payment option', value: '' }}
              dropdownButtonStyle={{
                ...styles.inputContainer,
                ...(hasSubmitted && !handler.watch('firstInstallment') && {
                  borderColor: '#FF3B30',
                  borderWidth: 1
                })
              }}
              onChangeValue={(selectedValue: string) => {
                console.log('First installment changed to:', selectedValue);
                handler.setValue('firstInstallment', selectedValue);
              }}
            />
            {/* Only show error if form has been submitted AND field is empty */}
            {hasSubmitted && !handler.watch('firstInstallment') && (
              <ScalableText style={styles.errorText} fontFamily="Regular">
                {handler.watch('partPayment') === 'yes' ? 'First installment status is required' : 'Payment option is required'}
              </ScalableText>
            )}
          </View>
          
          <View style={styles.inputSpacing}>
            <ScalableText style={styles.inputLabel} fontFamily="Medium">
              Number of Installments*
            </ScalableText>
                          <ControlledSelect
                handler={handler}
                name="numberOfInstallments"
                label="Select installments"
                options={handler.watch('partPayment') === 'yes' ? installmentOptions : [{ label: '1', value: '1' }]}
                value={handler.watch('partPayment') === 'yes' 
                  ? (installmentOptions.find((opt: any) => opt.value === handler.watch('numberOfInstallments')) || { label: '2', value: '2' })
                  : { label: '1', value: '1' }
                }
                dropdownButtonStyle={{
                  ...styles.inputContainer,
                  ...(handler.watch('partPayment') === 'no' && { opacity: 0.6 })
                }}
                disabled={handler.watch('partPayment') === 'no'}
                onChangeValue={(selectedValue: string) => {
                  console.log('Number of installments changed to:', selectedValue);
                  handler.setValue('numberOfInstallments', selectedValue);
                  
                  const divideInstallment = handler.watch('divideInstallment');
                  const paymentAfterGST = handler.watch('paymentAfterGST');
                  const totalPayment = parseFloat(handler.watch('totalPayment')) || 0;
                  const numberOfInstallments = parseInt(selectedValue) || 1;
                  
                  // Use paymentAfterGST if available, otherwise use totalPayment
                  const baseAmount = !isNaN(paymentAfterGST) ? paymentAfterGST : totalPayment;
                  
                  if (divideInstallment === 'equal') {
                    // Calculate and distribute amounts evenly
                    const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(baseAmount, numberOfInstallments);
                    
                    // Update main amount field (first installment amount)
                    const firstInstallmentAmount = equalAmount + (remainder > 0 ? 1 : 0);
                    handler.setValue('amount', firstInstallmentAmount);
                    
                    // Update individual installment amounts with proper remainder distribution
                    for (let i = 1; i <= numberOfInstallments; i++) {
                      const currentAmount = handler.getValues(`installmentAmount${i}`);
                      const installmentAmount = installmentAmounts[i - 1];
                      
                      // Only update if the amount has actually changed
                      if (currentAmount !== installmentAmount) {
                        handler.setValue(`installmentAmount${i}`, installmentAmount);
                        console.log(`Updated installment ${i} from ${currentAmount} to ${installmentAmount}`);
                      }
                    }
                    
                    console.log('Recalculated equal amounts for', numberOfInstallments, 'installments:', equalAmount);
                  } else if (divideInstallment === 'custom') {
                    // For custom mode, we need to handle installment amount changes properly
                    const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(baseAmount, numberOfInstallments);
                    
                    console.log('🔄 Custom mode: Clearing old amounts and setting new ones for', numberOfInstallments, 'installments');
                    
                    // Immediately increment render key to force re-render
                    setInstallmentRenderKey(prev => prev + 1);
                    
                    // Clear all existing installment amounts first
                    for (let i = 1; i <= 10; i++) { // Clear up to 10 installments to be safe
                      handler.setValue(`installmentAmount${i}`, '');
                      console.log(`🔄 Cleared installment ${i} amount`);
                    }
                    
                    // Set new installment amounts immediately
                    for (let i = 1; i <= numberOfInstallments; i++) {
                      const installmentAmount = installmentAmounts[i - 1];
                      handler.setValue(`installmentAmount${i}`, installmentAmount);
                      console.log(`🔄 Custom mode: Set installment ${i} to amount: ${installmentAmount}`);
                    }
                    
                    // Force form re-render
                    handler.trigger();
                    
                    // Force another re-render after a short delay
                    setTimeout(() => {
                      setInstallmentRenderKey(prev => prev + 1);
                      handler.trigger();
                      
                      // Also call force recalculate to ensure amounts are set
                      forceRecalculateInstallments();
                    }, 200);
                    
                    console.log('🔄 Custom mode: Completed setting new installment amounts for', numberOfInstallments, 'installments:', {
                      equalAmount,
                      baseAmount,
                      paymentAfterGST,
                      totalPayment
                    });
                  }
                }}
              />
              {/* Show helper text when part payment is no */}
              {/* {handler.watch('partPayment') === 'no' && (
                <ScalableText style={styles.helperText} fontFamily="Regular">
                  Number of installments is set to 1 for full payment
                </ScalableText>
              )} */}
          </View>
          
          {/* Main payment fields - only show when part payment is no */}
          {handler.watch('partPayment') === 'no' && (
            <>
              <View style={styles.inputSpacing}>
                <ScalableText style={styles.inputLabel} fontFamily="Medium">
                  Payment Date*
                </ScalableText>
                <View style={styles.inputContainer}>
                  <DateInput
                    handler={handler}
                    name="paymentDate"
                    label="Select payment date"
                    inputRoot={styles.dateInputStyle}
                  />
                </View>
              </View>
              
              <View style={styles.inputSpacing}>
                <ScalableText style={styles.inputLabel} fontFamily="Medium">
                  Total Amount to Pay*
                </ScalableText>
                <Input 
                  handler={handler} 
                  name="amount" 
                  label="Total amount"
                  keyboardType="numeric" 
                  containerStyles={styles.inputContainer}
                  placeholder="0"
                  editable={false}
                />
              </View>
            </>
          )}
          
                            {/* Individual installment details - only when part payment is yes */}
          {(() => {
            const partPayment = handler.watch('partPayment');
            const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
            const divideInstallment = handler.watch('divideInstallment');
            
            console.log('Rendering installment details, partPayment:', partPayment, 'installments:', numberOfInstallments);
            
            if (partPayment === 'yes') {
              // Show individual installment details
              const paymentAfterGST = handler.watch('paymentAfterGST');
              const baseAmount = !isNaN(paymentAfterGST) ? paymentAfterGST : parseFloat(handler.watch('totalPayment')) || 0;
              const equalAmount = Math.floor(baseAmount / numberOfInstallments);
              const remainder = baseAmount % numberOfInstallments;
              
              // Calculate current total and remaining amount for custom installments
              const currentTotal = divideInstallment === 'custom' ? 
                Array.from({ length: numberOfInstallments }, (_, i) => 
                  parseFloat(handler.getValues(`installmentAmount${i + 1}`)) || 0
                ).reduce((sum, amount) => sum + amount, 0) : 0;
              
              const remainingAmount = baseAmount - currentTotal;
              
              return (
                <>
                  <View style={styles.inputSpacing}>
                    <ScalableText style={styles.inputLabel} fontFamily="Medium">
                      Installment Details
                    </ScalableText>
                    
                    {/* Show total and remaining amount for custom installments */}
                    {/* {divideInstallment === 'custom' && (
                      <View style={styles.amountSummaryContainer}>
                        <ScalableText style={styles.amountSummaryText} fontFamily="Regular">
                          Total Amount: ₹{baseAmount.toLocaleString('en-IN')}.00
                        </ScalableText>
                        <ScalableText style={styles.amountSummaryText} fontFamily="Regular">
                          Current Total: ₹{currentTotal.toLocaleString('en-IN')}.00
                        </ScalableText>
                        <ScalableText style={[
                          styles.amountSummaryText, 
                          remainingAmount < 0 ? styles.amountError : remainingAmount === 0 ? styles.amountSuccess : styles.amountWarning
                        ] as any} fontFamily="Medium">
                          Remaining: ₹{remainingAmount.toLocaleString('en-IN')}.00
                        </ScalableText>
                        {remainingAmount < 0 && (
                          <ScalableText style={styles.amountErrorText} fontFamily="Regular">
                            ⚠️ Total exceeds available amount!
                          </ScalableText>
                        )}
                      </View>
                    )} */}
                  </View>
                  
                  {Array.from({ length: numberOfInstallments }, (_, index) => {
                    // For equal installments, use calculated amount with proper remainder distribution
                    // For custom installments, use stored amount or calculated amount as default
                    const calculatedAmount = equalAmount + (index + 1 <= remainder ? 1 : 0);
                    const installmentAmount = divideInstallment === 'equal' ? 
                      calculatedAmount : 
                      (handler.getValues(`installmentAmount${index + 1}`) || calculatedAmount);
                    
                    console.log(`🎯 Rendering installment ${index + 1}:`, {
                      calculatedAmount,
                      storedAmount: handler.getValues(`installmentAmount${index + 1}`),
                      finalAmount: installmentAmount,
                      divideInstallment,
                      editable: divideInstallment === 'custom'
                    });
                    
                    return (
                      <View key={`installment-${numberOfInstallments}-${index}-${divideInstallment}-${installmentRenderKey}`} style={styles.installmentContainer}>
                        <ScalableText style={styles.installmentTitle} fontFamily="Medium">
                          Installment {index + 1}
                        </ScalableText>
                        
                        <View style={styles.inputSpacing}>
                          <ScalableText style={styles.inputLabel} fontFamily="Medium">
                            Date*
                          </ScalableText>
                          <View style={styles.inputContainer}>
                            <DateInput
                              handler={handler}
                              name={`installmentDate${index + 1}`}
                              label="Select installment date"
                              inputRoot={styles.dateInputStyle}
                            />
                          </View>
                        </View>
                        
                        <View style={styles.inputSpacing}>
                          <ScalableText style={styles.inputLabel} fontFamily="Medium">
                            Amount*
                          </ScalableText>
                          <Input 
                            handler={handler} 
                            name={`installmentAmount${index + 1}`}
                            label="Amount"
                            keyboardType="numeric" 
                            containerStyles={styles.inputContainer}
                            placeholder="0"
                            editable={divideInstallment === 'custom'}
                            defaultValue={installmentAmount.toString()}
                            onFocus={() => {
                              if (divideInstallment === 'custom') {
                                setIsEditingCustomInstallments(true);
                                console.log('🎯 Started editing custom installment amount for installment', index + 1);
                                console.log('🎯 Current editable state:', divideInstallment === 'custom');
                                console.log('🎯 Current divideInstallment value:', divideInstallment);
                              }
                            }}
                            onChangeText={(text) => {
                              if (divideInstallment === 'custom') {
                                // Keep the flag set while editing
                                setIsEditingCustomInstallments(true);
                                console.log('🎯 Typing in installment', index + 1, 'text:', text);
                                
                                // Manually update the form value to ensure it's saved
                                handler.setValue(`installmentAmount${index + 1}`, text);
                                console.log('🎯 Manually set form value for installment', index + 1, 'to:', text);
                                
                                // Get the new amount and total available amount
                                const newAmount = parseFloat(text) || 0;
                                const totalAmount = handler.watch('paymentAfterGST') || parseFloat(handler.watch('totalPayment')) || 0;
                                
                                // Check if new amount exceeds total
                                if (newAmount > totalAmount) {
                                  console.log('⚠️ Amount exceeds total, showing error');
                                  Alert.alert(
                                    'Invalid Amount',
                                    `Amount cannot exceed total payment of ₹${totalAmount.toLocaleString('en-IN')}.00`,
                                    [{ text: 'OK' }]
                                  );
                                  // Keep the previous valid amount, don't reset
                                  return;
                                }
                                
                                // Auto-adjust remaining installments to maintain total
                                const remainingAmount = totalAmount - newAmount;
                                const remainingInstallments = numberOfInstallments - 1;
                                
                                if (remainingInstallments > 0 && remainingAmount >= 0) {
                                  // Distribute remaining amount equally among remaining installments
                                  const equalAmount = Math.floor(remainingAmount / remainingInstallments);
                                  const remainder = remainingAmount % remainingInstallments;
                                  
                                  console.log('🎯 Auto-adjusting remaining installments:', {
                                    newAmount,
                                    totalAmount,
                                    remainingAmount,
                                    remainingInstallments,
                                    equalAmount,
                                    remainder
                                  });
                                  
                                  let currentIndex = 1;
                                  for (let i = 1; i <= numberOfInstallments; i++) {
                                    if (i !== index + 1) { // Skip the current installment being edited
                                      const installmentAmount = equalAmount + (currentIndex <= remainder ? 1 : 0);
                                      handler.setValue(`installmentAmount${i}`, installmentAmount.toString());
                                      console.log(`🎯 Auto-adjusted installment ${i} to: ${installmentAmount}`);
                                      currentIndex++;
                                    }
                                  }
                                  
                                  // Validate and ensure total matches
                                  setTimeout(() => {
                                    validateAndAdjustInstallments();
                                  }, 100);
                                } else if (remainingAmount < 0) {
                                  // This shouldn't happen due to above check, but just in case
                                  console.log('⚠️ Remaining amount is negative, showing error');
                                  Alert.alert(
                                    'Invalid Amount',
                                    'Amount is too high. Please enter a valid amount.',
                                    [{ text: 'OK' }]
                                  );
                                  // Don't reset, keep previous value
                                }
                                
                                // Verify the value was set
                                const updatedValue = handler.getValues(`installmentAmount${index + 1}`);
                                console.log('🎯 Verified form value after set:', updatedValue);
                              }
                            }}
                            onBlur={() => {
                              if (divideInstallment === 'custom') {
                                // Small delay to allow the form to settle before resetting
                                setTimeout(() => {
                                  setIsEditingCustomInstallments(false);
                                  console.log('🎯 Finished editing custom installment amount for installment', index + 1);
                                  
                                  // Final validation to ensure total matches
                                  validateAndAdjustInstallments();
                                }, 100);
                              }
                            }}
                          />
                        </View>
                        
                        <View style={styles.inputSpacing}>
                          <ScalableText style={styles.inputLabel} fontFamily="Medium">
                            Description
                          </ScalableText>
                          <Input 
                            handler={handler} 
                            name={`installmentDescription${index + 1}`}
                            label="Enter description"
                            containerStyles={styles.inputContainer}
                            placeholder="Enter description"
                            multiline={false}
                            maxLength={100}
                          />
                        </View>
                      </View>
                    );
                  })}
                </>
              );
            }
            return null;
          })()}
          
          {/* Main description field - only show when part payment is no */}
          {handler.watch('partPayment') === 'no' && (
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Description
              </ScalableText>
              <Input 
                handler={handler} 
                name="description" 
                label="Enter description"
                containerStyles={styles.inputContainer}
                placeholder="Enter description"
                multiline={false}
                maxLength={100}
              />
            </View>
          )}
        </ThemeScrollView>
      </View>
      <View style={styles.buttonBelowCardWrapper}>
        <View style={styles.buttonRow}>
          <Button 
            title="Back" 
            onPress={onBack} 
            btnStyles={styles.backBtn}
            btnTxtStyles={styles.backBtnText}
          />
          <Button 
            title="Next" 
            onPress={handler.handleSubmit(onSubmit)} 
            btnStyles={styles.nextBtn}
            btnTxtStyles={styles.nextBtnText}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1, 
    backgroundColor: COLORS.whiteSmoke,
    paddingHorizontal: responsive.padding.md,
    paddingTop: responsive.margin.md,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: responsive.borderRadius.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsive.shadow.sm },
    shadowOpacity: 0.1,
    shadowRadius: responsive.shadow.md,
    padding: responsive.card.padding,
    marginHorizontal: responsive.card.marginHorizontal,
    marginBottom: 0,
    paddingBottom: 0,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    maxHeight: responsive.hp('48%'),
  },
  sectionTitle: {
    fontSize: responsive.fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: responsive.margin.sm,
    color: COLORS.black,
  },
  stepIndicator: {
    fontSize: responsive.fontSize.sm,
    color: '#666',
    marginBottom: responsive.margin.lg,
  },
  inputSpacing: {
    marginBottom: responsive.margin.md,
  },
  inputLabel: {
    fontSize: responsive.fontSize.md,
    marginBottom: responsive.margin.sm,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
  },
  inputContainer: {
    marginTop: responsive.margin.sm,
  },
  dateInputStyle: {
    marginTop: 0,
    height: responsive.input.height,
    borderRadius: responsive.borderRadius.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsive.shadow.xs },
    shadowOpacity: 0.1,
    shadowRadius: responsive.shadow.sm,
    justifyContent: 'center',
    paddingHorizontal: responsive.input.paddingHorizontal,
  },
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: responsive.margin.sm,
    marginTop: responsive.margin.sm,
  },
  addButton: {
    width: responsive.wp('11%'),
    height: responsive.wp('11%'),
    borderRadius: responsive.wp('5.5%'),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsive.shadow.sm },
    shadowOpacity: 0.25,
    shadowRadius: responsive.shadow.lg,
    borderWidth: 0,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: responsive.fontSize.xl,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: responsive.fontSize.xl,
  },
  buttonBelowCardWrapper: {
    marginTop: responsive.margin.sm,
    alignItems: 'center',
    marginBottom: responsive.margin.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    gap: responsive.margin.md,
  },
  backBtn: {
    flex: 1,
    borderRadius: responsive.borderRadius.md,
    backgroundColor: '#E0E0E0',
  },
  backBtnText: {
    fontSize: responsive.fontSize.lg,
    fontFamily: "Poppins-Medium",
    color: COLORS.black,
  },
  nextBtn: {
    flex: 1,
    borderRadius: responsive.borderRadius.md,
  },
  nextBtnText: {
    fontSize: responsive.fontSize.lg,
    fontFamily: "Poppins-Medium",
    color: COLORS.white,
  },
  installmentContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: responsive.borderRadius.md,
    padding: responsive.padding.md,
    marginBottom: responsive.margin.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  installmentTitle: {
    fontSize: responsive.fontSize.md,
    fontWeight: 'bold',
    marginBottom: responsive.margin.md,
    color: COLORS.primary,
    fontFamily: "Poppins-Medium",
  },
  errorText: {
    color: '#FF3B30',
    fontSize: responsive.fontSize.xs,
    marginTop: responsive.margin.xs,
    marginLeft: responsive.margin.xs,
    fontFamily: "Poppins-Regular",
  },
  selectedCouponContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: responsive.borderRadius.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: responsive.padding.md,
    paddingVertical: responsive.padding.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsive.shadow.xs },
    shadowOpacity: 0.1,
    shadowRadius: responsive.shadow.sm,
  },
  selectedCouponInfo: {
    flex: 1,
  },
  selectedCouponName: {
    fontSize: responsive.fontSize.sm,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
  },
  removeCouponButton: {
    width: responsive.wp('6%'),
    height: responsive.wp('6%'),
    borderRadius: responsive.borderRadius.md,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: responsive.margin.sm,
  },
  removeCouponText: {
    fontSize: responsive.fontSize.md,
    color: COLORS.white,
    fontFamily: "Poppins-Bold",
  },
  helperText: {
    fontSize: responsive.fontSize.xs,
    color: '#666',
    marginTop: responsive.margin.xs,
    marginLeft: responsive.margin.xs,
    fontStyle: 'italic',
  },
  amountSummaryContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: responsive.borderRadius.md,
    padding: responsive.padding.sm,
    marginTop: responsive.margin.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  amountSummaryText: {
    fontSize: responsive.fontSize.sm,
    color: '#555',
    marginBottom: responsive.margin.xs,
    fontFamily: "Poppins-Regular",
  },
  amountError: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  amountSuccess: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  amountWarning: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  amountErrorText: {
    fontSize: responsive.fontSize.xs,
    color: '#FF3B30',
    fontFamily: "Poppins-Regular",
    fontStyle: 'italic',
  },
});

export default PaymentDetailsStep;
