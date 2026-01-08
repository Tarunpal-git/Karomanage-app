import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import { useBatchListsQuery } from "../../../apis/hooks/batch/query/useBatchLists.query";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import Flex from "../../../@ui/flex/Flex";
import SearchBar from "../../../@ui/search-bar/SearchBar";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import { filteredBatchLists } from "../batch-details/utils/filteredBatchLists";
import Button from "../../../@ui/button/Button";
import { hasCreatePermission } from "../../../utils/fetchPermissionsTitle";

const BatchList = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const { data, isLoading, refetch } = useBatchListsQuery();
  console.log("Batch List Data:", data);
  

  const [filter, setFilter] = useState({ search: "" });

  const batchLists: TBatchData[] = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      return filteredBatchLists(data.data, filter);
    } else {
      return [];
    }
  }, [isLoading, data, filter]);


  return (
    <SafeView>
      <AppHeader
        showDrawer={false}
        title="Batch List"
        handleBackClick={() => navigation.goBack()}
      />
      <ThemeScrollView
        paddingHorizontal={15}
        loading={isLoading}
        reloadData={refetch}
      >
        <Flex mt={1} mb={20}>
          <SearchBar
            onChange={(text) =>
              setFilter((state) => ({ ...state, search: text }))
            }
            value={filter.search}
          />
        </Flex>
        {hasCreatePermission("Batch") && (
          <Flex mb={2} mt={2}  flexDirection="row" justify="flex-end" styles={{marginTop: 10}}>
            <Button
              title="Add Batch"
              btnTxtStyles={{ fontSize: 14 }}
              onPress={() => navigation.navigate("CreateBatch")}
              btnStyles={{ width: 110, height: 34, borderRadius: 8 }}
            />
          </Flex>
        )}

        {/* <Flex justify="center" >
          <ScalableText style={styles.title} fontFamily="Bold">
            Batch List
          </ScalableText>
        </Flex> */}

        {batchLists.map((batch) => (
          <TouchableOpacity
            style={styles.batchRow}
            key={batch.batchId}
            onPress={() =>
              navigation.navigate("BatchDetails", {batchId: batch.batchId})
              // navigation.navigate( )
            }
          >
            <ScalableText
              numberOfLines={2}
              style={styles.batchName}
              fontFamily="Medium"
            >
              {batch.batchName}
            </ScalableText>
            <AutoHeightImage source={IMAGES.chevronRightBlack} width={14} />
          </TouchableOpacity>
        ))}
      </ThemeScrollView>
    </SafeView>
  );
};

export default BatchList;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: COLORS.primary,
  },
  batchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    elevation: 4,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 14,
  },
  batchName: {
    fontSize: 16,
    textTransform: "capitalize",
  },
});
