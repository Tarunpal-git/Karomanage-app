import React, { useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import { useNotificationDetailsQuery } from "../../../apis/hooks/notification-hub/query/useNotificationDetails.query";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import EmptyNotifications from "../components/EmptyNotifications";
import NotificationItemCard from "./component/NotificationItemCard";

const OverduePaymentNotification = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const { data, isLoading, refetch } = useNotificationDetailsQuery("overDue");
  const overduePayments: TNotificationOverdue[] = useMemo(() => {
    if (!isLoading && data?.statusCode === 200) {
      // return data.data?.overDue ?? [];
      return data.data ?? []; //Updated this line
    } else {
      return [];
    }
  }, [isLoading, data]);

  const [openNotification, setOpenNotification] = useState<string | null>(null);

  const handleToggle = (rollNo: string) => {
    setOpenNotification((prev) => (prev === rollNo ? null : rollNo));
  };

  return (
    <SafeView>
      <AppHeader
        title="Overdue Payments"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />
      <ThemeScrollView
        loading={isLoading}
        reloadData={refetch}
        paddingHorizontal={15}
      >
        {overduePayments.length === 0 && <EmptyNotifications />}
        {overduePayments.length > 0 &&
          overduePayments.map((notification) => (
            <NotificationItemCard
              notification={notification}
              key={notification.rollNo}
              isOpen={!(openNotification === notification.rollNo)}
              onToggle={() => handleToggle(notification.rollNo)}
            />
          ))}
      </ThemeScrollView>
    </SafeView>
  );
};

export default OverduePaymentNotification;
