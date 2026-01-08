import { StyleSheet } from "react-native";
import React, { FC, memo } from "react";
import { Col, Row } from "react-native-easy-grid";
import Flex from "../../../../@ui/flex/Flex";
import CheckBox from "../../../../@ui/check-box/CheckBox";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import moment from "moment";
import PopoverText from "../../../../@ui/popover-text/PopoverText";

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
  return (
    <Row
      style={styles.dataRow}
      onPress={() => handleCheckBoxClick(query.followUpId ?? "", !selected)}
    >
      <Col style={styles.formColumn}>
        <Flex>
          <CheckBox checked={selected} disabled={true} />
          <ScalableText style={styles.dataText} fontFamily="Regular">
            {moment(query?.createDate, "DD/MM/YYYY").format("DD-MM-YY")}
          </ScalableText>
        </Flex>
      </Col>
      <Col style={styles.formColumn}>
        <ScalableText style={styles.dataText} fontFamily="Regular">
          {moment(query?.followUpDate, "DD/MM/YYYY").format("DD-MM-YY")}
        </ScalableText>
      </Col>
      <Col style={styles.formColumn}>
        <ScalableText style={styles.dataText} fontFamily="Regular">
          {query.flag}
        </ScalableText>
      </Col>
      <Col style={styles.formColumn}>
        <PopoverText text={query.message ?? ""} width={150} />
      </Col>
    </Row>
  );
};

export default memo(FollowUpRow);

const styles = StyleSheet.create({
  formColumn: {
    width: 95,
    justifyContent: "center",
    alignItems: "center",
    // padding: 10,
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
  },
  headerTitle: {
    fontSize: 14,
  },
  dataText: {
    fontSize: 12,
    textAlign: "center",
  },
  readMore: {
    fontSize: 11,
    color: "#1E86FF",
    marginTop: 0,
    textDecorationLine: "underline",
  },
});
