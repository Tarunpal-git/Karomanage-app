import { StyleSheet, View } from "react-native";
import React, { FC, memo, useState } from "react";
import Flex from "../../../../../@ui/flex/Flex";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../../colors";
import { Col, Grid, Row } from "react-native-easy-grid";
import BatchDetailsRow from "./BatchDetailsRow";
import { isEmptyString } from "../../../../../utils/isEmptyString";

interface ICollegeAndBatches {
  details: TStudentList;
}

const CollegeAndBatches: FC<ICollegeAndBatches> = ({ details }) => {
  const [openDetails, setOpenDetails] = useState<string | null>(null);

  const handleToggle = (batchId: string) => {
    setOpenDetails((prev) => (prev === batchId ? null : batchId));
  };
  return (
    <View>
      <Flex styles={styles.sectionRoot} mt={25} mb={10}>
        <Flex styles={styles.sectionHeader} justify="center" w={"100%"}>
          <ScalableText style={styles.sectionTitle} fontFamily="Bold">
            College Details
          </ScalableText>
        </Flex>

        <Flex styles={styles.sectionBody}>
          <Grid>
            <Row style={styles.sectionContentRow}>
              <Col size={1.5}>
                <Flex justify="space-between">
                  <ScalableText
                    style={styles.sectionContentTitle}
                    fontFamily="SemiBold"
                  >
                    Name
                  </ScalableText>
                  <ScalableText fontFamily="Regular">-</ScalableText>
                </Flex>
              </Col>
              <Col>
                <ScalableText
                  style={styles.sectionContentDataText}
                  fontFamily="Regular"
                >
                  {isEmptyString(details.studentCollage)}
                </ScalableText>
              </Col>
            </Row>
            <Row style={styles.sectionContentRow}>
              <Col size={1.5}>
                <Flex justify="space-between">
                  <ScalableText
                    style={styles.sectionContentTitle}
                    fontFamily="SemiBold"
                  >
                    Semester
                  </ScalableText>
                  <ScalableText fontFamily="Regular">-</ScalableText>
                </Flex>
              </Col>
              <Col>
                <ScalableText
                  style={styles.sectionContentDataText}
                  fontFamily="Regular"
                >
                  {isEmptyString(details.studentSemester)}
                </ScalableText>
              </Col>
            </Row>
            <Row style={styles.sectionContentRow}>
              <Col size={1.5}>
                <Flex justify="space-between">
                  <ScalableText
                    style={styles.sectionContentTitle}
                    fontFamily="SemiBold"
                  >
                    Department Name
                  </ScalableText>
                  <ScalableText fontFamily="Regular">-</ScalableText>
                </Flex>
              </Col>
              <Col>
                <ScalableText
                  style={styles.sectionContentDataText}
                  fontFamily="Regular"
                >
                  {isEmptyString(details.studentDepartmentName)}
                </ScalableText>
              </Col>
            </Row>
            <Row style={styles.sectionContentRow}>
              <Col size={1.5}>
                <Flex justify="space-between">
                  <ScalableText
                    style={styles.sectionContentTitle}
                    fontFamily="SemiBold"
                  >
                    Course
                  </ScalableText>
                  <ScalableText fontFamily="Regular">-</ScalableText>
                </Flex>
              </Col>
              <Col>
                <ScalableText
                  style={styles.sectionContentDataText}
                  fontFamily="Regular"
                >
                  {isEmptyString(details.studentCourse)}
                </ScalableText>
              </Col>
            </Row>
          </Grid>
        </Flex>
      </Flex>
      <Flex styles={styles.sectionRoot} my={5}>
        <Flex styles={styles.sectionHeader} justify="center" w={"100%"}>
          <ScalableText style={styles.sectionTitle} fontFamily="Bold">
            Batch Details
          </ScalableText>
        </Flex>

        <Flex styles={styles.sectionBody} flexDirection="column">
          {details.batch.map((item) => (
            <BatchDetailsRow
              key={item.batchId}
              batch={item}
              isOpen={!(openDetails === item.batchId)}
              onToggle={() => handleToggle(item.batchId)}
            />
          ))}
        </Flex>
      </Flex>
    </View>
  );
};

export default memo(CollegeAndBatches);

const styles = StyleSheet.create({
  sectionRoot: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    flexDirection: "column",
  },
  sectionHeader: {
    paddingVertical: 18,
    backgroundColor: "#F0F0F0",
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 16,
  },
  sectionBody: {
    padding: 10,
    width: "100%",
  },
  sectionContentRow: {
    marginVertical: 12,
  },
  sectionContentTitle: {
    fontSize: 14,
    color: "#1B1A1A",
  },
  sectionContentDataText: {
    // marginLeft: 30,
    textAlign: "center",
  },
});
