import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, memo, useState } from "react";
import Tooltip from "react-native-walkthrough-tooltip";
import Flex from "../../../../@ui/flex/Flex";

import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import { COLORS } from "../../../../colors";
import CheckBox from "../../../../@ui/check-box/CheckBox";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import ActionIcon from "../../../../@ui/action-icon/ActionIcon";

interface ITableFilterButton {
  visibleColumns: { label: string; key: string }[];
  setVisibleColumns: React.Dispatch<
    React.SetStateAction<{ label: string; key: string }[]>
  >;
}

const TableFilterButton: FC<ITableFilterButton> = ({
  setVisibleColumns,
  visibleColumns,
}) => {
  const [showFilter, setShowFilter] = useState(false);

  const allColumns = [
    { label: "Total Salary", key: "totalSalary", disabled: false },
    { label: "Total Working Days", key: "totalWorkingDays", disabled: false },
    { label: "Loss Of Days", key: "lossOfDays", disabled: false },
    { label: "In-hand Salary", key: "fixedInhandSalary", disabled: false },
    { label: "Salary Date", key: "dateCreated", disabled: false },
    { label: "Download", key: "download", disabled: false },
    { label: "Send Invoice", key: "sendInvoice", disabled: false },
  ];

  const toggleColumn = (key: string) => {
    setVisibleColumns((prevColumns) => {
      const columnExists = prevColumns.some((column) => column.key === key);
      if (columnExists) {
        return prevColumns.filter((column) => column.key !== key);
      } else {
        const newColumn = allColumns.find((column) => column.key === key);
        if (newColumn) {
          return [...prevColumns, newColumn];
        }
        return prevColumns;
      }
    });
  };
  return (
    <Tooltip
      isVisible={showFilter}
      horizontalAdjustment={2000}
      onClose={() => setShowFilter(false)}
      backgroundColor="#00000025"
      childContentSpacing={20}
      contentStyle={{
        elevation: 4,
        width: 224,
        borderRadius: 10,
        padding: 25,
      }}
      content={
        <View>
          {allColumns.map((column) => (
            <TouchableOpacity
              disabled={column.disabled}
              key={column.key}
              onPress={() => toggleColumn(column.key)}
            >
              <Flex my={5}>
                <CheckBox
                  size={17}
                  checked={visibleColumns.some(
                    (visibleColumn) => visibleColumn.key === column.key
                  )}
                />
                <ScalableText style={styles.optionText} fontFamily="Regular">
                  {column.label}
                </ScalableText>
              </Flex>
            </TouchableOpacity>
          ))}
        </View>
      }
      placement="bottom"
      arrowSize={{ width: 0, height: 0 }}
    >
      <ActionIcon
        styles={{ paddingHorizontal: 10 }}
        onPress={() => setShowFilter(true)}
      >
        <AutoHeightImage source={IMAGES.whiteMenuIcon} width={4} />
      </ActionIcon>
    </Tooltip>
  );
};

export default memo(TableFilterButton);

const styles = StyleSheet.create({
  buttonStyles: {
    width: 126,
    height: 40,
    marginVertical: 0,
    marginLeft: 10,
    backgroundColor: COLORS.white,
  },
  optionText: {
    fontSize: 14,
    marginTop: 2,
    marginLeft: 5,
    color: COLORS.muted,
  },
});
