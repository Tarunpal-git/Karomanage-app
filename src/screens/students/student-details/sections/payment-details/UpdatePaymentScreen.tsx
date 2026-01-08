import React, { FC, useState, useMemo, useEffect } from "react";
import { StyleSheet, View, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import SafeView from "../../../../../@ui/safe-view/SafeView";
import AppHeader from "../../../../../@ui/app-header/AppHeader";
import ThemeScrollView from "../../../../../@ui/theme-scroll-view/ThemeScrollView";
import Flex from "../../../../../@ui/flex/Flex";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../../colors";
import { Col, Grid, Row } from "react-native-easy-grid";
import { THomeStackNavigator } from "../../../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
import { useCourseDetailsQuery } from "../../../../../apis/hooks/course/query/useCourseDetails.query";
import { useStudentDetailsQuery } from "../../../../../apis/hooks/students/query/useStudentDetails.query";
import { useListCouponsQuery } from "../../../../../apis/hooks/coupons/query/useListCoupons.query";
import { useEmployeesListQuery } from "../../../../../apis/hooks/employee/query/useEmployeesList.query";
import ActionIcon from "../../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../../images";
import Button from "../../../../../@ui/button/Button";
import SelectDropdown from "../../../../../@ui/select-dropdown/SelectDropdown";
import Input from "../../../../../@ui/input/Input";
import DateInput from "../../../../../@ui/date-input/DateInput";
import DatePicker from "react-native-date-picker";
import { request } from "../../../../../services/axios.service";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../app/store";
import { useForm } from "react-hook-form";

interface IUpdatePaymentScreen {
  course: TCourse;
  studentRollNo: string;
}

interface CouponOption {
  label: string;
  value: string;
  couponData?: any;
}

const UpdatePaymentScreen: FC = () => {
  const navigation = useNavigation<THomeStackNavigator>();
  const route = useRoute<any>();
  const { course, studentRollNo } = route.params;
  const [activeTab, setActiveTab] = useState<"installment" | "payment">("installment");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [paymentDate, setPaymentDate] = useState(() => {
    const today = new Date();
    return today;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReminderMenu, setShowReminderMenu] = useState<string | null>(null);
  const [isPayingFirstInstallment, setIsPayingFirstInstallment] = useState<string>('');
  const [installmentDescription, setInstallmentDescription] = useState('');
  const [selectedInstallmentForDate, setSelectedInstallmentForDate] = useState<string>('');
  
  // Form handler for dynamic installments
  const installmentHandler = useForm();
  
  // Form handler for date inputs
  const dateHandler = useForm();
  
  // Initialize form values when dynamicInstallments change
  useEffect(() => {
    dynamicInstallments.forEach((inst) => {
      const fieldName = `installmentAmount${inst.installmentId}`;
      installmentHandler.setValue(fieldName, inst.duePayment?.toString() || "0");
    });
    console.log('🔄 Initialized form values for installments:', dynamicInstallments);
  }, [dynamicInstallments]);
  
  // Coupon states
  const [availableCoupons, setAvailableCoupons] = useState<CouponOption[]>([
    { label: 'Select coupon', value: '' }
  ]);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentAfterDiscount, setPaymentAfterDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Employee states
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
  
  // Dynamic installment states
  const [dynamicInstallments, setDynamicInstallments] = useState<any[]>([]);
  const [nextInstallmentNumber, setNextInstallmentNumber] = useState(1);

  // Set default values for installment amounts
  useMemo(() => {
    dynamicInstallments.forEach((inst, index) => {
      installmentHandler.setValue(`installmentAmount${inst.installmentId}`, inst.duePayment?.toString() || "0");
    });
  }, [dynamicInstallments]);

  // Watch for changes in installment amounts
  const watchedAmounts = installmentHandler.watch();

  // Update installment amounts when form values change
  useEffect(() => {
    dynamicInstallments.forEach((inst) => {
      const fieldName = `installmentAmount${inst.installmentId}`;
      const newAmount = watchedAmounts[fieldName];
      
      if (newAmount !== undefined && newAmount !== inst.duePayment?.toString()) {
        const amount = parseFloat(newAmount) || 0;
        handleUpdateInstallmentAmount(inst.installmentId, amount);
      }
    });
  }, [watchedAmounts]);
  
  // Get user and organization data from Redux
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const selectedOrganization = useSelector((state: RootState) => state.auth.selectedOrganization);

  // API calls for dynamic data
  const { data: courseData, isLoading: courseLoading } = useCourseDetailsQuery({
    courseId: course.courseId,
  });

  const { data: studentData, isLoading: studentLoading, refetch: refetchStudentData } = useStudentDetailsQuery(studentRollNo);

  // Fetch coupons from API
  const { data: couponsData, isLoading: couponsLoading, refetch: refetchCoupons } = useListCouponsQuery();
  
  // Fetch employees from API
  const { data: employeesData, isLoading: employeesLoading } = useEmployeesListQuery();

  // Get payment details from student data
  const paymentDetails = useMemo(() => {
    console.log("Student Data:", JSON.stringify(studentData, null, 2));
    console.log("Course ID:", course.courseId);
    
    if (studentData?.data?.courses) {
      const foundCourse = studentData.data.courses.find((c: any) => c.courseId === course.courseId);
      console.log("Found Course:", JSON.stringify(foundCourse, null, 2));
      return foundCourse?.paymentDetails;
    }
    return null;
  }, [studentData, course.courseId]);

  // Get installment details
  const installmentDetails = useMemo(() => {
    console.log("Payment Details:", JSON.stringify(paymentDetails, null, 2));
    console.log("Installment Details:", JSON.stringify(paymentDetails?.installmentDetails, null, 2));
    return paymentDetails?.installmentDetails || [];
  }, [paymentDetails]);

  // Convert API coupon data to dropdown options
  useMemo(() => {
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

  // Convert API employee data to dropdown options
  useMemo(() => {
    if (employeesData?.data && employeesData.data.length > 0) {
      const employeeOptions = employeesData.data.map((employee: any) => {
        const firstName = employee?.employeePersonalDetails?.employeeFirstname || employee.employeeFirstName || '';
        const lastName = employee?.employeePersonalDetails?.employeeLastname || employee.employeeLastName || '';
        const displayName = `${firstName} ${lastName}`.trim();
        const employeeId = employee.employeeId || employee.id;
        
        return {
          label: `${displayName} (${employeeId})`,
          value: employeeId,
          employeeData: employee
        };
      });
      setAvailableEmployees(employeeOptions);
      console.log('👥 Employees loaded from API:', employeeOptions);
    }
  }, [employeesData]);

  // Calculate discount and payment after discount when coupon changes
  useMemo(() => {
    const totalDuePayment = paymentDetails?.totalDuePayment || 0;
    
    if (selectedCoupon && totalDuePayment > 0) {
      let calculatedDiscount = 0;
      
      if (selectedCoupon.couponType === 'flat') {
        calculatedDiscount = parseFloat(selectedCoupon.discountValue) || 0;
      } else if (selectedCoupon.couponType === 'percentage') {
        const percentageValue = parseFloat(selectedCoupon.discountValue) || 0;
        calculatedDiscount = (totalDuePayment * percentageValue) / 100;
      }
      
      const calculatedPaymentAfterDiscount = Math.max(0, totalDuePayment - calculatedDiscount);
      
      setDiscountAmount(Math.round(calculatedDiscount));
      setPaymentAfterDiscount(Math.round(calculatedPaymentAfterDiscount));
      
      console.log('Coupon calculation based on total due payment:', {
        totalDuePayment,
        selectedCoupon,
        calculatedDiscount,
        calculatedPaymentAfterDiscount
      });
    } else {
      setDiscountAmount(0);
      setPaymentAfterDiscount(totalDuePayment);
    }
  }, [selectedCoupon, paymentDetails?.totalDuePayment]);

  // Check if we're returning from AddCouponScreen with new coupon data
  useMemo(() => {
    if (route.params?.newCoupon) {
      const newCoupon = route.params.newCoupon;
      
      // Add the new coupon to the available coupons list
      const couponOption: CouponOption = {
        label: `${newCoupon.couponName} - ${newCoupon.couponType === 'flat' ? '₹' : ''}${newCoupon.couponType === 'percentage' ? '%' : ''}${newCoupon.discountValue}`,
        value: newCoupon.couponId || newCoupon.couponName.toLowerCase().replace(/\s+/g, ''),
        couponData: newCoupon
      };
      
      setAvailableCoupons((prev: CouponOption[]) => [...prev.slice(1), couponOption]); // Keep "Select coupon" as first option
      
      // Set the newly created coupon as selected
      setSelectedCoupon(newCoupon);
      
      // Clear the route params
      navigation.setParams({ newCoupon: undefined });
      
      // Refetch coupons to get updated list
      refetchCoupons();
    }
  }, [route.params?.newCoupon]);

  const handleCouponSelection = (selectedValue: string) => {
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
      } else {
        setSelectedCoupon(null);
      }
    } else {
      setSelectedCoupon(null);
    }
  };

  const handleAddCoupon = () => {
    (navigation as any).navigate('AddCoupon', { returnScreen: 'UpdatePayment' });
  };

  // Initialize dynamic installments from existing due installments
  useMemo(() => {
    const dueInstallments = installmentDetails.filter((inst: any) => inst.paymentStatus?.toLowerCase() === 'due');
    const mappedInstallments = dueInstallments.map((inst: any) => ({
      ...inst,
      isDynamic: false // Mark existing installments as non-dynamic
    }));
    
    setDynamicInstallments(mappedInstallments);
    setNextInstallmentNumber(dueInstallments.length + 1);
    
    // Set initial form values for existing installments
    mappedInstallments.forEach((inst) => {
      const fieldName = `installmentAmount${inst.installmentId}`;
      installmentHandler.setValue(fieldName, inst.duePayment?.toString() || "0");
    });
    
    console.log('Initialized dynamic installments:', {
      dueInstallments: mappedInstallments.length,
      mappedInstallments
    });
  }, [installmentDetails]);


  // Get total due amount including paid installments and coupon discount (PaymentDetailsScreen style)
  const getTotalDueAmount = () => {
    const paidInstallments = installmentDetails.filter((inst: any) => inst.paymentStatus?.toLowerCase() === 'paid');
    const totalPaidAmount = paidInstallments.reduce((sum: number, inst: any) => sum + (inst.receivedPayment || inst.duePayment || 0), 0);
    
    // Use paymentAfterDiscount as base amount (same as PaymentDetailsScreen logic)
    const baseAmount = selectedCoupon ? paymentAfterDiscount : (paymentDetails?.totalDuePayment || 0);
    
    // Total due amount = Base amount (after coupon) - Total paid amount
    const totalDueAmount = Math.max(0, baseAmount - totalPaidAmount);
    
    console.log('Total due calculation with coupon (PaymentDetailsScreen style):', {
      totalDuePayment: paymentDetails?.totalDuePayment,
      paymentAfterDiscount,
      selectedCoupon: selectedCoupon?.couponName,
      discountAmount,
      baseAmount,
      totalPaidAmount,
      totalDueAmount,
      paidInstallments: paidInstallments.length
    });
    
    return totalDueAmount;
  };

  // Add new installment
  const handleAddInstallment = () => {
    const newInstallment = {
      installmentId: `dynamic-${Date.now()}`,
      installmentNumber: nextInstallmentNumber,
      paymentStatus: 'due',
      duePayment: 0, // Will be calculated automatically
      nextpaymentDate: new Date().toLocaleDateString("en-GB"),
      paymentNotes: '',
      isDynamic: true
    };
    
    // Add new installment to the list
    const updatedInstallments = [...dynamicInstallments, newInstallment];
    setDynamicInstallments(updatedInstallments);
    setNextInstallmentNumber(prev => prev + 1);
    
    // Recalculate all amounts after adding new installment (PaymentDetailsScreen style)
    setTimeout(() => {
      // Use paymentAfterDiscount as base amount (same as PaymentDetailsScreen logic)
      const baseAmount = selectedCoupon ? paymentAfterDiscount : (paymentDetails?.totalDuePayment || 0);
      const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(baseAmount, updatedInstallments.length);
      
      const finalInstallments = updatedInstallments.map((inst, index) => ({
        ...inst,
        duePayment: installmentAmounts[index] || inst.duePayment
      }));
      
      setDynamicInstallments(finalInstallments);
      
      // Update form values for all installments
      finalInstallments.forEach((inst) => {
        const fieldName = `installmentAmount${inst.installmentId}`;
        installmentHandler.setValue(fieldName, inst.duePayment?.toString() || "0");
      });
      
      console.log('Added new installment and recalculated (PaymentDetailsScreen style):', {
        newInstallment,
        baseAmount,
        equalAmount,
        remainder,
        installmentAmounts,
        totalInstallments: updatedInstallments.length,
        selectedCoupon: selectedCoupon?.couponName,
        paymentAfterDiscount,
        finalInstallments
      });
    }, 0);
  };

  // Remove installment
  const handleRemoveInstallment = (installmentId: string) => {
    // Prevent removing if only one installment remains
    if (dynamicInstallments.length <= 1) {
      Alert.alert(
        "Cannot Remove",
        "At least one installment must remain.",
        [{ text: "OK" }]
      );
      return;
    }
    
    // Remove installment from the list
    const remainingInstallments = dynamicInstallments.filter(inst => inst.installmentId !== installmentId);
    setDynamicInstallments(remainingInstallments);
    
    // Clear form value for removed installment
    installmentHandler.unregister(`installmentAmount${installmentId}`);
    
    // Recalculate all amounts after removing installment (PaymentDetailsScreen style)
    setTimeout(() => {
      // Use paymentAfterDiscount as base amount (same as PaymentDetailsScreen logic)
      const baseAmount = selectedCoupon ? paymentAfterDiscount : (paymentDetails?.totalDuePayment || 0);
      const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(baseAmount, remainingInstallments.length);
      
      const updatedInstallments = remainingInstallments.map((inst, index) => ({
        ...inst,
        duePayment: installmentAmounts[index] || inst.duePayment
      }));
      
      setDynamicInstallments(updatedInstallments);
      
      // Update form values for all remaining installments
      updatedInstallments.forEach((inst) => {
        const fieldName = `installmentAmount${inst.installmentId}`;
        installmentHandler.setValue(fieldName, inst.duePayment?.toString() || "0");
      });
      
      console.log('Removed installment and recalculated (PaymentDetailsScreen style):', {
        removedInstallmentId: installmentId,
        baseAmount,
        equalAmount,
        remainder,
        installmentAmounts,
        remainingInstallments: updatedInstallments.length,
        selectedCoupon: selectedCoupon?.couponName,
        paymentAfterDiscount,
        updatedInstallments
      });
    }, 0);
  };

  // Update installment amount
  const handleUpdateInstallmentAmount = (installmentId: string, newAmount: number) => {
    setDynamicInstallments(prev => prev.map(inst => 
      inst.installmentId === installmentId 
        ? { ...inst, duePayment: newAmount }
        : inst
    ));
  };

  // Validate total amount
  const validateTotalAmount = () => {
    const totalCalculated = dynamicInstallments.reduce((sum, inst) => sum + (inst.duePayment || 0), 0);
    const expectedTotal = paymentAfterDiscount;
    const difference = Math.abs(totalCalculated - expectedTotal);
    
    console.log('Amount validation:', {
      totalCalculated,
      expectedTotal,
      difference,
      isValid: difference <= 1 // Allow 1 rupee difference due to rounding
    });
    
    return difference <= 1;
  };

  // Helper function to calculate and distribute installment amounts evenly (same as PaymentDetailsScreen)
  const calculateAndDistributeInstallments = (baseAmount: number, numberOfInstallments: number) => {
    const equalAmount = Math.floor(baseAmount / numberOfInstallments);
    const remainder = baseAmount % numberOfInstallments;
    
    const installmentAmounts: number[] = [];
    for (let i = 1; i <= numberOfInstallments; i++) {
      const installmentAmount = equalAmount + (i <= remainder ? 1 : 0);
      installmentAmounts.push(installmentAmount);
    }
    
    return {
      equalAmount,
      remainder,
      installmentAmounts
    };
  };

  // Function to recalculate all installment amounts
  const recalculateInstallmentAmounts = () => {
    if (dynamicInstallments.length > 0) {
      // Use paymentAfterDiscount as base amount (same as PaymentDetailsScreen logic)
      const baseAmount = selectedCoupon ? paymentAfterDiscount : (paymentDetails?.totalDuePayment || 0);
      const { equalAmount, remainder, installmentAmounts } = calculateAndDistributeInstallments(baseAmount, dynamicInstallments.length);
      
      const updatedInstallments = dynamicInstallments.map((inst, index) => ({
        ...inst,
        duePayment: installmentAmounts[index] || inst.duePayment
      }));
      
      setDynamicInstallments(updatedInstallments);
      
      // Update form values for the new amounts
      updatedInstallments.forEach((inst) => {
        const fieldName = `installmentAmount${inst.installmentId}`;
        installmentHandler.setValue(fieldName, inst.duePayment?.toString() || "0");
      });
      
      console.log('Recalculated amounts (PaymentDetailsScreen style):', {
        baseAmount,
        numberOfInstallments: dynamicInstallments.length,
        equalAmount,
        remainder,
        installmentAmounts,
        selectedCoupon: selectedCoupon?.couponName,
        discountAmount,
        paymentAfterDiscount,
        updatedInstallments
      });
      
      return updatedInstallments;
    }
    return dynamicInstallments;
  };

  // Recalculate all amounts when payment after discount or coupon changes
  useMemo(() => {
    recalculateInstallmentAmounts();
  }, [paymentAfterDiscount, installmentDetails, selectedCoupon, discountAmount]); // Add coupon dependencies


  // Monitor dynamicInstallments changes for debugging
  useEffect(() => {
    console.log('Dynamic installments updated:', dynamicInstallments);
  }, [dynamicInstallments]);

  // Trigger recalculation when installment count changes
  useEffect(() => {
    if (dynamicInstallments.length > 0) {
      // Small delay to ensure state is updated
      const timer = setTimeout(() => {
        recalculateInstallmentAmounts();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [dynamicInstallments.length]);

  const handleEditInstallment = (installment: any) => {
    setSelectedInstallment(installment);
    setPaymentStatus(installment.paymentStatus || "paid");
    
    // Safely parse the payment date
    let initialDate = new Date();
    try {
      if (installment.paymentReceiveDate) {
        // Handle different date formats
        if (installment.paymentReceiveDate.includes('-')) {
          const [day, month, year] = installment.paymentReceiveDate.split('-');
          initialDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else if (installment.paymentReceiveDate.includes('/')) {
          const [day, month, year] = installment.paymentReceiveDate.split('/');
          initialDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          initialDate = new Date(installment.paymentReceiveDate);
        }
        
        // Validate the date
        if (isNaN(initialDate.getTime())) {
          initialDate = new Date();
        }
      }
    } catch (error) {
      console.log('Date parsing error in handleEditInstallment:', error);
      initialDate = new Date();
    }
    
    setPaymentDate(initialDate);
    setModalVisible(true);
  };

  const handleSavePayment = async () => {
    if (!selectedInstallment || !authUser || !selectedOrganization) {
      Alert.alert("Error", "Required data is missing");
      return;
    }

    setIsUpdating(true);
    
    try {
      const payload = {
        user: {
          userCustomerId: authUser.customerId,
          userCustomerName: authUser.customerName,
          userCustomerEmail: authUser.customerEmail,
          roleName: selectedOrganization.role?.roleName || authUser.userType,
          roleId: selectedOrganization.role?.roleId || authUser.employeeId,
          userEmployeeId: authUser.employeeId
        },
        customerId: selectedOrganization.customerId,
        organizationId: selectedOrganization.organizationId,
        rollNo: studentRollNo,
        courseId: course.courseId,
        updatedPaymentStatus: paymentStatus,
        updatedDate: paymentDate.toLocaleDateString("en-GB").split("/").reverse().join("-"),
        installmentNumber: selectedInstallment.installmentNumber
      };

      console.log("Updating payment status with payload:", payload);

      const response = await request({
        method: "POST",
        url: "/student-fnp-prod/updateStudentPaymentStatus",
        data: payload
      });

      console.log("Payment status update response:", response);

      if (response.statusCode === 200) {
        Alert.alert("Success", "Payment status updated successfully!", [
          {
            text: "OK",
            onPress: () => {
              setModalVisible(false);
              setSelectedInstallment(null);
              // Refresh student data
              // You might want to refetch the student details here
            }
          }
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      Alert.alert("Error", "Failed to update payment status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedInstallment(null);
  };

  const handleDownloadInvoice = (installmentId: string) => {
    console.log("Download invoice:", installmentId);
    Alert.alert("Download Invoice", "Download functionality will be implemented soon");
  };

  const handleViewInvoice = (installmentId: string) => {
    console.log("View invoice:", installmentId);
    Alert.alert("View Invoice", "View functionality will be implemented soon");
  };

  const handleReminderMenu = (installmentId: string) => {
    setShowReminderMenu(showReminderMenu === installmentId ? null : installmentId);
  };

  const handleReminderAction = (action: string, installmentId: string) => {
    console.log(`${action} reminder for installment:`, installmentId);
    Alert.alert(`${action} Reminder`, `${action} reminder functionality will be implemented soon`);
    setShowReminderMenu(null);
  };

  const handleSubmitPayment = async () => {
    if (!authUser || !selectedOrganization) {
      Alert.alert("Error", "Required data is missing");
      return;
    }

    // Validate required fields
    if (!isPayingFirstInstallment) {
      Alert.alert("Error", "Please select if you are paying first installment");
      return;
    }

    // Validate payment mode fields if paying first installment
    if (isPayingFirstInstallment === 'paid') {
      const firstInstallment = dynamicInstallments[0];
      if (!firstInstallment?.paymentMode) {
        Alert.alert("Error", "Please select payment mode for first installment");
        return;
      }
      
      if (firstInstallment.paymentMode === 'cash' && !firstInstallment.paymentRecieverId) {
        Alert.alert("Error", "Please select payment received by for cash payment");
        return;
      }
      
      if (firstInstallment.paymentMode === 'online' && !firstInstallment.transactionId) {
        Alert.alert("Error", "Please enter transaction ID for online payment");
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      // Prepare installment details
      const installmentDetails = dynamicInstallments.map((inst, index) => {
        const installmentData: any = {
          installmentNumber: inst.installmentNumber || index + 1,
          paymentStatus: isPayingFirstInstallment === 'paid' && index === 0 ? 'paid' : 'due',
          installmentId: inst.installmentId,
          paymentNotes: inst.paymentNotes || '',
          paymentMode: inst.paymentMode || '',
          transactionId: inst.transactionId || '',
          paymentRecieverId: inst.paymentRecieverId || ''
        };

        // Add payment date and amount based on status
        if (installmentData.paymentStatus === 'paid') {
          installmentData.paymentReceiveDate = inst.nextpaymentDate || new Date().toLocaleDateString("en-GB");
          installmentData.receivedPayment = inst.duePayment || 0;
        } else {
          installmentData.nextpaymentDate = inst.nextpaymentDate || new Date().toLocaleDateString("en-GB");
          installmentData.duePayment = inst.duePayment || 0;
        }

        return installmentData;
      });

      // Determine course payment status
      const coursePaymentStatus = dynamicInstallments.every(inst => 
        isPayingFirstInstallment === 'paid' && dynamicInstallments.indexOf(inst) === 0 ? true : false
      ) ? 'paid' : 'due';

      const payload = {
        user: {
          userCustomerId: authUser.customerId,
          userCustomerName: authUser.customerName,
          userCustomerEmail: authUser.customerEmail,
          roleName: selectedOrganization.role?.roleName || authUser.userType,
          roleId: selectedOrganization.role?.roleId || authUser.employeeId,
          userEmployeeId: authUser.employeeId
        },
        customerId: selectedOrganization.customerId,
        organizationId: selectedOrganization.organizationId,
        rollNo: studentRollNo,
        courseId: course.courseId,
        paymentDetails: {
          isPartPayment: dynamicInstallments.length > 1,
          coursePaymentStatus: coursePaymentStatus,
          installmentDetails: installmentDetails
        },
        ...(selectedCoupon && {
          coupon: {
            couponId: selectedCoupon.couponId,
            discount: discountAmount
          }
        })
      };

      console.log("Submitting payment details with payload:", JSON.stringify(payload, null, 2));

      const response = await request({
        method: "POST",
        url: "/student-fnp-prod/updateStudentPaymentDetails",
        data: payload
      });

      console.log("Payment details update response:", response);

      if (response.statusCode === 200) {
        // Refresh student data to get updated payment information
        console.log("🔄 Refreshing student data after successful payment update");
        await refetchStudentData();
        
        Alert.alert("Success", "Payment details updated successfully!", [
          {
            text: "OK",
            onPress: () => {
              // Navigate back after data refresh
              navigation.goBack();
            }
          }
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to update payment details");
      }
    } catch (error) {
      console.error("Error updating payment details:", error);
      Alert.alert("Error", "Failed to update payment details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return { backgroundColor: "#ECFFE0", color: "#4AC400" };
      case "due":
        return { backgroundColor: "#FFE6E6", color: "#FF4444" };
      case "pending":
        return { backgroundColor: "#FFF3E0", color: "#FF9800" };
      default:
        return { backgroundColor: "#F5F5F5", color: "#666666" };
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹ ${amount?.toLocaleString() || "0"}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date";
    
    console.log('Formatting date:', dateString);
    
    try {
      // Handle DD/MM/YYYY format
      if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        console.log('Parsed DD/MM/YYYY format:', { day, month, year });
        return `${day}/${month}/${year}`;
      }
      
      // Handle DD-MM-YYYY format
      if (dateString.includes('-')) {
        const [day, month, year] = dateString.split('-');
        console.log('Parsed DD-MM-YYYY format:', { day, month, year });
        return `${day}/${month}/${year}`;
      }
      
      // Handle standard date format
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        console.log('Parsed as standard date:', date);
        return date.toLocaleDateString("en-GB");
      }
      
      console.log('Invalid date:', dateString);
      return "Invalid date";
    } catch (error) {
      console.log('Date formatting error:', error);
      return "Error";
    }
  };

  return (
    <SafeView>
      <AppHeader
        showDrawer={false}
        title="Payment History"
        handleBackClick={() => navigation.goBack()}
      />
      
      <ThemeScrollView 
        paddingHorizontal={10}
        loading={courseLoading || studentLoading}
      >
        <Flex mt={20} flexDirection="column">
          {/* Tab Container */}
          <Flex styles={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "installment" ? styles.activeTab : styles.inactiveTab]}
              onPress={() => setActiveTab("installment")}
            >
              <ScalableText style={activeTab === "installment" ? styles.activeTabText : styles.inactiveTabText} fontFamily="Medium">
                INSTALLMENT VIEW
              </ScalableText>
            </TouchableOpacity>
            {paymentDetails?.coursePaymentStatus === "due" && (
              <TouchableOpacity
                style={[styles.tab, activeTab === "payment" ? styles.activeTab : styles.inactiveTab]}
                onPress={() => setActiveTab("payment")}
              >
                <ScalableText style={activeTab === "payment" ? styles.activeTabText : styles.inactiveTabText} fontFamily="Medium">
                  INSTALLMENT UPDATE
                </ScalableText>
              </TouchableOpacity>
            )}
          </Flex>

          {/* Section Title */}
          <Flex mt={20} align="flex-start">
            <ScalableText style={styles.sectionTitle} fontFamily="Bold">
              {activeTab === "installment" ? "Installment Details" : "Update Installments"}
            </ScalableText>
          </Flex>

         

          {/* Conditional Content Based on Active Tab */}
          {activeTab === "installment" ? (
            // Installment Details Table - Original UI
            <Flex mt={15}>
              <Grid>
                <Row style={styles.headerRow}>
                  <Col size={8}>
                    <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                      NO.
                    </ScalableText>
                  </Col>
                  <Col size={18}>
                    <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                      DATE
                    </ScalableText>
                  </Col>
                  <Col size={22}>
                    <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                      AMOUNT
                    </ScalableText>
                  </Col>
                  <Col size={18}>
                    <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                      STATUS
                    </ScalableText>
                  </Col>
                  <Col size={8}>
                    <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                      INVOICE
                    </ScalableText>
                  </Col>
                  <Col size={8}>
                    <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                      REMINDER
                    </ScalableText>
                  </Col>
                  <Col size={8}>
                    <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                      EDIT
                    </ScalableText>
                  </Col>
                  <Col size={10}>
                    <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                      DOWNLOAD
                    </ScalableText>
                  </Col>
                </Row>
                
                {/* Dynamic Table Data */}
                {installmentDetails.length > 0 ? (
                  installmentDetails.map((installment: any, index: number) => {
                    console.log("Rendering installment:", installment);
                    console.log("Installment payment status:", installment.paymentStatus);
                    console.log("Available date fields:", {
                      nextpaymentDate: installment.nextpaymentDate,
                      formatedNextpaymentDate: installment.formatedNextpaymentDate,
                      paymentReceiveDate: installment.paymentReceiveDate,
                      paymentDate: installment.paymentDate,
                      receivedDate: installment.receivedDate,
                      paidDate: installment.paidDate
                    });
                    
                    const statusStyle = getStatusColor(installment.paymentStatus);
                    return (
                      <Row key={installment.installmentId} style={styles.dataRow}>
                        <Col size={8}>
                          <ScalableText style={styles.dataText} fontFamily="Regular">
                            {installment.installmentNumber}
                          </ScalableText>
                        </Col>
                        <Col size={18}>
                          <ScalableText style={styles.dataText} fontFamily="Regular">
                            {(() => {
                              // For paid installments, show payment received date
                              if (installment.paymentStatus?.toLowerCase() === 'paid') {
                                return formatDate(installment.paymentReceiveDate || installment.paidDate || installment.receivedDate || installment.paymentDate);
                              }
                              // For due installments, show next payment date
                              else if (installment.paymentStatus?.toLowerCase() === 'due') {
                                return formatDate(installment.nextpaymentDate || installment.formatedNextpaymentDate);
                              }
                              // Fallback for other statuses
                              else {
                                return formatDate(installment.paymentReceiveDate || installment.paidDate || installment.receivedDate || installment.paymentDate || installment.nextpaymentDate || installment.formatedNextpaymentDate);
                              }
                            })()}
                          </ScalableText>
                        </Col>
                        <Col size={22}>
                          <ScalableText style={styles.dataText} fontFamily="Regular">
                            {formatCurrency(installment.receivedPayment || installment.duePayment)}
                          </ScalableText>
                        </Col>
                        <Col size={18}>
                          <Flex
                            styles={{
                              ...styles.statusChip,
                              backgroundColor: statusStyle.backgroundColor,
                            }}
                          >
                            <ScalableText
                              style={{
                                ...styles.statusChipText,
                                color: statusStyle.color,
                              }}
                              fontFamily="Medium"
                            >
                              {installment.paymentStatus?.toUpperCase()}
                            </ScalableText>
                          </Flex>
                        </Col>
                        <Col size={8}>
                          <Flex flexDirection="row" justify="center" align="center">
                            <TouchableOpacity onPress={() => handleViewInvoice(installment.installmentId)}>
                              <AutoHeightImage source={IMAGES.fileSearchIcon} width={16} />
                            </TouchableOpacity>
                          </Flex>
                        </Col>
                        <Col size={8}>
                          <Flex flexDirection="row" justify="center" align="center" styles={{ position: 'relative' }}>
                            <TouchableOpacity 
                              onPress={() => handleReminderMenu(installment.installmentId)}
                              style={styles.reminderButton}
                            >
                              <AutoHeightImage source={IMAGES.mailIconGray} width={16} />
                            </TouchableOpacity>
                            
                            {/* Reminder Menu */}
                            {showReminderMenu === installment.installmentId && (
                              <TouchableWithoutFeedback onPress={() => setShowReminderMenu(null)}>
                                <View style={styles.reminderMenu}>
                                  <TouchableOpacity 
                                    style={styles.reminderMenuItem}
                                    onPress={() => handleReminderAction('WhatsApp', installment.installmentId)}
                                  >
                                    <ScalableText style={styles.reminderMenuText} fontFamily="Medium">
                                      WhatsApp
                                    </ScalableText>
                                  </TouchableOpacity>
                                  <TouchableOpacity 
                                    style={styles.reminderMenuItem}
                                    onPress={() => handleReminderAction('Email', installment.installmentId)}
                                  >
                                    <ScalableText style={styles.reminderMenuText} fontFamily="Medium">
                                      Email
                                    </ScalableText>
                                  </TouchableOpacity>
                                  <TouchableOpacity 
                                    style={styles.reminderMenuItem}
                                    onPress={() => handleReminderAction('SMS', installment.installmentId)}
                                  >
                                    <ScalableText style={styles.reminderMenuText} fontFamily="Medium">
                                      SMS
                                    </ScalableText>
                                  </TouchableOpacity>
                                </View>
                              </TouchableWithoutFeedback>
                            )}
                          </Flex>
                        </Col>
                        <Col size={8}>
                          <Flex flexDirection="row" justify="center" align="center">
                            <TouchableOpacity onPress={() => handleEditInstallment(installment)}>
                              <AutoHeightImage source={IMAGES.editIcon} width={16} />
                            </TouchableOpacity>
                          </Flex>
                        </Col>
                        <Col size={10}>
                          <Flex flexDirection="row" justify="center" align="center">
                            <TouchableOpacity onPress={() => handleDownloadInvoice(installment.installmentId)}>
                              <AutoHeightImage source={IMAGES.downloadIcon} width={16} />
                            </TouchableOpacity>
                          </Flex>
                        </Col>
                      </Row>
                    );
                  })
                ) : (
                  <Row style={styles.dataRow}>
                    <Col size={100}>
                      <ScalableText style={styles.noDataText} fontFamily="Medium">
                        No installment details available
                      </ScalableText>
                    </Col>
                  </Row>
                )}
              </Grid>
            </Flex>
          ) : (
            // Update Installments Form - Matching PaymentDetailsScreen UI
            <Flex mt={15}>
              <View style={styles.updateFormContainer}>
                {/* Summary Section */}
                <View style={styles.formField}>
                  <ScalableText style={styles.formLabel} fontFamily="Medium">
                    Payment Summary
                  </ScalableText>
                  
                  <View style={styles.inputSpacing}>
                    <ScalableText style={styles.inputLabel} fontFamily="Medium">
                      Total Payment Amount
                    </ScalableText>
                    <View style={styles.inputContainer}>
                      <ScalableText style={styles.inputValue} fontFamily="Regular">
                        {formatCurrency(paymentDetails?.totalPayment || 0)}
                      </ScalableText>
                    </View>
                  </View>

                  <View style={styles.inputSpacing}>
                    <ScalableText style={styles.inputLabel} fontFamily="Medium">
                      Total Received Amount
                    </ScalableText>
                    <View style={styles.inputContainer}>
                      <ScalableText style={styles.inputValue} fontFamily="Regular">
                        {formatCurrency(paymentDetails?.totalReceivedPayment || 0)}
                      </ScalableText>
                    </View>
                  </View>

                  <View style={styles.inputSpacing}>
                    <ScalableText style={styles.inputLabel} fontFamily="Medium">
                      Total Due Amount
                    </ScalableText>
                    <View style={styles.inputContainer}>
                      <ScalableText style={styles.inputValue} fontFamily="Regular">
                        {formatCurrency(paymentDetails?.totalDuePayment || 0)}
                      </ScalableText>
                    </View>
                  </View>
                </View>

                {/* Paid Installments Section */}
                {installmentDetails.filter((inst: any) => inst.paymentStatus?.toLowerCase() === 'paid').length > 0 && (
                  <View style={styles.formField}>
                    <ScalableText style={styles.formLabel} fontFamily="Medium">
                      Paid Installments
                    </ScalableText>
                    {installmentDetails
                      .filter((inst: any) => inst.paymentStatus?.toLowerCase() === 'paid')
                      .map((paidInst: any, index: number) => (
                        <View key={`paid-${paidInst.installmentId}`} style={styles.installmentContainer}>
                          <ScalableText style={styles.installmentTitle} fontFamily="Medium">
                            Paid Installment {paidInst.installmentNumber}
                          </ScalableText>
                          
                          <View style={styles.inputSpacing}>
                            <ScalableText style={styles.inputLabel} fontFamily="Medium">
                              Payment Date
                            </ScalableText>
                            <View style={styles.inputContainer}>
                              <ScalableText style={styles.inputValue} fontFamily="Regular">
                                {formatDate(paidInst.paymentReceiveDate || paidInst.paidDate || paidInst.receivedDate || paidInst.paymentDate)}
                              </ScalableText>
                            </View>
                          </View>

                          <View style={styles.inputSpacing}>
                            <ScalableText style={styles.inputLabel} fontFamily="Medium">
                              Amount Paid
                            </ScalableText>
                            <View style={styles.inputContainer}>
                              <ScalableText style={styles.inputValue} fontFamily="Regular">
                                {formatCurrency(paidInst.receivedPayment || paidInst.duePayment)}
                              </ScalableText>
                            </View>
                          </View>

                          <View style={styles.inputSpacing}>
                            <ScalableText style={styles.inputLabel} fontFamily="Medium">
                              Description
                            </ScalableText>
                            <View style={styles.inputContainer}>
                              <ScalableText style={styles.inputValue} fontFamily="Regular">
                                {paidInst.paymentNotes || "No description"}
                              </ScalableText>
                            </View>
                          </View>

                          {/* PAID Status Badge */}
                          <View style={styles.paidStatusBadge}>
                            <ScalableText style={styles.paidStatusText} fontFamily="Bold">
                              PAID
                            </ScalableText>
                          </View>
                        </View>
                      ))}
                  </View>
                )}

                {/* Apply Coupon Section */}
                <View style={styles.formField}>
                  <ScalableText style={styles.inputLabel} fontFamily="Medium">
                    Apply Coupon
                  </ScalableText>
                  <View style={styles.couponContainer}>
                    {/* Show selected coupon in input field */}
                    {selectedCoupon ? (
                      <View style={styles.selectedCouponContainer}>
                        <View style={styles.selectedCouponInfo}>
                          <ScalableText style={styles.selectedCouponName} fontFamily="Medium">
                            {selectedCoupon.couponName} - {selectedCoupon.couponType === 'flat' ? '₹' : '%'}{selectedCoupon.discountValue}
                          </ScalableText>
                        </View>
                        <TouchableOpacity 
                          style={styles.removeCouponButton}
                          onPress={() => {
                            setSelectedCoupon(null);
                            
                            // Force refresh installment amounts when coupon is removed
                            setTimeout(() => {
                              console.log('🔄 Coupon removed - forcing installment amount refresh');
                              recalculateInstallmentAmounts();
                            }, 100);
                          }}
                        >
                          <ScalableText style={styles.removeCouponText} fontFamily="Bold">×</ScalableText>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      /* Show dropdown when no coupon is selected */
                      <SelectDropdown
                        label="Select coupon"
                        onChange={(value) => handleCouponSelection(value)}
                        options={couponsLoading ? [{ label: 'Loading...', value: '' }] : availableCoupons}
                        value={availableCoupons.find((opt: CouponOption) => opt.value === (selectedCoupon?.couponId || ''))}
                        dropdownButtonStyle={styles.couponDropdownStyle}
                      />
                    )}
                    <TouchableOpacity style={styles.addButton} onPress={handleAddCoupon}>
                      <ScalableText style={styles.addButtonText} fontFamily="Bold">+</ScalableText>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Discount Amount */}
                <View style={styles.formField}>
                  <ScalableText style={styles.inputLabel} fontFamily="Medium">
                    Discount Amount
                  </ScalableText>
                  <View style={styles.inputContainer}>
                    <ScalableText style={styles.inputValue} fontFamily="Regular">
                      {formatCurrency(discountAmount)}
                    </ScalableText>
                  </View>
                </View>

                {/* Discounted Payment Amount */}
                <View style={styles.formField}>
                  <ScalableText style={styles.inputLabel} fontFamily="Medium">
                    Payment After Discount
                  </ScalableText>
                  <View style={styles.inputContainer}>
                    <ScalableText style={styles.inputValue} fontFamily="Regular">
                      {formatCurrency(paymentAfterDiscount)}
                    </ScalableText>
                  </View>
                </View>

                {/* First Installment Question */}
                <View style={styles.formField}>
                  <ScalableText style={styles.inputLabel} fontFamily="Medium">
                    Are you paying first installment right now? *
                  </ScalableText>
                  <SelectDropdown
                    label="Select option"
                    onChange={(value) => setIsPayingFirstInstallment(value)}
                    options={[
                      { label: 'Paid', value: 'paid' },
                      { label: 'Due', value: 'due' }
                    ]}
                    value={isPayingFirstInstallment ? { label: isPayingFirstInstallment === 'paid' ? 'Paid' : 'Due', value: isPayingFirstInstallment } : undefined}
                    dropdownButtonStyle={styles.couponDropdownStyle}
                  />
                </View>

                {/* Payment Mode Fields - Only show if paying first installment */}
                {isPayingFirstInstallment === 'paid' && dynamicInstallments.length > 0 && (
                  <View style={styles.formField}>
                    <ScalableText style={styles.inputLabel} fontFamily="Medium">
                      Mode of Payment for Paid Installment *
                    </ScalableText>
                    
                    {/* Payment Mode Selection */}
                    <View style={styles.paymentModeContainer}>
                      <TouchableOpacity
                        style={[
                          styles.paymentModeButton,
                          dynamicInstallments[0]?.paymentMode === 'cash' && styles.paymentModeButtonActive
                        ]}
                        onPress={() => {
                          const updatedInstallments = dynamicInstallments.map((inst, index) => 
                            index === 0 ? { ...inst, paymentMode: 'cash' } : inst
                          );
                          setDynamicInstallments(updatedInstallments);
                        }}
                      >
                        <ScalableText style={[
                          styles.paymentModeButtonText,
                          dynamicInstallments[0]?.paymentMode === 'cash' && styles.paymentModeButtonTextActive
                        ]} fontFamily="Medium">
                          Cash
                        </ScalableText>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[
                          styles.paymentModeButton,
                          dynamicInstallments[0]?.paymentMode === 'online' && styles.paymentModeButtonActive
                        ]}
                        onPress={() => {
                          const updatedInstallments = dynamicInstallments.map((inst, index) => 
                            index === 0 ? { ...inst, paymentMode: 'online' } : inst
                          );
                          setDynamicInstallments(updatedInstallments);
                        }}
                      >
                        <ScalableText style={[
                          styles.paymentModeButtonText,
                          dynamicInstallments[0]?.paymentMode === 'online' && styles.paymentModeButtonTextActive
                        ]} fontFamily="Medium">
                          Online
                        </ScalableText>
                      </TouchableOpacity>
                    </View>

                    {/* Payment Received By - Only show for cash mode */}
                    {dynamicInstallments[0]?.paymentMode === 'cash' && (
                      <View style={styles.inputSpacing}>
                        <ScalableText style={styles.inputLabel} fontFamily="Medium">
                          Payment Received By *
                        </ScalableText>
                        <SelectDropdown
                          label="Select employee"
                          onChange={(value) => {
                            const updatedInstallments = dynamicInstallments.map((inst, index) => 
                              index === 0 ? { ...inst, paymentRecieverId: value } : inst
                            );
                            setDynamicInstallments(updatedInstallments);
                          }}
                          options={employeesLoading ? [{ label: 'Loading employees...', value: '' }] : availableEmployees}
                          value={availableEmployees.find(emp => emp.value === dynamicInstallments[0]?.paymentRecieverId)}
                          dropdownButtonStyle={styles.couponDropdownStyle}
                        />
                      </View>
                    )}

                    {/* Transaction ID - Only show for online mode */}
                    {dynamicInstallments[0]?.paymentMode === 'online' && (
                      <View style={styles.inputSpacing}>
                        <ScalableText style={styles.inputLabel} fontFamily="Medium">
                          Transaction ID *
                        </ScalableText>
                        <Input
                          handler={installmentHandler}
                          name={`transactionId${dynamicInstallments[0]?.installmentId}`}
                          label=""
                          containerStyles={styles.inputContainer}
                          placeholder="Enter transaction ID"
                          value={dynamicInstallments[0]?.transactionId || ''}
                          onChangeText={(text) => {
                            const updatedInstallments = dynamicInstallments.map((inst, index) => 
                              index === 0 ? { ...inst, transactionId: text } : inst
                            );
                            setDynamicInstallments(updatedInstallments);
                          }}
                        />
                      </View>
                    )}
                  </View>
                )}

                {/* Due Installments Section */}
                <View style={styles.formField}>
                  <ScalableText style={styles.formLabel} fontFamily="Medium">
                    Due Installments
                  </ScalableText>
                  
                  {dynamicInstallments.map((dueInst: any, index: number) => (
                    <View key={`due-${dueInst.installmentId}`} style={styles.installmentContainer}>
                      <View style={styles.installmentHeader}>
                        <ScalableText style={styles.installmentTitle} fontFamily="Medium">
                          Due Installment
                        </ScalableText>
                        <TouchableOpacity
                          style={styles.removeInstallmentButton}
                          onPress={() => handleRemoveInstallment(dueInst.installmentId)}
                        >
                          <ScalableText style={styles.removeButtonText} fontFamily="Bold">−</ScalableText>
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.inputSpacing}>
                        <ScalableText style={styles.inputLabel} fontFamily="Medium">
                          Due Date *
                        </ScalableText>
                        <View style={styles.inputContainer}>
                          <DateInput
                            handler={dateHandler}
                            name={`installmentDate${dueInst.installmentId}`}
                            label="Select due date"
                            inputRoot={styles.dateInputStyle}
                            defaultValue={dueInst.nextpaymentDate || dueInst.formatedNextpaymentDate}
                          />
                        </View>
                      </View>

                      <View style={styles.inputSpacing}>
                        <ScalableText style={styles.inputLabel} fontFamily="Medium">
                          Due Amount *
                        </ScalableText>
                        <Input
                          handler={installmentHandler}
                          name={`installmentAmount${dueInst.installmentId}`}
                          label=""
                          keyboardType="numeric"
                          containerStyles={styles.inputContainer}
                          placeholder="Enter amount"
                          value={dueInst.duePayment?.toString() || "0"}
                          onChangeText={(text) => {
                            // Update the installment amount in state
                            const newAmount = parseFloat(text) || 0;
                            const updatedInstallments = dynamicInstallments.map(inst => 
                              inst.installmentId === dueInst.installmentId 
                                ? { ...inst, duePayment: newAmount }
                                : inst
                            );
                            setDynamicInstallments(updatedInstallments);
                            
                            console.log('🎯 Updated installment state:', {
                              updatedInstallments,
                              currentInstallmentId: dueInst.installmentId,
                              newAmount
                            });
                            
                            // Auto-adjust remaining installments to maintain total
                            // Use paymentAfterDiscount as base amount (same as PaymentDetailsScreen logic)
                            const baseAmount = selectedCoupon ? paymentAfterDiscount : (paymentDetails?.totalDuePayment || 0);
                            const remainingAmount = baseAmount - newAmount;
                            const remainingInstallments = dynamicInstallments.length - 1;
                            
                            console.log('🎯 Auto-adjusting remaining installments:', {
                              newAmount,
                              baseAmount,
                              remainingAmount,
                              remainingInstallments,
                              currentInstallmentId: dueInst.installmentId,
                              selectedCoupon: selectedCoupon?.couponName,
                              paymentAfterDiscount
                            });
                            
                            if (remainingInstallments > 0 && remainingAmount >= 0) {
                              // Distribute remaining amount equally among remaining installments
                              const equalAmount = Math.floor(remainingAmount / remainingInstallments);
                              const remainder = remainingAmount % remainingInstallments;
                              
                              let currentIndex = 1;
                              const finalUpdatedInstallments = updatedInstallments.map(inst => {
                                if (inst.installmentId !== dueInst.installmentId) {
                                  const installmentAmount = equalAmount + (currentIndex <= remainder ? 1 : 0);
                                  currentIndex++;
                                  console.log(`🎯 Auto-adjusted installment ${inst.installmentId} to: ${installmentAmount}`);
                                  return { ...inst, duePayment: installmentAmount };
                                }
                                return inst;
                              });
                              
                              setDynamicInstallments(finalUpdatedInstallments);
                              
                              console.log('🎯 Final updated installments after auto-adjustment:', finalUpdatedInstallments);
                              
                              // Update form values for all installments
                              finalUpdatedInstallments.forEach((inst) => {
                                const fieldName = `installmentAmount${inst.installmentId}`;
                                installmentHandler.setValue(fieldName, inst.duePayment?.toString() || "0");
                              });
                            }
                          }}
                        />
                      </View>

                      <View style={styles.inputSpacing}>
                        <ScalableText style={styles.inputLabel} fontFamily="Medium">
                          Description
                        </ScalableText>
                        <Input
                          handler={installmentHandler}
                          name={`installmentDescription${dueInst.installmentId}`}
                          label=""
                          containerStyles={styles.inputContainer}
                          placeholder="Enter description"
                          value={dueInst.paymentNotes || ''}
                          onChangeText={(text) => {
                            // Update the installment description in state
                            const updatedInstallments = dynamicInstallments.map(inst => 
                              inst.installmentId === dueInst.installmentId 
                                ? { ...inst, paymentNotes: text }
                                : inst
                            );
                            setDynamicInstallments(updatedInstallments);
                          }}
                        />
                      </View>
                    </View>
                  ))}

                  {/* Add New Due Installment Button */}
                  <TouchableOpacity style={styles.addNewInstallmentButton} onPress={handleAddInstallment}>
                    <ScalableText style={styles.addNewButtonText} fontFamily="Bold">+</ScalableText>
                    <ScalableText style={styles.addNewButtonLabel} fontFamily="Medium">
                      Add Due Installment
                    </ScalableText>
                  </TouchableOpacity>

 
                </View>

                {/* Submit Button */}
                <TouchableOpacity 
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                  onPress={handleSubmitPayment}
                  disabled={isSubmitting}
                >
                  <ScalableText style={styles.submitButtonText} fontFamily="SemiBold">
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                  </ScalableText>
                </TouchableOpacity>
              </View>
            </Flex>
          )}
        </Flex>
      </ThemeScrollView>

      {/* Update Payment Status Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <Flex flexDirection="row" justify="space-between" align="center" mb={25}>
              <ScalableText style={styles.modalTitle} fontFamily="Bold">
                Update Payment Status
              </ScalableText>
              <TouchableOpacity onPress={handleCloseModal} style={styles.modalCloseButton}>
                <ScalableText style={styles.closeIcon} fontFamily="Bold">×</ScalableText>
              </TouchableOpacity>
            </Flex>

            {/* Current Payment Details */}
            <Flex mb={25} styles={styles.paymentDetailsCard}>
              <ScalableText style={styles.modalSubtitle} fontFamily="Medium">
                Current Payment Details:
              </ScalableText>
              <Flex flexDirection="row" align="center" >
                <ScalableText style={styles.paymentAmount} fontFamily="Bold">
                  {formatCurrency(selectedInstallment?.receivedPayment || selectedInstallment?.duePayment || 0)}
                </ScalableText>
              
              </Flex>
              
            </Flex>
            <Flex >
                  <Flex
                    styles={{
                      ...styles.statusChip,
                      backgroundColor: getStatusColor(selectedInstallment?.paymentStatus).backgroundColor,
                    }}
                  >
                    <ScalableText
                      style={{
                        ...styles.statusChipText,
                        color: getStatusColor(selectedInstallment?.paymentStatus).color,
                      }}
                      fontFamily="Medium"
                    >
                      {selectedInstallment?.paymentStatus?.toUpperCase()}
                    </ScalableText>
                  </Flex>
                </Flex>

            {/* Status Dropdown */}
        
              <Flex mt={8}>
                <SelectDropdown
                  label=""
                  onChange={(value) => setPaymentStatus(value)}
                  options={[
                    { label: "Paid", value: "paid" },
                    { label: "Due", value: "due" },
                  ]}
                  value={{ label: paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1), value: paymentStatus }}
                />
              </Flex>
        

            {/* Date Input */}
           
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Flex flexDirection="row" align="center" justify="space-between">
                  <ScalableText style={styles.dateInputText} fontFamily="Regular">
                    {paymentDate.toLocaleDateString("en-GB")}
                  </ScalableText>
                  <ScalableText style={styles.calendarIcon} fontFamily="Regular">
                    📅
                  </ScalableText>
                </Flex>
              </TouchableOpacity>
          

            {/* Save Button */}
            <Button
              title={isUpdating ? "UPDATING..." : "SAVE"}
              onPress={handleSavePayment}
              btnStyles={isUpdating ? styles.saveButtonDisabled : styles.saveButton}
              btnTxtStyles={styles.saveButtonText}
              disabled={isUpdating}
            />
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowDatePicker(false);
          setSelectedInstallmentForDate('');
        }}
      >
        <TouchableWithoutFeedback onPress={() => {
          setShowDatePicker(false);
          setSelectedInstallmentForDate('');
        }}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <ScalableText style={styles.datePickerTitle} fontFamily="Bold">
                    Select Due Date
                  </ScalableText>
                  <TouchableOpacity onPress={() => {
                    setShowDatePicker(false);
                    setSelectedInstallmentForDate('');
                  }}>
                    <View style={styles.closeButtonContainer}>
                      <ScalableText style={styles.closeButton} fontFamily="Bold">×</ScalableText>
                    </View>
                  </TouchableOpacity>
                </View>
                
                <DatePicker
                  date={paymentDate || new Date()}
                  mode="date"
                  onDateChange={(date) => {
                    console.log('DatePicker onDateChange:', date);
                    if (date && !isNaN(date.getTime())) {
                      console.log('Setting payment date to:', date);
                      setPaymentDate(date);
                    } else {
                      console.log('Invalid date received:', date);
                    }
                  }}
                  minimumDate={new Date()}
                />
                
                <View style={styles.datePickerActions}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      setShowDatePicker(false);
                      setSelectedInstallmentForDate('');
                    }}
                    btnStyles={styles.cancelButton}
                    btnTxtStyles={styles.cancelButtonText}
                  />
                  <Button
                    title="Confirm"
                    onPress={() => {
                      // Update only the selected installment's due date
                      if (paymentDate && !isNaN(paymentDate.getTime())) {
                        console.log('Updating installment date:', {
                          installmentId: selectedInstallmentForDate,
                          newDate: paymentDate.toLocaleDateString("en-GB"),
                          formattedDate: paymentDate.toISOString().split('T')[0]
                        });
                        
                        const updatedInstallments = dynamicInstallments.map(inst => 
                          inst.installmentId === selectedInstallmentForDate 
                            ? {
                                ...inst,
                                nextpaymentDate: paymentDate.toLocaleDateString("en-GB"),
                                formatedNextpaymentDate: paymentDate.toISOString().split('T')[0]
                              }
                            : inst
                        );
                        
                        console.log('Updated installments:', updatedInstallments);
                        setDynamicInstallments(updatedInstallments);
                        setShowDatePicker(false);
                        setSelectedInstallmentForDate('');
                      } else {
                        console.log('Invalid payment date:', paymentDate);
                      }
                    }}
                    btnStyles={styles.confirmButton}
                    btnTxtStyles={styles.confirmButtonText}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inactiveTab: {
    backgroundColor: "transparent",
  },
  activeTabText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  inactiveTabText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.black,
    fontFamily: "Poppins-Bold",
    marginBottom: 5,
  },
  headerRow: {
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    textAlign: "center",
    fontWeight: "600",
  },
  dataRow: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dataText: {
    color: COLORS.black,
    fontSize: 12,
    textAlign: "center",
    textTransform: "capitalize",
    lineHeight: 16,
  },
  statusChip: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statusChipText: {
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  noDataText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    color: COLORS.black,
    fontFamily: "Poppins-Bold",
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Medium",
  },
  paymentAmount: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: "Poppins-Bold",
    marginHorizontal: 10,
  },
  inputLabel: {
    fontSize: 15,
    marginBottom: 8,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 15,
    color: COLORS.white,
    fontFamily: "Poppins-SemiBold",
  },
  closeIcon: {
    fontSize: 24,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Bold",
  },
  dateInput: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    width: "100%",
    marginTop: 8,
  },
  dateInputText: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Poppins-Regular",
  },
  calendarIcon: {
    fontSize: 18,
  },
  paymentDetailsCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.7,
  },
  updateFormText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
  updateFormContainer: {
    padding: 24,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  formField: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 15,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
    marginBottom: 10,
    fontWeight: "600",
  },
  inputField: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputValue: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Poppins-Regular",
  },
  couponSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  couponDropdown: {
    flex: 1,
    marginRight: 10,
  },
  couponPlaceholder: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  addCouponButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24,
  },
  dropdownField: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  installmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  installmentInfo: {
    flex: 1,
    marginRight: 10,
  },
  installmentLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  dateField: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateValue: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Poppins-Regular",
    flex: 1,
  },
  amountField: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  amountValue: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Poppins-Regular",
  },
  addInstallmentButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionField: {
    marginTop: 15,
  },
  textAreaField: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  textAreaPlaceholder: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "Poppins-SemiBold",
    fontWeight: "600",
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.7,
  },
  paymentModeContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  paymentModeButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentModeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  paymentModeButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Medium",
  },
  paymentModeButtonTextActive: {
    color: COLORS.white,
  },
  debugContainer: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  debugText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
  },
  reminderMenu: {
    position: 'absolute',
    top: 25,
    right: -10,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 1000,
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  reminderMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginVertical: 2,
  },
  reminderMenuText: {
    fontSize: 13,
    color: COLORS.black,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  reminderButton: {
    padding: 2,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  summarySection: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Medium",
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Poppins-Bold",
  },
  paidStatusBadge: {
    backgroundColor: "#ECFFE0",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  paidStatusText: {
    fontSize: 12,
    color: "#4AC400",
    fontFamily: "Poppins-Bold",
  },
  removeInstallmentButton: {
    backgroundColor: "#FFE6E6",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    fontSize: 18,
    color: "#FF4444",
    fontFamily: "Poppins-Bold",
  },
  addNewInstallmentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    marginTop: 15,
  },
  addNewButtonText: {
    fontSize: 20,
    color: COLORS.primary,
    fontFamily: "Poppins-Bold",
    marginRight: 8,
  },
  addNewButtonLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Medium",
  },
  descriptionValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  installmentContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  installmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  installmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    fontFamily: "Poppins-Medium",
  },
  inputSpacing: {
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  dateInputStyle: {
    marginTop: 0,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: COLORS.white,
    elevation: 0,
    shadowOpacity: 0,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  couponContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 0,
  },
  couponDropdownStyle: {
    flex: 1,
    marginRight: 8,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    elevation: 0,
    shadowOpacity: 0,
  },
  selectedCouponContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  selectedCouponInfo: {
    flex: 1,
  },
  selectedCouponName: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
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
  totalAmountSection: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  totalAmountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalAmountLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Medium",
  },
  totalAmountValue: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Poppins-Bold",
  },
  datePickerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  datePickerTitle: {
    fontSize: 18,
    color: COLORS.black,
    fontFamily: "Poppins-Bold",
  },
  cancelButton: {
    backgroundColor: COLORS.textSecondary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    color: COLORS.white,
    fontFamily: "Poppins-SemiBold",
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 15,
    color: COLORS.white,
    fontFamily: "Poppins-SemiBold",
  },
  datePickerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Bold",
  },
  closeButtonContainer: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UpdatePaymentScreen; 