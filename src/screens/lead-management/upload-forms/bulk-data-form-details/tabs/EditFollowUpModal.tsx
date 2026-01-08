import React, { FC, memo } from "react";
import { View, Modal, StyleSheet } from "react-native";
import { responsiveSize } from "../../../../../utils/responsiveSize";
import { COLORS } from "../../../../../colors";
import Flex from "../../../../../@ui/flex/Flex";
import { useForm } from "react-hook-form";
import { forms } from "../../../../../forms";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../../../../@ui/input/Input";
import SelectInput from "../../../../../@ui/select-input/SelectInput";
import { CONSTANT } from "../../../../../constants";
import Button from "../../../../../@ui/button/Button";
import ActionIcon from "../../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../../images";
import DateInput from "../../../../../@ui/date-input/DateInput";
import { useUpdateBulkEnquiryDataMutation } from "../../../../../apis/hooks/upload-forms/mutation/useUpdateBulkEnquiryData.mutation";
import moment from "moment";
import { useDynamicFlags } from "../../../../../utils/hooks/useDynamicFlags";

interface IEditFollowUpModal {
  isVisible: boolean;
  handleClose: () => void;
  refetch: () => void;
  selectedQueries: TFollowUp[];
  resetSelected: () => void;
  enquiryDetails: TBulkDataEnquiry;
}

const EditFollowUpModal: FC<IEditFollowUpModal> = ({
  handleClose,
  isVisible,

  refetch,
  selectedQueries,
  resetSelected,
  enquiryDetails,
}) => {
  const { isPending, mutateAsync } = useUpdateBulkEnquiryDataMutation();
  const handler = useForm({
    defaultValues: forms.followUp.values,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<any>(forms.followUp.validation),
    mode: "all",
    reValidateMode: "onSubmit",
  });

  const { flags, isLoading, error } = useDynamicFlags({
    flag: "csv",
    formTemplateId: enquiryDetails.formTemplateId,
  });
  console.log("[BulkDataEditFollowUpModal] Dynamic Flags:", flags);
  console.log("[BulkDataEditFollowUpModal] Error:", error);

  const onSubmit = async (values: typeof forms.followUp.values) => {
    

    enquiryDetails.formData.followUp.forEach((followUp, index, array) => {
      const isItemInArray = selectedQueries.some(
        (item) =>
          item.followUpDate === followUp.followUpDate &&
          item.description === followUp.description &&
          item.flag === followUp.flag &&
          item.createDate === followUp.createDate
      );

      if (isItemInArray) {
        array[index] = {
          ...values,
          createDate: moment().format("DD/MM/YYYY"),
        }; // Update the followUp object with new values
      }
    });

    const res = await mutateAsync({
      details: enquiryDetails,
    });
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
              name="description"
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
