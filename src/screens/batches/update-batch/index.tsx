import React, { useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import { StyleSheet, View, Dimensions } from "react-native";
import { COLORS } from "../../../colors";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateBatchFormValidation } from "../../../forms/update-batch/validation";
import Input from "../../../@ui/input/Input";
import ControlledSelect from "../../../@ui/controlled-select/ControlledSelect";
import CalendarInput from "../../../@ui/calendar-input/CalendarInput";
import Button from "../../../@ui/button/Button";
import { useUpdateBatchMutation } from "../../../apis/hooks/batch/mutation/useUpdateBatch.mutation";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import { useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../../../apis/urls";
import moment from "moment";

interface UpdateBatchProps {
  batchData: any;
  onClose: () => void;
}

const UpdateBatch = ({ batchData, onClose }: UpdateBatchProps) => {
  console.log('UpdateBatch component rendered with data:', batchData);
  const navigation = useNavigation<TScreenNavigator>();
  const [confirmation, setConfirmation] = useState(false);
  
  // Helper function to convert DD/MM/YYYY to YYYY-MM-DD format for CalendarInput
  const convertDateStringToCalendarFormat = (dateString: string): string => {
    if (!dateString || dateString === "Invalid date") return "";
    
    // Check if it's already in DD/MM/YYYY format
    const dateParts = dateString.split('/');
    if (dateParts.length === 3) {
      const [day, month, year] = dateParts.map(Number);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        // Format as YYYY-MM-DD for CalendarInput
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }
    
    // Try parsing with moment
    const parsed = moment(dateString, ["DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]);
    if (parsed.isValid()) {
      return parsed.format("YYYY-MM-DD");
    }
    
    return "";
  };
  
  // Pre-fill form with existing batch data
  const defaultValues = {
    batchId: batchData?.batchId || "",
    batchName: batchData?.batchName || "",
    batchDescription: batchData?.batchDescription || "",
    courseId: batchData?.courses?.[0]?.courseId || "",
    batchStartDate: convertDateStringToCalendarFormat(batchData?.batchStartDate) || "",
    batchEndDate: convertDateStringToCalendarFormat(batchData?.batchEndDate) || "",
    setBatchTime: batchData?.batchClassStartTime ? "Yes" : "No",
    batchClassStartTime: batchData?.batchClassStartTime || "",
    batchClassEndTime: batchData?.batchClassEndTime || "",
    batchStatus: batchData?.batchStatus || "active",
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

  const handler = useForm({
    defaultValues,
    resolver: yupResolver(updateBatchFormValidation) as any,
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const { mutateAsync, isPending } = useUpdateBatchMutation();
  const queryClient = useQueryClient();

  const onSubmit: Parameters<typeof handler.handleSubmit>[0] = async (values) => {
    // Check if any fields have been modified
    const originalStartDate = convertDateStringToCalendarFormat(batchData?.batchStartDate);
    const originalEndDate = convertDateStringToCalendarFormat(batchData?.batchEndDate);
    
    const hasChanges = 
      values.batchName !== batchData?.batchName ||
      values.batchStartDate !== originalStartDate ||
      values.batchEndDate !== originalEndDate ||
      values.setBatchTime !== (batchData?.batchClassStartTime ? "Yes" : "No") ||
      (values.setBatchTime === "Yes" && values.batchClassStartTime !== batchData?.batchClassStartTime) ||
      (values.setBatchTime === "Yes" && values.batchClassEndTime !== batchData?.batchClassEndTime) ||
      values.batchStatus !== batchData?.batchStatus;

    if (!hasChanges) {
      // @ts-ignore
      customAlert.show({ message: "No changes detected. Please modify at least one field before updating." });
      return;
    }

    // Validate mandatory fields
    let hasErrors = false;

    if (!values.batchName || values.batchName.trim() === "") {
      handler.setError("batchName", { type: "required", message: "Batch name is required" });
      hasErrors = true;
    } else {
      handler.clearErrors("batchName");
    }

    if (!values.batchStartDate || values.batchStartDate.trim() === "") {
      handler.setError("batchStartDate", { type: "required", message: "Batch start date is required" });
      hasErrors = true;
    } else {
      handler.clearErrors("batchStartDate");
    }

    if (!values.batchEndDate || values.batchEndDate.trim() === "") {
      handler.setError("batchEndDate", { type: "required", message: "Batch end date is required" });
      hasErrors = true;
    } else {
      handler.clearErrors("batchEndDate");
    }

    if (hasErrors) {
      return;
    }

    setConfirmation(true);
  };

  const handleFinalSubmit = async () => {
    const values = handler.getValues();
    
    try {
      const res = await mutateAsync(values);
      
      if (res.statusCode === 200) {
        // @ts-ignore
        customAlert.show({ message: "Batch updated successfully!" });
        queryClient.invalidateQueries({ queryKey: [apiUrls.batch.FETCH_BATCHES_LIST] });
        queryClient.invalidateQueries({ queryKey: [apiUrls.batch.FETCH_BATCH_DETAILS] });
        onClose();
      } else {
        // @ts-ignore
        customAlert.show({ message: res.message || "Batch update failed." });
      }
    } catch (error) {
      console.error("Batch update error:", error);
      // @ts-ignore
      customAlert.show({ message: "Batch update failed. Please try again." });
    }
    
    setConfirmation(false);
  };


  return (
    <SafeView>
      <AppHeader
        title="Update Batch"
        showDrawer={false}
        handleBackClick={onClose}
      />
      <View style={styles.screenRoot}>
        <View style={styles.formCard}>
          <ThemeScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 20 }}>
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
              />
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

            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Batch Status*
              </ScalableText>
              <ControlledSelect
                handler={handler}
                label="Select status"
                name="batchStatus"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
                value={handler.watch("batchStatus") ? 
                  { 
                    label: handler.watch("batchStatus") === "active" ? "Active" : "Inactive", 
                    value: handler.watch("batchStatus") 
                  } : 
                  { label: "Active", value: "active" }
                }
                dropdownButtonStyle={styles.inputContainer}
              />
            </View>
          </ThemeScrollView>
        </View>
        <View style={styles.buttonBelowCardWrapper}>
          <Button
            onPress={handler.handleSubmit(onSubmit)}
            title={isPending ? "Updating..." : "Update Batch"}
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
              Are you sure you want to update this batch?
            </ScalableText>
            <Button
              title="Update Batch"
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

export default UpdateBatch;

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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  modalContent: {
    flex: 1,
    backgroundColor: COLORS.white,
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
}); 