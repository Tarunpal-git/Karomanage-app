import { StyleSheet } from "react-native";
import React, { FC, memo, useEffect } from "react";
import Flex from "../../../../../@ui/flex/Flex";
import { useFieldArray, useForm } from "react-hook-form";
import { createFormFieldValues } from "../../../../../forms/form-template/values";
import { COLORS } from "../../../../../colors";
import Input from "../../../../../@ui/input/Input";
import FieldTypeSelect from "./FieldTypeSelect";
import FSwitch from "../../../../../@ui/switch/FSwitch";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import ActionIcon from "../../../../../@ui/action-icon/ActionIcon";
import { yupResolver } from "@hookform/resolvers/yup";
import { forms } from "../../../../../forms";
import OptionFields from "./OptionFields";

interface ICreatableFormField {
  closeForm: () => void;
  data?: TFormField;
  action: "edit" | "copy" | "add";
  index: number;
}

const CreatableFormField: FC<ICreatableFormField> = ({
  closeForm,
  data,
  action,
  index,
}) => {
  const { append, update } = useFieldArray({ name: "formFields" });
  const handler = useForm({
    values: createFormFieldValues,
    mode: "all",
    reValidateMode: "onSubmit",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<any>(forms.formTemplate.validation),
  });

  const handleSubmit = async (values: typeof createFormFieldValues) => {
    if (action === "edit") {
      update(index, values);
    } else {
      append(values);
    }

    handler.reset();
    closeForm();
  };

  useEffect(() => {
    if (data) {
      handler.reset(data);
    }
  }, [data]);

  return (
    <Flex styles={styles.root} flexDirection="column" align="flex-start">
      <Flex align="flex-start">
        <Input
          editable={index > 2}
          handler={handler}
          label="Field name*"
          name="name"
          containerStyles={{
            marginTop: 18,
            marginRight: 5,
            flex: 1,
          }}
          inputRoot={{ height: 50, elevation: 2 }}
        />
        <FieldTypeSelect
          handler={handler}
          label="Field Type"
          name="type"
          defaultValue={{
            value: "textField",
            icon: "textFieldIcon",
            label: "Text Field",
          }}
          options={[
            { value: "textField", icon: "textFieldIcon", label: "Text Field" },
            {
              value: "dropDown",
              icon: "dropdownFieldIcon",
              label: "Drop down",
            },
            { value: "date", icon: "dateFieldIcon", label: "Date" },
            { value: "radio", icon: "radioFieldIcon", label: "Radio" },
            {
              value: "mobileNumber",
              icon: "mobileFieldIcon",
              label: "Mobile Number",
            },
            { value: "number", icon: "numberFieldIcon", label: "Number" },
            { value: "email", icon: "emailFieldIcon", label: "Email" },
          ]}
        />
      </Flex>
      {(handler.watch("type") === "dropDown" ||
        handler.watch("type") === "radio") && (
        <OptionFields handler={handler} />
      )}
      <Flex>
        <Input
          handler={handler}
          label="Field Description"
          name="message"
          containerStyles={{ marginBottom: 10, marginTop: 7 }}
          inputRoot={{ height: 50, elevation: 2 }}
        />
      </Flex>
      <Flex mt={5}>
        <ScalableText
          style={{ fontSize: 12, color: "#717171", marginRight: 10 }}
          fontFamily="Regular"
        >
          Required:
        </ScalableText>
        <FSwitch
          onChange={(e) => handler.setValue("isRequired", e)}
          value={Boolean(handler.watch("isRequired"))}
        />
      </Flex>
      <Flex justify="flex-end" w={"100%"} my={10}>
        <ActionIcon
          mx={10}
          onPress={() => {
            handler.reset();
            closeForm();
          }}
        >
          <ScalableText
            style={{ fontSize: 13, color: COLORS.primary }}
            fontFamily="Regular"
          >
            Cancel
          </ScalableText>
        </ActionIcon>
        <ActionIcon
          mx={10}
          onPress={handler.handleSubmit(handleSubmit)}
          disabled={!handler.formState.isValid}
        >
          <ScalableText
            style={{
              fontSize: 13,
              color: handler.formState.isValid ? COLORS.primary : "#717171",
            }}
            fontFamily="Regular"
          >
            {action === "edit" ? "Update" : "Add Field"}
          </ScalableText>
        </ActionIcon>
      </Flex>
    </Flex>
  );
};

export default memo(CreatableFormField);

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
});
