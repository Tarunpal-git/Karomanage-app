import { useQuery } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { LOCATION_URLS } from '../../../urls/location.urls';

const getStates = async () => {
  const response = await request({
    url: LOCATION_URLS.GET_STATES,
    method: 'GET',
  });
  return response;
};

export const useGetStatesQuery = () => {
  return useQuery({
    queryKey: [LOCATION_URLS.GET_STATES],
    queryFn: getStates,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaced cacheTime with gcTime)
  });
}; 