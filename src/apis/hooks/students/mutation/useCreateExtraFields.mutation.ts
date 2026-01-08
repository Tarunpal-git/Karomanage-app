import { useMutation } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { studentUrls } from '../../../urls/students.url';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';

interface ExtraField {
  [key: string]: string | number;
  type: string;
}

interface CreateExtraFieldsPayload {
  customerId: string;
  organizationId: string;
  flag: string;
  extraFields: ExtraField[];
}

export const useCreateExtraFieldsMutation = () => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);
  const { organization } = useSelector((state: RootState) => state.organization);

  return useMutation({
    mutationFn: async (payload: CreateExtraFieldsPayload) => {
      console.log('🎯 === CREATE EXTRA FIELDS API CALL ===');
      console.log('API URL:', studentUrls.CREATE_EXTRA_FIELDS);
      console.log('Payload:', payload);
      
      const response = await request({
        method: 'POST',
        url: studentUrls.CREATE_EXTRA_FIELDS,
        data: payload,
      });
      
      console.log('🎯 === CREATE EXTRA FIELDS RESPONSE ===');
      console.log('Response:', response.data);
      
      return response.data;
    },
  });
}; 