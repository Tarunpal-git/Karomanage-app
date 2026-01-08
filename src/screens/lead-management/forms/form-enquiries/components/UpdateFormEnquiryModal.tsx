import { Modal, ScrollView, StyleSheet } from "react-native";
import React, { FC, memo, useEffect, useMemo } from "react";
import Flex from "../../../../../@ui/flex/Flex";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import { useFormTemplateDetailsQuery } from "../../../../../apis/hooks/lead-management/query/useFormTemplateDetails.query";
import Center from "../../../../../@ui/center/Center";
import DynamicInput from "../../../../../@ui/dymanic-forms/DynamicInput";
import { useForm } from "react-hook-form";
import Button from "../../../../../@ui/button/Button";
import { COLORS } from "../../../../../colors";
import { toCamelCase } from "../../../../../utils/toCamelCase";
import { useUpdateFormEnquiryMutation } from "../../../../../apis/hooks/lead-management/mutation/useUpdateFormEnquiry.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { generateDynamicValidation } from "../../../../../utils/generateDynamicValidation";

interface IUpdateFormEnquiryModal {
  isVisible: boolean;
  handleClose: () => void;
  data: TFormEnquiry;
  refetch: () => void;
}

const UpdateFormEnquiryModal: FC<IUpdateFormEnquiryModal> = ({
  data: enquiryData,
  handleClose,
  isVisible,
  refetch,
}) => {
  const { mutateAsync, isPending } = useUpdateFormEnquiryMutation();

  const { data, isLoading } = useFormTemplateDetailsQuery(
    enquiryData.formTemplateId
  );

  const formsFields: TFormField[] = useMemo(() => {
    if (!isLoading && data.data) {
      return data.data.formFields;
    } else {
      return [];
    }
  }, [isLoading, data]);

  const handler = useForm({
    values: enquiryData.formData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<any>(generateDynamicValidation(formsFields)),
    reValidateMode: "onSubmit",
    mode: "all",
  });

  useEffect(() => {
    if (enquiryData) {
      handler.reset(enquiryData.formData);
    }
  }, [enquiryData, handler.reset]);

  const handleSubmit = async (values: TFormEnquiry["formData"]) => {
    const res = await mutateAsync({
      details: {
        ...enquiryData,
        formData: values,
      },
    });

    if (res.statusCode === 200) {
      handleClose();
      refetch();
    } else {
      customAlert.show({ message: "information not update" });
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
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.centeredView}
        showsVerticalScrollIndicator={false}
      >
        <Flex styles={styles.modalView} flexDirection="column">
          <Flex my={20}>
            <ScalableText fontFamily="Medium">
              Update the lead information
            </ScalableText>
          </Flex>

          {isLoading && (
            <Flex>
              <Center styles={{ minHeight: 150 }} loading={true} />
            </Flex>
          )}

          {!isLoading &&
            formsFields.map((field) => (
              <DynamicInput
                {...field}
                name={toCamelCase(field.name)}
                handler={handler}
                key={field.name}
              />
            ))}

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
              disabled={isLoading || isPending}
              loading={isLoading || isPending}
              onPress={handler.handleSubmit(handleSubmit)}
            />
          </Flex>
        </Flex>
      </ScrollView>
    </Modal>
  );
};

export default memo(UpdateFormEnquiryModal);

const styles = StyleSheet.create({
  centeredView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "relative",
    padding: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 4,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
    padding: 40,
    paddingVertical: 19,
  },
  modalBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    width: 89,
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    height: 34,
    marginHorizontal: 3,
    elevation: 0,
  },
  modalBtnText: {
    fontSize: 13,
    letterSpacing: 1,
    fontFamily: "Poppins-Regular",
  },
});
