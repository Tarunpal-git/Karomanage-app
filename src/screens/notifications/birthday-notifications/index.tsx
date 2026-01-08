import React, { useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import { useNotificationDetailsQuery } from "../../../apis/hooks/notification-hub/query/useNotificationDetails.query";
import EmptyNotifications from "../components/EmptyNotifications";
import StudentNotificationItemCard from "./component/StudentNotificationItemCard";
import EmployeeNotificationItemCard from "./component/EmployeeNotificationItemCard";
 
const BirthdayNotification = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const { data, isLoading, refetch } = useNotificationDetailsQuery("birthday");
 
  // const birthdays: TBirthdays[] = useMemo(() => {
  //   if (!isLoading && data.statusCode === 200 ) {
  //     return [...data.data.birthdays?.employee, ...data.data.birthdays?.student];
  //   } else {
  //     return [];
  //   }
  // }, [isLoading, data]);  
 
  const birthdays: TBirthdays[] = useMemo(() => {
    if (!isLoading && data?.statusCode === 200) {
      // Access `employee` and `student` directly from `data.data`
      const employeeBirthdays = data.data?.employee?.map((item: TBirthdays) => ({
        ...item,
        type: "employee", // Add type for employee
      })) || [];
  
      const studentBirthdays = data.data?.student?.map((item: TBirthdays) => ({
        ...item,
        type: "student", // Add type for student
      })) || [];
  
      // Merge and return the notifications
      return [...employeeBirthdays, ...studentBirthdays];
    } else {
      // Return an empty array if loading or data is unavailable
      return [];
    }
  }, [isLoading, data]);
  
  const [openNotification, setOpenNotification] = useState<string | null>(null);
 
  const handleToggle = (id: string) => {
    setOpenNotification((prev) => (prev === id ? null : id));
  };
 
  return (
    <SafeView>
      <AppHeader
        title="Birthdays"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />
 
      <ThemeScrollView loading={isLoading} reloadData={refetch}>
        {birthdays.length === 0 && <EmptyNotifications />}
        {birthdays.map((notification) => {
          if (notification.type === "employee") {
            return (
              <EmployeeNotificationItemCard
                key={notification.employeeId}
                notification={notification}
                isOpen={!(openNotification === notification.employeeId)}
                onToggle={() => handleToggle(notification.employeeId)}
              />
            );
          } else {
            return (
              <StudentNotificationItemCard
                key={notification.rollNo}
                onToggle={() => handleToggle(notification.rollNo)}
                isOpen={!(openNotification === notification.rollNo)}
                notification={notification}
              />
            );
          }
        })}
      </ThemeScrollView>
    </SafeView>
  );
};
 
export default BirthdayNotification;
 