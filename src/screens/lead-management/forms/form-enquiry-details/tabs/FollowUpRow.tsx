import {
  StyleSheet,
  TextLayoutEventData,
  TouchableOpacity,
} from "react-native";
import React, { FC, memo, useState } from "react";
import { Col, Row } from "react-native-easy-grid";
import Flex from "../../../../../@ui/flex/Flex";
import CheckBox from "../../../../../@ui/check-box/CheckBox";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import moment from "moment";
import Tooltip from "react-native-walkthrough-tooltip";

interface IFollowUpRow {
  query: TFollowUp;
  handleCheckBoxClick: (followUpId: string, isChecked: boolean) => void;
  selected: boolean;
}

const FollowUpRow: FC<IFollowUpRow> = ({
  query,
  handleCheckBoxClick,
  selected,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  const handleTextLayout = (event: { nativeEvent: TextLayoutEventData }) => {
    const { lines } = event.nativeEvent;

    if (lines.length > 0) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
  };
  console.log(query.description, "query.descriptionnnnnnn");

  return (
    <Row
      style={styles.dataRow}
      onPress={() => handleCheckBoxClick(query.followUpId ?? "", !selected)}
    >
      <Col style={styles.formColumn}>
        <Flex>
          <ScalableText style={styles.dataText} fontFamily="Regular">
          <CheckBox checked={selected} disabled={true} />
            {moment(query?.createDate, "DD/MM/YYYY").format("DD-MM-YY")}
          </ScalableText>
        </Flex>
      </Col>
      <Col style={styles.formColumn}>
        <ScalableText style={styles.dataText} fontFamily="Regular">
          {moment(
            query?.followUpDate,
            "DD/MM/YYYY"
          ).format("DD-MM-YY")}
        </ScalableText>
      </Col>
      <Col style={styles.formColumn}>
        <ScalableText style={styles.dataText} fontFamily="Regular">
          {query.flag}
        </ScalableText>
      </Col>
      <Col style={styles.formColumn}>
        <ScalableText
          style={styles.dataText}
          fontFamily="Regular"
          numberOfLines={1}
          onTextLayout={handleTextLayout}
        >
          {query.message}
        </ScalableText>
        {showMore && (
          <Tooltip
            isVisible={tooltip}
            onClose={() => setTooltip(false)}
            backgroundColor="transparent"
            childContentSpacing={0}
            contentStyle={{
              elevation: 4,
              width: 139,
              borderRadius: 6,
              padding: 10,
            }}
            content={
              <ScalableText
                style={styles.dataText}
                fontFamily="Regular"
                onTextLayout={handleTextLayout}
              >
                {query.message}
              </ScalableText>
            }
            placement="bottom"
          >
            <TouchableOpacity onPress={() => setTooltip(true)}>
              <ScalableText style={{ ...styles.readMore }} fontFamily="Regular">
                Read More
              </ScalableText>
            </TouchableOpacity>
          </Tooltip>
        )}
      </Col>
    </Row>
  );
};

export default memo(FollowUpRow);

const styles = StyleSheet.create({
  formColumn: {
    minWidth: 95,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    flex: 1,
  },
  headerRow: {
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 0.8,
    height: 65,
  },
  dataRow: {
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 0.8,
    height: 55,
 
    width: '100%',

  },
  headerTitle: {
    fontSize: 14,
  },
  dataText: {
    fontSize: 12,
    textAlign: "center",
    width: '100%'
  },
  readMore: {
    fontSize: 11,
    color: "#1E86FF",
    marginTop: 0,
    textDecorationLine: "underline",
  },
});
