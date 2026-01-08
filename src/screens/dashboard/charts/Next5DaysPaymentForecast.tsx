import { StyleSheet, View } from "react-native";
import React, { memo, useMemo, useState } from "react";
import { COLORS } from "../../../colors";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import PaymentLabel from "../components/PaymentLabel";
import SmallGraphTable from "./small-table/SmallGraphTable";
import { useUpcomingPaymentForecastQuery } from "../../../apis/hooks/dashboard/query/useUpcomingPaymentForecast.query";
import Center from "../../../@ui/center/Center";
import { calculateDuePaymentForecast } from "./utils/due-payment-forecast/calculateDuePaymentForecast";
import DateRangePicker from "../../../@ui/date-range-picker/DateRangePicker";
import NotifyButton from "./component/NotifyButton";

const Next5DaysPaymentForecast = () => {
  const [forecastDates, setForecastDates] = useState({
    startDate: "",
    endDate: "",
    selectedCount: 5,
  });

  const { data, isLoading } = useUpcomingPaymentForecastQuery({
    startDate: forecastDates.startDate,
    endDate: forecastDates.endDate,
  });

  const paymentForecast: TPaymentForecast[] = useMemo(() => {
    if (!isLoading && data) {
      return data.data;
    } else {
      return [];
    }
  }, [isLoading, data]);

  const duePaymentAmount = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      return calculateDuePaymentForecast(data.data);
    } else {
      return 0;
    }
  }, [data, isLoading]);

  return (
    <View style={styles.root}>
      <Flex ml={10} justify="space-between" flexWrap="wrap">
        <ScalableText style={styles.title} fontFamily="Medium">
          Next {forecastDates.selectedCount} Days Payment Forecast
        </ScalableText>
        <Flex>
          <DateRangePicker onChange={setForecastDates} />
        </Flex>
      </Flex>

      <Flex justify="space-between" my={10}>
        <PaymentLabel
          amount={duePaymentAmount}
          label="Due Payment Forecast"
          background="#00FF00"
          rupeeIcon="rupeeGraphGreen"
        />
        {paymentForecast.length > 0 && (
          <NotifyButton forecastPayments={paymentForecast} />
        )}
      </Flex>

      {isLoading && <Center styles={{ minHeight: 150 }} loading />}

      {!isLoading && <SmallGraphTable forecast={paymentForecast} />}
    </View>
  );
};

export default memo(Next5DaysPaymentForecast);

const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.white,
    elevation: 4,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  title: {
    color: "#4B5E70",
    fontSize: 12,
  },
  dropDownRoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 50,
    marginLeft: 5,
    borderWidth: 0.5,
    padding: 3,
    borderRadius: 3,
    borderColor: "#DBD8D8",
  },
  dropdownText: {
    fontSize: 9,
    marginTop: 3,
    marginHorizontal: 5,
  },
  notifyBtn: {
    backgroundColor: "#696CFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 3,
  },
});
