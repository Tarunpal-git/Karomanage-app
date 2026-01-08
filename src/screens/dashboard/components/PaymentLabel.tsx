import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import React, { FC, memo } from "react";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import AnimatedCounter from "../../../@ui/animated-views/AnimatedCounter";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
 
import { TImages } from "../../../images/images";
 
interface IPaymentLabel {
  background: string;
  label: string;
  amount: number;
  rupeeIcon: TImages;
  rootStyle?: ViewStyle;
  labelStyle?: TextStyle;
  amountStyle?: TextStyle;
}
 
const PaymentLabel: FC<IPaymentLabel> = ({
  label,
  amount,
  background,
  rupeeIcon,
  rootStyle,
  labelStyle,
  amountStyle,
}) => {
  return (
    <Flex mt={8} styles={{ ...rootStyle }}>
      <View
        style={{
          ...styles.labelDot,
          backgroundColor: background,
        }}
      />
      <Flex styles={styles.labelRoot}>
        <ScalableText
          style={{ ...styles.label, ...labelStyle }}
          fontFamily="SemiBold"
        >
          {label} :{" "}
        </ScalableText>
        <Flex ml={13}>
          <AutoHeightImage source={IMAGES[rupeeIcon]} width={6} />
          <AnimatedCounter
            textStyles={{
              fontSize: 10,
             
              color: background,
              marginLeft: 2,
              ...amountStyle,
            }}
            duration={1200}
            endValue={amount}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
 
export default memo(PaymentLabel);
 
const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    marginTop: 0,
  },
  labelRoot: {
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    padding: 2,
    paddingHorizontal: 6,
  },
  labelDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginRight: 5,
  },
});
 