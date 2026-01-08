import { StyleSheet, TouchableOpacity } from "react-native";
import React, { FC, memo, useState } from "react";
import ScalableText from "../scalable-text/ScalableText";
import { UseFormReturn } from "react-hook-form";
import { COLORS } from "../../colors";
import Flex from "../flex/Flex";
import { handlePickFile } from "../../utils/PickFile";
import ActionIcon from "../action-icon/ActionIcon";
import AutoHeightImage from "../auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";

interface IFileInputField {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: UseFormReturn<any>;
}

const FileInputField: FC<IFileInputField> = ({ handler, name }) => {
  const [file, setFile] = useState<TFileType | undefined>(undefined);

  const handleOnPress = async () => {
    const file = await handlePickFile();
    setFile(file);
    handler.setValue(name, `data:${file?.type};base64,${file?.base64Url}`);
  };

  const handleRemoveFile = () => {
    setFile(undefined);
    handler.setValue(name, "");
  };

  return (
    <Flex styles={styles.root} justify="space-between">
      <Flex>
        <TouchableOpacity style={styles.chooseBtn} onPress={handleOnPress}>
          <ScalableText
            style={{ color: "#2B2B2B", fontSize: 12, marginTop: 0 }}
            fontFamily="Regular"
          >
            Choose File
          </ScalableText>
        </TouchableOpacity>

        <ScalableText
          numberOfLines={1}
          style={{ fontSize: 14, color: "#838383", width: 150, fontFamily: "Poppins-Regular" }}
          fontFamily="Regular"
        >
          {file ? file.name : "No file chosen"}
        </ScalableText>
      </Flex>
      {file && (
        <ActionIcon onPress={handleRemoveFile}>
          <AutoHeightImage source={IMAGES.closeIcon} width={21} />
        </ActionIcon>
      )}
    </Flex>
  );
};

export default memo(FileInputField);

const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chooseBtn: {
    backgroundColor: "#E6E6E6",
    borderWidth: 1,
    borderColor: "#898989",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    width: 85,
    justifyContent: "center",
    alignItems: "center",
  },
});
