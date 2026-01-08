import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import responsive from '../../../../utils/responsive';
import { COLORS } from '../../../../colors';
import ScalableText from '../../../../@ui/scalable-text/ScalableText';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../../../../@ui/input/Input';
import ControlledSelect from '../../../../@ui/controlled-select/ControlledSelect';
import Button from '../../../../@ui/button/Button';
import ThemeScrollView from '../../../../@ui/theme-scroll-view/ThemeScrollView';
import { useAddCourseToStudent } from '../AddCourseToStudentContext';
import { useCourseListsQuery } from '../../../../apis/hooks/course/query/useCourseLists.query';
import { useBatchListsQuery } from '../../../../apis/hooks/batch/query/useBatchLists.query';
import { useNavigation } from '@react-navigation/native';
import { TScreenNavigator } from '../../../../types/navigator/screen-navigator';
import { hasCreatePermission } from '../../../../utils/fetchPermissionsTitle';

const validationSchema = yup.object().shape({
  course: yup.string().required('Course is required'),
  batch: yup.string().required('Batch is required'),
});

interface CourseBatchStepProps {
  onNext: () => void;
}

const CourseBatchStep: React.FC<CourseBatchStepProps> = ({ onNext }) => {
  const { data, updateStepData, studentDetails } = useAddCourseToStudent();
  const navigation = useNavigation<TScreenNavigator>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [filteredBatches, setFilteredBatches] = useState<any[]>([]);

  // API hooks
  const { data: courseData, isLoading: courseLoading, refetch: refetchCourses } = useCourseListsQuery();
  const { data: batchData, isLoading: batchLoading, refetch: refetchBatches } = useBatchListsQuery();

  const handler = useForm({
    defaultValues: {
      course: data.selectedCourse?.courseName || '',
      batch: data.selectedBatch?.batchName || '',
    },
    resolver: yupResolver(validationSchema),
  });

  // Extract course options from API and filter out already enrolled courses
  const courseOptions = useMemo(() => {
    if (!courseLoading && courseData?.statusCode === 200 && courseData?.data) {
      // Get student's existing course IDs
      const existingCourseIds = studentDetails?.courses?.map((course: any) => course.courseId) || [];
      
      console.log('=== COURSE FILTERING DEBUG ===');
      console.log('Student existing course IDs:', existingCourseIds);
      console.log('All available courses:', courseData.data.length);
      
      const filteredCourses = courseData.data.filter((course: any) => {
        const isAlreadyEnrolled = existingCourseIds.includes(course.courseId);
        console.log(`Course: ${course.courseName} (${course.courseId}) - Already enrolled: ${isAlreadyEnrolled}`);
        return !isAlreadyEnrolled; // Only show courses that student is NOT already enrolled in
      });
      
      console.log('Filtered courses (not enrolled):', filteredCourses.length);
      console.log('=== END COURSE FILTERING DEBUG ===');
      
      return filteredCourses.map((course: any) => ({
        label: course.courseName,
        value: course.courseName,
        courseId: course.courseId,
        courseFee: course.courseFee,
        maxPaymentInstallment: course.maxPaymentInstallment,
      }));
    }
    return [];
  }, [courseData, courseLoading, studentDetails?.courses]);

  // Extract batch options from API
  const batchOptions = useMemo(() => {
    if (!batchLoading && batchData?.statusCode === 200 && batchData?.data) {
      return batchData.data.map((batch: any) => ({
        label: batch.batchName,
        value: batch.batchName,
        batchId: batch.batchId,
        batchMode: batch.batchMode || 'offline',
        courseId: batch.courses && batch.courses.length > 0 ? batch.courses[0].courseId : null,
      }));
    }
    return [];
  }, [batchData, batchLoading]);

  // Filter batches based on selected course
  useEffect(() => {
    console.log('=== BATCH FILTERING DEBUG ===');
    console.log('Selected Course:', selectedCourse);
    console.log('Selected Course Type:', typeof selectedCourse);
    console.log('Batch Options:', batchOptions);
    console.log('Batch Options Length:', batchOptions.length);
    
    if (selectedCourse && selectedCourse.courseId) {
      const courseId = selectedCourse.courseId;
      console.log('Filtering batches for courseId:', courseId);
      
      const filtered = batchOptions.filter((batch: any) => {
        const matches = batch.courseId && batch.courseId === courseId;
        console.log('Checking batch:', batch.label, 'courseId:', batch.courseId, 'matches:', matches);
        return matches;
      });
      
      console.log('Filtered batches:', filtered);
      console.log('Filtered batches length:', filtered.length);
      setFilteredBatches(filtered);
    } else {
      console.log('No course selected or courseId missing, clearing batches');
      setFilteredBatches([]);
    }
    console.log('=== END BATCH FILTERING DEBUG ===');
  }, [selectedCourse, batchOptions]);

  const onSubmit = async (values: any) => {
    console.log('Form values:', values);
    console.log('Selected course:', selectedCourse);
    console.log('Filtered batches:', filteredBatches);
    console.log('Form errors:', handler.formState.errors);
    
    setIsSubmitting(true);
    
    try {
      // Find the selected course and batch objects
      const selectedCourseObj = courseOptions.find((course: any) => course.value === values.course);
      const selectedBatchObj = (filteredBatches.length > 0 ? filteredBatches : batchOptions).find((batch: any) => batch.value === values.batch);

      if (!selectedCourseObj) {
        Alert.alert('Error', 'Please select a valid course');
        return;
      }

      if (!selectedBatchObj) {
        Alert.alert('Error', 'Please select a valid batch');
        return;
      }

      console.log('Selected course object:', selectedCourseObj);
      console.log('Selected batch object:', selectedBatchObj);

      const stepData = {
        selectedCourse: selectedCourseObj,
        selectedBatch: selectedBatchObj,
        totalPayment: selectedCourseObj.courseFee || 0,
        paymentAfterDiscount: selectedCourseObj.courseFee || 0,
        amount: selectedCourseObj.courseFee || 0,
      };
      
      console.log('Updating step data with:', stepData);
      updateStepData(stepData);
      console.log('Step data updated successfully');

      onNext();
    } catch (error) {
      console.error('Error proceeding to next step:', error);
      Alert.alert('Error', 'Failed to proceed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCourseChange = (course: any) => {
    console.log('Course selected:', course);
    setSelectedCourse(course);
    handler.setValue('course', course?.value || '');
    handler.setValue('batch', ''); // Reset batch when course changes
    console.log('Form values after course change:', handler.getValues());
  };

  const handleBatchChange = (batch: any) => {
    console.log('Batch selected:', batch);
    handler.setValue('batch', batch?.value || '');
    console.log('Form values after batch change:', handler.getValues());
  };

  const handleCreateCourse = () => {
    navigation.navigate('CreateCourse' as any);
  };

  const handleCreateBatch = () => {
    navigation.navigate('CreateBatch' as any);
  };

  // Refresh data when returning to screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetchCourses();
      refetchBatches();
    });

    return unsubscribe;
  }, [navigation, refetchCourses, refetchBatches]);

  return (
    <View style={styles.screenRoot}>
      <View style={styles.formCard}>
        <ThemeScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 20 }}>
          <ScalableText style={styles.sectionTitle} fontFamily="Medium">
            Course & Batch Details
          </ScalableText>
          <ScalableText style={styles.stepIndicator} fontFamily="Regular">
            Step 1 of 3 - Select Course and Batch
          </ScalableText>

          <View style={styles.inputSpacing}>
            <ScalableText style={styles.inputLabel} fontFamily="Medium">
              Course*
            </ScalableText>
            <View style={styles.inputWithButtonContainer}>
              <View style={styles.dropdownContainer}>
                <ControlledSelect
                  handler={handler}
                  name="course"
                  label="Select course"
                  options={courseOptions}
                  value={courseOptions.find((opt: any) => opt.value === handler.watch('course')) || { label: 'Select course', value: '' }}
                  dropdownButtonStyle={styles.inputContainer}
                  onChangeValue={(selectedValue: string) => {
                    console.log('=== COURSE SELECTION DEBUG ===');
                    console.log('ControlledSelect course onChangeValue:', selectedValue);
                    console.log('Course Options:', courseOptions);
                    
                    if (selectedValue) {
                      const selectedCourseObj = courseOptions.find((course: any) => course.value === selectedValue);
                      console.log('Found selected course object:', selectedCourseObj);
                      console.log('Selected course object type:', typeof selectedCourseObj);
                      
                      handler.setValue('course', selectedValue);
                      setSelectedCourse(selectedCourseObj);
                      handler.setValue('batch', '');
                      // Clear any validation errors
                      handler.clearErrors('course');
                      
                      console.log('Course set in form:', handler.getValues('course'));
                      console.log('Selected course state set to:', selectedCourseObj);
                    }
                    console.log('=== END COURSE SELECTION DEBUG ===');
                  }}
                />
              </View>
              {hasCreatePermission("Courses") && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleCreateCourse}
                >
                  <ScalableText style={styles.addButtonText} fontFamily="Bold">+</ScalableText>
                </TouchableOpacity>
              )}
            </View>
            {/* Show info about filtered courses */}
            {studentDetails?.courses && studentDetails.courses.length > 0 && (
              <ScalableText style={styles.helperText} fontFamily="Regular">
                Note: {studentDetails.courses.length} course(s) already enrolled are hidden from the list.
              </ScalableText>
            )}
          </View>

          <View style={styles.inputSpacing}>
            <ScalableText style={styles.inputLabel} fontFamily="Medium">
              Batch*
            </ScalableText>
            <View style={styles.inputWithButtonContainer}>
              <View style={styles.dropdownContainer}>
                <ControlledSelect
                  handler={handler}
                  name="batch"
                  label="Select batch"
                  options={selectedCourse && filteredBatches.length > 0 ? filteredBatches : []}
                  value={filteredBatches.find((opt: any) => opt.value === handler.watch('batch')) || { label: selectedCourse ? 'No batches available for this course' : 'Select batch', value: '' }}
                  dropdownButtonStyle={{
                    ...styles.inputContainer,
                    ...(selectedCourse && filteredBatches.length === 0 && styles.disabledInput)
                  }}
                  onChangeValue={(selectedValue: string) => {
                    console.log('ControlledSelect batch onChangeValue:', selectedValue);
                    if (selectedValue) {
                      handler.setValue('batch', selectedValue);
                      // Clear any validation errors
                      handler.clearErrors('batch');
                    }
                  }}
                />
              </View>
              {hasCreatePermission("Batch") && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleCreateBatch}
                >
                  <ScalableText style={styles.addButtonText} fontFamily="Bold">+</ScalableText>
                </TouchableOpacity>
              )}
            </View>
            {selectedCourse && filteredBatches.length === 0 && (
              <ScalableText style={styles.helperText} fontFamily="Regular">
                No batches available for the selected course. Please create a new batch or select a different course.
              </ScalableText>
            )}
          </View>
        </ThemeScrollView>
      </View>
      <View style={styles.buttonBelowCardWrapper}>
        <Button
          title={isSubmitting ? "Processing..." : "Next"}
          onPress={handler.handleSubmit(onSubmit)}
          btnStyles={styles.nextBtn}
          btnTxtStyles={styles.nextBtnText}
          disabled={isSubmitting || isLoading}
        />
      </View>
      
      {(isLoading || isSubmitting || courseLoading || batchLoading) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ScalableText style={styles.loadingText} fontFamily="Medium">
            {isLoading || courseLoading || batchLoading ? "Loading..." : "Processing..."}
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
    paddingHorizontal: responsive.padding.md,
    paddingTop: responsive.margin.md,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: responsive.borderRadius.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsive.shadow.sm },
    shadowOpacity: 0.1,
    shadowRadius: responsive.shadow.md,
    padding: responsive.padding.md, // reduced from 24
    marginHorizontal: responsive.margin.sm,
    marginTop: responsive.margin.sm, // reduced from 15
    marginBottom: 0,
    paddingBottom: 0,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    maxHeight: responsive.hp('48%'), // reduced from 0.65
  },
  sectionTitle: {
    fontSize: responsive.fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: responsive.margin.sm,
    color: COLORS.black,
  },
  stepIndicator: {
    fontSize: responsive.fontSize.sm,
    color: '#666',
    marginBottom: responsive.margin.lg,
  },
  inputSpacing: {
    marginBottom: responsive.margin.md,
  },
  inputLabel: {
    fontSize: responsive.fontSize.md,
    marginBottom: responsive.margin.sm,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
  },
  inputContainer: {
    marginTop: responsive.margin.sm,
  },
  inputWithButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: responsive.margin.md,
    marginTop: responsive.margin.sm,
  },
  dropdownContainer: {
    flex: 1,
  },
  addButton: {
    width: responsive.wp('12%'),
    height: responsive.wp('12%'),
    borderRadius: responsive.wp('6%'),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsive.shadow.sm },
    shadowOpacity: 0.25,
    shadowRadius: responsive.shadow.md,
    borderWidth: 0,
  },
  addButtonText: {
    fontSize: responsive.fontSize.xxl,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: responsive.fontSize.xxl,
  },
  feeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: responsive.padding.md,
    borderRadius: responsive.borderRadius.md,
    marginBottom: responsive.margin.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  feeLabel: {
    fontSize: responsive.fontSize.md,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
  },
  feeValue: {
    fontSize: responsive.fontSize.lg,
    color: '#28a745',
    fontFamily: "Poppins-Bold",
  },
  batchDetails: {
    backgroundColor: '#f8f9fa',
    padding: responsive.padding.md,
    borderRadius: responsive.borderRadius.md,
    marginBottom: responsive.margin.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  batchLabel: {
    fontSize: responsive.fontSize.md,
    color: COLORS.black,
    marginBottom: responsive.margin.sm,
    fontFamily: "Poppins-Medium",
  },
  batchInfo: {
    marginLeft: responsive.margin.sm,
  },
  batchInfoText: {
    fontSize: responsive.fontSize.sm,
    color: '#666',
    fontFamily: "Poppins-Regular",
  },
  buttonBelowCardWrapper: {
    marginTop: responsive.margin.sm, // reduced from 16
    alignItems: 'center',
    marginBottom: 0, // was 10, now 0 to bring button up
  },
  nextBtn: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: responsive.borderRadius.md,
  },
  nextBtnText: {
    fontSize: responsive.fontSize.lg,
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
    marginTop: responsive.margin.md,
    fontSize: responsive.fontSize.md,
    color: '#666',
  },
  helperText: {
    fontSize: responsive.fontSize.xs,
    color: '#666',
    marginTop: responsive.margin.xs,
    marginLeft: responsive.margin.xs,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
});

export default CourseBatchStep; 