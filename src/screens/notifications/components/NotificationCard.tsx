import { StyleSheet } from "react-native";
import React, { FC, memo } from "react";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";

interface INotificationCard {
  title: string;
  count: number;
  handleClick: () => void;
}

const NotificationCard: FC<INotificationCard> = ({
  count,
  title,
  handleClick,
}) => {
  return (
    <Flex styles={styles.root} justify="space-between" onClick={handleClick}>
      <ScalableText fontFamily="Medium">{title}</ScalableText>

      {count > 0 && (
        <Flex styles={styles.countRoot}>
          <ScalableText style={styles.countText} fontFamily="Medium">
            {count}
          </ScalableText>
        </Flex>
      )}
    </Flex>
  );
};

export default memo(NotificationCard);

const styles = StyleSheet.create({
  root: {
    elevation: 4,
    marginVertical: 13,
    padding: 20,
    width: "100%",
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 5,
  },
  countRoot: {
    width: 16,
    height: 16,
    backgroundColor: "#FF4848",
    borderRadius: 20,
    justifyContent: "center",
  },
  countText: {
    color: COLORS.white,
    fontSize: 10,
    marginTop: 2,
  },
});
