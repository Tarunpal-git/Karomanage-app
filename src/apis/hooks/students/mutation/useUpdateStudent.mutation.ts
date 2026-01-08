import { useMutation } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { apiUrls } from '../../../urls';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
 
export const useUpdateStudentMutation = () => {
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const selectedOrganization = useSelector((state: RootState) => state.auth.selectedOrganization);

  return useMutation({
    mutationFn: async (payload: any) => {
      console.log('📝 === UPDATE STUDENT API CALL ===');
      console.log('API URL:', apiUrls.student.UPDATE_STUDENT);
      
      // Try simpler payload structure first
      const updatePayload = {
        rollNo: payload.rollNo || '',
        studentFirstName: payload.studentFirstName || '',
        studentLastName: payload.studentLastName || '',
        studentEmail: payload.studentEmail || '',
        studentContact: payload.studentContact || '',
        studentFatherName: payload.studentFatherName || '',
        studentFatherContact: payload.studentFatherContact || '',
        studentAddress: payload.studentAddress || '',
        studentGender: payload.studentGender || '',
        studentDateOfBirth: payload.studentDateOfBirth || '',
        dateOfAdmission: payload.dateOfAdmission || '',
        collegeName: payload.collegeName || '',
        collegeCourse: payload.collegeCourse || '',
        departmentName: payload.departmentName || '',
        collegeSemester: payload.collegeSemester || '',
        studentStatus: payload.studentStatus || 'active',
        // Map form fields to API fields
        studentCollage: payload.collegeName || '',
        studentCourse: payload.collegeCourse || '',
        studentDepartmentName: payload.departmentName || '',
        studentSemester: payload.collegeSemester || '',
      };
      
      console.log('Payload:', JSON.stringify(updatePayload, null, 2));
      
      const data = await request({
        method: 'PUT',
        url: apiUrls.student.UPDATE_STUDENT,
        data: updatePayload,
        params: {
          rollNo: payload.rollNo
        }
      });
      
      console.log('📝 API Response:', JSON.stringify(data, null, 2));
      console.log('📝 === END UPDATE STUDENT API CALL ===');
      
      return data;
    }
  });
}; 