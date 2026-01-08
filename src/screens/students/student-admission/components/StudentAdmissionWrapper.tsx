import React from 'react';
import { useStudentAdmission } from '../StudentAdmissionContext';

interface StudentAdmissionWrapperProps {
  children: React.ReactNode;
}

export const StudentAdmissionWrapper: React.FC<StudentAdmissionWrapperProps> = ({ children }) => {
  // This wrapper now just provides the context
  // Individual screens will handle their own navigation confirmation
  // through the useNavigationConfirmation hook
  
  return <>{children}</>;
};
