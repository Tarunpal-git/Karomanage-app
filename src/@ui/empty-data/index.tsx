import { StyleSheet } from "react-native";
import React, { FC } from "react";
import Flex from "../flex/Flex";
import ScalableText from "../scalable-text/ScalableText";

interface IEmptyData {
  title?: string;
  message?: string;
}

const EmptyData: FC<IEmptyData> = ({ title = "No Data found", message }) => {
  return (
    <Flex
      styles={styles.root}
      align="center"
      justify="center"
      flexDirection="column"
    >
      <ScalableText fontFamily="Regular">{title}</ScalableText>
      <ScalableText fontFamily="Regular" style={{ marginVertical: 10 }}>
        {message}
      </ScalableText>
    </Flex>
  );
};

export default EmptyData;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
