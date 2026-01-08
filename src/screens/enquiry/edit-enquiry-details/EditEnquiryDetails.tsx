import React, { useEffect } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../types/navigator/screen-navigator";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../../colors";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../../@ui/button/Button";
import { forms } from "../../../forms";
import { useEnquiryDetailsQuery } from "../../../apis/hooks/enquiry/query/useEnquiryDetails.query";
import { useUpdateStudentEnquiryMutation } from "../../../apis/hooks/enquiry/mutation/useUpdateStudentEnquiry.mutation";
import MuiInput from "../../../@ui/mui-input/MuiInput";

const EditEnquiryDetails = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const { mutateAsync, isPending } = useUpdateStudentEnquiryMutation();

  const { id } =
    useRoute<RouteProp<TScreenNavigatorParams, "EnquiryDetails">>().params;
  const { data, isLoading } = useEnquiryDetailsQuery(id);

  const handler = useForm({
    defaultValues: forms.generateEnquiry.values,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<any>(forms.generateEnquiry.validation),
    reValidateMode: "onSubmit",
    mode: "all",
  });

  useEffect(() => {
    if (!isLoading && data?.dataArray) {
      handler.reset({
        ...data?.dataArray,
      });
    } else {
      handler.reset(forms.generateEnquiry.values);
    }
  }, [isLoading, data]);

  const onSubmit = async (values: TEnquiryData) => {
    const res = await mutateAsync({
      details: {
        ...values,
        studentName: values.studentName,
      },
    });

    if (res.statusCode === 200) {
      navigation.navigate("EnquiryLists");
    } else {
      customAlert.show({
        message: "Enquiry not updated. Try again later",
      });
    }
  };

  return (
    <SafeView>
      <AppHeader
        title="Update Enquiry"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />

      <ThemeScrollView paddingHorizontal={15}>
        <View>
          <MuiInput
            handler={handler}
            label="Student Name*"
            name="studentName"
          />

          <MuiInput handler={handler} label="Email" name="email" />

          <MuiInput
            handler={handler}
            label="Mobile Number*"
            name="mobileNumber"
          />

          <MuiInput
            handler={handler}
            label="Enquiry Course*"
            name="enquiryCourse"
          />

          <MuiInput
            handler={handler}
            label="Enquiry Description*"
            name="courseDescription"
          />
        </View>

        <Button
          loading={isPending}
          disabled={isPending}
          onPress={handler.handleSubmit(onSubmit)}
          title="Submit"
          btnStyles={styles.submitBtn}
          btnTxtStyles={styles.submitBtnText}
        />
      </ThemeScrollView>
    </SafeView>
  );
};

export default EditEnquiryDetails;

const styles = StyleSheet.create({
  formRoot: {
    padding: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftColor: COLORS.primary,
    borderLeftWidth: 7,
    marginVertical: 5,
    elevation: 2,
    backgroundColor: COLORS.white,
    flexDirection: "column",
  },
  formTitle: {
    fontSize: 16,
  },
  text: {
    color: "#717171",
    fontSize: 18,
  },
  continueBtn: {
    backgroundColor: "transparent",
    marginBottom: 70,
    paddingBottom: 10,
    paddingHorizontal: 30,
  },
  submitBtn: {
    width: 201,
    alignSelf: "center",
    marginVertical: 39,
  },
  submitBtnText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
  },
});
