import { Platform, NativeModules } from "react-native";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
const { CallLogs } = NativeModules;

export const fetchCallLogs = async () => {
  if (Platform.OS === "android") {
    const permission = await request(PERMISSIONS.ANDROID.READ_CALL_LOG);
    if (permission === RESULTS.GRANTED) {
      try {
        const callLogs = await CallLogs.getCallLogs(500);
        return callLogs;
      } catch (e) {
        console.error(e);
      }
    }
  }
};
