import React, { useMemo, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../../types/navigator/screen-navigator";
import SafeView from "../../../../@ui/safe-view/SafeView";
import AppHeader from "../../../../@ui/app-header/AppHeader";
import Tabs from "../../../../@ui/tabs/Tabs";
import Flex from "../../../../@ui/flex/Flex";
import ThemeScrollView from "../../../../@ui/theme-scroll-view/ThemeScrollView";
import EnquiryDetailsTab from "./tabs/EnquiryDetailsTab";
import AnnouncementHistory from "../../../students/student-details/sections/announcement-history/AnnouncementHistory";
// import CallHistoryTab from "./tabs/CallHistoryTab";
import { useFetchSingleBulkFormDataQuery } from "../../../../apis/hooks/upload-forms/query/useFetchSingleBulkFormData.query";

const BulkDataFormDetails = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const [tab, setTab] = useState("enquiryDetails");

  const { formId, formTemplateId } =
    useRoute<RouteProp<TScreenNavigatorParams, "BulkDataFormDetails">>().params;

  const { data, isLoading, refetch } = useFetchSingleBulkFormDataQuery({
    formId,
    formTemplateId,
  });

  const enquiryDetails: TBulkDataEnquiry = useMemo(() => {
    if (!isLoading && data?.statusCode === 200) {
      return data.data;
    } else {
      return undefined;
    }
  }, [isLoading, data]);

  return (
    <SafeView>
      <AppHeader
        title="Bulk Form Details"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />
      <Flex my={10} mx={25}>
        <Tabs
          tabs={[
            { label: "Enquiry Details", value: "enquiryDetails", flex: 1 },
            {
              label: "Announcement\nHistory",
              value: "announcementHistory",
              flex: 2,
            },
            // { label: "Call\nHistory", value: "callHistory", flex: 1 },
          ]}
          onChange={(e) => setTab(e)}
          value={tab}
        />
      </Flex>

      <ThemeScrollView
        loading={isLoading}
        reloadData={refetch}
        paddingHorizontal={0}
      >
        {tab === "enquiryDetails" && (
          <Flex>
            <EnquiryDetailsTab refetch={refetch} data={enquiryDetails} />
          </Flex>
        )}
        {tab === "announcementHistory" && (
          <AnnouncementHistory
            announcements={enquiryDetails?.formData?.announcements ?? []}
          />
        )}
        {/* {tab === "callHistory" && (
          <Flex>
            <CallHistoryTab enquiryDetails={enquiryDetails} />
          </Flex>
        )} */}
      </ThemeScrollView>
    </SafeView>
  );
};

export default BulkDataFormDetails;
