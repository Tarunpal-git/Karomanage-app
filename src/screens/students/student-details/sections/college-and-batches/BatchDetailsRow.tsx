import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, memo, useEffect, useMemo, useRef } from "react";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../../colors";
import { useBatchDetailsQuery } from "../../../../../apis/hooks/batch/query/useBatchDetails.query";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Flex from "../../../../../@ui/flex/Flex";
import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../../images";
import { Col, Grid, Row } from "react-native-easy-grid";
import moment from "moment";
import Collapsible from "react-native-collapsible";

interface IBatchDetailsRow {
  batch: TStudentBatch;
  isOpen: boolean;
  onToggle: () => void;
}

const BatchDetailsRow: FC<IBatchDetailsRow> = ({ batch, isOpen, onToggle }) => {
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

  if (isLoading) {
    return (
      <Flex>
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
    <View>
      <TouchableOpacity
        activeOpacity={1}
        style={{ ...styles.dropdownButtonStyle }}
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
      <Collapsible collapsed={isOpen} style={{ padding: 2 }}>
        <Flex styles={styles.collapsedContainer}>
          <Grid>
            <Row style={styles.sectionContentRow}>
              <Col>
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
                    "DD/mm/YY"
                  )}
                  -
                  {moment(batchDetails.batchEndDate, "DD/mm/yyyy").format(
                    "DD/mm/YY"
                  )}
                </ScalableText>
              </Col>
            </Row>
            <Row style={styles.sectionContentRow}>
              <Col>
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
              <Col>
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
              <Col>
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
        </Flex>
      </Collapsible>
    </View>
  );
};

export default memo(BatchDetailsRow);

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    color: COLORS.border,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
    elevation: 2,
    minHeight: 59,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    position: "relative",
    marginBottom: 7,
  },
  dropdownButtonTxtStyle: {
    fontSize: 16,
    color: "#1B1A1A",
    marginTop: 5,
    marginRight: 5,
    textTransform: "capitalize",
  },
  dropdownMenu: {
    backgroundColor: COLORS.white,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25, // Converted from the hex value's transparency (#00000040)
    shadowRadius: 4,
    elevation: 4, // Required for Android shadow
    padding: 15,
    right: 5,
  },
  sectionContentRow: {
    marginVertical: 10,
  },
  sectionContentTitle: {
    fontSize: 14,
    color: "#1B1A1A",
  },
  sectionContentDataText: {
    textAlign: "center",
    fontSize: 12,
    textTransform: "capitalize",
  },
  collapsedContainer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: COLORS.white,
    elevation: 4,
    position: "relative",
    marginBottom: 5,
  },
});
