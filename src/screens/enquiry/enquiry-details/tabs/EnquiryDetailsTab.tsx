import { Linking, ScrollView, StyleSheet, View } from "react-native";
import React, { FC, memo, useState } from "react";
import Flex from "../../../../@ui/flex/Flex";
import ActionIcon from "../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import { Col, Grid, Row } from "react-native-easy-grid";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { SCREEN_WIDTH } from "../../../../constants/Screen";

import FollowUpRow from "./FollowUpRow";
import CheckBox from "../../../../@ui/check-box/CheckBox";
import moment from "moment";
import { useForm } from "react-hook-form";
import { forms } from "../../../../forms";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../../../@ui/input/Input";
import SelectInput from "../../../../@ui/select-input/SelectInput";
import { CONSTANT } from "../../../../constants";
import Button from "../../../../@ui/button/Button";
import { COLORS } from "../../../../colors";

import EditFollowUpModal from "./EditFollowUpModal";
import { useUpdateStudentEnquiryMutation } from "../../../../apis/hooks/enquiry/mutation/useUpdateStudentEnquiry.mutation";
import DateInput from "../../../../@ui/date-input/DateInput";
import { Log } from "victory-native";
import { useDynamicFlags } from "../../../../utils/hooks/useDynamicFlags";


interface IEnquiryDetailsTab {
  details: TEnquiryData;
  refetch: () => void;
}

const EnquiryDetailsTab: FC<IEnquiryDetailsTab> = ({ details, refetch }) => {
  const [selectedFollowUps, setSelectedFollowUps] = useState<string[]>([]);
  const [editEnquiry, setEditEnquiry] = useState(false);

  const handleSelect = (followUpId: string) => {
    setSelectedFollowUps((prevSelected) => [...prevSelected, followUpId]);
  };

  const handleDeselect = (followUpId: string) => {
    setSelectedFollowUps((prevSelected) =>
      prevSelected.filter((id) => id !== followUpId)
    );
  };

  const handleCheckboxChange = (followUpId: string, isChecked: boolean) => {
    if (isChecked) {
      handleSelect(followUpId);
    } else {
      handleDeselect(followUpId);
    }
  };

  const { mutateAsync, isPending } = useUpdateStudentEnquiryMutation();
  const handler = useForm({
    defaultValues: forms.followUp.values,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<any>(forms.followUp.validation),
    mode: "all",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (values: typeof forms.followUp.values) => {
    console.log("[EnquiryDetailsTab] Submitting values:", values);
    console.log("[EnquiryDetailsTab] Flag value:", values.flag);
    
    const updatedDetails = JSON.parse(JSON.stringify(details));
    const newFollowUp = {
      ...values,
      followUpDate: moment(values.followUpDate).format("DD-MM-YYYY"),
    };
    console.log("[EnquiryDetailsTab] New follow-up object:", newFollowUp);
    
    updatedDetails.followUp.push(newFollowUp);
    const res = await mutateAsync({ details: updatedDetails });
    if (res.statusCode === 200) {
      refetch();
      handler.reset();
    } else {
      customAlert.show({ message: "data not updated" });
    }
  };

  const handleRemoveFollowUps = async () => {
    const updatedDetails: TEnquiryData = JSON.parse(JSON.stringify(details));
    const filteredFollowUps = updatedDetails.followUp.filter(
      (item) => !selectedFollowUps.includes(item.followUpId ?? "")
    );
    const res = await mutateAsync({
      details: { ...updatedDetails, followUp: filteredFollowUps },
    });
    if (res.statusCode === 200) {
      refetch();
      setSelectedFollowUps([]);
    } else {
      customAlert.show({ message: "data not updated" });
    }
  };

  const { flags, isLoading, error } = useDynamicFlags({
    flag: "enquiry",
  });
  console.log("[EnquiryDetailsTab] Dynamic Flags:", flags);
  console.log("[EnquiryDetailsTab] Error:", error);

  return (
    <View style={styles.rootContainer}>
      <Flex justify="flex-end" mx={15} my={10}>
        <ActionIcon
          mx={10}
          onPress={() => 
          {

            console.log('details?.mobileNumber',details?.mobileNumber);

            
            Linking.openURL(`tel:${details?.mobileNumber}`)}}
        >

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
              selectedFollowUps.length === 1
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
          {details?.followUp.map((query) => (
            <FollowUpRow
              query={query}
              key={query.followUpId}
              handleCheckBoxClick={handleCheckboxChange}
              selected={selectedFollowUps.includes(query.followUpId ?? "")}
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
                name="message"
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
          details={details}
          resetSelected={() => setSelectedFollowUps([])}
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
