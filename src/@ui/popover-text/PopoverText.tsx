import {
  StyleSheet,
  TextLayoutEventData,
  TouchableOpacity,
} from "react-native";
import React, { FC, useState } from "react";
import Tooltip from "react-native-walkthrough-tooltip";
import ScalableText from "../scalable-text/ScalableText";
import Flex from "../flex/Flex";

interface IPopoverText {
  text: string;
  width?: number;
}

const PopoverText: FC<IPopoverText> = ({ text, width }) => {
  const [tooltip, setTooltip] = useState(false);

  const [showMore, setShowMore] = useState(false);
  const handleTextLayout = (event: { nativeEvent: TextLayoutEventData }) => {
    const { lines } = event.nativeEvent;

    if (lines.length >= 2) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
  };

  return (
    <Flex flexDirection="column" align="flex-start">
      <ScalableText
        style={{ ...styles.dataText, textAlign: "left" }}
        fontFamily="Regular"
        numberOfLines={2}
        onTextLayout={handleTextLayout}
      >
        {text}
      </ScalableText>
      {showMore && (
        <Tooltip
          isVisible={tooltip}
          onClose={() => setTooltip(false)}
          backgroundColor="transparent"
          childContentSpacing={0}
          contentStyle={{
            elevation: 4,
            width: width,
            borderRadius: 6,
            padding: 10,
          }}
          content={
            <ScalableText
              style={styles.dataText}
              fontFamily="Regular"
              onTextLayout={handleTextLayout}
            >
              {text}
            </ScalableText>
          }
          placement="bottom"
        >
          {text !== "" && (
            <TouchableOpacity onPress={() => setTooltip(true)}>
              <ScalableText style={{ ...styles.readMore }} fontFamily="Regular">
                Read More
              </ScalableText>
            </TouchableOpacity>
          )}
        </Tooltip>
      )}
    </Flex>
  );
};

export default PopoverText;

const styles = StyleSheet.create({
  dataText: {
    fontSize: 11,
    textAlign: "center",
  },
  readMore: {
    fontSize: 11,
    color: "#1E86FF",
    marginTop: 0,
    textDecorationLine: "underline",
  },
});
