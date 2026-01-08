import React, { useRef, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from "react-native";
import { COLORS } from "../../colors";
import Flex from "../flex/Flex";

interface CustomHorizontalScrollViewProps {
  children: React.ReactNode;
  showScrollbar?: boolean;
}

const CustomHorizontalScrollView: React.FC<CustomHorizontalScrollViewProps> = ({
  children,
  showScrollbar = true,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [contentWidth, setContentWidth] = useState(1);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleContentSizeChange = (contentWidth: number) => {
    setContentWidth(contentWidth);
  };

  const handleLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }: LayoutChangeEvent) => {
    setScrollWidth(width);
  };

  const handleScroll = ({
    nativeEvent: {
      contentOffset: { x },
    },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollPosition(x);
  };

  const getScrollbarPosition = (): number => {
    if (contentWidth <= scrollWidth) {
      return 0;
    }
    return (scrollPosition / contentWidth) * scrollWidth;
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        onContentSizeChange={(width: number) => handleContentSizeChange(width)}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {children}
      </ScrollView>
      {showScrollbar && (
        <View style={styles.scrollbarContainer}>
          <View
            style={[
              styles.scrollbar,
              {
                width: 40,
                transform: [{ translateX: getScrollbarPosition() }],
              },
            ]}
          />
        </View>
      )}

      <Flex styles={{ paddingVertical: 30 }}></Flex>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollbarContainer: {
    position: "absolute",
    bottom: 10,
    left: 147,
    right: 0,
    height: 8,
    backgroundColor: COLORS.white,
  },
  scrollbar: {
    height: "100%",
    backgroundColor: "#ADA8A8",
    borderRadius: 10,
  },
});

export default CustomHorizontalScrollView;
