import { StyleSheet, View } from "react-native";
import React, { memo, useMemo, useState } from "react";
import { COLORS } from "../../../colors";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";

import { usePaidPaymentStudentQuery } from "../../../apis/hooks/dashboard/query/usePaidPaymentStudent.query";
import ReceivedPaymentTable from "./received-payment-table/ReceivedPaymentTable";
import Center from "../../../@ui/center/Center";
import DateRangePicker from "../../../@ui/date-range-picker/DateRangePicker";

const Last5DaysReceivedPayment = () => {
  const [forecastDates, setForecastDates] = useState({
    startDate: "",
    endDate: "",
    selectedCount: 5,
  });

  const { data, isLoading } = usePaidPaymentStudentQuery({
    startDate: forecastDates.startDate,
    endDate: forecastDates.endDate,
  });

  const paymentForecast: TReceivedPaymentForecast[] = useMemo(() => {
    if (!isLoading && data) {
      return data.data;
    } else {
      return [];
    }
  }, [isLoading, data]);

  return (
    <View style={styles.root}>
      <Flex ml={10} justify="space-between" flexWrap="wrap" my={10}>
        <ScalableText style={styles.title} fontFamily="Medium">
          Last {forecastDates.selectedCount} Days Received Payment
        </ScalableText>
        <Flex>
          <DateRangePicker onChange={setForecastDates} />
        </Flex>
      </Flex>

      {isLoading && <Center styles={{ minHeight: 150 }} loading />}

      {!isLoading && <ReceivedPaymentTable forecast={paymentForecast} />}
    </View>
  );
};

export default memo(Last5DaysReceivedPayment);

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
