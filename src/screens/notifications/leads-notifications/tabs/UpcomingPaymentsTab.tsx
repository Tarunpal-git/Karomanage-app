import React, { FC, useState, useMemo } from "react";
import Flex from "../../../../@ui/flex/Flex";
import Tabs from "../../../../@ui/tabs/Tabs";
import EmptyNotifications from "../../components/EmptyNotifications";
import NotificationItemCard from "../component/NotificationCardItem";
import { FlatList } from "react-native";

interface IUpcomingPaymentsTab {
  leads: any[];
  bulkData: any[];
}

const UpcomingPaymentsTab: FC<IUpcomingPaymentsTab> = ({ bulkData = [], leads = [] }) => {
  const [selectedTab, setSelectedTab] = useState("leads");
  const [openNotification, setOpenNotification] = useState<string | null>(null);

  // Filter notifications based on the selected tab
  const notifications = useMemo(() => {
    return selectedTab === "leads" ? leads : bulkData;
  }, [selectedTab, leads, bulkData]);

  const handleToggle = (formId: string) => {
    setOpenNotification((prev) => (prev === formId ? null : formId));
  };

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

      {notifications.length === 0 ? (
        <EmptyNotifications />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => `${item.formId}-${item.formTemplateId}-${item.name || 'unknown'}`}

          renderItem={({ item }) => (
            <NotificationItemCard
              notification={item}
              isOpen={openNotification === item.formId}
              onToggle={() => handleToggle(item.formId)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 10 }}
          ListEmptyComponent={<EmptyNotifications />}
        />
      )}
    </Flex>
  );
};

export default React.memo(UpcomingPaymentsTab);
