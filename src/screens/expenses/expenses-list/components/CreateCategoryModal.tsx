import { Modal, StyleSheet, View } from "react-native";
import React, { FC, memo } from "react";
import { COLORS } from "../../../../colors";
import { responsiveSize } from "../../../../utils/responsiveSize";
import Flex from "../../../../@ui/flex/Flex";
import Button from "../../../../@ui/button/Button";
import { useForm } from "react-hook-form";
import { forms } from "../../../../forms";
import { yupResolver } from "@hookform/resolvers/yup";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import Input from "../../../../@ui/input/Input";
import ActionIcon from "../../../../@ui/action-icon/ActionIcon";
import { useCreateExpenseCategoryMutation } from "../../../../apis/hooks/expenses/mutation/useCreateExpenseCategory.mutation";

interface ICreateCategoryModal {
  isVisible: boolean;
  handleClose: () => void;
  refetch: () => void;
}

const CreateCategoryModal: FC<ICreateCategoryModal> = ({
  handleClose,
  isVisible,
  refetch,
}) => {
  const { mutateAsync, isPending } = useCreateExpenseCategoryMutation();

  const handler = useForm({
    defaultValues: forms.expenseCategory.values,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(forms.expenseCategory.validation),
    mode: "all",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (values: typeof forms.expenseCategory.values) => {
    const res = await mutateAsync(values);

    if (res.statusCode === 200) {
      refetch();
      handleClose();
    } else {
      customAlert.show({
        message: "Category not added",
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
          <Flex mb={20} justify="space-between" w={"100%"}>
            <ScalableText style={{ fontSize: 16 }} fontFamily="Medium">
              Category
            </ScalableText>
            <ActionIcon onPress={handleClose}>
              <AutoHeightImage source={IMAGES.closeIcon} width={21} />
            </ActionIcon>
          </Flex>
          <Flex my={15} flexDirection="column">
            <Flex mb={20}>
              <Input handler={handler} label="Name*" name="categoryName" />
            </Flex>
            <Flex>
              <Input
                inputStyles={{ verticalAlign: "top", height: 80 }}
                inputRoot={styles.textArea}
                handler={handler}
                label="Description"
                name="categoryDescription"
              />
            </Flex>
          </Flex>

          <Flex mt={10}>
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
              title="Create"
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

export default memo(CreateCategoryModal);

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
    width: "90%",
    padding: 30,

    paddingVertical: 25,
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
