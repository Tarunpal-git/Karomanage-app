import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Platform, TouchableOpacity } from 'react-native';
import Button from '../../../@ui/button/Button';
import ScalableText from '../../../@ui/scalable-text/ScalableText';
import { useNavigation, useRoute } from '@react-navigation/native';
import { THomeStackNavigator } from '../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator';
import { useForm } from 'react-hook-form';
import Input from '../../../@ui/input/Input';
import ControlledSelect from '../../../@ui/controlled-select/ControlledSelect';
import DateInput from '../../../@ui/date-input/DateInput';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SafeView from '../../../@ui/safe-view/SafeView';
import AppHeader from '../../../@ui/app-header/AppHeader';
import ThemeScrollView from '../../../@ui/theme-scroll-view/ThemeScrollView';
import { COLORS } from '../../../colors';
import { useCreateCouponMutation } from '../../../apis/hooks/coupons/mutation/useCreateCoupon.mutation';

const COUPON_TYPE_OPTIONS = [
  { label: 'Flat', value: 'flat' },
  { label: 'Percentage', value: 'percentage' },
];

const COUPON_LIMIT_OPTIONS = [
  { label: 'Date', value: 'date' },
  { label: 'Coupon count', value: 'count' },
  { label: 'Both', value: 'both' },
  { label: 'None', value: 'none' },
];

const couponValidation = yup.object().shape({
  couponName: yup.string().required('Coupon name is required'),
  couponDescription: yup.string().nullable(),
  couponType: yup.string().required('Coupon type is required'),
  couponValue: yup.string().required('Coupon value is required').test('coupon-value-validation', 'Invalid coupon value', function(value) {
    if (!value) return true; // Let required validation handle empty values
    
    const couponType = this.parent.couponType;
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      return this.createError({ message: 'Please enter a valid number' });
    }
    
    if (couponType === 'percentage') {
      // For percentage coupons: must be between 1 and 100
      if (numValue < 1) {
        return this.createError({ message: 'Percentage must be at least 1%' });
      }
      if (numValue > 100) {
        return this.createError({ message: 'Percentage cannot exceed 100%' });
      }
    } else if (couponType === 'flat') {
      // For flat coupons: must be at least ₹1 for practical use
      if (numValue < 1) {
        return this.createError({ message: 'Flat discount must be at least ₹1' });
      }
    }
    
    return true;
  }),
  couponLimit: yup.string().required('Coupon limit is required'),
  couponExpiryDate: yup.mixed().when('couponLimit', {
    is: (limit: string) => ['date', 'both'].includes(limit),
    then: (schema) => schema.required('Coupon expiry date is required').test('date-valid', 'Please select a valid date', function(value) {
      if (!value) return false;
      try {
        const date = new Date(value as any);
        return !isNaN(date.getTime());
      } catch {
        return false;
      }
    }),
    otherwise: (schema) => schema.nullable(),
  }),
  couponCount: yup.string().when('couponLimit', {
    is: (limit: string) => ['count', 'both'].includes(limit),
    then: (schema) => schema.required('Coupon count is required'),
    otherwise: (schema) => schema.nullable(),
  }),
}).test('coupon-limit-validation', 'Please fill required fields based on selected limit', function(value) {
  const { couponLimit, couponExpiryDate, couponCount } = value;
  
  // If limit is 'date' or 'both', expiry date is required
  if (['date', 'both'].includes(couponLimit) && !couponExpiryDate) {
    return this.createError({ message: 'Coupon expiry date is required' });
  }
  
  // If limit is 'count' or 'both', count is required
  if (['count', 'both'].includes(couponLimit) && !couponCount) {
    return this.createError({ message: 'Coupon count is required' });
  }
  
  return true;
});

const AddCouponScreen = () => {
  const navigation = useNavigation<THomeStackNavigator>();
  const route = useRoute<any>();
  const createCouponMutation = useCreateCouponMutation();
  
  // Get the return screen from route params, default to PaymentDetails
  const returnScreen = route.params?.returnScreen || 'PaymentDetails';
  
  // State for error messages
  const [apiErrorMessage, setApiErrorMessage] = useState<string>('');
  
  console.log('🎫 AddCouponScreen - returnScreen:', returnScreen);
  
  const handler = useForm({
    defaultValues: {
      couponName: '',
      couponDescription: '',
      couponType: '',
      couponValue: '',
      couponLimit: 'none',
      couponExpiryDate: '',
      couponCount: '',
    },
    resolver: yupResolver(couponValidation),
  });

  // Clear date and count fields when coupon limit changes to 'none'
  React.useEffect(() => {
    const couponLimit = handler.watch('couponLimit');
    if (couponLimit === 'none') {
      handler.setValue('couponExpiryDate', '');
      handler.setValue('couponCount', '');
      handler.clearErrors('couponExpiryDate');
      handler.clearErrors('couponCount');
    } else {
      // Clear errors when switching between different limit types
      handler.clearErrors(['couponExpiryDate', 'couponCount']);
    }
  }, [handler.watch('couponLimit')]);

  // Clear API error message when form values change
  React.useEffect(() => {
    const subscription = handler.watch((value, { name }) => {
      if (name === 'couponName' && apiErrorMessage) {
        setApiErrorMessage('');
      }
    });
    return () => subscription.unsubscribe();
  }, [handler, apiErrorMessage]);

  const onSubmit = async (values: any) => {
    console.log('🎫 === SUBMIT COUPON FORM ===');
    console.log('Form values:', values);
    console.log('🎫 Form errors:', handler.formState.errors);
    console.log('🎫 Coupon limit:', values.couponLimit);
    console.log('🎫 Coupon expiry date:', values.couponExpiryDate);
    console.log('🎫 Coupon count:', values.couponCount);
    
    // Trigger validation for all fields first
    const isValid = await handler.trigger();
    console.log('🎫 Form validation result:', isValid);
    console.log('🎫 Form errors after trigger:', handler.formState.errors);
    
    // Additional validation for coupon limits
    if (['date', 'both'].includes(values.couponLimit)) {
      if (!values.couponExpiryDate || values.couponExpiryDate === '') {
        console.error('🎫 Validation Error: Coupon expiry date is required for selected limit');
        console.log('🎫 Setting error for couponExpiryDate');
        handler.setError('couponExpiryDate', { 
          type: 'required', 
          message: 'Coupon expiry date is required for selected limit' 
        });
        console.log('🎫 Form errors after setError:', handler.formState.errors);
        return;
      }
    }
    
    if (['count', 'both'].includes(values.couponLimit)) {
      if (!values.couponCount || values.couponCount === '') {
        console.error('🎫 Validation Error: Coupon count is required for selected limit');
        handler.setError('couponCount', { 
          type: 'required', 
          message: 'Coupon count is required for selected limit' 
        });
        return;
      }
    }
    
    // Clear any existing errors if validation passes
    handler.clearErrors(['couponExpiryDate', 'couponCount']);
    
    // Convert date format from Date object to DD/MM/YYYY for API
    const formatDateForAPI = (dateValue: any) => {
      if (!dateValue) return '';
      
      let date: Date;
      
      // Handle different date formats
      if (typeof dateValue === 'string') {
        // If it's already a string, try to parse it
        date = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        // If it's already a Date object
        date = dateValue;
      } else {
        console.error('Invalid date value:', dateValue);
        return '';
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateValue);
        return '';
      }
      
      // Format as DD/MM/YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    };
    
    const apiValues = {
      ...values,
      couponExpiryDate: formatDateForAPI(values.couponExpiryDate)
    };
    
    console.log('🎫 API values:', apiValues);
    console.log('🎫 Formatted date:', apiValues.couponExpiryDate);
    
    try {
      // Clear any previous API error messages
      setApiErrorMessage('');
      
      // Call the API to create coupon
      const response = await createCouponMutation.mutateAsync(apiValues);
      
      console.log('🎫 API Response:', response);
      
      if (response.statusCode === 200) {
        // Success - navigate back with the created coupon data
        const createdCoupon = response.data[0];
        console.log('🎫 Created coupon:', createdCoupon);
        
        // Navigate back to the specified return screen with the new coupon data
        console.log('🎫 Navigating back to:', returnScreen, 'with coupon data:', {
          couponName: createdCoupon.couponName,
          couponType: createdCoupon.couponType.toLowerCase(),
          discountValue: createdCoupon.couponValue,
          couponId: createdCoupon.couponId
        });
        
        navigation.navigate(returnScreen as any, { 
          newCoupon: {
            couponName: createdCoupon.couponName,
            couponType: createdCoupon.couponType.toLowerCase(),
            discountValue: createdCoupon.couponValue,
            couponId: createdCoupon.couponId
          }
        });
      } else {
        console.error('🎫 API Error:', response.message);
        // Handle API error response
        let errorMessage = 'Failed to create coupon. Please try again.';
        
        // Check for specific error cases
        if (response.message && typeof response.message === 'string') {
          if (response.message.toLowerCase().includes('duplicate') || 
              response.message.toLowerCase().includes('already exists') ||
              response.message.toLowerCase().includes('already in use')) {
            errorMessage = 'A coupon with this name already exists. Please choose a different name.';
            // Set error on the coupon name field
            handler.setError('couponName', { 
              type: 'duplicate', 
              message: 'A coupon with this name already exists' 
            });
          } else {
            errorMessage = response.message;
          }
        }
        
        setApiErrorMessage(errorMessage);
      }
    } catch (error: any) {
      console.error('🎫 Error creating coupon:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to create coupon. Please try again.';
      
      if (error?.response?.data?.message) {
        // Handle axios error response
        const apiError = error.response.data.message;
        if (apiError.toLowerCase().includes('duplicate') || 
            apiError.toLowerCase().includes('already exists') ||
            apiError.toLowerCase().includes('already in use')) {
          errorMessage = 'A coupon with this name already exists. Please choose a different name.';
          // Set error on the coupon name field
          handler.setError('couponName', { 
            type: 'duplicate', 
            message: 'A coupon with this name already exists' 
          });
        } else {
          errorMessage = apiError;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setApiErrorMessage(errorMessage);
    }
  };

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <SafeView>
      <AppHeader
        title="Add Coupon"
        showDrawer={false}
        handleBackClick={onBack}
      />
      <View style={styles.screenRoot}>
        <View style={styles.formCard}>
          <ThemeScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 20 }}>
            <ScalableText style={styles.sectionTitle} fontFamily="Medium">
              Add Coupon
            </ScalableText>
            <ScalableText style={styles.stepIndicator} fontFamily="Regular">
              Create New Coupon
            </ScalableText>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Coupon Name*
              </ScalableText>
              <Input
                handler={handler}
                name="couponName"
                label="Enter coupon name"
                containerStyles={styles.inputContainer}
                placeholder="Enter coupon name"
                onChangeText={(text) => {
                  // Clear API error message when user starts typing
                  if (apiErrorMessage) {
                    setApiErrorMessage('');
                  }
                  // Clear any duplicate name error
                  if (handler.formState.errors.couponName?.type === 'duplicate') {
                    handler.clearErrors('couponName');
                  }
                }}
              />
              
              {/* Show API error message below coupon name field */}
              {apiErrorMessage && (
                <View style={styles.validationErrorContainer}>
                  <ScalableText style={styles.validationErrorText} fontFamily="Regular">
                    ⚠️ {apiErrorMessage}
                  </ScalableText>
                </View>
              )}
            </View>

            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Coupon Description
              </ScalableText>
              <Input
                handler={handler}
                name="couponDescription"
                label="Coupon description"
                containerStyles={styles.inputContainer}
                placeholder="Coupon description"
                multiline={false}
                maxLength={100}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </View>

            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Coupon Type*
              </ScalableText>
              <ControlledSelect
                handler={handler}
                name="couponType"
                label="Select coupon type"
                options={COUPON_TYPE_OPTIONS}
                value={COUPON_TYPE_OPTIONS.find(opt => opt.value === handler.watch('couponType')) || { label: '', value: '' }}
                dropdownButtonStyle={styles.inputContainer}
              />
            </View>

            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Coupon Value*
              </ScalableText>
              <Input
                handler={handler}
                name="couponValue"
                label="Enter coupon value"
                containerStyles={styles.inputContainer}
                placeholder={handler.watch('couponType') === 'percentage' ? 'Enter value (1-100)' : 'Enter value (min ₹1)'}
                keyboardType="numeric"
                onChangeText={(text) => {
                  const couponType = handler.watch('couponType');
                  let processedText = text;
                  
                  // Remove any non-digit characters except decimal point
                  processedText = processedText.replace(/[^0-9.]/g, '');
                  
                  // Ensure only one decimal point
                  const parts = processedText.split('.');
                  if (parts.length > 2) {
                    processedText = parts[0] + '.' + parts.slice(1).join('');
                  }
                  
                  // For flat coupons, prevent negative values and very low values
                  if (couponType === 'flat') {
                    const numValue = parseFloat(processedText);
                    if (!isNaN(numValue) && numValue < 0) {
                      processedText = '0';
                    }
                    // Prevent values less than 1 for flat coupons
                    if (!isNaN(numValue) && numValue > 0 && numValue < 1) {
                      processedText = '1';
                    }
                  }
                  
                  handler.setValue('couponValue', processedText);
                }}
                rightIcon={
                  <ScalableText style={styles.inputSuffixText} fontFamily="Medium">
                    {handler.watch('couponType') === 'percentage' ? '%' : '/-'}
                  </ScalableText>
                }
              />

            </View>

            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Coupon Limit*
              </ScalableText>
              <ControlledSelect
                handler={handler}
                name="couponLimit"
                label="Select coupon limit"
                options={COUPON_LIMIT_OPTIONS}
                value={COUPON_LIMIT_OPTIONS.find(opt => opt.value === handler.watch('couponLimit')) || { label: 'None', value: 'none' }}
                dropdownButtonStyle={styles.inputContainer}
              />
            </View>

            {/* Date Field - Shows when limit is 'date' or 'both' */}
            {['date', 'both'].includes(handler.watch('couponLimit')) && (
              <View style={styles.inputSpacing}>
                <ScalableText style={styles.inputLabel} fontFamily="Medium">
                  Coupon Expiry Date*
                </ScalableText>
                <View style={styles.inputContainer}>
                  <DateInput
                    handler={handler}
                    name="couponExpiryDate"
                    label="Select expiry date"
                    inputRoot={styles.dateInputStyle}
                    errorStyle={styles.dateErrorStyle}
                  />
                </View>
              </View>
            )}

            {/* Count Field - Shows when limit is 'count' or 'both' */}
            {['count', 'both'].includes(handler.watch('couponLimit')) && (
              <View style={styles.inputSpacing}>
                <ScalableText style={styles.inputLabel} fontFamily="Medium">
                  Coupon Count*
                </ScalableText>
                <Input
                  handler={handler}
                  name="couponCount"
                  label="Enter coupon count"
                  containerStyles={styles.inputContainer}
                  placeholder="Enter number of coupons"
                  keyboardType="numeric"
                  errorStyle={styles.countErrorStyle}
                />
              </View>
            )}

            {/* Show message when 'none' is selected */}
            {handler.watch('couponLimit') === 'none' && (
              <View style={styles.infoContainer}>
                <ScalableText style={styles.infoText} fontFamily="Regular">
                  ℹ️ No limit applied - coupon can be used unlimited times without expiry date or usage count restrictions
                </ScalableText>
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
              title={createCouponMutation.isPending ? "Creating..." : "Create"} 
              onPress={async () => {
                console.log('🎫 Create button pressed');
                
                // Trigger validation first
                const isValid = await handler.trigger();
                console.log('🎫 Button pressed - validation result:', isValid);
                console.log('🎫 Form errors after trigger:', handler.formState.errors);
                
                if (isValid) {
                  handler.handleSubmit(onSubmit)();
                } else {
                  console.log('🎫 Form validation failed, errors:', handler.formState.errors);
                  // Force re-render to show errors
                  handler.trigger();
                }
              }} 
              btnStyles={styles.nextBtn}
              btnTxtStyles={styles.nextBtnText}
              disabled={createCouponMutation.isPending}
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
  inputSuffixText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  
    alignSelf: 'center',
  },
  infoContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    color: '#1976D2',
    fontSize: 14,
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
  dateErrorStyle: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.error,
  },
  countErrorStyle: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.error,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
  },
  validationErrorContainer: {
    marginTop: 4,
  },
  validationErrorText: {
    fontSize: 12,
    color: COLORS.error,
  },
});

export default AddCouponScreen; 