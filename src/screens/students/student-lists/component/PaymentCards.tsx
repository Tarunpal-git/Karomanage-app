import { StyleSheet, ViewStyle } from "react-native";
import React, { FC, memo } from "react";
import Flex from "../../../../@ui/flex/Flex";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import AnimatedCounter from "../../../../@ui/animated-views/AnimatedCounter";
import { COLORS } from "../../../../colors";

interface IPaymentCards {
  title: string;
  amount: number;
  textVariant: "success" | "error";
  containerStyles?: ViewStyle;
}

const PaymentCards: FC<IPaymentCards> = ({
  amount,
  textVariant,
  title,
  containerStyles,
}) => {
  return (
    <Flex styles={{ ...styles.cardRoot, ...containerStyles }}>
      <Flex>
        <Flex mr={5}>
          <AutoHeightImage
            source={
              textVariant === "error"
                ? IMAGES.rupeeRedIcon
                : IMAGES.rupeeGreenIcon
            }
            width={8}
          />
        </Flex>
        <AnimatedCounter
          textStyles={{
            ...styles.amountText,
            color:
              textVariant === "error" ? COLORS.textError : COLORS.textSuccess,
          }}
          endValue={amount}
          duration={1000}
        />
      </Flex>
      <ScalableText style={styles.cardTitle} fontFamily="Medium">
        {title}
      </ScalableText>
    </Flex>
  );
};

export default memo(PaymentCards);

const styles = StyleSheet.create({
  amountText: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  cardTitle: {
    fontSize: 12,
    marginTop: 0,
  },
  cardRoot: {
    backgroundColor: COLORS.white,
    flexDirection: "column",
    padding: 18,
    elevation: 8,
    flex: 1,
    borderRadius: 10,
  },
});
