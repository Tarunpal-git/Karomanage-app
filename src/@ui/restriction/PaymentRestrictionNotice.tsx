import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import ScalableText from "../scalable-text/ScalableText";
import { COLORS } from "../../colors";

type TRestrictionVariant = "card" | "inline";

interface IPaymentRestrictionNoticeProps {
  title?: string;
  description?: string;
  variant?: TRestrictionVariant;
  containerStyle?: ViewStyle;
}

const DEFAULT_TITLE = "Access Restricted";
const DEFAULT_DESCRIPTION =
  "You don’t have permission to view the course payments.";

const PaymentRestrictionNotice: React.FC<IPaymentRestrictionNoticeProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  variant = "card",
  containerStyle,
}) => {
  return (
    <View
      style={[
        styles.base,
        variant === "inline" ? styles.inline : styles.card,
        containerStyle,
      ]}
    >
      <ScalableText style={styles.title} fontFamily="SemiBold">
        {title}
      </ScalableText>
      <ScalableText style={styles.description} fontFamily="Regular">
        {description}
      </ScalableText>
    </View>
  );
};

export default PaymentRestrictionNotice;

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 18,
    width: "100%",
    elevation: 2,
  },
  inline: {
    backgroundColor: COLORS.whiteSmoke,
    padding: 14,
  },
  title: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});



