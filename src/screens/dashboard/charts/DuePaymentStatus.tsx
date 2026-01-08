import { StyleSheet, View } from "react-native";
import React, { memo, useMemo, useState } from "react";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import PaymentLabel from "../components/PaymentLabel";
import { BarChart } from "react-native-gifted-charts";
import { CONSTANT } from "../../../constants";
import { formatOverduePaymentsGraphData } from "./utils/overdue-payment/formateOverduePayment";
import { useDashboardOverduePaymentQuery } from "../../../apis/hooks/dashboard/query/useDashboardOverduePayment.query";

import SelectYearDropdown from "./component/SelectYearDropdown";

const DuePaymentStatus = () => {
  const { data, isLoading } = useDashboardOverduePaymentQuery();
  const [year, setYear] = useState<number | undefined>(undefined);
  const { totalPayment, graphData, maxValue, yearTotal } = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      return formatOverduePaymentsGraphData(data.data, year);
    } else {
      return {
        totalPayment: 4,
        maxValue: 0,
        graphData: [
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
        ],
        yearTotal: 4,
      };
    }
  }, [data, isLoading, year]);
  return (
    <View style={styles.root}>
      <Flex mx={10} justify="space-between">
        <ScalableText style={styles.title} fontFamily="Medium">
          Due Payment Status
        </ScalableText>
        <Flex>
          <SelectYearDropdown onChange={setYear} />
        </Flex>
      </Flex>
      <Flex flexWrap="wrap" my={10}>
        <PaymentLabel
          amount={totalPayment}
          label="Overdue Amount "
          background="#FF0000"
          rupeeIcon="rupeeGraphRed"
        />
        {year && (
          <PaymentLabel
            amount={yearTotal}
            label={year + " Due Amount "}
            background="#FF0000"
            rupeeIcon="rupeeGraphRed"
          />
        )}
      </Flex>
      <Flex mt={20}>
        <BarChart
          key={"Overdue Amount"}
          barBorderTopLeftRadius={4}
          barBorderTopRightRadius={4}
          maxValue={maxValue > 10 ? maxValue : 4}
          noOfSections={4}
          initialSpacing={10}
          spacing={15}
          adjustToWidth
          endSpacing={-10}
          width={280}
          frontColor={"#FF0000"}
          barWidth={8}
          data={graphData}
          xAxisColor={"transparent"}
          yAxisColor={"transparent"}
          dashGap={2}
          showVerticalLines
          verticalLinesStrokeDashArray={[2]}
          verticalLinesColor={"#DCDCDC80"}
          isAnimated
          animationDuration={500}
          rulesColor={"#DCDCDC80"}
          verticalLinesThickness={1}
          yAxisTextStyle={{
            color: "#B1B9C1",
            fontSize: 10,
            fontFamily: "Poppins-Medium",
          }}
          xAxisLabelTextStyle={{
            color: "#B1B9C1",
            fontSize: 8,
            fontFamily: "Poppins-Regular",
          }}
          xAxisLabelTexts={CONSTANT.MONTHS}
          height={132}
        />
      </Flex>
    </View>
  );
};

export default memo(DuePaymentStatus);

const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.white,
    elevation: 4,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    overflow: "hidden",
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
    marginTop: 0,
  },
});
