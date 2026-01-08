import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

interface CreateCouponPayload {
  couponName: string;
  couponDescription: string;
  couponType: string;
  couponValue: number;
  couponLimit: string;
  couponExpiryDate: string | Date;
  couponCount?: string;
}

const createCoupon = async (data: CreateCouponPayload) => {
  console.log('🎫 === CREATE COUPON DEBUG ===');
  console.log('Form data:', data);
  
  // Get organization and user data from store
  const selectedOrganization = store.getState().auth.selectedOrganization;
  const user = store.getState().auth.authUser;
  const organization = store.getState().organization.organization;
  
  console.log('Organization:', selectedOrganization);
  console.log('User:', user);
  console.log('Organization Details:', organization);
  
  // Format the payload according to web app structure
  const payload: any = {
    coupons: [{
      couponName: data.couponName,
      couponDescription: data.couponDescription,
      couponType: data.couponType === 'flat' ? 'Flat' : 'Percentage',
      couponValue: Number(data.couponValue),
      couponLimit: data.couponLimit === 'date' ? 'Date' : 
                   data.couponLimit === 'count' ? 'Coupon count' : 
                   data.couponLimit === 'both' ? 'Both' : 'None',
      couponExpiryDate: data.couponExpiryDate || ''
    }],
    user: {
      userCustomerId: user?.customerId,
      userCustomerName: user?.customerName,
      userCustomerEmail: user?.customerEmail,
      roleName: user?.userType || 'admin',
      roleId: organization?.role?.roleId || '',
      userEmployeeId: user?.employeeId || ''
    },
    customerId: selectedOrganization?.customerId,
    organizationId: selectedOrganization?.organizationId
  };
  
  // If coupon count is provided, add it to the first coupon
  if (data.couponCount && data.couponCount !== '') {
    payload.coupons[0].couponCount = Number(data.couponCount);
  }
  
  console.log('API payload:', payload);
  console.log('🎫 === END CREATE COUPON DEBUG ===');

  const response = await request({
    url: apiUrls.coupons.CREATE_COUPON,
    method: "POST",
    data: payload,
  });

  return response;
};

export const useCreateCouponMutation = () => {
  return useMutation({
    mutationFn: createCoupon,
    onSuccess: (data) => {
      console.log('🎫 Coupon created successfully:', data);
    },
    onError: (error) => {
      console.error('🎫 Error creating coupon:', error);
    },
  });
}; 