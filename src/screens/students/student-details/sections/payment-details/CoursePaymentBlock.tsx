import { StyleSheet, TouchableOpacity, Alert, View, TouchableWithoutFeedback, Modal, TextInput } from "react-native";
import React, { FC, memo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Flex from "../../../../../@ui/flex/Flex";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";

import { Col, Grid, Row } from "react-native-easy-grid";
import { COLORS } from "../../../../../colors";
import { useCourseDetailsQuery } from "../../../../../apis/hooks/course/query/useCourseDetails.query";
import { THomeStackNavigator } from "../../../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
import { hasUpdatePermission } from "../../../../../utils/fetchPermissionsTitle";

interface ICoursePaymentBlock {
  course: TCourse;
  studentRollNo: string;
}

const CoursePaymentBlock: FC<ICoursePaymentBlock> = ({ course, studentRollNo }) => {
  const navigation = useNavigation<THomeStackNavigator>();
  const { data } = useCourseDetailsQuery({
    courseId: course.courseId,
  });
  const { paymentDetails } = course;
  const [showMenu, setShowMenu] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundDate, setRefundDate] = useState("");
  const [refundNote, setRefundNote] = useState("");

  // Calculate the received payment as totalReceivedPayment - refundAmount
  const calculatedReceivedPayment =
    (paymentDetails?.totalReceivedPayment || 0) - (paymentDetails?.refundAmount || 0);

  // Calculate GST based on payment status and installments with dynamic GST type
  const calculateGST = () => {
    // Check if there are installment details
    if (paymentDetails?.installmentDetails && paymentDetails.installmentDetails.length > 0) {
      const installments = paymentDetails.installmentDetails;
      
      // Check if any installment is paid
      const paidInstallments = installments.filter((installment: any) => installment.paymentStatus === 'paid');
      const totalInstallments = installments.length;
      
      if (paidInstallments.length === 0) {
        // No installments paid - show noGST
        return { 
          cgstAmount: 0, 
          sgstAmount: 0, 
          totalGSTAmount: 0,
          gstType: 'noGST',
          gstInclusionType: 'noGST'
        };
      } else if (paidInstallments.length === totalInstallments) {
        // All installments paid - check GST type from installment data
        const firstInstallment = installments[0];
        const gstInclusionType = (firstInstallment as any)?.inclusionType || 'noGST';
        
        if (gstInclusionType === 'noGST') {
          return { 
            cgstAmount: 0, 
            sgstAmount: 0, 
            totalGSTAmount: 0,
            gstType: 'noGST',
            gstInclusionType: 'noGST'
          };
        } else {
          // Calculate GST based on inclusion type
          const totalGST = installments.reduce((sum: number, installment: any) => {
            const installmentAmount = installment.receivedPayment || installment.duePayment || 0;
            // Calculate GST on installment amount (assuming 18% total GST - adjust as needed)
            return sum + (installmentAmount * 0.18);
          }, 0);
          return { 
            cgstAmount: totalGST / 2, // Assuming equal CGST and SGST
            sgstAmount: totalGST / 2,
            totalGSTAmount: totalGST,
            gstType: 'withGST',
            gstInclusionType: gstInclusionType
          };
        }
      } else {
        // Only some installments paid - check GST type from paid installments
        const paidInstallments = installments.filter((installment: any) => installment.paymentStatus === 'paid');
        const firstPaidInstallment = paidInstallments[0];
        const gstInclusionType = (firstPaidInstallment as any)?.inclusionType || 'noGST';
        
        if (gstInclusionType === 'noGST') {
          return { 
            cgstAmount: 0, 
            sgstAmount: 0, 
            totalGSTAmount: 0,
            gstType: 'noGST',
            gstInclusionType: 'noGST'
          };
        } else {
          // Calculate GST for paid installments only
          const paidGST = paidInstallments.reduce((sum: number, installment: any) => {
            const installmentAmount = installment.receivedPayment || installment.duePayment || 0;
            // Calculate GST on paid installment amount
            return sum + (installmentAmount * 0.18);
          }, 0);
          return {
            cgstAmount: paidGST / 2,
            sgstAmount: paidGST / 2,
            totalGSTAmount: paidGST,
            gstType: 'withGST',
            gstInclusionType: gstInclusionType
          };
        }
      }
    }
    
    // Fallback: Check if course payment status is paid (for single payment scenarios)
    if (paymentDetails?.coursePaymentStatus === 'paid') {
      // Check if there's GST data in the payment details
      const gstInclusionType = (paymentDetails as any)?.inclusionType || 'noGST';
      
      if (gstInclusionType === 'noGST') {
        return { 
          cgstAmount: 0, 
          sgstAmount: 0,
          totalGSTAmount: 0,
          gstType: 'noGST',
          gstInclusionType: 'noGST'
        };
      } else {
        const totalAmount = paymentDetails?.totalReceivedPayment || 0;
        const totalGST = totalAmount * 0.18; // 18% GST
        return {
          cgstAmount: totalGST / 2,
          sgstAmount: totalGST / 2,
          totalGSTAmount: totalGST,
          gstType: 'withGST',
          gstInclusionType: gstInclusionType
        };
      }
    }
    
    // No payment made - show noGST
    return {
      cgstAmount: 0,
      sgstAmount: 0,
      totalGSTAmount: 0,
      gstType: 'noGST',
      gstInclusionType: 'noGST'
    };
  };

  const gstData = calculateGST();

  const handleMenuPress = (event: any) => {
    event.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleUpdate = () => {
    setShowMenu(false);
    // Navigate to UpdatePayment screen
    navigation.navigate("UpdatePayment", {
      course,
      studentRollNo,
    });
  };

  const handleRefund = () => {
    setShowMenu(false);
    // Open modal like web behavior
    setShowRefundModal(true);
  };

  const handleCloseRefundModal = () => {
    setShowRefundModal(false);
    setRefundAmount("");
    setRefundDate("");
    setRefundNote("");
  };

  const handleSaveRefund = () => {
    if (!refundAmount || !refundDate) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    // TODO: Integrate refund API
    Alert.alert("Success", "Refund request submitted successfully");
    handleCloseRefundModal();
  };

  return (
    <>
    <Flex flexDirection="column" styles={styles.cardContainer}>
        <Flex flexDirection="row" justify="space-between" align="center" styles={styles.cardHeader} w={"100%"}>
          <ScalableText style={styles.cardTitle} fontFamily="Bold">
            {data?.data?.courseName}
          </ScalableText>
          {/* Show menu for all status to maintain consistent card size */}
          <View style={styles.menuContainer}>
            {hasUpdatePermission("Student") ? (
              <>
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
                          (calculatedReceivedPayment <= 0 && paymentDetails?.totalReceivedPayment <= 0) && styles.menuItemDisabled
                        ]} 
                        onPress={(calculatedReceivedPayment > 0 || paymentDetails?.totalReceivedPayment > 0) ? handleRefund : undefined}
                        disabled={(calculatedReceivedPayment <= 0 && paymentDetails?.totalReceivedPayment <= 0)}
                      >
                        <ScalableText 
                          style={{
                            ...styles.menuItemText,
                            ...((calculatedReceivedPayment <= 0 && paymentDetails?.totalReceivedPayment <= 0) && styles.menuItemTextDisabled)
                          }} 
                          fontFamily="Medium"
                        >
                          Refund
                        </ScalableText>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </>
            ) : (
              <View style={styles.menuButton}>
                {/* Empty placeholder to maintain card size */}
              </View>
            )}
          </View>
        </Flex>
      <Flex my={10} mx={10}>
        <Grid>
          <Row style={styles.sectionContentRow}>
            <Col size={2}>
              <Flex justify="space-between">
                <ScalableText
                  style={styles.sectionContentTitle}
                  fontFamily="Regular"
                >
                  Status
                </ScalableText>
                <ScalableText fontFamily="Regular">-</ScalableText>
              </Flex>
            </Col>
            <Col size={2}>
              <ScalableText
                style={{
                  ...styles.sectionContentDataText,
                  textTransform: "capitalize",
                  color:
                    paymentDetails?.coursePaymentStatus === "due"
                      ? COLORS.textError
                      : COLORS.textSuccess,
                }}
                fontFamily="Regular"
              >
                {paymentDetails?.coursePaymentStatus}
              </ScalableText>
            </Col>
          </Row>
          <Row style={styles.sectionContentRow}>
            <Col size={2}>
              <Flex justify="space-between">
                <ScalableText
                  style={styles.sectionContentTitle}
                  fontFamily="Regular"
                >
                  Due
                </ScalableText>
                <ScalableText fontFamily="Regular">-</ScalableText>
              </Flex>
            </Col>
            <Col size={2}>
              <ScalableText
                style={styles.sectionContentDataText}
                fontFamily="Regular"
              >
                RS.{paymentDetails?.totalDuePayment?.toLocaleString() || "0"}
              </ScalableText>
            </Col>
          </Row>
          <Row style={styles.sectionContentRow}>
            <Col size={2}>
              <Flex justify="space-between">
                <ScalableText
                  style={styles.sectionContentTitle}
                  fontFamily="Regular"
                >
                  Refund
                </ScalableText>
                <ScalableText fontFamily="Regular">-</ScalableText>
              </Flex>
            </Col>
            <Col size={2}>
              <ScalableText
                style={styles.sectionContentDataText}
                fontFamily="Regular"
              >
                RS.{paymentDetails?.refundAmount?.toLocaleString() || "0"}
              </ScalableText>
            </Col>
          </Row>
          <Row style={styles.sectionContentRow}>
            <Col size={2}>
              <Flex justify="space-between">
                <ScalableText
                  style={styles.sectionContentTitle}
                  fontFamily="Regular"
                >
                  Received
                </ScalableText>
                <ScalableText fontFamily="Regular">-</ScalableText>
              </Flex>
            </Col>
            <Col size={2}>
              <ScalableText
                style={styles.sectionContentDataText}
                fontFamily="Regular"
              >
                RS.{calculatedReceivedPayment?.toLocaleString() || "0"}
              </ScalableText>
            </Col>
          </Row>
          <Row style={styles.sectionContentRow}>
            <Col size={2}>
              <Flex justify="space-between">
                <ScalableText
                  style={styles.sectionContentTitle}
                  fontFamily="Regular"
                >
                  Discount
                </ScalableText>
                <ScalableText fontFamily="Regular">-</ScalableText>
              </Flex>
            </Col>
            <Col size={2}>
              <ScalableText
                style={styles.sectionContentDataText}
                fontFamily="Regular"
              >
                RS.{paymentDetails?.discountedPaymentAmount?.toLocaleString() || "0"}
              </ScalableText>
            </Col>
          </Row>
          {/* GST Details - Always show with dynamic data */}
          <Row style={styles.sectionContentRow}>
            <Col size={2}>
              <Flex justify="space-between">
                <ScalableText
                  style={styles.sectionContentTitle}
                  fontFamily="Regular"
                >
                  GST
                </ScalableText>
                <ScalableText fontFamily="Regular">-</ScalableText>
              </Flex>
            </Col>
            <Col size={2}>
              <ScalableText
                style={styles.sectionContentDataText}
                fontFamily="Regular"
              >
                {gstData.gstType === 'noGST' ? 'No GST' : `RS.${gstData.totalGSTAmount?.toLocaleString() || "0"}`}
              </ScalableText>
            </Col>
          </Row>
        </Grid>
      </Flex>
    </Flex>

    {/* Refund Payment Modal */}
    <Modal
      visible={showRefundModal}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCloseRefundModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <Flex flexDirection="row" justify="space-between" align="center" styles={styles.modalHeader}>
            <ScalableText style={styles.modalTitle} fontFamily="Bold">
              Refund Payment
            </ScalableText>
            <TouchableOpacity onPress={handleCloseRefundModal} style={styles.closeButton}>
              <ScalableText style={styles.closeButtonText} fontFamily="Bold">✕</ScalableText>
            </TouchableOpacity>
          </Flex>

          {/* Payment Summary */}
          <Flex flexDirection="row" justify="space-between" styles={styles.paymentSummary}>
            <ScalableText style={styles.summaryLabel} fontFamily="Medium">
              Received Payment :
            </ScalableText>
            <ScalableText style={styles.summaryAmount} fontFamily="Medium">
              ₹ {calculatedReceivedPayment?.toLocaleString() || "0"}
            </ScalableText>
          </Flex>
          <Flex flexDirection="row" justify="space-between" styles={styles.paymentSummary}>
            <ScalableText style={styles.summaryLabel} fontFamily="Medium">
              Refund Payment :
            </ScalableText>
            <ScalableText style={styles.summaryAmount} fontFamily="Medium">
              ₹ {paymentDetails?.refundAmount?.toLocaleString() || "0"}
            </ScalableText>
          </Flex>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <ScalableText style={styles.formTitle} fontFamily="Medium">
              Enter Amount To Refund
            </ScalableText>

            <View style={styles.inputContainer}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Amount *
              </ScalableText>
              <TextInput
                style={styles.textInput}
                value={refundAmount}
                onChangeText={setRefundAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Refund date *
              </ScalableText>
              <TextInput
                style={styles.textInput}
                value={refundDate}
                onChangeText={setRefundDate}
                placeholder="Select date (DD/MM/YYYY)"
              />
            </View>

            <View style={styles.inputContainer}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Note
              </ScalableText>
              <TextInput
                style={styles.textInput}
                value={refundNote}
                onChangeText={setRefundNote}
                placeholder="Enter note"
                multiline={true}
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveRefund}>
              <ScalableText style={styles.saveButtonText} fontFamily="Medium">
                SAVE
              </ScalableText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </>
  );
};

export default memo(CoursePaymentBlock);

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: "center",
    elevation: 4,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 30,
    minWidth: 167,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    padding: 15,
  },
  cardTitle: {
    fontSize: 14,
    color: COLORS.primary,
    paddingBottom: 4,
    textTransform: "capitalize",
  },
  cardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  sectionContentRow: {
    marginVertical: 5,
  },
  sectionContentTitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  sectionContentDataText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 15,
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
  menuContainer: {
    position: 'relative',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 15,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    color: COLORS.primary,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  paymentSummary: {
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryAmount: {
    fontSize: 14,
    color: COLORS.primary,
  },
  formContainer: {
    marginTop: 15,
  },
  formTitle: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.black,
    backgroundColor: COLORS.white,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
  },
});
