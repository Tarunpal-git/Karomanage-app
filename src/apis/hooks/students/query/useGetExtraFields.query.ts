import { useQuery } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { studentUrls } from '../../../urls/students.url';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';

interface GetExtraFieldsParams {
  customerId: string;
  organizationId: string;
  flag: string;
}

export const useGetExtraFieldsQuery = (enabled: boolean = true) => {
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);

  return useQuery({
    queryKey: ['extraFields', selectedOrganization?.customerId, selectedOrganization?.organizationId],
    queryFn: async () => {
      if (!selectedOrganization) {
        throw new Error('No organization selected');
      }

      const params: GetExtraFieldsParams = {
        customerId: selectedOrganization.customerId,
        organizationId: selectedOrganization.organizationId,
        flag: 'form',
      };

      console.log('🎯 === GET EXTRA FIELDS API CALL ===');
      console.log('API URL:', studentUrls.GET_EXTRA_FIELDS);
      console.log('Params:', params);
      
      const response = await request({
        method: 'GET',
        url: studentUrls.GET_EXTRA_FIELDS,
        params,
      });
      
      console.log('🎯 === GET EXTRA FIELDS RESPONSE ===');
      console.log('Response:', response);
      
      return response;
    },
    enabled: enabled && !!selectedOrganization,
  });
}; 