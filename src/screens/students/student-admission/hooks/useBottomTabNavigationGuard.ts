import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useStudentAdmission } from '../StudentAdmissionContext';

export const useBottomTabNavigationGuard = () => {
  const navigation = useNavigation();
  const { hasFormChanges, showNavigationConfirmation } = useStudentAdmission();

  useEffect(() => {
    // This hook can be used in the main navigation structure
    // to intercept bottom tab navigation attempts
    // For now, we'll rely on the beforeRemove listener in individual screens
    
    return () => {
      // Cleanup if needed
    };
  }, [hasFormChanges, showNavigationConfirmation]);

  // Function to check if navigation should be allowed
  const shouldAllowNavigation = (targetRoute: string) => {
    if (!hasFormChanges) return true;
    
    // Show confirmation for bottom tab navigation
    return new Promise<boolean>((resolve) => {
      showNavigationConfirmation(
        () => {
          // User confirmed
          resolve(true);
        },
        () => {
          // User cancelled
          resolve(false);
        }
      );
    });
  };

  return {
    shouldAllowNavigation,
    hasFormChanges,
  };
};







