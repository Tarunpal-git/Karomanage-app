import React, { FC, useState } from "react";
import { Text } from "react-native";
import Flex from "../../../../@ui/flex/Flex";
import Tabs from "../../../../@ui/tabs/Tabs";
import EmptyNotifications from "../../components/EmptyNotifications";

interface ITodaysFollowUpsTab {
  bulkData: any[];
  leads: any[];
}

const TodaysFollowUpsTab: FC<ITodaysFollowUpsTab> = ({ bulkData = [], leads = [] }) => {
  console.log("TodaysFollowUpsTab bulkData:", bulkData);
  console.log("TodaysFollowUpsTab leads:", leads);
  const [selectedTab, setSelectedTab] = useState("leads");
  return (
    <Flex flex={1} flexDirection="column">
      <Tabs
        tabs={[
          { label: "Leads", value: "leads" },
          { label: "Uploaded Leads", value: "bulkData" },
        ]}
        onChange={(e) => setSelectedTab(e)}
        value={selectedTab}
      />
      {bulkData.length === 0 && leads.length === 0 ? (
        <EmptyNotifications />
      ) : (
        <Flex flexDirection="column" mt={10}>
          {leads.map((lead, index) => (
            <Text key={index} style={{ marginBottom: 8 }}>
              Lead: {lead.name} (Follow-up Date: {lead.followUpDate})
            </Text>
          ))}
          {bulkData.map((item, index) => (
            <Text key={index} style={{ marginBottom: 8 }}>
              Bulk Data: {item.name} (Form ID: {item.formId})
            </Text>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default TodaysFollowUpsTab;
