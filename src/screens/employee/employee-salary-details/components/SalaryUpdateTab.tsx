// import React from "react";
// import { View, Text } from "react-native";
// import Center from "../../../../@ui/center/Center";

// const SalaryUpdateTab = ({ employeeId }) => {
//   return (
//     <View style={{ padding: 15 }}>
//       <Center>
//         <Text style={{ fontSize: 16, color: "gray" }}>
//           No Salary Update Available
//         </Text>
//       </Center>
//     </View>
//   );
// };

// export default SalaryUpdateTab;


// import React from "react";
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const SalaryUpdateTab = ({ employeeId }) => {
//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Update Salary</Text>

//         <TextInput
//           placeholder="Enter new salary"
//           style={styles.input}
//           keyboardType="numeric"
//         />

//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.buttonText}>Update Salary</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default SalaryUpdateTab;

// const styles = StyleSheet.create({
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//   },
//   title: { fontSize: 18, fontWeight: "bold", color: "#000", marginBottom: 15 },
//   input: {
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 12,
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 14,
//     borderRadius: 10,
//   },
//   buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
// });



// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const SalaryUpdateTab = ({ employeeId }) => {
  
//   // Dummy static data (replace with API response)
//   const salaryData = {
//     amount: "₹9,000",
//     date: "12/12/2025",
//   };

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>

//         {/* Title */}
//         <Text style={styles.title}>Employee Salary Details :</Text>

//         {/* Salary Info Box */}
//         <View style={styles.infoCard}>

//           <View style={styles.row}>
//             <Text style={styles.label}>Fixed salary amount:</Text>
//             <Text style={styles.value}>{salaryData.amount}</Text>
//           </View>

//           <View style={styles.row}>
//             <Text style={styles.label}>Salary created date :</Text>
//             <Text style={styles.value}>{salaryData.date}</Text>
//           </View>

//         </View>

//       </View>
//     </View>
//   );
// };

// export default SalaryUpdateTab;

// const styles = StyleSheet.create({
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 15,
//   },

//   infoCard: {
//     backgroundColor: "#f9fbff",
//     borderRadius: 12,
//     padding: 18,
//     elevation: 3,
//   },

//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },

//   label: {
//     fontSize: 14,
//     color: "#6D7A90",
//   },

//   value: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#000",
//   },
// });


// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const SalaryUpdateTab = ({ employeeId }) => {
  
//   // Dummy static data (replace with API response)
//   const salaryData = {
//     amount: "₹9,000",
//     date: "12/12/2025",
//   };

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>

//         {/* Title */}
//         <Text style={styles.title}>Employee Salary Details :</Text>

//         {/* Salary Info Box */}
//         <View style={styles.infoCard}>

//           <View style={styles.row}>
//             <Text style={styles.label}>Fixed salary amount:</Text>
//             <Text style={styles.value}>{salaryData.amount}</Text>
//           </View>

//           <View style={styles.row}>
//             <Text style={styles.label}>Salary created date :</Text>
//             <Text style={styles.value}>{salaryData.date}</Text>
//           </View>

//         </View>

//       </View>
//     </View>
//   );
// };

// export default SalaryUpdateTab;

// const styles = StyleSheet.create({
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 15,
//   },

//   infoCard: {
//     backgroundColor: "#f9fbff",
//     borderRadius: 12,
//     padding: 18,
//     elevation: 3,
//   },

//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },

//   label: {
//     fontSize: 14,
//     color: "#6D7A90",
//   },

//   value: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#000",
//   },
// });


import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../../../colors";
import { useEmployeeDetailsQuery } from "../../../../apis/hooks/employee/query/useEmployeeDetails.query";
import moment from "moment";

const Heights = {
  cardHeight: Dimensions.get("window").height * 0.62,
};

const SalaryUpdateTab = ({ employeeId }) => {
  const { data, isLoading } = useEmployeeDetailsQuery(employeeId);

  const salaryDetails =
    data?.statuscode === 200 ? data?.data?.employeeSalaryDetails?.[0] : null;

  const fixedSalary =
    salaryDetails?.salaryType?.fixedSalary?.[0]?.fixedSalaryValue;

  const createdDate =
    salaryDetails?.salaryType?.fixedSalary?.[0]?.dateCreated;

  if (isLoading) {
    return (
      <View style={{ marginTop: 15 }}>
        <View style={styles.card}>
          <Text>Loading salary details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 15 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Employee Salary Details :</Text>

        <View style={styles.infoCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Fixed salary amount :</Text>
            <Text style={styles.value}>
              {fixedSalary ? `₹${fixedSalary}` : "-"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Salary created date :</Text>
            <Text style={styles.value}>
              {createdDate
                ? moment(createdDate).format("DD/MM/YYYY")
                : "-"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SalaryUpdateTab;

const styles = StyleSheet.create({
  card: {
    width: "108%",
    height: Heights.cardHeight,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 6,
    paddingTop: 18,
    paddingHorizontal: 25,
    borderLeftWidth: 6,
    borderLeftColor: COLORS.primary,
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: "#f9fbff",
    borderRadius: 12,
    padding: 18,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#6D7A90",
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
});

