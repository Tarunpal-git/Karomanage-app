import { StyleSheet, TextStyle } from "react-native";
import React, { FC, memo, useMemo } from "react";
import Flex from "../flex/Flex";
import { getFirstCharactersOfWords } from "../../utils/getFirstCharactersOfWords";
import ScalableText from "../scalable-text/ScalableText";
import { AvatarColorPallets } from "../../constants/avatar-color-pallets";

interface IAvatar {
  content: string;
  size?: number;
  textStyle?: TextStyle;
  backgroundColor?: string;
  characters?: number;
}

const Avatar: FC<IAvatar> = ({
  content,

  characters = 1,
  size = 26,
  textStyle,
}) => {
  const theme = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * AvatarColorPallets.length);
    return AvatarColorPallets[randomIndex];
  }, []);

  return (
    <Flex
      styles={{
        ...styles.root,
        backgroundColor: theme.backgroundColor,
        width: size,
        height: size,
      }}
      justify="center"
    >
      <ScalableText
        style={{ ...styles.avatarText, ...textStyle, color: theme.color }}
        fontFamily="Medium"
      >
        {getFirstCharactersOfWords(content, characters)}
      </ScalableText>
    </Flex>
  );
};

export default memo(Avatar);

const styles = StyleSheet.create({
  root: {
    width: 26,
    height: 26,
    borderRadius: 100,
    backgroundColor: "#FFDADA",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FF6969",
    fontSize: 14,
    textTransform: "uppercase",
  },
});
