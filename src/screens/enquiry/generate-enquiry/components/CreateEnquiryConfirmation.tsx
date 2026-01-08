import { Modal, StyleSheet, View } from "react-native";
import React, { FC, memo, useState } from "react";
import { COLORS } from "../../../../colors";
import { responsiveSize } from "../../../../utils/responsiveSize";
import Flex from "../../../../@ui/flex/Flex";
import Button from "../../../../@ui/button/Button";

import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import ActionIcon from "../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import { forms } from "../../../../forms";
import { useGenerateEnquiryMutation } from "../../../../apis/hooks/enquiry/mutation/useGenerateEnquiry.mutation";
import { useAppSelector } from "../../../../app/hooks";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../../types/navigator/screen-navigator";

interface ICreateEnquiryConfirmation {
  isVisible: boolean;
  handleClose: () => void;
  refetch: () => void;
  data: typeof forms.generateEnquiry.values;
}

const CreateEnquiryConfirmation: FC<ICreateEnquiryConfirmation> = ({
  handleClose,
  isVisible,
  refetch,
  data,
}) => {
  const navigation = useNavigation<TScreenNavigator>();

  const { mutateAsync } = useGenerateEnquiryMutation();
  const { selectedOrganization } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState({
    skip: false,
    assign: false,
  });

  const handleSubmit = async (action: "assign" | "skip") => {
    setLoading({
      skip: action === "assign" ? false : true,
      assign: action === "skip" ? false : true,
    });

    const res = await mutateAsync({
      ...data,
      customerID: selectedOrganization?.customerId ?? "",
      organizationId: selectedOrganization?.organizationId ?? "",
      status: "active",
      studentName: data.studentName,
      followUp: [],
    });

    if (res.id) {
      action === "skip"
        ? navigation.navigate("EnquiryLists")
        : navigation.navigate("AssignManager", { leads: [res] });

      setLoading({
        skip: false,
        assign: false,
      });

      refetch();
      handleClose();
    } else {
      setLoading({
        skip: false,
        assign: false,
      });

      customAlert.show({
        message: "Enquiry not generated. Try again later",
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
          <Flex w={"100%"} justify="flex-end">
            <ActionIcon mx={-5} onPress={handleClose} styles={{ padding: 5 }}>
              <AutoHeightImage source={IMAGES.closeIcon} width={25} />
            </ActionIcon>
          </Flex>
          <Flex mb={20}>
            <ScalableText fontFamily="Medium">Assign the manager</ScalableText>
          </Flex>
          <Flex my={15} flexDirection="column">
            <AutoHeightImage source={IMAGES.assignManager} width={120} />

            <ScalableText
              fontFamily="Medium"
              style={{
                fontSize: 12,
                color: "#999999",
                textAlign: "center",
                marginTop: 12,
              }}
            >
              {"Assign the particular enquiry\nto a manager."}
            </ScalableText>
          </Flex>

          <Flex mt={10}>
            <Button
              disabled={loading.skip}
              loading={loading.skip}
              btnStyles={{
                ...styles.modalBtn,
                borderWidth: 1,
                borderColor: COLORS.primary,
                backgroundColor: COLORS.white,
              }}
              btnTxtStyles={{ ...styles.modalBtnText, color: COLORS.primary }}
              title="Skip And Submit"
              onPress={() => handleSubmit("skip")}
            />
            <Button
              disabled={loading.assign}
              loading={loading.assign}
              btnStyles={styles.modalBtn}
              btnTxtStyles={styles.modalBtnText}
              title="Assign And Submit"
              onPress={() => handleSubmit("assign")}
            />
          </Flex>
        </Flex>
      </View>
    </Modal>
  );
};

export default memo(CreateEnquiryConfirmation);

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
    padding: 40,
    paddingVertical: 19,
    paddingHorizontal: 20,
  },
  textStyle: {
    color: "black",
    textAlign: "center",
  },
  modalBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: responsiveSize(6),
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    marginHorizontal: 3,
    paddingHorizontal: 5,
  },
  modalBtnText: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 2,
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
