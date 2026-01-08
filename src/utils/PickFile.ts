import { ToastAndroid } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

export const handlePickFile = async () => {
  const result = await launchImageLibrary({
    mediaType: "photo",
    includeBase64: true,
    presentationStyle: "pageSheet",
    selectionLimit: 1,
  });

  if (result.didCancel) {
    ToastAndroid.show("User canceled this action", ToastAndroid.LONG);
  }

  if (result.assets) {
    const fileObject = {
      name: result.assets[0].fileName ?? "",
      size: result.assets[0].fileSize ?? 0,
      type: result.assets[0].type ?? "",
      uri: result.assets[0].uri ?? "",
      base64Url: result.assets[0].base64,
    };

    return fileObject;
  }
};
