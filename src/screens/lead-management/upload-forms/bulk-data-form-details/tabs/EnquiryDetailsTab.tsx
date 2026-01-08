import { Linking, ScrollView, StyleSheet, View } from "react-native";
import React, { FC, memo, useEffect, useMemo, useState } from "react";
import Flex from "../../../../../@ui/flex/Flex";
import ActionIcon from "../../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../../images";
import { Col, Grid, Row } from "react-native-easy-grid";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import { SCREEN_WIDTH } from "../../../../../constants/Screen";
import FollowUpRow from "./FollowUpRow";
import CheckBox from "../../../../../@ui/check-box/CheckBox";
import moment from "moment";
import { useForm } from "react-hook-form";
import { forms } from "../../../../../forms";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../../../../@ui/input/Input";
import SelectInput from "../../../../../@ui/select-input/SelectInput";
import { CONSTANT } from "../../../../../constants";
import Button from "../../../../../@ui/button/Button";
import { COLORS } from "../../../../../colors";
import EditFollowUpModal from "./EditFollowUpModal";
import DateInput from "../../../../../@ui/date-input/DateInput";
import { useUpdateBulkEnquiryDataMutation } from "../../../../../apis/hooks/upload-forms/mutation/useUpdateBulkEnquiryData.mutation";
import { useFetchSingleBulkFormDataQuery } from "../../../../../apis/hooks/upload-forms/query/useFetchSingleBulkFormData.query";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TScreenNavigatorParams } from "../../../../../types/navigator/screen-navigator";
import { useDynamicFlags } from "../../../../../utils/hooks/useDynamicFlags";

interface IEnquiryDetailsTab {
  data: TBulkDataEnquiry;
  refetch: () => void;
}

function generateHexColor() {
  // Generate a random number between 0 and 0xFFFFFF (16777215)
  const randomNum = Math.floor(Math.random() * 0xffffff);
  // Convert the number to a hexadecimal string and pad it with leading zeros if necessary
  const hexColor = randomNum.toString(16).padStart(6, "0");
  return `#${hexColor}`;
}

const EnquiryDetailsTab: FC<IEnquiryDetailsTab> = ({ data, refetch }) => {
          const [selectedFollowUps, setSelectedFollowUps] = useState<TFollowUp[]>([]);
          const [editEnquiry, setEditEnquiry] = useState(false);
          const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

          const { formId, formTemplateId, metaFields } =
useRoute<RouteProp<TScreenNavigatorParams, "EnquiryDetailsTab">>().params;

const { data: formData, isLoading } = useFetchSingleBulkFormDataQuery({
  formId,
  formTemplateId,
});

const enquiryDetails: TBulkDataEnquiry = useMemo(() => {
  if (!isLoading && formData?.statusCode === 200) {
    return formData.data;
  } else {
    return undefined;
  }
}, [isLoading, formData]);

useEffect(() => {
  if (metaFields && enquiryDetails) {
    const mobileNumberKey = metaFields?.mobileNumber;
    const phone =
      typeof mobileNumberKey === "string"
        ? enquiryDetails?.formData[mobileNumberKey]
        : undefined;
    setPhoneNumber(phone || "Not available");
  }
}, [metaFields, enquiryDetails]);

const handlePhoneCall = () => {
  if (phoneNumber && phoneNumber !== "Not available") {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      console.error("Failed to open dialer:", err)
    );
  } else {
    console.warn("Phone number is not available");
  }
};

  const handleSelect = (followUp: TFollowUp) => {
    setSelectedFollowUps((prevSelected) => [...prevSelected, followUp]);
  };

  const handleDeselect = (followUp: TFollowUp) => {
    setSelectedFollowUps((prevSelected) =>
      prevSelected.filter(
        (list) => JSON.stringify(list) !== JSON.stringify(followUp)
      )
    );
  };

  const handleCheckboxChange = (followUp: TFollowUp, isChecked: boolean) => {
    if (isChecked) {
      handleSelect(followUp);
    } else {
      handleDeselect(followUp);
    }
  };

  const { mutateAsync, isPending } = useUpdateBulkEnquiryDataMutation();
  const handler = useForm({
    defaultValues: forms.followUp.values,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<any>(forms.followUp.validation),
    mode: "all",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (values: typeof forms.followUp.values) => {
    const updatedDetails = data;

    updatedDetails?.formData?.followUp.push({
      ...values,
      createDate: moment().format("DD/MM/YYYY"),
      id: generateHexColor(),
      flag: values.flag,
    });

    const res = await mutateAsync({ details: updatedDetails });
    if (res.statusCode === 200) {
      refetch();
      handler.reset();
    } else {
      customAlert.show({ message: "data not updated"});
    }
  };

  const handleRemoveFollowUps = async () => {
    const updatedDetails: TBulkDataEnquiry = JSON.parse(JSON.stringify(data));

    const filteredFollowUps = updatedDetails?.formData?.followUp.filter(
      (query) => {
        const isItemInArray = selectedFollowUps.some(
          (item) =>
            item.followUpDate === query.followUpDate &&
            item.description === query.description &&
            item.flag === query.flag &&
            item.createDate === query.createDate
        );

        if (!isItemInArray) {
          return true;
        } else {
          return false;
        }
      }
    );

    const res = await mutateAsync({
      details: {
        ...updatedDetails,
        formData: { ...updatedDetails.formData, followUp: filteredFollowUps },
      },
    });
    if (res.statusCode === 200) {
      refetch();
      setSelectedFollowUps([]);
    } else {
      customAlert.show({ message: "data not updated" });
    }
  };
  const { flags, isLoading: isFlagsLoading, error } = useDynamicFlags({
    flag: "csv", // or use the appropriate flag based on your context
    formTemplateId,
    // formBulkDataId: ... // add if needed
  });
  console.log("[BulkDataFormDetails] Dynamic Flags:", flags);
  console.log("[BulkDataFormDetails] Error:", error);
  return (
    <View style={styles.rootContainer}>
      <Flex justify="flex-end" mx={15} my={10}>
      <ActionIcon mx={10} onPress={handlePhoneCall}>
          <AutoHeightImage width={20} source={IMAGES.phoneIcon} />
        </ActionIcon>
        <ActionIcon
          mx={7}
          disabled={selectedFollowUps.length === 0}
          onPress={() => setEditEnquiry(true)}
        >
          <AutoHeightImage
            width={24}
            source={
              selectedFollowUps.length > 0
                ? IMAGES.editActiveIcon
                : IMAGES.editIcon
            }
          />
        </ActionIcon>
        <ActionIcon
          mx={7}
          disabled={selectedFollowUps.length === 0}
          onPress={() =>
            customAlert.show({
              message: "Are you sure you want to delete .",
              cancelTitle: "No",
              okTitle: "Yes",
              okCallBack: handleRemoveFollowUps,
            })
          }
        >
          <AutoHeightImage
            width={24}
            source={
              selectedFollowUps.length > 0
                ? IMAGES.deleteActiveIcon
                : IMAGES.deleteIcon
            }
          />
        </ActionIcon>
      </Flex>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Grid style={{ minWidth: SCREEN_WIDTH }}>
          <Row style={styles.headerRow}>
            <Col style={styles.formColumn}>
              <ScalableText style={styles.headerTitle} fontFamily="Bold">
                Created
              </ScalableText>
            </Col>
            <Col style={styles.formColumn}>
              <ScalableText style={styles.headerTitle} fontFamily="Bold">
                Follow up
              </ScalableText>
            </Col>
            <Col style={styles.formColumn}>
              <ScalableText style={styles.headerTitle} fontFamily="Bold">
                Flag
              </ScalableText>
            </Col>
            <Col style={styles.formColumn}>
              <ScalableText style={styles.headerTitle} fontFamily="Bold">
                Message
              </ScalableText>
            </Col>
          </Row>
          {typeof data?.formData?.followUp !== "string" &&
            data?.formData?.followUp.map((query, index) => (
              <FollowUpRow
                query={query}
                key={`${index}_${query.followUpDate}`}
                handleCheckBoxClick={handleCheckboxChange}
                selected={selectedFollowUps.includes(query)}
              />
            ))}

          <Row style={{ ...styles.dataRow, borderBottomWidth: 0 }}>
            <Col style={{ ...styles.formColumn, justifyContent: "center" }}>
              <Flex>
                <View style={{ opacity: 0 }}>
                  <CheckBox />
                </View>
                <ScalableText style={styles.dataText} fontFamily="Regular">
                  {moment().format("DD-MM-YY")}
                </ScalableText>
              </Flex>
            </Col>
            <Col
              style={{
                ...styles.formColumn,
              }}
            >
              <DateInput
                inputTextStyles={{ marginTop: 0 }}
                inputRoot={{
                  width: 100,
                  paddingHorizontal: 0,
                  alignItems: "center",
                  marginVertical: 15,
                }}
                errorStyle={{ fontSize: 8, marginTop: 0 }}
                handler={handler}
                label="Follow up date*"
                name="followUpDate"
              />
            </Col>
            <Col
              style={{
                ...styles.formColumn,
                marginHorizontal: 5,
              }}
            >
              <SelectInput
                value={handler.watch("flag")}
                label="Select Flag"
                options={flags}
                onChange={(e) => handler.setValue("flag", e)}
                dropdownButtonStyle={{ width: 95, paddingHorizontal: 10 }}
              />
            </Col>
            <Col style={styles.formColumn}>
              <Input
                inputRoot={{
                  width: 100,
                  marginVertical: 15,
                  paddingHorizontal: 5,
                }}
                inputStyles={{
                  width: "100%",
                  padding: 0,
                  fontSize: 11,
                  textAlign: "center",
                  marginTop: 0,
                }}
                handler={handler}
                label="Message"
                name="description"
              />
            </Col>
          </Row>

          <Row>
            <Flex justify="center" align="center" flex={1}>
              <Button
                onPress={handler.handleSubmit(onSubmit)}
                btnStyles={{
                  ...styles.submitBtn,
                  backgroundColor: handler.formState.isValid
                    ? COLORS.primary
                    : COLORS.white,
                }}
                btnTxtStyles={{
                  ...styles.submitBtnText,
                  color: handler.formState.isValid ? COLORS.white : "#717171",
                }}
                title="Add"
                disabled={isPending}
                loading={isPending}
              />
            </Flex>
          </Row>
        </Grid>
      </ScrollView>
      {editEnquiry && (
        <EditFollowUpModal
          handleClose={() => setEditEnquiry(false)}
          isVisible={editEnquiry}
          refetch={refetch}
          selectedQueries={selectedFollowUps}
          resetSelected={() => setSelectedFollowUps([])}
          enquiryDetails={data}
        />
      )}
    </View>
  );
};

export default memo(EnquiryDetailsTab);

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  formColumn: {
    width: 95,
    justifyContent: "center",
    alignItems: "center",
    // padding: 10,
    flex: 1,
  },
  headerRow: {
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 0.8,
    height: 65,
  },
  dataRow: {
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 0.8,
    height: 70,
  },
  headerTitle: {
    fontSize: 14,
  },
  dataText: {
    fontSize: 12,
    textAlign: "center",
  },
  submitBtn: {
    width: 62,
    elevation: 1,
    height: 41,
    marginTop: 20,
  },
  submitBtnText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
  },
});
