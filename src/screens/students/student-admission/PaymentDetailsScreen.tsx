import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import Button from '../../../@ui/button/Button';
import ScalableText from '../../../@ui/scalable-text/ScalableText';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useStudentAdmission } from './StudentAdmissionContext';
import { useNavigationConfirmation } from './hooks/useNavigationConfirmation';
import Input from '../../../@ui/input/Input';
import ControlledSelect from '../../../@ui/controlled-select/ControlledSelect';
import DateInput from '../../../@ui/date-input/DateInput';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { paymentDetailsValidation } from './validation/paymentDetails.validation';
import SafeView from '../../../@ui/safe-view/SafeView';
import AppHeader from '../../../@ui/app-header/AppHeader';
import ThemeScrollView from '../../../@ui/theme-scroll-view/ThemeScrollView';
import { COLORS } from '../../../colors';
import { useListCouponsQuery } from '../../../apis/hooks/coupons/query/useListCoupons.query';
import { store } from '../../../app/store';

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

const PaymentDetailsScreen = () => {
  // Get organization data from store
  const organizationData = store.getState().organization.organization;
  const gstRuleData = organizationData?.gstRuleData;
  
  // Track when user is actively editing custom installment amounts to prevent auto-recalculation
  const [isEditingCustomInstallments, setIsEditingCustomInstallments] = useState(false);
  // Force re-render when installment amounts change
  const [installmentRenderKey, setInstallmentRenderKey] = useState(0);
  // Track if form has been submitted to show validation errors
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  console.log('🏢 Organization GST Data:', gstRuleData);
  console.log('🏢 GST Inclusion Type:', gstRuleData?.inclusionType);
  console.log('🏢 CGST Enabled:', gstRuleData?.cgstEnabled);
  console.log('🏢 SGST Enabled:', gstRuleData?.sgstEnabled);
  
  // Function to calculate suggested number of installments based on amount and course max installments
  const calculateSuggestedInstallments = (amount: number): number => {
    let suggestedInstallments = 2; // Default minimum for part payment
    
    if (amount <= 5000) {
      suggestedInstallments = 2; // Small amount - minimum 2 installments for part payment
    } else if (amount <= 15000) {
      suggestedInstallments = 2; // Medium amount - 2 installments
    } else if (amount <= 30000) {
      suggestedInstallments = 3; // Large amount - 3 installments
    } else if (amount <= 50000) {
      suggestedInstallments = 4; // Very large amount - 4 installments
    } else {
      suggestedInstallments = 6; // Extremely large amount - 6 installments
    }
    // Respect course max installments limit
    const maxInstallmentsFromCourse = (data as any).maxPaymentInstallment || 2;
    return Math.min(suggestedInstallments, maxInstallmentsFromCourse);
  };
  
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
  
  const { data, updateStepData } = useStudentAdmission();
  const { goBackWithConfirmation } = useNavigationConfirmation();
  const [availableCoupons, setAvailableCoupons] = useState<CouponOption[]>(DEFAULT_COUPON_OPTIONS);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  // Fetch coupons from API
  const { data: couponsData, isLoading: couponsLoading, refetch: refetchCoupons } = useListCouponsQuery();
  
  // Get course fee from previous step data
  const courseFee = (data as any).courseFee || 0;
  
  // Also try to get from route params if available
  const routeCourseFee = route.params?.courseFee;
  const finalCourseFee = routeCourseFee || courseFee;
  
  // Get max installments from course data
  const maxInstallments = (data as any).maxPaymentInstallment || 2;
  
  // Generate dynamic installment options based on course max installments
  const installmentOptions = React.useMemo(() => {
    return generateInstallmentOptions(maxInstallments);
  }, [maxInstallments]);
  
  console.log('Course fee sources:', {
    fromContext: courseFee,
    fromRoute: routeCourseFee,
    final: finalCourseFee
  });
  
  const handler = useForm<any>({ 
    defaultValues: {
      totalPayment: (data as any).totalPayment || finalCourseFee,
      partPayment: (data as any).partPayment || 'no',
      coupon: (data as any).coupon || '',
      paymentAfterDiscount: (data as any).paymentAfterDiscount || finalCourseFee,
      discountAmount: (data as any).discountAmount || 0,
      // GST fields
      cgstAmount: (data as any).cgstAmount || 0,
      sgstAmount: (data as any).sgstAmount || 0,
      totalGSTAmount: (data as any).totalGSTAmount || 0,
      paymentAfterGST: (data as any).paymentAfterGST || finalCourseFee,
      gstinNumber: (data as any).gstinNumber || gstRuleData?.gstinNumber || '',
      firstInstallment: (data as any).firstInstallment || '',
      divideInstallment: (data as any).divideInstallment || 'equal',
      numberOfInstallments: (data as any).numberOfInstallments || ((data as any).partPayment === 'yes' ? '2' : '1'),
      paymentDate: (data as any).paymentDate || null,
      amount: (data as any).amount || finalCourseFee,
      description: (data as any).description || '',
      prevNumberOfInstallments: (data as any).numberOfInstallments || ((data as any).numberOfInstallments || '1'),
    }, 
    // Temporarily disable validation resolver to prevent automatic validation
    // resolver: yupResolver(paymentDetailsValidation),
    mode: 'onSubmit', // Only validate on submit, not on change
    reValidateMode: 'onSubmit' // Only re-validate on submit
  });
  
  console.log('=== PAYMENT DETAILS DEBUG ===');
  console.log('Context data:', data);
  console.log('Course fee from context:', courseFee);
  console.log('Max installments from course:', (data as any).maxPaymentInstallment);
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
  console.log('=== END PAYMENT DETAILS DEBUG ===');
  
  // Initialize payment amounts with course fee
  useEffect(() => {
    console.log('Course fee useEffect triggered, finalCourseFee:', finalCourseFee);
    if (finalCourseFee > 0) {
      handler.setValue('totalPayment', finalCourseFee);
      handler.setValue('paymentAfterDiscount', finalCourseFee);
      handler.setValue('amount', finalCourseFee);
      console.log('Course fee set in form:', finalCourseFee);
    } else {
      // Set default values if no course fee
      const defaultAmount = 0;
      handler.setValue('totalPayment', defaultAmount);
      handler.setValue('paymentAfterDiscount', defaultAmount);
      handler.setValue('amount', defaultAmount);
      handler.setValue('discountAmount', 0);
    }
  }, [finalCourseFee]);
  
  // Track context data changes
  useEffect(() => {
    console.log('Context data changed:', data);
    console.log('Course fee in context:', data.courseFee);
  }, [data]);

  // Update number of installments when part payment changes or course max installments change
  useEffect(() => {
    const partPayment = handler.watch('partPayment');
    const totalPayment = parseFloat(handler.watch('totalPayment')) || 0;
    const currentInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
    
    console.log('Part payment/course change detected:', { partPayment, totalPayment, currentInstallments, maxInstallments });
    
    if (partPayment === 'yes') {
      // For part payment, default to 2 installments
      if (currentInstallments < 2) {
        handler.setValue('numberOfInstallments', '2');
        console.log('Part payment enabled, set default installments to: 2');
      } else if (currentInstallments > maxInstallments) {
        // Check if current installments exceed the new course max
        handler.setValue('numberOfInstallments', maxInstallments.toString());
        console.log('Course max installments reduced, updated installments from', currentInstallments, 'to:', maxInstallments);
      } else {
        console.log('Part payment enabled, keeping current installments:', currentInstallments, '(max allowed:', maxInstallments, ')');
      }
    } else if (partPayment === 'no') {
      // For full payment, set to 1
      if (currentInstallments !== 1) {
        handler.setValue('numberOfInstallments', '1');
        console.log('Full payment enabled, updated installments from', currentInstallments, 'to: 1');
      } else {
        console.log('Full payment enabled, keeping current installments: 1');
      }
    }
  }, [handler.watch('partPayment'), handler.watch('totalPayment'), maxInstallments]);

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
    
    // Validate total installment amounts
    if (partPayment === 'yes' && numberOfInstallments > 1 && divideInstallment === 'equal') {
      const totalInstallmentAmount = Array.from({ length: numberOfInstallments }, (_, i) => {
        const installmentAmount = handler.getValues(`installmentAmount${i + 1}`);
        return parseFloat(installmentAmount) || 0;
      }).reduce((sum, amount) => sum + amount, 0);
      
      const expectedAmount = gstAmounts.amountAfterGST;
      
      console.log('Installment validation:', {
        totalInstallmentAmount,
        expectedAmount,
        difference: Math.abs(totalInstallmentAmount - expectedAmount)
      });
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
  
  // Update individual installment amounts when payment after discount or number of installments changes
  // ONLY for equal installments - don't interfere with custom installment amounts
  useEffect(() => {
    const partPayment = handler.watch('partPayment');
    const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
    const divideInstallment = handler.watch('divideInstallment');
    const paymentAfterGST = handler.watch('paymentAfterGST');
    const totalPayment = parseFloat(handler.watch('totalPayment')) || 0;
    
    // Skip automatic recalculation if user is actively editing custom installment amounts
    if (isEditingCustomInstallments && divideInstallment === 'custom') {
      console.log('🚫 SKIPPING installment amount recalculation - user is editing custom installments');
      console.log('Editing flag:', isEditingCustomInstallments, 'Divide type:', divideInstallment);
      return;
    }
    
    // Only recalculate and set amounts when divideInstallment is 'equal'
    // This prevents overriding custom installment amounts when user is editing them
    if (partPayment === 'yes' && numberOfInstallments > 0 && divideInstallment === 'equal') {
      // Use paymentAfterGST if available, otherwise use totalPayment
      const baseAmount = !isNaN(paymentAfterGST) ? paymentAfterGST : totalPayment;
      const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(baseAmount, numberOfInstallments);
      
      // Update all individual installment amounts with proper remainder distribution
      for (let i = 1; i <= numberOfInstallments; i++) {
        const installmentAmount = installmentAmounts[i - 1];
        const currentAmount = handler.getValues(`installmentAmount${i}`);
        
        // Only update if the amount has actually changed
        if (currentAmount !== installmentAmount) {
          handler.setValue(`installmentAmount${i}`, installmentAmount);
          console.log(`Updated installment ${i} from ${currentAmount} to ${installmentAmount}`);
        }
      }
      
      console.log('Updated individual installment amounts for EQUAL installments:', {
        numberOfInstallments,
        equalAmount,
        baseAmount,
        paymentAfterGST,
        totalPayment
      });
    }
  }, [handler.watch('paymentAfterGST'), handler.watch('numberOfInstallments'), handler.watch('divideInstallment'), handler.watch('totalPayment')]);
  
  // Auto-suggest installments when payment after GST changes - DISABLED
  // Now defaults to 2 installments for part payment instead of calculating based on amount
  /*
  useEffect(() => {
    const partPayment = handler.watch('partPayment');
    const paymentAfterGST = handler.watch('paymentAfterGST');
    const totalPayment = parseFloat(handler.watch('totalPayment')) || 0;
    
    if (partPayment === 'yes') {
      // Use paymentAfterGST if available, otherwise use totalPayment
      const baseAmount = !isNaN(paymentAfterGST) ? paymentAfterGST : totalPayment;
      
      if (baseAmount > 0) {
        const currentInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
        const suggestedInstallments = calculateSuggestedInstallments(baseAmount);
      
        // Only update if the suggestion is different from current
        if (suggestedInstallments !== currentInstallments) {
          console.log('Auto-suggesting installments:', {
            current: currentInstallments,
            suggested: suggestedInstallments,
            baseAmount,
            paymentAfterGST,
            totalPayment
          });
          
          handler.setValue('numberOfInstallments', suggestedInstallments.toString());
        }
      }
    }
  }, [handler.watch('paymentAfterGST'), handler.watch('totalPayment')]);
  */
  
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

  // Clear validation errors when fields change
  useEffect(() => {
    const partPayment = handler.watch('partPayment');
    const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
    
    // Clear payment date errors when switching between part payment modes
    if (partPayment === 'no') {
      handler.clearErrors('paymentDate');
    } else if (partPayment === 'yes') {
      // Clear installment date errors when number of installments changes
      for (let i = 1; i <= numberOfInstallments; i++) {
        handler.clearErrors(`installmentDate${i}`);
      }
    }
    
    console.log('Cleared validation errors for payment mode:', partPayment);
  }, [handler.watch('partPayment'), handler.watch('numberOfInstallments')]);
  
  // Debug part payment changes
  useEffect(() => {
    const partPayment = handler.watch('partPayment');
    console.log('Part payment value changed to:', partPayment);
    console.log('Should show installment fields:', partPayment === 'yes');
  }, [handler.watch('partPayment')]);
  
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
  
  // Initialize form values on component mount
  useEffect(() => {
    const totalPayment = parseFloat(handler.watch('totalPayment')) || 0;
    const partPayment = handler.watch('partPayment');
    const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
    const divideInstallment = handler.watch('divideInstallment');
    
    console.log('🚀 Component mount - initializing form values:', {
      totalPayment,
      partPayment,
      numberOfInstallments,
      divideInstallment
    });
    
    // Clear any existing validation errors on mount
    handler.clearErrors();
    setHasSubmitted(false);
    
    // Initialize installment amounts if they don't exist
    if (partPayment === 'yes' && numberOfInstallments > 1) {
      const paymentAfterGST = handler.watch('paymentAfterGST') || totalPayment;
      const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(paymentAfterGST, numberOfInstallments);
      
      for (let i = 1; i <= numberOfInstallments; i++) {
        const existingAmount = handler.getValues(`installmentAmount${i}`);
        if (!existingAmount) {
          const installmentAmount = installmentAmounts[i - 1];
          handler.setValue(`installmentAmount${i}`, installmentAmount);
          console.log(`🚀 Initialized installment ${i} with amount: ${installmentAmount}`);
        }
      }
    }
  }, []); // Empty dependency array - runs only on mount
  
  // Initialize installment amounts when switching to custom mode
  useEffect(() => {
    const partPayment = handler.watch('partPayment');
    const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
    const divideInstallment = handler.watch('divideInstallment');
    
    if (partPayment === 'yes' && numberOfInstallments > 1 && divideInstallment === 'custom') {
      const paymentAfterGST = handler.watch('paymentAfterGST') || parseFloat(handler.watch('totalPayment')) || 0;
      const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(paymentAfterGST, numberOfInstallments);
      
      console.log('🔄 Switching to custom mode - initializing equal installment amounts:', {
        paymentAfterGST,
        numberOfInstallments,
        equalAmount,
        remainder
      });
      
      // Set all installments to equal amounts initially
      for (let i = 1; i <= numberOfInstallments; i++) {
        const installmentAmount = installmentAmounts[i - 1];
        handler.setValue(`installmentAmount${i}`, installmentAmount);
        console.log(`🔄 Set installment ${i} to equal amount: ${installmentAmount}`);
      }
    }
  }, [handler.watch('divideInstallment')]);
  
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
  
  // Monitor coupon changes and refresh installment amounts
  useEffect(() => {
    const partPayment = handler.watch('partPayment');
    const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
    
    if (partPayment === 'yes' && numberOfInstallments > 1 && selectedCoupon) {
      console.log('🎫 Coupon changed - checking if installment amounts need refresh');
      
      // Get current installment amounts
      const currentInstallments = Array.from({ length: numberOfInstallments }, (_, i) => {
        const amount = parseFloat(handler.getValues(`installmentAmount${i + 1}`)) || 0;
        return amount;
      });
      
      const currentTotal = currentInstallments.reduce((sum, amount) => sum + amount, 0);
      const expectedTotal = handler.watch('paymentAfterGST') || parseFloat(handler.watch('totalPayment')) || 0;
      const difference = Math.abs(currentTotal - expectedTotal);
      
      console.log('🎫 Coupon change validation:', {
        currentTotal,
        expectedTotal,
        difference,
        threshold: 1 // Allow 1 rupee difference for rounding
      });
      
      // If there's a significant difference, force refresh
      if (difference > 1) {
        console.log('🎫 Significant difference detected - forcing installment refresh');
        // Temporarily reset editing flag
        setIsEditingCustomInstallments(false);
        
        // Force recalculate after a short delay
        setTimeout(() => {
          forceRecalculateInstallments();
        }, 100);
      }
    }
  }, [selectedCoupon, handler.watch('paymentAfterGST')]);
  
  // Monitor form state changes for debugging
  useEffect(() => {
    console.log('🔍 Form state changed:', {
      hasSubmitted,
      errors: handler.formState.errors,
      isSubmitted: handler.formState.isSubmitted,
      isValidating: handler.formState.isValidating,
      firstInstallmentError: handler.formState.errors.firstInstallment
    });
  }, [hasSubmitted, handler.formState.errors, handler.formState.isSubmitted, handler.formState.isValidating]);
  
  // Clear installment amounts when switching between different numbers in custom mode
  useEffect(() => {
    const partPayment = handler.watch('partPayment');
    const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
    const divideInstallment = handler.watch('divideInstallment');
    
    if (partPayment === 'yes' && divideInstallment === 'custom') {
      // Store the previous number of installments to detect changes
      const prevNumberOfInstallments = handler.getValues('prevNumberOfInstallments') || numberOfInstallments;
      
      if (prevNumberOfInstallments !== numberOfInstallments) {
        console.log('🔄 Custom mode: Number of installments changed from', prevNumberOfInstallments, 'to', numberOfInstallments);
        
        // Immediately increment render key to force re-render
        setInstallmentRenderKey(prev => prev + 1);
        
        // Force clear all existing installment amounts by setting them to empty strings
        for (let i = 1; i <= 10; i++) {
          handler.setValue(`installmentAmount${i}`, '');
          console.log(`🔄 Cleared installment ${i} amount`);
        }
        
        // Calculate and set new installment amounts immediately
        const paymentAfterGST = handler.watch('paymentAfterGST');
        const totalPayment = parseFloat(handler.watch('totalPayment')) || 0;
        const baseAmount = !isNaN(paymentAfterGST) ? paymentAfterGST : totalPayment;
        const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(baseAmount, numberOfInstallments);
        
        console.log('🔄 Setting new installment amounts:', {
          baseAmount,
          numberOfInstallments,
          installmentAmounts
        });
        
        // Set new installment amounts
        for (let i = 1; i <= numberOfInstallments; i++) {
          const installmentAmount = installmentAmounts[i - 1];
          handler.setValue(`installmentAmount${i}`, installmentAmount);
          console.log(`🔄 Custom mode: Set installment ${i} to amount: ${installmentAmount}`);
        }
        
        // Store the new number for future comparison
        handler.setValue('prevNumberOfInstallments', numberOfInstallments);
        
        // Force form re-render
        handler.trigger();
        
        // Force another re-render after a short delay
        setTimeout(() => {
          setInstallmentRenderKey(prev => prev + 1);
          handler.trigger();
          
          // Also call force recalculate to ensure amounts are set
          forceRecalculateInstallments();
        }, 200);
      }
    }
  }, [handler.watch('numberOfInstallments'), handler.watch('divideInstallment')]);
  
  // Initialize new installment amounts when number of installments increases
  useEffect(() => {
    const partPayment = handler.watch('partPayment');
    const numberOfInstallments = parseInt(handler.watch('numberOfInstallments')) || 1;
    const divideInstallment = handler.watch('divideInstallment');
    
    if (partPayment === 'yes' && numberOfInstallments > 1) {
      const paymentAfterGST = handler.watch('paymentAfterGST');
      const totalPayment = parseFloat(handler.watch('totalPayment')) || 0;
      
      // Use paymentAfterGST if available, otherwise use totalPayment
      const baseAmount = !isNaN(paymentAfterGST) ? paymentAfterGST : totalPayment;
      const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(baseAmount, numberOfInstallments);
      
      // For custom mode, always recalculate when number of installments changes
      if (divideInstallment === 'custom') {
        console.log('🔄 Custom mode: Number of installments changed - recalculating all installment amounts:', {
          numberOfInstallments,
          baseAmount,
          equalAmount,
          remainder
        });
        
        // Clear all existing installment amounts first
        for (let i = 1; i <= 10; i++) { // Clear up to 10 installments to be safe
          handler.setValue(`installmentAmount${i}`, '');
        }
        
        // Set new installment amounts for the selected number
        for (let i = 1; i <= numberOfInstallments; i++) {
          const installmentAmount = installmentAmounts[i - 1];
          handler.setValue(`installmentAmount${i}`, installmentAmount);
          console.log(`🔄 Custom mode: Set installment ${i} to amount: ${installmentAmount}`);
        }
      } else {
        // For equal mode, only initialize missing amounts
        let needsInitialization = false;
        for (let i = 1; i <= numberOfInstallments; i++) {
          const existingAmount = handler.getValues(`installmentAmount${i}`);
          if (!existingAmount || existingAmount === '0' || existingAmount === '') {
            needsInitialization = true;
            break;
          }
        }
        
        if (needsInitialization) {
          console.log('🔄 Equal mode: Number of installments changed - initializing missing installment amounts:', {
            numberOfInstallments,
            baseAmount,
            equalAmount,
            remainder
          });
          
          // Initialize missing installment amounts
          for (let i = 1; i <= numberOfInstallments; i++) {
            const existingAmount = handler.getValues(`installmentAmount${i}`);
            if (!existingAmount || existingAmount === '0' || existingAmount === '') {
              const installmentAmount = installmentAmounts[i - 1];
              handler.setValue(`installmentAmount${i}`, installmentAmount);
              console.log(`🔄 Equal mode: Initialized missing installment ${i} with amount: ${installmentAmount}`);
            }
          }
        }
      }
    }
  }, [handler.watch('numberOfInstallments')]);
  
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

  // Check if we're returning from AddCouponScreen with new coupon data
  useEffect(() => {
    if (route.params?.newCoupon) {
      const newCoupon = route.params.newCoupon;
      
      // Add the new coupon to the available coupons list
      const couponOption: CouponOption = {
        label: `${newCoupon.couponName} - ${newCoupon.couponType === 'flat' ? '₹' : ''}${newCoupon.couponType === 'percentage' ? '%' : ''}${newCoupon.discountValue}`,
        value: newCoupon.couponId || newCoupon.couponName.toLowerCase().replace(/\s+/g, ''),
        couponData: newCoupon
      };
      
      setAvailableCoupons((prev: CouponOption[]) => [...prev, couponOption]);
      
      // Don't automatically select the newly created coupon
      // Let user manually select it from dropdown if they want to use it
      
      // Clear the route params
      navigation.setParams({ newCoupon: undefined });
      
      // Refetch coupons to get updated list
      refetchCoupons();
    }
  }, [route.params?.newCoupon]);

  const onNext = (values: any) => {
    console.log('💰 === PAYMENT DETAILS SUBMIT ===');
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
    
    // Validate installment dates for part payment
    if (partPayment === 'yes') {
      for (let i = 1; i <= numberOfInstallments; i++) {
        const installmentDate = values[`installmentDate${i}`];
        if (!installmentDate) {
          handler.setError(`installmentDate${i}`, { type: 'required', message: `Installment ${i} date is required` });
          return;
        }
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
    console.log('💰 === END PAYMENT DETAILS SUBMIT ===');
    
    // Clear form changes flag since we're proceeding to next step
    updateStepData({});
    
    navigation.navigate('Review');
  };
  
  const onBack = () => {
    goBackWithConfirmation();
  };

  const handleAddCoupon = () => {
    navigation.navigate('AddCoupon', { returnScreen: 'PaymentDetails' });
  };

  const handleMenuPress = () => {
    setShowMenu(true);
  };

  const handleUpdate = () => {
    setShowMenu(false);
    navigation.navigate('UpdatePayment', { paymentDetails: data });
  };

  const handleRefund = () => {
    setShowMenu(false);
    // Implement refund logic here
    console.log('Refund selected');
  };

  const [showMenu, setShowMenu] = useState(false);

  return (
    <SafeView>
      <AppHeader
        title="Payment Details"
        showDrawer={false}
        handleBackClick={goBackWithConfirmation}
      />
      <View style={styles.screenRoot}>
        <View style={styles.formCard}>
          <ThemeScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 20 }}>
            <ScalableText style={styles.sectionTitle} fontFamily="Medium">
              Payment Details
            </ScalableText>
            <ScalableText style={styles.stepIndicator} fontFamily="Regular">
              Step 4 of 5 - Enter Payment Information
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
                    
                    // Initialize installment amounts for the default 2 installments
                    const paymentAfterGST = handler.watch('paymentAfterGST');
                    const totalPayment = parseFloat(handler.watch('totalPayment')) || 0;
                    const numberOfInstallments = 2;
                    
                    // Use paymentAfterGST if available, otherwise use totalPayment
                    const baseAmount = !isNaN(paymentAfterGST) ? paymentAfterGST : totalPayment;
                    const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(baseAmount, numberOfInstallments);
                    
                    console.log('🔄 Part payment enabled - initializing default installment amounts:', {
                      paymentAfterGST,
                      totalPayment,
                      baseAmount,
                      numberOfInstallments,
                      equalAmount,
                      remainder
                    });
                    
                    // Initialize installment amounts with calculated values
                    for (let i = 1; i <= numberOfInstallments; i++) {
                      const installmentAmount = installmentAmounts[i - 1];
                      handler.setValue(`installmentAmount${i}`, installmentAmount);
                      console.log(`🔄 Initialized installment ${i} with amount: ${installmentAmount}`);
                    }
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
              {handler.watch('partPayment') === 'yes' && (
                <>
                  {/* <ScalableText style={styles.helperText} fontFamily="Regular">
                    💡 Suggested: ₹{handler.watch('paymentAfterDiscount')} → {handler.watch('numberOfInstallments')} installments
                    {handler.watch('divideInstallment') === 'equal' && (
                      ` × ₹${Math.round(handler.watch('paymentAfterDiscount') / parseInt(handler.watch('numberOfInstallments') || '1'))} each`
                    )}
                  </ScalableText>
                  <ScalableText style={styles.helperText} fontFamily="Regular">
                    📊 Amount ranges: ≤₹5K(1), ₹5K-15K(2), ₹15K-30K(3), ₹30K-50K(4), &gt;₹50K(6)
                  </ScalableText> */}
                </>
              )}
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
              const paymentAfterDiscount = handler.watch('paymentAfterDiscount');
              
              console.log('Rendering installment details, partPayment:', partPayment, 'installments:', numberOfInstallments);
              
              if (partPayment === 'yes') {
                // Show individual installment details
                const paymentAfterGST = handler.watch('paymentAfterGST');
                const baseAmount = !isNaN(paymentAfterGST) ? paymentAfterGST : parseFloat(handler.watch('totalPayment')) || 0;
                const equalAmount = Math.floor(baseAmount / numberOfInstallments);
                const remainder = baseAmount % numberOfInstallments;
                
                return (
                  <>
                    <View style={styles.inputSpacing}>
                      <ScalableText style={styles.inputLabel} fontFamily="Medium">
                        Installment Details
                      </ScalableText>
                      
                      {divideInstallment === 'custom' && (
                        <View >
                          <TouchableOpacity 
                           
                            onPress={() => {
                              console.log('🔄 Manual recalculate installments pressed');
                              validateAndAdjustInstallments();
                            }}
                          >
                   
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                         
                            onPress={() => {
                              console.log('🔄 Force recalculate installments pressed');
                              forceRecalculateInstallments();
                            }}
                          >
                     
                          </TouchableOpacity>
                        </View>
                      )}
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
                                  
                                  // Auto-adjust remaining installments to maintain total
                                  const newAmount = parseFloat(text) || 0;
                                  const totalAmount = handler.watch('paymentAfterGST') || parseFloat(handler.watch('totalPayment')) || 0;
                                  const remainingAmount = totalAmount - newAmount;
                                  const remainingInstallments = numberOfInstallments - 1;
                                  
                                  if (remainingInstallments > 0 && remainingAmount > 0) {
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
              onPress={handler.handleSubmit(onNext)} 
              btnStyles={styles.nextBtn}
              btnTxtStyles={styles.nextBtnText}
            />
          </View>
        </View>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1, 
    backgroundColor: COLORS.whiteSmoke,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 24,
    marginHorizontal: 8,
    marginTop: 15,
    marginBottom: 0,
    paddingBottom: 0,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    maxHeight: Dimensions.get('window').height * 0.55,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.black,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  inputSpacing: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    marginBottom: 8,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
  },
  inputContainer: {
    marginTop: 8,
  },
  dateInputStyle: {
    marginTop: 0,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 0,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonBelowCardWrapper: {
    marginTop: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    gap: 12,
  },
  buttonRowInline: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  backBtn: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  backBtnText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: COLORS.black,
  },
  nextBtn: {
    flex: 1,
    borderRadius: 12,
  },
  nextBtnText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: COLORS.white,
  },
  installmentContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  installmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.primary,
    fontFamily: "Poppins-Medium",
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  menuContainer: {
    position: 'relative',
    marginTop: 10,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40, // Adjust as needed
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuItemText: {
    fontSize: 14,
  },
  selectedCouponContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCouponInfo: {
    flex: 1,
  },
  selectedCouponName: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
  },
  selectedCouponValue: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: "Poppins-Regular",
    marginTop: 2,
  },
  removeCouponButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeCouponText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "Poppins-Bold",
  },
  recalculateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  recalculateButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: "Poppins-Regular",
  },
});

export default PaymentDetailsScreen; 