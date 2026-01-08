import React, { useEffect, useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import { useNotificationDetailsQuery } from "../../../apis/hooks/notification-hub/query/useNotificationDetails.query";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import SelectDropdown from "../../../@ui/select-dropdown/SelectDropdown";
import Flex from "../../../@ui/flex/Flex";
import TodaysFollowUpsTab from "./tabs/TodaysFollowUpsTab";
import OverdueFollowUpsTab from "./tabs/OverdueFollowUpsTab";
import UpcomingPaymentsTab from "./tabs/UpcomingPaymentsTab";

const LeadsNotification = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const { data, isLoading, refetch } = useNotificationDetailsQuery("leads");
  const [section, setSection] = useState("followUp");
  useEffect(() => {
    console.log("Full leads API response:", data);
  }, [data]);
  // Correcting the structure for notification leads
  const notificationLeads = useMemo(() => {
    if (!isLoading && data?.statusCode === 200) {
      return {
        followUp: data.data?.presentDayLeads || { bulkData: [], leads: [] },
        overDueFollowUp: data.data?.allDueLeads || { bulkData: [], leads: [] },
        upcomingPayments: data.data?.allUpcomingLeads || { bulkData: [], leads: [] },
      };
    }
    return {
      followUp: { bulkData: [], leads: [] },
      overDueFollowUp: { bulkData: [], leads: [] },
      upcomingPayments: { bulkData: [], leads: [] },
    };
  }, [data, isLoading]);
  
  useEffect(() => {
    console.log("Follow-Up Data:", notificationLeads.followUp);
    console.log("Overdue Follow-Up Data:", notificationLeads.overDueFollowUp);
    console.log("Upcoming Payments Data:", notificationLeads.upcomingPayments);
  }, [notificationLeads]);
  
  return (
    <SafeView>
      <AppHeader
        title="Leads"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />
      <ThemeScrollView reloadData={refetch} loading={isLoading} paddingHorizontal={16}>
          <Flex mt={10} mb={25}>
          <SelectDropdown
            label=""
            onChange={(e) => setSection(e)}
            options={[
              { label: "Todays follow up", value: "followUp" },
              { label: "Over Due follow up", value: "overDueFollowUp" },
              { label: "Upcoming Payments", value: "upcomingPayments" },
            ]}
            value={{
              label:
                section === "followUp"
                  ? "Todays follow up"
                  : section === "overDueFollowUp"
                  ? "Over Due follow up"
                  : "Upcoming Payments",
              value: section,
            }}
          />
        </Flex>

        {section === "followUp" && (
  <>
    {console.log("TodaysFollowUpsTab Props:", notificationLeads.followUp)}
    <TodaysFollowUpsTab
      bulkData={notificationLeads.followUp.bulkData}
      leads={notificationLeads.followUp.leads}
    />
  </>
)}
{section === "overDueFollowUp" && (
  <>
    {console.log("OverdueFollowUpsTab Props:", notificationLeads.overDueFollowUp)}
    <OverdueFollowUpsTab
      bulkData={notificationLeads.overDueFollowUp.bulkData}
      leads={notificationLeads.overDueFollowUp.leads}
    />
  </>
)}
{section === "upcomingPayments" && (
  <>
    {console.log("UpcomingPaymentsTab Props:", notificationLeads.upcomingPayments)}
    <UpcomingPaymentsTab
      bulkData={notificationLeads.upcomingPayments.bulkData}
      leads={notificationLeads.upcomingPayments.leads}
    />
  </>
)}

      </ThemeScrollView>
    </SafeView>
  );
};

export default LeadsNotification;

