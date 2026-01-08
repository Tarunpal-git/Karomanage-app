import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import Button from '../../../@ui/button/Button';
import ScalableText from '../../../@ui/scalable-text/ScalableText';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useStudentAdmission } from './StudentAdmissionContext';
import { useNavigationConfirmation } from './hooks/useNavigationConfirmation';
import ControlledSelect from '../../../@ui/controlled-select/ControlledSelect';
import { yupResolver } from '@hookform/resolvers/yup';
import { courseBatchValidation } from './validation/courseBatch.validation';
import SafeView from '../../../@ui/safe-view/SafeView';
import AppHeader from '../../../@ui/app-header/AppHeader';
import ThemeScrollView from '../../../@ui/theme-scroll-view/ThemeScrollView';
import { COLORS } from '../../../colors';
import { useCourseListsQuery } from '../../../apis/hooks/course/query/useCourseLists.query';
import { useBatchListsQuery } from '../../../apis/hooks/batch/query/useBatchLists.query';
import { hasCreatePermission } from '../../../utils/fetchPermissionsTitle';

const CourseBatchScreen = () => {
  const { data, updateStepData } = useStudentAdmission();
  const navigation = useNavigation<any>();
  const { goBackWithConfirmation } = useNavigationConfirmation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [filteredBatches, setFilteredBatches] = useState<any[]>([]);

  // API hooks
  const { data: courseData, isLoading: courseLoading, refetch: refetchCourses } = useCourseListsQuery();
  const { data: batchData, isLoading: batchLoading, refetch: refetchBatches } = useBatchListsQuery();

  const handler = useForm({ 
    defaultValues: {
      course: data.course || '',
      batch: data.batch || '',
    },
    resolver: yupResolver(courseBatchValidation) 
  });

  // Extract course options from API
  const courseOptions = React.useMemo(() => {
    if (!courseLoading && courseData?.statusCode === 200 && courseData?.data) {
      return courseData.data.map((course: any) => ({
        label: course.courseName,
        value: course.courseName,
        courseId: course.courseId,
        courseFee: course.courseFee,
        maxPaymentInstallment: course.maxPaymentInstallment,
      }));
    }
    return [];
  }, [courseData, courseLoading]);

  // Extract batch options from API
  const batchOptions = React.useMemo(() => {
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

  // Restore selected course and batch from context data when component mounts or data changes
  useEffect(() => {
    if (data.course && courseOptions.length > 0) {
      const courseObj = courseOptions.find((course: any) => course.value === data.course);
      if (courseObj) {
        setSelectedCourse(courseObj);
        console.log('Restored selected course:', courseObj);
      }
    }
  }, [data.course, courseOptions]);

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
      
      // Restore previously selected batch if it exists in filtered batches
      if (data.batch && filtered.length > 0) {
        const batchExists = filtered.find((batch: any) => batch.value === data.batch);
        if (batchExists) {
          console.log('Restoring previously selected batch:', data.batch);
          handler.setValue('batch', data.batch);
        }
      }
    } else {
      console.log('No course selected or courseId missing, clearing batches');
      setFilteredBatches([]);
    }
    console.log('=== END BATCH FILTERING DEBUG ===');
  }, [selectedCourse, batchOptions, data.batch]);

  // Debug: Log current state
  useEffect(() => {
    console.log('Current filteredBatches:', filteredBatches);
    console.log('Current selectedCourse:', selectedCourse);
  }, [filteredBatches, selectedCourse]);

  const onNext = async (values: any) => {
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
        ...values,
        courseId: selectedCourseObj.courseId,
        courseFee: selectedCourseObj.courseFee,
        maxPaymentInstallment: selectedCourseObj.maxPaymentInstallment,
        batchId: selectedBatchObj.batchId,
        batchMode: selectedBatchObj.batchMode,
      };
      
      console.log('Updating step data with:', stepData);
      updateStepData(stepData);
      console.log('Step data updated successfully');

      // Clear form changes flag since we're proceeding to next step
      updateStepData({});
      
      navigation.navigate('PaymentDetails', {
        courseFee: selectedCourseObj.courseFee
      });
    } catch (error) {
      console.error('Error proceeding to next step:', error);
      Alert.alert('Error', 'Failed to proceed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onBack = () => {
    goBackWithConfirmation();
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
    navigation.navigate('CreateCourse');
  };

  const handleCreateBatch = () => {
    navigation.navigate('CreateBatch');
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
    <SafeView>
      <AppHeader
        title="Course & Batch"
        showDrawer={false}
        handleBackClick={goBackWithConfirmation}
      />
      <View style={styles.screenRoot}>
        <View style={styles.formCard}>
          <ThemeScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 20 }}>
            <ScalableText style={styles.sectionTitle} fontFamily="Medium">
              Course & Batch Selection
            </ScalableText>
            <ScalableText style={styles.stepIndicator} fontFamily="Regular">
              Step 3 of 5 - Choose Course and Batch
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
                    label={selectedCourse ? "Select batch" : "Select batch"}
                    options={selectedCourse && filteredBatches.length > 0 ? filteredBatches : []}
                    value={filteredBatches.find((opt: any) => opt.value === handler.watch('batch')) || { label: selectedCourse ? 'No batches available for this course' : 'Select batch', value: '' }}
                    disabled={!selectedCourse || (selectedCourse && filteredBatches.length === 0)}
                    dropdownButtonStyle={styles.inputContainer}
                    onChangeValue={(selectedValue: string) => {
                      console.log('ControlledSelect batch onChangeValue:', selectedValue);
                      if (selectedValue && selectedCourse) {
                        handler.setValue('batch', selectedValue);
                        // Clear any validation errors
                        handler.clearErrors('batch');
                      }
                    }}
                  />
                </View>
                {hasCreatePermission("Batch") && (
                  <TouchableOpacity
                    style={[styles.addButton, !selectedCourse && styles.disabledAddButton]}
                    onPress={handleCreateBatch}
                    disabled={!selectedCourse}
                  >
                    <ScalableText style={!selectedCourse ? {...styles.addButtonText, ...styles.disabledAddButtonText} : styles.addButtonText} fontFamily="Bold">+</ScalableText>
                  </TouchableOpacity>
                )}
              </View>
              {!selectedCourse && (
                <ScalableText style={styles.helperText} fontFamily="Regular">
                  Please select a course first to view available batches.
                </ScalableText>
              )}
              {selectedCourse && filteredBatches.length === 0 && (
                <ScalableText style={styles.helperText} fontFamily="Regular">
                  No batches available for the selected course. Please create a new batch or select a different course.
                </ScalableText>
              )}
            </View>
            

          </ThemeScrollView>
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
              title={isSubmitting ? "Processing..." : "Next"} 
              onPress={handler.handleSubmit(onNext)} 
              btnStyles={styles.nextBtn}
              btnTxtStyles={styles.nextBtnText}
              disabled={isSubmitting || isLoading}
            />
          </View>
        </View>
      </View>
      
      {(isLoading || isSubmitting || courseLoading || batchLoading) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ScalableText style={styles.loadingText} fontFamily="Medium">
            {isLoading || courseLoading || batchLoading ? "Loading..." : "Processing..."}
          </ScalableText>
        </View>
      )}
    </SafeView>
  );
};

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
    maxHeight: Dimensions.get('window').height * 0.55,
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
  inputWithButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  dropdownContainer: {
    flex: 1,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    borderWidth: 0,
  },
  addButtonText: {
    fontSize: 28,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 28,
  },
  disabledAddButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  disabledAddButtonText: {
    color: '#9E9E9E',
  },

  batchLabel: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 8,
    fontFamily: "Poppins-Medium",
  },
  batchInfo: {
    marginLeft: 8,
  },
  batchInfoText: {
    fontSize: 14,
    color: '#666',
    fontFamily: "Poppins-Regular",
  },
  buttonBelowCardWrapper: {
    marginTop: 16,
    alignItems: 'center',
    marginBottom: 10,
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
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: COLORS.black,
  },
  nextBtn: {
    flex: 1,
    borderRadius: 12,
  },
  nextBtnText: {
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
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 4,
  },

});

export default CourseBatchScreen; 