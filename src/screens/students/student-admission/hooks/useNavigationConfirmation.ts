import { useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useStudentAdmission } from '../StudentAdmissionContext';

export const useNavigationConfirmation = () => {
  const navigation = useNavigation();
  const { hasFormChanges, showNavigationConfirmation } = useStudentAdmission();

  // Handle back button press and navigation events
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (hasFormChanges) {
        // Prevent default behavior
        e.preventDefault();

        showNavigationConfirmation(
          () => {
            // User confirmed, allow navigation
            navigation.dispatch(e.data.action);
          },
          () => {
            // User cancelled, do nothing
          }
        );
      }
    });

    return unsubscribe;
  }, [navigation, hasFormChanges, showNavigationConfirmation]);

  // Custom navigation function that checks for form changes
  const navigateWithConfirmation = (routeName: string, params?: any) => {
    showNavigationConfirmation(
      () => {
        (navigation as any).navigate(routeName, params);
      },
      () => {
        // User cancelled navigation
      }
    );
  };

  // Custom go back function that checks for form changes
  const goBackWithConfirmation = () => {
    showNavigationConfirmation(
      () => {
        navigation.goBack();
      },
      () => {
        // User cancelled navigation
      }
    );
  };

  return {
    navigateWithConfirmation,
    goBackWithConfirmation,
    hasFormChanges,
  };
};
