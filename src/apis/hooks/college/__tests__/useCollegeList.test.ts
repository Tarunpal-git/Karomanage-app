import { renderHook } from '@testing-library/react-hooks';
import { useCollegeListQuery } from '../useCollegeList.query';

// Mock the axios service
jest.mock('../../../services/axios.service', () => ({
  request: jest.fn(),
}));

describe('useCollegeListQuery', () => {
  it('should fetch college list successfully', async () => {
    const mockData = {
      data: [
        {
          collegeName: 'Test College 1',
          departmentName: 'Computer Science',
          collegeCourse: 'B.Tech',
        },
        {
          collegeName: 'Test College 2',
          departmentName: 'Information Technology',
          collegeCourse: 'B.Tech',
        },
      ],
    };

    const { request } = require('../../../services/axios.service');
    request.mockResolvedValue(mockData);

    const { result, waitFor } = renderHook(() => useCollegeListQuery());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });
}); 