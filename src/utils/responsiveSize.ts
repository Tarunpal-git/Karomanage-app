import { Dimensions } from "react-native";
const baseScreenWidth = 350;

export const responsiveSize = (baseFontSize: any) => {
  const screenWidth = Dimensions.get("window").width;
  const scaleFactor = screenWidth / baseScreenWidth;
  return baseFontSize * scaleFactor;
};
