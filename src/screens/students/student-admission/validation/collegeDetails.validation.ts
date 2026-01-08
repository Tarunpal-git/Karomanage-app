import * as yup from 'yup';

export const collegeDetailsValidation = yup.object().shape({
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  collegeName: yup.string().required('College name is required'),
  departmentName: yup.string().required('Department is required'),
  collegeCourse: yup.string().required('Course is required'),
  collegeSemester: yup.string().required('Semester/Year is required'),
}); 