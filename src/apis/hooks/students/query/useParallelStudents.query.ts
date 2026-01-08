import { useQueries } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const fetchStudentById = async (rollNo: string) => {
  const response = await request({
    url: apiUrls.student.FETCH_STUDENT_DETAILS,
    method: "GET",
    params: {
      rollNo: rollNo,
    },
  });
  return response;
};

export const useParallelStudentsQuery = (students: TBatchStudent[]) => {
  return useQueries({
    queries: students.map((student) => {
      return {
        queryKey: [apiUrls.student.FETCH_STUDENT_DETAILS, student.rollNo],
        queryFn: () => fetchStudentById(student.rollNo),
      };
    }),
    combine: (results) => {
      const formattedData = results.map((result) => {
        if (result.data?.statuscode === 200) {
          return result.data.data;
        }
      });

      return formattedData;
    },
  });
};
