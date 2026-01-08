


import React, { useMemo, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../../types/navigator/screen-navigator";
import { RootState } from "../../../../app/store";

import SafeView from "../../../../@ui/safe-view/SafeView";
import AppHeader from "../../../../@ui/app-header/AppHeader";
import Tabs from "../../../../@ui/tabs/Tabs";
import Flex from "../../../../@ui/flex/Flex";
import ThemeScrollView from "../../../../@ui/theme-scroll-view/ThemeScrollView";

import { useGetLeadFollowUpQuery } from "../../../../apis/hooks/lead-management/query/useGetLeadFollowUp.query";
import { mapLeadFollowUpToFormEnquiry } from "./utils/mapLeadFollowUpResponse";

import EnquiryDetailsTab from "./tabs/EnquiryDetailsTab";
import AnnouncementHistory from "../../../students/student-details/sections/announcement-history/AnnouncementHistory";


const FormEnquiryDetails = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const [tab, setTab] = useState<"enquiryDetails" | "announcementHistory">(
    "enquiryDetails"
  );

  // 🔹 Route params
  const { leadId, formTemplateId } =
    useRoute<RouteProp<TScreenNavigatorParams, "FormEnquiryDetails">>().params;

  // 🔹 Auth data (required for API)
  const { customerId, organizationId } = useSelector(
    (state: RootState) => state.auth
  );

  // 🔹 Lead Source Type (static for now)
  const leadSourceType = "form";

  // ✅ NEW API CALL
  const {
    data: newApiData,
    isLoading,
    refetch,
  } = useGetLeadFollowUpQuery({
    leadId: leadId,
    customerId,
    organizationId,
    leadSourceType,
  });
  // 🔹 Debug (remove later)

  // ✅ Map API response to enquiry format
  const enquiryDetails: TFormEnquiry | undefined = useMemo(() => {
    if (!isLoading && newApiData) {
      return mapLeadFollowUpToFormEnquiry(newApiData, formTemplateId);
    }
    return undefined;
  }, [isLoading, newApiData, formTemplateId]);
  console.log("Lead FollowUp API Responseiiiii:", enquiryDetails);

  return (
    <SafeView>
      <AppHeader
        title="Form Details"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />

      {/* 🔹 Tabs */}
      <Flex my={10} mx={25}>
        <Tabs
          tabs={[
            { label: "Enquiry Details", value: "enquiryDetails", flex: 1 },
            {
              label: "Announcement\nHistory",
              value: "announcementHistory",
              flex: 2,
            },
          ]}
          value={tab}
          onChange={(value) => setTab(value)}
        />
      </Flex>

      {/* 🔹 Content */}
      <ThemeScrollView
        loading={isLoading}
        reloadData={refetch}
        paddingHorizontal={0}
      >
        {tab === "enquiryDetails" && enquiryDetails && (
          <Flex>
            <EnquiryDetailsTab refetch={refetch} details={enquiryDetails} />
          </Flex>
        )}

        {tab === "announcementHistory" && (
          <AnnouncementHistory
            announcements={enquiryDetails?.formData?.announcements ?? []}
          />
        )}
      </ThemeScrollView>
    </SafeView>
  );
};

export default FormEnquiryDetails;


// import React, { useMemo, useState } from "react";
// import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
// import {
//   TScreenNavigator,
//   TScreenNavigatorParams,
// } from "../../../../types/navigator/screen-navigator";
// import SafeView from "../../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../../@ui/app-header/AppHeader";
// import Tabs from "../../../../@ui/tabs/Tabs";
// import Flex from "../../../../@ui/flex/Flex";
// import ThemeScrollView from "../../../../@ui/theme-scroll-view/ThemeScrollView";
// import { useFetchFormEnquiryDetailsQuery } from "../../../../apis/hooks/lead-management/query/useFetchFormEnquiryDetails.query";
// import { useGetLeadFollowUpQuery } from "../../../../apis/hooks/lead-management/query/useGetLeadFollowUp.query";
// import { mapLeadFollowUpToFormEnquiry } from "./utils/mapLeadFollowUpResponse";
// import EnquiryDetailsTab from "./tabs/EnquiryDetailsTab";
// import AnnouncementHistory from "../../../students/student-details/sections/announcement-history/AnnouncementHistory";
// // import CallHistoryTab from "./tabs/CallHistoryTab";

// const FormEnquiryDetails = () => {
//   const navigation = useNavigation<TScreenNavigator>();
//   const [tab, setTab] = useState("enquiryDetails");

//   const { formId, formTemplateId } =
//     useRoute<RouteProp<TScreenNavigatorParams, "FormEnquiryDetails">>().params;

//   // ✅ NEW API CALL - getLeadFollowUp
//   const {
//     data: newApiData,
//     isLoading: isLoadingNewApi,
//     refetch: refetchNewApi,
//   } = useGetLeadFollowUpQuery({
//     leadId: formId, // formId is actually leadId from new API mapping
    
//   });
//   // 👇 Yaha console log laga
// console.log("Lead FollowUp API Data:", newApiData);
// console.log("Is Loading:", isLoadingNewApi);

//   // ✅ OLD API CALL (commented - can remove later)
//   // const { data, isLoading, refetch } = useFetchFormEnquiryDetailsQuery({
//   //   formId,
//   //   formTemplateId,
//   // });

//   // ✅ MAP NEW API RESPONSE TO FORM ENQUIRY FORMAT
//   const enquiryDetails: TFormEnquiry | undefined = useMemo(() => {
//     if (!isLoadingNewApi && newApiData) {
//       const mapped = mapLeadFollowUpToFormEnquiry(newApiData, formTemplateId);
//       console.log("🔄 Mapped Lead FollowUp:", mapped);
//       console.log("🔄 formTemplateId:", formTemplateId);
//       console.log("🔄 Mapped formTemplateId:", mapped?.formTemplateId);
//       return mapped;
//     }
//     return undefined;
//   }, [isLoadingNewApi, newApiData, formTemplateId]);

//   // ✅ Use new API loading state
//   const isLoading = isLoadingNewApi;
//   const refetch = refetchNewApi;

//   return (
//     <SafeView>
//       <AppHeader
//         title="Form Details"
//         showDrawer={false}
//         handleBackClick={() => navigation.goBack()}
//       />
//       <Flex my={10} mx={25}>
//         <Tabs
//           tabs={[
//             { label: "Enquiry Details", value: "enquiryDetails", flex: 1 },
//             {
//               label: "Announcement\nHistory",
//               value: "announcementHistory",
//               flex: 2,
//             },
//             // { label: "Call\nHistory", value: "callHistory", flex: 1 },
//           ]}
//           onChange={(e) => setTab(e)}
//           value={tab}
//         />
//       </Flex>

//       <ThemeScrollView
//         loading={isLoading}
//         reloadData={refetch}
//         paddingHorizontal={0}
//       >
//         {tab === "enquiryDetails" && enquiryDetails && (
//           <Flex>
//             <EnquiryDetailsTab refetch={refetch} details={enquiryDetails} />
//           </Flex>
//         )}
//         {tab === "announcementHistory" && (
//           <AnnouncementHistory
//             announcements={enquiryDetails?.formData?.announcements ?? []}
//           />
//         )}
//         {/* {tab === "callHistory" && (
//           <Flex>
//             <CallHistoryTab enquiryDetails={enquiryDetails} />
//           </Flex>
//         )} */}
//       </ThemeScrollView>
//     </SafeView>
//   );
// };

// export default FormEnquiryDetails;

