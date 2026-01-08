import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { FC } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../colors";
import Center from "../center/Center";

interface ISafeViewWithHeader {
  children: React.ReactNode;
  bg?: string;
  loading?: boolean;
  headerComponent?: React.ReactNode;
  headerPosition?: 'below-status-bar' | 'over-status-bar';
}

const SafeViewWithHeader: FC<ISafeViewWithHeader> = ({
  children,
  bg = COLORS.white,
  loading = false,
  headerComponent,
  headerPosition = 'below-status-bar',
}) => {
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <Center styles={{ backgroundColor: COLORS.white }}>
        <ActivityIndicator color={COLORS.primary} size={25} />
      </Center>
    );
  }

  if (headerPosition === 'over-status-bar' && headerComponent) {
    return (
      <View style={{ ...styles.safeView, backgroundColor: bg }}>
        {/* Header positioned over status bar */}
        <View style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: bg
        }}>
          {headerComponent}
        </View>
        {/* Content area with top padding to account for header */}
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
  }

  return (
    <View style={{ ...styles.safeView, backgroundColor: bg }}>
      {/* Status bar spacer */}
      <View style={{ height: insets.top, backgroundColor: bg }} />
      {/* Header positioned right below status bar */}
      {headerComponent && (
        <View style={{ 
          paddingLeft: insets.left, 
          paddingRight: insets.right,
          backgroundColor: bg 
        }}>
          {headerComponent}
        </View>
      )}
      {/* Content area */}
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

export default SafeViewWithHeader;

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

