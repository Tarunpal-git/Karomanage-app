import { StyleSheet, TouchableOpacity } from "react-native";
import React, { FC, memo } from "react";
import { TImages } from "../../../images/images";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";

interface IProfileOption {
  title: string;
  icon: TImages;
  onPress: () => void;
}

const ProfileOption: FC<IProfileOption> = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      <Flex>
        <AutoHeightImage source={IMAGES[icon]} width={32} />
        <ScalableText fontFamily="Medium" style={styles.title}>
          {title}
        </ScalableText>
      </Flex>

      <AutoHeightImage source={IMAGES.chevronRightBlack} width={10} />
    </TouchableOpacity>
  );
};

export default memo(ProfileOption);

const styles = StyleSheet.create({
  root: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    marginLeft: 23,
  },
});
