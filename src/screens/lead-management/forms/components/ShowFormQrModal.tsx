import { Modal, StyleSheet, ToastAndroid, View } from "react-native";
import React, { FC, memo } from "react";
import { COLORS } from "../../../../colors";
import { responsiveSize } from "../../../../utils/responsiveSize";
import Flex from "../../../../@ui/flex/Flex";

import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import ActionIcon from "../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import { useAppSelector } from "../../../../app/hooks";
import QRCode from "react-native-qrcode-svg";
import Config from "react-native-config";
import RNFS from "react-native-fs";
import Clipboard from "@react-native-clipboard/clipboard";

import { CameraRoll } from "@react-native-camera-roll/camera-roll";

interface IShowFormQrModal {
  isVisible: boolean;
  handleClose: () => void;
  data: TFormLists;
}

const ShowFormQrModal: FC<IShowFormQrModal> = ({
  handleClose,
  isVisible,
  data,
}) => {
  const organization = useAppSelector(
    (state) => state.organization.organization
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let qrCodeRef: any = undefined;

  const downloadFile = () => {
    const filePath = `${RNFS.CachesDirectoryPath}/qr_${data.formTitle}.png`;

    qrCodeRef.toDataURL((qr: string) => {
      RNFS.writeFile(
        `${RNFS.CachesDirectoryPath}/qr_${data.formTitle}.png`,
        qr,
        "base64"
      )
        .then(async () => {
          ToastAndroid.show("QR saved in the camera roll", ToastAndroid.SHORT);
          return CameraRoll.save(`file://${filePath}`);
        })
        .catch((err) => {
          ToastAndroid.show(err, ToastAndroid.SHORT);
        });
    });
  };

  const URL = `${Config.REACT_APP_FORM_BASE_URL}/${data.organizationId}?userId=${data.customerId}&organizationEmail=${organization.organizationEmail}&organizationName=${organization.organizationName}&formTemplateId=${data.formTemplateId}`;

  const handleCopyClick = () => {
    Clipboard.setString(URL);
    ToastAndroid.show("LINK COPIED SUCCESSFULLY", ToastAndroid.LONG);
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
          <Flex justify="space-between" w={"100%"}>
            <Flex>
              <ActionIcon onPress={downloadFile} mr={10}>
                <AutoHeightImage source={IMAGES.downloadIcon} width={21} />
              </ActionIcon>
              <ActionIcon onPress={handleCopyClick}>
                <AutoHeightImage source={IMAGES.copyLink} width={18} />
              </ActionIcon>
            </Flex>
            <ActionIcon onPress={handleClose}>
              <AutoHeightImage source={IMAGES.closeIcon} width={21} />
            </ActionIcon>
          </Flex>
          <Flex my={10} flexDirection="column">
            <ScalableText fontFamily="Regular">{data.formTitle}</ScalableText>
            <ScalableText
              style={{ color: COLORS.primary }}
              fontFamily="Regular"
            >
              {organization.organizationName}
            </ScalableText>
          </Flex>
          <Flex my={20}>
            <QRCode
              value={URL}
              size={135}
              getRef={(e) => (qrCodeRef = e)}
              quietZone={2}
            />
          </Flex>
        </Flex>
      </View>
    </Modal>
  );
};

export default memo(ShowFormQrModal);

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
    width: 279,
    padding: 20,
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
});
