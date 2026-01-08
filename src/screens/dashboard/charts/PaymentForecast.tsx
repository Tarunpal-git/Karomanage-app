// import { StyleSheet, View } from "react-native";
// import React, { memo, useMemo, useState } from "react";
// import Flex from "../../../@ui/flex/Flex";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import { COLORS } from "../../../colors";
// import PaymentLabel from "../components/PaymentLabel";
// import { LineChart } from "react-native-gifted-charts";
// import { CONSTANT } from "../../../constants";
// import { formateUpcomingPaymentForecast } from "./utils/upcoming-payment-forecast/formateUpcomingPaymentForecast";
// import { useStudentFeeForecastQuery } from "../../../apis/hooks/dashboard/query/useStudentFeeForecast.query";
// import SelectYearDropdown from "./component/SelectYearDropdown";
// import SelectMonthDropdown from "./component/SelectMonthDropdown";
// import moment from "moment";

// const PaymentForecast = () => {
//   const { data, isLoading } = useStudentFeeForecastQuery();
//   const [year, setYear] = useState<number | undefined>(undefined);
//   const [month, setMonth] = useState<number | undefined>(undefined);

//   const { graphData, maxValue, totalPayment, yearTotal, monthlyTotal } =
//     useMemo(() => {
//       if (!isLoading && data.statusCode === 200) {
//         return formateUpcomingPaymentForecast(data.data, year, month);
//       } else {
//         return {
//           graphData: [
//             { value: 0 },
//             { value: 0 },
//             { value: 0 },
//             { value: 0 },
//             { value: 0 },
//             { value: 0 },
//             { value: 0 },
//             { value: 0 },
//             { value: 0 },
//             { value: 0 },
//             { value: 0 },
//             { value: 0 },
//           ],
//           totalPayment: 0,
//           maxValue: 0,
//           yearTotal: 0,
//           monthlyTotal: 0,
//         };
//       }
//     }, [isLoading, data, year, month]);

//   return (
//     <View style={styles.root}>
//       <Flex mx={10} justify="space-between">
//         <ScalableText style={styles.title} fontFamily="Medium">
//           Payment Forecast
//         </ScalableText>
//         <Flex>
//           <SelectYearDropdown
//             sort="ascending"
//             onChange={(e) => {
//               setYear(e);
//               setMonth(undefined);
//             }}
//           />
//           <SelectMonthDropdown onChange={setMonth} value={month} />
//         </Flex>
//       </Flex>
//       <Flex flexWrap="wrap" my={10}>
//         <PaymentLabel
//           amount={totalPayment}
//           label="Upcoming Payment "
//           background="#33FF99"
//           rupeeIcon="rupeeGraphGreen"
//         />
//         {year && (
//           <PaymentLabel
//             amount={yearTotal}
//             label={`${year} Upcoming Payment `}
//             background="#33FF99"
//             rupeeIcon="rupeeGraphGreen"
//           />
//         )}
//         {month && (
//           <PaymentLabel
//             amount={monthlyTotal}
//             label={`${moment()
//               .month(month - 1)
//               .format("MMMM")} Upcoming Payment `}
//             background="#33FF99"
//             rupeeIcon="rupeeGraphGreen"
//           />
//         )}
//       </Flex>
//       <Flex mt={20}>
//         <LineChart
//           key={"Payment forecast"}
//           maxValue={maxValue > 10 ? maxValue : 4}
//           noOfSections={4}
//           initialSpacing={12}
//           spacing={23}
//           adjustToWidth
//           endSpacing={month ? 2 : -20}
//           width={280}
//           areaChart
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           data={graphData as any[]}
//           startFillColor="#33FF99"
//           startOpacity={0.8}
//           endFillColor="#fff"
//           endOpacity={12}
//           xAxisColor={"transparent"}
//           yAxisColor={"transparent"}
//           dataPointsColor1="transparent"
//           dashGap={2}
//           showVerticalLines
//           verticalLinesStrokeDashArray={[2]}
//           verticalLinesColor={"#DCDCDC80"}
//           isAnimated
//           animationDuration={1200}
//           rulesColor={"#DCDCDC80"}
//           verticalLinesThickness={1}
//           color1="#00FF00"
//           yAxisTextStyle={{
//             color: "#B1B9C1",
//             fontSize: 10,
//             fontFamily: "Poppins-Medium",
//           }}
//           xAxisLabelTextStyle={{
//             color: "#B1B9C1",
//             fontSize: 8,
//             fontFamily: "Poppins-Regular",
//           }}
//           xAxisLabelTexts={CONSTANT.MONTHS}
//           height={132}
//         />
//       </Flex>
//     </View>
//   );
// };

// export default memo(PaymentForecast);

// const styles = StyleSheet.create({
//   root: {
//     backgroundColor: COLORS.white,
//     elevation: 4,
//     padding: 10,

//     borderRadius: 10,
//     marginVertical: 20,
//   },
//   title: {
//     color: "#4B5E70",
//     fontSize: 12,
//   },
//   dropDownRoot: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     minWidth: 50,
//     marginLeft: 5,
//     borderWidth: 0.5,
//     padding: 3,
//     borderRadius: 3,
//     borderColor: "#DBD8D8",
//   },
//   dropdownText: {
//     fontSize: 9,
//     marginTop: 0,
//   },
// });

import React, { useState, useMemo } from "react";
import { StyleSheet, View, Text, Dimensions, Animated } from "react-native";
import {
  PanGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { LineChart } from "react-native-gifted-charts";
import moment from "moment";
import PaymentLabel from "../components/PaymentLabel";
import SelectYearDropdown from "./component/SelectYearDropdown";
import SelectMonthDropdown from "./component/SelectMonthDropdown";
import { formateUpcomingPaymentForecast } from "./utils/upcoming-payment-forecast/formateUpcomingPaymentForecast";
import { useStudentFeeForecastQuery } from "../../../apis/hooks/dashboard/query/useStudentFeeForecast.query";
import { COLORS } from "../../../colors";
import { CONSTANT } from "../../../constants";

const PaymentForecast = () => {
  const { data, isLoading } = useStudentFeeForecastQuery();
  const [year, setYear] = useState<number | undefined>(undefined);
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [tooltipData, setTooltipData] = useState({
    x: 0,
    y: 0,
    value: null,
    index: null,
  });
  const [tooltipOpacity] = useState(new Animated.Value(0));

  const { graphData, maxValue, totalPayment, yearTotal, monthlyTotal } =
    useMemo(() => {
      if (!isLoading && data.statusCode === 200) {
        return formateUpcomingPaymentForecast(data.data, year, month);
      } else {
        return {
          graphData: Array(12).fill({ value: 0 }),
          totalPayment: 0,
          maxValue: 0,
          yearTotal: 0,
          monthlyTotal: 0,
        };
      }
    }, [isLoading, data, year, month]);

  const showTooltip = () => {
    Animated.timing(tooltipOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const hideTooltip = () => {
    Animated.timing(tooltipOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleGesture = ({ nativeEvent }) => {
    const { x } = nativeEvent;
    const chartWidth = Dimensions.get("window").width - 40; // Adjust based on chart container width
    const index = Math.round((x / chartWidth) * (graphData.length - 1));

    if (graphData[index]) {
      const adjustedX = Math.min(
        Math.max(nativeEvent.x - 60, 0),
        chartWidth - 120
      );
      const adjustedY = Math.max(nativeEvent.y - 10, 10);
      setTooltipData({
        x: adjustedX,
        y: adjustedY,
        value: graphData[index]?.value || 0,
        index,
      });
      showTooltip();
    } else {
      hideTooltip();
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment Forecast</Text>
        <View style={styles.filters}>
          <SelectYearDropdown
            sort="ascending"
            onChange={(e) => {
              setYear(e);
              setMonth(undefined);
            }}
          />
          <SelectMonthDropdown onChange={setMonth} value={month} />
        </View>
      </View>

      <View style={styles.labels}>
        <PaymentLabel
          amount={totalPayment}
          label="Upcoming Payment"
          background="#33FF99"
          rupeeIcon="rupeeGraphGreen"
        />
        {year && (
          <PaymentLabel
            amount={yearTotal}
            label={`${year} Upcoming Payment`}
            background="#33FF99"
            rupeeIcon="rupeeGraphGreen"
          />
        )}
        {month && (
          <PaymentLabel
            amount={monthlyTotal}
            label={`${moment()
              .month(month - 1)
              .format("MMMM")} Upcoming Payment`}
            background="#33FF99"
            rupeeIcon="rupeeGraphGreen"
          />
        )}
      </View>

      <PanGestureHandler onGestureEvent={handleGesture}>
        <TapGestureHandler onHandlerStateChange={handleGesture}>
          <View>
            <LineChart
              key={"Payment forecast"}
              maxValue={maxValue > 10 ? maxValue : 4}
              noOfSections={4}
              initialSpacing={12}
              spacing={23}
              adjustToWidth
              endSpacing={month ? 2 : -20}
              width={280}
              areaChart
              data={graphData as any[]}
              startFillColor="#33FF99"
              startOpacity={0.8}
              endFillColor="#fff"
              endOpacity={12}
              xAxisColor={"transparent"}
              yAxisColor={"transparent"}
              dataPointsColor1="transparent"
              dashGap={2}
              showVerticalLines
              verticalLinesStrokeDashArray={[2]}
              verticalLinesColor={"#DCDCDC80"}
              isAnimated
              animationDuration={1200}
              rulesColor={"#DCDCDC80"}
              verticalLinesThickness={1}
              color1="#00FF00"
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
            {tooltipData.value !== null && (
              <Animated.View
                style={[
                  styles.tooltipContainer,
                  {
                    left: tooltipData.x,
                    top: tooltipData.y,
                    opacity: tooltipOpacity,
                  },
                ]}
              >
                <View style={styles.tooltipBox}>
                  <Text style={styles.tooltipTitle}>
                    {CONSTANT.MONTHS[tooltipData.index]}
                  </Text>
                  <Text style={styles.tooltipValue}>
                    <View style={styles.tooltipDot} />₹
                    {tooltipData.value.toLocaleString()}
                  </Text>
                </View>
              </Animated.View>
            )}
          </View>
        </TapGestureHandler>
      </PanGestureHandler>
    </View>
  );
};

export default PaymentForecast;

const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.white,
    elevation: 4,
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 12,
    color: "#4B5E70",
    fontFamily:"Medium"
  },
  filters: {
    flexDirection: "row",
  },
  labels: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  tooltipContainer: {
    position: "absolute",
    alignItems: "center",
  },
  tooltipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00FF00",
  },
  tooltipBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipTitle: {
    color: "#555",
    fontSize: 12,
    fontWeight: "bold",
  },
  tooltipValue: {
    color: "#555",
    fontSize: 14,
    fontWeight: "bold",
  },
});
