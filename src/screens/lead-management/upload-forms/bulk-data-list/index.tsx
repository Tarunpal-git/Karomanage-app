import React, { useEffect, useMemo, useState } from "react";
import SafeView from "../../../../@ui/safe-view/SafeView";
import AppHeader from "../../../../@ui/app-header/AppHeader";
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../../types/navigator/screen-navigator";
import ThemeScrollView from "../../../../@ui/theme-scroll-view/ThemeScrollView";
import SearchBar from "../../../../@ui/search-bar/SearchBar";
import Flex from "../../../../@ui/flex/Flex";
import GridTable from "../../../../@ui/table/GridTable";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import { COLORS } from "../../../../colors";
import Button from "../../../../@ui/button/Button";
import { ActivityIndicator, StyleSheet } from "react-native";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import FilterButton from "../../../enquiry/enquiry-lists/components/FilterButton";
import { useFetchBulkDataListQuery } from "../../../../apis/hooks/upload-forms/query/useFetchBulkDataList.query";
import { createDynamicColumns } from "./components/columns";
import { filterBulkDataList } from "./utils/filterBulkDataList";

const ITEMS_PER_PAGE = 10000000; // You can adjust this value

const BulkDataList = () => {
  const isFocused = useIsFocused();
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState<TBulkDataEnquiry[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const navigation = useNavigation<TScreenNavigator>();
  const {
    params: { formTemplateId },
  } = useRoute<RouteProp<TScreenNavigatorParams, "BulkDataList">>();

  const { refetch, data, isLoading, isError } = useFetchBulkDataListQuery({
    formTemplateId,
    customerId: "9cf5a7e9-d747-439d-81e0-5291c3501d3b",
    organizationId: "D-284370",
    flag: "bulk",
    lengthOfData: ITEMS_PER_PAGE,
    dataIndex: page * ITEMS_PER_PAGE,
    pageIndex: page,
  });
console.log("Full bulk data list API response:", data);

  const [tableColumns, setTableColumns] = useState<TTableColumns<TBulkDataEnquiry>[]>([]);

  // Handle initial data load
  // useEffect(() => {
  //   if (!isLoading && data?.statusCode === 200 && data?.data?.formData) {
  //     if (page === 0) {
  //       setAllData(data.data.formData);
  //     } else {
  //       setAllData(prevData => [...prevData, ...data.data.formData]);
  //     }
  //     setHasMore(data.data.formData.length === ITEMS_PER_PAGE);
  //   }
  // }, [data, isLoading]);

  useEffect(() => {
    if (isFocused) {
      setPage(1); // Start from page 1 to avoid issues
      setAllData([]); // Clear previous data
      refetch().then((response) => {
        if (response?.data?.statusCode === 200) {
          const sortedData = [...response.data.data.formData].reverse(); // Ensure correct order
          setAllData(sortedData);
          setHasMore(response.data.data.formData.length === ITEMS_PER_PAGE);
        }
      });
    }
  }, [isFocused]);

  
  useEffect(() => {
    if (isFocused) {
      console.log("Refetching data...");
      setPage(0);
      setAllData([]);
      refetch();
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isLoading && data?.statusCode === 200 && data?.data?.formData) {
      const sortedData = [...data.data.formData].sort((a, b) => a.formId - b.formId);
      if (page === 0) {
        setAllData(sortedData);
      } else {
        setAllData(prevData => [...prevData, ...sortedData]);
      }
      setHasMore(data.data.formData.length === ITEMS_PER_PAGE);
    }
  }, [data, isLoading]);
  console.log("API Response:", data);
console.log("API Loading State:", isLoading);
console.log("API Error State:", isError);

  // Filter the combined data
  const formEnquiries = useMemo(() => {
    if (!data?.data) return [];
    return filterBulkDataList(allData, filters);
  }, [allData, filters, data]);

  // Load more data when reaching the end
  const loadMore = async () => {
    if (!isLoading && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage(prevPage => prevPage + 1);
      await refetch();
      setIsLoadingMore(false);
    }
  };

  // Handle scroll end
  const handleScrollEnd = () => {
    loadMore();
  };

  useEffect(() => {
    if (isFocused) {
      setPage(0);
      setAllData([]);
      refetch();
    }
  }, [isFocused]);

  useEffect(() => {
    if (formEnquiries.length > 0) {
      setTableColumns(
        createDynamicColumns({
          editCallback: () => {},
          fields: formEnquiries[0].formData,
          refetch: refetch,
        })
      );
    } else {
      setTableColumns([]);
    }
  }, [formEnquiries]);

  return (
    <SafeView loading={isLoading && page === 0}>
      <AppHeader
        title="Bulk Data List"
        handleBackClick={navigation.goBack}
        showDrawer={false}
      />
      <Flex my={5} mx={25}>
        <SearchBar
          onChange={(e) => {
            setFilters((state) => ({ ...state, search: e }));
            setPage(0);
            setAllData([]);
          }}
          value={filters.search}
        />
      </Flex>
      <Flex mb={17} mx={15}>
        <FilterButton
          buttonWidth={167}
          filter={filters}
          updateFilter={(newFilters) => {
            setFilters(newFilters);
            setPage(0);
            setAllData([]);
          }}
        />
        <Button
          onPress={() =>
            navigation.push("FormsAssignManager", {
              leads: [],
              formTemplateId,
            })
          }
          btnStyles={styles.actionBtn}
          title="Assign"
          leftIcon={
            <Flex mx={13}>
              <AutoHeightImage source={IMAGES.assignIcon} width={17} />
            </Flex>
          }
          btnTxtStyles={{ ...styles.btnText }}
        />
      </Flex>

      <ThemeScrollView
        paddingHorizontal={0}
        loading={isLoading && page === 0}
        reloadData={() => {
          setPage(0);
          setAllData([]);
          refetch();
        }}
        onScrollEndDrag={handleScrollEnd}
      >
        <GridTable
          columns={tableColumns as TTableColumns<unknown>[]}
          data={formEnquiries}
          isLoading={isLoading && page === 0}
          headerTextStyles={{ fontSize: 12, color: COLORS.white }}
          headerStyles={{ backgroundColor: COLORS.primary }}
          tableContainer={{ elevation: 0, borderRadius: 0 }}
          handleRowClick={(Data) => {
            const form = Data as TBulkDataEnquiry;
            navigation.navigate("BulkDataFormDetails", {
              formId: form.formId,
              formTemplateId: form.formTemplateId,
              metaFields: data.data.metaFields
            });
          }}
          showHeaders={formEnquiries.length > 0}
        />
        {isLoadingMore && (
          <Flex my={10} justifyContent="center">
            <ActivityIndicator size="small" color={COLORS.primary} />
          </Flex>
        )}
      </ThemeScrollView>
    </SafeView>
  );
};

export default BulkDataList;

const styles = StyleSheet.create({
  actionBtn: {
    width: 167,
    height: 40,
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
    marginHorizontal: 9,
  },
  btnText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
});