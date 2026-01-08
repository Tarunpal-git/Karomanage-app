import { useMutation } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { studentUrls } from '../../../urls/students.url';
 
export const useStudentAdmissionMutation = () =>
  useMutation({
    mutationFn: async (payload: any) => {
      console.log('🎓 === STUDENT ADMISSION API CALL ===');
      console.log('API URL:', studentUrls.STUDENT_ADMISSION);
      console.log('Payload:', JSON.stringify(payload, null, 2));
      
      const data = await request({
        method: 'POST',
        url: studentUrls.STUDENT_ADMISSION,
        data: payload
      });
      
      console.log('🎓 API Response:', JSON.stringify(data, null, 2));
      console.log('🎓 === END STUDENT ADMISSION API CALL ===');
      
      return data;
    }
  }); 