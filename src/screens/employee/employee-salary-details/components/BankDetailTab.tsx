// import React from "react";
// import { View, Text } from "react-native";
// import Center from "../../../../@ui/center/Center";

// const BankDetailTab = ({ employeeId }) => {
//   return (
//     <View style={{ padding: 15 }}>
//       <Center>
//         <Text style={{ fontSize: 16, color: "gray" }}>
//           No Bank Details Added
//         </Text>
//       </Center>
//     </View>
//   );
// };

// export default BankDetailTab;

// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const BankDetailTab = ({ employeeId }) => {
//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Bank Details</Text>

//         <View style={styles.centerBox}>
//           <Text style={styles.noData}>No Bank Details Available</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default BankDetailTab;

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
//   centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },
//   noData: { color: "gray", fontSize: 15 },
// });

// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const BankDetailTab = () => {
//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>

//         <Text style={styles.title}>Bank Details</Text>

//         {/* HEADER */}
//         <View style={styles.row}>
//           <View style={styles.col}>
//             <Text style={styles.header}>BANK NAME</Text>
//           </View>

//           <View style={styles.col}>
//             <Text style={styles.header}>BANK ACCOUNT NUMBER</Text>
//           </View>

//           <View style={styles.col}>
//             <Text style={[styles.header, { textAlign: "center" }]}>IFSC CODE</Text>
//           </View>
//         </View>

//         {/* DATA ROW */}
//         <View style={[styles.row, { marginTop: 15 }]}>
//           <View style={styles.col}>
//             <Text style={styles.data}>-</Text>
//           </View>
//           <View style={styles.col}>
//             <Text style={styles.data}>-</Text>
//           </View>
//           <View style={styles.col}>
//             <Text style={[styles.data, { textAlign: "right" }]}>-</Text>
//           </View>
//         </View>

//       </View>
//     </View>
//   );
// };

// export default BankDetailTab;

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
//     marginBottom: 15,
//     color: "#000",
//   },

//   row: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderColor: "#eee",
//     paddingBottom: 10,
//   },

//   col: {
//     flex: 1,               // ⭐⭐ THIS MAKES ALL COLUMNS EQUAL WIDTH
//   },

//   header: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },

//   data: {
//     fontSize: 14,
//     color: "#6D7A90",
//   },
// });


// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const BankDetailTab = () => {

  
//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>

//         <Text style={styles.title}>Bank Details</Text>

//         {/* HEADER */}
//         <View style={styles.row}>
//           <View style={styles.col}>
//             <Text style={styles.header}>BANK NAME</Text>
//           </View>

//           <View style={styles.col}>
//             <Text style={styles.header}>BANK ACCOUNT NUMBER</Text>
//           </View>

//           <View style={styles.col}>
//             <Text style={[styles.header, { textAlign: "center" }]}>IFSC CODE</Text>
//           </View>
//         </View>

//         {/* DATA ROW */}
//         <View style={[styles.row, { marginTop: 15 }]}>
//           <View style={styles.col}>
//             <Text style={styles.data}>-</Text>
//           </View>
//           <View style={styles.col}>
//             <Text style={styles.data}>-</Text>
//           </View>
//           <View style={styles.col}>
//             <Text style={[styles.data, { textAlign: "right" }]}>-</Text>
//           </View>
//         </View>

//       </View>
//     </View>
//   );
// };

// export default BankDetailTab;

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
//     marginBottom: 15,
//     color: "#000",
//   },

//   row: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderColor: "#eee",
//     paddingBottom: 10,
//   },

//   col: {
//     flex: 1,               // ⭐⭐ THIS MAKES ALL COLUMNS EQUAL WIDTH
//   },

//   header: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },

//   data: {
//     fontSize: 14,
//     color: "#6D7A90",
//   },
// });


// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";
// import { useEmployeeDetailsQuery } from "../../../../apis/hooks/employee/query/useEmployeeDetails.query";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const BankDetailTab = ({ employeeId }) => {
//   // ✅ API CALL
//   const { data, isLoading } = useEmployeeDetailsQuery(employeeId);

//   // ✅ SAFE DATA EXTRACT
//   const bankDetails =
//     data?.statuscode === 200 ? data?.data?.employeeBankDetails : null;

//   const bankName = bankDetails?.employeeBankName || "-";
//   const accountNumber = bankDetails?.employeeAccountNo || "-";
//   const ifscCode = bankDetails?.employeeIfscCode || "-";

//   if (isLoading) {
//     return (
//       <View style={{ marginTop: 15 }}>
//         <View style={styles.card}>
//           <Text>Loading bank details...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Bank Details</Text>

//         {/* HEADER */}
//         <View style={styles.row}>
//           <View style={styles.col}>
//             <Text style={styles.header}>BANK NAME</Text>
//           </View>

//           <View style={styles.col}>
//             <Text style={styles.header}>BANK ACCOUNT NUMBER</Text>
//           </View>

//           <View style={styles.col}>
//             <Text style={[styles.header, { textAlign: "right" }]}>
//               IFSC CODE
//             </Text>
//           </View>
//         </View>

//         {/* DATA */}
//         <View style={[styles.row, { marginTop: 15 }]}>
//           <View style={styles.col}>
//             <Text style={styles.data}>{bankName}</Text>
//           </View>

//           <View style={styles.col}>
//             <Text style={styles.data}>{accountNumber}</Text>
//           </View>

//           <View style={styles.col}>
//             <Text style={[styles.data, { textAlign: "right" }]}>
//               {ifscCode}
//             </Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default BankDetailTab;

// /* ================= STYLES ================= */

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
//     marginBottom: 15,
//     color: "#000",
//   },

//   row: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderColor: "#eee",
//     paddingBottom: 10,
//   },

//   col: {
//     flex: 1, // ⭐ equal spacing
//   },

//   header: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },

//   data: {
//     fontSize: 14,
//     color: "#111827",
//     fontWeight: "600",
//   },
// });


import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../../../colors";
import { useEmployeeDetailsQuery } from "../../../../apis/hooks/employee/query/useEmployeeDetails.query";

const Heights = {
  cardHeight: Dimensions.get("window").height * 0.62,
};

const BankDetailTab = ({ employeeId }) => {
  const { data, isLoading } = useEmployeeDetailsQuery(employeeId);

  const bankDetails =
    data?.statuscode === 200 ? data?.data?.employeeBankDetails : null;

  const bankName = bankDetails?.employeeBankName || "-";
  const accountNumber = bankDetails?.employeeAccountNo || "-";

  // ✅ FIX HERE
  const ifscCode = bankDetails?.employeeIfsceCode || "-";

  if (isLoading) {
    return (
      <View style={{ marginTop: 15 }}>
        <View style={styles.card}>
          <Text>Loading bank details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 15 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Bank Details</Text>

        {/* HEADER */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.header}>BANK NAME</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.header}>BANK ACCOUNT NUMBER</Text>
          </View>
          <View style={styles.col}>
            <Text style={[styles.header, { textAlign: "right" }]}>
              IFSC CODE
            </Text>
          </View>
        </View>

        {/* DATA */}
        <View style={[styles.row, { marginTop: 15 }]}>
          <View style={styles.col}>
            <Text style={styles.data}>{bankName}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.data}>{accountNumber}</Text>
          </View>
          <View style={styles.col}>
            <Text style={[styles.data, { textAlign: "right" }]}>
              {ifscCode}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BankDetailTab;

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
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 10,
  },
  col: {
    flex: 1,
  },
  header: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6D7A90",
  },
  data: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
});

