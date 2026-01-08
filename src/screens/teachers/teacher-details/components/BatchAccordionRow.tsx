import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, memo, useEffect, useMemo, useRef } from "react";

import { Col, Grid, Row } from "react-native-easy-grid";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import moment from "moment";
import { useBatchDetailsQuery } from "../../../../apis/hooks/batch/query/useBatchDetails.query";
import Flex from "../../../../@ui/flex/Flex";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../colors";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import Collapsible from "react-native-collapsible";

interface IBatchAccordionRow {
  batch: TTeacherBatches;
  isOpen: boolean;
  onToggle: () => void;
}

const BatchAccordionRow: FC<IBatchAccordionRow> = ({
  batch,
  isOpen,
  onToggle,
}) => {
  const { data, isLoading } = useBatchDetailsQuery({ batchId: batch.batchId });

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

  const batchDetails: TBatchData = useMemo(() => {
    if (!isLoading && data?.data) {
      return data.data;
    } else {
      return undefined;
    }
  }, [isLoading, data]);
console.log("batchDetails", batchDetails);

  if (isLoading) {
    return (
      <Flex mb={20}>
        <SkeletonPlaceholder borderRadius={4}>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item
              width={60}
              height={60}
              borderRadius={50}
            />
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item width={210} height={10} />
              <SkeletonPlaceholder.Item
                marginTop={20}
                width={120}
                height={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </Flex>
    );
  }

  return (
    <View style={{ width: "100%" }}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ ...styles.dropDownButtonStyles }}
        onPress={() => onToggle()}
      >
        <ScalableText
          fontFamily="SemiBold"
          style={{ ...styles.dropdownButtonTxtStyle }}
          numberOfLines={1}
        >
          {batchDetails?.batchName}
        </ScalableText>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <AutoHeightImage source={IMAGES.chevronDownIcon} width={11} />
        </Animated.View>
      </TouchableOpacity>
      <Collapsible collapsed={isOpen} style={{ padding: 2, borderRadius: 8 }}>
        <Grid style={styles.accordionBody}>
          <Row style={styles.sectionContentRow}>
            <Col size={0.5}>
              <ScalableText
                style={styles.sectionContentTitle}
                fontFamily="SemiBold"
              >
                Interval
              </ScalableText>
            </Col>
            <Col>
              <ScalableText
                style={styles.sectionContentDataText}
                fontFamily="Regular"
              >
                {moment(batchDetails.batchStartDate, "DD/mm/yyyy").format(
                  "DD/mm/YYYY"
                )}
                -
                {moment(batchDetails.batchEndDate, "DD/mm/yyyy").format(
                  "DD/mm/YYYY"
                )}
              </ScalableText>
            </Col>
          </Row>
          <Row style={styles.sectionContentRow}>
            <Col size={0.5}>
              <ScalableText
                style={styles.sectionContentTitle}
                fontFamily="SemiBold"
              >
                Class Time
              </ScalableText>
            </Col>
            <Col>
              <ScalableText
                style={styles.sectionContentDataText}
                fontFamily="Regular"
              >
                {batchDetails.batchClassStartTime}-
                {batchDetails.batchClassEndTime}
              </ScalableText>
            </Col>
          </Row>
          <Row style={styles.sectionContentRow}>
            <Col size={0.5}>
              <ScalableText
                style={styles.sectionContentTitle}
                fontFamily="SemiBold"
              >
                Status
              </ScalableText>
            </Col>
            <Col>
              <ScalableText
                style={{
                  ...styles.sectionContentDataText,
                  color:
                    batchDetails.batchStatus === "active"
                      ? COLORS.textSuccess
                      : COLORS.textError,
                }}
                fontFamily="Regular"
              >
                {batchDetails.batchStatus}
              </ScalableText>
            </Col>
          </Row>

          <Row style={styles.sectionContentRow}>
            <Col size={0.5}>
              <ScalableText
                style={styles.sectionContentTitle}
                fontFamily="SemiBold"
              >
                Mode
              </ScalableText>
            </Col>
            <Col>
              <ScalableText
                style={styles.sectionContentDataText}
                fontFamily="Regular"
              >
                {batchDetails.batchMode}
              </ScalableText>
            </Col>
          </Row>
        </Grid>
      </Collapsible>
    </View>
  );
};

export default memo(BatchAccordionRow);

const styles = StyleSheet.create({
  accordionBody: {
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  dropDownButtonStyles: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    minHeight: 50,
    paddingHorizontal: 25,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },
  dropdownButtonTxtStyle: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 5,
    marginRight: 5,
    textTransform: "capitalize",
    fontFamily: "Poppins-Regular",
  },
  dropdownMenu: {
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  sectionContentRow: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  sectionContentTitle: {
    fontSize: 12,
    color: "#1B1A1A",
  },
  sectionContentDataText: {
    textAlign: "center",
    fontSize: 12,
    textTransform: "capitalize",
  },
});
