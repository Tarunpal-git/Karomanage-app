import React, { FC, memo } from "react";
import { View, Modal, StyleSheet } from "react-native";
import { responsiveSize } from "../../../../utils/responsiveSize";
import { COLORS } from "../../../../colors";
import Flex from "../../../../@ui/flex/Flex";
import { useForm } from "react-hook-form";
import { forms } from "../../../../forms";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../../../@ui/input/Input";
import SelectInput from "../../../../@ui/select-input/SelectInput";
import { CONSTANT } from "../../../../constants";
import Button from "../../../../@ui/button/Button";
import ActionIcon from "../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import DateInput from "../../../../@ui/date-input/DateInput";
import moment from "moment";
import { useUpdateStudentEnquiryMutation } from "../../../../apis/hooks/enquiry/mutation/useUpdateStudentEnquiry.mutation";
import { useDynamicFlags } from "../../../../utils/hooks/useDynamicFlags";

interface IEditFollowUpModal {
  isVisible: boolean;
  handleClose: () => void;
  refetch: () => void;
  selectedQueries: string[];
  details: TEnquiryData;
  resetSelected: () => void;
}

const EditFollowUpModal: FC<IEditFollowUpModal> = ({
  handleClose,
  isVisible,
  details,
  refetch,
  selectedQueries,
  resetSelected,
}) => {
  const { mutateAsync, isPending } = useUpdateStudentEnquiryMutation();

  const handler = useForm({
    defaultValues: forms.followUp.values,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<any>(forms.followUp.validation),
    mode: "all",
    reValidateMode: "onSubmit",
  });

  const { flags, isLoading, error } = useDynamicFlags({
    flag: "enquiry",
  });
  console.log("[EnquiryEditFollowUpModal] Dynamic Flags:", flags);
  console.log("[EnquiryEditFollowUpModal] Error:", error);

  const onSubmit = async (values: typeof forms.followUp.values) => {
    const updatedDetails: TEnquiryData = JSON.parse(JSON.stringify(details));

    updatedDetails.followUp = updatedDetails.followUp.map((item) => {
      if (selectedQueries.includes(item.followUpId ?? "")) {
        return {
          ...item, // Retain existing properties
          ...values, // Overwrite with new values
          followUpDate: moment(values.followUpDate).format("DD-MM-YYYY"), // Update date format
        };
      }
      return item; // Return unmodified item if not included in selectedQueries
    });

    const res = await mutateAsync({ details: updatedDetails });
    if (res.statusCode === 200) {
      refetch();
      handler.reset();
      handleClose();
      resetSelected();
    } else {
      customAlert.show({ message: "data not updated" });
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
          <Flex w={"100%"} justify="flex-end">
            <ActionIcon mx={-30} onPress={handleClose} styles={{ padding: 5 }}>
              <AutoHeightImage source={IMAGES.closeIcon} width={25} />
            </ActionIcon>
          </Flex>

          <Flex my={15}>
            <DateInput
              handler={handler}
              label="Follow up date*"
              name="followUpDate"
            />
          </Flex>
          <Flex my={15}>
            <SelectInput
              value={handler.watch("flag")}
              label="Select Flag"
              options={flags}
              onChange={(e) => handler.setValue("flag", e)}
              dropdownButtonStyle={{ paddingHorizontal: 20 }}
            />
          </Flex>
          <Flex my={20}>
            <Input
              handler={handler}
              label="Message"
              name="message"
              inputStyles={styles.textArea}
              inputRoot={{ minHeight: 69 }}
            />
          </Flex>
          <Flex mt={20}>
            <Button
              btnStyles={styles.modalBtn}
              btnTxtStyles={styles.modalBtnText}
              title="Save Changes"
              disabled={isPending}
              loading={isPending}
              onPress={handler.handleSubmit(onSubmit)}
            />
          </Flex>
        </Flex>
      </View>
    </Modal>
  );
};

export default memo(EditFollowUpModal);

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
    width: "85%",
    padding: 40,
    paddingVertical: 19,
  },
  textStyle: {
    color: "black",
    textAlign: "center",
  },
  modalBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: responsiveSize(10),
    width: 150,
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 11,
  },
});
