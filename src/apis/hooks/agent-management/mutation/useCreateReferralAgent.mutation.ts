import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { apiUrls } from '../../../urls';
import { store } from '../../../../app/store';

interface CreateReferralAgentPayload {
  customerId: string;
  organizationId: string;
  agentName: string;
  agentLastName: string;
  agentEmail: string;
  agentContact: string;
  agentType: 'student' | 'teacher' | 'employee' | 'other';
  user: {
    userCustomerId: string;
    userCustomerName: string;
    userCustomerEmail: string;
    roleName: string;
    roleId: string;
    userEmployeeId: string;
  };
}

export const useCreateReferralAgentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReferralAgentPayload) => {
      console.log('🎯 === CREATE REFERRAL AGENT API CALL ===');
      console.log('API URL:', apiUrls.agentManagement.CREATE_REFERRAL_AGENT);
      console.log('Payload:', JSON.stringify(payload, null, 2));
      
      const response = await request({
        method: 'POST',
        url: apiUrls.agentManagement.CREATE_REFERRAL_AGENT,
        data: payload,
      });
      
      console.log('🎯 === CREATE REFERRAL AGENT RESPONSE ===');
      console.log('Response:', response);
      
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch referral agents list
      queryClient.invalidateQueries({ queryKey: ['referralAgents'] });
    },
  });
};


