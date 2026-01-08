import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../colors';

const { width: screenWidth } = Dimensions.get('window');

export const ResponsiveInputStyles = StyleSheet.create({
  // Container for input fields with consistent spacing
  inputContainer: {
    marginTop: 8,
    width: '100%',
  },
  
  // Input field styling with responsive dimensions
  inputField: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: COLORS.black,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
  },
  
  // Dropdown specific styling
  dropdownContainer: {
    marginTop: 8,
    width: '100%',
    position: 'relative',
  },
  
  // Label styling
  inputLabel: {
    fontSize: 15,
    marginBottom: 8,
    color: COLORS.black,
    fontFamily: 'Poppins-Medium',
  },
  
  // Error text styling
  errorText: {
    color: COLORS.error,
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
  
  // Input spacing between fields
  inputSpacing: {
    marginBottom: 16,
    width: '100%',
  },
  
  // Responsive width calculations
  getResponsiveWidth: (percentage: number = 100) => {
    return Math.min(screenWidth * (percentage / 100), screenWidth - 40);
  },
  
  // Minimum and maximum widths for different screen sizes
  minWidth: Math.max(280, screenWidth * 0.8),
  maxWidth: screenWidth - 40,
});







