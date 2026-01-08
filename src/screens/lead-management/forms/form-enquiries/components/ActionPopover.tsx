import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, memo, useState } from "react";
import Tooltip from "react-native-walkthrough-tooltip";
import Flex from "../../../../../@ui/flex/Flex";
import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../../images";
import { COLORS } from "../../../../../colors";

import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import ActionIcon from "../../../../../@ui/action-icon/ActionIcon";
import UpdateStatusModal from "./UpdateStatusModal";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../../../types/navigator/screen-navigator";

interface IActionPopover {
  row: TFormEnquiry;
  refetch: () => void;
  handleEditClick: () => void;
}

const ActionPopover: FC<IActionPopover> = ({
  row,
  refetch,
  handleEditClick,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const togglePopover = () => setShowFilter((state) => !state);
  const [statusModal, setStatusModal] = useState(false);
  const navigation = useNavigation<TScreenNavigator>();
  const { formTemplateId } =
    useRoute<RouteProp<TScreenNavigatorParams, "FormsAssignManager">>().params;

  return (
    <>
      <Tooltip
        isVisible={showFilter}
        onClose={() => setShowFilter(false)}
        backgroundColor="#00000025"
        childContentSpacing={10}
        horizontalAdjustment={500}
        contentStyle={{
          elevation: 4,
          width: 132,
          borderRadius: 10,
          padding: 25,
          paddingVertical: 10,
        }}
        content={
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("FormsAssignManager", {
                  leads: [row],
                  formTemplateId: formTemplateId,
                });
                togglePopover();
              }}
            >
              <Flex my={8}>
                <AutoHeightImage source={IMAGES.assignIconBlue} width={23} />
                <ScalableText style={styles.optionText} fontFamily="Medium">
                  Assign
                </ScalableText>
              </Flex>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleEditClick();
                togglePopover();
              }}
            >
              <Flex my={8}>
                <AutoHeightImage source={IMAGES.editActiveIcon} width={20} />
                <ScalableText style={styles.optionText} fontFamily="Medium">
                  Edit
                </ScalableText>
              </Flex>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setStatusModal(true);
                togglePopover();
              }}
            >
              <Flex my={8}>
                <AutoHeightImage source={IMAGES.editStatusIcon} width={20} />
                <ScalableText style={styles.optionText} fontFamily="Medium">
                  Status
                </ScalableText>
              </Flex>
            </TouchableOpacity>
          </View>
        }
        placement="bottom"
        arrowSize={{ width: 0, height: 0 }}
      >
        <ActionIcon
          onPress={() => setShowFilter(true)}
          styles={{ padding: 10 }}
        >
          <AutoHeightImage source={IMAGES.menuDotIcon} width={8} />
        </ActionIcon>
      </Tooltip>

      {statusModal && (
        <UpdateStatusModal
          handleClose={() => setStatusModal(false)}
          data={row}
          isVisible={statusModal}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default memo(ActionPopover);

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
    color: COLORS.primary,
  },
});
