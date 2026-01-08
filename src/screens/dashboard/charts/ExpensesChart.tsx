import { StyleSheet, View } from "react-native";
import React, { memo, useMemo, useState } from "react";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import PaymentLabel from "../components/PaymentLabel";
import { BarChart } from "react-native-gifted-charts";
import { CONSTANT } from "../../../constants";
import { useDashboardExpensesQuery } from "../../../apis/hooks/dashboard/query/useDashboardExpenses.query";
import Center from "../../../@ui/center/Center";

import moment from "moment";
import { formateExpensesGraphData } from "./utils/expenses/formateExpensesGraphData";
import SelectYearDropdown from "./component/SelectYearDropdown";

const ExpensesChart = () => {
  const { data, isLoading } = useDashboardExpensesQuery();
  const [year, setYear] = useState(moment().year());

  const { graphData, totalExpenses, maxValue } = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      return formateExpensesGraphData(data.data, year);
    } else {
      return {
        maxValue: 4,
        totalExpenses: 0,
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
      };
    }
  }, [data, isLoading, year]);

  return (
    <View style={styles.root}>
      {isLoading && <Center loading styles={{ minHeight: 175 }} />}
      {!isLoading && (
        <View>
          <Flex mx={10} justify="space-between">
            <ScalableText style={styles.title} fontFamily="Medium">
              Expenses
            </ScalableText>
            <Flex>
              <SelectYearDropdown onChange={setYear} />
            </Flex>
          </Flex>
          <Flex my={10}>
          <PaymentLabel
              amount={totalExpenses}
              label="Total Expenses"
              background="#FFA500"
              rupeeIcon="ruppeGraphYellow"
              amountStyle={{ width: 50, fontSize: 12 }}
            />
          </Flex>

          <Flex mt={20}>
            <BarChart
              key={"Expenses chart"}
              overflowTop={10}
              barBorderTopLeftRadius={4}
              barBorderTopRightRadius={4}
              maxValue={maxValue > 10 ? maxValue : 4}
              noOfSections={4}
              initialSpacing={10}
              spacing={15}
              adjustToWidth
              endSpacing={-10}
              width={280}
              frontColor={"#FFA500"}
              barWidth={8}
              data={graphData}
              xAxisColor={"transparent"}
              yAxisColor={"transparent"}
              dashGap={2}
              showVerticalLines
              verticalLinesStrokeDashArray={[2]}
              verticalLinesColor={"#DCDCDC80"}
              isAnimated
              animationDuration={1200}
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
      )}
    </View>
  );
};

export default memo(ExpensesChart);

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
});
