import { StyleSheet, TextInput } from "react-native";
import React, { FC, memo } from "react";
import Flex from "../flex/Flex";
import AutoHeightImage from "../auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import { COLORS } from "../../colors";

interface ISearchBar {
  onChange: (text: string) => void;
  value: string;
}

const SearchBar: FC<ISearchBar> = ({ onChange, value }) => {
  return (
    <Flex styles={styles.inputRoot}>
      <AutoHeightImage source={IMAGES.searchIcon} width={18} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="Search"
        placeholderTextColor={"#6F6F6F"}
      />
    </Flex>
  );
};

export default memo(SearchBar);

const styles = StyleSheet.create({
  inputRoot: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.5,
    elevation: 4,
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    borderRadius: 6,
    height: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontFamily: "Poppins-Medium",
    color: COLORS.black,
    marginTop: 8,
    marginHorizontal: 5,
    borderRadius: 6,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
