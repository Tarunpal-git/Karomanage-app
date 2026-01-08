import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Enhanced type definitions based on web implementation
export type StudentAdmissionData = {
  // Student Details (Step 1)
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentDateOfBirth: string;
  studentEnrollmentNumber: string;
  studentContact: string;
  studentFatherName: string;
  studentFatherContact: string;
  studentAddress: string;
  studentGender: string;
  referedBy: string;
  dateOfAdmission: string;
  studentImage: string;
  
  // College Details (Step 2)
  collegeName: string;
  collegeCourse: string;
  collegeSemester: string;
  departmentName: string;
  state: string;
  city: string;
  
  // Course & Batch (Step 3)
  course: string;
  courseId: string;
  courseFee: number;
  batch: string;
  batchId: string;
  batchMode: string;
  batchStartDate: string;
  batchEndDate: string;
  batchClassStartTime: string;
  batchClassEndTime: string;
  
  // Payment Details (Step 4)
  totalPayment: number;
  discountedPayment: number;
  discountAmount: number;
  // GST-related fields
  cgstAmount: number;
  sgstAmount: number;
  totalGSTAmount: number;
  paymentAfterGST: number;
  gstinNumber: string;
  partPayment: 'yes' | 'no';
  numberOfInstallments: number;
  firstPaymentInstallment: 'pay' | 'due';
  divideInstallment: 'equal' | 'custom';
  coupon: any;
  couponName: string;
  couponValue: number;
  couponType: 'Percentage' | 'Flat';
  installments: Array<{
    description: string;
    date: string;
    amount: number;
    status: 'paid' | 'due';
  }>;
  
  // Agent/Referral Details
  referralpaymentStatus: string;
  referralAmount: number;
  agentId: string;
  agentName: string;
  agentLastName: string;
  agentPayment: string;
  paymentStatus: 'paid' | 'due';
  paymentMode: 'online' | 'cash' | 'other';
  
  // Organization & API Details
  customerId: string;
  organizationId: string;
  rollNo: string;
  organizationName: string;
  organizationLogo: string;
  organizationEmail: string;
  organizationAddress: string;
  organizationPhoneNumber: string;
  
  // Dynamic Fields (from web implementation)
  dynamicFields: Array<{
    fieldName: string;
    value: string;
    type: string;
    mediaUri?: string; // For Media type fields
  }>;
};

const defaultData: StudentAdmissionData = {
  // Student Details
  studentFirstName: '',
  studentLastName: '',
  studentEmail: '',
  studentDateOfBirth: '',
  studentEnrollmentNumber: '',
  studentContact: '',
  studentFatherName: '',
  studentFatherContact: '',
  studentAddress: '',
  studentGender: '',
  referedBy: '',
  dateOfAdmission: '',
  studentImage: '',
  
  // College Details
  collegeName: '',
  collegeCourse: '',
  collegeSemester: '',
  departmentName: '',
  state: '',
  city: '',
  
  // Course & Batch
  course: '',
  courseId: '',
  courseFee: 0,
  batch: '',
  batchId: '',
  batchMode: '',
  batchStartDate: '',
  batchEndDate: '',
  batchClassStartTime: '',
  batchClassEndTime: '',
  
  // Payment Details
  totalPayment: 0,
  discountedPayment: 0,
  discountAmount: 0,
  // GST-related fields
  cgstAmount: 0,
  sgstAmount: 0,
  totalGSTAmount: 0,
  paymentAfterGST: 0,
  gstinNumber: '',
  partPayment: 'no',
  numberOfInstallments: 1,
  firstPaymentInstallment: 'due',
  divideInstallment: 'equal',
  coupon: null,
  couponName: '',
  couponValue: 0,
  couponType: 'Flat',
  installments: [],
  
  // Agent/Referral Details
  referralpaymentStatus: '',
  referralAmount: 0,
  agentId: '',
  agentName: '',
  agentLastName: '',
  agentPayment: '',
  paymentStatus: 'due',
  paymentMode: 'cash',
  
  // Organization & API Details
  customerId: '',
  organizationId: '',
  rollNo: '',
  organizationName: '',
  organizationLogo: '',
  organizationEmail: '',
  organizationAddress: '',
  organizationPhoneNumber: '',
  
  // Dynamic Fields
  dynamicFields: [],
};

type StudentAdmissionContextType = {
  data: StudentAdmissionData;
  setData: React.Dispatch<React.SetStateAction<StudentAdmissionData>>;
  updateStepData: (stepData: Partial<StudentAdmissionData>) => void;
  resetData: () => void;
  isFormComplete: boolean;
  setIsFormComplete: React.Dispatch<React.SetStateAction<boolean>>;
  hasFormChanges: boolean;
  setHasFormChanges: React.Dispatch<React.SetStateAction<boolean>>;
  showNavigationConfirmation: (onConfirm: () => void, onCancel?: () => void) => void;
  clearFormChanges: () => void;
};

const StudentAdmissionContext = createContext<StudentAdmissionContextType>({
  data: defaultData,
  setData: () => {},
  updateStepData: () => {},
  resetData: () => {},
  isFormComplete: false,
  setIsFormComplete: () => {},
  hasFormChanges: false,
  setHasFormChanges: () => {},
  showNavigationConfirmation: () => {},
  clearFormChanges: () => {},
});

export const useStudentAdmission = () => {
  const context = useContext(StudentAdmissionContext);
  if (!context) {
    throw new Error('useStudentAdmission must be used within StudentAdmissionProvider');
  }
  return context;
};

export const StudentAdmissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<StudentAdmissionData>(defaultData);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [hasFormChanges, setHasFormChanges] = useState(false);
  const [initialData] = useState<StudentAdmissionData>(defaultData);

  const updateStepData = useCallback((stepData: Partial<StudentAdmissionData>) => {
    setData(prev => ({ ...prev, ...stepData }));
    
    // Check if any field has changed from initial state
    const hasChanges = Object.keys(stepData).some(key => {
      const typedKey = key as keyof StudentAdmissionData;
      return stepData[typedKey] !== initialData[typedKey];
    });
    
    if (hasChanges) {
      setHasFormChanges(true);
    }
  }, [initialData]);

  const resetData = useCallback(() => {
    setData(defaultData);
    setIsFormComplete(false);
    setHasFormChanges(false);
  }, []);

  const clearFormChanges = useCallback(() => {
    setHasFormChanges(false);
  }, []);

  const showNavigationConfirmation = useCallback((onConfirm: () => void, onCancel?: () => void) => {
    if (hasFormChanges) {
      // Import and use the global alert system
      if (typeof customAlert !== 'undefined') {
        customAlert.show({
          title: 'Unsaved Changes',
          message: 'You have unsaved changes. Are you sure you want to leave?',
          okTitle: 'Leave',
          cancelTitle: 'Cancel',
          okCallBack: () => {
            clearFormChanges();
            onConfirm();
          },
          cancelCallback: onCancel || (() => {}),
        });
      } else {
        // Fallback to native Alert if customAlert is not available
        const { Alert } = require('react-native');
        Alert.alert(
          'Unsaved Changes',
          'You have unsaved changes. Are you sure you want to leave?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: onCancel,
            },
            {
              text: 'Leave',
              style: 'destructive',
              onPress: () => {
                clearFormChanges();
                onConfirm();
              },
            },
          ]
        );
      }
    } else {
      onConfirm();
    }
  }, [hasFormChanges, clearFormChanges]);

  // Track form changes by comparing current data with initial data
  useEffect(() => {
    const hasChanges = JSON.stringify(data) !== JSON.stringify(initialData);
    setHasFormChanges(hasChanges);
  }, [data, initialData]);

  return (
    <StudentAdmissionContext.Provider 
      value={{ 
        data, 
        setData, 
        updateStepData, 
        resetData, 
        isFormComplete, 
        setIsFormComplete,
        hasFormChanges,
        setHasFormChanges,
        showNavigationConfirmation,
        clearFormChanges,
      }}
    >
      {children}
    </StudentAdmissionContext.Provider>
  );
}; 