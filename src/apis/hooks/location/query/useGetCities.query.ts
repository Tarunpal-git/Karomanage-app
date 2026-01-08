import { useQuery } from '@tanstack/react-query';
import { request } from '../../../../services/axios.service';
import { LOCATION_URLS } from '../../../urls/location.urls';

interface GetCitiesParams {
  state: string;
}

const getCities = async (params?: GetCitiesParams) => {
  if (!params?.state) {
    return { data: [] };
  }
  const response = await request({
    url: LOCATION_URLS.GET_CITIES,
    method: 'GET',
    params: { state: params.state }
  });
  return response;
};

export const useGetCitiesQuery = (params?: GetCitiesParams) => {
  return useQuery({
    queryKey: [LOCATION_URLS.GET_CITIES, params?.state],
    queryFn: () => getCities(params),
    enabled: !!params?.state,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaced cacheTime with gcTime)
  });
}; 