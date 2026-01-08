import { useMutation } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { studentUrls } from '../../../urls/students.url';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';

interface RemoveCourseStudentPayload {
  user: {
    userCustomerId: string;
    userCustomerName: string;
    userCustomerEmail: string;
    roleName: string;
    roleId: string;
    userEmployeeId: string;
  };
  customerId: string;
  organizationId: string;
  rollNo: string;
  courseId: string;
}

export const useRemoveCourseStudentMutation = () => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);
  const { organization } = useSelector((state: RootState) => state.organization);

  return useMutation({
    mutationFn: async (payload: RemoveCourseStudentPayload) => {
      console.log('🗑️ === REMOVE COURSE STUDENT API CALL ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('Auth User:', authUser);
      console.log('Selected Organization:', selectedOrganization);
      console.log('Organization Details:', organization);

      const response = await request({
        method: 'POST',
        url: studentUrls.REMOVE_COURSE_STUDENT,
        data: payload,
      });

      console.log('🗑️ API Response:', JSON.stringify(response, null, 2));
      console.log('🗑️ === END REMOVE COURSE STUDENT API CALL ===');

      return response;
    },
  });
}; 