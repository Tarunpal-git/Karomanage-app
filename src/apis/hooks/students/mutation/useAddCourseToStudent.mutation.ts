import { useMutation } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { studentUrls } from '../../../urls/students.url';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';

export const useAddCourseToStudentMutation = () => {
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const selectedOrganization = useSelector((state: RootState) => state.auth.selectedOrganization);

  return useMutation({
    mutationFn: async (payload: any) => {
      console.log('🎓 === ADD COURSE TO STUDENT API CALL ===');
      console.log('API URL:', studentUrls.ADD_COURSE_TO_STUDENT);

      const addCoursePayload = {
        user: {
          userCustomerId: authUser?.customerId || '',
          userCustomerName: authUser?.customerName || '',
          userCustomerEmail: authUser?.customerEmail || '',
          roleName: 'admin',
          roleId: 'J9xAF',
          userEmployeeId: 'TOP-9d8a8',
        },
        customerId: selectedOrganization?.customerId || '',
        rollNo: payload.rollNo || '',
        organizationId: selectedOrganization?.organizationId || '',
        courseId: payload.courseId || '',
        batchId: payload.batchId || '',
        paymentDetails: payload.paymentDetails || {},
      };

      console.log('Payload:', JSON.stringify(addCoursePayload, null, 2));

      const data = await request({
        method: 'POST',
        url: studentUrls.ADD_COURSE_TO_STUDENT,
        data: addCoursePayload
      });

      console.log('🎓 API Response:', JSON.stringify(data, null, 2));
      console.log('🎓 === END ADD COURSE TO STUDENT API CALL ===');

      return data;
    }
  });
}; 