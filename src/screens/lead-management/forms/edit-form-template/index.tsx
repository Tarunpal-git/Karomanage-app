import { ScrollView, StyleSheet, ToastAndroid } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SafeView from "../../../../@ui/safe-view/SafeView";

import AppHeader from "../../../../@ui/app-header/AppHeader";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../../types/navigator/screen-navigator";
import { useFormTemplateDetailsQuery } from "../../../../apis/hooks/lead-management/query/useFormTemplateDetails.query";
import ThemeScrollView from "../../../../@ui/theme-scroll-view/ThemeScrollView";
import ViewFormFieldRow from "./components/ViewFormFieldRow";
import Flex from "../../../../@ui/flex/Flex";
import Button from "../../../../@ui/button/Button";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import { COLORS } from "../../../../colors";
import { FormProvider, useForm } from "react-hook-form";
import { forms } from "../../../../forms";
import CreatableFormField from "./components/CreatableFormField";

import { useEditFormTemplateMutation } from "../../../../apis/hooks/lead-management/mutation/useEditFormTemplate.mutation";

const EditFormTemplate = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const { formTemplateId } =
    useRoute<RouteProp<TScreenNavigatorParams, "EditFormTemplate">>().params;

  const { mutateAsync, isPending } = useEditFormTemplateMutation();

  const scrollViewRef = useRef<ScrollView>(null);
  const [editableForm, setEditableForm] = useState<{
    show: boolean;
    data: TFormField | undefined;
    action: "edit" | "copy" | "add";
    index: number;
  }>({ show: false, data: undefined, action: "add", index: 0 });

  const { data, isLoading, refetch } =
    useFormTemplateDetailsQuery(formTemplateId);

  const formTemplate: TFormTemplate = useMemo(() => {
    if (!isLoading && data.data) {
      return data.data;
    } else {
      return [];
    }
  }, [isLoading, data]);

  const formHandler = useForm({
    defaultValues: { ...forms.formTemplate.values },
  });

  const { formFields: formsFields } = formTemplate;

  useEffect(() => {
    if (formsFields) {
      formHandler.reset({ formFields: formsFields });
    }
  }, [formsFields]);

  const updateFormTemplate = async (
    values: typeof forms.formTemplate.values
  ) => {
    const res = await mutateAsync({
      template: { ...formTemplate, formFields: values.formFields },
    });

    if (res.statusCode === 200) {
      ToastAndroid.show("Template updated successfully", ToastAndroid.SHORT);
      navigation.goBack();
    } else {
      customAlert.show({ message: "Template not updated" });
    }
  };

  return (
    <SafeView>
      <AppHeader
        showDrawer={false}
        title="Edit Form Template"
        handleBackClick={() => navigation.goBack()}
      />
      <FormProvider {...formHandler}>
        <ThemeScrollView
          scrollRef={scrollViewRef}
          paddingHorizontal={15}
          loading={isLoading}
          reloadData={refetch}
        >
          {formHandler.watch("formFields").map((field, index) => (
            <ViewFormFieldRow
              handleCopyClick={() => {
                setEditableForm({
                  data: field,
                  show: true,
                  action: "copy",
                  index,
                });
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }}
              handleEditClick={() => {
                setEditableForm({
                  data: field,
                  show: true,
                  action: "edit",
                  index,
                });
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }}
              key={`${field.name}_${index}`}
              field={field}
              index={index}
            />
          ))}

          {editableForm.show && (
            <CreatableFormField
              index={editableForm.index}
              action={editableForm.action}
              data={editableForm.data}
              closeForm={() =>
                setEditableForm({
                  data: undefined,
                  show: false,
                  action: "add",
                  index: 0,
                })
              }
            />
          )}
          <Flex mb={17} justify="center">
            <Button
              onPress={() => {
                setEditableForm({
                  data: undefined,
                  show: true,
                  action: "add",
                  index: 3,
                });
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }}
              btnStyles={{ ...styles.actionBtn, backgroundColor: COLORS.white }}
              title="Add Field"
              rightIcon={
                <Flex mx={7}>
                  <AutoHeightImage source={IMAGES.createIcon} width={14} />
                </Flex>
              }
              btnTxtStyles={{ ...styles.btnText, color: COLORS.primary }}
            />
            <Button
              loading={isPending}
              disabled={isPending || !formHandler.formState.isDirty}
              onPress={formHandler.handleSubmit(updateFormTemplate)}
              btnStyles={styles.actionBtn}
              title="Update"
              btnTxtStyles={{ ...styles.btnText }}
            />
          </Flex>
        </ThemeScrollView>
      </FormProvider>
    </SafeView>
  );
};

export default EditFormTemplate;

const styles = StyleSheet.create({
  actionBtn: {
    height: 41,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.5,
    elevation: 4,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginHorizontal: 5,
    width: 127,
  },
  btnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
  },
});
