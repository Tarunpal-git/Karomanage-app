import React, { useState } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Button from '../../../@ui/button/Button';
import ScalableText from '../../../@ui/scalable-text/ScalableText';
import { useNavigation } from '@react-navigation/native';
import { useStudentAdmission } from './StudentAdmissionContext';
import { useNavigationConfirmation } from './hooks/useNavigationConfirmation';
import { useStudentAdmissionMutation } from '../../../apis/hooks/students/mutation/useStudentAdmission.mutation';
import SafeView from '../../../@ui/safe-view/SafeView';
import AppHeader from '../../../@ui/app-header/AppHeader';
import { COLORS } from '../../../colors';

const ReviewScreen = () => {
  const navigation = useNavigation<any>();
  const { data, resetData } = useStudentAdmission();
  const { goBackWithConfirmation } = useNavigationConfirmation();
  const { mutateAsync, isPending } = useStudentAdmissionMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get user and organization data from Redux store
  const authUser = useSelector((state: any) => state.auth.authUser);
  const selectedOrganization = useSelector((state: any) => state.auth.selectedOrganization);
  const organizationDetails = useSelector((state: any) => state.organization.organization);
  
  // Get GST rule data from organization
  const gstRuleData = organizationDetails?.gstRuleData;
  
  console.log('🏢 GST Rule Data in Review:', gstRuleData);
  console.log('🏢 GST Inclusion Type:', gstRuleData?.inclusionType);

  // Debug: Log all context data
  console.log('🔍 === REVIEW SCREEN DEBUG ===');
  console.log('Full context data:', JSON.stringify(data, null, 2));
  console.log('Auth user:', authUser);
  console.log('Selected organization:', selectedOrganization);
  console.log('Organization details:', organizationDetails);
  console.log('Student name:', data.studentFirstName, data.studentLastName);
  console.log('Student email:', data.studentEmail);
  console.log('Student contact:', data.studentContact);
  console.log('Course:', data.course);
  console.log('Batch:', data.batch);
  console.log('Payment details:', {
    totalPayment: data.totalPayment,
    partPayment: data.partPayment,
    numberOfInstallments: data.numberOfInstallments,
    firstPaymentInstallment: (data as any).firstPaymentInstallment,
    paymentStatus: (data as any).paymentStatus
  });
  console.log('🔍 === END REVIEW SCREEN DEBUG ===');

  // Test: Check if data is empty and show a message
  const isDataEmpty = !data.studentFirstName && !data.studentEmail && !data.course;
  if (isDataEmpty) {
    console.log('⚠️ WARNING: Context data appears to be empty!');
  }

  const onSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Helper function to format date to DD-MM-YYYY
      const formatDateForAPI = (dateValue: any) => {
        if (!dateValue) return null;
        
        let date: Date;
        
        if (typeof dateValue === 'string') {
          date = new Date(dateValue);
        } else if (dateValue instanceof Date) {
          date = dateValue;
        } else {
          return null;
        }
        
        if (isNaN(date.getTime())) {
          return null;
        }
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
      };

      // Map context data to API payload based on web implementation
      const payload = {
        user: {
          userCustomerId: authUser?.customerId || '',
          userCustomerName: authUser?.customerName || '',
          userCustomerEmail: authUser?.customerEmail || '',
          roleName: 'admin',
          roleId: 'J9xAF',
          userEmployeeId: 'TOP-9d8a8',
        },
        customerId: selectedOrganization?.customerId || '',
        rollNo: data.studentEnrollmentNumber || '',
        organizationId: selectedOrganization?.organizationId || '',
        studentFirstName: data.studentFirstName || '',
        studentLastName: data.studentLastName || '',
        studentEmail: data.studentEmail || '',
        studentDateOfBirth: data.studentDateOfBirth ? formatDateForAPI(data.studentDateOfBirth) : null,
        dateOfAdmission: data.dateOfAdmission ? formatDateForAPI(data.dateOfAdmission) : null,
        studentImage: '',
        referralpaymentStatus: (data as any).referralpaymentStatus || 'paid',
        referralAmount: data.referralAmount || 0,
        referedBy: data.referedBy || '',
        studentCollage: data.collegeName || '',
        studentDepartmentName: data.departmentName || '',
        studentCourse: data.collegeCourse || '',
        studentSemester: data.collegeSemester || '',
        state: data.state || '',
        city: data.city || '',
        studentContact: data.studentContact || '',
        studentFatherName: data.studentFatherName || '',
        studentFatherContact: data.studentFatherContact || '',
        studentEnrollmentNumber: data.studentEnrollmentNumber || '',
        studentAddress: data.studentAddress || '',
        studentGender: data.studentGender || '',
        studentDynamicFields: data.dynamicFields && data.dynamicFields.length > 0 ? data.dynamicFields.map((field: any) => {
          // Map field types to API format
          if (field.type === 'Text' || field.type === 'Email') {
            return {
              [field.fieldName]: field.value || '',
              type: 'text'
            };
          } else if (field.type === 'Number') {
            return {
              [field.fieldName]: field.value || '',
              type: 'number'
            };
          } else if (field.type === 'Media') {
            return {
              [field.fieldName]: field.mediaUri || field.value || '',
              type: 'media'
            };
          }
          return {
            [field.fieldName]: field.value || '',
            type: 'text'
          };
        }) : [],
        basicOrgAndCourseDetail: {
          courseName: data.course || '',
          organizationName: selectedOrganization?.organizationName || '',
          organizationLogo: '',
          organizationEmail: organizationDetails?.organizationEmail || '',
          organizationAddress: organizationDetails?.organizationAddress || '',
          organizationPhoneNumber: organizationDetails?.organizationPhoneNumber || '',
        },
        courses: [
          {
            courseId: data.courseId || '',
            courseStatus: 'active',
          },
        ],
        batch: [
          {
            batchId: data.batchId || '',
            batchStatus: 'active',
          },
        ],
        coupon: (() => {
          if (!data.coupon || data.coupon === '') {
            return [];
          }
          
          // Handle new coupon object format
          if (typeof data.coupon === 'object' && data.coupon.couponId) {
            return [{
              couponId: data.coupon.couponId,
              couponStatus: 'active',
            }];
          }
          
          // Handle string format (fallback)
          if (typeof data.coupon === 'string') {
            return [{
              couponId: data.coupon,
              couponStatus: 'active',
            }];
          }
          
          return [];
        })(),

        paymentDetails: {
          isPartPayment: data.partPayment === 'yes',
          totalPayment: data.totalPayment || 0,
          discountedPaymentAmount: (data as any).paymentAfterDiscount > 0 ? (data as any).paymentAfterDiscount : data.totalPayment || 0,
          totalReceivedPayment: (() => {
            // Use allPaymentDetails if available, otherwise calculate
            if ((data as any).allPaymentDetails && (data as any).allPaymentDetails.totalReceivedPayment !== undefined) {
              return (data as any).allPaymentDetails.totalReceivedPayment;
            }
            // Fallback calculation
            return (data as any).firstPaymentInstallment === 'pay' ? ((data as any).paymentAfterGST > 0 ? (data as any).paymentAfterGST : (data as any).paymentAfterDiscount > 0 ? (data as any).paymentAfterDiscount : data.totalPayment || 0) : 0;
          })(),
          paymentReceiveDate: data.partPayment === 'no' ? formatDateForAPI((data as any).paymentDate) : null,
          paymentNotes: (data as any).description || '',
          allPaymentStatus: (() => {
            // Use allPaymentDetails if available, otherwise calculate
            if ((data as any).allPaymentDetails && (data as any).allPaymentDetails.allPaymentStatus) {
              return (data as any).allPaymentDetails.allPaymentStatus;
            }
            // Fallback calculation
            return (data as any).firstPaymentInstallment === 'pay' ? 'paid' : 'due';
          })(),
          // GST-related fields - Match web format exactly
          cgstPercentage: gstRuleData?.cgstPercentage || 0,
          sgstPercentage: gstRuleData?.sgstPercentage || 0,
          gstinNumber: (data as any).gstinNumber || gstRuleData?.gstinNumber || '',
          cgstAmount: (data as any).cgstAmount || null,
          sgstAmount: (data as any).sgstAmount || null,
          inclusionType: gstRuleData?.inclusionType || 'noGST',
          // Add installment details for part payment - Match web structure exactly
          ...(data.partPayment === 'yes' && (data as any).installments && (data as any).installments.length > 0 && {
            installmentDetails: (data as any).installments.map((installment: any, index: number) => ({
              installmentNumber: index + 1,
              paymentStatus: installment.status || 'due',
              paymentReceiveDate: installment.status === 'paid' ? formatDateForAPI(installment.date) : null,
              nextpaymentDate: installment.status === 'due' ? formatDateForAPI(installment.date) : null,
              receivedPayment: installment.status === 'paid' ? parseFloat(installment.amount) || 0 : 0,
              duePayment: installment.status === 'due' ? parseFloat(installment.amount) || 0 : 0,
              paymentNotes: installment.description || ''
            }))
          })
        }
      };

      console.log('🎯 Payment Details Debug - API Payload:', {
        firstPaymentInstallment: (data as any).firstPaymentInstallment,
        allPaymentStatus: (data as any).firstPaymentInstallment === 'pay' ? 'paid' : 'due',
        totalReceivedPayment: (data as any).firstPaymentInstallment === 'pay' ? ((data as any).paymentAfterGST || (data as any).paymentAfterDiscount || data.totalPayment || 0) : 0,
        partPayment: data.partPayment,
        gstData: {
          cgstPercentage: gstRuleData?.cgstPercentage,
          sgstPercentage: gstRuleData?.sgstPercentage,
          gstinNumber: (data as any).gstinNumber || gstRuleData?.gstinNumber,
          inclusionType: gstRuleData?.inclusionType
        },
        paymentDetails: payload.paymentDetails,
        fullPayload: JSON.stringify(payload, null, 2)
      });
      
      // Log the final installment details structure
      if (data.partPayment === 'yes' && (data as any).installments) {
        console.log('📋 Installment Details Structure:', {
          installments: (data as any).installments,
          mappedInstallmentDetails: payload.paymentDetails.installmentDetails
        });
      }
      
      console.log('🔍 Payment Data Structure Debug:', {
        partPayment: data.partPayment,
        firstPaymentInstallment: (data as any).firstPaymentInstallment,
        totalPayment: data.totalPayment,
        paymentAfterDiscount: (data as any).paymentAfterDiscount,
        paymentAfterGST: (data as any).paymentAfterGST,
        gstinNumber: (data as any).gstinNumber || gstRuleData?.gstinNumber,
        paymentDate: (data as any).paymentDate,
        description: (data as any).description,
        gstInclusionType: gstRuleData?.inclusionType,
        cgstPercentage: gstRuleData?.cgstPercentage,
        sgstPercentage: gstRuleData?.sgstPercentage,
        installments: (data as any).installments
      });
      
      const response = await mutateAsync(payload as any);
      
      console.log('🎓 Student admission response:', response);
      
      if (response.statusCode === 200) {
        Alert.alert(
          'Success', 
          'Student admission successful!',
          [
            {
              text: 'OK',
              onPress: () => {
                resetData();
                // Navigate back to student list with refresh parameter
                navigation.navigate('StudentList', { refresh: true });
              }
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to create student');
      }
    } catch (error) {
      console.error('Admission error:', error);
      Alert.alert('Error', 'Failed to submit admission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onBack = () => {
    navigation.goBack();
  };

  const onPrint = () => {
    // Handle print functionality
    console.log('Print functionality');
  };

  // Calculate payment details
  const totalPayment = data.totalPayment || 0;
  const discountAmount = data.discountAmount || 0;
  const paymentAfterDiscount = (data as any).paymentAfterDiscount || totalPayment;
  const paymentAfterGST = (data as any).paymentAfterGST || paymentAfterDiscount;
  
  // Use GST-adjusted amount for final calculations
  const finalAmount = paymentAfterGST;
  const numberOfInstallments = parseInt(String(data.numberOfInstallments || '1'));
  const installmentAmount = finalAmount / numberOfInstallments;
  
  console.log('💰 Payment Calculations in Review:', {
    totalPayment,
    discountAmount,
    paymentAfterDiscount,
    paymentAfterGST,
    finalAmount,
    numberOfInstallments,
    installmentAmount,
    gstInclusionType: gstRuleData?.inclusionType
  });



  const renderSection = (title: string, data: any, icon?: string) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon && <ScalableText style={styles.sectionIcon}>{icon}</ScalableText>}
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

  return (
    <SafeView>
      <AppHeader
        title="Student Review Page"
        showDrawer={false}
        handleBackClick={goBackWithConfirmation}
      />
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
        
                <ScalableText style={styles.stepIndicator} fontFamily="Regular">
                  Check Your Filled Details
                </ScalableText>
              </View>
              
              {/* Student Personal Details Section */}
              {renderSection('Student Personal Details', {
                'Full Name': `${data.studentFirstName || ''} ${data.studentLastName || ''}`.trim() || '-',
                'Enrollment\nNumber': data.studentEnrollmentNumber || '-',
                'Email': data.studentEmail || '-',
                'Mobile\nNumber': data.studentContact || '-',
                'Date of Birth': data.studentDateOfBirth ? new Date(data.studentDateOfBirth).toLocaleDateString('en-GB') : '-',
                'Date of\nAdmission': data.dateOfAdmission ? new Date(data.dateOfAdmission).toLocaleDateString('en-GB') : '-',
                'Father\'s Name': data.studentFatherName || '-',
                'Father\'s Number': data.studentFatherContact || '-',
                'Address': data.studentAddress || '-',
                'Gender': data.studentGender || '-',
                'Referred By': data.referedBy || '-',
              }, '👤')}

              {/* Custom Fields Section */}
              {data.dynamicFields && data.dynamicFields.length > 0 && 
                (() => {
                  const fieldsWithValues = data.dynamicFields.filter((field: any) => {
                    if (field.type === 'Media') {
                      return field.mediaUri || (field.value && field.value.trim() !== '');
                    } else {
                      return field.value && field.value.trim() !== '';
                    }
                  });
                  
                  if (fieldsWithValues.length > 0) {
                    return renderSection('Custom Fields', 
                      fieldsWithValues.reduce((acc: any, field: any) => {
                        if (field.type === 'Media') {
                          acc[field.fieldName] = field.mediaUri ? 'File Selected' : field.value || '-';
                        } else {
                          acc[field.fieldName] = field.value || '-';
                        }
                        return acc;
                      }, {}), '📝'
                    );
                  }
                  return null;
                })()
              }

              {/* College Details Section */}
              {(data.state || data.city || data.collegeName || data.collegeCourse || data.collegeSemester || data.departmentName) && 
                renderSection('College Details', {
                  'State': data.state,
                  'City': data.city,
                  'College Name': data.collegeName,
                  'College Course': data.collegeCourse,
                  'College Semester': data.collegeSemester,
                  'Department\nName': data.departmentName,
                }, '🏫')
              }

              {/* Course & Batch Details Section */}
              {renderSection('Course & Batch Details', {
                'Course Name': data.course,
                'Course Fee': data.courseFee ? `₹ ${data.courseFee.toLocaleString('en-IN')}.00` : '-',
                'Batch Name': data.batch,
                'Batch Mode': data.batchMode,
              }, '📚')}

              {/* Payment Details Section */}
              {renderSection('Payment Details', {
                'Part Payment': data.partPayment === 'yes' ? 'Yes' : 'No',
                'Coupon Name': (() => {
                  if (!data.coupon || data.coupon === '') return '-';
                  if (typeof data.coupon === 'object' && data.coupon.couponName) return data.coupon.couponName;
                  if (typeof data.coupon === 'object' && data.coupon.label) return data.coupon.label;
                  if (typeof data.coupon === 'string') return data.coupon;
                  return '-';
                })(),
                'Course Fee': totalPayment ? `₹ ${totalPayment.toLocaleString('en-IN')}.00` : '-',
                'Discount Offered': discountAmount ? `₹ ${discountAmount.toLocaleString('en-IN')}.00` : '-',
                'Total': (data as any).paymentAfterDiscount ? `₹ ${(data as any).paymentAfterDiscount.toLocaleString('en-IN')}.00` : (totalPayment ? `₹ ${totalPayment.toLocaleString('en-IN')}.00` : '-'),
                ...(gstRuleData && gstRuleData.inclusionType === 'excluded' && gstRuleData.cgstEnabled && {
                  'CGST': `₹ ${(data as any).cgstAmount?.toLocaleString('en-IN') || '0'}.00 (${gstRuleData.cgstPercentage}%)`
                }),
                ...(gstRuleData && gstRuleData.inclusionType === 'excluded' && gstRuleData.sgstEnabled && {
                  'SGST': `₹ ${(data as any).sgstAmount?.toLocaleString('en-IN') || '0'}.00 (${gstRuleData.sgstPercentage}%)`
                }),
                ...(gstRuleData && gstRuleData.inclusionType === 'excluded' && {
                  'Grand Total': (data as any).paymentAfterGST ? `₹ ${(data as any).paymentAfterGST.toLocaleString('en-IN')}.00` : '-'
                }),
              }, '💰')}

              {/* Installment Details */}
              {numberOfInstallments > 1 && (data as any).installments && (data as any).installments.length > 0 && (data as any).installments.map((installment: any, index: number) => 
                renderSection(`Installment ${index + 1}`, {
                  'Date': installment.date ? new Date(installment.date).toLocaleDateString('en-GB') : '-',
                  'Amount': (() => {
                    if (gstRuleData && gstRuleData.inclusionType === 'excluded') {
                      const baseAmount = (data as any).paymentAfterDiscount || totalPayment;
                      return `₹ ${baseAmount.toLocaleString('en-IN')}.00`;
                    } else {
                      return installment.amount ? `₹ ${installment.amount.toLocaleString('en-IN')}.00` : '-';
                    }
                  })(),
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
                    ...(gstRuleData.cgstEnabled && {
                      'CGST': (() => {
                        const installmentAmount = parseInt(installment.amount) || 0;
                        const cgstAmount = Math.round((installmentAmount * gstRuleData.cgstPercentage) / 100);
                        return `₹ ${cgstAmount.toLocaleString('en-IN')}.00 (${gstRuleData.cgstPercentage}%)`;
                      })()
                    }),
                    ...(gstRuleData.sgstEnabled && {
                      'SGST': (() => {
                        const installmentAmount = parseInt(installment.amount) || 0;
                        const sgstAmount = Math.round((installmentAmount * gstRuleData.sgstPercentage) / 100);
                        return `₹ ${sgstAmount.toLocaleString('en-IN')}.00 (${gstRuleData.sgstPercentage}%)`;
                      })()
                    })
                  }),
                  ...(gstRuleData && gstRuleData.inclusionType !== 'noGST' && installment.status === 'paid' && gstRuleData.inclusionType === 'excluded' && {
                    'CGST': (() => {
                      const baseAmount = (data as any).paymentAfterDiscount || totalPayment;
                      const cgstAmount = gstRuleData.cgstEnabled ? Math.round((baseAmount * gstRuleData.cgstPercentage) / 100) : 0;
                      return `₹ ${cgstAmount.toLocaleString('en-IN')}.00 (${gstRuleData.cgstPercentage}%)`;
                    })(),
                    'SGST': (() => {
                      const baseAmount = (data as any).paymentAfterDiscount || totalPayment;
                      const sgstAmount = gstRuleData.sgstEnabled ? Math.round((baseAmount * gstRuleData.sgstPercentage) / 100) : 0;
                      return `₹ ${sgstAmount.toLocaleString('en-IN')}.00 (${gstRuleData.sgstPercentage}%)`;
                    })(),
                    'Total with GST': (() => {
                      const baseAmount = (data as any).paymentAfterDiscount || totalPayment;
                      const cgstAmount = gstRuleData.cgstEnabled ? Math.round((baseAmount * gstRuleData.cgstPercentage) / 100) : 0;
                      const sgstAmount = gstRuleData.sgstEnabled ? Math.round((baseAmount * gstRuleData.sgstPercentage) / 100) : 0;
                      const grandTotal = baseAmount + cgstAmount + sgstAmount;
                      return `₹ ${grandTotal.toLocaleString('en-IN')}.00`;
                    })()
                  }),
                  'Description': installment.description || '-'
                }, '📅')
              )}
              
              {/* Single Payment */}
              {numberOfInstallments === 1 && 
                renderSection('Installment 1', {
                  'Date': (data as any).paymentDate ? new Date((data as any).paymentDate).toLocaleDateString('en-GB') : '-',
                  'Amount': (() => {
                    if (gstRuleData && gstRuleData.inclusionType === 'excluded') {
                      const baseAmount = (data as any).paymentAfterDiscount || totalPayment;
                      return `₹ ${baseAmount.toLocaleString('en-IN')}.00`;
                    } else {
                      return finalAmount ? `₹ ${finalAmount.toLocaleString('en-IN')}.00` : '-';
                    }
                  })(),
                  'Payment Status': (data as any).paymentStatus === 'paid' ? 'Paid' : 'Due',
                  ...(gstRuleData && gstRuleData.inclusionType !== 'noGST' && (data as any).paymentStatus === 'paid' && gstRuleData.inclusionType === 'included' && {
                    'Tuition Fee': (() => {
                      const cgstAmount = gstRuleData.cgstEnabled ? Math.round((finalAmount * gstRuleData.cgstPercentage) / 100) : 0;
                      const sgstAmount = gstRuleData.sgstEnabled ? Math.round((finalAmount * gstRuleData.sgstPercentage) / 100) : 0;
                      const totalGST = cgstAmount + sgstAmount;
                      const tuitionFee = finalAmount - totalGST;
                      return `₹ ${tuitionFee.toLocaleString('en-IN')}.00`;
                    })(),
                    ...(gstRuleData.cgstEnabled && {
                      'CGST': (() => {
                        const cgstAmount = Math.round((finalAmount * gstRuleData.cgstPercentage) / 100);
                        return `₹ ${cgstAmount.toLocaleString('en-IN')}.00 (${gstRuleData.cgstPercentage}%)`;
                      })()
                    }),
                    ...(gstRuleData.sgstEnabled && {
                      'SGST': (() => {
                        const sgstAmount = Math.round((finalAmount * gstRuleData.sgstPercentage) / 100);
                        return `₹ ${sgstAmount.toLocaleString('en-IN')}.00 (${gstRuleData.sgstPercentage}%)`;
                      })()
                    })
                  }),
                  ...(gstRuleData && gstRuleData.inclusionType !== 'noGST' && (data as any).paymentStatus === 'paid' && gstRuleData.inclusionType === 'excluded' && {
                    'CGST': (() => {
                      const baseAmount = (data as any).paymentAfterDiscount || totalPayment;
                      const cgstAmount = gstRuleData.cgstEnabled ? Math.round((baseAmount * gstRuleData.cgstPercentage) / 100) : 0;
                      return `₹ ${cgstAmount.toLocaleString('en-IN')}.00 (${gstRuleData.cgstPercentage}%)`;
                    })(),
                    'SGST': (() => {
                      const baseAmount = (data as any).paymentAfterDiscount || totalPayment;
                      const sgstAmount = gstRuleData.sgstEnabled ? Math.round((baseAmount * gstRuleData.sgstPercentage) / 100) : 0;
                      return `₹ ${sgstAmount.toLocaleString('en-IN')}.00 (${gstRuleData.sgstPercentage}%)`;
                    })(),
                    'Total with GST': `₹ ${finalAmount.toLocaleString('en-IN')}.00`
                  }),
                  'Description': (data as any).description || '-'
                }, '📅')
              }
            </ScrollView>
          </View>
        </View>
        
        <View style={styles.buttonBelowCardWrapper}>
          <View style={styles.buttonRow}>
            <Button 
              title="BACK" 
              onPress={onBack} 
              btnStyles={styles.backBtn}
              btnTxtStyles={styles.backBtnText}
            />
            <Button 
              title="PRINT" 
              onPress={onPrint} 
              btnStyles={styles.printBtn}
              btnTxtStyles={styles.printBtnText}
            />
            <Button 
              title="SUBMIT" 
              onPress={onSubmit} 
              btnStyles={styles.submitBtn}
              btnTxtStyles={styles.submitBtnText}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </View>
      
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <ScalableText style={styles.loadingText} fontFamily="Medium">Submitting admission...</ScalableText>
        </View>
      )}
    </SafeView>
  );
};

export default ReviewScreen;

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
  statusValue: {
    fontWeight: '600',
  },
  statusPaid: {
    color: '#4CAF50',
  },
  statusDue: {
    color: '#FF9800',
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
  printBtn: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  printBtnText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: COLORS.white,
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