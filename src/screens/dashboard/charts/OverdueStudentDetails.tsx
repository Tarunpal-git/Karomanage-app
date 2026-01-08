import { StyleSheet, View } from "react-native";
import React, { memo, useMemo } from "react";
import { COLORS } from "../../../colors";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import PaymentLabel from "../components/PaymentLabel";
import { useOverduePaymentStudentQuery } from "../../../apis/hooks/dashboard/query/useOverduePaymentStudent.query";
import { calculateDuePaymentForecast } from "./utils/due-payment-forecast/calculateDuePaymentForecast";
import Center from "../../../@ui/center/Center";
import OverduePaymentTable from "./overdue-payment-table/OverduePaymentTable";

import NotifyButton from "./component/NotifyButton";

const OverdueStudentDetails = () => {
  // const [forecastDates, setForecastDates] = useState({
  //   startDate: "",
  //   endDate: "",
  //   selectedCount: 5,
  // });

  const { data, isLoading } = useOverduePaymentStudentQuery({
    endDate: "",
    startDate: "",
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
          Overdue Student Details
        </ScalableText>
        {/* <Flex>
          <DateRangePicker onChange={setForecastDates} />
        </Flex> */}
      </Flex>
      <Flex justify="space-between" my={10}>
        <PaymentLabel
          amount={duePaymentAmount}
          label="Overdue Payment"
          background="#FF0000"
          rupeeIcon="rupeeRedIcon"
        />
        {paymentForecast.length > 0 && (
          <NotifyButton forecastPayments={paymentForecast} />
        )}
      </Flex>
      {isLoading && <Center styles={{ minHeight: 150 }} loading />}

      {!isLoading && <OverduePaymentTable forecast={paymentForecast} />}
    </View>
  );
};

export default memo(OverdueStudentDetails);

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
});
