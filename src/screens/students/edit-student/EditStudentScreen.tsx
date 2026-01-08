import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStudentDetailsQuery } from '../../../apis/hooks/students/query/useStudentDetails.query';
import { useUpdateStudentMutation } from '../../../apis/hooks/students/mutation/useUpdateStudent.mutation.ts';
import SafeView from '../../../@ui/safe-view/SafeView';
import AppHeader from '../../../@ui/app-header/AppHeader';
import Input from '../../../@ui/input/Input';
import Button from '../../../@ui/button/Button';
import ScalableText from '../../../@ui/scalable-text/ScalableText';
import ControlledSelect from '../../../@ui/controlled-select/ControlledSelect';
import DateInput from '../../../@ui/date-input/DateInput';
import { COLORS } from '../../../colors';
import ThemeScrollView from '../../../@ui/theme-scroll-view/ThemeScrollView';
import Flex from '../../../@ui/flex/Flex';
import FileInputField from '../../../@ui/file-input/FileInputField';

// Validation schema
const editStudentValidation = yup.object().shape({
  studentFirstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  studentLastName: yup.string().optional(),
  studentEmail: yup.string().email('Invalid email').optional(),
  studentContact: yup.string().required('Phone number is required').matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'),
  studentFatherName: yup.string().optional(),
  studentFatherContact: yup.string().optional(),
  studentAddress: yup.string().optional(),
  studentGender: yup.string().optional(),
  studentDateOfBirth: yup.string().nullable().optional(),
  dateOfAdmission: yup.string().nullable().optional(),
  collegeName: yup.string().optional(),
  collegeCourse: yup.string().optional(),
  departmentName: yup.string().optional(),
  collegeSemester: yup.string().optional(),
  studentStatus: yup.string().optional(),
});

const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Defaulter', value: 'defaulter' },
];

const EditStudentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { studentData } = route.params || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customFields, setCustomFields] = useState<any[]>(studentData?.studentDynamicFields || []);
  
  // Get student details if not passed in params
  const { data: studentDetailsData, isLoading } = useStudentDetailsQuery(studentData?.rollNo || '');
  const studentDetails = studentData || studentDetailsData?.data;
  
  // Update mutation
  const { mutateAsync: updateStudent, isPending } = useUpdateStudentMutation();

  const handler = useForm({
    defaultValues: {
      studentFirstName: studentDetails?.studentFirstName || '',
      studentLastName: studentDetails?.studentLastName || '',
      studentEmail: studentDetails?.studentEmail || '',
      studentContact: studentDetails?.studentContact || '',
      studentFatherName: studentDetails?.studentFatherName || '',
      studentFatherContact: studentDetails?.studentFatherContact || '',
      studentAddress: studentDetails?.studentAddress || '',
      studentGender: studentDetails?.studentGender || '',
      studentDateOfBirth: studentDetails?.studentDateOfBirth || '',
      dateOfAdmission: studentDetails?.dateOfAdmission || '',
      collegeName: studentDetails?.studentCollage || '',
      collegeCourse: studentDetails?.studentCourse || '',
      departmentName: studentDetails?.studentDepartmentName || '',
      collegeSemester: studentDetails?.studentSemester || '',
      studentStatus: studentDetails?.studentStatus || 'active',
    },
    resolver: yupResolver(editStudentValidation),
  });

  // Update form when student details load
  useEffect(() => {
    if (studentDetails) {
      handler.reset({
        studentFirstName: studentDetails.studentFirstName || '',
        studentLastName: studentDetails.studentLastName || '',
        studentEmail: studentDetails.studentEmail || '',
        studentContact: studentDetails.studentContact || '',
        studentFatherName: studentDetails.studentFatherName || '',
        studentFatherContact: studentDetails.studentFatherContact || '',
        studentAddress: studentDetails.studentAddress || '',
        studentGender: studentDetails.studentGender || '',
        studentDateOfBirth: studentDetails.studentDateOfBirth || '',
        dateOfAdmission: studentDetails.dateOfAdmission || '',
        collegeName: studentDetails.studentCollage || '',
        collegeCourse: studentDetails.studentCourse || '',
        departmentName: studentDetails.studentDepartmentName || '',
        collegeSemester: studentDetails.studentSemester || '',
        studentStatus: studentDetails.studentStatus || 'active',
      });
    }
  }, [studentDetails, handler]);

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      // Merge existing student data with updated values
      const updatePayload = {
        ...studentDetails, // Keep existing data
        rollNo: studentDetails.rollNo,
        studentFirstName: values.studentFirstName,
        studentLastName: values.studentLastName,
        studentEmail: values.studentEmail,
        studentContact: values.studentContact,
        studentFatherName: values.studentFatherName,
        studentFatherContact: values.studentFatherContact,
        studentAddress: values.studentAddress,
        studentGender: values.studentGender,
        studentDateOfBirth: values.studentDateOfBirth,
        dateOfAdmission: values.dateOfAdmission,
        collegeName: values.collegeName,
        collegeCourse: values.collegeCourse,
        departmentName: values.departmentName,
        collegeSemester: values.collegeSemester,
        studentStatus: values.studentStatus,
        // Map form fields to API fields
        studentCollage: values.collegeName,
        studentCourse: values.collegeCourse,
        studentDepartmentName: values.departmentName,
        studentSemester: values.collegeSemester,
      };

      console.log('📝 === UPDATE STUDENT PAYLOAD ===');
      console.log('Payload:', JSON.stringify(updatePayload, null, 2));

      const response = await updateStudent(updatePayload);
      
      console.log('📝 Update response:', response);
      
      if (response.statusCode === 200) {
        Alert.alert(
          'Success', 
          'Student details updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to update student');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update student details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <SafeView>
        <AppHeader
          title="Edit Student"
          handleBackClick={() => navigation.goBack()}
          showDrawer={false}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <ScalableText style={styles.loadingText} fontFamily="Medium">Loading student details...</ScalableText>
        </View>
      </SafeView>
    );
  }

  return (
    <SafeView>
      <AppHeader
        title="Edit Student"
        handleBackClick={() => navigation.goBack()}
        showDrawer={false}
      />
      <View style={styles.screenRoot}>
        <View style={styles.formCard}>
          <ThemeScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 20 }}>
            <ScalableText style={styles.sectionTitle} fontFamily="Medium">
              Edit Student's Information
            </ScalableText>
            <ScalableText style={styles.stepIndicator} fontFamily="Regular">
              Update Student Information
            </ScalableText>
            
            {/* Student Image Section */}
                         <View style={styles.inputSpacing}>
               <ScalableText style={styles.inputLabel} fontFamily="Medium">
                 First Name*
               </ScalableText>
               <Input
                 handler={handler}
                 name="studentFirstName"
                 label="Enter first name"
                 containerStyles={styles.inputContainer}
                 placeholder="Enter first name"
               />
             </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Last Name
              </ScalableText>
              <Input
                handler={handler}
                name="studentLastName"
                label="Enter last name"
                containerStyles={styles.inputContainer}
                placeholder="Enter last name"
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Email
              </ScalableText>
              <Input
                handler={handler}
                name="studentEmail"
                label="Enter email address"
                containerStyles={styles.inputContainer}
                placeholder="Enter email address"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Phone Number*
              </ScalableText>
              <Input
                handler={handler}
                name="studentContact"
                label="Enter phone number"
                keyboardType="phone-pad"
                containerStyles={styles.inputContainer}
                placeholder="Enter phone number"
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Father's Name
              </ScalableText>
              <Input
                handler={handler}
                name="studentFatherName"
                label="Enter father's name"
                containerStyles={styles.inputContainer}
                placeholder="Enter father's name"
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Father's Phone Number
              </ScalableText>
              <Input
                handler={handler}
                name="studentFatherContact"
                label="Enter father's phone number"
                keyboardType="phone-pad"
                containerStyles={styles.inputContainer}
                placeholder="Enter father's phone number"
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Address
              </ScalableText>
              <Input
                handler={handler}
                name="studentAddress"
                label="Enter address"
                containerStyles={styles.inputContainer}
                placeholder="Enter address"
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Gender
              </ScalableText>
              <ControlledSelect
                handler={handler}
                name="studentGender"
                label="Select gender"
                options={GENDER_OPTIONS}
                value={GENDER_OPTIONS.find(opt => opt.value === handler.watch('studentGender')) || { label: '', value: '' }}
                dropdownButtonStyle={styles.inputContainer}
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Date of Birth
              </ScalableText>
              <View style={styles.inputContainer}>
                <DateInput
                  handler={handler}
                  name="studentDateOfBirth"
                  label="Select date of birth"
                  inputRoot={styles.dateInputStyle}
                />
              </View>
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Date of Admission
              </ScalableText>
              <View style={styles.inputContainer}>
                <DateInput
                  handler={handler}
                  name="dateOfAdmission"
                  label="Select date of admission"
                  inputRoot={styles.dateInputStyle}
                />
              </View>
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                College Name
              </ScalableText>
              <Input
                handler={handler}
                name="collegeName"
                label="Enter college name"
                containerStyles={styles.inputContainer}
                placeholder="Enter college name"
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Course
              </ScalableText>
              <Input
                handler={handler}
                name="collegeCourse"
                label="Enter course"
                containerStyles={styles.inputContainer}
                placeholder="Enter course"
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Department Name
              </ScalableText>
              <Input
                handler={handler}
                name="departmentName"
                label="Enter department name"
                containerStyles={styles.inputContainer}
                placeholder="Enter department name"
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Semester
              </ScalableText>
              <Input
                handler={handler}
                name="collegeSemester"
                label="Enter semester"
                containerStyles={styles.inputContainer}
                placeholder="Enter semester"
              />
            </View>
            
                         <View style={styles.inputSpacing}>
               <ScalableText style={styles.inputLabel} fontFamily="Medium">
                 Status
               </ScalableText>
               <ControlledSelect
                 handler={handler}
                 name="studentStatus"
                 label="Select status"
                 options={STATUS_OPTIONS}
                 value={STATUS_OPTIONS.find(opt => opt.value === handler.watch('studentStatus')) || { label: '', value: '' }}
                 dropdownButtonStyle={styles.inputContainer}
               />
             </View>
             
             {/* Student Image Section */}
             <View style={styles.inputSpacing}>
               <ScalableText style={styles.inputLabel} fontFamily="Medium">
                 Student Image
               </ScalableText>
               <View style={styles.imageContainer}>
                 <FileInputField
                   handler={handler}
                   name="studentImage"
                 />
               </View>
             </View>
             
             {/* Custom Fields Section */}
             {customFields.length > 0 && (
              <View style={styles.inputSpacing}>
                <ScalableText style={styles.inputLabel} fontFamily="Medium">
                  Custom Fields
                </ScalableText>
                {customFields.map((field: any, index: number) => {
                  const fieldName = Object.keys(field)[0];
                  const fieldValue = field[fieldName];
                  const fieldType = field.type;
                  
                  return (
                    <View key={index} style={styles.customFieldContainer}>
                      <View style={styles.customFieldHeader}>
                        <ScalableText style={styles.customFieldName} fontFamily="Medium">
                          {fieldName}
                        </ScalableText>
                        <View style={styles.fieldTypeContainer}>
                          <ScalableText style={styles.fieldType} fontFamily="Regular">
                            {fieldType.toUpperCase()}
                          </ScalableText>
                        </View>
                      </View>
                      
                                             <View style={styles.customFieldContent}>
                         {fieldType === 'media' || fieldType === 'Media' ? (
                           <FileInputField
                             handler={handler}
                             name={`customField_${index}`}
                           />
                         ) : (
                           <Input
                             handler={handler}
                             name={`customField_${index}`}
                             label={`Enter ${fieldName}`}
                             containerStyles={styles.inputContainer}
                             placeholder={`Enter ${fieldName}`}
                             defaultValue={fieldValue || ''}
                           />
                         )}
                       </View>
                    </View>
                  );
                })}
              </View>
            )}
          </ThemeScrollView>
        </View>
        <View style={styles.buttonBelowCardWrapper}>
          <View style={styles.buttonRow}>
            <Button 
              title="CANCEL" 
              onPress={onCancel} 
              btnStyles={styles.cancelBtn}
              btnTxtStyles={styles.cancelBtnText}
            />
            <Button 
              title="SUBMIT" 
              onPress={handler.handleSubmit(onSubmit)} 
              btnStyles={styles.submitBtn}
              btnTxtStyles={styles.submitBtnText}
              disabled={isSubmitting || isPending}
            />
          </View>
        </View>
      </View>
      
      {(isSubmitting || isPending) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <ScalableText style={styles.loadingText} fontFamily="Medium">Updating student details...</ScalableText>
        </View>
      )}
    </SafeView>
  );
};

export default EditStudentScreen;

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1, 
    backgroundColor: COLORS.whiteSmoke,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 24,
    marginHorizontal: 8,
    marginTop: 15,
    marginBottom: 0,
    paddingBottom: 0,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    maxHeight: Dimensions.get('window').height * 0.65,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.black,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  inputSpacing: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    marginBottom: 8,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
  },
  inputContainer: {
    marginTop: 8,
  },
  dateInputStyle: {
    marginTop: 0,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonBelowCardWrapper: {
    marginTop: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    width: '90%',
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  cancelBtnText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: COLORS.black,
  },
  submitBtn: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  submitBtnText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: COLORS.white,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontFamily: "Poppins-Medium",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Image styles
  imageContainer: {
    marginTop: 8,
  },
  // Custom field styles
  customFieldContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: COLORS.whiteSmoke,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  customFieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customFieldName: {
    fontSize: 14,
    color: COLORS.black,
    flex: 1,
  },
  fieldTypeContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fieldType: {
    fontSize: 10,
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  customFieldContent: {
    marginTop: 4,
  },
}); 