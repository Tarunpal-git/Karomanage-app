
import {
    Animated,
    Easing,
    StyleSheet,
    TouchableOpacity,
    View,
  } from "react-native";
  import React, { FC, memo, useEffect, useRef } from "react";
  import ScalableText from "../../../../@ui/scalable-text/ScalableText";
  import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
  import { IMAGES } from "../../../../images";
  
  import Flex from "../../../../@ui/flex/Flex";
  import Collapsible from "react-native-collapsible";
  
  interface INotificationItemCard {
    notification: TNotificationFollowUps;
    isOpen: boolean;
    onToggle: () => void;
  }
  
  const NotificationItemCard: FC<INotificationItemCard> = ({
    notification,
    isOpen,
    onToggle,
  }) => {
    const animation = useRef(new Animated.Value(!isOpen ? 1 : 0)).current;
    const rotateValue = useRef(new Animated.Value(!isOpen ? 1 : 0)).current;
  
    useEffect(() => {
      Animated.timing(animation, {
        toValue: !isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [!isOpen]);
  
    const animateRotation = (toValue: number) => {
      Animated.timing(rotateValue, {
        toValue,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    };
  
    useEffect(() => {
      animateRotation(!isOpen ? 1 : 0);
    }, [!isOpen]);
  
    const rotate = rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
    });
  
    return (
      <View>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.dropdownButtonStyle}
          onPress={() => onToggle()}
        >
          {!notification.isClicked && <View style={styles.activeDot} />}
  
          <Flex flex={1}>
            <ScalableText fontFamily="Medium" style={styles.dropdownButtonTxtStyle} numberOfLines={1}>
              {notification.name}
            </ScalableText>
          </Flex>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <AutoHeightImage source={IMAGES.chevronDownIcon} width={8} />
          </Animated.View>
        </TouchableOpacity>
  
        <Collapsible style={styles.collapsedContainer} collapsed={isOpen}>
          <Flex justify="space-between" my={8}>
            <ScalableText fontFamily="SemiBold" style={styles.heading}>
              Name
            </ScalableText>
            <ScalableText fontFamily="Regular" style={styles.content}>
              {notification.name || "Unknown Name"}
            </ScalableText>
          </Flex>
          <Flex justify="space-between" my={8}>
            <ScalableText fontFamily="SemiBold" style={styles.heading}>
              Follow Up Date
            </ScalableText>
            <ScalableText fontFamily="Regular" style={styles.content}>
              {notification.followUpDate || "No Follow-Up Date"}
            </ScalableText>
          </Flex>
          <Flex justify="space-between" my={8}>
            <ScalableText fontFamily="SemiBold" style={styles.heading}>
              Message
            </ScalableText>
            <ScalableText fontFamily="Regular" style={styles.content}>
              {notification.message || "No Message"}
            </ScalableText>
          </Flex>
        </Collapsible>
      </View>
    );
  };
  
  export default memo(NotificationItemCard);
  
  const styles = StyleSheet.create({
    dropdownButtonStyle: {
      paddingHorizontal: 25,
      backgroundColor: "#e9edf1",
      elevation: 3,
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      position: "relative",
      marginVertical: 10,
      borderRadius: 5,
    },
    dropdownButtonTxtStyle: {
      fontSize: 12,
      color: "#656565",
      marginTop: 5,
      marginRight: 5,
      textTransform: "capitalize",
    },
    activeDot: {
      width: 7,
      height: 7,
      backgroundColor: "#E90202",
      borderRadius: 20,
      flex: 0,
      marginRight: 42,
    },
    collapsedContainer: {
      paddingHorizontal: 25,
      paddingVertical: 20,
      backgroundColor: "#e9edf1",
      elevation: 1,
      position: "relative",
      borderRadius: 5,
    },
    heading: {
      color: "#1B1A1A",
      fontSize: 12,
      flex: 2,
    },
    content: {
      fontSize: 12,
      flex: 1,
    },
  });
  