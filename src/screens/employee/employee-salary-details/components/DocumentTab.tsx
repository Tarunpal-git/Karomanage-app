// import React from "react";
// import { View, Text } from "react-native";
// import Center from "../../../../@ui/center/Center";

// const DocumentTab = ({ employeeId }) => {
//   return (
//     <View style={{ padding: 15 }}>
//       <Center>
//         <Text style={{ fontSize: 16, color: "gray" }}>
//           No Documents Uploaded
//         </Text>
//       </Center>
//     </View>
//   );
// };

// export default DocumentTab;


// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const DocumentTab = ({ employeeId }) => {
//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Documents</Text>

//         <View style={styles.centerBox}>
//           <Text style={styles.noData}>No Documents Uploaded</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default DocumentTab;

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

// const DocumentTab = ({ employeeId }) => {
//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Documents</Text>

//         {/* AADHAR CARD */}
//         <View style={styles.docBlock}>
//           <Text style={styles.docTitle}>Aadhar Card</Text>
//           <Text style={styles.docStatus}>No photo found yet</Text>
//         </View>

//         {/* PAN CARD */}
//         <View style={styles.docBlock}>
//           <Text style={styles.docTitle}>Pan Card</Text>
//           <Text style={styles.docStatus}>No photo found yet</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default DocumentTab;

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
//     marginBottom: 25,
//   },

//   docBlock: {
//     marginBottom: 30,
//     alignItems: "center",
//   },

//   docTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 8,
//   },

//   docStatus: {
//     fontSize: 14,
//     color: "#6B7280",
//   },
// });



import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { COLORS } from "../../../../colors";
import { useEmployeeDetailsQuery } from "../../../../apis/hooks/employee/query/useEmployeeDetails.query";

const Heights = {
  cardHeight: Dimensions.get("window").height * 0.62,
};

const DocumentTab = ({ employeeId }) => {
  const { data, isLoading } = useEmployeeDetailsQuery(employeeId);

  const professionalDetails =
    data?.statuscode === 200 ? data.data.employeeProfessionalDetails : null;

  const aadharImage = professionalDetails?.employeeAadharCard;
  const panImage = professionalDetails?.employeePanCard;

  if (isLoading) {
    return (
      <View style={{ marginTop: 15, padding: 20 }}>
        <Text>Loading documents...</Text>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 15 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Documents</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ===== AADHAR CARD ===== */}
          <View style={styles.docBlock}>
            <Text style={styles.docTitle}>Aadhar Card</Text>

            <View style={styles.placeholderBox}>
              {aadharImage ? (
                <Image
                  source={{ uri: aadharImage }}
                  style={styles.image}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.placeholderText}>
                  No Aadhar Card photo uploaded
                </Text>
              )}
            </View>
          </View>

          {/* ===== PAN CARD ===== */}
          <View style={styles.docBlock}>
            <Text style={styles.docTitle}>Pan Card</Text>

            <View style={styles.placeholderBox}>
              {panImage ? (
                <Image
                  source={{ uri: panImage }}
                  style={styles.image}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.placeholderText}>
                  No Pan Card photo uploaded
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default DocumentTab;

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
    marginBottom: 25,
    color: "#000",
  },

  docBlock: {
    marginBottom: 30,
  },

  docTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
  },

  placeholderBox: {
    height: 140,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  placeholderText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },
});
