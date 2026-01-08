import React, { useMemo } from "react";
import SafeView from "../../@ui/safe-view/SafeView";
import AppHeader from "../../@ui/app-header/AppHeader";
import ThemeScrollView from "../../@ui/theme-scroll-view/ThemeScrollView";
import DashboardCard from "./components/DashboardCard";
import Flex from "../../@ui/flex/Flex";
import AutoHeightImage from "../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import { useDashboardQuery } from "../../apis/hooks/dashboard/query/useDashboard.query";
import { useUpcomingPaymentForecastQuery } from "../../apis/hooks/dashboard/query/useUpcomingPaymentForecast.query";
import { useDashboardReceivedPaymentQuery } from "../../apis/hooks/dashboard/query/useDashboardReceivedPayment.query";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../types/navigator/screen-navigator";
import PaymentForecast from "./charts/PaymentForecast";
import DuePaymentStatus from "./charts/DuePaymentStatus";
import ReceivedPayment from "./charts/ReceivedPayment";
import ExpensesChart from "./charts/ExpensesChart";
import Next5DaysPaymentForecast from "./charts/Next5DaysPaymentForecast";
import Last5DaysReceivedPayment from "./charts/Last5DaysReceivedPayment";
import OverdueStudentDetails from "./charts/OverdueStudentDetails";
import InsightsChart from "./charts/InsightsChart";
import moment from "moment";
import { View, StyleSheet } from "react-native";
import PaymentRestrictionNotice from "../../@ui/restriction/PaymentRestrictionNotice";
import { hasOnlyReadPermission } from "../../utils/fetchPermissionsTitle";

const Dashboard = () => {
  const {
    "0": totalStudents,
    "1": totalEmployee,
    "2": totalPaymentData,
  } = useDashboardQuery();

  const navigation = useNavigation<TScreenNavigator>();
  const hidePaymentInfo = hasOnlyReadPermission("Student");

  // Define query parameters
  const queryParams = useMemo(() => ({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  }), []);

  // Fetching data in parallel
  const { data: upcomingPaymentData, isLoading: isUpcomingPaymentLoading } = useUpcomingPaymentForecastQuery(queryParams);
  const { data: receivedPaymentData, isLoading: isReceivedPaymentLoading } = useDashboardReceivedPaymentQuery();

  // Calculate total upcoming payment amount
  const totalUpcomingPayment = useMemo(() => {
    return upcomingPaymentData?.data?.reduce((total: number, student: TPaymentForecast) => {
      return total + student.paymentForecast?.reduce((studentTotal: number, forecast: TPaymentForecastDetails) => {
        return moment(forecast.Details?.nextpaymentDate, "DD-MM-YYYY").isAfter(moment())
          ? studentTotal + (forecast.Details?.duePayment || 0)
          : studentTotal;
      }, 0);
    }, 0) || 0;
  }, [upcomingPaymentData]);

  // Calculate total received payment amount
  const totalReceivedPayment = useMemo(() => {
    return receivedPaymentData?.data?.reduce((total: number, payment: TReceivedForecastPaymentDetails) => {
      return total + (payment.receivedPayment || 0);
    }, 0) || 0;
  }, [receivedPaymentData]);

  return (
    <SafeView>
      <AppHeader
        showDrawer
        title="Dashboard"
        handleBackClick={() => navigation.navigate("Home")}
      />
      
      <ThemeScrollView
        loading={
          totalStudents.isLoading ||
          totalEmployee.isLoading ||
          totalPaymentData.isLoading ||
          isUpcomingPaymentLoading ||
          isReceivedPaymentLoading
        }
        paddingHorizontal={12}
      >
        <View style={styles.container}>
          <DashboardCard
            title="Total Students"
            count={Number(totalStudents?.data || 0)}
            icon="totalStudents"
          />
          <DashboardCard
            title="Total Employees"
            count={Number(totalEmployee?.data || 0)}
            icon="totalEmployee"
          />
          {hidePaymentInfo ? (
            <PaymentRestrictionNotice
              containerStyle={styles.paymentRestrictionCard}
              title="Access Restricted"
              description="You don’t have permission to view the course payments."
            />
          ) : (
            <>
              <DashboardCard
                title="Upcoming Payment"
                count={totalUpcomingPayment || totalPaymentData?.data?.totalUpcomingAmount || 0}
                icon="upcomingPayment"
                prefix={
                  <Flex mr={2}>
                    <AutoHeightImage source={IMAGES["rupee"]} width={7}/>
                  </Flex>
                }
              />
              <DashboardCard
                title="Received Payment"
                count={totalReceivedPayment || totalPaymentData?.data?.totalReceivedAmount || 0}
                icon="receivedPayment"
                prefix={
                  <Flex mr={2}>
                    <AutoHeightImage source={IMAGES["rupee"]} width={7} />
                  </Flex>
                }
              />
            </>
          )}
        </View>

        {!hidePaymentInfo && (
          <>
            <PaymentForecast />
            <DuePaymentStatus />
            <ReceivedPayment />
            <Next5DaysPaymentForecast />
            <Last5DaysReceivedPayment />
            <InsightsChart totalReceivedPayment={totalReceivedPayment} />
            <OverdueStudentDetails />
          </>
        )}
        <ExpensesChart />
      </ThemeScrollView>
    </SafeView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  paymentRestrictionCard: {
    width: "100%",
    marginTop: 10,
  },
});
