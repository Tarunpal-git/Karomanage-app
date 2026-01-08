import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { memo } from "react";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import PaymentLabel from "../components/PaymentLabel";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import { BarChart } from "react-native-gifted-charts";
import { CONSTANT } from "../../../constants";

const EmployeeNetSalaryChart = () => {
  const data = [
    { value: 0 },
    { value: 0 },
    { value: 2000 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
  ];
  return (
    <View style={styles.root}>
      <Flex mx={10} justify="space-between">
        <ScalableText style={styles.title} fontFamily="Medium">
          Employee Net Salary Chart
        </ScalableText>
        <Flex>
          <TouchableOpacity style={styles.dropDownRoot}>
            <ScalableText style={styles.dropdownText} fontFamily="Medium">
              Year
            </ScalableText>
            <View style={{ transform: [{ rotate: "180deg" }] }}>
              <AutoHeightImage
                width={10}
                source={IMAGES.gridiconDropdownIcon}
              />
            </View>
          </TouchableOpacity>
        </Flex>
      </Flex>
      <PaymentLabel
        amount={37833}
        label="Overall Salary Pending"
        background="#FFA500"
        rupeeIcon="ruppeGraphYellow"
      />
      <Flex mt={20}>
        <BarChart
          barBorderTopLeftRadius={4}
          barBorderTopRightRadius={4}
          maxValue={2500}
          noOfSections={4}
          initialSpacing={10}
          spacing={15}
          adjustToWidth
          endSpacing={-10}
          width={280}
          frontColor={"#FFA500"}
          barWidth={8}
          data={data}
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
  );
};

export default memo(EmployeeNetSalaryChart);

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
    marginTop: 0,
  },
});
