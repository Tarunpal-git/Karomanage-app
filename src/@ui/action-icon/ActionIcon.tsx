import {
  ActivityIndicator,
  FlexStyle,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import React, { FC } from "react";

interface IActionIcon {
  children: React.ReactNode;
  loading?: boolean;
  onPress?: () => void;
  mr?: FlexStyle["marginRight"];
  ml?: FlexStyle["marginLeft"];
  mt?: FlexStyle["marginTop"];
  mb?: FlexStyle["marginBottom"];
  mx?: FlexStyle["marginHorizontal"];
  my?: FlexStyle["marginHorizontal"];
  styles?: ViewStyle;
  disabled?: boolean;
  loaderColor?: string;
}

const ActionIcon: FC<IActionIcon> = ({
  children,
  loading,
  onPress,
  mb,
  ml,
  mr,
  mt,
  mx,
  my,
  styles,
  disabled = false,
  loaderColor = "white",
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        ...style.root,
        marginLeft: ml,
        marginRight: mr,
        marginTop: mt,
        marginBottom: mb,
        marginHorizontal: mx,
        marginVertical: my,
        ...styles,
      }}
    >
      {loading ? <ActivityIndicator size={20} color={loaderColor} /> : children}
    </TouchableOpacity>
  );
};

export default ActionIcon;

const style = StyleSheet.create({
  root: {},
});
