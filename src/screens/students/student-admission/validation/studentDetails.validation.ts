import * as yup from 'yup';

export const studentDetailsValidation = yup.object().shape({
  studentFirstName: yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  
  studentLastName: yup.string()
    .optional()
    .max(50, 'Last name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces'),
  
  studentEmail: yup.string()
    .optional()
    .email('Please enter a valid email address')
    .max(100, 'Email cannot exceed 100 characters')
    .test('email-format', 'Please enter a valid email address', function(value) {
      if (!value || value.trim() === '') return true; // Allow empty values
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(value);
    }),
  
  studentEnrollmentNumber: yup.string()
    .required('Enrollment number is required')
    .min(3, 'Enrollment number must be at least 3 characters')
    .max(20, 'Enrollment number cannot exceed 20 characters')
    .matches(/^[A-Za-z0-9\-_]+$/, 'Enrollment number can only contain letters, numbers, hyphens and underscores'),
  
  studentContact: yup.string()
    .required('Phone number is required')
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9')
    .test('phone-format', 'Please enter a valid 10-digit phone number', function(value) {
      if (!value) return false;
      const cleanValue = value.replace(/\D/g, '');
      return cleanValue.length === 10 && /^[6-9]/.test(cleanValue);
    }),
  
  studentFatherName: yup.string()
    .optional()
    .max(50, 'Father\'s name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Father\'s name can only contain letters and spaces'),
  
  studentFatherContact: yup.string()
    .optional()
    .test('father-phone-validation', 'Please enter a valid 10-digit phone number', function(value) {
      if (!value || value.trim() === '') return true; // Allow empty values
      const cleanValue = value.replace(/\D/g, '');
      return cleanValue.length === 10 && /^[6-9]/.test(cleanValue);
    }),
  
  studentAddress: yup.string()
    .optional()
    .max(200, 'Address cannot exceed 200 characters')
    .test('address-format', 'Address contains invalid characters', function(value) {
      if (!value || value.trim() === '') return true; // Allow empty values
      const addressRegex = /^[a-zA-Z0-9\s,.-_()\/]+$/;
      return addressRegex.test(value);
    }),
  
  studentGender: yup.string().optional(),
  
  studentDateOfBirth: yup.string()
    .nullable()
    .optional()
    .test('not-future-date', 'Date of birth cannot be in the future', function(value) {
      if (!value) return true; // Allow empty/null values
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      return selectedDate <= today;
    })
    .test('not-too-old', 'Date of birth cannot be more than 100 years ago', function(value) {
      if (!value) return true; // Allow empty/null values
      const selectedDate = new Date(value);
      const hundredYearsAgo = new Date();
      hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
      return selectedDate >= hundredYearsAgo;
    })
    .test('not-too-recent', 'Date of birth must be at least 5 years ago', function(value) {
      if (!value) return true; // Allow empty/null values
      const selectedDate = new Date(value);
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
      return selectedDate <= fiveYearsAgo;
    }),
  
  dateOfAdmission: yup.string()
    .nullable()
    .optional()
    .test('not-future-date', 'Date of admission cannot be in the future', function(value) {
      if (!value) return true; // Allow empty/null values
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      return selectedDate <= today;
    })
    .test('not-too-old', 'Date of admission cannot be more than 10 years ago', function(value) {
      if (!value) return true; // Allow empty/null values
      const selectedDate = new Date(value);
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
      return selectedDate >= tenYearsAgo;
    }),
  
  referedBy: yup.string()
    .optional()
    .max(50, 'Referral name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Referral name can only contain letters and spaces'),
}); 