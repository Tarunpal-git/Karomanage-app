import React, {
  createContext,
  useContext,
  useRef,
  useMemo,
  useCallback,
  ReactNode,
  useState,
} from "react";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import ScalableText from "../../@ui/scalable-text/ScalableText";
import { Pressable, Share, StyleSheet, ToastAndroid } from "react-native";
import { COLORS } from "../../colors";
import Flex from "../../@ui/flex/Flex";
import QRCode from "react-native-qrcode-svg";
import Config from "react-native-config";
import Button from "../../@ui/button/Button";
import AutoHeightImage from "../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import { useAppSelector } from "../../app/hooks";
import Clipboard from "@react-native-clipboard/clipboard";

type BottomSheetContextType = {
  handlePresentModal: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
);

export const useBottomSheet = (): BottomSheetContextType => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
};

interface BottomSheetProviderProps {
  children: ReactNode;
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({
  children,
}) => {
  const organization = useAppSelector(
    (state) => state.organization.organization
  );

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%", "50%"], []);

  const [sheetOpened, setSheetOpened] = useState(-1);

  const handlePresentModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModal = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    setSheetOpened(index);
  }, []);

  const value = useMemo(() => ({ handlePresentModal }), [handlePresentModal]);

  const QR_URL = `${Config.REACT_APP_FORM_BASE_URL}/${organization.organizationId}?userId=${organization.customerId}&organizationEmail=${organization.organizationEmail}&organizationName=${organization.organizationName}`;

  const handleShareQr = () => {
    Share.share({
      message: QR_URL,
    });
  };

  return (
    <BottomSheetContext.Provider value={value}>
      <BottomSheetModalProvider>
        {children}

        <BottomSheetModal
          onChange={handleSheetChanges}
          ref={bottomSheetModalRef}
          index={1}
          enableDynamicSizing
          snapPoints={snapPoints}
          handleStyle={{ display: "none" }}
          containerStyle={styles.containerStyle}
        >
          <BottomSheetView style={styles.bottomSheetView}>
            <ScalableText style={styles.title} fontFamily="SemiBold">
              Organization Enquiry Form
            </ScalableText>
            <Flex my={30}>
              <QRCode value={QR_URL} size={200} />
            </Flex>
            <Flex>
              <Button
                onPress={() => {
                  Clipboard.setString(QR_URL);
                  ToastAndroid.show(
                    "QR code copied to clipboard",
                    ToastAndroid.SHORT
                  );
                }}
                btnStyles={{
                  ...styles.actionBtn,
                }}
                title="Copy"
                leftIcon={
                  <Flex mr={5}>
                    <AutoHeightImage source={IMAGES.copyIcon} width={20} />
                  </Flex>
                }
                btnTxtStyles={{ ...styles.btnText }}
              />
              <Button
                onPress={handleShareQr}
                btnStyles={styles.actionBtn}
                title="Share"
                leftIcon={
                  <Flex mr={5}>
                    <AutoHeightImage source={IMAGES.shareIcon} width={20} />
                  </Flex>
                }
                btnTxtStyles={{ ...styles.btnText }}
              />
            </Flex>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>

      {sheetOpened === 1 && (
        <Pressable
          onPress={handleCloseModal}
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
    </BottomSheetContext.Provider>
  );
};

const styles = StyleSheet.create({
  containerStyle: { zIndex: 5 },
  bottomSheetView: {
    flex: 1,
    alignItems: "center",
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    padding: 29,
    // iOS shadow properties
    shadowColor: "#00000040", // same color as the box-shadow color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, // shadow opacity, adjust if needed
    shadowRadius: 4, // blur radius, adjust if needed
    // Android shadow property
    elevation: 4,
  },
  title: {
    color: COLORS.primary,
    fontSize: 20,
  },

  actionBtn: {
    width: 118,
    height: 39,

    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 7,
  },
  btnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
  },
});
