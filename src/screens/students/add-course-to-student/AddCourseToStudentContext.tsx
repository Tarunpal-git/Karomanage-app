import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AddCourseToStudentData {
  // Step 1: Course & Batch
  selectedCourse?: TCourseData & { label?: string; value?: string };
  selectedBatch?: TBatchData & { label?: string; value?: string };
  
  // Step 2: Payment Details
  totalPayment?: number;
  partPayment?: 'yes' | 'no';
  coupon?: string;
  paymentAfterDiscount?: number;
  discountAmount?: number;
  firstInstallment?: 'yes' | 'no';
  divideInstallment?: 'equal' | 'custom';
  numberOfInstallments?: string;
  paymentDate?: Date;
  amount?: number;
  description?: string;
  installments?: Array<{
    description: string;
    date: Date;
    amount: number;
    status: 'due' | 'paid';
  }>;
}

interface AddCourseToStudentContextType {
  data: AddCourseToStudentData;
  updateStepData: (newData: Partial<AddCourseToStudentData>) => void;
  resetData: () => void;
  studentRollNo: string;
  studentDetails: TStudentList;
}

const AddCourseToStudentContext = createContext<AddCourseToStudentContextType | undefined>(undefined);

interface AddCourseToStudentProviderProps {
  children: ReactNode;
  studentRollNo: string;
  studentDetails: TStudentList;
}

export const AddCourseToStudentProvider: React.FC<AddCourseToStudentProviderProps> = ({ 
  children, 
  studentRollNo, 
  studentDetails 
}) => {
  const [data, setData] = useState<AddCourseToStudentData>({});

  const updateStepData = (newData: Partial<AddCourseToStudentData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const resetData = () => {
    setData({});
  };

  const value: AddCourseToStudentContextType = {
    data,
    updateStepData,
    resetData,
    studentRollNo,
    studentDetails,
  };

  return (
    <AddCourseToStudentContext.Provider value={value}>
      {children}
    </AddCourseToStudentContext.Provider>
  );
};

export const useAddCourseToStudent = () => {
  const context = useContext(AddCourseToStudentContext);
  if (context === undefined) {
    throw new Error('useAddCourseToStudent must be used within an AddCourseToStudentProvider');
  }
  return context;
}; 