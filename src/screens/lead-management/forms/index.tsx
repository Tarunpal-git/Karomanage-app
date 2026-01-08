import React, { useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import SearchBar from "../../../@ui/search-bar/SearchBar";
import Flex from "../../../@ui/flex/Flex";

import GridTable from "../../../@ui/table/GridTable";

import { TTableColumns } from "../../../types/table/tableColomuns";
import { COLORS } from "../../../colors";
import Avatar from "../../../@ui/avatar/Avatar";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import ActionPopover from "./components/ActionPopover";
import PopoverText from "../../../@ui/popover-text/PopoverText";
import { getStatusColor } from "../../../utils/getStatusColor";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import ActionIcon from "../../../@ui/action-icon/ActionIcon";
import ShowFormQrModal from "./components/ShowFormQrModal";
import { useFetchFormsTemplateListQuery } from "../../../apis/hooks/lead-management/query/useFetchFormsTemplateList.query";
import { filteredFormTemplates } from "./utils/filteredFormTemplates";

const LeadManagementForms = () => {
  const [filters, setFilters] = useState({ search: "" });
  const navigation = useNavigation<TScreenNavigator>();
  const { isLoading, data, refetch } = useFetchFormsTemplateListQuery();
  const [showQrCode, setShowQrCode] = useState<{
    visible: boolean;
    data: TFormLists | undefined;
  }>({ visible: false, data: undefined });

  const formsList: TFormLists[] = useMemo(() => {
    if (!isLoading && data?.data) {
      return filteredFormTemplates(data.data, filters);
    } else {
      return [];
    }
  }, [isLoading, data, filters]);

  const tableColumns: TTableColumns<TFormLists>[] = [
    {
      key: "action",
      label: "",
      minWidth: 30,
      renderCell: (row) => <ActionPopover refetch={refetch} row={row} />,
      dataCellStyle: { paddingHorizontal: 0 },
    },
    {
      key: "formTitle",
      label: "Form\nName",
      minWidth: 100,
      renderCell: (row) => (
        <Flex mr={10}>
          <Avatar content={row.formTitle} />
          <ScalableText
            fontFamily="Regular"
            style={{ fontSize: 11, marginLeft: 5 }}
          >
            {row.formTitle}
          </ScalableText>
        </Flex>
      ),
    },
    {
      key: "formDescription",
      label: "Form Description",
      minWidth: 110,
      renderCell: (row) => (
        <PopoverText text={row.formDescription} width={139} />
      ),
    },
    {
      key: "formStatus",
      label: "Status",
      minWidth: 75,
      renderCell: (row) => (
        <ScalableText
          fontFamily="SemiBold"
          style={{
            fontSize: 11,
            marginLeft: 5,
            textTransform: "capitalize",

            color: getStatusColor(row.formStatus),
          }}
        >
          {row.formStatus}
        </ScalableText>
      ),
    },
    {
      key: "qr",
      label: "QR Code",
      minWidth: 60,
      dataCellStyle: { alignItems: "center" },

      renderCell: (row) => (
        <ActionIcon
          onPress={() => setShowQrCode({ data: row, visible: true })}
          styles={{ padding: 10 }}
        >
          <AutoHeightImage source={IMAGES.qrCodeIcon} width={20} />
        </ActionIcon>
      ),
    },
  ];

  return (
    <SafeView>
      <AppHeader
        title="Forms List"
        handleBackClick={navigation.goBack}
        showDrawer={false}
      />
      <Flex my={5} mx={30}>
        <SearchBar
          onChange={(e) => setFilters((state) => ({ ...state, search: e }))}
          value={filters.search}
        />
      </Flex>

      <ThemeScrollView
        paddingHorizontal={0}
        loading={isLoading}
        reloadData={refetch}
      >
        <GridTable
          columns={tableColumns as TTableColumns<unknown>[]}
          data={formsList}
          isLoading={isLoading}
          headerTextStyles={{ fontSize: 12, color: COLORS.black }}
          tableContainer={{ elevation: 0 }}
          showScroll={false}
          handleRowClick={(e: unknown) => {
            const row = e as TFormLists;
            navigation.navigate("FormEnquiries", {
              formTemplateId: row.formTemplateId,
            });
          }}
        />
      </ThemeScrollView>
      {showQrCode.visible && showQrCode.data && (
        <ShowFormQrModal
          data={showQrCode.data}
          handleClose={() => setShowQrCode({ data: undefined, visible: false })}
          isVisible={showQrCode.visible}
        />
      )}
    </SafeView>
  );
};

export default LeadManagementForms;
