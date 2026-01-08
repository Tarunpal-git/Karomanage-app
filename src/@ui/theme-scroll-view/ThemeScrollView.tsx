import React, { memo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { COLORS } from "../../colors";
import EmptyData from "../empty-data";
import Center from "../center/Center";

interface IProps {
  children: React.ReactNode;
  loading?: boolean;
  reloadData?: () => void;
  dataLoading?: boolean;
  paddingHorizontal?: number;
  empty?: boolean;
  emptyContent?: {
    title: string;
    message: string;
  };
  bg?: string;
  style?: ViewStyle;
  scrollRef?: React.LegacyRef<ScrollView>;
  onEndReached?: () => void; // Add this line
  onEndReachedThreshold?: number; // Optional: Add threshold for end reach
}

const ThemeScrollView = (props: IProps & ScrollViewProps) => {
  const {
    dataLoading = false,
    reloadData,
    paddingHorizontal = 39,
    empty,
    bg,
    style,
    scrollRef,
    onEndReached, // Destructure the prop
    onEndReachedThreshold, // Optional: Threshold
  } = props;

  return (
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          colors={[COLORS.primary]}
          refreshing={dataLoading}
          onRefresh={() => reloadData && reloadData()}
        />
      }
      {...props}
      contentContainerStyle={[
        {
          ...styles.root,
          paddingHorizontal: paddingHorizontal,
          backgroundColor: bg ?? COLORS.white,
        },
        style,
      ]}
      keyboardShouldPersistTaps={"always"}
      //Updated
      onScroll={(event) => {
        // Trigger onEndReached if the user scrolls to the threshold
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const layoutHeight = event.nativeEvent.layoutMeasurement.height;
        if (
          onEndReached &&
          offsetY + layoutHeight >= contentHeight - (onEndReachedThreshold || 0)
        ) {
          onEndReached();
        }
      }}
      scrollEventThrottle={16} // Optimize scroll event handling
    >
      {props.loading && (
        <Center>
          <ActivityIndicator size={30} color={COLORS.primary} />
        </Center>
      )}
      {!props.loading && !empty && props.children}
      {!props.loading && empty && (
        <EmptyData
          title={props.emptyContent?.title}
          message={props.emptyContent?.message}
        />
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    paddingBottom: 100,
  },
});

export default memo(ThemeScrollView);
