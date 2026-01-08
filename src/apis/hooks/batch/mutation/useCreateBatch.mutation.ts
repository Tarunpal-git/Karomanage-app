import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";
import moment from "moment";

const createBatch = async (data: any) => {
  const user = store.getState().auth.authUser;
  const selectedOrganization = store.getState().auth.selectedOrganization;
  const payload = {
    user: {
      userCustomerId: user?.customerId,
      userCustomerName: user?.customerName,
      userCustomerEmail: user?.customerEmail,
      roleName: "",
      roleId: "",
      userEmployeeId: user?.employeeId || "",
    },
    customerId: selectedOrganization?.customerId,
    organizationId: selectedOrganization?.organizationId,
    batch: [
      {
        batchName: data.batchName,
        batchDescription: data.batchDescription,
        batchStartDate: data.batchStartDate ? moment(data.batchStartDate).format("DD/MM/YYYY") : "",
        batchEndDate: data.batchEndDate ? moment(data.batchEndDate).format("DD/MM/YYYY") : "",
        batchClassStartTime: data.setBatchTime === "Yes" ? data.batchClassStartTime : "",
        batchClassEndTime: data.setBatchTime === "Yes" ? data.batchClassEndTime : "",
      },
    ],
    students: [],
    courses: [{
      courseId: data.courseId,
      courseStatus: "active"
    }],
    subjects: [],
  };
  return request({
    url: apiUrls.batch.CREATE_BATCH,
    method: "POST",
    data: payload,
  });
};

export const useCreateBatchMutation = () => useMutation({ mutationFn: createBatch }); 