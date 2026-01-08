import React, { useEffect, useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import SearchBar from "../../../@ui/search-bar/SearchBar";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import Flex from "../../../@ui/flex/Flex";
import Button from "../../../@ui/button/Button";
import { StyleSheet } from "react-native";
import { COLORS } from "../../../colors";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import GridTable from "../../../@ui/table/GridTable";
import { useEnquiryListsQuery } from "../../../apis/hooks/enquiry/query/useEnquiryLists.query";
import { columns } from "./components/columns";
import { TTableColumns } from "../../../types/table/tableColomuns";
import FilterButton from "./components/FilterButton";
import ActionPopover from "./components/ActionPopover";
import { filteredEnquiryLists } from "./utils/filteredEnquiryLists";

const EnquiryLists = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const { data, isLoading, refetch } = useEnquiryListsQuery();
  const isFocused = useIsFocused();
  const tableColumns = [...columns];
  const [filters, setFilters] = useState({ search: "", status: "" });

  tableColumns.unshift({
    key: "action",
    label: "Action",
    minWidth: 80,
    renderCell: (row) => <ActionPopover refetch={refetch} row={row} />,
    dataCellStyle: { alignItems: "center" },
  });

  const enquiries: TEnquiryData[] = useMemo(() => {
    if (!isLoading && data) {
      return filteredEnquiryLists(data?.dataArray, filters);
    } else {
      return [];
    }
  }, [isLoading, data, filters]);
console.log("Enquiry Lists Data:", enquiries);
  useEffect(() => {
    console.log("Enquiry Lists Data:", enquiries);
  }, [enquiries]);


  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  return (
    <SafeView>
      <AppHeader
        title="Enquiry List"
        handleBackClick={() => navigation.goBack()}
      />
      <ThemeScrollView paddingHorizontal={12} reloadData={refetch}>
        <Flex my={10}>
          <SearchBar
            value={filters.search}
            onChange={(e) => setFilters((state) => ({ ...state, search: e }))}
          />
          <FilterButton filter={filters} updateFilter={setFilters} />
        </Flex>
        <Flex mb={10}>
          <Button
            onPress={() => navigation.push("GenerateEnquiry")}
            btnStyles={{ ...styles.actionBtn, backgroundColor: COLORS.white }}
            title="Create Enquiry"
            rightIcon={
              <Flex mx={7}>
                <AutoHeightImage source={IMAGES.createIcon} width={14} />
              </Flex>
            }
            btnTxtStyles={{ ...styles.btnText, color: COLORS.primary }}
          />
          <Button
            onPress={() => navigation.push("AssignManager", { leads: [] })}
            btnStyles={styles.actionBtn}
            title="Assign"
            leftIcon={
              <Flex mx={13}>
                <AutoHeightImage source={IMAGES.assignIcon} width={17} />
              </Flex>
            }
            btnTxtStyles={{ ...styles.btnText, marginRight: 5 }}
          />
        </Flex>

        <Flex styles={{ marginBottom: 20, marginHorizontal: -9 }}>
          <GridTable
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleRowClick={(e: any) =>
              navigation.navigate("EnquiryDetails", { id: e.id })
            }
            data={enquiries}
            columns={tableColumns as TTableColumns<unknown>[]}
            isLoading={isLoading}
          />
        </Flex>
      </ThemeScrollView>
    </SafeView>
  );
};

export default EnquiryLists;

const styles = StyleSheet.create({
  actionBtn: {
    flex: 1,
    height: 41,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.5,
    elevation: 4,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  btnText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
});