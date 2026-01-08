import { StyleSheet, View } from "react-native";
import React, { memo, useMemo } from "react";
import { COLORS } from "../../../colors";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import PaymentLabel from "../components/PaymentLabel";

import { useTotalInsightsQuery } from "../../../apis/hooks/dashboard/query/useTotalInsights.query";
import {
  LineSegment,
  VictoryContainer,
  VictoryLabel,
  VictoryPie,
} from "victory-native";

interface InsightsChartProps {
  totalReceivedPayment: number;
}

const InsightsChart = ({ totalReceivedPayment }: InsightsChartProps) => {
  const { "0": totalExpenses } = useTotalInsightsQuery();

  // const totalInsights = useMemo(() => {
  //   if (!totalExpenses.isLoading && !totalReceivedAmount.isLoading) {
  //     return {
  //       totalProfit:
  //         totalReceivedAmount.data?.totalReceivedAmount ??
  //         0 - totalExpenses.data,
  //       totalExpenditures: totalExpenses.data ?? 0,
  //     };
  //   } else {
  //     return {
  //       totalProfit: 0,
  //       totalExpenditures: 0,
  //     };
  //   }
  // }, [totalExpenses, totalReceivedAmount]);

 //UPDATED
  const totalInsights = useMemo(() => {
    if (!totalExpenses.isLoading) {
      const calculatedProfit =
        totalReceivedPayment - (totalExpenses.data ?? 0);

      return {
        totalProfit: Math.max(calculatedProfit, 0), // Ensure no negative profit
        totalExpenditures: totalExpenses.data ?? 0,
      };
    } else {
      return {
        totalProfit: 0,
        totalExpenditures: 0,
      };
    }
  }, [totalReceivedPayment, totalExpenses]);
  //UPDATE CLOSED


  return (
    <View style={styles.root}>
      <Flex mx={10} justify="space-between">
        <ScalableText style={styles.title} fontFamily="Medium">
          Total Insights
        </ScalableText>
      </Flex>
      <Flex mt={10} flexWrap="wrap">
        <PaymentLabel
          labelStyle={{ fontSize: 8, color: "#4B5E70" }}
          rootStyle={{ flexDirection: "row", alignItems: 'center', gap: -5 }} //gap reduced
          amount={totalInsights.totalProfit}
          label="Total Profit"
          background="#00FF00"
          rupeeIcon="rupeeGraphGreen"
        />

        <PaymentLabel
          labelStyle={{ fontSize: 8, color: "#4B5E70" }}
          rootStyle={{ marginLeft: 10, flexDirection: "row", alignItems: 'center', gap: -5 }} //gap reduced
          amount={totalInsights.totalExpenditures}
          label="Overall Expenditures"
          background="#0088FE"
          rupeeIcon="rupeeGraphDarkBlue"
        />
      </Flex>

      <Flex justify="center">
        <VictoryPie
          containerComponent={
            <VictoryContainer height={220} style={{ marginTop: -20 }} />
          }
          animate
          height={244}
          innerRadius={55}
          colorScale={["#0088FE", "#00FF7F"]}
          padAngle={() => 4}
          labelComponent={
            <VictoryLabel style={{ fontSize: 10, fill: "#AFAFAF" }} />
          }
          data={[
            {
              x: Number(totalInsights.totalExpenditures).toLocaleString(),
              y: totalInsights.totalExpenditures,
            },
            {
              x: Number(totalInsights.totalProfit).toLocaleString(),
              y: totalInsights.totalProfit,
            },
          ]}
          labelIndicator={
            <LineSegment style={{ stroke: "#0088FE", fill: "none" }} />
          }
          style={{
            labels: { color: "red" },
          }}
        />
      </Flex>
    </View>
  );
};

export default memo(InsightsChart);

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
});
