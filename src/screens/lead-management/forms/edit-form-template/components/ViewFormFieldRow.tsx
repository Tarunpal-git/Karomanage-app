import { StyleSheet } from "react-native";
import React, { FC, memo } from "react";
import Flex from "../../../../../@ui/flex/Flex";
import { COLORS } from "../../../../../colors";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import ActionIcon from "../../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../../images";
import { useFieldArray } from "react-hook-form";

interface IViewFormFieldRow {
  field: TFormField;
  index: number;
  handleCopyClick: () => void;
  handleEditClick: () => void;
}

const ViewFormFieldRow: FC<IViewFormFieldRow> = ({
  field,
  index,
  handleCopyClick,
  handleEditClick,
}) => {
  const { remove } = useFieldArray({
    name: "formFields",
  });

  return (
    <Flex styles={styles.root} flexDirection="column" align="flex-start">
      <Flex justify="space-between" w={"100%"}>
        <Flex
          styles={{
            borderBottomWidth: 1,
            borderColor: "#A1A1A1",
            paddingBottom: 5,
            marginBottom: 5,
          }}
          flex={1}
        >
          <ScalableText style={styles.disabledText} fontFamily="Medium">
            {field.name}
            {field.isRequired && "*"}
          </ScalableText>
        </Flex>
        <Flex>
          <ActionIcon ml={10} onPress={handleEditClick}>
            <AutoHeightImage source={IMAGES.editActiveIcon} width={21} />
          </ActionIcon>
          {index > 2 && (
            <ActionIcon ml={10} onPress={() => remove(index)}>
              <AutoHeightImage source={IMAGES.deleteActiveIcon} width={21} />
            </ActionIcon>
          )}

          <ActionIcon ml={10} onPress={handleCopyClick}>
            <AutoHeightImage source={IMAGES.copyIconPrimary} width={21} />
          </ActionIcon>
        </Flex>
      </Flex>
      <Flex>
        <ScalableText
          style={{ color: "#5D5D5D", fontSize: 12 }}
          fontFamily="Medium"
        >
          {field.message}*
        </ScalableText>
      </Flex>
    </Flex>
  );
};

export default memo(ViewFormFieldRow);

const styles = StyleSheet.create({
  root: {
    padding: 15,
    elevation: 2,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    marginVertical: 9,
    borderLeftWidth: 7,
    borderColor: COLORS.primary,
  },
  disabledText: {
    color: "#A1A1A1",
    fontSize: 12,
  },
});
