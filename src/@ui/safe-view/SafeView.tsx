import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { FC } from "react";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../colors";
import Center from "../center/Center";

interface ISafeView {
  children: React.ReactNode;
  bg?: string;
  loading?: boolean;
}

const SafeView: FC<ISafeView> = ({
  children,
  bg = COLORS.white,
  loading = false,
}) => {
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <Center styles={{ backgroundColor: COLORS.white }}>
        <ActivityIndicator color={COLORS.primary} size={25} />
      </Center>
    );
  }

  return (
    <View style={{ ...styles.safeView, backgroundColor: bg }}>
      {/* Content area with only left/right safe area padding */}
      <View style={{ 
        flex: 1, 
        paddingLeft: insets.left, 
        paddingRight: insets.right,
        backgroundColor: bg 
      }}>
        {children}
      </View>
    </View>
  );
};

export default SafeView;

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
