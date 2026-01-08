import React from "react";
import { View, Modal, StyleSheet } from "react-native";

import { COLORS } from "../../colors";
import Button from "../button/Button";
import Flex from "../flex/Flex";
import { responsiveSize } from "../../utils/responsiveSize";
import ScalableText from "../scalable-text/ScalableText";
import AutoHeightImage from "../auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import { TImages } from "../../images/images";

const CustomAlertModel = (props: AlertModalProps) => {
  const { setShowAlert, alertData, showAlert } = props;

  const {
    disabled,
    loading,
    message,
    cancelCallback,
    cancelTitle,
    okCallBack,
    okTitle,
    preventClose = false,
    icon,
  } = alertData;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={() => {}}
      visible={showAlert}
    >
      <View style={styles.centeredView}>
        <Flex styles={styles.modalView} flexDirection="column">
          {icon && (
            <AutoHeightImage source={IMAGES[icon as TImages]} width={39} />
          )}

          <ScalableText fontFamily="SemiBold" style={styles.modalText}>
            {message}
          </ScalableText>

          <Flex mt={20} justify="center">
            {cancelTitle && (
              <Button
                btnStyles={styles.modalBtn}
                btnTxtStyles={styles.modalBtnText}
                title={cancelTitle ?? "OK"}
                onPress={() => {
                  if (!preventClose) {
                    setShowAlert(false);
                  }
                  cancelCallback?.();
                }}
              />
            )}

            <Button
              loading={loading}
              disabled={disabled}
              btnStyles={styles.modalBtn}
              btnTxtStyles={styles.modalBtnText}
              title={okTitle ?? "OK"}
              onPress={() => {
                if (!preventClose) {
                  setShowAlert(false);
                }
                okCallBack?.();
              }}
            />
          </Flex>
        </Flex>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "relative",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: responsiveSize(25),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 314,
    paddingHorizontal: 30,
  },
  textStyle: {
    color: "black",
    textAlign: "center",
  },
  modalBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: responsiveSize(8),
    width: responsiveSize(56),
    flex: 0,
    height: responsiveSize(30),
    marginHorizontal: responsiveSize(11),
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtnText: {
    fontSize: responsiveSize(10),
    letterSpacing: 1,
  },
  modalText: {
    fontSize: 14,
    textAlign: "center",
    color: COLORS.black,
    letterSpacing: 1,
    marginTop: 10,
  },
  modalMegaText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 14,
    color: "#6F6F6F",
    letterSpacing: 1,
  },

  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default CustomAlertModel;
