// import React, { useEffect, useMemo, useState } from "react";
// import SafeView from "../../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../../@ui/app-header/AppHeader";
// import {
//   RouteProp,
//   useIsFocused,
//   useNavigation,
//   useRoute,
// } from "@react-navigation/native";
// import {
//   TScreenNavigator,
//   TScreenNavigatorParams,
// } from "../../../../types/navigator/screen-navigator";
// import ThemeScrollView from "../../../../@ui/theme-scroll-view/ThemeScrollView";
// import SearchBar from "../../../../@ui/search-bar/SearchBar";
// import Flex from "../../../../@ui/flex/Flex";
// import GridTable from "../../../../@ui/table/GridTable";
// import { TTableColumns } from "../../../../types/table/tableColomuns";
// import { COLORS } from "../../../../colors";
// import Button from "../../../../@ui/button/Button";
// import { StyleSheet } from "react-native";
// import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
// import { IMAGES } from "../../../../images";
// import FilterButton from "../../../enquiry/enquiry-lists/components/FilterButton";
// import { useFormEnquiriesQuery } from "../../../../apis/hooks/lead-management/query/useFormEnquiries.query";

// import { formEnquiriesColumns } from "./components/columns";
// import ActionPopover from "./components/ActionPopover";
// import UpdateFormEnquiryModal from "./components/UpdateFormEnquiryModal";
// import { formEnquiriesFilteredData } from "./utils/formEnquiriesFilteredData";

// const FormEnquiries = () => {
//   const isFocused = useIsFocused();
//   const [filters, setFilters] = useState({ search: "", status: "" });
//   const navigation = useNavigation<TScreenNavigator>();
//   const [editEnquiryModal, setEditEnquiryModal] = useState<{
//     isVisible: boolean;
//     data: TFormEnquiry | undefined;
//   }>({
//     isVisible: false,
//     data: undefined,
//   });

//   const {
//     params: { formTemplateId },
//   } = useRoute<RouteProp<TScreenNavigatorParams, "FormEnquiries">>();

//   const { isLoading, data, refetch } = useFormEnquiriesQuery(formTemplateId);

//   const enquiries: TFormEnquiry[] = useMemo(() => {
//     if (!isLoading && data?.data) {
//       return formEnquiriesFilteredData(data.data, filters);
//     } else {
//       return [];
//     }
//   }, [isLoading, data, filters]);

//   const tableColumns = [...formEnquiriesColumns];

//   tableColumns.unshift({
//     key: "action",
//     label: "",
//     minWidth: 30,
//     renderCell: (row) => (
//       <ActionPopover
//         handleEditClick={() =>
//           setEditEnquiryModal({ data: row, isVisible: true })
//         }
//         refetch={refetch}
//         row={row}
//       />
//     ),
//     dataCellStyle: { paddingHorizontal: 0 },
//   });

//   useEffect(() => {
//     if (isFocused) {
//       refetch();
//     }
//   }, [isFocused]);

//   return (
//     <SafeView>
//       <AppHeader
//         title="Single Form List"
//         handleBackClick={navigation.goBack}
//         showDrawer={false}
//       />
//       <Flex my={5} mx={35}>
//         <SearchBar
//           onChange={(e) => setFilters((state) => ({ ...state, search: e }))}
//           value={filters.search}
//         />
//       </Flex>
//       <Flex mb={17} mx={30}>
//         <Button
//           onPress={() =>
//             navigation.push("FormsAssignManager", {
//               leads: [],
//               formTemplateId: formTemplateId,
//             })
//           }
//           btnStyles={styles.actionBtn}
//           title="Assign"
//           leftIcon={
//             <Flex mx={13}>
//               <AutoHeightImage source={IMAGES.assignIcon} width={17} />
//             </Flex>
//           }
//           btnTxtStyles={{ ...styles.btnText }}
//         />
//         <FilterButton
//           buttonWidth={150}
//           filter={filters}
//           updateFilter={setFilters}
//         />
//       </Flex>

//       <ThemeScrollView
//         paddingHorizontal={0}
//         loading={isLoading}
//         reloadData={refetch}
//       >
//         <GridTable
//           columns={tableColumns as TTableColumns<unknown>[]}
//           data={enquiries}
//           isLoading={isLoading}
//           headerTextStyles={{ fontSize: 12, color: COLORS.white }}
//           headerStyles={{ backgroundColor: COLORS.primary }}
//           tableContainer={{ elevation: 0, borderRadius: 0 }}
//           handleRowClick={(data: unknown) => {
//             const formEnquiryData = data as TFormEnquiry;
//             navigation.navigate("FormEnquiryDetails", {
//               formId: formEnquiryData.formId,
//               formTemplateId: formTemplateId,
//             });
//           }}
//         />
//       </ThemeScrollView>
//       {editEnquiryModal.isVisible && editEnquiryModal.data && (
//         <UpdateFormEnquiryModal
//           refetch={refetch}
//           data={editEnquiryModal.data}
//           handleClose={() =>
//             setEditEnquiryModal({ data: undefined, isVisible: false })
//           }
//           isVisible={editEnquiryModal.isVisible}
//         />
//       )}
//     </SafeView>
//   );
// };

// export default FormEnquiries;

// const styles = StyleSheet.create({
//   actionBtn: {
//     flex: 1,
//     height: 40,
//     shadowColor: "#000000",
//     shadowOffset: {
//       width: 0,
//       height: 0,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4.5,
//     elevation: 4,
//     paddingHorizontal: 15,
//     borderRadius: 6,
//     marginHorizontal: 5,
//   },
//   btnText: {
//     fontFamily: "Poppins-Regular",
//     fontSize: 14,
//   },
// });
// https://teams.microsoft.com/l/message/19:c12fe162-e99a-4cc3-9194-9cabf1d011ac_e75f918d-a405-4a69-826e-fc9e1d1088f4@unq.gbl.spaces/1765260303077?context=%7B%22contextType%22%3A%22chat%22%7D

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
import { StyleSheet } from "react-native";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import FilterButton from "../../../enquiry/enquiry-lists/components/FilterButton";
import { useFormEnquiriesQuery } from "../../../../apis/hooks/lead-management/query/useFormEnquiries.query";
import { useGetAllLeadsByFilterQuery } from "../../../../apis/hooks/lead-management/query/useGetAllLeadsByFilter.query";

import { formEnquiriesColumns } from "./components/columns";
import ActionPopover from "./components/ActionPopover";
import UpdateFormEnquiryModal from "./components/UpdateFormEnquiryModal";
import { formEnquiriesFilteredData } from "./utils/formEnquiriesFilteredData";
import { mapAllLeadsByFilterToFormEnquiry } from "./utils/mapAllLeadsByFilterResponse";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";

const FormEnquiries = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<TScreenNavigator>();

  const [filters, setFilters] = useState({ search: "", status: "" });

  const [editEnquiryModal, setEditEnquiryModal] = useState<{
    isVisible: boolean;
    data: TFormEnquiry | undefined;
  }>({
    isVisible: false,
    data: undefined,
  });

  const {
    params: { formTemplateId },
  } = useRoute<RouteProp<TScreenNavigatorParams, "FormEnquiries">>();

  // ✅ NEW API CALL - getAllLeadsByFilter
  const {
    isLoading: isLoadingNewApi,
    data: newApiData,
    refetch: refetchNewApi,
  } = useGetAllLeadsByFilterQuery(formTemplateId);
console.log(newApiData,"apidata")
  // ✅ OLD API CALL (commented - can remove later)
  // const { isLoading, data, refetch } = useFormEnquiriesQuery(formTemplateId);

  // ✅ MAP NEW API RESPONSE TO FORM ENQUIRY FORMAT
  const mappedEnquiries: TFormEnquiry[] = useMemo(() => {
    if (!isLoadingNewApi && newApiData) {
      const mapped = mapAllLeadsByFilterToFormEnquiry(newApiData, formTemplateId);
      console.log("🔄 Mapped Enquiries:", mapped);
      return mapped;
    }
    return [];
  }, [isLoadingNewApi, newApiData, formTemplateId]);

  // ✅ FILTERED DATA
  const enquiries: TFormEnquiry[] = useMemo(() => {
    if (mappedEnquiries.length > 0) {
      return formEnquiriesFilteredData(mappedEnquiries, filters);
    }
    return [];
  }, [mappedEnquiries, filters]);

  // ✅ Use new API loading state
  const isLoading = isLoadingNewApi;
  const refetch = refetchNewApi;

  // ✅ FILTERED DATA LOG
  useEffect(() => {
    console.log("🔍 Filtered Enquiries 👉", enquiries);
  }, [enquiries]);
  const renderSafeValue = (value: any) => {
    if (value === null || value === undefined) return "-";
  
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
  
    if (Array.isArray(value)) {
      return value.length ? `${value.length} items` : "-";
    }
  
    if (typeof value === "object") {
      return "-";
    }
  
    return "-";
  };
  
  // const tableColumns = [...formEnquiriesColumns];
  const getDynamicColumns = (enquiries: any[]) => {
    const staticKeys = formEnquiriesColumns.map(col => col.key);
  
    const dynamicKeys = new Set<string>();
    enquiries.forEach(enquiry => {
      Object.keys(enquiry.formData || {}).forEach(key => {
        if (!staticKeys.includes(key) && key.toLowerCase() !== "announcements" && key.toLowerCase() !== "followup" && key.toLowerCase() !== "leadmanager" && key.toLowerCase() !== "mobileNumber" && key.toLowerCase() !== "email" && key.toLowerCase() !== "name" && key.toLowerCase() !== "formstatus") {
          dynamicKeys.add(key);
        }
      });
    });
  
    return Array.from(dynamicKeys).map(key => ({
      key: `formData.${key}`, // IMPORTANT (unique key)
      label: key.replace(/([A-Z])/g, " $1"),
      minWidth: 140,
  
      // ✅ ALWAYS render safely
      renderCell: (row: any) => (
        <ScalableText fontFamily="Regular" style={{ fontSize: 12 }}>
          {renderSafeValue(row.formData?.[key])}
        </ScalableText>
      ),
    }));
  };
  
  const dynamicColumns = getDynamicColumns(enquiries);
  const tableColumns = [
    {
      key: "action",
      label: "",
      minWidth: 30,
      renderCell: (row:any) => (
        <ActionPopover
          handleEditClick={() =>
            setEditEnquiryModal({ data: row, isVisible: true })
          }
          refetch={refetch}
          row={row}
        />
      ),
      dataCellStyle: { paddingHorizontal: 0 },
    },
  
    ...formEnquiriesColumns, // ✅ existing static columns
    ...dynamicColumns,       // 🔥 auto-added dynamic columns
  ];
 

  // ✅ REFETCH ON SCREEN FOCUS
  useEffect(() => {
    if (isFocused) {
      console.log("🔄 Screen Focused → Refetch API");
      refetch();
    }
  }, [isFocused]);
  console.log(enquiries,"enquiries")

  return (
    <SafeView>
      <AppHeader
        title="Single Form List"
        handleBackClick={navigation.goBack}
        showDrawer={false}
      />

      <Flex my={5} mx={35}>
        <SearchBar
          value={filters.search}
          onChange={(e) =>
            setFilters((state) => ({ ...state, search: e }))
          }
        />
      </Flex>

      <Flex mb={17} mx={30}>
        <Button
          title="Assign"
          btnStyles={styles.actionBtn}
          btnTxtStyles={styles.btnText}
          leftIcon={
            <Flex mx={13}>
              <AutoHeightImage source={IMAGES.assignIcon} width={17} />
            </Flex>
          }
          onPress={() =>
            navigation.push("FormsAssignManager", {
              leads: [],
              formTemplateId: formTemplateId,
            })
          }
        />

        <FilterButton
          buttonWidth={150}
          filter={filters}
          updateFilter={setFilters}
        />
      </Flex>

      <ThemeScrollView
        paddingHorizontal={0}
        loading={isLoading}
        reloadData={refetch}
      >
        <GridTable
          columns={tableColumns as TTableColumns<unknown>[]}
          data={enquiries}
          isLoading={isLoading}
          headerTextStyles={{ fontSize: 12, color: COLORS.white }}
          headerStyles={{ backgroundColor: COLORS.primary }}
          tableContainer={{ elevation: 0, borderRadius: 0 }}
          handleRowClick={(rowData: unknown) => {
            console.log("➡️ Row Click Data 👉", rowData);
            const formEnquiryData :any= rowData as TFormEnquiry;
            navigation.navigate("FormEnquiryDetails", {
              leadId: formEnquiryData.leadId,
              formTemplateId: formTemplateId,
            });
          }}
        />
      </ThemeScrollView>

      {editEnquiryModal.isVisible && editEnquiryModal.data && (
        <UpdateFormEnquiryModal
          refetch={refetch}
          data={editEnquiryModal.data}
          isVisible={editEnquiryModal.isVisible}
          handleClose={() =>
            setEditEnquiryModal({ data: undefined, isVisible: false })
          }
        />
      )}
    </SafeView>
  );
};

export default FormEnquiries;

const styles = StyleSheet.create({
  actionBtn: {
    flex: 1,
    height: 40,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4.5,
    elevation: 4,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  btnText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
});

