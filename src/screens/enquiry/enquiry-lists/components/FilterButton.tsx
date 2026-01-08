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
  filter: { search: string; status: string };
  updateFilter: React.Dispatch<
    React.SetStateAction<{
      search: string;
      status: string;
    }>
  >;
  buttonWidth?: number;
}

const FilterButton: FC<IFilterButton> = ({
  filter,
  updateFilter,
  buttonWidth = 126,
}) => {
  const [showFilter, setShowFilter] = useState(false);

  const filterStatus = [
    { label: "All Enquiries", value: "" },
    { label: "New Enquiries", value: "new" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inActive" },
    { label: "Interested", value: "Interested" },
    { label: "Not Interested", value: "Not Interested" },
    { label: "Call Later", value: "Call later" },
    { label: "Call Not Picked", value: "Call Not Picked" },
    { label: "Attend Demo", value: "Attend Demo" },
    { label: "Success Leads", value: "Success Leads" },
  ];

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
          {filterStatus.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => {
                updateFilter((state) => ({ ...state, status: item.value }));
                setShowFilter(false);
              }}
            >
              <Flex my={5}>
                <CheckBox size={17} checked={item.value === filter.status} />
                <ScalableText style={styles.optionText} fontFamily="Regular">
                  {item.label}
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
        btnStyles={{ ...styles.buttonStyles, width: buttonWidth }}
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
