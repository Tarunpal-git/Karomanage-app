import { StyleSheet, View, TouchableOpacity, Alert, TouchableWithoutFeedback } from "react-native";
import React, { FC, memo, useState } from "react";
import Flex from "../../../../../@ui/flex/Flex";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../../colors";
import moment from "moment";
import { Col, Grid, Row } from "react-native-easy-grid";
import CoursePaymentBlock from "./CoursePaymentBlock";
import { useNavigation } from "@react-navigation/native";
import { THomeStackNavigator } from "../../../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
import PaymentRestrictionNotice from "../../../../../@ui/restriction/PaymentRestrictionNotice";
import { hasOnlyReadPermission } from "../../../../../utils/fetchPermissionsTitle";

interface IPaymentDetails {
  details: TStudentList;
}

const PaymentDetails: FC<IPaymentDetails> = ({ details }) => {
  const navigation = useNavigation<THomeStackNavigator>();
  const [showMenu, setShowMenu] = useState(false);
  const hidePaymentInfo = hasOnlyReadPermission("Student");

  // Debug logging to see what data is received
  console.log('🔍 PaymentDetails Debug:', {
    allPaymentDetails: details?.allPaymentDetails,
    allPaymentStatus: details?.allPaymentDetails?.allPaymentStatus,
    totalReceivedPayment: details?.allPaymentDetails?.totalReceivedPayment,
    totalDuePayment: details?.allPaymentDetails?.totalDuePayment,
    grandTotalPaymentAmount: details?.allPaymentDetails?.grandTotalPaymentAmount,
    firstPaymentInstallment: (details as any)?.firstPaymentInstallment,
    paymentStatus: (details as any)?.paymentStatus,
    courses: details?.courses,
    installments: details?.courses?.[0]?.paymentDetails?.installmentDetails,
    fullDetails: JSON.stringify(details, null, 2)
  });

  // Calculate Total Received Payment with fallback
  const totalReceivedPayment = (() => {
    // Use allPaymentDetails if available
    if (details?.allPaymentDetails?.totalReceivedPayment !== undefined) {
      return (details.allPaymentDetails.totalReceivedPayment || 0) - (details.allPaymentDetails.grandRefundAmount || 0);
    }
    // Fallback calculation based on firstPaymentInstallment
    if ((details as any)?.firstPaymentInstallment === 'pay') {
      return (details as any)?.totalPayment || 0;
    }
    return 0;
  })();

  // Calculate Grand Total Payment (after deducting only discounts)
  const grandTotalPayment = (() => {
    const totalAmount = details?.allPaymentDetails?.grandTotalPaymentAmount || (details as any)?.totalPayment || 0;
    
    // Calculate total discounts from all courses
    let totalDiscount = 0;
    if (details?.courses && Array.isArray(details.courses)) {
      details.courses.forEach((course: any) => {
        if (course?.paymentDetails?.discountedPaymentAmount) {
          totalDiscount += course.paymentDetails.discountedPaymentAmount;
        }
      });
    }
    
    // Return amount after deducting only discounts (GST included)
    return Math.max(0, totalAmount - totalDiscount);
  })();

  const handleMenuPress = () => {
    setShowMenu(!showMenu);
  };

  const handleUpdate = () => {
    setShowMenu(false);
    // Navigate to UpdatePayment screen for overall payment
    Alert.alert("Update Payment", "Update overall payment functionality will be implemented here.");
  };

  const handleRefund = () => {
    setShowMenu(false);
    // Navigate to RefundPayment screen for overall payment
    Alert.alert("Refund Payment", "Refund overall payment functionality will be implemented here.");
  };

  if (hidePaymentInfo) {
    return (
      <PaymentRestrictionNotice
        title="Access Restricted"
        description="You don’t have permission to view the course payments."
        containerStyle={{ marginTop: 20 }}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Flex flexDirection="column" styles={styles.cardContainer} mt={25}>
        <Flex flexDirection="row" justify="space-between" align="center" styles={styles.cardHeader}>
          <Flex flexDirection="column">
            <ScalableText style={styles.cardTitle} fontFamily="Bold">
              Course Overall Payment
            </ScalableText>
            <ScalableText style={styles.cardSubtitle} fontFamily="SemiBold">
              {moment().format("MMMM DD, YYYY")}
            </ScalableText>
          </Flex>
          
          {/* Three dot menu */}
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
              <ScalableText style={styles.menuIcon} fontFamily="Bold">⋯</ScalableText>
            </TouchableOpacity>
            
            {showMenu && (
              <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity style={styles.menuItem} onPress={handleUpdate}>
                    <ScalableText style={styles.menuItemText} fontFamily="Medium">Update</ScalableText>
                  </TouchableOpacity>
                  {/* Always show refund button but disable if no payment received */}
                  <TouchableOpacity 
                    style={[
                      styles.menuItem,
                      (totalReceivedPayment <= 0 && details?.allPaymentDetails?.totalReceivedPayment <= 0) && styles.menuItemDisabled
                    ]} 
                    onPress={(totalReceivedPayment > 0 || details?.allPaymentDetails?.totalReceivedPayment > 0) ? handleRefund : undefined}
                    disabled={(totalReceivedPayment <= 0 && details?.allPaymentDetails?.totalReceivedPayment <= 0)}
                  >
                    <ScalableText 
                      style={{
                        ...styles.menuItemText,
                        ...((totalReceivedPayment <= 0 && details?.allPaymentDetails?.totalReceivedPayment <= 0) && styles.menuItemTextDisabled)
                      }} 
                      fontFamily="Medium"
                    >
                      Refund
                    </ScalableText>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </Flex>
        <Flex mt={15}>
          <Grid>
            <Row style={styles.sectionContentRow}>
              <Col size={1.5}>
                <Flex justify="space-between">
                  <ScalableText
                    style={styles.sectionContentTitle}
                    fontFamily="Medium"
                  >
                    All Payment Status
                  </ScalableText>
                  <ScalableText fontFamily="Medium">-</ScalableText>
                </Flex>
              </Col>
              <Col>
                <ScalableText
                  style={{
                    ...styles.sectionContentDataText,
                    textTransform: "capitalize",
                    color:
                      (details?.allPaymentDetails?.allPaymentStatus || (details as any)?.paymentStatus || 'due') === "due"
                        ? COLORS.textError
                        : COLORS.textSuccess,
                  }}
                  fontFamily="Medium"
                >
                  {details?.allPaymentDetails?.allPaymentStatus || (details as any)?.paymentStatus || 'due'}
                </ScalableText>
              </Col>
            </Row>
            <Row style={styles.sectionContentRow}>
              <Col size={1.5}>
                <Flex justify="space-between">
                  <ScalableText
                    style={styles.sectionContentTitle}
                    fontFamily="Medium"
                  >
                    Overall Course Fees
                  </ScalableText>
                  <ScalableText fontFamily="Medium">-</ScalableText>
                </Flex>
              </Col>
              <Col>
                <ScalableText
                  style={styles.sectionContentDataText}
                  fontFamily="Medium"
                >
                  RS.
                  {(details?.allPaymentDetails?.grandTotalPaymentAmount || (details as any)?.totalPayment || 0)?.toLocaleString() || "0"}
                </ScalableText>
              </Col>
            </Row>
            <Row style={styles.sectionContentRow}>
              <Col size={1.5}>
                <Flex justify="space-between">
                  <Flex align="center">
                    <ScalableText
                      style={styles.sectionContentTitle}
                      fontFamily="Medium"
                    >
                      Grand Total Payment
                    </ScalableText>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          "Grand Total Payment",
                          "This amount is calculated after deducting discounts from the total course fees. GST amount is included.",
                          [{ text: "OK", style: "default" }]
                        );
                      }}
                      style={styles.infoIcon}
                    >
                      <ScalableText style={styles.infoIconText} fontFamily="Medium">
                        ℹ️
                      </ScalableText>
                    </TouchableOpacity>
                  </Flex>
                  <ScalableText fontFamily="Medium">-</ScalableText>
                </Flex>
              </Col>
              <Col>
                <ScalableText
                  style={styles.sectionContentDataText}
                  fontFamily="Medium"
                >
                  RS.
                  {grandTotalPayment?.toLocaleString() || "0"}
                </ScalableText>
              </Col>
            </Row>
            <Row style={styles.sectionContentRow}>
              <Col size={1.5}>
                <Flex justify="space-between">
                  <ScalableText
                    style={styles.sectionContentTitle}
                    fontFamily="Medium"
                  >
                    Grand Refund Payment
                  </ScalableText>
                  <ScalableText fontFamily="Medium">-</ScalableText>
                </Flex>
              </Col>
              <Col>
                <ScalableText
                  style={styles.sectionContentDataText}
                  fontFamily="Medium"
                >
                  RS.
                  {details?.allPaymentDetails?.grandRefundAmount?.toLocaleString() || "0"}
                </ScalableText>
              </Col>
            </Row>
            <Row style={styles.sectionContentRow}>
              <Col size={1.5}>
                <Flex justify="space-between">
                  <ScalableText
                    style={styles.sectionContentTitle}
                    fontFamily="Medium"
                  >
                    Total Due Payment
                  </ScalableText>
                  <ScalableText fontFamily="Medium">-</ScalableText>
                </Flex>
              </Col>
              <Col>
                <ScalableText
                  style={styles.sectionContentDataText}
                  fontFamily="Medium"
                >
                  RS.
                  {(details?.allPaymentDetails?.totalDuePayment || ((details as any)?.firstPaymentInstallment === 'pay' ? 0 : (details as any)?.totalPayment || 0))?.toLocaleString() || "0"}
                </ScalableText>
              </Col>
            </Row>
            <Row style={styles.sectionContentRow}>
              <Col size={1.5}>
                <Flex justify="space-between">
                  <ScalableText
                    style={styles.sectionContentTitle}
                    fontFamily="Medium"
                  >
                    Total Received Payment
                  </ScalableText>
                  <ScalableText fontFamily="Medium">-</ScalableText>
                </Flex>
              </Col>
              <Col>
                <ScalableText
                  style={styles.sectionContentDataText}
                  fontFamily="Medium"
                >
                  RS.
                  {totalReceivedPayment?.toLocaleString() || "0"}
                </ScalableText>
              </Col>
            </Row>

          </Grid>
        </Flex>
      </Flex>
      <Flex justify="space-between" styles={{ flexWrap: "wrap" }}>
        {details.courses.map((course) => (
          <CoursePaymentBlock 
            key={course.courseId} 
            course={course} 
            studentRollNo={details.rollNo}
          />
        ))}
      </Flex>
    </View>
  );
};

export default memo(PaymentDetails);

const styles = StyleSheet.create({
  root: { flex: 1 },
  cardContainer: {
    justifyContent: "center",
    elevation: 4,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    paddingBottom: 15,
  },
  cardTitle: {
    fontSize: 15,
    color: COLORS.primary,
    paddingBottom: 5,
  },
  cardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  sectionContentRow: {
    marginVertical: 8,
  },
  sectionContentTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  sectionContentDataText: {
    marginLeft: 35,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  infoIcon: {
    marginLeft: 8,
    padding: 2,
  },
  infoIconText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    padding: 8,
    borderRadius: 4,
  },
  menuIcon: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 35,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 100,
    zIndex: 1000,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuItemText: {
    fontSize: 14,
    color: COLORS.black,
  },
  menuItemTextDisabled: {
    color: COLORS.textSecondary,
  },
});
