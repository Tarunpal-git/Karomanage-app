import React, { useMemo, useState, useEffect } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import { StyleSheet, View, Dimensions } from "react-native";
import { COLORS } from "../../../colors";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forms } from "../../../forms";
import Input from "../../../@ui/input/Input";
import ControlledSelect from "../../../@ui/controlled-select/ControlledSelect";
import CalendarInput from "../../../@ui/calendar-input/CalendarInput";
import Button from "../../../@ui/button/Button";
import { useCourseListsQuery } from "../../../apis/hooks/course/query/useCourseLists.query";
import { useCreateBatchMutation } from "../../../apis/hooks/batch/mutation/useCreateBatch.mutation";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import { useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../../../apis/urls";

const CreateBatch = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const [confirmation, setConfirmation] = useState(false);
  const handler = useForm({
    defaultValues: forms.createBatch.values,
    resolver: yupResolver(forms.createBatch.validation),
    reValidateMode: "onChange",
    mode: "onChange",
  });
  const { mutateAsync, isPending } = useCreateBatchMutation();
  const queryClient = useQueryClient();
  const { data: courseData, isLoading: courseLoading } = useCourseListsQuery();

  // Function to calculate default batch dates based on course data
  const calculateDefaultBatchDates = (courseId: string) => {
    if (!courseData?.data) return { startDate: null, endDate: null };
    
    const selectedCourse = courseData.data.find((course: any) => course.courseId === courseId);
    if (!selectedCourse) return { startDate: null, endDate: null };
    
    console.log('=== BATCH DATE CALCULATION DEBUG ===');
    console.log('Selected Course:', selectedCourse);
    console.log('Course Date Created:', selectedCourse.dateCreated);
    console.log('Course Expiry Date:', selectedCourse.courseExpiryDate);
    
    // Use course creation date as batch start date
    const startDate = new Date(selectedCourse.dateCreated);
    
    // Use course expiry date as batch end date (only if it exists)
    let endDate = null;
    if (selectedCourse.courseExpiryDate) {
      // Parse the expiry date (format: "29-10-2026")
      const expiryDateParts = selectedCourse.courseExpiryDate.split('-');
      endDate = new Date(
        parseInt(expiryDateParts[2]), // year
        parseInt(expiryDateParts[1]) - 1, // month (0-indexed)
        parseInt(expiryDateParts[0]) // day
      );
    }
    
    console.log('Parsed Start Date (from course creation):', startDate);
    console.log('Parsed End Date (from course expiry):', endDate);
    
    // Format dates in YYYY-MM-DD format for CalendarInput
    const formatDateForInput = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const result = {
      startDate: formatDateForInput(startDate),
      endDate: endDate ? formatDateForInput(endDate) : null
    };
    
    console.log('Final Start Date:', result.startDate);
    console.log('Final End Date:', result.endDate);
    console.log('=== END BATCH DATE CALCULATION DEBUG ===');
    
    return result;
  };

  // Handle course selection and set default dates
  const handleCourseChange = (courseId: string) => {
    console.log('=== COURSE CHANGE HANDLER DEBUG ===');
    console.log('Course ID received:', courseId);
    
    if (courseId) {
      // Log the selected course data for debugging
      const selectedCourse = courseData?.data?.find((course: any) => course.courseId === courseId);
      console.log('Selected course data:', selectedCourse);
      console.log('Course duration from API:', selectedCourse?.courseDuration);
      
      const defaultDates = calculateDefaultBatchDates(courseId);
      console.log('Default dates calculated:', defaultDates);
      
      if (defaultDates.startDate) {
        console.log('Setting start date to:', defaultDates.startDate);
        handler.setValue('batchStartDate', defaultDates.startDate);
      }
      if (defaultDates.endDate) {
        console.log('Setting end date to:', defaultDates.endDate);
        handler.setValue('batchEndDate', defaultDates.endDate);
      }
      
      // Verify the values were set
      console.log('Form values after setting dates:', handler.getValues());
      
      // Force form to re-render with new values
      handler.trigger(['batchStartDate', 'batchEndDate']);
      
      // Additional debugging for CalendarInput
      setTimeout(() => {
        console.log('Form values after timeout:', handler.getValues());
        console.log('batchStartDate value:', handler.watch('batchStartDate'));
        console.log('batchEndDate value:', handler.watch('batchEndDate'));
      }, 100);
    }
    console.log('=== END COURSE CHANGE HANDLER DEBUG ===');
  };

  // Watch for course changes and update dates automatically
  useEffect(() => {
    const selectedCourseId = handler.watch('courseId');
    if (selectedCourseId && courseData?.data) {
      console.log('Course changed to:', selectedCourseId);
      handleCourseChange(selectedCourseId);
    }
  }, [handler.watch('courseId'), courseData]);

  // Watch for date field changes to debug CalendarInput
  useEffect(() => {
    const subscription = handler.watch((value, { name }) => {
      if (name === 'batchStartDate' || name === 'batchEndDate') {
        console.log(`Field ${name} changed to:`, value[name]);
      }
    });
    return () => subscription.unsubscribe();
  }, [handler]);

  const COURSES_LIST = useMemo(() => {
    return courseData?.data
      ? courseData.data.map((course: { courseName: string; courseId: string }) => ({
          label: course.courseName,
          value: course.courseId,
        }))
      : [];
  }, [courseData]);

  const onSubmit: Parameters<typeof handler.handleSubmit>[0] = async (values) => {
    setConfirmation(true);
  };

  const handleFinalSubmit = async () => {
    const values = handler.getValues();
    const res = await mutateAsync(values);
    if (res.statusCode === 200) {
      // @ts-ignore
      customAlert.show({ message: "Batch created successfully!" });
      queryClient.invalidateQueries({ queryKey: [apiUrls.batch.FETCH_BATCHES_LIST] });
      handler.reset();
      navigation.goBack();
    } else {
      // @ts-ignore
      customAlert.show({ message: res.message || "Batch creation failed." });
    }
    setConfirmation(false);
  };

  const TIME_OPTIONS = Array.from({ length: 72 }, (_, i) => {
    const hour = Math.floor(i / 4) + 6; // Start at 6:00 AM
    const minute = (i % 4) * 15;
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const label = `${displayHour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')} ${ampm}`;
    return { label, value: label };
  });

  return (
    <SafeView>
      <AppHeader
        title="Add Batch"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />
      <View style={styles.screenRoot}>
        <View style={styles.formCard}>
          <ThemeScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom:20}}>
            <ScalableText style={styles.sectionTitle} fontFamily="Medium">
              Batch Details
            </ScalableText>
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Batch Name*
              </ScalableText>
              <Input
                handler={handler}
                label="Enter batch name"
                name="batchName"
                containerStyles={styles.inputContainer}
                maxLength={250}
                onChangeText={(text) => {
                  handler.setValue('batchName', text);
                }}
                onBlur={() => {
                  // Trim leading/trailing spaces when field loses focus
                  const currentValue = handler.getValues('batchName');
                  if (currentValue) {
                    handler.setValue('batchName', currentValue.trim());
                  }
                }}
              />
            </View>
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Batch Description
              </ScalableText>
              <Input
                handler={handler}
                label="Enter batch description"
                name="batchDescription"
                containerStyles={styles.inputContainer}
                maxLength={500}
                onChangeText={(text) => {
                  handler.setValue('batchDescription', text);
                }}
                onBlur={() => {
                  // Trim leading/trailing spaces when field loses focus
                  const currentValue = handler.getValues('batchDescription');
                  if (currentValue) {
                    handler.setValue('batchDescription', currentValue.trim());
                  }
                }}
              />
            </View>
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                {courseLoading ? "Loading..." : "Select Course*"}
              </ScalableText>
              <ControlledSelect
                handler={handler}
                label="Select course"
                name="courseId"
                options={COURSES_LIST}
                value={COURSES_LIST.find((c: { label: string; value: string }) => c.value === handler.watch("courseId")) || { label: "", value: "" }}
                dropdownButtonStyle={{
                  ...styles.inputContainer,
                  ...(COURSES_LIST.length === 0 && { opacity: 0.6 })
                }}
                disabled={COURSES_LIST.length === 0}
                onChangeValue={(selectedValue: string) => {
                  handler.setValue('courseId', selectedValue);
                  handleCourseChange(selectedValue);
                }}
              />
              {COURSES_LIST.length === 0 && !courseLoading && (
                <ScalableText style={styles.helperText} fontFamily="Regular">
                  No courses available. Please create a course first.
                </ScalableText>
              )}
              {/* Show course info when course is selected */}
              {handler.watch("courseId") && courseData?.data && (
                (() => {
                  const selectedCourse = courseData.data.find((course: any) => course.courseId === handler.watch("courseId"));
                  if (selectedCourse) {
                    // Format the dates for display
                    const startDate = new Date(selectedCourse.dateCreated).toLocaleDateString('en-GB');
                    const endDate = selectedCourse.courseExpiryDate || 'Not set';
                    
                    return (
                      <ScalableText style={styles.helperText} fontFamily="Regular">
                        Batch dates: Start from course creation ({startDate}) | End on course expiry ({endDate})
                      </ScalableText>
                    );
                  }
                  return null;
                })()
              )}
            </View>
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Batch Start Date*
              </ScalableText>
              <CalendarInput
                label="Select start date"
                handler={handler}
                name="batchStartDate"
              />
            </View>
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Batch End Date*
              </ScalableText>
              <CalendarInput
                label="Select end date"
                handler={handler}
                name="batchEndDate"
              />
            </View>
            

            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Do you want to set batch time?*
              </ScalableText>
              <ControlledSelect
                handler={handler}
                label="Select option"
                name="setBatchTime"
                options={[
                  { label: "Yes", value: "Yes" },
                  { label: "No", value: "No" },
                ]}
                value={handler.watch("setBatchTime") ? { label: handler.watch("setBatchTime"), value: handler.watch("setBatchTime") } : { label: "", value: "" }}
                dropdownButtonStyle={styles.inputContainer}
              />
            </View>
            {handler.watch("setBatchTime") === "Yes" && (
              <>
                <View style={styles.inputSpacing}>
                  <ScalableText style={styles.inputLabel} fontFamily="Medium">
                    Batch Class Start Time*
                  </ScalableText>
                  <ControlledSelect
                    handler={handler}
                    label="Select start time"
                    name="batchClassStartTime"
                    options={TIME_OPTIONS}
                    value={handler.watch("batchClassStartTime") ? { label: handler.watch("batchClassStartTime") || "", value: handler.watch("batchClassStartTime") || "" } : { label: "", value: "" }}
                    dropdownButtonStyle={styles.inputContainer}
                  />
                </View>
                <View style={styles.inputSpacing}>
                  <ScalableText style={styles.inputLabel} fontFamily="Medium">
                    Batch Class End Time*
                  </ScalableText>
                  <ControlledSelect
                    handler={handler}
                    label="Select end time"
                    name="batchClassEndTime"
                    options={TIME_OPTIONS}
                    value={handler.watch("batchClassEndTime") ? { label: handler.watch("batchClassEndTime") || "", value: handler.watch("batchClassEndTime") || "" } : { label: "", value: "" }}
                    dropdownButtonStyle={styles.inputContainer}
                  />
                </View>
              </>
            )}
          </ThemeScrollView>
        </View>
        <View style={styles.buttonBelowCardWrapper}>
          <Button
            onPress={handler.handleSubmit(onSubmit)}
            title={isPending ? "Submitting..." : "Submit"}
            btnStyles={styles.submitBtn}
            btnTxtStyles={styles.submitBtnText}
            disabled={isPending}
          />
        </View>
      </View>
      {confirmation && (
        <View style={styles.confirmationModal}>
          <View style={styles.confirmationBox}>
            <ScalableText style={{ fontSize: 16, marginBottom: 20 }} fontFamily="Medium">
              Are you sure you want to create this batch?
            </ScalableText>
            <Button
              title="Create Batch"
              onPress={handleFinalSubmit}
              btnStyles={{ marginBottom: 8, width: 105, height: 34, borderRadius: 8 }}
              btnTxtStyles={{ fontSize: 11, fontFamily: 'Poppins-Medium' }}
            />
            <Button
              title="Cancel"
              onPress={() => setConfirmation(false)}
              btnStyles={{ backgroundColor: COLORS.error, width: 120, height: 34, borderRadius: 8 }}
              btnTxtStyles={{ fontSize: 13, fontFamily: 'Poppins-Medium' }}
            />
          </View>
        </View>
      )}
    </SafeView>
  );
};

export default CreateBatch;

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
    marginBottom: 24,
    color: COLORS.black,
  },
  inputSpacing: {
    marginBottom: 16,
  },
  buttonBelowCardWrapper: {
    marginTop: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitBtn: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12,
  },
  submitBtnText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: COLORS.white,
  },
  confirmationModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmationBox: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    elevation: 5,
    width: "80%",
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
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 4,
    fontStyle: 'italic',
  },

}); 