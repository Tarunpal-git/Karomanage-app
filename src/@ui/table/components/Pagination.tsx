import { StyleSheet } from "react-native";
import React, { FC, memo } from "react";
import { COLORS } from "../../../colors";
import ScalableText from "../../scalable-text/ScalableText";
import ActionIcon from "../../action-icon/ActionIcon";
import AutoHeightImage from "../../auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import Flex from "../../flex/Flex";

interface IPagination {
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  currentPage: number;
  totalPages: number;
  currentDataCount: number;
}

const Pagination: FC<IPagination> = ({
  handleNextPage,
  handlePreviousPage,
  currentPage,
  totalPages,
  currentDataCount,
}) => {
  return (
    <Flex styles={styles.paginationContainer}>
      <ActionIcon
        styles={{ padding: 7 }}
        onPress={handlePreviousPage}
        disabled={currentPage === 1}
      >
        <AutoHeightImage source={IMAGES.chevronArrowLeftIcon} width={12} />
      </ActionIcon>

      <ScalableText fontFamily="Medium" style={styles.paginationText}>
        {currentPage}-{currentDataCount} of {totalPages}
      </ScalableText>

      <ActionIcon
        styles={{ padding: 7 }}
        onPress={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <AutoHeightImage source={IMAGES.chevronArrowRightIcon} width={12} />
      </ActionIcon>
    </Flex>
  );
};

export default memo(Pagination);

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
    backgroundColor: COLORS.white,
  },
  paginationText: {
    fontSize: 14,

    color: "#7D7D7D",
    marginBottom: 1,
  },
});
