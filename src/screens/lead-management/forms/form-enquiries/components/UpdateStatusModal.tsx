import { Modal, StyleSheet, View } from "react-native";
import React, { FC, memo } from "react";
import { COLORS } from "../../../../../colors";
import { responsiveSize } from "../../../../../utils/responsiveSize";
import Flex from "../../../../../@ui/flex/Flex";
import Button from "../../../../../@ui/button/Button";
import SelectInput from "../../../../../@ui/select-input/SelectInput";
import { useForm } from "react-hook-form";
import { forms } from "../../../../../forms";
import { yupResolver } from "@hookform/resolvers/yup";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import { useUpdateFormEnquiryMutation } from "../../../../../apis/hooks/lead-management/mutation/useUpdateFormEnquiry.mutation";

interface IUpdateStatusModal {
  isVisible: boolean;
  handleClose: () => void;
  refetch: () => void;
  data: TFormEnquiry;
}

const UpdateStatusModal: FC<IUpdateStatusModal> = ({
  handleClose,
  isVisible,
  refetch,
  data,
}) => {
  const { mutateAsync, isPending } = useUpdateFormEnquiryMutation();

  const handler = useForm({
    defaultValues: forms.updateEnquiryStatus.values,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(forms.updateEnquiryStatus.validation),
    mode: "all",
    reValidateMode: "onSubmit",
  });

  const updateStatus = async (
    values: typeof forms.updateEnquiryStatus.values
  ) => {
    const res = await mutateAsync({
      details: { ...data, formStatus: values.status },
    });

    if (res.statusCode === 200) {
      handleClose();
      refetch();
    } else {
      customAlert.show({
        message: "template not updated. Try again later",
      });
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
      visible={isVisible}
      onDismiss={handleClose}
    >
      <View style={styles.centeredView}>
        <Flex styles={styles.modalView} flexDirection="column">
          <Flex my={20}>
            <ScalableText fontFamily="Medium">
              Change the status of this lead
            </ScalableText>
          </Flex>
          <Flex my={15} flexDirection="column">
            <SelectInput
              value={handler.watch("status")}
              label="Current Status"
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inActive" },
                { label: "Delete", value: "delete" },
                { label: "Student", value: "student" },
              ]}
              onChange={(e) => handler.setValue("status", e)}
              dropdownButtonStyle={{
                paddingHorizontal: 20,
                width: 180,
                height: 46,
              }}
            />

            {handler.formState.errors && handler.formState.errors.status && (
              <ScalableText
                fontFamily="Regular"
                style={{
                  color: COLORS.error,
                  fontSize: 10,
                }}
              >
                {handler.formState.errors.status.message}
              </ScalableText>
            )}
          </Flex>

          <Flex mt={20}>
            <Button
              btnStyles={{
                ...styles.modalBtn,
                borderWidth: 1,
                borderColor: COLORS.primary,
                backgroundColor: COLORS.white,
              }}
              btnTxtStyles={{ ...styles.modalBtnText, color: COLORS.primary }}
              title="Cancel"
              onPress={handleClose}
            />
            <Button
              btnStyles={styles.modalBtn}
              btnTxtStyles={styles.modalBtnText}
              title="Update"
              disabled={isPending}
              loading={isPending}
              onPress={handler.handleSubmit(updateStatus)}
            />
          </Flex>
        </Flex>
      </View>
    </Modal>
  );
};

export default memo(UpdateStatusModal);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "relative",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,

    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 322,
    padding: 40,
    paddingVertical: 19,
  },
  textStyle: {
    color: "black",
    textAlign: "center",
  },
  modalBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: responsiveSize(6),
    width: 89,
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    height: 34,
    marginHorizontal: 3,
  },
  modalBtnText: {
    fontSize: 13,
    letterSpacing: 1,
    fontFamily: "Poppins-Regular",
  },

  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  textArea: {
    height: 80,
    verticalAlign: "top",
  },
});
