import { ScrollView, StyleSheet, View } from "react-native";
import React, { FC, memo } from "react";
import { Col, Grid, Row } from "react-native-easy-grid";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import Flex from "../../../../@ui/flex/Flex";
import Center from "../../../../@ui/center/Center";
import { COLORS } from "../../../../colors";

interface IReceivedPaymentTable {
  forecast: TReceivedPaymentForecast[];
}

const ReceivedPaymentTable: FC<IReceivedPaymentTable> = ({ forecast }) => {
  return (
    <View style={styles.tableRoot}>
      {forecast.length > 0 && (
        <ScrollView nestedScrollEnabled>
          <Grid>
            <Row style={styles.headerRow}>
              <Col style={styles.headerCol} size={1.5}>
                <ScalableText style={styles.headerText} fontFamily="Medium">
                  Roll NO.
                </ScalableText>
              </Col>
              <Col style={styles.headerCol} size={2}>
                <ScalableText style={styles.headerText} fontFamily="Medium">
                  Name
                </ScalableText>
              </Col>
              <Col style={styles.headerCol} size={3}>
                <ScalableText style={styles.headerText} fontFamily="Medium">
                  Due Amount
                </ScalableText>
              </Col>
            </Row>
            {forecast.map((student) => (
              <Row key={student.rollNo} style={styles.dataRow}>
                <Col style={styles.dataCol} size={1.5}>
                  <Flex
                    align="flex-start"
                    flexDirection="column"
                    styles={{ height: "100%" }}
                    justify="center"
                  >
                    <ScalableText style={styles.dataText} fontFamily="Medium">
                      {student.rollNo}
                    </ScalableText>
                  </Flex>
                </Col>
                <Col
                  style={{
                    ...styles.dataCol,
                    borderLeftWidth: 0.5,
                    borderRightWidth: 0.5,
                    borderColor: "#DCE2E7",
                  }}
                  size={2}
                >
                  <Flex
                    align="flex-start"
                    flexDirection="column"
                    styles={{ height: "100%" }}
                    justify="center"
                  >
                    <ScalableText style={styles.dataText} fontFamily="Medium">
                      {`${student.studentFirstName} ${student.studentLastName}`}
                    </ScalableText>
                    <ScalableText
                      style={styles.dataTextMuted}
                      fontFamily="Regular"
                    >
                      {student.studentEmail}
                    </ScalableText>
                    <ScalableText
                      style={styles.dataTextMuted}
                      fontFamily="Regular"
                    >
                      {student.studentContact}
                    </ScalableText>
                  </Flex>
                </Col>
                <Col
                  style={{ ...styles.dataCol, paddingHorizontal: 10 }}
                  size={3}
                >
                  {student.paymentForecast.map((payment, index) => (
                    <Grid key={payment.Details.courseId + index}>
                      <Row style={styles.subRow}>
                        <Col>
                          <Flex
                            align="flex-start"
                            flexDirection="column"
                            styles={{ height: "100%" }}
                            justify="center"
                          >
                            <ScalableText
                              style={styles.subTableHeading}
                              fontFamily="Medium"
                            >
                              Amount
                            </ScalableText>
                          </Flex>
                        </Col>
                        <Col>
                          <Flex
                            align="flex-start"
                            flexDirection="column"
                            styles={{ height: "100%" }}
                            justify="center"
                          >
                            <ScalableText
                              style={styles.subTableHeading}
                              fontFamily="Medium"
                            >
                              Status
                            </ScalableText>
                          </Flex>
                        </Col>
                        <Col>
                          <Flex
                            align="flex-start"
                            flexDirection="column"
                            styles={{ height: "100%" }}
                            justify="center"
                          >
                            <ScalableText
                              style={styles.subTableHeading}
                              fontFamily="Medium"
                            >
                              Date
                            </ScalableText>
                          </Flex>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          ...styles.subRow,
                          borderBottomWidth:
                            index + 1 === student.paymentForecast.length
                              ? 0
                              : 0.5,
                        }}
                      >
                        <Col>
                          <Flex
                            align="flex-start"
                            flexDirection="column"
                            styles={{ height: "100%" }}
                            justify="center"
                          >
                            <ScalableText
                              style={styles.subTableDataText}
                              fontFamily="Regular"
                            >
                              {payment.Details?.receivedPayment?.toLocaleString()}
                            </ScalableText>
                          </Flex>
                        </Col>
                        <Col>
                          <Flex
                            align="flex-start"
                            flexDirection="column"
                            styles={{ height: "100%" }}
                            justify="center"
                          >
                            <ScalableText
                              style={{
                                ...styles.subTableDataText,
                                textTransform: "uppercase",
                                color: "#00FF00",
                              }}
                              fontFamily="Regular"
                            >
                              {payment.Details.paymentStatus}
                            </ScalableText>
                          </Flex>
                        </Col>
                        <Col>
                          <Flex
                            align="flex-start"
                            flexDirection="column"
                            styles={{ height: "100%" }}
                            justify="center"
                          >
                            <ScalableText
                              style={styles.subTableDataText}
                              fontFamily="Regular"
                            >
                              {payment.Details.paymentReceiveDate}
                            </ScalableText>
                          </Flex>
                        </Col>
                      </Row>
                    </Grid>
                  ))}
                </Col>
              </Row>
            ))}
          </Grid>
        </ScrollView>
      )}
      {forecast.length === 0 && (
        <Center>
          <ScalableText
            fontFamily="Medium"
            style={{ color: COLORS.graphRed, fontSize: 10 }}
          >
            No data found
          </ScalableText>
        </Center>
      )}
    </View>
  );
};

export default memo(ReceivedPaymentTable);

const styles = StyleSheet.create({
  tableRoot: {
    marginTop: 10,
    marginLeft: 10,
    borderColor: "#DCE2E7",
    borderWidth: 0.5,
    height: 137,
  },
  headerRow: {
    backgroundColor: "#F3F4F6",
    minHeight: 20,
  },
  headerText: {
    fontSize: 10,
  },
  dataRow: {
    minHeight: 40,
    borderColor: "#DCE2E7",
    borderBottomWidth: 0.2,
  },
  dataText: {
    fontSize: 8,
    marginTop: 1,
  },
  dataTextMuted: {
    fontSize: 8,
    marginTop: 1,
    color: "#ADAFB5",
  },
  headerCol: {
    paddingLeft: 10,
  },
  dataCol: {
    paddingLeft: 10,
  },
  subTableHeading: {
    fontSize: 7,
    color: "#84919D",
    marginTop: 0,
  },
  subTableDataText: {
    fontSize: 6,
    color: "#4D5F71",
    marginTop: 0,
  },
  subRow: {
    borderColor: "#DCE2E7",
    borderBottomWidth: 0.2,
    minHeight: 18,
  },
});
