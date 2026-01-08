// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   FlatList,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../../app/store";
// import { COLORS } from "../../../../../colors";
// import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { useMutation } from "@tanstack/react-query";
// import { request } from "../../../../../services/axios.service";
// import { apiUrls } from "../../../../../apis/urls";

// type TOperatingHours = {
//   openingTime: string;
//   closingTime: string;
// };

// const DEFAULT_HOURS: TOperatingHours = {
//   openingTime: "00:00",
//   closingTime: "00:00",
// };

// const buildTimeSlots = () => {
//   const slots: string[] = [];
//   for (let hour = 0; hour < 24; hour += 1) {
//     for (let minute = 0; minute < 60; minute += 15) {
//       const formattedHour = hour.toString().padStart(2, "0");
//       const formattedMinute = minute.toString().padStart(2, "0");
//       slots.push(`${formattedHour}:${formattedMinute}`);
//     }
//   }
//   slots.push("24:00");
//   return slots;
// };

// const OperatingHoursTab = () => {
//   const { selectedOrganization } = useSelector((state: RootState) => state.auth);

//   const { data, isLoading: isFetching, refetch } = useGetClassroomListQuery();

//   const derivedHours = useMemo<TOperatingHours & { hasServerValue: boolean }>(() => {
//     const openingFromApi =
//       data?.data?.openingTime ??
//       data?.data?.operatingHours?.openingTime ??
//       data?.data?.instituteOperatingHours?.openingTime;
//     const closingFromApi =
//       data?.data?.closingTime ??
//       data?.data?.operatingHours?.closingTime ??
//       data?.data?.instituteOperatingHours?.closingTime;

//     if (typeof openingFromApi === "string" || typeof closingFromApi === "string") {
//       return {
//         openingTime: openingFromApi ?? "00:00",
//         closingTime: closingFromApi ?? "00:00",
//         hasServerValue: true,
//       };
//     }

//     return {
//       ...DEFAULT_HOURS,
//       hasServerValue: false,
//     };
//   }, [data]);

//   const [openingTime, setOpeningTime] = useState(DEFAULT_HOURS.openingTime);
//   const [closingTime, setClosingTime] = useState(DEFAULT_HOURS.closingTime);
//   const [initialHours, setInitialHours] = useState(DEFAULT_HOURS);
//   const [isOpeningPickerVisible, setOpeningPickerVisible] = useState(false);
//   const [isClosingPickerVisible, setClosingPickerVisible] = useState(false);

//   const timeSlots = useMemo(() => buildTimeSlots(), []);

//   useEffect(() => {
//     if (derivedHours.hasServerValue) {
//       setOpeningTime(derivedHours.openingTime);
//       setClosingTime(derivedHours.closingTime);
//       setInitialHours({
//         openingTime: derivedHours.openingTime,
//         closingTime: derivedHours.closingTime,
//       });
//     }
//   }, [derivedHours]);

//   const createOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) {
//         throw new Error("No organization selected");
//       }

//       const requestPayload = {
//         customerId: selectedOrganization.customerId,
//         organizationId: selectedOrganization.organizationId,
//         openingTime: payload.openingTime,
//         closingTime: payload.closingTime,
//       };

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.CREATE_CLASSROOM,
//         data: requestPayload,
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const updateOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) {
//         throw new Error("No organization selected");
//       }

//       const requestPayload = {
//         customerId: selectedOrganization.customerId,
//         organizationId: selectedOrganization.organizationId,
//         openingTime: payload.openingTime,
//         closingTime: payload.closingTime,
//       };

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.UPDATE_CLASSROOM,
//         data: requestPayload,
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const isSaving = createOperatingHours.isPending || updateOperatingHours.isPending;
//   const hasConfiguredHours =
//     initialHours.openingTime !== DEFAULT_HOURS.openingTime ||
//     initialHours.closingTime !== DEFAULT_HOURS.closingTime;

//   const isSaveDisabled =
//     !selectedOrganization ||
//     !openingTime?.trim() ||
//     !closingTime?.trim() ||
//     isSaving;

//   const handleSave = () => {
//     if (isSaveDisabled) return;

//     const payload = {
//       openingTime: openingTime.trim(),
//       closingTime: closingTime.trim(),
//     };

//     if (hasConfiguredHours) {
//       updateOperatingHours.mutate(payload);
//     } else {
//       createOperatingHours.mutate(payload);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.sectionTitle}>Institute Operating Hours</Text>
//       <Text style={styles.sectionSubtitle}>
//       Set opening and closing time for your institute.
//       </Text>

//       {isFetching ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator color={COLORS.primary} />
//           <Text style={styles.loaderText}>Loading current timings...</Text>
//         </View>
//       ) : (
//         <>
//           <View style={styles.formRow}>
//             <View style={styles.formField}>
//               <Text style={styles.label}>    Opening time </Text>
//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => setOpeningPickerVisible(true)}
//               >
//                 <Text style={styles.selectorText}>{openingTime}</Text>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.formField}>
//               <Text style={styles.label}>     Closing time </Text>
//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => setClosingPickerVisible(true)}
//               >
//                 <Text style={styles.selectorText}>{closingTime}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={[
//               styles.primaryButton,
//               (isSaveDisabled || isSaving) && { opacity: 0.6 },
//             ]}
//             onPress={handleSave}
//             disabled={isSaveDisabled}
//           >
//             <Text style={styles.primaryButtonText}>
//               {isSaving
//                 ? "Saving..."
//                 : hasConfiguredHours
//                 ? "Update timings"
//                 : "Save timings"}
//             </Text>
//           </TouchableOpacity>
//           <TimePickerModal
//             visible={isOpeningPickerVisible}
//             onClose={() => setOpeningPickerVisible(false)}
//             slots={timeSlots}
//             selectedValue={openingTime}
//             onSelect={(value) => {
//               setOpeningTime(value);
//               setOpeningPickerVisible(false);
//             }}
//           />

//           <TimePickerModal
//             visible={isClosingPickerVisible}
//             onClose={() => setClosingPickerVisible(false)}
//             slots={timeSlots}
//             selectedValue={closingTime}
//             onSelect={(value) => {
//               setClosingTime(value);
//               setClosingPickerVisible(false);
//             }}
//           />
//         </>
//       )}
//     </View>
//   );
// };

// type TimePickerModalProps = {
//   visible: boolean;
//   onClose: () => void;
//   slots: string[];
//   selectedValue: string;
//   onSelect: (value: string) => void;
// };

// const TimePickerModal = ({
//   visible,
//   onClose,
//   slots,
//   selectedValue,
//   onSelect,
// }: TimePickerModalProps) => {
//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Select time</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Text style={styles.modalCloseText}>Close</Text>
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={slots}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => {
//               const isActive = item === selectedValue;
//               return (
//                 <TouchableOpacity
//                   style={[styles.timeOption, isActive && styles.timeOptionActive]}
//                   onPress={() => onSelect(item)}
//                 >
//                   <Text
//                     style={[
//                       styles.timeOptionLabel,
//                       isActive && styles.timeOptionLabelActive,
//                     ]}
//                   >
//                     {item}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             }}
//             initialScrollIndex={Math.max(
//               slots.findIndex((slot) => slot === selectedValue),
//               0
//             )}
//             getItemLayout={(_, index) => ({
//               length: 44,
//               offset: 44 * index,
//               index,
//             })}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default OperatingHoursTab;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 20,
//   },
//   loaderContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     paddingVertical: 20,
//   },
//   loaderText: {
//     color: COLORS.textSecondary ?? "#6B7280",
//   },
//   formRow: {
//     flexDirection: "row",
//     gap: 16,
//     marginBottom: 20,
//   },
//   formField: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 12,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 6,
//   },
//   selector: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     backgroundColor: "#F9FAFB",
//   },
//   selectorText: {
//     color: "#111827",
//     fontWeight: "500",
//   },
//   primaryButton: {
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//   },
//   primaryButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     maxHeight: "60%",
//     backgroundColor: COLORS.white,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 24,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   modalCloseText: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
//   timeOption: {
//     height: 44,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   timeOptionActive: {
//     borderColor: COLORS.primary,
//     backgroundColor: "rgba(67, 97, 238, 0.1)",
//   },
//   timeOptionLabel: {
//     fontSize: 15,
//     color: "#111827",
//   },
//   timeOptionLabelActive: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
// });


//yaha se experiment

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   FlatList,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../../app/store";
// import { COLORS } from "../../../../../colors";
// import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { useMutation } from "@tanstack/react-query";
// import { request } from "../../../../../services/axios.service";
// import { apiUrls } from "../../../../../apis/urls";

// type TOperatingHours = {
//   openingTime: string;
//   closingTime: string;
// };

// const DEFAULT_HOURS: TOperatingHours = {
//   openingTime: "00:00",
//   closingTime: "00:00",
// };

// const buildTimeSlots = () => {
//   const slots: string[] = [];
//   for (let hour = 0; hour < 24; hour += 1) {
//     for (let minute = 0; minute < 60; minute += 15) {
//       const formattedHour = hour.toString().padStart(2, "0");
//       const formattedMinute = minute.toString().padStart(2, "0");
//       slots.push(`${formattedHour}:${formattedMinute}`);
//     }
//   }
//   slots.push("24:00");
//   return slots;
// };

// const OperatingHoursTab = () => {
//   const { selectedOrganization } = useSelector((state: RootState) => state.auth);

//   const { data, isLoading: isFetching, refetch } = useGetClassroomListQuery();

//   const derivedHours = useMemo<TOperatingHours & { hasServerValue: boolean }>(() => {
//     const openingFromApi =
//       data?.data?.openingTime ??
//       data?.data?.operatingHours?.openingTime ??
//       data?.data?.instituteOperatingHours?.openingTime;
//     const closingFromApi =
//       data?.data?.closingTime ??
//       data?.data?.operatingHours?.closingTime ??
//       data?.data?.instituteOperatingHours?.closingTime;

//     if (typeof openingFromApi === "string" || typeof closingFromApi === "string") {
//       return {
//         openingTime: openingFromApi ?? "00:00",
//         closingTime: closingFromApi ?? "00:00",
//         hasServerValue: true,
//       };
//     }

//     return {
//       ...DEFAULT_HOURS,
//       hasServerValue: false,
//     };
//   }, [data]);

//   const [openingTime, setOpeningTime] = useState(DEFAULT_HOURS.openingTime);
//   const [closingTime, setClosingTime] = useState(DEFAULT_HOURS.closingTime);
//   const [initialHours, setInitialHours] = useState(DEFAULT_HOURS);
//   const [isOpeningPickerVisible, setOpeningPickerVisible] = useState(false);
//   const [isClosingPickerVisible, setClosingPickerVisible] = useState(false);
//   const [showOpeningDropdown, setShowOpeningDropdown] = useState(false);
//   const [showClosingDropdown, setShowClosingDropdown] = useState(false);
//   const timeSlots = useMemo(() => buildTimeSlots(), []);

//   useEffect(() => {
//     if (derivedHours.hasServerValue) {
//       setOpeningTime(derivedHours.openingTime);
//       setClosingTime(derivedHours.closingTime);
//       setInitialHours({
//         openingTime: derivedHours.openingTime,
//         closingTime: derivedHours.closingTime,
//       });
//     }
//   }, [derivedHours]);

//   const createOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) {
//         throw new Error("No organization selected");
//       }

//       const requestPayload = {
//         customerId: selectedOrganization.customerId,
//         organizationId: selectedOrganization.organizationId,
//         openingTime: payload.openingTime,
//         closingTime: payload.closingTime,
//       };

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.CREATE_CLASSROOM,
//         data: requestPayload,
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const updateOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) {
//         throw new Error("No organization selected");
//       }

//       const requestPayload = {
//         customerId: selectedOrganization.customerId,
//         organizationId: selectedOrganization.organizationId,
//         openingTime: payload.openingTime,
//         closingTime: payload.closingTime,
//       };

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.UPDATE_CLASSROOM,
//         data: requestPayload,
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const isSaving = createOperatingHours.isPending || updateOperatingHours.isPending;
//   const hasConfiguredHours =
//     initialHours.openingTime !== DEFAULT_HOURS.openingTime ||
//     initialHours.closingTime !== DEFAULT_HOURS.closingTime;

//   const isSaveDisabled =
//     !selectedOrganization ||
//     !openingTime?.trim() ||
//     !closingTime?.trim() ||
//     isSaving;

//   const handleSave = () => {
//     if (isSaveDisabled) return;

//     const payload = {
//       openingTime: openingTime.trim(),
//       closingTime: closingTime.trim(),
//     };

//     if (hasConfiguredHours) {
//       updateOperatingHours.mutate(payload);
//     } else {
//       createOperatingHours.mutate(payload);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.sectionTitle}>Institute Operating Hours</Text>
//       <Text style={styles.sectionSubtitle}>
//       Set opening and closing time for your institute.
//       </Text>

//       {isFetching ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator color={COLORS.primary} />
//           <Text style={styles.loaderText}>Loading current timings...</Text>
//         </View>
//       ) : (
//         <>
//           <View style={styles.formRow}>
//             <View style={styles.formField}>
//               <Text style={styles.label}>    Opening time </Text>
//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => setOpeningPickerVisible(true)}
//               >
//                 <Text style={styles.selectorText}>{openingTime}</Text>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.formField}>
//               <Text style={styles.label}>     Closing time </Text>
//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => setClosingPickerVisible(true)}
//               >
//                 <Text style={styles.selectorText}>{closingTime}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={[
//               styles.primaryButton,
//               (isSaveDisabled || isSaving) && { opacity: 0.6 },
//             ]}
//             onPress={handleSave}
//             disabled={isSaveDisabled}
//           >
//             <Text style={styles.primaryButtonText}>
//               {isSaving
//                 ? "Saving..."
//                 : hasConfiguredHours
//                 ? "Update timings"
//                 : "Save timings"}
//             </Text>
//           </TouchableOpacity>
//           <TimePickerModal
//             visible={isOpeningPickerVisible}
//             onClose={() => setOpeningPickerVisible(false)}
//             slots={timeSlots}
//             selectedValue={openingTime}
//             onSelect={(value) => {
//               setOpeningTime(value);
//               setOpeningPickerVisible(false);
//             }}
//           />

//           <TimePickerModal
//             visible={isClosingPickerVisible}
//             onClose={() => setClosingPickerVisible(false)}
//             slots={timeSlots}
//             selectedValue={closingTime}
//             onSelect={(value) => {
//               setClosingTime(value);
//               setClosingPickerVisible(false);
//             }}
//           />
//         </>
//       )}
//     </View>
//   );
// };

// type TimePickerModalProps = {
//   visible: boolean;
//   onClose: () => void;
//   slots: string[];
//   selectedValue: string;
//   onSelect: (value: string) => void;
// };

// const TimePickerModal = ({
//   visible,
//   onClose,
//   slots,
//   selectedValue,
//   onSelect,
// }: TimePickerModalProps) => {
//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Select time</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Text style={styles.modalCloseText}>Close</Text>
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={slots}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => {
//               const isActive = item === selectedValue;
//               return (
//                 <TouchableOpacity
//                   style={[styles.timeOption, isActive && styles.timeOptionActive]}
//                   onPress={() => onSelect(item)}
//                 >
//                   <Text
//                     style={[
//                       styles.timeOptionLabel,
//                       isActive && styles.timeOptionLabelActive,
//                     ]}
//                   >
//                     {item}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             }}
//             initialScrollIndex={Math.max(
//               slots.findIndex((slot) => slot === selectedValue),
//               0
//             )}
//             getItemLayout={(_, index) => ({
//               length: 44,
//               offset: 44 * index,
//               index,
//             })}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default OperatingHoursTab;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 20,
//   },
//   loaderContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     paddingVertical: 20,
//   },
//   loaderText: {
//     color: COLORS.textSecondary ?? "#6B7280",
//   },
//   formRow: {
//     flexDirection: "row",
//     gap: 16,
//     marginBottom: 20,
//   },
//   formField: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 12,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 6,
//   },
//   selector: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     backgroundColor: "#F9FAFB",
//   },
//   selectorText: {
//     color: "#111827",
//     fontWeight: "500",
//   },
//   primaryButton: {
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//   },
//   primaryButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     maxHeight: "60%",
//     backgroundColor: COLORS.white,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 24,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   modalCloseText: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
//   timeOption: {
//     height: 44,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   timeOptionActive: {
//     borderColor: COLORS.primary,
//     backgroundColor: "rgba(67, 97, 238, 0.1)",
//   },
//   timeOptionLabel: {
//     fontSize: 15,
//     color: "#111827",
//   },
//   timeOptionLabelActive: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
// });

// ye wala sahi he 

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../../app/store";
// import { COLORS } from "../../../../../colors";
// import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { useMutation } from "@tanstack/react-query";
// import { request } from "../../../../../services/axios.service";
// import { apiUrls } from "../../../../../apis/urls";

// type TOperatingHours = {
//   openingTime: string;
//   closingTime: string;
// };

// const DEFAULT_HOURS: TOperatingHours = {
//   openingTime: "00:00",
//   closingTime: "00:00",
// };

// const buildTimeSlots = () => {
//   const slots: string[] = [];
//   for (let hour = 0; hour < 24; hour += 1) {
//     for (let minute = 0; minute < 60; minute += 15) {
//       const formattedHour = hour.toString().padStart(2, "0");
//       const formattedMinute = minute.toString().padStart(2, "0");
//       slots.push(`${formattedHour}:${formattedMinute}`);
//     }
//   }
//   slots.push("24:00");
//   return slots;
// };

// const OperatingHoursTab = () => {

//   const { selectedOrganization } = useSelector((state: RootState) => state.auth);

//   const { data, isLoading: isFetching, refetch } = useGetClassroomListQuery();

//   const derivedHours = useMemo<TOperatingHours & { hasServerValue: boolean }>(() => {
//     const openingFromApi =
//       data?.data?.openingTime ??
//       data?.data?.operatingHours?.openingTime ??
//       data?.data?.instituteOperatingHours?.openingTime;
//     const closingFromApi =
//       data?.data?.closingTime ??
//       data?.data?.operatingHours?.closingTime ??
//       data?.data?.instituteOperatingHours?.closingTime;

//     if (typeof openingFromApi === "string" || typeof closingFromApi === "string") {
//       return {
//         openingTime: openingFromApi ?? "00:00",
//         closingTime: closingFromApi ?? "00:00",
//         hasServerValue: true,
//       };
//     }

//     return { ...DEFAULT_HOURS, hasServerValue: false };
//   }, [data]);

//   const [openingTime, setOpeningTime] = useState(DEFAULT_HOURS.openingTime);
//   const [closingTime, setClosingTime] = useState(DEFAULT_HOURS.closingTime);
//   const [initialHours, setInitialHours] = useState(DEFAULT_HOURS);

//   // dropdown visibility  
//   const [showOpeningDropdown, setShowOpeningDropdown] = useState(false);
//   const [showClosingDropdown, setShowClosingDropdown] = useState(false);

//   const timeSlots = useMemo(() => buildTimeSlots(), []);

//   useEffect(() => {
//     if (derivedHours.hasServerValue) {
//       setOpeningTime(derivedHours.openingTime);
//       setClosingTime(derivedHours.closingTime);
//       setInitialHours({
//         openingTime: derivedHours.openingTime,
//         closingTime: derivedHours.closingTime,
//       });
//     }
//   }, [derivedHours]);

//   const createOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) throw new Error("No organization selected");

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.CREATE_CLASSROOM,
//         data: {
//           customerId: selectedOrganization.customerId,
//           organizationId: selectedOrganization.organizationId,
//           openingTime: payload.openingTime,
//           closingTime: payload.closingTime,
//         },
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const updateOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) throw new Error("No organization selected");

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.UPDATE_CLASSROOM,
//         data: {
//           customerId: selectedOrganization.customerId,
//           organizationId: selectedOrganization.organizationId,
//           openingTime: payload.openingTime,
//           closingTime: payload.closingTime,
//         },
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const isSaving = createOperatingHours.isPending || updateOperatingHours.isPending;
//   const hasConfiguredHours =
//     initialHours.openingTime !== DEFAULT_HOURS.openingTime ||
//     initialHours.closingTime !== DEFAULT_HOURS.closingTime;

//   const isSaveDisabled =
//     !selectedOrganization ||
//     !openingTime?.trim() ||
//     !closingTime?.trim() ||
//     isSaving;

//   const handleSave = () => {
//     if (isSaveDisabled) return;

//     const payload = {
//       openingTime: openingTime.trim(),
//       closingTime: closingTime.trim(),
//     };

//     if (hasConfiguredHours) {
//       updateOperatingHours.mutate(payload);
//     } else {
//       createOperatingHours.mutate(payload);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.sectionTitle}>Institute Operating Hours</Text>
//       <Text style={styles.sectionSubtitle}>
//         Set opening and closing time for your institute.
//       </Text>

//       {isFetching ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator color={COLORS.primary} />
//           <Text style={styles.loaderText}>Loading current timings...</Text>
//         </View>
//       ) : (
//         <>
//           <View style={styles.formRow}>
//             {/* Opening Time */}
//             <View style={styles.formField}>
//               <Text style={styles.label}>Opening time</Text>

//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => {
//                   setShowOpeningDropdown(!showOpeningDropdown);
//                   setShowClosingDropdown(false);
//                 }}
//               >
//                 <Text style={styles.selectorText}>{openingTime}</Text>
//               </TouchableOpacity>

//               {showOpeningDropdown && (
//                 <View style={styles.dropdownBox}>
//                   <FlatList
//                     data={timeSlots}
//                     keyExtractor={(item) => item}
//                     initialScrollIndex={timeSlots.findIndex(t => t === openingTime)}
//                     getItemLayout={(_, index) => ({
//                       length: 44,
//                       offset: 44 * index,
//                       index,
//                     })}
//                     renderItem={({ item }) => {
//                       const isActive = openingTime === item;
//                       return (
//                         <TouchableOpacity
//                           style={[styles.timeOption, isActive && styles.timeOptionActive]}
//                           onPress={() => {
//                             setOpeningTime(item);
//                             setShowOpeningDropdown(false);
//                           }}
//                         >
//                           <Text
//                             style={[
//                               styles.timeOptionLabel,
//                               isActive && styles.timeOptionLabelActive,
//                             ]}
//                           >
//                             {item}
//                           </Text>
//                         </TouchableOpacity>
//                       );
//                     }}
//                   />
//                 </View>
//               )}
//             </View>

//             {/* Closing Time */}
//             <View style={styles.formField}>
//               <Text style={styles.label}>Closing time</Text>

//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => {
//                   setShowClosingDropdown(!showClosingDropdown);
//                   setShowOpeningDropdown(false);
//                 }}
//               >
//                 <Text style={styles.selectorText}>{closingTime}</Text>
//               </TouchableOpacity>

//               {showClosingDropdown && (
//                 <View style={styles.dropdownBox}>
//                   <FlatList
//                     data={timeSlots}
//                     keyExtractor={(item) => item}
//                     initialScrollIndex={timeSlots.findIndex(t => t === closingTime)}
//                     getItemLayout={(_, index) => ({
//                       length: 44,
//                       offset: 44 * index,
//                       index,
//                     })}
//                     renderItem={({ item }) => {
//                       const isActive = closingTime === item;
//                       return (
//                         <TouchableOpacity
//                           style={[styles.timeOption, isActive && styles.timeOptionActive]}
//                           onPress={() => {
//                             setClosingTime(item);
//                             setShowClosingDropdown(false);
//                           }}
//                         >
//                           <Text
//                             style={[
//                               styles.timeOptionLabel,
//                               isActive && styles.timeOptionLabelActive,
//                             ]}
//                           >
//                             {item}
//                           </Text>
//                         </TouchableOpacity>
//                       );
//                     }}
//                   />
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* Save button */}
//           <TouchableOpacity
//             style={[styles.primaryButton, (isSaveDisabled || isSaving) && { opacity: 0.6 }]}
//             onPress={handleSave}
//             disabled={isSaveDisabled}
//           >
//             <Text style={styles.primaryButtonText}>
//               {isSaving ? "Saving..." : hasConfiguredHours ? "Update timings" : "Save timings"}
//             </Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// };

// export default OperatingHoursTab;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 20,
//   },
//   loaderContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     paddingVertical: 20,
//   },
//   loaderText: {
//     color: COLORS.textSecondary ?? "#6B7280",
//   },
//   formRow: {
//     flexDirection: "row",
//     gap: 16,
//     marginBottom: 20,
//   },
//   formField: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 12,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 6,
//   },
//   selector: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     backgroundColor: "#F9FAFB",
//   },
//   selectorText: {
//     color: "#111827",
//     fontWeight: "500",
//   },
//   primaryButton: {
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//   },
//   primaryButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   dropdownBox: {
//     maxHeight: 200,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     marginTop: 4,
//   },
//   timeOption: {
//     height: 44,
//     borderBottomWidth: 1,
//     borderColor: "#E5E7EB",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   timeOptionActive: {
//     backgroundColor: "rgba(67, 97, 238, 0.1)",
//   },
//   timeOptionLabel: {
//     fontSize: 15,
//     color: "#111827",
//   },
//   timeOptionLabelActive: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
// });

// ye har jahag tab karenge to close ho jayega 
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../../app/store";
// import { COLORS } from "../../../../../colors";
// import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { useMutation } from "@tanstack/react-query";
// import { request } from "../../../../../services/axios.service";
// import { apiUrls } from "../../../../../apis/urls";

// type TOperatingHours = {
//   openingTime: string;
//   closingTime: string;
// };

// const DEFAULT_HOURS: TOperatingHours = {
//   openingTime: "00:00",
//   closingTime: "00:00",
// };

// const buildTimeSlots = () => {
//   const slots: string[] = [];
//   for (let hour = 0; hour < 24; hour += 1) {
//     for (let minute = 0; minute < 60; minute += 15) {
//       const formattedHour = hour.toString().padStart(2, "0");
//       const formattedMinute = minute.toString().padStart(2, "0");
//       slots.push(`${formattedHour}:${formattedMinute}`);
//     }
//   }
//   slots.push("24:00");
//   return slots;
// };

// const OperatingHoursTab = () => {

//   const { selectedOrganization } = useSelector((state: RootState) => state.auth);

//   const { data, isLoading: isFetching, refetch } = useGetClassroomListQuery();

//   const derivedHours = useMemo<TOperatingHours & { hasServerValue: boolean }>(() => {
//     const openingFromApi =
//       data?.data?.openingTime ??
//       data?.data?.operatingHours?.openingTime ??
//       data?.data?.instituteOperatingHours?.openingTime;

//     const closingFromApi =
//       data?.data?.closingTime ??
//       data?.data?.operatingHours?.closingTime ??
//       data?.data?.instituteOperatingHours?.closingTime;

//     if (typeof openingFromApi === "string" || typeof closingFromApi === "string") {
//       return {
//         openingTime: openingFromApi ?? "00:00",
//         closingTime: closingFromApi ?? "00:00",
//         hasServerValue: true,
//       };
//     }

//     return { ...DEFAULT_HOURS, hasServerValue: false };
//   }, [data]);

//   const [openingTime, setOpeningTime] = useState(DEFAULT_HOURS.openingTime);
//   const [closingTime, setClosingTime] = useState(DEFAULT_HOURS.closingTime);
//   const [initialHours, setInitialHours] = useState(DEFAULT_HOURS);

//   const [showOpeningDropdown, setShowOpeningDropdown] = useState(false);
//   const [showClosingDropdown, setShowClosingDropdown] = useState(false);

//   const timeSlots = useMemo(() => buildTimeSlots(), []);

//   useEffect(() => {
//     if (derivedHours.hasServerValue) {
//       setOpeningTime(derivedHours.openingTime);
//       setClosingTime(derivedHours.closingTime);
//       setInitialHours({
//         openingTime: derivedHours.openingTime,
//         closingTime: derivedHours.closingTime,
//       });
//     }
//   }, [derivedHours]);

//   const createOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) throw new Error("No organization selected");

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.CREATE_CLASSROOM,
//         data: {
//           customerId: selectedOrganization.customerId,
//           organizationId: selectedOrganization.organizationId,
//           openingTime: payload.openingTime,
//           closingTime: payload.closingTime,
//         },
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const updateOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) throw new Error("No organization selected");

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.UPDATE_CLASSROOM,
//         data: {
//           customerId: selectedOrganization.customerId,
//           organizationId: selectedOrganization.organizationId,
//           openingTime: payload.openingTime,
//           closingTime: payload.closingTime,
//         },
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const isSaving = createOperatingHours.isPending || updateOperatingHours.isPending;
//   const hasConfiguredHours =
//     initialHours.openingTime !== DEFAULT_HOURS.openingTime ||
//     initialHours.closingTime !== DEFAULT_HOURS.closingTime;

//   const isSaveDisabled =
//     !selectedOrganization ||
//     !openingTime?.trim() ||
//     !closingTime?.trim() ||
//     isSaving;

//   const handleSave = () => {
//     if (isSaveDisabled) return;

//     const payload = {
//       openingTime: openingTime.trim(),
//       closingTime: closingTime.trim(),
//     };

//     if (hasConfiguredHours) {
//       updateOperatingHours.mutate(payload);
//     } else {
//       createOperatingHours.mutate(payload);
//     }
//   };

//   return (
//     <View style={styles.container}>

//       {/* 🔥 Invisible overlay to close dropdown on outside tap */}
//       {(showOpeningDropdown || showClosingDropdown) && (
//         <TouchableOpacity
//           style={styles.overlay}
//           activeOpacity={1}
//           onPress={() => {
//             setShowOpeningDropdown(false);
//             setShowClosingDropdown(false);
//           }}
//         />
//       )}

//       <Text style={styles.sectionTitle}>Institute Operating Hours</Text>
//       <Text style={styles.sectionSubtitle}>
//         Set opening and closing time for your institute.
//       </Text>

//       {isFetching ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator color={COLORS.primary} />
//           <Text style={styles.loaderText}>Loading current timings...</Text>
//         </View>
//       ) : (
//         <>
//           <View style={styles.formRow}>
            
//             {/* Opening Time */}
//             <View style={styles.formField}>
//               <Text style={styles.label}>Opening time</Text>

//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => {
//                   setShowOpeningDropdown(!showOpeningDropdown);
//                   setShowClosingDropdown(false);
//                 }}
//               >
//                 <Text style={styles.selectorText}>{openingTime}</Text>
//               </TouchableOpacity>

//               {showOpeningDropdown && (
//                 <View style={styles.dropdownBox}>
//                   <FlatList
//                     data={timeSlots}
//                     keyExtractor={(item) => item}
//                     initialScrollIndex={timeSlots.findIndex(t => t === openingTime)}
//                     getItemLayout={(_, index) => ({
//                       length: 44,
//                       offset: 44 * index,
//                       index,
//                     })}
//                     renderItem={({ item }) => {
//                       const isActive = openingTime === item;
//                       return (
//                         <TouchableOpacity
//                           style={[styles.timeOption, isActive && styles.timeOptionActive]}
//                           onPress={() => {
//                             setOpeningTime(item);
//                             setShowOpeningDropdown(false);
//                           }}
//                         >
//                           <Text
//                             style={[
//                               styles.timeOptionLabel,
//                               isActive && styles.timeOptionLabelActive,
//                             ]}
//                           >
//                             {item}
//                           </Text>
//                         </TouchableOpacity>
//                       );
//                     }}
//                   />
//                 </View>
//               )}
//             </View>

//             {/* Closing Time */}
//             <View style={styles.formField}>
//               <Text style={styles.label}>Closing time</Text>

//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => {
//                   setShowClosingDropdown(!showClosingDropdown);
//                   setShowOpeningDropdown(false);
//                 }}
//               >
//                 <Text style={styles.selectorText}>{closingTime}</Text>
//               </TouchableOpacity>

//               {showClosingDropdown && (
//                 <View style={styles.dropdownBox}>
//                   <FlatList
//                     data={timeSlots}
//                     keyExtractor={(item) => item}
//                     initialScrollIndex={timeSlots.findIndex(t => t === closingTime)}
//                     getItemLayout={(_, index) => ({
//                       length: 44,
//                       offset: 44 * index,
//                       index,
//                     })}
//                     renderItem={({ item }) => {
//                       const isActive = closingTime === item;
//                       return (
//                         <TouchableOpacity
//                           style={[styles.timeOption, isActive && styles.timeOptionActive]}
//                           onPress={() => {
//                             setClosingTime(item);
//                             setShowClosingDropdown(false);
//                           }}
//                         >
//                           <Text
//                             style={[
//                               styles.timeOptionLabel,
//                               isActive && styles.timeOptionLabelActive,
//                             ]}
//                           >
//                             {item}
//                           </Text>
//                         </TouchableOpacity>
//                       );
//                     }}
//                   />
//                 </View>
//               )}
//             </View>

//           </View>

//           {/* Save Button */}
//           <TouchableOpacity
//             style={[styles.primaryButton, (isSaveDisabled || isSaving) && { opacity: 0.6 }]}
//             onPress={handleSave}
//             disabled={isSaveDisabled}
//           >
//             <Text style={styles.primaryButtonText}>
//               {isSaving ? "Saving..." : hasConfiguredHours ? "Update timings" : "Save timings"}
//             </Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// };

// export default OperatingHoursTab;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//   },

//   overlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "transparent",
//     zIndex: 1,            // keeps above ui for click detection
//   },

//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 20,
//   },
//   loaderContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     paddingVertical: 20,
//   },
//   loaderText: {
//     color: COLORS.textSecondary ?? "#6B7280",
//   },
//   formRow: {
//     flexDirection: "row",
//     gap: 16,
//     marginBottom: 20,
//   },
//   formField: {
//     flex: 1,
//     zIndex: 10, // dropdown visible above overlay
//   },
//   label: {
//     fontSize: 12,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 6,
//   },
//   selector: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     backgroundColor: "#F9FAFB",
//   },
//   selectorText: {
//     color: "#111827",
//     fontWeight: "500",
//   },
//   primaryButton: {
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//   },
//   primaryButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   dropdownBox: {
//     maxHeight: 200,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     marginTop: 4,
//     zIndex: 20,
//   },
//   timeOption: {
//     height: 44,
//     borderBottomWidth: 1,
//     borderColor: "#E5E7EB",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   timeOptionActive: {
//     backgroundColor: "rgba(67, 97, 238, 0.1)",
//   },
//   timeOptionLabel: {
//     fontSize: 15,
//     color: "#111827",
//   },
//   timeOptionLabelActive: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
// });

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../../app/store";
// import { COLORS } from "../../../../../colors";
// import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { useMutation } from "@tanstack/react-query";
// import { request } from "../../../../../services/axios.service";
// import { apiUrls } from "../../../../../apis/urls";

// type TOperatingHours = {
//   openingTime: string;
//   closingTime: string;
// };

// const DEFAULT_HOURS: TOperatingHours = {
//   openingTime: "00:00",
//   closingTime: "00:00",
// };

// const buildTimeSlots = () => {
//   const slots: string[] = [];
//   for (let hour = 0; hour < 24; hour += 1) {
//     for (let minute = 0; minute < 60; minute += 15) {
//       const formattedHour = hour.toString().padStart(2, "0");
//       const formattedMinute = minute.toString().padStart(2, "0");
//       slots.push(`${formattedHour}:${formattedMinute}`);
//     }
//   }
//   slots.push("24:00");
//   return slots;
// };

// const OperatingHoursTab = () => {

//   const { selectedOrganization } = useSelector((state: RootState) => state.auth);

//   const { data, isLoading: isFetching, refetch } = useGetClassroomListQuery();

//   const derivedHours = useMemo<TOperatingHours & { hasServerValue: boolean }>(() => {
//     const openingFromApi =
//       data?.data?.openingTime ??
//       data?.data?.operatingHours?.openingTime ??
//       data?.data?.instituteOperatingHours?.openingTime;
//     const closingFromApi =
//       data?.data?.closingTime ??
//       data?.data?.operatingHours?.closingTime ??
//       data?.data?.instituteOperatingHours?.closingTime;

//     if (typeof openingFromApi === "string" || typeof closingFromApi === "string") {
//       return {
//         openingTime: openingFromApi ?? "00:00",
//         closingTime: closingFromApi ?? "00:00",
//         hasServerValue: true,
//       };
//     }

//     return { ...DEFAULT_HOURS, hasServerValue: false };
//   }, [data]);

//   const [openingTime, setOpeningTime] = useState(DEFAULT_HOURS.openingTime);
//   const [closingTime, setClosingTime] = useState(DEFAULT_HOURS.closingTime);
//   const [initialHours, setInitialHours] = useState(DEFAULT_HOURS);

//   // dropdown visibility  
//   const [showOpeningDropdown, setShowOpeningDropdown] = useState(false);
//   const [showClosingDropdown, setShowClosingDropdown] = useState(false);

//   const timeSlots = useMemo(() => buildTimeSlots(), []);

//   useEffect(() => {
//     if (derivedHours.hasServerValue) {
//       setOpeningTime(derivedHours.openingTime);
//       setClosingTime(derivedHours.closingTime);
//       setInitialHours({
//         openingTime: derivedHours.openingTime,
//         closingTime: derivedHours.closingTime,
//       });
//     }
//   }, [derivedHours]);

//   const createOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) throw new Error("No organization selected");

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.CREATE_CLASSROOM,
//         data: {
//           customerId: selectedOrganization.customerId,
//           organizationId: selectedOrganization.organizationId,
//           openingTime: payload.openingTime,
//           closingTime: payload.closingTime,
//         },
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const updateOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) throw new Error("No organization selected");

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.UPDATE_CLASSROOM,
//         data: {
//           customerId: selectedOrganization.customerId,
//           organizationId: selectedOrganization.organizationId,
//           openingTime: payload.openingTime,
//           closingTime: payload.closingTime,
//         },
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const isSaving = createOperatingHours.isPending || updateOperatingHours.isPending;
//   const hasConfiguredHours =
//     initialHours.openingTime !== DEFAULT_HOURS.openingTime ||
//     initialHours.closingTime !== DEFAULT_HOURS.closingTime;

//   const isSaveDisabled =
//     !selectedOrganization ||
//     !openingTime?.trim() ||
//     !closingTime?.trim() ||
//     isSaving;

//   const handleSave = () => {
//     if (isSaveDisabled) return;

//     const payload = {
//       openingTime: openingTime.trim(),
//       closingTime: closingTime.trim(),
//     };

//     if (hasConfiguredHours) {
//       updateOperatingHours.mutate(payload);
//     } else {
//       createOperatingHours.mutate(payload);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.sectionTitle}>Institute Operating Hours</Text>
//       <Text style={styles.sectionSubtitle}>
//         Set opening and closing time for your institute.
//       </Text>

//       {isFetching ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator color={COLORS.primary} />
//           <Text style={styles.loaderText}>Loading current timings...</Text>
//         </View>
//       ) : (
//         <>
//           <View style={styles.formRow}>
//             {/* Opening Time */}
//             <View style={styles.formField}>
//               <Text style={styles.label}>Opening time</Text>

//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => {
//                   setShowOpeningDropdown(!showOpeningDropdown);
//                   setShowClosingDropdown(false);
//                 }}
//               >
//                 <Text style={styles.selectorText}>{openingTime}</Text>
//               </TouchableOpacity>

//               {showOpeningDropdown && (
//                 <View style={styles.dropdownBox}>
//                   <FlatList
//                     data={timeSlots}
//                     keyExtractor={(item) => item}
//                     initialScrollIndex={timeSlots.findIndex(t => t === openingTime)}
//                     getItemLayout={(_, index) => ({
//                       length: 44,
//                       offset: 44 * index,
//                       index,
//                     })}
//                     renderItem={({ item }) => {
//                       const isActive = openingTime === item;
//                       return (
//                         <TouchableOpacity
//                           style={[styles.timeOption, isActive && styles.timeOptionActive]}
//                           onPress={() => {
//                             setOpeningTime(item);
//                             setShowOpeningDropdown(false);
//                           }}
//                         >
//                           <Text
//                             style={[
//                               styles.timeOptionLabel,
//                               isActive && styles.timeOptionLabelActive,
//                             ]}
//                           >
//                             {item}
//                           </Text>
//                         </TouchableOpacity>
//                       );
//                     }}
//                   />
//                 </View>
//               )}
//             </View>

//             {/* Closing Time */}
//             <View style={styles.formField}>
//               <Text style={styles.label}>Closing time</Text>

//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => {
//                   setShowClosingDropdown(!showClosingDropdown);
//                   setShowOpeningDropdown(false);
//                 }}
//               >
//                 <Text style={styles.selectorText}>{closingTime}</Text>
//               </TouchableOpacity>

//               {showClosingDropdown && (
//                 <View style={styles.dropdownBox}>
//                   <FlatList
//                     data={timeSlots}
//                     keyExtractor={(item) => item}
//                     initialScrollIndex={timeSlots.findIndex(t => t === closingTime)}
//                     getItemLayout={(_, index) => ({
//                       length: 44,
//                       offset: 44 * index,
//                       index,
//                     })}
//                     renderItem={({ item }) => {
//                       const isActive = closingTime === item;
//                       return (
//                         <TouchableOpacity
//                           style={[styles.timeOption, isActive && styles.timeOptionActive]}
//                           onPress={() => {
//                             setClosingTime(item);
//                             setShowClosingDropdown(false);
//                           }}
//                         >
//                           <Text
//                             style={[
//                               styles.timeOptionLabel,
//                               isActive && styles.timeOptionLabelActive,
//                             ]}
//                           >
//                             {item}
//                           </Text>
//                         </TouchableOpacity>
//                       );
//                     }}
//                   />
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* Save button */}
//           <TouchableOpacity
//             style={[styles.primaryButton, (isSaveDisabled || isSaving) && { opacity: 0.6 }]}
//             onPress={handleSave}
//             disabled={isSaveDisabled}
//           >
//             <Text style={styles.primaryButtonText}>
//               {isSaving ? "Saving..." : hasConfiguredHours ? "Update timings" : "Save timings"}
//             </Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// };

// export default OperatingHoursTab;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 20,
//   },
//   loaderContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     paddingVertical: 20,
//   },
//   loaderText: {
//     color: COLORS.textSecondary ?? "#6B7280",
//   },
//   formRow: {
//     flexDirection: "row",
//     gap: 16,
//     marginBottom: 20,
//   },
//   formField: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 12,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 6,
//   },
//   selector: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     backgroundColor: "#F9FAFB",
//   },
//   selectorText: {
//     color: "#111827",
//     fontWeight: "500",
//   },
//   primaryButton: {
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//   },
//   primaryButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   dropdownBox: {
//     maxHeight: 200,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     marginTop: 4,
//   },
//   timeOption: {
//     height: 44,
//     borderBottomWidth: 1,
//     borderColor: "#E5E7EB",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   timeOptionActive: {
//     backgroundColor: "rgba(67, 97, 238, 0.1)",
//   },
//   timeOptionLabel: {
//     fontSize: 15,
//     color: "#111827",
//   },
//   timeOptionLabelActive: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
// });


// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../../app/store";
// import { COLORS } from "../../../../../colors";
// import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { useMutation } from "@tanstack/react-query";
// import { request } from "../../../../../services/axios.service";
// import { apiUrls } from "../../../../../apis/urls";

// type TOperatingHours = {
//   openingTime: string;
//   closingTime: string;
// };

// const DEFAULT_HOURS: TOperatingHours = {
//   openingTime: "00:00",
//   closingTime: "00:00",
// };

// const buildTimeSlots = () => {
//   const slots: string[] = [];
//   for (let hour = 0; hour < 24; hour += 1) {
//     for (let minute = 0; minute < 60; minute += 15) {
//       const formattedHour = hour.toString().padStart(2, "0");
//       const formattedMinute = minute.toString().padStart(2, "0");
//       slots.push(`${formattedHour}:${formattedMinute}`);
//     }
//   }
//   slots.push("24:00");
//   return slots;
// };

// const OperatingHoursTab = () => {

//   const { selectedOrganization } = useSelector((state: RootState) => state.auth);

//   const { data, isLoading: isFetching, refetch } = useGetClassroomListQuery();

//   const derivedHours = useMemo<TOperatingHours & { hasServerValue: boolean }>(() => {
//     const openingFromApi =
//       data?.data?.openingTime ??
//       data?.data?.operatingHours?.openingTime ??
//       data?.data?.instituteOperatingHours?.openingTime;
//     const closingFromApi =
//       data?.data?.closingTime ??
//       data?.data?.operatingHours?.closingTime ??
//       data?.data?.instituteOperatingHours?.closingTime;

//     if (typeof openingFromApi === "string" || typeof closingFromApi === "string") {
//       return {
//         openingTime: openingFromApi ?? "00:00",
//         closingTime: closingFromApi ?? "00:00",
//         hasServerValue: true,
//       };
//     }

//     return { ...DEFAULT_HOURS, hasServerValue: false };
//   }, [data]);

//   const [openingTime, setOpeningTime] = useState(DEFAULT_HOURS.openingTime);
//   const [closingTime, setClosingTime] = useState(DEFAULT_HOURS.closingTime);
//   const [initialHours, setInitialHours] = useState(DEFAULT_HOURS);

//   const [showOpeningDropdown, setShowOpeningDropdown] = useState(false);
//   const [showClosingDropdown, setShowClosingDropdown] = useState(false);

//   const timeSlots = useMemo(() => buildTimeSlots(), []);

//   useEffect(() => {
//     if (derivedHours.hasServerValue) {
//       setOpeningTime(derivedHours.openingTime);
//       setClosingTime(derivedHours.closingTime);
//       setInitialHours({
//         openingTime: derivedHours.openingTime,
//         closingTime: derivedHours.closingTime,
//       });
//     }
//   }, [derivedHours]);

//   const createOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) throw new Error("No organization selected");

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.CREATE_CLASSROOM,
//         data: {
//           customerId: selectedOrganization.customerId,
//           organizationId: selectedOrganization.organizationId,
//           openingTime: payload.openingTime,
//           closingTime: payload.closingTime,
//         },
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const updateOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) throw new Error("No organization selected");

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.UPDATE_CLASSROOM,
//         data: {
//           customerId: selectedOrganization.customerId,
//           organizationId: selectedOrganization.organizationId,
//           openingTime: payload.openingTime,
//           closingTime: payload.closingTime,
//         },
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const isSaving = createOperatingHours.isPending || updateOperatingHours.isPending;

//   // ✨ detect change
//   const hasChanges =
//     openingTime !== initialHours.openingTime ||
//     closingTime !== initialHours.closingTime;

//   const isSaveDisabled =
//     !hasChanges ||
//     !selectedOrganization ||
//     isSaving;

//   const handleSave = () => {
//     if (isSaveDisabled) return;

//     const payload = {
//       openingTime: openingTime.trim(),
//       closingTime: closingTime.trim(),
//     };

//     if (initialHours.openingTime !== "00:00" || initialHours.closingTime !== "00:00") {
//       updateOperatingHours.mutate(payload);
//     } else {
//       createOperatingHours.mutate(payload);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.sectionTitle}>Institute Operating Hours</Text>
//       <Text style={styles.sectionSubtitle}>
//         Set opening and closing time for your institute.
//       </Text>

//       {isFetching ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator color={COLORS.primary} />
//           <Text style={styles.loaderText}>Loading current timings...</Text>
//         </View>
//       ) : (
//         <>
//           <View style={styles.formRow}>
//             {/* Opening Time */}
//             <View style={styles.formField}>
//               <Text style={styles.label}>Opening time</Text>

//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => {
//                   setShowOpeningDropdown(!showOpeningDropdown);
//                   setShowClosingDropdown(false);
//                 }}
//               >
//                 <Text style={styles.selectorText}>{openingTime}</Text>
//               </TouchableOpacity>

//               {showOpeningDropdown && (
//                 <View style={styles.dropdownBox}>
//                   <FlatList
//                     data={timeSlots}
//                     keyExtractor={(item) => item}
//                     renderItem={({ item }) => {
//                       const isActive = openingTime === item;
//                       return (
//                         <TouchableOpacity
//                           style={[styles.timeOption, isActive && styles.timeOptionActive]}
//                           onPress={() => {
//                             setOpeningTime(item);
//                             setShowOpeningDropdown(false);
//                           }}
//                         >
//                           <Text
//                             style={[
//                               styles.timeOptionLabel,
//                               isActive && styles.timeOptionLabelActive,
//                             ]}
//                           >
//                             {item}
//                           </Text>
//                         </TouchableOpacity>
//                       );
//                     }}
//                   />
//                 </View>
//               )}
//             </View>

//             {/* Closing Time */}
//             <View style={styles.formField}>
//               <Text style={styles.label}>Closing time</Text>

//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => {
//                   setShowClosingDropdown(!showClosingDropdown);
//                   setShowOpeningDropdown(false);
//                 }}
//               >
//                 <Text style={styles.selectorText}>{closingTime}</Text>
//               </TouchableOpacity>

//               {showClosingDropdown && (
//                 <View style={styles.dropdownBox}>
//                   <FlatList
//                     data={timeSlots}
//                     keyExtractor={(item) => item}
//                     renderItem={({ item }) => {
//                       const isActive = closingTime === item;
//                       return (
//                         <TouchableOpacity
//                           style={[styles.timeOption, isActive && styles.timeOptionActive]}
//                           onPress={() => {
//                             setClosingTime(item);
//                             setShowClosingDropdown(false);
//                           }}
//                         >
//                           <Text
//                             style={[
//                               styles.timeOptionLabel,
//                               isActive && styles.timeOptionLabelActive,
//                             ]}
//                           >
//                             {item}
//                           </Text>
//                         </TouchableOpacity>
//                       );
//                     }}
//                   />
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* Save button */}
//           <TouchableOpacity
//             style={[
//               styles.primaryButton,
//               isSaveDisabled && { opacity: 0.6 },
//             ]}
//             onPress={handleSave}
//             disabled={isSaveDisabled}
//           >
//             <Text style={styles.primaryButtonText}>
//               {isSaving ? "Saving..." : initialHours.openingTime !== "00:00" ? "Update timings" : "Save timings"}
//             </Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// };

// export default OperatingHoursTab;

// // 🎨 STYLES ⭐
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 20,
//   },
//   loaderContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     paddingVertical: 20,
//   },
//   loaderText: {
//     color: COLORS.textSecondary ?? "#6B7280",
//   },
//   formRow: {
//     flexDirection: "row",
//     gap: 16,
//     marginBottom: 20,
//   },
//   formField: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 12,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 6,
//   },
//   selector: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     backgroundColor: "#F9FAFB",
//   },
//   selectorText: {
//     color: "#111827",
//     fontWeight: "500",
//   },
//   primaryButton: {
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//   },
//   primaryButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   dropdownBox: {
//     maxHeight: 200,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     marginTop: 4,
//   },
//   timeOption: {
//     height: 44,
//     borderBottomWidth: 1,
//     borderColor: "#E5E7EB",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   timeOptionActive: {
//     backgroundColor: "rgba(67, 97, 238, 0.1)",
//   },
//   timeOptionLabel: {
//     fontSize: 15,
//     color: "#111827",
//   },
//   timeOptionLabelActive: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
// });

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../../app/store";
// import { COLORS } from "../../../../../colors";
// import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { useMutation } from "@tanstack/react-query";
// import { request } from "../../../../../services/axios.service";
// import { apiUrls } from "../../../../../apis/urls";

// type TOperatingHours = {
//   openingTime: string;
//   closingTime: string;
// };

// const DEFAULT_HOURS: TOperatingHours = {
//   openingTime: "00:00",
//   closingTime: "00:00",
// };

// const buildTimeSlots = () => {
//   const slots: string[] = [];
//   for (let hour = 0; hour < 24; hour += 1) {
//     for (let minute = 0; minute < 60; minute += 15) {
//       const formattedHour = hour.toString().padStart(2, "0");
//       const formattedMinute = minute.toString().padStart(2, "0");
//       slots.push(`${formattedHour}:${formattedMinute}`);
//     }
//   }
//   slots.push("24:00");
//   return slots;
// };

// const OperatingHoursTab = () => {

//   const { selectedOrganization } = useSelector((state: RootState) => state.auth);

//   const { data, isLoading: isFetching, refetch } = useGetClassroomListQuery();

//   const derivedHours = useMemo<TOperatingHours & { hasServerValue: boolean }>(() => {
//     const openingFromApi =
//       data?.data?.openingTime ??
//       data?.data?.operatingHours?.openingTime ??
//       data?.data?.instituteOperatingHours?.openingTime;
//     const closingFromApi =
//       data?.data?.closingTime ??
//       data?.data?.operatingHours?.closingTime ??
//       data?.data?.instituteOperatingHours?.closingTime;

//     if (typeof openingFromApi === "string" || typeof closingFromApi === "string") {
//       return {
//         openingTime: openingFromApi ?? "00:00",
//         closingTime: closingFromApi ?? "00:00",
//         hasServerValue: true,
//       };
//     }

//     return { ...DEFAULT_HOURS, hasServerValue: false };
//   }, [data]);

//   const [openingTime, setOpeningTime] = useState(DEFAULT_HOURS.openingTime);
//   const [closingTime, setClosingTime] = useState(DEFAULT_HOURS.closingTime);
//   const [initialHours, setInitialHours] = useState(DEFAULT_HOURS);

//   const [showOpeningDropdown, setShowOpeningDropdown] = useState(false);
//   const [showClosingDropdown, setShowClosingDropdown] = useState(false);

//   const timeSlots = useMemo(() => buildTimeSlots(), []);

//   useEffect(() => {
//     if (derivedHours.hasServerValue) {
//       setOpeningTime(derivedHours.openingTime);
//       setClosingTime(derivedHours.closingTime);
//       setInitialHours({
//         openingTime: derivedHours.openingTime,
//         closingTime: derivedHours.closingTime,
//       });
//     }
//   }, [derivedHours]);

//   const createOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) throw new Error("No organization selected");

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.CREATE_CLASSROOM,
//         data: {
//           customerId: selectedOrganization.customerId,
//           organizationId: selectedOrganization.organizationId,
//           openingTime: payload.openingTime,
//           closingTime: payload.closingTime,
//         },
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const updateOperatingHours = useMutation({
//     mutationFn: async (payload: TOperatingHours) => {
//       if (!selectedOrganization) throw new Error("No organization selected");

//       return request({
//         method: "POST",
//         url: apiUrls.classroom.UPDATE_CLASSROOM,
//         data: {
//           customerId: selectedOrganization.customerId,
//           organizationId: selectedOrganization.organizationId,
//           openingTime: payload.openingTime,
//           closingTime: payload.closingTime,
//         },
//       });
//     },
//     onSuccess: (_, variables) => {
//       setInitialHours(variables);
//       refetch();
//     },
//   });

//   const isSaving = createOperatingHours.isPending || updateOperatingHours.isPending;

//   // ✨ detect change
//   const hasChanges =
//     openingTime !== initialHours.openingTime ||
//     closingTime !== initialHours.closingTime;

//   const isSaveDisabled =
//     !hasChanges ||
//     !selectedOrganization ||
//     isSaving;

//   const handleSave = () => {
//     if (isSaveDisabled) return;

//     const payload = {
//       openingTime: openingTime.trim(),
//       closingTime: closingTime.trim(),
//     };

//     if (initialHours.openingTime !== "00:00" || initialHours.closingTime !== "00:00") {
//       updateOperatingHours.mutate(payload);
//     } else {
//       createOperatingHours.mutate(payload);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.sectionTitle}>Institute Operating Hours</Text>
//       <Text style={styles.sectionSubtitle}>
//         Set opening and closing time for your institute.
//       </Text>

//       {isFetching ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator color={COLORS.primary} />
//           <Text style={styles.loaderText}>Loading current timings...</Text>
//         </View>
//       ) : (
//         <>
//           <View style={styles.formRow}>
//             {/* Opening Time */}
//             <View style={styles.formField}>
//               <Text style={styles.label}>Opening time</Text>

//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => {
//                   setShowOpeningDropdown(!showOpeningDropdown);
//                   setShowClosingDropdown(false);
//                 }}
//               >
//                 <Text style={styles.selectorText}>{openingTime}</Text>
//               </TouchableOpacity>

//               {showOpeningDropdown && (
//                 <View style={styles.dropdownBox}>
//                   <FlatList
//                     data={timeSlots}
//                     keyExtractor={(item) => item}
//                     renderItem={({ item }) => {
//                       const isActive = openingTime === item;
//                       return (
//                         <TouchableOpacity
//                           style={[styles.timeOption, isActive && styles.timeOptionActive]}
//                           onPress={() => {
//                             setOpeningTime(item);
//                             setShowOpeningDropdown(false);
//                           }}
//                         >
//                           <Text
//                             style={[
//                               styles.timeOptionLabel,
//                               isActive && styles.timeOptionLabelActive,
//                             ]}
//                           >
//                             {item}
//                           </Text>
//                         </TouchableOpacity>
//                       );
//                     }}
//                   />
//                 </View>
//               )}
//             </View>

//             {/* Closing Time */}
//             <View style={styles.formField}>
//               <Text style={styles.label}>Closing time</Text>

//               <TouchableOpacity
//                 style={styles.selector}
//                 onPress={() => {
//                   setShowClosingDropdown(!showClosingDropdown);
//                   setShowOpeningDropdown(false);
//                 }}
//               >
//                 <Text style={styles.selectorText}>{closingTime}</Text>
//               </TouchableOpacity>

//               {showClosingDropdown && (
//                 <View style={styles.dropdownBox}>
//                   <FlatList
//                     data={timeSlots}
//                     keyExtractor={(item) => item}
//                     renderItem={({ item }) => {
//                       const isActive = closingTime === item;
//                       return (
//                         <TouchableOpacity
//                           style={[styles.timeOption, isActive && styles.timeOptionActive]}
//                           onPress={() => {
//                             setClosingTime(item);
//                             setShowClosingDropdown(false);
//                           }}
//                         >
//                           <Text
//                             style={[
//                               styles.timeOptionLabel,
//                               isActive && styles.timeOptionLabelActive,
//                             ]}
//                           >
//                             {item}
//                           </Text>
//                         </TouchableOpacity>
//                       );
//                     }}
//                   />
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* Save button */}
//           <TouchableOpacity
//             style={[
//               styles.primaryButton,
//               isSaveDisabled && { opacity: 0.6 },
//             ]}
//             onPress={handleSave}
//             disabled={isSaveDisabled}
//           >
//             <Text style={styles.primaryButtonText}>
//               {isSaving ? "Saving..." : initialHours.openingTime !== "00:00" ? "Update timings" : "Save timings"}
//             </Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// };

// export default OperatingHoursTab;

// // 🎨 STYLES ⭐
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 20,
//   },
//   loaderContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     paddingVertical: 20,
//   },
//   loaderText: {
//     color: COLORS.textSecondary ?? "#6B7280",
//   },
//   formRow: {
//     flexDirection: "row",
//     gap: 16,
//     marginBottom: 20,
//   },
//   formField: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 12,
//     color: COLORS.textSecondary ?? "#6B7280",
//     marginBottom: 6,
//   },
//   selector: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     backgroundColor: "#F9FAFB",
//   },
//   selectorText: {
//     color: "#111827",
//     fontWeight: "500",
//   },
//   primaryButton: {
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//   },
//   primaryButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   dropdownBox: {
//     maxHeight: 200,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     marginTop: 4,
//   },
//   timeOption: {
//     height: 44,
//     borderBottomWidth: 1,
//     borderColor: "#E5E7EB",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   timeOptionActive: {
//     backgroundColor: "rgba(67, 97, 238, 0.1)",
//   },
//   timeOptionLabel: {
//     fontSize: 15,
//     color: "#111827",
//   },
//   timeOptionLabelActive: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
// });

import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../app/store";
import { COLORS } from "../../../../../colors";
import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../../services/axios.service";
import { apiUrls } from "../../../../../apis/urls";

type TOperatingHours = {
  openingTime: string;
  closingTime: string;
};

const DEFAULT_HOURS: TOperatingHours = {
  openingTime: "00:00",
  closingTime: "00:00",
};

const buildTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      slots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  slots.push("24:00");
  return slots;
};

const OperatingHoursTab = () => {

  const { selectedOrganization } = useSelector((state: RootState) => state.auth);

  const { data, isLoading: isFetching, refetch } = useGetClassroomListQuery();

  const derivedHours = useMemo<TOperatingHours & { hasServerValue: boolean }>(() => {
    const openingFromApi =
      data?.data?.openingTime ??
      data?.data?.operatingHours?.openingTime ??
      data?.data?.instituteOperatingHours?.openingTime;
    const closingFromApi =
      data?.data?.closingTime ??
      data?.data?.operatingHours?.closingTime ??
      data?.data?.instituteOperatingHours?.closingTime;

    if (typeof openingFromApi === "string" || typeof closingFromApi === "string") {
      return {
        openingTime: openingFromApi ?? "00:00",
        closingTime: closingFromApi ?? "00:00",
        hasServerValue: true,
      };
    }

    return { ...DEFAULT_HOURS, hasServerValue: false };
  }, [data]);

  const [openingTime, setOpeningTime] = useState(DEFAULT_HOURS.openingTime);
  const [closingTime, setClosingTime] = useState(DEFAULT_HOURS.closingTime);
  const [initialHours, setInitialHours] = useState(DEFAULT_HOURS);
  const [closingTimeError, setClosingTimeError] = useState("");

  const [showOpeningDropdown, setShowOpeningDropdown] = useState(false);
  const [showClosingDropdown, setShowClosingDropdown] = useState(false);

  const timeSlots = useMemo(() => buildTimeSlots(), []);

  // Convert time string (HH:MM) to minutes for comparison
  const timeToMinutes = (time: string): number => {
    if (time === "24:00") return 24 * 60;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Validate that closing time is after opening time
  const isTimeValid = useMemo(() => {
    if (!openingTime || !closingTime) {
      return true;
    }

    const openingMinutes = timeToMinutes(openingTime);
    const closingMinutes = timeToMinutes(closingTime);

    return closingMinutes > openingMinutes;
  }, [openingTime, closingTime]);

  useEffect(() => {
    if (derivedHours.hasServerValue) {
      setOpeningTime(derivedHours.openingTime);
      setClosingTime(derivedHours.closingTime);
      setInitialHours({
        openingTime: derivedHours.openingTime,
        closingTime: derivedHours.closingTime,
      });
      setClosingTimeError("");
    }
  }, [derivedHours]);

  // Set error message when validation fails
  useEffect(() => {
    if (!openingTime || !closingTime) {
      setClosingTimeError("");
      return;
    }

    if (!isTimeValid) {
      setClosingTimeError("Closing time must be after opening time");
    } else {
      setClosingTimeError("");
    }
  }, [isTimeValid, openingTime, closingTime]);

  const createOperatingHours = useMutation({
    mutationFn: async (payload: TOperatingHours) => {
      if (!selectedOrganization) throw new Error("No organization selected");

      return request({
        method: "POST",
        url: apiUrls.classroom.CREATE_CLASSROOM,
        data: {
          customerId: selectedOrganization.customerId,
          organizationId: selectedOrganization.organizationId,
          openingTime: payload.openingTime,
          closingTime: payload.closingTime,
        },
      });
    },
    onSuccess: (_, variables) => {
      setInitialHours(variables);
      refetch();
    },
  });

  const updateOperatingHours = useMutation({
    mutationFn: async (payload: TOperatingHours) => {
      if (!selectedOrganization) throw new Error("No organization selected");

      return request({
        method: "POST",
        url: apiUrls.classroom.UPDATE_CLASSROOM,
        data: {
          customerId: selectedOrganization.customerId,
          organizationId: selectedOrganization.organizationId,
          openingTime: payload.openingTime,
          closingTime: payload.closingTime,
        },
      });
    },
    onSuccess: (_, variables) => {
      setInitialHours(variables);
      refetch();
    },
  });

  const isSaving = createOperatingHours.isPending || updateOperatingHours.isPending;

  // ✨ detect change
  const hasChanges =
    openingTime !== initialHours.openingTime ||
    closingTime !== initialHours.closingTime;

  const isSaveDisabled =
    !hasChanges ||
    !selectedOrganization ||
    isSaving ||
    !isTimeValid;

  const handleSave = () => {
    if (isSaveDisabled) return;

    const payload = {
      openingTime: openingTime.trim(),
      closingTime: closingTime.trim(),
    };

    if (initialHours.openingTime !== "00:00" || initialHours.closingTime !== "00:00") {
      updateOperatingHours.mutate(payload);
    } else {
      createOperatingHours.mutate(payload);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Institute Operating Hours</Text>
      <Text style={styles.sectionSubtitle}>
        Set opening and closing time for your institute.
      </Text>

      {isFetching ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={styles.loaderText}>Loading current timings...</Text>
        </View>
      ) : (
        <>
          <View style={styles.formRow}>
            {/* Opening Time */}
            <View style={styles.formField}>
              <Text style={styles.label}>Opening time</Text>

              <TouchableOpacity
                style={styles.selector}
                onPress={() => {
                  setShowOpeningDropdown(!showOpeningDropdown);
                  setShowClosingDropdown(false);
                }}
              >
                <Text style={styles.selectorText}>{openingTime}</Text>
              </TouchableOpacity>

              {showOpeningDropdown && (
                <View style={styles.dropdownBox}>
                  <FlatList
                    data={timeSlots}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => {
                      const isActive = openingTime === item;
                      return (
                        <TouchableOpacity
                          style={[styles.timeOption, isActive && styles.timeOptionActive]}
                          onPress={() => {
                            setOpeningTime(item);
                            setShowOpeningDropdown(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.timeOptionLabel,
                              isActive && styles.timeOptionLabelActive,
                            ]}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              )}
            </View>

            {/* Closing Time */}
            <View style={styles.formField}>
              <Text style={styles.label}>Closing time</Text>

              <TouchableOpacity
                style={[
                  styles.selector,
                  closingTimeError ? styles.selectorError : null
                ]}
                onPress={() => {
                  setShowClosingDropdown(!showClosingDropdown);
                  setShowOpeningDropdown(false);
                }}
              >
                <Text style={styles.selectorText}>{closingTime}</Text>
              </TouchableOpacity>

              {closingTimeError ? (
                <Text style={styles.errorText}>{closingTimeError}</Text>
              ) : null}

              {showClosingDropdown && (
                <View style={styles.dropdownBox}>
                  <FlatList
                    data={timeSlots}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => {
                      const isActive = closingTime === item;
                      return (
                        <TouchableOpacity
                          style={[styles.timeOption, isActive && styles.timeOptionActive]}
                          onPress={() => {
                            setClosingTime(item);
                            setShowClosingDropdown(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.timeOptionLabel,
                              isActive && styles.timeOptionLabelActive,
                            ]}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              )}
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              isSaveDisabled && { opacity: 0.6 },
            ]}
            onPress={handleSave}
            disabled={isSaveDisabled}
          >
            <Text style={styles.primaryButtonText}>
              {isSaving ? "Saving..." : initialHours.openingTime !== "00:00" ? "Update timings" : "Save timings"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default OperatingHoursTab;

// 🎨 STYLES ⭐
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary ?? "#6B7280",
    marginBottom: 20,
  },
  loaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 20,
  },
  loaderText: {
    color: COLORS.textSecondary ?? "#6B7280",
  },
  formRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  formField: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary ?? "#6B7280",
    marginBottom: 6,
  },
  selector: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#F9FAFB",
  },
  selectorError: {
    borderColor: "#EF4444",
  },
  selectorText: {
    color: "#111827",
    fontWeight: "500",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  primaryButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  dropdownBox: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 4,
  },
  timeOption: {
    height: 44,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  timeOptionActive: {
    backgroundColor: "rgba(67, 97, 238, 0.1)",
  },
  timeOptionLabel: {
    fontSize: 15,
    color: "#111827",
  },
  timeOptionLabelActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});

