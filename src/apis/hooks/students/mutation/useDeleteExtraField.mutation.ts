import { useMutation } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { studentUrls } from '../../../urls/students.url';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';

interface DeleteExtraFieldPayload {
  customerId: string;
  organizationId: string;
  flag: string;
  keyToRemove: string;
}

export const useDeleteExtraFieldMutation = () => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);
  const { organization } = useSelector((state: RootState) => state.organization);

  return useMutation({
    mutationFn: async (payload: DeleteExtraFieldPayload) => {
      console.log('🎯 === DELETE EXTRA FIELD API CALL ===');
      console.log('API URL:', studentUrls.DELETE_EXTRA_FIELD);
      console.log('Payload:', payload);
      
      const response = await request({
        method: 'POST',
        url: studentUrls.DELETE_EXTRA_FIELD,
        data: payload,
      });
      
      console.log('🎯 === DELETE EXTRA FIELD RESPONSE ===');
      console.log('Response:', response);
      
      return response;
    },
  });
}; 