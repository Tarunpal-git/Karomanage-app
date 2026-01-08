import React, { useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import { StyleSheet, View, Dimensions } from "react-native";
import { COLORS } from "../../../colors";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forms } from "../../../forms";
import Input from "../../../@ui/input/Input";
import ControlledSelect from "../../../@ui/controlled-select/ControlledSelect";
import Button from "../../../@ui/button/Button";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import { useCreateCourseMutation } from "../../../apis/hooks/courses/mutation/useCreateCourse.mutation";
import { useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../../../apis/urls";
import { store } from "../../../app/store";

const DURATION_YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => ({
  label: `${i + 1} Year${i === 0 ? "" : "s"}`,
  value: `${i + 1}`,
}));
const DURATION_MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1} Month${i === 0 ? "" : "s"}`,
  value: `${i + 1}`,
}));

const INSTALLMENT_OPTIONS = Array.from({ length: 11 }, (_, i) => ({
  label: `${i + 2}`,
  value: `${i + 2}`,
}));

const CreateCourse = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const [confirmation, setConfirmation] = useState(false);
  
  // Get organization data from store for GST calculations
  const organizationData = store.getState().organization.organization;
  const gstRuleData = organizationData?.gstRuleData;
  
  console.log('🏢 CreateCourse - Organization GST Data:', gstRuleData);
  console.log('🏢 CreateCourse - GST Inclusion Type:', gstRuleData?.inclusionType);
  console.log('🏢 CreateCourse - CGST Enabled:', gstRuleData?.cgstEnabled);
  console.log('🏢 CreateCourse - SGST Enabled:', gstRuleData?.sgstEnabled);
  
  const handler = useForm({
    defaultValues: {
      courseName: "",
      courseDescription: "",
      courseFee: "",
      courseFeeDescription: "",
      courseDurationYear: "",
      courseDurationMonth: "",
      maxPaymentInstallment: "2",
      mode: "offline", // Always set to offline
      subjects: [],
    },
    resolver: yupResolver(forms.createCourse.validation),
    reValidateMode: "onSubmit",
    mode: "all",
  });
  const { fields, append, remove } = useFieldArray({
    control: handler.control,
    name: "subjects",
  });
  const { mutateAsync, isPending } = useCreateCourseMutation();
  const queryClient = useQueryClient();

  const onSubmit = async () => {
    setConfirmation(true);
  };

  const handleFinalSubmit = async () => {
    const values = handler.getValues();
    // Ensure mode is always offline
    const submitData = {
      ...values,
      mode: "offline",
      courseFee: Number(values.courseFee),
      maxPaymentInstallment: Number(values.maxPaymentInstallment),
    };
    const res = await mutateAsync(submitData);
    if (res.statusCode === 200) {
      // @ts-ignore
      customAlert.show({ message: "Course created successfully!" });
      queryClient.invalidateQueries({ queryKey: [apiUrls.course.FETCH_COURSES_LIST] });
      handler.reset();
      navigation.goBack();
    } else {
      // @ts-ignore
      customAlert.show({ message: res.message || "Course creation failed." });
    }
    setConfirmation(false);
  };

  // Function to calculate GST amounts
  const calculateGSTAmounts = (baseAmount: number) => {
    if (!gstRuleData || gstRuleData.inclusionType === 'noGST') {
      return {
        cgstAmount: 0,
        sgstAmount: 0,
        totalGSTAmount: 0,
        amountAfterGST: baseAmount
      };
    }
    
    const cgstAmount = gstRuleData.cgstEnabled ? (baseAmount * gstRuleData.cgstPercentage) / 100 : 0;
    const sgstAmount = gstRuleData.sgstEnabled ? (baseAmount * gstRuleData.sgstPercentage) / 100 : 0;
    const totalGSTAmount = cgstAmount + sgstAmount;
    
    let amountAfterGST = baseAmount;
    if (gstRuleData.inclusionType === 'excluded') {
      // GST is added on top of base amount
      amountAfterGST = baseAmount + totalGSTAmount;
    } else if (gstRuleData.inclusionType === 'included') {
      // GST is already included in base amount
      amountAfterGST = baseAmount;
    }
    
    return {
      cgstAmount: Math.round(cgstAmount),
      sgstAmount: Math.round(sgstAmount),
      totalGSTAmount: Math.round(totalGSTAmount),
      amountAfterGST: Math.round(amountAfterGST)
    };
  };

  // Get current course fee for GST calculations
  const currentCourseFee = parseFloat(handler.watch('courseFee')) || 0;
  const gstAmounts = calculateGSTAmounts(currentCourseFee);

  return (
    <SafeView>
      <AppHeader
        title="Add Course"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />
      <View style={styles.screenRoot}>
        <View style={styles.formCard}>
          <ThemeScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 20 }}>
            <ScalableText style={styles.sectionTitle} fontFamily="Medium">
              Course Details
            </ScalableText>
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Course Name*
              </ScalableText>
              <Input
                handler={handler}
                label="Enter course name"
                name="courseName"
                containerStyles={styles.inputContainer}
                maxLength={250}
                onChangeText={(text) => {
                  handler.setValue('courseName', text);
                }}
                onBlur={() => {
                  // Trim leading/trailing spaces when field loses focus
                  const currentValue = handler.getValues('courseName');
                  if (currentValue) {
                    handler.setValue('courseName', currentValue.trim());
                  }
                }}
              />
            </View>
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Course Description
              </ScalableText>
              <Input
                handler={handler}
                label="Enter course description"
                name="courseDescription"
                containerStyles={styles.inputContainer}
                maxLength={500}
                onChangeText={(text) => {
                  handler.setValue('courseDescription', text);
                }}
                onBlur={() => {
                  // Trim leading/trailing spaces when field loses focus
                  const currentValue = handler.getValues('courseDescription');
                  if (currentValue) {
                    handler.setValue('courseDescription', currentValue.trim());
                  }
                }}
              />
            </View>
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Course Fee*
              </ScalableText>
              <Input
                handler={handler}
                label="Enter course fee"
                name="courseFee"
                keyboardType="numeric"
                containerStyles={styles.inputContainer}
                maxLength={10}
                onChangeText={(text) => {
                  handler.setValue('courseFee', text);
                }}
                onBlur={() => {
                  // Trim leading/trailing spaces when field loses focus
                  const currentValue = handler.getValues('courseFee');
                  if (currentValue) {
                    handler.setValue('courseFee', currentValue.trim());
                  }
                }}
              />
              
              {/* GST Breakdown Section - Only show when GST is enabled and fee is entered */}
              {gstRuleData && gstRuleData.inclusionType !== 'noGST' && currentCourseFee > 0 && (
                <View style={styles.gstBreakdownContainer}>
                  <ScalableText style={styles.gstBreakdownTitle} fontFamily="Medium">
                    Course Fee Breakdown
                  </ScalableText>
                  
                  {/* Tuition Fee (Excl. GST) - Show for both included and excluded GST */}
                  <View style={styles.breakdownRow}>
                    <ScalableText style={styles.breakdownLabel} fontFamily="Regular">
                      Tuition Fee (Excl. GST):
                    </ScalableText>
                    <ScalableText style={styles.breakdownValue} fontFamily="Medium">
                      ₹{gstRuleData.inclusionType === 'included' ? gstAmounts.amountAfterGST.toLocaleString('en-IN') : currentCourseFee.toLocaleString('en-IN')}.00
                    </ScalableText>
                  </View>
                  
                  {/* CGST */}
                  {gstRuleData.cgstEnabled && (
                    <View style={styles.breakdownRow}>
                      <ScalableText style={styles.breakdownLabel} fontFamily="Regular">
                        CGST ({gstRuleData.cgstPercentage}%):
                      </ScalableText>
                      <ScalableText style={styles.breakdownValue} fontFamily="Medium">
                        ₹{gstAmounts.cgstAmount.toLocaleString('en-IN')}.00
                      </ScalableText>
                    </View>
                  )}
                  
                  {/* SGST */}
                  {gstRuleData.sgstEnabled && (
                    <View style={styles.breakdownRow}>
                      <ScalableText style={styles.breakdownLabel} fontFamily="Regular">
                        SGST ({gstRuleData.sgstPercentage}%):
                      </ScalableText>
                      <ScalableText style={styles.breakdownValue} fontFamily="Medium">
                        ₹{gstAmounts.sgstAmount.toLocaleString('en-IN')}.00
                      </ScalableText>
                    </View>
                  )}
                  
                  {/* Total Course Fee */}
                  <View style={styles.breakdownRow}>
                    <ScalableText style={styles.breakdownLabel} fontFamily="Medium">
                      Course Fee:
                    </ScalableText>
                    <ScalableText style={styles.breakdownValue} fontFamily="Medium">
                      ₹{gstAmounts.amountAfterGST.toLocaleString('en-IN')}.00
                    </ScalableText>
                  </View>
                </View>
              )}
            </View>
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Course Fee Description
              </ScalableText>
              <Input
                handler={handler}
                label="Enter fee description"
                name="courseFeeDescription"
                containerStyles={styles.inputContainer}
                maxLength={500}
                onChangeText={(text) => {
                  handler.setValue('courseFeeDescription', text);
                }}
                onBlur={() => {
                  // Trim leading/trailing spaces when field loses focus
                  const currentValue = handler.getValues('courseFeeDescription');
                  if (currentValue) {
                    handler.setValue('courseFeeDescription', currentValue.trim());
                  }
                }}
              />
            </View>
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Course Duration (Year)
              </ScalableText>
              <ControlledSelect
                handler={handler}
                label="Select year"
                name="courseDurationYear"
                options={DURATION_YEAR_OPTIONS}
                value={DURATION_YEAR_OPTIONS.find((c) => c.value === handler.watch("courseDurationYear")) || { label: "", value: "" }}
                dropdownButtonStyle={styles.inputContainer}
              />
            </View>
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Course Duration (Month)
              </ScalableText>
              <ControlledSelect
                handler={handler}
                label="Select month"
                name="courseDurationMonth"
                options={DURATION_MONTH_OPTIONS}
                value={DURATION_MONTH_OPTIONS.find((c) => c.value === handler.watch("courseDurationMonth")) || { label: "", value: "" }}
                dropdownButtonStyle={styles.inputContainer}
              />
            </View>
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Max Installment*
              </ScalableText>
              <ControlledSelect
                handler={handler}
                label="Select max installment"
                name="maxPaymentInstallment"
                options={INSTALLMENT_OPTIONS}
                value={INSTALLMENT_OPTIONS.find((c) => c.value === String(handler.watch("maxPaymentInstallment"))) || { label: "2", value: "2" }}
                dropdownButtonStyle={styles.inputContainer}
              />
            </View>
            <ScalableText style={styles.subjectsTitle} fontFamily="Medium">
              Subjects
            </ScalableText>
            {fields.map((field, idx) => (
              <View key={field.id} style={styles.subjectRow}>
                <View style={styles.inputSpacing}>
                  <ScalableText style={styles.inputLabel} fontFamily="Medium">
                    Subject Name*
                  </ScalableText>
                  <Input
                    handler={handler}
                    label="Subject name"
                    name={`subjects.${idx}.subjectName`}
                    containerStyles={styles.inputContainer}
                    maxLength={250}
                    onChangeText={(text) => {
                      handler.setValue(`subjects.${idx}.subjectName`, text);
                    }}
                    onBlur={() => {
                      // Trim leading/trailing spaces when field loses focus
                      const currentValue = handler.getValues(`subjects.${idx}.subjectName`);
                      if (currentValue) {
                        handler.setValue(`subjects.${idx}.subjectName`, currentValue.trim());
                      }
                    }}
                  />
                </View>
                <View style={styles.inputSpacing}>
                  <ScalableText style={styles.inputLabel} fontFamily="Medium">
                    Subject Description
                  </ScalableText>
                  <Input
                    handler={handler}
                    label="Subject description"
                    name={`subjects.${idx}.subjectDescription`}
                    containerStyles={styles.inputContainer}
                    maxLength={500}
                    onChangeText={(text) => {
                      handler.setValue(`subjects.${idx}.subjectDescription`, text);
                    }}
                    onBlur={() => {
                      // Trim leading/trailing spaces when field loses focus
                      const currentValue = handler.getValues(`subjects.${idx}.subjectDescription`);
                      if (currentValue) {
                        handler.setValue(`subjects.${idx}.subjectDescription`, currentValue.trim());
                      }
                    }}
                  />
                </View>
                <Button
                  title="Remove"
                  onPress={() => remove(idx)}
                  btnStyles={{ width: 80, height: 28, backgroundColor: COLORS.error, marginBottom: 10 }}
                  btnTxtStyles={{ fontSize: 11 }}
                />
              </View>
            ))}
            <Button
              title="+ Add Subject"
              onPress={() => append({ subjectName: "", subjectDescription: "" })}
              btnStyles={{ width: 120, height: 34, borderRadius: 8, marginBottom: 0 }}
              btnTxtStyles={{ fontSize: 13, fontFamily: 'Poppins-Medium' }}
            />
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
              Are you sure you want to create this course?
            </ScalableText>
            <Button
              title="Create Course"
              onPress={handleFinalSubmit}
              btnStyles={{ marginBottom: 8, width: 105, height: 34, borderRadius: 8 }}
              btnTxtStyles={{ fontSize: 11, fontFamily: 'Poppins-Medium', textAlign: 'center',marginBottom: 2 }}
            />
            <Button
              title="Cancel"
              onPress={() => setConfirmation(false)}
              btnStyles={{ backgroundColor: COLORS.error, width: 105, height: 34, borderRadius: 8 }}
              btnTxtStyles={{ fontSize: 11, fontFamily: 'Poppins-Medium', textAlign: 'center',marginBottom: 2 }}
            />
          </View>
        </View>
      )}
    </SafeView>
  );
};

export default CreateCourse;

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
  inputLabel: {
    fontSize: 15,
    marginBottom: 8,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
  },
  inputContainer: {
    marginTop: 8,
  },
  gstBreakdownContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gstBreakdownTitle: {
    fontSize: 14,
    marginBottom: 8,
    color: COLORS.primary,
    fontFamily: 'Poppins-Medium',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  breakdownValue: {
    fontSize: 12,
    color: COLORS.black,
    fontFamily: 'Poppins-Medium',
  },
  subjectsTitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 8,
    color: COLORS.primary,
  },
  subjectRow: {
    backgroundColor: COLORS.whiteSmoke,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
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
}); 