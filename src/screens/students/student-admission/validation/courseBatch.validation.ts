import * as yup from 'yup';
 
export const courseBatchValidation = yup.object().shape({
  course: yup.string().required('Course is required'),
  batch: yup.string().required('Batch is required'),
}); 