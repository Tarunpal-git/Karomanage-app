import { useQuery } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { apiUrls } from '../../../urls';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';

export const useGetReferralAgentsQuery = (enabled: boolean = true) => {
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);

  return useQuery({
    queryKey: ['referralAgents', selectedOrganization?.customerId, selectedOrganization?.organizationId],
    queryFn: async () => {
      if (!selectedOrganization) {
        throw new Error('No organization selected');
      }

      const params = {
        customerId: selectedOrganization.customerId,
        organizationId: selectedOrganization.organizationId,
      };

      console.log('🎯 === LIST REFERRAL AGENTS API CALL ===');
      console.log('API URL:', apiUrls.agentManagement.LIST_REFERRAL_AGENTS);
      console.log('Params:', params);
      
      const response = await request({
        method: 'GET',
        url: apiUrls.agentManagement.LIST_REFERRAL_AGENTS,
        params,
      });
      
      console.log('🎯 === LIST REFERRAL AGENTS RESPONSE ===');
      console.log('Response:', response);
      console.log('Response data structure:', {
        hasData: !!response?.data,
        dataKeys: response?.data ? Object.keys(response.data) : [],
        dataType: typeof response?.data,
        isArray: Array.isArray(response?.data),
        dataLength: Array.isArray(response?.data) ? response.data.length : 'Not an array'
      });
      
      return response;
    },
    enabled: enabled && !!selectedOrganization,
  });
};
