import React, { useMemo, useState } from "react";
import SafeView from "../../../../@ui/safe-view/SafeView";
import AppHeader from "../../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../../types/navigator/screen-navigator";
import Flex from "../../../../@ui/flex/Flex";
import SearchBar from "../../../../@ui/search-bar/SearchBar";
import { useUploadedFormTemplatesQuery } from "../../../../apis/hooks/upload-forms/query/useUploadedFormTemplates.query";
import ThemeScrollView from "../../../../@ui/theme-scroll-view/ThemeScrollView";
import GridTable from "../../../../@ui/table/GridTable";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import { COLORS } from "../../../../colors";
import { tableColumns } from "./components/columns";
import ActionPopover from "./components/ActionPopover";
import { filteredFormTemplates } from "./utils/filterUploadedForms";

const UploadFormList = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useUploadedFormTemplatesQuery();

  const columns = [...tableColumns];

  const formsList: TUploadFormTemplate[] = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      return filteredFormTemplates(data.data, { search: search });
    } else {
      return [];
    }
  }, [isLoading, data, search]);

  columns.unshift({
    key: "action",
    label: "",
    minWidth: 40,
    renderCell: (row) => <ActionPopover refetch={refetch} row={row} />,
  });

  return (
    <SafeView>
      <AppHeader
        title="Upload Data List"
        handleBackClick={() => navigation.goBack()}
      />
      <Flex mx={25} my={10}>
        <SearchBar onChange={setSearch} value={search} />
      </Flex>
      <ThemeScrollView
        loading={isLoading}
        reloadData={refetch}
        paddingHorizontal={0}
      >
        <GridTable
          columns={columns as TTableColumns<unknown>[]}
          data={formsList}
          isLoading={isLoading}
          headerTextStyles={{ fontSize: 12, color: COLORS.black }}
          tableContainer={{ elevation: 0 }}
          showScroll={false}
          handleRowClick={(e: unknown) => {
            const row = e as TFormLists;
            navigation.navigate("BulkDataList", {
              formTemplateId: row.formTemplateId,
            });
          }}
        />
      </ThemeScrollView>
    </SafeView>
  );
};

export default UploadFormList;
