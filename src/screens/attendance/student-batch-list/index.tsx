import React, { useMemo } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import Flex from "../../../@ui/flex/Flex";
import AttendanceSelectionTab from "../components/AttendanceSelectionTab";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import GridTable from "../../../@ui/table/GridTable";
import { useBatchListsQuery } from "../../../apis/hooks/batch/query/useBatchLists.query";
import { batchesColumns } from "./components/columns";
import { TTableColumns } from "../../../types/table/tableColomuns";

const StudentBatchList = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const { data, isLoading } = useBatchListsQuery();
  const tableColumns = [...batchesColumns];

  const batchLists: TBatchData[] = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      return data.data;
    } else {
      return [];
    }
  }, [data, isLoading]);

  return (
    <SafeView>
      <AppHeader
        title="Student Batch List"
        handleBackClick={() => navigation.goBack()}
        showDrawer={false}
      />
      <Flex mx={25} mb={10} justify="flex-end">
        <AttendanceSelectionTab />
      </Flex>

      <ThemeScrollView paddingHorizontal={15}>
        <Flex mt={20}>
          <GridTable
            tableContainer={{ elevation: 0 }}
            columns={tableColumns as TTableColumns<unknown>[]}
            data={batchLists}
            isLoading={isLoading}
            showScroll={false}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleRowClick={(data: any) =>
              navigation.navigate("StudentAttendance", {
                batchId: data.batchId,
              })
            }
          />
        </Flex>
      </ThemeScrollView>
    </SafeView>
  );
};

export default StudentBatchList;
