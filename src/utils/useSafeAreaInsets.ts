import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useSafeAreaInsets = () => {
  const insets = useSafeAreaInsets();
  
  return {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
    // Common combinations
    topBottom: insets.top + insets.bottom,
    leftRight: insets.left + insets.right,
    // Safe padding styles
    safePaddingTop: { paddingTop: insets.top },
    safePaddingBottom: { paddingBottom: insets.bottom },
    safePaddingLeft: { paddingLeft: insets.left },
    safePaddingRight: { paddingRight: insets.right },
    safePaddingHorizontal: { paddingHorizontal: insets.left + insets.right },
    safePaddingVertical: { paddingVertical: insets.top + insets.bottom },
    // Safe margin styles
    safeMarginTop: { marginTop: insets.top },
    safeMarginBottom: { marginBottom: insets.bottom },
    safeMarginLeft: { marginLeft: insets.left },
    safeMarginRight: { marginRight: insets.right },
    safeMarginHorizontal: { marginHorizontal: insets.left + insets.right },
    safeMarginVertical: { marginVertical: insets.top + insets.bottom },
  };
};

