// import React from "react";
// import { View, Text } from "react-native";
// import Center from "../../../../@ui/center/Center";

// const ExpensePaidTab = ({ employeeId }) => {
//   return (
//     <View style={{ padding: 15 }}>
//       <Center>
//         <Text style={{ fontSize: 16, color: "gray" }}>
//           No Expense Records Found
//         </Text>
//       </Center>
//     </View>
//   );
// };

// export default ExpensePaidTab;



// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const ExpensePaidTab = ({ employeeId }) => {
//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Expense Paid</Text>

//         <View style={styles.centerBox}>
//           <Text style={styles.noData}>No Expense Records Found</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default ExpensePaidTab;

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

// const ExpensePaidTab = ({ employeeId }) => {
//   // Dummy data (replace with API response)
//   const expenses = [
//     {
//       name: "G",
//       description: "-",
//       amount: "₹2,000",
//       status: "PAID",
//       mode: "-",
//     },
//   ];

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Expense Paid</Text>

//         {expenses.length === 0 ? (
//           <View style={styles.centerBox}>
//             <Text style={styles.noData}>No Expense Records Found</Text>
//           </View>
//         ) : (
//           expenses.map((item, index) => (
//             <View key={index} style={styles.rowContainer}>
//               <View style={styles.avatarBox}>
//                 <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
//               </View>

//               <View style={styles.detailsBox}>
//                 <Text style={styles.name}>{item.name}</Text>
//                 <Text style={styles.desc}>Description: {item.description}</Text>
//                 <Text style={styles.amount}>Amount: {item.amount}</Text>

//                 <View style={styles.statusRow}>
//                   <Text
//                     style={[
//                       styles.statusBadge,
//                       item.status === "PAID"
//                         ? styles.paid
//                         : styles.pending,
//                     ]}
//                   >
//                     {item.status}
//                   </Text>

//                   <Text style={styles.mode}>Mode: {item.mode}</Text>
//                 </View>
//               </View>
//             </View>
//           ))
//         )}
//       </View>
//     </View>
//   );
// };

// export default ExpensePaidTab;

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

//   rowContainer: {
//     flexDirection: "row",
//     paddingVertical: 15,
//     borderBottomWidth: 0.5,
//     borderColor: "#e0e0e0",
//   },

//   avatarBox: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#d4f8c6",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 15,
//   },

//   avatarText: {
//     fontWeight: "bold",
//     fontSize: 16,
//     color: "green",
//   },

//   detailsBox: {
//     flex: 1,
//   },

//   name: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#000",
//   },

//   desc: {
//     color: "gray",
//     marginTop: 3,
//   },

//   amount: {
//     marginTop: 3,
//     fontSize: 15,
//     fontWeight: "500",
//   },

//   statusRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 6,
//   },

//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 6,
//     fontSize: 12,
//     fontWeight: "bold",
//     marginRight: 10,
//   },

//   paid: {
//     backgroundColor: "#d4f8c6",
//     color: "green",
//   },

//   pending: {
//     backgroundColor: "#fdd7d7",
//     color: "red",
//   },

//   mode: {
//     color: "#666",
//     fontSize: 13,
//   },

//   centerBox: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   noData: {
//     color: "gray",
//     fontSize: 15,
//   },
// });


// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";
// import { useEmployeeDetailsQuery } from "../../../../apis/hooks/employee/query/useEmployeeDetails.query";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const ExpensePaidTab = ({ employeeId }) => {
//   // 🔹 API CALL
//   const { data, isLoading } = useEmployeeDetailsQuery(employeeId);

//   // 🔹 SAFE DATA EXTRACT
//   const expenses =
//     data?.statuscode === 200 ? data?.data?.expense || [] : [];

//   if (isLoading) {
//     return (
//       <View style={{ marginTop: 15 }}>
//         <View style={styles.card}>
//           <Text>Loading expenses...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Expense Paid</Text>

//         {expenses.length === 0 ? (
//           <View style={styles.centerBox}>
//             <Text style={styles.noData}>No Expense Records Found</Text>
//           </View>
//         ) : (
//           expenses.map((item, index) => (
//             <View key={item.expenseId || index} style={styles.rowContainer}>
              
//               {/* AVATAR */}
//               <View style={styles.avatarBox}>
//                 <Text style={styles.avatarText}>
//                   {item.expenseName?.charAt(0)?.toUpperCase() || "E"}
//                 </Text>
//               </View>

//               {/* DETAILS */}
//               <View style={styles.detailsBox}>
//                 <Text style={styles.name}>{item.expenseName}</Text>

//                 <Text style={styles.desc}>
//                   Description: {item.expenseDescription || "-"}
//                 </Text>

//                 <Text style={styles.amount}>
//                   Amount: ₹{item.expenseAmount}
//                 </Text>

//                 <View style={styles.statusRow}>
//                   <Text
//                     style={[
//                       styles.statusBadge,
//                       item.expensePaymentStatus === "paid"
//                         ? styles.paid
//                         : styles.pending,
//                     ]}
//                   >
//                     {item.expensePaymentStatus.toUpperCase()}
//                   </Text>

//                   <Text style={styles.mode}>
//                     Mode: {item.expenseMode || "-"}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           ))
//         )}
//       </View>
//     </View>
//   );
// };

// export default ExpensePaidTab;

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
//     color: "#000",
//     marginBottom: 15,
//   },

//   rowContainer: {
//     flexDirection: "row",
//     paddingVertical: 15,
//     borderBottomWidth: 0.5,
//     borderColor: "#e0e0e0",
//   },

//   avatarBox: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#d4f8c6",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 15,
//   },

//   avatarText: {
//     fontWeight: "bold",
//     fontSize: 16,
//     color: "green",
//   },

//   detailsBox: {
//     flex: 1,
//   },

//   name: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#000",
//   },

//   desc: {
//     color: "gray",
//     marginTop: 3,
//   },

//   amount: {
//     marginTop: 3,
//     fontSize: 15,
//     fontWeight: "500",
//   },

//   statusRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 6,
//   },

//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 6,
//     fontSize: 12,
//     fontWeight: "bold",
//     marginRight: 10,
//   },

//   paid: {
//     backgroundColor: "#d4f8c6",
//     color: "green",
//   },

//   pending: {
//     backgroundColor: "#fdd7d7",
//     color: "red",
//   },

//   mode: {
//     color: "#666",
//     fontSize: 13,
//   },

//   centerBox: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   noData: {
//     color: "gray",
//     fontSize: 15,
//   },
// });


import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { COLORS } from "../../../../colors";
import { useEmployeeDetailsQuery } from "../../../../apis/hooks/employee/query/useEmployeeDetails.query";

const Heights = {
  cardHeight: Dimensions.get("window").height * 0.62,
};

const ExpensePaidTab = ({ employeeId }) => {
  // 🔹 API CALL
  const { data, isLoading } = useEmployeeDetailsQuery(employeeId);

  // 🔹 SAFE DATA EXTRACT
  const expenses =
    data?.statuscode === 200 ? data?.data?.expense || [] : [];

  if (isLoading) {
    return (
      <View style={{ marginTop: 15 }}>
        <View style={styles.card}>
          <Text>Loading expenses...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 15 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Expense Paid</Text>

        {/* ✅ SCROLL START */}
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {expenses.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={styles.noData}>No Expense Records Found</Text>
            </View>
          ) : (
            expenses.map((item, index) => (
              <View key={item.expenseId || index} style={styles.rowContainer}>
                
                {/* AVATAR */}
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarText}>
                    {item.expenseName?.charAt(0)?.toUpperCase() || "E"}
                  </Text>
                </View>

                {/* DETAILS */}
                <View style={styles.detailsBox}>
                  <Text style={styles.name}>{item.expenseName}</Text>

                  <Text style={styles.desc}>
                    Description: {item.expenseDescription || "-"}
                  </Text>

                  <Text style={styles.amount}>
                    Amount: ₹{item.expenseAmount}
                  </Text>

                  <View style={styles.statusRow}>
                    <Text
                      style={[
                        styles.statusBadge,
                        item.expensePaymentStatus === "paid"
                          ? styles.paid
                          : styles.pending,
                      ]}
                    >
                      {item.expensePaymentStatus.toUpperCase()}
                    </Text>

                    <Text style={styles.mode}>
                      Mode: {item.expenseMode || "-"}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
        {/* ✅ SCROLL END */}

      </View>
    </View>
  );
};

export default ExpensePaidTab;

/* ================= STYLES ================= */

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
    color: "#000",
    marginBottom: 15,
  },

  rowContainer: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: "#e0e0e0",
  },

  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#d4f8c6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  avatarText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "green",
  },

  detailsBox: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  desc: {
    color: "gray",
    marginTop: 3,
  },

  amount: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: "500",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
  },

  paid: {
    backgroundColor: "#d4f8c6",
    color: "green",
  },

  pending: {
    backgroundColor: "#fdd7d7",
    color: "red",
  },

  mode: {
    color: "#666",
    fontSize: 13,
  },

  centerBox: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  noData: {
    color: "gray",
    fontSize: 15,
  },
});
