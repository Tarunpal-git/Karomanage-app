import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, memo, useState } from "react";
import Tooltip from "react-native-walkthrough-tooltip";
import Flex from "../../../../@ui/flex/Flex";
import Button from "../../../../@ui/button/Button";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import { COLORS } from "../../../../colors";
import CheckBox from "../../../../@ui/check-box/CheckBox";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";

interface IFilterButton {
  visibleColumns: { label: string; key: string }[];
  setVisibleColumns: React.Dispatch<
    React.SetStateAction<{ label: string; key: string }[]>
  >;
}

const FilterButton: FC<IFilterButton> = ({
  setVisibleColumns,
  visibleColumns,
}) => {
  const [showFilter, setShowFilter] = useState(false);

  const allColumns = [
    { label: "Student Name", key: "studentName", disabled: false },
    { label: "Mobile Number", key: "studentContact", disabled: false },
    { label: "Payment Mode", key: "paymentMode", disabled: false },
    { label: "Payment Date", key: "paymentDate", disabled: false },
    { label: "Admission Date", key: "admissionDate", disabled: false },
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
      onClose={() => setShowFilter(false)}
      backgroundColor="#00000025"
      childContentSpacing={10}
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
      <Button
        onPress={() => setShowFilter(true)}
        btnStyles={styles.buttonStyles}
        btnTxtStyles={{
          fontSize: 14,
          color: COLORS.muted,
          fontFamily: "Poppins-Medium",
        }}
        title="Filters"
        rightIcon={
          <Flex ml={10}>
            <AutoHeightImage source={IMAGES.filterIcon} width={16} />
          </Flex>
        }
      />
    </Tooltip>
  );
};

export default memo(FilterButton);

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
