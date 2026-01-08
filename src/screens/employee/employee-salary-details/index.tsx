// import React, { useMemo, useState } from "react";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
// import {
//   TScreenNavigator,
//   TScreenNavigatorParams,
// } from "../../../types/navigator/screen-navigator";
// import ActionIcon from "../../../@ui/action-icon/ActionIcon";
// import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
// import { IMAGES } from "../../../images";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import { useEmployeeDetailsQuery } from "../../../apis/hooks/employee/query/useEmployeeDetails.query";
// import GridTable from "../../../@ui/table/GridTable";
// import { COLORS } from "../../../colors";
// import { TTableColumns } from "../../../types/table/tableColomuns";
// import { salaryDetailsColumns } from "./components/salaryDetailsColumns";
// import TableFilterButton from "./components/TableFilterButton";
// import DownloadReportButton from "./components/DownloadReportButton";
// import moment from "moment";
// import SendInvoiceButton from "./components/SendInvoiceButton";

// const EmployeeSalaryDetails = () => {
//   const navigation = useNavigation<TScreenNavigator>();
//   const {
//     params: { employeeId },
//   } = useRoute<RouteProp<TScreenNavigatorParams, "EmployeeDetails">>();

//   const { data, isLoading, refetch } = useEmployeeDetailsQuery(employeeId);

//   const [visibleColumns, setVisibleColumns] = useState<
//     { label: string; key: string }[]
//   >([
//     { label: "Total Salary", key: "totalSalary" },
//     { label: "Total Working Days", key: "totalWorkingDays" },
//     { label: "Loss Of Days", key: "lossOfDays" },
//     { key: "action", label: "Action" },
//   ]);

//   const tableColumns = useMemo(() => {
//     const columns = [...salaryDetailsColumns];

//     columns.push(
//       {
//         label: "Download",
//         key: "download",
//         minWidth: 110,
//         dataCellStyle: { paddingHorizontal: 40 },
//         renderCell: (row) => {
//           return (
//             <DownloadReportButton
//               employee={{
//                 employeId: details?.employeeId ?? "",
//                 month: moment(row.dateCreated).format("MM"),
//                 salaryId: row.salaryId,
//                 year: moment(row.dateCreated).format("YYYY"),
//               }}
//             />
//           );
//         },
//       },
//       {
//         label: "Send Invoice",
//         key: "sendInvoice",
//         minWidth: 110,
//         dataCellStyle: { paddingHorizontal: 40 },
//         renderCell: (row) => (
//           <SendInvoiceButton employeeDetails={details} salaryDetails={row} />
//         ),
//       },
//       {
//         key: "action",
//         label: "Action",
//         minWidth: 50,
//         renderHeader: () => (
//           <TableFilterButton
//             setVisibleColumns={setVisibleColumns}
//             visibleColumns={visibleColumns}
//           />
//         ),
//       }
//     );

//     return columns.filter((column) =>
//       visibleColumns.some((visibleColumn) => visibleColumn.key === column.key)
//     );
//   }, [salaryDetailsColumns, visibleColumns]);

//   const details: TEmployeeData = useMemo(() => {
//     if (!isLoading && data.statuscode === 200) {
//       return data.data;
//     } else {
//       return undefined;
//     }
//   }, [data, isLoading]);

//   return (
//     <SafeView>
//       <AppHeader
//         title="Salary Details"
//         handleBackClick={() => navigation.goBack()}
//         leftSection={
//           <ActionIcon
//             onPress={() =>
//               navigation.navigate("EmployeeDetails", { employeeId })
//             }
//           >
//             <AutoHeightImage source={IMAGES.profilePrimaryIcon} width={30} />
//           </ActionIcon>
//         }
//         showDrawer={false}
//       />

//       <ThemeScrollView
//         loading={isLoading}
//         reloadData={refetch}
//         paddingHorizontal={0}
//       >
//         <GridTable
//           columns={tableColumns as TTableColumns<unknown>[]}
//           data={details?.salaryRecord ?? []}
//           isLoading={isLoading}
//           headerTextStyles={{ fontSize: 12, color: COLORS.white }}
//           headerStyles={{ backgroundColor: COLORS.primary, elevation: 4 }}
//           tableContainer={{ elevation: 2, borderRadius: 0 }}
//         />
//       </ThemeScrollView>
//     </SafeView>
//   );
// };

// export default EmployeeSalaryDetails;







// import React, { useState } from "react";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
// import {
//   TScreenNavigator,
//   TScreenNavigatorParams,
// } from "../../../types/navigator/screen-navigator";

// import Flex from "../../../@ui/flex/Flex";
// import Tabs from "../../../@ui/tabs/Tabs";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import { ScrollView, View } from "react-native";

// // IMPORT ALL TAB COMPONENTS
// import AttendanceTab from "./components/AttendanceTab";
// import ExpensePaidTab from "./components/ExpensePaidTab";
// import SalaryRecordTab from "./components/SalaryRecordTab";
// import EducationDetailTab from "./components/EducationDetailTab";
// import BankDetailTab from "./components/BankDetailTab";
// import DocumentTab from "./components/DocumentTab";
// import SalaryUpdateTab from "./components/SalaryUpdateTab";

// const EmployeeSalaryDetails = () => {
//   const navigation = useNavigation<TScreenNavigator>();

//   const {
//     params: { employeeId },
//   } = useRoute<RouteProp<TScreenNavigatorParams, "EmployeeSalaryDetails">>();

//   const [tab, setTab] = useState("Attendance");

//   const tabList = [
//     { label: "Attendance", value: "Attendance" },
//     { label: "Expense Paid", value: "Expense Paid" },
//     { label: "Salary Record", value: "Salary Record" },
//     { label: "Education Detail", value: "Education Detail" },
//     { label: "Bank Detail", value: "Bank Detail" },
//     { label: "Documents", value: "Documents" },
//     { label: "Salary Update", value: "Salary Update" },
//   ];

//   return (
//     <SafeView>
//       <AppHeader
//         title="Employee Details"
//         handleBackClick={() => navigation.goBack()}
//         showDrawer={false}
//       />

//       {/* SCROLLABLE TAB BUTTONS WITH SPACING */}
//       <Flex my={20} mx={30}>
//   <ScrollView
//     horizontal
//     showsHorizontalScrollIndicator={false}
//   >
//     <View style={{ flexDirection: "row" }}>
//       {[
//         { label: "Attendance", value: "Attendance" },
//         { label: "Expense Paid", value: "Expense Paid" },
//         { label: "Salary Record", value: "Salary Record" },
//         { label: "Education Detail", value: "Education Detail" },
//         { label: "Bank Detail", value: "Bank Detail" },
//         { label: "Documents", value: "Documents" },
//         { label: "Salary Update", value: "Salary Update" },
//       ].map((item, index) => (
//         <View key={index} style={{ marginRight: 25 }}>
//           <Tabs
//             onChange={setTab}
//             value={tab}
//             tabs={[item]} // only one tab at a time
//           />
//         </View>
//       ))}
//     </View>
//   </ScrollView>
// </Flex>



//       {/* TAB SCREENS */}
//       <ThemeScrollView paddingHorizontal={15}>
//         {tab === "Attendance" && <AttendanceTab employeeId={employeeId} />}
//         {tab === "Expense Paid" && <ExpensePaidTab employeeId={employeeId} />}
//         {tab === "Salary Record" && <SalaryRecordTab employeeId={employeeId} />}
//         {tab === "Education Detail" && (
//           <EducationDetailTab employeeId={employeeId} />
//         )}
//         {tab === "Bank Detail" && <BankDetailTab employeeId={employeeId} />}
//         {tab === "Documents" && <DocumentTab employeeId={employeeId} />}
//         {tab === "Salary Update" && (
//           <SalaryUpdateTab employeeId={employeeId} />
//         )}
//       </ThemeScrollView>
//     </SafeView>
//   );
// };

// export default EmployeeSalaryDetails;


// import React, { useState } from "react";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
// import {
//   TScreenNavigator,
//   TScreenNavigatorParams,
// } from "../../../types/navigator/screen-navigator";

// import Flex from "../../../@ui/flex/Flex";
// import Tabs from "../../../@ui/tabs/Tabs";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import { ScrollView, View } from "react-native";

// // 👉 ADD THESE IMPORTS
// import ActionIcon from "../../../@ui/action-icon/ActionIcon";
// import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
// import { IMAGES } from "../../../images";

// // TAB COMPONENTS
// import AttendanceTab from "./components/AttendanceTab";
// import ExpensePaidTab from "./components/ExpensePaidTab";
// import SalaryRecordTab from "./components/SalaryRecordTab";
// import EducationDetailTab from "./components/EducationDetailTab";
// import BankDetailTab from "./components/BankDetailTab";
// import DocumentTab from "./components/DocumentTab";
// import SalaryUpdateTab from "./components/SalaryUpdateTab";

// const EmployeeSalaryDetails = () => {
//   const navigation = useNavigation<TScreenNavigator>();

//   const {
//     params: { employeeId },
//   } = useRoute<RouteProp<TScreenNavigatorParams, "EmployeeSalaryDetails">>();

//   const [tab, setTab] = useState("Attendance");

//   return (
//     <SafeView>
//       {/* 🔥 HEADER WITH PROFILE ICON */}
//       <AppHeader
//         title="Employee Details"
//         handleBackClick={() => navigation.goBack()}
//         showDrawer={false}
//         leftSection={
//           <ActionIcon
//             onPress={() =>
//               navigation.navigate("EmployeeDetails", { employeeId })
//             }
//           >
//             <AutoHeightImage
//               source={IMAGES.profilePrimaryIcon}
//               width={30}
//             />
//           </ActionIcon>
//         }
//       />

//       {/* SCROLLABLE TABS */}
//       <Flex my={20} mx={30}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           <View style={{ flexDirection: "row" }}>
//             {[
//               { label: "Attendance", value: "Attendance" },
//               { label: "Expense Paid", value: "Expense Paid" },
//               { label: "Salary Record", value: "Salary Record" },
//               { label: "Education Detail", value: "Education Detail" },
//               { label: "Bank Detail", value: "Bank Detail" },
//               { label: "Documents", value: "Documents" },
//               { label: "Salary Update", value: "Salary Update" },
//             ].map((item, index) => (
//               <View key={index} style={{ marginRight: 25 }}>
//                 <Tabs
//                   onChange={setTab}
//                   value={tab}
//                   tabs={[item]}
//                 />
//               </View>
//             ))}
//           </View>
//         </ScrollView>
//       </Flex>

//       {/* TAB CONTENT */}
//       <ThemeScrollView paddingHorizontal={15}>
//         {tab === "Attendance" && <AttendanceTab employeeId={employeeId} />}
//         {tab === "Expense Paid" && <ExpensePaidTab employeeId={employeeId} />}
//         {tab === "Salary Record" && <SalaryRecordTab employeeId={employeeId} />}
//         {tab === "Education Detail" && (
//           <EducationDetailTab employeeId={employeeId} />
//         )}
//         {tab === "Bank Detail" && <BankDetailTab employeeId={employeeId} />}
//         {tab === "Documents" && <DocumentTab employeeId={employeeId} />}
//         {tab === "Salary Update" && (
//           <SalaryUpdateTab employeeId={employeeId} />
//         )}
//       </ThemeScrollView>
//     </SafeView>
//   );
// };

// export default EmployeeSalaryDetails;



import React, { useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../types/navigator/screen-navigator";

import Flex from "../../../@ui/flex/Flex";
import Tabs from "../../../@ui/tabs/Tabs";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import { ScrollView, View } from "react-native";

// 👉 ADD THESE IMPORTS
import ActionIcon from "../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";

// TAB COMPONENTS
import AttendanceTab from "./components/AttendanceTab";
import ExpensePaidTab from "./components/ExpensePaidTab";
import SalaryRecordTab from "./components/SalaryRecordTab";
import EducationDetailTab from "./components/EducationDetailTab";
import BankDetailTab from "./components/BankDetailTab";
import DocumentTab from "./components/DocumentTab";
import SalaryUpdateTab from "./components/SalaryUpdateTab";

const EmployeeSalaryDetails = () => {
  const navigation = useNavigation<TScreenNavigator>();

  const {
    params: { employeeId },
  } = useRoute<RouteProp<TScreenNavigatorParams, "EmployeeSalaryDetails">>();

  const [tab, setTab] = useState("Attendance");

  return (
    <SafeView>
      {/* 🔥 HEADER WITH PROFILE ICON */}
      <AppHeader
        title="Employee Details"
        handleBackClick={() => navigation.goBack()}
        showDrawer={false}
        leftSection={
          <ActionIcon
            onPress={() =>
              navigation.navigate("EmployeeDetails", { employeeId })
            }
          >
            <AutoHeightImage
              source={IMAGES.profilePrimaryIcon}
              width={30}
            />
          </ActionIcon>
        }
      />

      {/* SCROLLABLE TABS */}
      <Flex my={20} mx={30}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row" }}>
            {[
              { label: "Attendance", value: "Attendance" },
              { label: "Expense Paid", value: "Expense Paid" },
              { label: "Salary Record", value: "Salary Record" },
              { label: "Education Detail", value: "Education Detail" },
              { label: "Bank Detail", value: "Bank Detail" },
              { label: "Documents", value: "Documents" },
              { label: "Salary Update", value: "Salary Update" },
            ].map((item, index) => (
              <View key={index} style={{ marginRight: 25 }}>
                <Tabs
                  onChange={setTab}
                  value={tab}
                  tabs={[item]}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </Flex>

      {/* TAB CONTENT */}
      <ThemeScrollView 
  paddingHorizontal={15}
  refreshControl={undefined}  
>
        {tab === "Attendance" && <AttendanceTab employeeId={employeeId} />}
        {tab === "Expense Paid" && <ExpensePaidTab employeeId={employeeId} />}
        {tab === "Salary Record" && <SalaryRecordTab employeeId={employeeId} />}
        {tab === "Education Detail" && (
          <EducationDetailTab employeeId={employeeId} />
        )}
        {tab === "Bank Detail" && <BankDetailTab employeeId={employeeId} />}
        {tab === "Documents" && <DocumentTab employeeId={employeeId} />}
        {tab === "Salary Update" && (
          <SalaryUpdateTab employeeId={employeeId} />
        )}
      </ThemeScrollView>
    </SafeView>
  );
};

export default EmployeeSalaryDetails;

