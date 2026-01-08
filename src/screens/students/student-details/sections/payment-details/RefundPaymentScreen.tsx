import React, { FC, useState } from "react";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import SafeView from "../../../../../@ui/safe-view/SafeView";
import AppHeader from "../../../../../@ui/app-header/AppHeader";
import ThemeScrollView from "../../../../../@ui/theme-scroll-view/ThemeScrollView";
import Flex from "../../../../../@ui/flex/Flex";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../../colors";
import { Col, Grid, Row } from "react-native-easy-grid";
import { THomeStackNavigator } from "../../../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
import { useCourseDetailsQuery } from "../../../../../apis/hooks/course/query/useCourseDetails.query";
import ActionIcon from "../../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../../images";

interface IRefundPaymentScreen {
  course: TCourse;
  studentRollNo: string;
}

const RefundPaymentScreen: FC = () => {
  const navigation = useNavigation<THomeStackNavigator>();
  const route = useRoute<any>();
  const { course, studentRollNo } = route.params;
  const [activeTab, setActiveTab] = useState<"refund" | "history">("refund");

  const { data: courseData } = useCourseDetailsQuery({
    courseId: course.courseId,
  });

  const handleRefundPayment = (installmentId: string) => {
    console.log("Refund payment:", installmentId);
    Alert.alert("Refund Payment", "Refund functionality will be implemented soon");
  };

  const handleViewRefundHistory = (installmentId: string) => {
    console.log("View refund history:", installmentId);
    Alert.alert("Refund History", "History functionality will be implemented soon");
  };

  return (
    <SafeView>
      <AppHeader
        title={`${courseData?.data?.courseName || course.courseName} Refund Payment`}
        handleBackClick={() => navigation.goBack()}
        showDrawer={false}
      />
      
      <ThemeScrollView paddingHorizontal={10}>
        <Flex mt={20} flexDirection="column">
          {/* Navigation Tabs */}
          <Flex styles={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, styles.activeTab]}
              onPress={() => setActiveTab("refund")}
            >
              <ScalableText style={styles.activeTabText} fontFamily="Medium">
                REFUND PAYMENT
              </ScalableText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, styles.inactiveTab]}
              onPress={() => setActiveTab("history")}
            >
              <ScalableText style={styles.inactiveTabText} fontFamily="Medium">
                REFUND HISTORY
              </ScalableText>
            </TouchableOpacity>
          </Flex>

          {/* Refund Details Section Title */}
          <Flex mt={20}>
            <ScalableText style={styles.sectionTitle} fontFamily="Bold">
              Refund Details
            </ScalableText>
          </Flex>

          {/* Refund Details Table */}
          <Flex mt={15}>
            <Grid>
              <Row style={styles.headerRow}>
                <Col size={10}>
                  <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                    NO.
                  </ScalableText>
                </Col>
                <Col size={15}>
                  <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                    DATE
                  </ScalableText>
                </Col>
                <Col size={20}>
                  <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                    AMOUNT
                  </ScalableText>
                </Col>
                <Col size={15}>
                  <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                    STATUS
                  </ScalableText>
                </Col>
                <Col size={20}>
                  <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                    REFUND AMOUNT
                  </ScalableText>
                </Col>
                <Col size={20}>
                  <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                    ACTIONS
                  </ScalableText>
                </Col>
              </Row>
              
              {/* Table Data Row 1 */}
              <Row style={styles.dataRow}>
                <Col size={10}>
                  <ScalableText style={styles.dataText} fontFamily="Regular">
                    1
                  </ScalableText>
                </Col>
                <Col size={15}>
                  <ScalableText style={styles.dataText} fontFamily="Regular">
                    -
                  </ScalableText>
                </Col>
                <Col size={20}>
                  <ScalableText style={styles.dataText} fontFamily="Regular">
                    ₹ 2,00,000.00
                  </ScalableText>
                </Col>
                <Col size={15}>
                  <Flex
                    styles={{
                      ...styles.statusChip,
                      backgroundColor: "#ECFFE0",
                    }}
                  >
                    <ScalableText
                      style={{
                        ...styles.statusChipText,
                        color: "#4AC400",
                      }}
                      fontFamily="Medium"
                    >
                      PAID
                    </ScalableText>
                  </Flex>
                </Col>
                <Col size={20}>
                  <ScalableText style={styles.dataText} fontFamily="Regular">
                    ₹ 0.00
                  </ScalableText>
                </Col>
                <Col size={20}>
                  <Flex flexDirection="row" justify="center" align="center">
                    <TouchableOpacity onPress={() => handleRefundPayment("1")}>
                      <AutoHeightImage source={IMAGES.editIcon} width={16} />
                    </TouchableOpacity>
                  </Flex>
                </Col>
              </Row>
            </Grid>
          </Flex>
        </Flex>
      </ThemeScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeTabText: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: "Poppins-Medium",
  },
  inactiveTab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  inactiveTabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Medium",
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.black,
    fontFamily: "Poppins-Bold",
    marginBottom: 5,
  },
  headerRow: {
    borderBottomWidth: 1,
    borderColor: "#030303",
    paddingVertical: 15,
    paddingHorizontal: 8,
  },
  headerText: {
    color: "#1B1A1A",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
  dataRow: {
    borderBottomWidth: 1,
    borderColor: "#D1D1D1",
    paddingVertical: 15,
    paddingHorizontal: 8,
  },
  dataText: {
    color: "#1B1A1A",
    fontSize: 12,
    textAlign: "center",
    textTransform: "capitalize",
    lineHeight: 16,
  },
  statusChip: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  statusChipText: {
    fontSize: 11,
    textTransform: "capitalize",
    fontWeight: "500",
  },
});

export default RefundPaymentScreen; 