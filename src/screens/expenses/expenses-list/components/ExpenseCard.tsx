import { StyleSheet, ViewStyle } from "react-native";
import React, { FC, memo } from "react";
import Flex from "../../../../@ui/flex/Flex";
import AnimatedCounter from "../../../../@ui/animated-views/AnimatedCounter";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../colors";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";

interface IExpenseCard {
  title: string;
  amount: number;
  cardStyles?: ViewStyle;
}

const ExpenseCard: FC<IExpenseCard> = ({ amount, title, cardStyles }) => {
  return (
    <Flex flexDirection="column" styles={{ ...styles.cardRoot, ...cardStyles }}>
      <Flex>
        <AutoHeightImage source={IMAGES.rupeePrimaryIcon} width={9} />
        <AnimatedCounter
          textStyles={styles.amountText}
          duration={1200}
          endValue={amount}
        />
      </Flex>
      <ScalableText
        style={{ fontSize: 10, textAlign: "center", marginTop: 0 }}
        fontFamily="Medium"
      >
        {title}
      </ScalableText>
    </Flex>
  );
};

export default memo(ExpenseCard);

const styles = StyleSheet.create({
  cardRoot: {
    backgroundColor: COLORS.white,
    elevation: 4,
    borderRadius: 10,
    flex: 1,
    minHeight: 93,
    paddingVertical: 15,
  },
  amountText: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: COLORS.primary,
  },
});
