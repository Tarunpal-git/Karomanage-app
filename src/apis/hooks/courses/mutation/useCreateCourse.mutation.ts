import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

const createCourse = async (data: any) => {
  const user = store.getState().auth.authUser;
  const selectedOrganization = store.getState().auth.selectedOrganization;
  
  // Debug: Log the subjects data
  console.log('Subjects data:', JSON.stringify(data.subjects, null, 2));
  console.log('Subjects type:', typeof data.subjects);
  console.log('Subjects length:', Array.isArray(data.subjects) ? data.subjects.length : 'Not an array');
  
  const payload: any = {
    customerId: selectedOrganization?.customerId,
    organizationId: selectedOrganization?.organizationId,
    user: {
      userCustomerId: user?.customerId,
      userCustomerName: user?.customerName,
      userCustomerEmail: user?.customerEmail,
      roleName: "",
      roleId: "",
      userEmployeeId: user?.employeeId || "",
    },
    courses: [
      {
        courseName: data.courseName,
        courseDescription: data.courseDescription,
        courseFee: Number(data.courseFee),
        courseFeeDescription: data.courseFeeDescription,
        maxPaymentInstallment: Number(data.maxPaymentInstallment),
        courseDuration: Number(data.courseDurationYear) * 12 + Number(data.courseDurationMonth),
        mode: data.mode,
        subjects: data.subjects || [], // Subjects inside course object
      },
    ],
    students: [],
    batch: [],
    subjects: data.subjects || [], // Also sending subjects at root level (like batch API)
  };
  
  // Debug: Log the complete payload
  console.log('Complete payload:', JSON.stringify(payload, null, 2));
  console.log('Subjects in payload:', JSON.stringify(payload.courses[0].subjects, null, 2));
  
  const response = await request({
    url: apiUrls.organization.CREATE_COURSE,
    method: "POST",
    data: payload,
  });
  
  // Debug: Log the response to understand why subjects are missing
  console.log('=== COURSE CREATION RESPONSE DEBUG ===');
  console.log('Response status:', response.statusCode);
  console.log('Response data:', JSON.stringify(response.data, null, 2));
  if (response.data && response.data.length > 0) {
    console.log('First course in response:', JSON.stringify(response.data[0], null, 2));
    console.log('Subjects in response:', JSON.stringify(response.data[0].subjects, null, 2));
  }
  console.log('=== END COURSE CREATION RESPONSE DEBUG ===');
  
  return response;
};

export const useCreateCourseMutation = () => useMutation({ mutationFn: createCourse }); 