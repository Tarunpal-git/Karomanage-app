import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

type TStudentsListFilters = {
  studentStatus?: string;
  paymentStatus?: string;
  courseName?: string;
  batchName?: string;
  // Future: paymentMode, paymentDate, admissionDate, etc.
};

const get = async (filters: TStudentsListFilters = {}) => {
  const state = store.getState();
  const authUser = state.auth.authUser;
  const selectedOrganization = state.auth.selectedOrganization as any;

  const userType = authUser?.userType; // e.g. "admin" | "subUser"
  const roleName = selectedOrganization?.role?.roleName; // e.g. "admin"

  const params: Record<string, unknown> = {
    // These will be merged with customerId & organizationId from axios interceptor
    userType,
    roleName,
  };

  // Match web URL behaviour: &studentStatus=active
  if (filters.studentStatus) {
    params.studentStatus = filters.studentStatus;
  }

  if (filters.paymentStatus) {
    params.paymentStatus = filters.paymentStatus;
  }

  if (filters.courseName) {
    params.courseName = filters.courseName;
  }

  if (filters.batchName) {
    params.batchName = filters.batchName;
  }

  const response = await request({
    url: apiUrls.student.FETCH_ALL_STUDENTS,
    method: "GET",
    params,
  });
  return response;
};

export const useStudentsListQuery = (filters: TStudentsListFilters = {}) => {
  return useQuery({
    queryKey: [apiUrls.student.FETCH_ALL_STUDENTS, filters],
    queryFn: () => get(filters),
  });
};
