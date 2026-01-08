import React, { useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../types/navigator/screen-navigator";
import Flex from "../../../@ui/flex/Flex";
import Tabs from "../../../@ui/tabs/Tabs";
import { useEnquiryDetailsQuery } from "../../../apis/hooks/enquiry/query/useEnquiryDetails.query";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import EnquiryDetailsTab from "./tabs/EnquiryDetailsTab";
// import CallHistoryTab from "./tabs/CallHistoryTab";
import AnnouncementHistory from "../../students/student-details/sections/announcement-history/AnnouncementHistory";

const EnquiryDetails = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const [tab, setTab] = useState("enquiryDetails");

  const { id } =
    useRoute<RouteProp<TScreenNavigatorParams, "EnquiryDetails">>().params;

  const { data, isLoading, refetch } = useEnquiryDetailsQuery(id);

  const enquiryDetails: TEnquiryData = useMemo(() => {
    if (!isLoading && data?.dataArray) {
      return data.dataArray;
    } else {
      return undefined;
    }
  }, [isLoading, data]);

  return (
    <SafeView>
      <AppHeader
        title="Enquiry"
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
            <EnquiryDetailsTab refetch={refetch} details={enquiryDetails} />
          </Flex>
        )}
        {tab === "announcementHistory" && (
          <AnnouncementHistory
            announcements={enquiryDetails?.announcements ?? []}
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

export default EnquiryDetails;
