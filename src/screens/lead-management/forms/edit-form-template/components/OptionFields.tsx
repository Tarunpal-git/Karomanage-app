import React, { FC, memo } from "react";
import Flex from "../../../../../@ui/flex/Flex";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { createFormFieldValues } from "../../../../../forms/form-template/values";
import Input from "../../../../../@ui/input/Input";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import ActionIcon from "../../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../../images";

interface IOptionFields {
  handler: UseFormReturn<typeof createFormFieldValues>;
}

const OptionFields: FC<IOptionFields> = ({ handler }) => {
  const { control, watch } = handler;
  const { append, remove } = useFieldArray({
    name: "options",
    control: control,
  });
  return (
    <Flex flexDirection="column" align="flex-start">
      <ScalableText
        fontFamily="Medium"
        style={{ color: "#5D5D5D", fontSize: 12 }}
      >
        Required minimum 2 options
      </ScalableText>

      {watch("options").map((option, index) => (
        <Flex key={`${option.name}_${index}`} my={10}>
          <Input
            handler={handler}
            label={`Option ${index + 1}*`}
            name={`options.${index}.name`}
          />

          {watch("options").length === index + 1 && (
            <ActionIcon mx={5} onPress={() => append({ name: "" })}>
              <AutoHeightImage source={IMAGES.createIcon} width={20} />
            </ActionIcon>
          )}

          {index > 1 && (
            <ActionIcon mx={5} onPress={() => remove(index)}>
              <AutoHeightImage source={IMAGES.deleteActiveIcon} width={18} />
            </ActionIcon>
          )}
        </Flex>
      ))}
    </Flex>
  );
};

export default memo(OptionFields);
