import { useMutation } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { studentUrls } from '../../../urls/students.url';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';

interface UpdateCouponCourseBatchDetailsPayload {
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
  courses: {
    courseId: string;
    paymentDetails: {
      isPartPayment: boolean;
      coursePayment: number;
      coursePaymentStatus: string;
      installmentDetails: Array<{
        installmentId: string;
        installmentNumber: number;
        paymentStatus: string;
        paymentReceiveDate: string;
        receivedPayment: number;
        paymentNotes: string;
      }>;
    };
  };
  batch: Array<{
    batchId: string;
    courseId: string;
  }>;
  coupon?: Array<{
    couponId: string;
    courseId: string;
    discountAmount: number;
  }>;
}

export const useUpdateCouponCourseBatchDetailsMutation = () => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);
  const { organization } = useSelector((state: RootState) => state.organization);

  return useMutation({
    mutationFn: async (payload: UpdateCouponCourseBatchDetailsPayload) => {
      console.log('🎓 === UPDATE COUPON COURSE BATCH DETAILS API CALL ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('Auth User:', authUser);
      console.log('Selected Organization:', selectedOrganization);
      console.log('Organization Details:', organization);

      const response = await request({
        method: 'POST',
        url: studentUrls.UPDATE_COUPON_COURSE_BATCH_DETAILS,
        data: payload,
      });

      console.log('🎓 API Response:', JSON.stringify(response, null, 2));
      console.log('🎓 === END UPDATE COUPON COURSE BATCH DETAILS API CALL ===');

      return response;
    },
  });
}; 