import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Alert, ScrollView } from 'react-native';
import { COLORS } from '../../../../colors';
import ScalableText from '../../../../@ui/scalable-text/ScalableText';
import Button from '../../../../@ui/button/Button';
import { useAddCourseToStudent } from '../AddCourseToStudentContext';
import { useUpdateCouponCourseBatchDetailsMutation } from '../../../../apis/hooks/students/mutation/useUpdateCouponCourseBatchDetails.mutation';
import { useNavigation } from '@react-navigation/native';
import { TScreenNavigator } from '../../../../types/navigator/screen-navigator';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { useQueryClient } from '@tanstack/react-query';
import { apiUrls } from '../../../../apis/urls';

interface ReviewStepProps {
  onBack: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onBack }) => {
  const { data, resetData, studentRollNo, studentDetails } = useAddCourseToStudent();
  const { mutateAsync, isPending } = useUpdateCouponCourseBatchDetailsMutation();
  const navigation = useNavigation<TScreenNavigator>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Get auth user and organization details from Redux
  const { authUser } = useSelector((state: RootState) => state.auth);
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);
  const { organization } = useSelector((state: RootState) => state.organization);

  // Get GST rule data from organization
  const gstRuleData = organization?.gstRuleData;

  // Debug log for context data
  console.log('[REVIEW DATA]', JSON.stringify(data, null, 2));
  console.log('🏢 GST Rule Data in Review:', gstRuleData);
  console.log('🏢 GST Inclusion Type:', gstRuleData?.inclusionType);

  // Function to send invoice mail using invoke API
  const sendInvoiceMail = async () => {
    try {
      console.log('📧 === SENDING INVOICE MAIL ===');
      
      // Generate unique receipt number and installment ID
      const receiptNo = Math.floor(Math.random() * 100000) + 10000; // 5 digit random number
      const installmentId = `inst_${Date.now()}`;
      
      // Calculate amounts
      const totalAmount = data.amount || 0;
      const cgstAmount = data.cgstAmount || 0;
      const sgstAmount = data.sgstAmount || 0;
      const tuitionFee = totalAmount - (cgstAmount + sgstAmount);
      
      // Convert amount to words (simple implementation)
      const amountToWords = (amount: number) => {
        if (amount === 0) return 'Zero';
        if (amount === 1000) return 'Rupees One Thousand only';
        if (amount === 10000) return 'Rupees Ten Thousand only';
        if (amount === 15000) return 'Rupees Fifteen Thousand only';
        if (amount === 20000) return 'Rupees Twenty Thousand only';
        if (amount === 50000) return 'Rupees Fifty Thousand only';
        if (amount === 75000) return 'Rupees Seventy Five Thousand only';
        if (amount === 99000) return 'Rupees Ninety Nine Thousand only';
        return `Rupees ${amount.toLocaleString('en-IN')} only`;
      };

      const invoicePayload = {
        action: "studentFeeSlip",
        studentFeeSlip: {
          studentFeeSlipCustomerId: studentDetails?.customerId || authUser?.customerId || '',
          studentFeeSlipOrganiationId: selectedOrganization?.organizationId || '',
          studentFeeSlipOrganizationName: organization?.organizationName || '',
          studentFeeSlipOrganizationLogo: organization?.organizationLogo || '',
          studentFeeSlipEnrollmentNo: studentRollNo || '',
          studentFeeSlipRollNo: studentRollNo || '',
          studentFeeSlipStudentEmail: studentDetails?.studentEmail || '',
          studentFeeSlipOrganizationEmail: organization?.organizationEmail || '',
          studentFeeSlipOrganizationAddress: organization?.organizationAddress || '',
          studentFeeSlipOrganizationPhoneNumber: organization?.organizationPhoneNumber || '',
          studentFeeSlipReceiptNo: receiptNo,
          studentFeeSlipStudentName: studentDetails?.studentFirstName || '',
          studentFeeSlipCourseName: data.selectedCourse?.label || '',
          studentFeeSlipCourseId: data.selectedCourse?.courseId || '',
          studentFeeSlipInstallmentId: installmentId,
          studentFeeSlipAmountInWords: amountToWords(totalAmount),
          studentFeeSlipPurpose: "mail",
          studentFeeSlipDate: new Date().toLocaleDateString('en-GB'),
          studentFeeSlipGSTIN: gstRuleData?.gstinNumber || '',
          studentFeeSlipStudentPhoneNumber: studentDetails?.studentContact || '',
          studentFeeSlipWebsiteUrl: "",
          studentFeeSlipStudentAddress: studentDetails?.studentAddress || "",
          studentFeeSlipSGSTPercentage: gstRuleData?.sgstPercentage || 0,
          studentFeeSlipCGSTPercentage: gstRuleData?.cgstPercentage || 0,
          studentFeeSlipSGSTAmount: sgstAmount,
          studentFeeSlipCGSTAmount: cgstAmount,
          studentFeeSlipGrandTotal: totalAmount,
          studentFeeSlipCourseFee: totalAmount,
          previousFeeSlipReceivedAmount: 0,
          totalRemainingDueAmount: totalAmount,
          studentFeeSlipDiscountAmount: data.discountAmount || 0,
          studentFeeSlipAmountAfterDiscount: data.paymentAfterDiscount || totalAmount,
          studentFeeSlipPaidAmount: totalAmount,
          receivedPaymentCGSTAmount: cgstAmount,
          receivedPaymentSGSTAmount: sgstAmount,
          studentFeeSlipTutionFee: tuitionFee,
          studentFeeSlipDueAmount: 0,
          previousDiscountAmount: 0,
          inclusionType: gstRuleData?.inclusionType === 'included' ? 'Incl' : 'Excl'
        }
      };

      console.log('📧 Invoice Payload:', JSON.stringify(invoicePayload, null, 2));

      // Call invoke API for invoice mail
      const response = await fetch('https://karomanage-prod-apim.azure-api.net/email-services-fnp-prod/manual/paths/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: Subscription key should be added by backend or environment config
        },
        body: JSON.stringify(invoicePayload)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Invoice mail sent successfully:', responseData);
        Alert.alert('Success', 'Invoice mail sent successfully!');
      } else {
        throw new Error(`Failed to send invoice mail: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Invoice mail error:', error);
      Alert.alert('Error', 'Failed to send invoice mail. Please try again.');
    }
  };

  const formatDateForAPI = (dateValue: any) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Create installment details
      const installmentDetails = [{
        installmentId: `inst_${Date.now()}`, // Generate unique ID
        installmentNumber: 1,
        paymentStatus: 'paid',
        paymentReceiveDate: formatDateForAPI(data.paymentDate),
        receivedPayment: data.paymentAfterDiscount || 0,
        paymentNotes: data.description || '',
      }];

      // Create batch array with existing batches + new batch
      const existingBatches = studentDetails?.batch || [];
      const newBatch = {
        batchId: data.selectedBatch?.batchId || '',
        courseId: data.selectedCourse?.courseId || '',
      };
      const updatedBatches = [...existingBatches, newBatch];

      // Create coupon array if coupon is applied
      const couponArray = data.coupon ? [{
        couponId: (typeof data.coupon === 'object' && (data.coupon as any)?.couponId) ? (data.coupon as any).couponId : data.coupon,
        courseId: data.selectedCourse?.courseId || '',
        discountAmount: data.discountAmount || 0,
      }] : [];

      const payload = {
        user: {
          userCustomerId: authUser?.customerId || '',
          userCustomerName: authUser?.customerName || '',
          userCustomerEmail: authUser?.customerEmail || '',
          roleName: organization?.role?.roleName || '',
          roleId: organization?.role?.roleId || '',
          userEmployeeId: selectedOrganization?.organizationId || '',
        },
        customerId: selectedOrganization?.customerId || '',
        organizationId: selectedOrganization?.organizationId || '',
        rollNo: studentRollNo,
        courses: {
            courseId: data.selectedCourse?.courseId || '',
            paymentDetails: {
            isPartPayment: data.partPayment === 'yes',
            coursePayment: data.paymentAfterDiscount || 0,
            coursePaymentStatus: 'paid',
            installmentDetails: installmentDetails,
          },
        },
        batch: updatedBatches,
        coupon: couponArray,
      };

      console.log('🎓 === UPDATE COUPON COURSE BATCH DETAILS API CALL ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await mutateAsync(payload);

      console.log('🎓 API Response:', JSON.stringify(response, null, 2));
      console.log('🎓 === END UPDATE COUPON COURSE BATCH DETAILS API CALL ===');

      if (response.statusCode === 200) {
        // Send invoice mail if payment status is paid
        if (data.paymentStatus === 'paid') {
          console.log('📧 Payment status is paid, sending invoice mail...');
          await sendInvoiceMail();
        }
        
        // Invalidate course lists to refresh data - More comprehensive invalidation
        console.log('🔄 Invalidating queries to refresh data...');
        
        // Invalidate course-related queries
        queryClient.invalidateQueries({ queryKey: [apiUrls.course.FETCH_COURSES_LIST] });
        queryClient.invalidateQueries({ queryKey: [apiUrls.batch.FETCH_BATCHES_LIST] });
        queryClient.invalidateQueries({ queryKey: [apiUrls.student.FETCH_ALL_STUDENTS] });
        
        // Also invalidate any student-specific queries that might include course information
        queryClient.invalidateQueries({ queryKey: ['studentDetails'] });
        queryClient.invalidateQueries({ queryKey: ['studentCourses'] });
        queryClient.invalidateQueries({ queryKey: ['studentBatches'] });
        
        // Invalidate queries with organization context for better refresh
        if (selectedOrganization?.organizationId) {
          queryClient.invalidateQueries({ 
            queryKey: [apiUrls.student.FETCH_ALL_STUDENTS, selectedOrganization.organizationId] 
          });
          queryClient.invalidateQueries({ 
            queryKey: [apiUrls.course.FETCH_COURSES_LIST, selectedOrganization.organizationId] 
          });
          queryClient.invalidateQueries({ 
            queryKey: [apiUrls.batch.FETCH_BATCHES_LIST, selectedOrganization.organizationId] 
          });
        }
        
        // Force refetch of critical data
        queryClient.refetchQueries({ queryKey: [apiUrls.student.FETCH_ALL_STUDENTS] });
        
        console.log('✅ Queries invalidated successfully');
        
        Alert.alert(
          'Success',
          'Course added to student successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                resetData();
                // Navigate back with refresh parameter to trigger parent screen refresh
                navigation.goBack();
                // Also try to trigger a refresh in the parent screen
                setTimeout(() => {
                  // Force a refresh after navigation
                  queryClient.invalidateQueries({ queryKey: [apiUrls.student.FETCH_ALL_STUDENTS]});
                  queryClient.refetchQueries({ queryKey: [apiUrls.student.FETCH_ALL_STUDENTS] });
                }, 100);
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to add course to student');
      }
    } catch (error) {
      console.error('Add course error:', error);
      Alert.alert('Error', 'Failed to add course to student');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate installment details
  const numberOfInstallments = parseInt(String(data.numberOfInstallments || '1'));
  
  console.log('💰 Installment Details in Review:', {
    numberOfInstallments,
    gstInclusionType: gstRuleData?.inclusionType
  });

  const renderSection = (title: string, data: any, icon?: string) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon && <ScalableText style={styles.sectionIcon} fontFamily="Regular">{icon}</ScalableText>}
        <ScalableText style={styles.sectionTitle} fontFamily="Medium">{title}</ScalableText>
      </View>
      <View style={styles.sectionContent}>
        {Object.entries(data).map(([key, value]) => (
          <View key={key} style={styles.dataRow}>
            <ScalableText style={styles.label} fontFamily="Medium">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </ScalableText>
            <ScalableText style={styles.colon} fontFamily="Medium">:</ScalableText>
            <View style={styles.valueContainer}>
              <ScalableText style={styles.value} fontFamily="Regular">
                {value ? String(value) : '-'}
              </ScalableText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // Installment details
  const installments = Array.isArray(data.installments) ? data.installments : [];

  return (
    <View style={styles.screenRoot}>
      <View style={styles.mainContainer}>
        {/* Review Details - Full Width */}
        <View style={styles.fullWidthPanel}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.reviewHeader}>
              <ScalableText style={styles.mainTitle} fontFamily="Medium">
                Course & Payment Review
              </ScalableText>
              <ScalableText style={styles.stepIndicator} fontFamily="Regular">
                Step 3 of 3 - Review and Submit
              </ScalableText>
            </View>
            
            {/* Course & Batch Details Section */}
            {renderSection('Course & Batch Details', {
              'Course Name': data.selectedCourse?.label || '-',
              'Course Fee': data.selectedCourse?.courseFee ? `₹ ${data.selectedCourse.courseFee.toLocaleString('en-IN')}.00` : '-',
              'Batch Name': data.selectedBatch?.label || '-',
            }, '📚')}

            {/* Installment Details */}
            {numberOfInstallments > 1 && installments.length > 0 && installments.map((installment: any, index: number) => 
              renderSection(`Installment ${index + 1}`, {
                'Date': installment.date ? new Date(installment.date).toLocaleDateString('en-GB') : '-',
                'Amount': installment.amount ? `₹ ${installment.amount.toLocaleString('en-IN')}.00` : '-',
                'Payment Status': installment.status || (index === 0 ? 'Due' : 'Pending'),
                ...(gstRuleData && gstRuleData.inclusionType !== 'noGST' && installment.status === 'paid' && gstRuleData.inclusionType === 'included' && {
                  'Tuition Fee': (() => {
                    const installmentAmount = parseInt(installment.amount) || 0;
                    const cgstAmount = gstRuleData.cgstEnabled ? Math.round((installmentAmount * gstRuleData.cgstPercentage) / 100) : 0;
                    const sgstAmount = gstRuleData.sgstEnabled ? Math.round((installmentAmount * gstRuleData.sgstPercentage) / 100) : 0;
                    const totalGST = cgstAmount + sgstAmount;
                    const tuitionFee = installmentAmount - totalGST;
                    return `₹ ${tuitionFee.toLocaleString('en-IN')}.00`;
                  })(),
                  ...(gstRuleData.cgstEnabled && typeof gstRuleData.cgstPercentage === 'number' && {
                    'CGST': (() => {
                      const installmentAmount = parseInt(installment.amount) || 0;
                      const cgstAmount = Math.round((installmentAmount * gstRuleData.cgstPercentage) / 100);
                      return `₹ ${cgstAmount.toLocaleString('en-IN')}.00 (${gstRuleData.cgstPercentage}%)`;
                    })()
                  }),
                  ...(gstRuleData.sgstEnabled && typeof gstRuleData.sgstPercentage === 'number' && {
                    'SGST': (() => {
                      const installmentAmount = parseInt(installment.amount) || 0;
                      const sgstAmount = Math.round((installmentAmount * gstRuleData.sgstPercentage) / 100);
                      return `₹ ${sgstAmount.toLocaleString('en-IN')}.00 (${gstRuleData.sgstPercentage}%)`;
                    })()
                  })
                }),
                
                'Description': installment.description || '-'
              }, '📅')
            )}
            
            {/* Single Payment */}
            {numberOfInstallments === 1 && 
              renderSection('Installment 1', {
                'Date': data.paymentDate ? new Date(data.paymentDate).toLocaleDateString('en-GB') : '-',
                'Amount': data.amount ? `₹ ${data.amount.toLocaleString('en-IN')}.00` : '-',
                'Description': data.description || '-',
                // Add GST details for single payment when inclusion type is 'included'
                ...(gstRuleData && gstRuleData.inclusionType === 'included' && {
                  'Tuition Fee': (() => {
                    const totalAmount = parseInt(data.amount) || 0;
                    const cgstAmount = gstRuleData.cgstEnabled ? Math.round((totalAmount * gstRuleData.cgstPercentage) / 100) : 0;
                    const sgstAmount = gstRuleData.sgstEnabled ? Math.round((totalAmount * gstRuleData.sgstPercentage) / 100) : 0;
                    const totalGST = cgstAmount + sgstAmount;
                    const tuitionFee = totalAmount - totalGST;
                    return `₹ ${tuitionFee.toLocaleString('en-IN')}.00`;
                  })(),
                  ...(gstRuleData.cgstEnabled && typeof gstRuleData.cgstPercentage === 'number' && {
                    'CGST': (() => {
                      const totalAmount = parseInt(data.amount) || 0;
                      const cgstAmount = Math.round((totalAmount * gstRuleData.cgstPercentage) / 100);
                      return `₹ ${cgstAmount.toLocaleString('en-IN')}.00 (${gstRuleData.cgstPercentage}%)`;
                    })()
                  }),
                  ...(gstRuleData.sgstEnabled && typeof gstRuleData.sgstPercentage === 'number' && {
                    'SGST': (() => {
                      const totalAmount = parseInt(data.amount) || 0;
                      const sgstAmount = Math.round((totalAmount * gstRuleData.sgstPercentage) / 100);
                      return `₹ ${sgstAmount.toLocaleString('en-IN')}.00 (${gstRuleData.sgstPercentage}%)`;
                    })()
                  })
                })
              }, '📅')
            }
          </ScrollView>
        </View>
      </View>
      
      <View style={styles.buttonBelowCardWrapper}>
        <View style={styles.buttonRow}>
          <Button 
            title="Back" 
            onPress={onBack} 
            btnStyles={styles.backBtn}
            btnTxtStyles={styles.backBtnText}
          />
          <Button 
            title={isSubmitting || isPending ? "Submitting..." : "Submit"}
            onPress={onSubmit}
            btnStyles={styles.submitBtn}
            btnTxtStyles={styles.submitBtnText}
            disabled={isSubmitting || isPending}
          />
        </View>
      </View>
      
      {(isSubmitting || isPending) && (
        <View style={styles.loadingOverlay}>
          <ScalableText style={styles.loadingText} fontFamily="Medium">
            Adding course to student...
          </ScalableText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1, 
    backgroundColor: COLORS.whiteSmoke,
    paddingHorizontal: 8,
    paddingTop: 20,
  },
  mainContainer: {
    flex: 1,
  },
  fullWidthPanel: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    maxHeight: Dimensions.get('window').height * 0.65,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  reviewHeader: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.black,
  },
  stepIndicator: {
    fontSize: 16,
    color: '#666',
  },

  section: {
    marginBottom: 24,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: '600',
  },
  sectionContent: {
    padding: 20,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 14,
    color: '#555',
    width: '45%',
    fontFamily: "Poppins-Medium",
    fontWeight: '500',
    textAlign: 'left',
  },
  colon: {
    fontSize: 14,
    color: '#555',
    width: '5%',
    fontFamily: "Poppins-Medium",
    fontWeight: '500',
    textAlign: 'center',
  },
  valueContainer: {
    width: '50%',
    paddingLeft: 0,
  },
  value: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: 'left',
    fontFamily: "Poppins-Regular",
  },
  buttonBelowCardWrapper: {
    marginTop: 16,
    alignItems: 'center',
    marginBottom: '30%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    gap: 12,
  },
  backBtn: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  backBtnText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: COLORS.black,
  },
  submitBtn: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: COLORS.white,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontFamily: "Poppins-Medium",
  },
});

export default ReviewStep;