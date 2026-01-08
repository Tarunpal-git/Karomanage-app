import { useMutation } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { studentUrls } from '../../../urls/students.url';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';

export const useDeleteStudentCourseMutation = () => {
  const selectedOrganization = useSelector((state: RootState) => state.auth.selectedOrganization);

  return useMutation({
    mutationFn: async (params: { courseId: string; studentRollNo: string }) => {
      console.log('🗑️ === DELETE STUDENT COURSE API CALL ===');
      console.log('API URL:', studentUrls.DELETE_STUDENT_COURSE);

      const queryParams = {
        customerId: selectedOrganization?.customerId || '',
        organizationId: selectedOrganization?.organizationId || '',
        courseId: params.courseId,
        rollNo: params.studentRollNo,
      };

      console.log('Query Params:', JSON.stringify(queryParams, null, 2));

      const data = await request({
        method: 'DELETE',
        url: studentUrls.DELETE_STUDENT_COURSE,
        params: queryParams
      });

      console.log('🗑️ API Response:', JSON.stringify(data, null, 2));
      console.log('🗑️ === END DELETE STUDENT COURSE API CALL ===');

      return data;
    }
  });
}; 