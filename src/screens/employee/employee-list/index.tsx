// import { StyleSheet, TouchableOpacity } from "react-native";
// import React, { useMemo, useState } from "react";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import { useNavigation } from "@react-navigation/native";
// import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import { COLORS } from "../../../colors";
// import { useEmployeesListQuery } from "../../../apis/hooks/employee/query/useEmployeesList.query";
// import Flex from "../../../@ui/flex/Flex";
// import Avatar from "../../../@ui/avatar/Avatar";
// import SearchBar from "../../../@ui/search-bar/SearchBar";
// import { filteredEmployeeList } from "./utils/filteredEmployeeList";

// const EmployeeList = () => {
//   const navigation = useNavigation<TScreenNavigator>();
//   const { data, isLoading, refetch } = useEmployeesListQuery();
//   const [filter, setFilter] = useState({ search: "" });

//   const employees: TEmployeeData[] = useMemo(() => {
//     if (!isLoading && data.statuscode === 200) {
//       return filteredEmployeeList(data.data, filter);
//     } else {
//       return [];
//     }
//   }, [isLoading, data, filter]);

//   return (
//     <SafeView>
//       <AppHeader
//         showDrawer={false}
//         title="Employee List"
//         handleBackClick={() => navigation.goBack()}
//       />
//       <Flex my={10} mx={30}>
//         <SearchBar
//           onChange={(text) =>
//             setFilter((state) => ({ ...state, search: text }))
//           }
//           value={filter.search}
//         />
//       </Flex>
      
//       <ThemeScrollView
//         paddingHorizontal={15}
//         loading={isLoading}
//         reloadData={refetch}
//       >
//         <Flex
//           flexDirection="column"
//           align="flex-start"
//           mt={20}
//           styles={{ flexWrap: "wrap" }}
//         >
//           {employees.map((employee) => (
//             <TouchableOpacity
//               style={styles.batchRow}
//               key={employee.id}
//               onPress={() =>
//                 navigation.navigate("EmployeeSalaryDetails", {
//                   employeeId: employee.employeeId,
//                 })
//               }
//             >
//               <Avatar
//                 content={`${
//                   employee?.employeePersonalDetails?.employeeFirstname
//                 } ${employee?.employeePersonalDetails?.employeeLastname ?? ""}`}
//                 size={49}
//                 characters={2}
//               />
//               <ScalableText style={styles.batchName} fontFamily="Medium">
//                 {employee?.employeePersonalDetails?.employeeFirstname}{" "}
//                 {employee?.employeePersonalDetails?.employeeLastname}
//               </ScalableText>
//             </TouchableOpacity>
//           ))}
//         </Flex>
//       </ThemeScrollView>
//     </SafeView>
//   );
// };

// export default EmployeeList;

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 18,
//     color: COLORS.primary,
//   },
//   batchRow: {
//     flexDirection: "row",

//     alignItems: "center",
//     backgroundColor: COLORS.white,
//     elevation: 4,
//     paddingHorizontal: 27,
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginBottom: 14,
//     width: "100%",
//   },
//   batchName: {
//     fontSize: 16,
//     textTransform: "capitalize",
//     marginLeft: 35,
//   },
// });

import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import { useEmployeesListQuery } from "../../../apis/hooks/employee/query/useEmployeesList.query";
import Flex from "../../../@ui/flex/Flex";
import Avatar from "../../../@ui/avatar/Avatar";
import SearchBar from "../../../@ui/search-bar/SearchBar";
import { filteredEmployeeList } from "./utils/filteredEmployeeList";

const EmployeeList = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const { data, isLoading, refetch } = useEmployeesListQuery();
  const [filter, setFilter] = useState({ search: "" });

  const employees: TEmployeeData[] = useMemo(() => {
    // if (!isLoading && data.statuscode === 200) {
      if (!isLoading && data && data.statuscode === 200) {
      return filteredEmployeeList(data.data, filter);
    } else {
      return [];
    }
  }, [isLoading, data, filter]);

  return (
    <SafeView>
      <AppHeader
        showDrawer={false}
        title="Employee List"
        handleBackClick={() => navigation.goBack()}
      />
      <Flex my={10} mx={30}>
        <SearchBar
          onChange={(text) =>
            setFilter((state) => ({ ...state, search: text }))
          }
          value={filter.search}
        />
      </Flex>
      <Flex mx={30} mb={1} flexDirection="row" justify="flex-end">
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => navigation.navigate("AddEmployeeScreen")}
  >
    <ScalableText style={styles.addBtnText}>Add Employee</ScalableText>
  </TouchableOpacity>
</Flex>
      
      <ThemeScrollView
        paddingHorizontal={15}
        loading={isLoading}
        reloadData={refetch}
      >
        <Flex
          flexDirection="column"
          align="flex-start"
          mt={20}
          styles={{ flexWrap: "wrap" }}
        >
          {employees.map((employee) => (
            <TouchableOpacity
              style={styles.batchRow}
              key={employee.id}
              onPress={() =>
                navigation.navigate("EmployeeSalaryDetails", {
                  employeeId: employee.employeeId,
                })
              }
            >
              <Avatar
                content={`${
                  employee?.employeePersonalDetails?.employeeFirstname
                } ${employee?.employeePersonalDetails?.employeeLastname ?? ""}`}
                size={49}
                characters={2}
              />
              <ScalableText style={styles.batchName} fontFamily="Medium">
                {employee?.employeePersonalDetails?.employeeFirstname}{" "}
                {employee?.employeePersonalDetails?.employeeLastname}
              </ScalableText>
            </TouchableOpacity>
          ))}
        </Flex>
      </ThemeScrollView>
    </SafeView>
  );
};

export default EmployeeList;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: COLORS.primary,
  },
  batchRow: {
    flexDirection: "row",

    alignItems: "center",
    backgroundColor: COLORS.white,
    elevation: 4,
    paddingHorizontal: 27,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 14,
    width: "100%",
  },
  batchName: {
    fontSize: 16,
    textTransform: "capitalize",
    marginLeft: 35,
  },
  addButton: {
  backgroundColor: COLORS.primary,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
},

addBtnText: {
  color: COLORS.white,
  fontSize: 14,
  fontWeight: "600",
},
});

