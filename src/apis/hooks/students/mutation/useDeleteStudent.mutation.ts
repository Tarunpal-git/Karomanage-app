import { useMutation } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { studentUrls } from '../../../urls/students.url';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
 
export const useDeleteStudentMutation = () => {
  return useMutation({
    mutationFn: async (payload: {
      user: {
        userCustomerId: string;
        userCustomerName: string;
        userCustomerEmail: string;
        roleName: string;
        roleId: string;
        userEmployeeId: string;
      };
      customerId: string;
      rollNo: string;
      organizationId: string;
      studentStatus: string;
    }) => {
      console.log('🗑️ === DELETE STUDENT API CALL ===');
      console.log('API URL:', studentUrls.DELETE_STUDENT);
      console.log('Payload:', JSON.stringify(payload, null, 2));
      
      const data = await request({
        method: 'POST',
        url: studentUrls.DELETE_STUDENT,
        data: payload
      });
      
      console.log('🗑️ API Response:', JSON.stringify(data, null, 2));
      console.log('🗑️ === END DELETE STUDENT API CALL ===');
      
      return data;
    }
  });
}; 