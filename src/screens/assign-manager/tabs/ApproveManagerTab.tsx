import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, memo } from "react";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import Flex from "../../../@ui/flex/Flex";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import Center from "../../../@ui/center/Center";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import Button from "../../../@ui/button/Button";
import { useUpdateSubUserDetailsMutation } from "../../../apis/hooks/user-management/mutation/useUpdateSubUserDetails.mutation";
import { useUpdateLeadManagerMutation } from "../../../apis/hooks/enquiry/mutation/useUpdateLeadManager.mutation";

interface IApproveManagerTab {
  assignedLeads: TEnquiryData[];
  selectedManager: TSelectedManager;
}

const ApproveManagerTab: FC<IApproveManagerTab> = ({
  assignedLeads,
  selectedManager,
}) => {
  const navigation = useNavigation<TScreenNavigator>();

  const { mutateAsync: updateSubUser, isPending: loading } =
    useUpdateSubUserDetailsMutation();

  const { mutateAsync: assignManagerToEnquiry, isPending } =
    useUpdateLeadManagerMutation();

  const handleAssignManager = async () => {
    const res = await updateSubUser({
      details: {
        assignedLeads: assignedLeads,
        designation: selectedManager?.designation ?? "",
        userEmail: selectedManager?.managerEmail ?? "",
        userId: selectedManager?.userId ?? "",
        userName: selectedManager?.managerName ?? "",
        userStatus: "accepted",
        userSurname: "",
      },
    });

    if (res) {
      await assignManagerToEnquiry({
        flag: "enquiry",
        formId: [],
        formTemplateId: "",
        id: assignedLeads.map((lead) => lead.id),
        leadManager: selectedManager,
      });

      navigation.navigate("EnquiryLists");
    } else {
      customAlert.show({
        message: "Manage not assigned",
      });
    }
  };

  return (
    <View style={styles.tabRoot}>
      <ThemeScrollView>
        <Center>
          <AutoHeightImage source={IMAGES.approveImage} width={135} />
          <Flex my={20}>
            <ScalableText fontFamily="Regular" style={styles.description}>
              The Manager would be {"\n"}assigned to{" "}
              <ScalableText
                fontFamily="SemiBold"
                style={{ color: COLORS.primary, fontSize: 16 }}
              >
                {assignedLeads.length} persons.
              </ScalableText>
            </ScalableText>
          </Flex>
          <Flex>
            <Button
              loading={loading || isPending}
              onPress={handleAssignManager}
              disabled={assignedLeads.length === 0 || !selectedManager}
              btnStyles={{ width: 201 }}
              title="Submit"
              btnTxtStyles={{ fontSize: 18, fontFamily: "Poppins-Medium" }}
            />
          </Flex>
        </Center>
      </ThemeScrollView>
      <Flex mb={100}>
        <TouchableOpacity
          style={{ paddingHorizontal: 30 }}
          onPress={() => navigation.goBack()}
        >
          <Flex justify="flex-end">
            <ScalableText
              fontFamily="SemiBold"
              style={{
                ...styles.text,
                fontSize: 16,
                marginRight: 5,
                marginTop: 2,
              }}
            >
              {"Cancel"}
            </ScalableText>
          </Flex>
        </TouchableOpacity>
      </Flex>
    </View>
  );
};

export default memo(ApproveManagerTab);

const styles = StyleSheet.create({
  tabRoot: {
    flex: 1,
    marginTop: 20,
  },
  text: {
    color: "#9A9A9A",
    fontSize: 18,
  },
  continueBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 35,
  },
  description: {
    fontSize: 18,
    textAlign: "center",

    lineHeight: 40,
  },
});
