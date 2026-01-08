import { useMemo } from "react";
import { useGetStatusQuery } from "../../apis/hooks/enquiry/query/useGetStatus.query";

type TUseDynamicFlagsParams = {
  flag: "csv" | "global" | "enquiry" | "form";
  formTemplateId?: string;
  formBulkDataId?: string;
};

export const useDynamicFlags = (params: TUseDynamicFlagsParams) => {
  const { data, isLoading, error } = useGetStatusQuery(params);

  const flags = useMemo(() => {
    console.log("[useDynamicFlags] Raw API Response:", data);
    console.log("[useDynamicFlags] Params:", params);
    
    if (data?.statusCode === 200 && data?.data?.tags) {
      console.log("[useDynamicFlags] Tags found:", data.data.tags);
      
      // Filter tags based on flag and global
      const filteredTags = data.data.tags.filter(
        (tag: any) => tag.flag === params.flag || tag.flag === "global"
      );
      
      console.log("[useDynamicFlags] Filtered tags:", filteredTags);

      // Transform to the format expected by the dropdown
      const result = [
        { label: "Select Flag", value: "" },
        ...filteredTags.map((tag: any) => ({
          label: tag.tagName,
          value: tag.tagName,
        })),
      ];
      
      console.log("[useDynamicFlags] Final flags array:", result);
      return result;
    }
    
    console.log("[useDynamicFlags] No tags found or invalid response");
    return [{ label: "Select Flag", value: "" }];
  }, [data, params.flag]);

  return {
    flags,
    isLoading,
    error,
  };
}; 