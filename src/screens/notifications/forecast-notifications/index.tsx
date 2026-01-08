import React, { useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import { useNotificationDetailsQuery } from "../../../apis/hooks/notification-hub/query/useNotificationDetails.query";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import EmptyNotifications from "../components/EmptyNotifications";
import NotificationItemCard from "./component/NotificationItemCard";

const ForecastNotifications = () => {
  const navigation = useNavigation<TScreenNavigator>();

  const { data, isLoading, refetch } =
    useNotificationDetailsQuery("upcomingPayment");

  const forecastNotifications: TNotificationForecast[] = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      // return data.data?.upcomingForecast;
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
        title="5 days forecast"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />

      <ThemeScrollView loading={isLoading} reloadData={refetch}>
        {forecastNotifications?.length === 0 && <EmptyNotifications />}
        {forecastNotifications.map((notification) => (
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

export default ForecastNotifications;
