// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   FlatList,
//   ActivityIndicator,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../../app/store";
// import { COLORS } from "../../../../../colors";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { useCreateClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useCreateClassroom.mutation";
// import { useUpdateClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useUpdateClassroom.mutation";
// import { useDeleteClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useDeleteClassroom.mutation";
// import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { IMAGES } from "../../../../../images";
// import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";


// const ClassroomsTab = () => {
//   const [isCreateModalVisible, setCreateModalVisible] = useState(false);
//   const [classRoomName, setClassRoomName] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [location, setLocation] = useState("");

//   const [isEditModalVisible, setEditModalVisible] = useState(false);
//   const [editingClassroom, setEditingClassroom] = useState<any>(null);

//   const [showDeleteAlert, setShowDeleteAlert] = useState(false);
//   const [deletingClassroomId, setDeletingClassroomId] = useState<string | null>(null);

//   const { selectedOrganization } = useSelector((state: RootState) => state.auth);

//   const { data, isLoading, refetch } = useGetClassroomListQuery();

//   const createClassroom = useCreateClassroomMutation();
//   const updateClassroom = useUpdateClassroomMutation();
//   const deleteClassroom = useDeleteClassroomMutation();

//   const classrooms = useMemo(() => {
//     if (data?.data?.classRooms && Array.isArray(data.data.classRooms)) {
//       return [...data.data.classRooms].sort(
//         (a: any, b: any) => (b?.dateCreated ?? 0) - (a?.dateCreated ?? 0)
//       );
//     }
//     return [];
//   }, [data]);

//   const resetForm = () => {
//     setClassRoomName("");
//     setCapacity("");
//     setLocation("");
//   };

//   const closeCreateModal = () => {
//     setCreateModalVisible(false);
//     resetForm();
//   };

//   const closeEditModal = () => {
//     setEditModalVisible(false);
//     setEditingClassroom(null);
//     resetForm();
//   };

//   const handleSubmit = () => {
//     if (!selectedOrganization) {
//       console.warn("No organization selected");
//       return;
//     }

//     if (!classRoomName.trim()) {
//       console.warn("Classroom name is required");
//       return;
//     }

//     const payload = {
//       classRoomName: classRoomName.trim(),
//       capacity: capacity ? Number(capacity) : "",
//       location: location ? location.trim() : "",
//       customerId: selectedOrganization.customerId,
//       organizationId: selectedOrganization.organizationId,
//     };

//     createClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         closeCreateModal();
//       },
//     });
//   };

//   const handleEdit = (item: any) => {
//     setEditingClassroom(item);
//     setClassRoomName(item.classRoomName ?? "");
//     setCapacity(item.capacity?.toString() ?? "");
//     setLocation(item.location ?? "");
//     setEditModalVisible(true);
//   };

//   const handleUpdate = () => {
//     if (!selectedOrganization || !editingClassroom) {
//       console.warn("Missing organization or classroom");
//       return;
//     }

//     if (!classRoomName.trim()) {
//       console.warn("Classroom name is required");
//       return;
//     }

//     const payload = {
//       classRoomId: editingClassroom.classRoomId,
//       classRoomName: classRoomName.trim(),
//       capacity: capacity ? Number(capacity) : "",
//       location: location ? location.trim() : "",
//     };

//     updateClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         closeEditModal();
//       },
//     });
//   };

//   const handleDelete = (item: any) => {
//     setDeletingClassroomId(item.classRoomId);
//     setShowDeleteAlert(true);
//   };

//   const confirmDelete = () => {
//     if (!selectedOrganization || !deletingClassroomId) {
//       console.warn("Missing organization or classroom id");
//       return;
//     }

//     const payload = {
//       classRoomId: deletingClassroomId,
//     };

//     deleteClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         setShowDeleteAlert(false);
//         setDeletingClassroomId(null);
//       },
//     });
//   };

//   const renderClassroom = ({ item }: { item: any }) => (
//     <View style={styles.listItem}>
//       <View style={styles.listItemContent}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.listTitle}>{item.classRoomName ?? "—"}</Text>
//           <Text style={styles.listSubtitle}>
//             Capacity: {item.capacity ?? "-"} • {item.location ?? "—"}
//           </Text>
//         </View>

//         <View style={styles.actionButtons}>
//           <TouchableOpacity
//             onPress={() => handleEdit(item)}
//             style={styles.iconButton}
//           >
//             <AutoHeightImage source={IMAGES.editIcon} width={20} />
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => handleDelete(item)}
//             style={styles.iconButton}
//           >
//             <AutoHeightImage source={IMAGES.deleteIcon} width={20} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerRow}>
//         <Text style={styles.sectionTitle}>Classroom Management</Text>

//         <TouchableOpacity
//           style={styles.primaryButton}
//           onPress={() => {
//             resetForm();
//             setCreateModalVisible(true);
//           }}
//         >
//           <Text style={styles.primaryButtonText}>+ Add Classroom</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.listContainer}>
//         {isLoading ? (
//           <ActivityIndicator color={COLORS.primary} />
//         ) : classrooms.length === 0 ? (
//           <Text style={styles.placeholderText}>No classrooms yet</Text>
//         ) : (
//           <FlatList
//             data={classrooms}
//             keyExtractor={(item, index) =>
//               item?.classRoomId ?? item?.id ?? index.toString()
//             }
//             ItemSeparatorComponent={() => <View style={styles.separator} />}
//             renderItem={renderClassroom}
//           />
//         )}
//       </View>

//       {/* Create Modal */}
//       <Modal visible={isCreateModalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalSheet}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={closeCreateModal}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
//             </TouchableOpacity>

//             <Text style={styles.modalTitle}>Add New Classroom</Text>

//             <TextInput
//               style={styles.input}
//               placeholder="Classroom name *"
//               value={classRoomName}
//               onChangeText={setClassRoomName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Capacity"
//               keyboardType="numeric"
//               value={capacity}
//               onChangeText={setCapacity}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Location"
//               value={location}
//               onChangeText={setLocation}
//             />

//             <View style={styles.buttonsRow}>
//               <TouchableOpacity style={styles.cancelButton} onPress={closeCreateModal}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.addButton, createClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={handleSubmit}
//                 disabled={createClassroom.isPending}
//               >
//                 <Text style={styles.addButtonText}>
//                   {createClassroom.isPending ? "Saving..." : "Add Classroom"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Edit Modal */}
//       <Modal visible={isEditModalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalSheet}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={closeEditModal}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
//             </TouchableOpacity>

//             <Text style={styles.modalTitle}>Edit Classroom</Text>

//             <TextInput
//               style={styles.input}
//               placeholder="Classroom name *"
//               value={classRoomName}
//               onChangeText={setClassRoomName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Capacity"
//               keyboardType="numeric"
//               value={capacity}
//               onChangeText={setCapacity}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Location"
//               value={location}
//               onChangeText={setLocation}
//             />

//             <View style={styles.buttonsRow}>
//               <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.addButton, updateClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={handleUpdate}
//                 disabled={updateClassroom.isPending}
//               >
//                 <Text style={styles.addButtonText}>
//                   {updateClassroom.isPending ? "Updating..." : "Update Classroom"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Delete Confirmation */}
//       <Modal visible={showDeleteAlert} transparent animationType="fade">
//         <View style={styles.deleteDialogOverlay}>
//           <View style={styles.deleteDialogContainer}>
//             <TouchableOpacity
//               style={styles.deleteCloseButton}
//               onPress={() => {
//                 setShowDeleteAlert(false);
//                 setDeletingClassroomId(null);
//               }}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={20} />
//             </TouchableOpacity>

//             <View style={styles.warningIconContainer}>
//               <View style={styles.warningIconCircle}>
//               <AutoHeightImage source={IMAGES.deleteIcon} width={30} />
            
//               </View>
//             </View>

//             <Text style={styles.deleteTitle}>Are you sure?</Text>
//             <Text style={styles.deleteMessage}>
//               Deleting this classroom will also remove all slots assigned to it from the timetable.
//               This action cannot be undone.
//             </Text>

//             <View style={styles.deleteButtonsRow}>
//               <TouchableOpacity
//                 style={styles.deleteCancelButton}
//                 onPress={() => {
//                   setShowDeleteAlert(false);
//                   setDeletingClassroomId(null);
//                 }}
//               >
//                 <Text style={styles.deleteCancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.deleteConfirmButton, deleteClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={confirmDelete}
//                 disabled={deleteClassroom.isPending}
//               >
//                 <Text style={styles.deleteConfirmText}>
//                   {deleteClassroom.isPending ? "Deleting..." : "Delete"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default ClassroomsTab;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//   },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   primaryButton: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 8,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   primaryButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   listContainer: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     padding: 12,
//   },
//   placeholderText: {
//     color: "#6B7280",
//   },
//   listItem: {
//     paddingVertical: 12,
//   },
//   listItemContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   listTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   listSubtitle: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 4,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: "#E5E7EB",
//   },
//   actionButtons: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   iconButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: COLORS.white,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   modalSheet: {
//     width: "75%",
//     height: "100%",
//     backgroundColor: COLORS.white,
//     padding: 20,
//     position: "relative",
//   },
//   closeButton: {
//     position: "absolute",
//     top: 20,
//     right: 20,
//     zIndex: 1,
//     padding: 5,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 16,
//     marginTop: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
//   buttonsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 12,
//   },
//   cancelButton: {
//     width: "48%",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//   },
//   cancelText: {
//     color: "#6B7280",
//     fontWeight: "500",
//   },
//   addButton: {
//     width: "48%",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//   },
//   addButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   deleteDialogOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   deleteDialogContainer: {
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 20,
//     margin: 20,
//     width: "85%",
//     position: "relative",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   deleteCloseButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     zIndex: 1,
//     padding: 5,
//   },
//   warningIconContainer: {
//     alignItems: "center",
//     marginTop: 10,
//     marginBottom: 16,
//   },
//   warningIconCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#FFF7ED",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   deleteTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#111827",
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   deleteMessage: {
//     fontSize: 14,
//     color: "#6B7280",
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   deleteButtonsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   deleteCancelButton: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.white,
//   },
//   deleteCancelText: {
//     color: "#3B82F6",
//     fontWeight: "500",
//     fontSize: 14,
//   },
//   deleteConfirmButton: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//   },
//   deleteConfirmText: {
//     color: COLORS.white,
//     fontWeight: "600",
//     fontSize: 14,
//   },
// });

// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   FlatList,
//   ActivityIndicator,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../../app/store";
// import { COLORS } from "../../../../../colors";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { useCreateClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useCreateClassroom.mutation";
// import { useUpdateClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useUpdateClassroom.mutation";
// import { useDeleteClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useDeleteClassroom.mutation";
// import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { IMAGES } from "../../../../../images";
// import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";


// const ClassroomsTab = () => {
//   const [isCreateModalVisible, setCreateModalVisible] = useState(false);
//   const [classRoomName, setClassRoomName] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [location, setLocation] = useState("");

//   const [isEditModalVisible, setEditModalVisible] = useState(false);
//   const [editingClassroom, setEditingClassroom] = useState<any>(null);

//   const [showDeleteAlert, setShowDeleteAlert] = useState(false);
//   const [deletingClassroomId, setDeletingClassroomId] = useState<string | null>(null);

//   const { selectedOrganization } = useSelector((state: RootState) => state.auth);

//   const { data, isLoading, refetch } = useGetClassroomListQuery();

//   const createClassroom = useCreateClassroomMutation();
//   const updateClassroom = useUpdateClassroomMutation();
//   const deleteClassroom = useDeleteClassroomMutation();

//   const classrooms = useMemo(() => {
//     if (data?.data?.classRooms && Array.isArray(data.data.classRooms)) {
//       return [...data.data.classRooms].sort(
//         (a: any, b: any) => (b?.dateCreated ?? 0) - (a?.dateCreated ?? 0)
//       );
//     }
//     return [];
//   }, [data]);

//   const resetForm = () => {
//     setClassRoomName("");
//     setCapacity("");
//     setLocation("");
//   };

//   const closeCreateModal = () => {
//     setCreateModalVisible(false);
//     resetForm();
//   };

//   const closeEditModal = () => {
//     setEditModalVisible(false);
//     setEditingClassroom(null);
//     resetForm();
//   };

//   const handleSubmit = () => {
//     if (!selectedOrganization) {
//       console.warn("No organization selected");
//       return;
//     }

//     if (!classRoomName.trim()) {
//       console.warn("Classroom name is required");
//       return;
//     }

//     const payload = {
//       classRoomName: classRoomName.trim(),
//       capacity: capacity ? Number(capacity) : "",
//       location: location ? location.trim() : "",
//       customerId: selectedOrganization.customerId,
//       organizationId: selectedOrganization.organizationId,
//     };

//     createClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         closeCreateModal();
//       },
//     });
//   };

//   const handleEdit = (item: any) => {
//     setEditingClassroom(item);
//     setClassRoomName(item.classRoomName ?? "");
//     setCapacity(item.capacity?.toString() ?? "");
//     setLocation(item.location ?? "");
//     setEditModalVisible(true);
//   };

//   const handleUpdate = () => {
//     if (!selectedOrganization || !editingClassroom) {
//       console.warn("Missing organization or classroom");
//       return;
//     }

//     if (!classRoomName.trim()) {
//       console.warn("Classroom name is required");
//       return;
//     }

//     const payload = {
//       classRoomId: editingClassroom.classRoomId,
//       classRoomName: classRoomName.trim(),
//       capacity: capacity ? Number(capacity) : "",
//       location: location ? location.trim() : "",
//     };

//     updateClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         closeEditModal();
//       },
//     });
//   };

//   const handleDelete = (item: any) => {
//     setDeletingClassroomId(item.classRoomId);
//     setShowDeleteAlert(true);
//   };

//   const confirmDelete = () => {
//     if (!selectedOrganization || !deletingClassroomId) {
//       console.warn("Missing organization or classroom id");
//       return;
//     }

//     const payload = {
//       classRoomId: deletingClassroomId,
//     };

//     deleteClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         setShowDeleteAlert(false);
//         setDeletingClassroomId(null);
//       },
//     });
//   };

//   const renderClassroom = ({ item }: { item: any }) => (
//     <View style={styles.listItem}>
//       <View style={styles.listItemContent}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.listTitle}>{item.classRoomName ?? "—"}</Text>
//           <Text style={styles.listSubtitle}>
//             Capacity: {item.capacity ?? "-"} • {item.location ?? "—"}
//           </Text>
//         </View>

//         <View style={styles.actionButtons}>
//           <TouchableOpacity
//             onPress={() => handleEdit(item)}
//             style={styles.iconButton}
//           >
//             <AutoHeightImage source={IMAGES.editIcon} width={20} />
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => handleDelete(item)}
//             style={styles.iconButton}
//           >
//             <AutoHeightImage source={IMAGES.deleteIcon} width={20} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerRow}>
//         <Text style={styles.sectionTitle}>Classroom Management</Text>

//         <TouchableOpacity
//           style={styles.primaryButton}
//           onPress={() => {
//             resetForm();
//             setCreateModalVisible(true);
//           }}
//         >
//           <Text style={styles.primaryButtonText}>Add Classroom</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.listContainer}>
//         {isLoading ? (
//           <ActivityIndicator color={COLORS.primary} />
//         ) : classrooms.length === 0 ? (
//           <Text style={styles.placeholderText}>                         No Data Found</Text>
//         ) : (
//           <FlatList
//             data={classrooms}
//             keyExtractor={(item, index) =>
//               item?.classRoomId ?? item?.id ?? index.toString()
//             }
//             ItemSeparatorComponent={() => <View style={styles.separator} />}
//             renderItem={renderClassroom}
//           />
//         )}
//       </View>

//       {/* Create Modal */}
//       <Modal visible={isCreateModalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalSheet}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={closeCreateModal}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
//             </TouchableOpacity>

//             <Text style={styles.modalTitle}>Add New Classroom</Text>

//             <TextInput
//               style={styles.input}
//               placeholder="Classroom name *"
//               value={classRoomName}
//               onChangeText={setClassRoomName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Capacity"
//               keyboardType="numeric"
//               value={capacity}
//               onChangeText={setCapacity}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Location"
//               value={location}
//               onChangeText={setLocation}
//             />

//             <View style={styles.buttonsRow}>
//               <TouchableOpacity style={styles.cancelButton} onPress={closeCreateModal}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.addButton, createClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={handleSubmit}
//                 disabled={createClassroom.isPending}
//               >
//                 <Text style={styles.addButtonText}>
//                   {createClassroom.isPending ? "Saving..." : "Add Classroom"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Edit Modal */}
//       <Modal visible={isEditModalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalSheet}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={closeEditModal}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
//             </TouchableOpacity>

//             <Text style={styles.modalTitle}>Edit Classroom</Text>

//             <TextInput
//               style={styles.input}
//               placeholder="Classroom name *"
//               value={classRoomName}
//               onChangeText={setClassRoomName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Capacity"
//               keyboardType="numeric"
//               value={capacity}
//               onChangeText={setCapacity}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Location"
//               value={location}
//               onChangeText={setLocation}
//             />

//             <View style={styles.buttonsRow}>
//               <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.addButton, updateClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={handleUpdate}
//                 disabled={updateClassroom.isPending}
//               >
//                 <Text style={styles.addButtonText}>
//                   {updateClassroom.isPending ? "Updating..." : "Update Classroom"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Delete Confirmation */}
//       <Modal visible={showDeleteAlert} transparent animationType="fade">
//         <View style={styles.deleteDialogOverlay}>
//           <View style={styles.deleteDialogContainer}>
//             <TouchableOpacity
//               style={styles.deleteCloseButton}
//               onPress={() => {
//                 setShowDeleteAlert(false);
//                 setDeletingClassroomId(null);
//               }}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={20} />
//             </TouchableOpacity>

//             <View style={styles.warningIconContainer}>
//               <View style={styles.warningIconCircle}>
//               <AutoHeightImage source={IMAGES.deleteIcon} width={30} />
            
//               </View>
//             </View>

//             <Text style={styles.deleteTitle}>Are you sure?</Text>
//             <Text style={styles.deleteMessage}>
//               Deleting this classroom will also remove all slots assigned to it from the timetable.
//               This action cannot be undone.
//             </Text>

//             <View style={styles.deleteButtonsRow}>
//               <TouchableOpacity
//                 style={styles.deleteCancelButton}
//                 onPress={() => {
//                   setShowDeleteAlert(false);
//                   setDeletingClassroomId(null);
//                 }}
//               >
//                 <Text style={styles.deleteCancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.deleteConfirmButton, deleteClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={confirmDelete}
//                 disabled={deleteClassroom.isPending}
//               >
//                 <Text style={styles.deleteConfirmText}>
//                   {deleteClassroom.isPending ? "Deleting..." : "Delete"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default ClassroomsTab;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//   },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   primaryButton: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 8,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   primaryButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   listContainer: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     padding: 12,
//   },
//   placeholderText: {
//     color: "#6B7280",
//   },
//   listItem: {
//     paddingVertical: 12,
//   },
//   listItemContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   listTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   listSubtitle: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 4,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: "#E5E7EB",
//   },
//   actionButtons: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   iconButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: COLORS.white,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   modalSheet: {
//     width: "75%",
//     height: "100%",
//     backgroundColor: COLORS.white,
//     padding: 20,
//     position: "relative",
//   },
//   closeButton: {
//     position: "absolute",
//     top: 20,
//     right: 20,
//     zIndex: 1,
//     padding: 5,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 16,
//     marginTop: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
//   buttonsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 12,
//   },
//   cancelButton: {
//     width: "48%",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//   },
//   cancelText: {
//     color: "#6B7280",
//     fontWeight: "500",
//   },
//   addButton: {
//     width: "48%",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//   },
//   addButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   deleteDialogOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   deleteDialogContainer: {
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 20,
//     margin: 20,
//     width: "85%",
//     position: "relative",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   deleteCloseButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     zIndex: 1,
//     padding: 5,
//   },
//   warningIconContainer: {
//     alignItems: "center",
//     marginTop: 10,
//     marginBottom: 16,
//   },
//   warningIconCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#FFF7ED",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   deleteTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#111827",
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   deleteMessage: {
//     fontSize: 14,
//     color: "#6B7280",
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   deleteButtonsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   deleteCancelButton: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.white,
//   },
//   deleteCancelText: {
//     color: "#3B82F6",
//     fontWeight: "500",
//     fontSize: 14,
//   },
//   deleteConfirmButton: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//   },
//   deleteConfirmText: {
//     color: COLORS.white,
//     fontWeight: "600",
//     fontSize: 14,
//   },
// });






//  sahi he
// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   FlatList,
//   ActivityIndicator,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../../app/store";
// import { COLORS } from "../../../../../colors";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { useCreateClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useCreateClassroom.mutation";
// import { useUpdateClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useUpdateClassroom.mutation";
// import { useDeleteClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useDeleteClassroom.mutation";
// import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { IMAGES } from "../../../../../images";
// import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";


// const ClassroomsTab = () => {
//   const [isCreateModalVisible, setCreateModalVisible] = useState(false);
//   const [classRoomName, setClassRoomName] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [location, setLocation] = useState("");

//   const [isEditModalVisible, setEditModalVisible] = useState(false);
//   const [editingClassroom, setEditingClassroom] = useState<any>(null);

//   const [showDeleteAlert, setShowDeleteAlert] = useState(false);
//   const [deletingClassroomId, setDeletingClassroomId] = useState<string | null>(null);

//   const { selectedOrganization } = useSelector((state: RootState) => state.auth);

//   const { data, isLoading, refetch } = useGetClassroomListQuery();

//   const createClassroom = useCreateClassroomMutation();
//   const updateClassroom = useUpdateClassroomMutation();
//   const deleteClassroom = useDeleteClassroomMutation();

//   const classrooms = useMemo(() => {
//     if (data?.data?.classRooms && Array.isArray(data.data.classRooms)) {
//       return [...data.data.classRooms].sort(
//         (a: any, b: any) => (b?.dateCreated ?? 0) - (a?.dateCreated ?? 0)
//       );
//     }
//     return [];
//   }, [data]);

//   const resetForm = () => {
//     setClassRoomName("");
//     setCapacity("");
//     setLocation("");
//   };

//   const closeCreateModal = () => {
//     setCreateModalVisible(false);
//     resetForm();
//   };

//   const closeEditModal = () => {
//     setEditModalVisible(false);
//     setEditingClassroom(null);
//     resetForm();
//   };

//   const handleSubmit = () => {
//     if (!selectedOrganization) {
//       console.warn("No organization selected");
//       return;
//     }

//     if (!classRoomName.trim()) {
//       console.warn("Classroom name is required");
//       return;
//     }

//     const payload = {
//       classRoomName: classRoomName.trim(),
//       capacity: capacity ? Number(capacity) : "",
//       location: location ? location.trim() : "",
//       customerId: selectedOrganization.customerId,
//       organizationId: selectedOrganization.organizationId,
//     };

//     createClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         closeCreateModal();
//       },
//     });
//   };

//   const handleEdit = (item: any) => {
//     setEditingClassroom(item);
//     setClassRoomName(item.classRoomName ?? "");
//     setCapacity(item.capacity?.toString() ?? "");
//     setLocation(item.location ?? "");
//     setEditModalVisible(true);
//   };

//   const handleUpdate = () => {
//     if (!selectedOrganization || !editingClassroom) {
//       console.warn("Missing organization or classroom");
//       return;
//     }

//     if (!classRoomName.trim()) {
//       console.warn("Classroom name is required");
//       return;
//     }

//     const payload = {
//       classRoomId: editingClassroom.classRoomId,
//       classRoomName: classRoomName.trim(),
//       capacity: capacity ? Number(capacity) : "",
//       location: location ? location.trim() : "",
//     };

//     updateClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         closeEditModal();
//       },
//     });
//   };

//   const handleDelete = (item: any) => {
//     setDeletingClassroomId(item.classRoomId);
//     setShowDeleteAlert(true);
//   };

//   const confirmDelete = () => {
//     if (!selectedOrganization || !deletingClassroomId) {
//       console.warn("Missing organization or classroom id");
//       return;
//     }

//     const payload = {
//       classRoomId: deletingClassroomId,
//     };

//     deleteClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         setShowDeleteAlert(false);
//         setDeletingClassroomId(null);
//       },
//     });
//   };

//   const renderClassroom = ({ item }: { item: any }) => (
//     <View style={styles.listItem}>
//       <View style={styles.listItemContent}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.listTitle}>{item.classRoomName ?? "—"}</Text>
//           <Text style={styles.listSubtitle}>
//             Capacity: {item.capacity ?? "-"} • {item.location ?? "—"}
//           </Text>
//         </View>

//         <View style={styles.actionButtons}>
//           <TouchableOpacity
//             onPress={() => handleEdit(item)}
//             style={styles.iconButton}
//           >
//             <AutoHeightImage source={IMAGES.editIcon} width={20} />
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => handleDelete(item)}
//             style={styles.iconButton}
//           >
//             <AutoHeightImage source={IMAGES.deleteIcon} width={20} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerRow}>
//         <Text style={styles.sectionTitle}>Classroom Management</Text>

//         <TouchableOpacity
//           style={styles.primaryButton}
//           onPress={() => {
//             resetForm();
//             setCreateModalVisible(true);
//           }}
//         >
//           <Text style={styles.primaryButtonText}>Add Classroom</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.listContainer}>
//         {isLoading ? (
//           <ActivityIndicator color={COLORS.primary} />
//         ) : classrooms.length === 0 ? (
//           <Text style={styles.placeholderText}>                         No Data Found</Text>
//         ) : (
//           <FlatList
//             data={classrooms}
//             keyExtractor={(item, index) =>
//               item?.classRoomId ?? item?.id ?? index.toString()
//             }
//             ItemSeparatorComponent={() => <View style={styles.separator} />}
//             renderItem={renderClassroom}
//           />
//         )}
//       </View>

//       {/* Create Modal */}
//       <Modal visible={isCreateModalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalSheet}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={closeCreateModal}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
//             </TouchableOpacity>

//             <Text style={styles.modalTitle}>Add New Classroom</Text>

//             <TextInput
//               style={styles.input}
//               placeholder="Classroom name *"
//               value={classRoomName}
//               onChangeText={setClassRoomName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Capacity"
//               keyboardType="numeric"
//               value={capacity}
//               onChangeText={setCapacity}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Location"
//               value={location}
//               onChangeText={setLocation}
//             />

//             <View style={styles.buttonsRow}>
//               <TouchableOpacity style={styles.cancelButton} onPress={closeCreateModal}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.addButton, createClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={handleSubmit}
//                 disabled={createClassroom.isPending}
//               >
//                 <Text style={styles.addButtonText}>
//                   {createClassroom.isPending ? "Saving..." : "Add Classroom"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Edit Modal */}
//       <Modal visible={isEditModalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalSheet}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={closeEditModal}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
//             </TouchableOpacity>

//             <Text style={styles.modalTitle}>Edit Classroom</Text>

//             <TextInput
//               style={styles.input}
//               placeholder="Classroom name *"
//               value={classRoomName}
//               onChangeText={setClassRoomName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Capacity"
//               keyboardType="numeric"
//               value={capacity}
//               onChangeText={setCapacity}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Location"
//               value={location}
//               onChangeText={setLocation}
//             />

//             <View style={styles.buttonsRow}>
//               <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.addButton, updateClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={handleUpdate}
//                 disabled={updateClassroom.isPending}
//               >
//                 <Text style={styles.addButtonText}>
//                   {updateClassroom.isPending ? "Updating..." : "Update Classroom"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Delete Confirmation */}
//       <Modal visible={showDeleteAlert} transparent animationType="fade">
//         <View style={styles.deleteDialogOverlay}>
//           <View style={styles.deleteDialogContainer}>
//             <TouchableOpacity
//               style={styles.deleteCloseButton}
//               onPress={() => {
//                 setShowDeleteAlert(false);
//                 setDeletingClassroomId(null);
//               }}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={20} />
//             </TouchableOpacity>

//             <View style={styles.warningIconContainer}>
//               <View style={styles.warningIconCircle}>
//               <AutoHeightImage source={IMAGES.deleteIcon} width={30} />
            
//               </View>
//             </View>

//             <Text style={styles.deleteTitle}>Are you sure?</Text>
//             <Text style={styles.deleteMessage}>
//               Deleting this classroom will also remove all slots assigned to it from the timetable.
//               This action cannot be undone.
//             </Text>

//             <View style={styles.deleteButtonsRow}>
//               <TouchableOpacity
//                 style={styles.deleteCancelButton}
//                 onPress={() => {
//                   setShowDeleteAlert(false);
//                   setDeletingClassroomId(null);
//                 }}
//               >
//                 <Text style={styles.deleteCancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.deleteConfirmButton, deleteClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={confirmDelete}
//                 disabled={deleteClassroom.isPending}
//               >
//                 <Text style={styles.deleteConfirmText}>
//                   {deleteClassroom.isPending ? "Deleting..." : "Delete"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default ClassroomsTab;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//   },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   primaryButton: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 8,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   primaryButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   listContainer: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     padding: 12,
//   },
//   placeholderText: {
//     color: "#6B7280",
//   },
//   listItem: {
//     paddingVertical: 12,
//   },
//   listItemContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   listTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   listSubtitle: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 4,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: "#E5E7EB",
//   },
//   actionButtons: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   iconButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: COLORS.white,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalSheet: {
//     width: "88%",           // Side panel se popup box
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 20,
//     elevation: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   closeButton: {
//     position: "absolute",
//     top: 20,
//     right: 20,
//     zIndex: 1,
//     padding: 5,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 16,
//     marginTop: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
//   buttonsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 12,
//   },
//   cancelButton: {
//     width: "48%",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//   },
//   cancelText: {
//     color: "#6B7280",
//     fontWeight: "500",
//   },
//   addButton: {
//     width: "48%",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//   },
//   addButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   deleteDialogOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   deleteDialogContainer: {
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 20,
//     margin: 20,
//     width: "85%",
//     position: "relative",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   deleteCloseButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     zIndex: 1,
//     padding: 5,
//   },
//   warningIconContainer: {
//     alignItems: "center",
//     marginTop: 10,
//     marginBottom: 16,
//   },
//   warningIconCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#FFF7ED",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   deleteTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#111827",
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   deleteMessage: {
//     fontSize: 14,
//     color: "#6B7280",
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   deleteButtonsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   deleteCancelButton: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.white,
//   },
//   deleteCancelText: {
//     color: "#3B82F6",
//     fontWeight: "500",
//     fontSize: 14,
//   },
//   deleteConfirmButton: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//   },
//   deleteConfirmText: {
//     color: COLORS.white,
//     fontWeight: "600",
//     fontSize: 14,
//   },
// });


// yaha tak sahi he 

// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   FlatList,
//   ActivityIndicator,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../../app/store";
// import { COLORS } from "../../../../../colors";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { useCreateClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useCreateClassroom.mutation";
// import { useUpdateClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useUpdateClassroom.mutation";
// import { useDeleteClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useDeleteClassroom.mutation";
// import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { IMAGES } from "../../../../../images";
// import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";


// const ClassroomsTab = () => {
//   const [isCreateModalVisible, setCreateModalVisible] = useState(false);
//   const [classRoomName, setClassRoomName] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [location, setLocation] = useState("");

//   const [isEditModalVisible, setEditModalVisible] = useState(false);
//   const [editingClassroom, setEditingClassroom] = useState<any>(null);

//   const [showDeleteAlert, setShowDeleteAlert] = useState(false);
//   const [deletingClassroomId, setDeletingClassroomId] = useState<string | null>(null);

//   const { selectedOrganization } = useSelector((state: RootState) => state.auth);

//   const { data, isLoading, refetch } = useGetClassroomListQuery();

//   const createClassroom = useCreateClassroomMutation();
//   const updateClassroom = useUpdateClassroomMutation();
//   const deleteClassroom = useDeleteClassroomMutation();

//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");


//   const classrooms = useMemo(() => {
//     if (data?.data?.classRooms && Array.isArray(data.data.classRooms)) {
//       return [...data.data.classRooms].sort(
//         (a: any, b: any) => (b?.dateCreated ?? 0) - (a?.dateCreated ?? 0)
//       );
//     }
//     return [];
//   }, [data]);

//   const resetForm = () => {
//     setClassRoomName("");
//     setCapacity("");
//     setLocation("");
//   };

//   const closeCreateModal = () => {
//     setCreateModalVisible(false);
//     resetForm();
//   };

//   const closeEditModal = () => {
//     setEditModalVisible(false);
//     setEditingClassroom(null);
//     resetForm();
//   };

//   const handleSubmit = () => {
//     if (!selectedOrganization) {
//       console.warn("No organization selected");
//       return;
//     }

//     if (!classRoomName.trim()) {
//       console.warn("Classroom name is required");
//       return;
//     }

//     const payload = {
//       classRoomName: classRoomName.trim(),
//       capacity: capacity ? Number(capacity) : "",
//       location: location ? location.trim() : "",
//       customerId: selectedOrganization.customerId,
//       organizationId: selectedOrganization.organizationId,
//     };

//     createClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         closeCreateModal();
//         setSuccessMessage("Classroom created successfully!");
//         setShowSuccessPopup(true);
//       },
//     });
//   };

//   const handleEdit = (item: any) => {
//     setEditingClassroom(item);
//     setClassRoomName(item.classRoomName ?? "");
//     setCapacity(item.capacity?.toString() ?? "");
//     setLocation(item.location ?? "");
//     setEditModalVisible(true);
//   };

//   const handleUpdate = () => {
//     if (!selectedOrganization || !editingClassroom) {
//       console.warn("Missing organization or classroom");
//       return;
//     }

//     if (!classRoomName.trim()) {
//       console.warn("Classroom name is required");
//       return;
//     }

//     const payload = {
//       classRoomId: editingClassroom.classRoomId,
//       classRoomName: classRoomName.trim(),
//       capacity: capacity ? Number(capacity) : "",
//       location: location ? location.trim() : "",
//     };

//     updateClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         closeEditModal();
        
//     setSuccessMessage("Classroom updated successfully!");
//     setShowSuccessPopup(true);
//       },
//     });
//   };

//   const handleDelete = (item: any) => {
//     setDeletingClassroomId(item.classRoomId);
//     setShowDeleteAlert(true);
//   };

//   const confirmDelete = () => {
//     if (!selectedOrganization || !deletingClassroomId) {
//       console.warn("Missing organization or classroom id");
//       return;
//     }

//     const payload = {
//       classRoomId: deletingClassroomId,
//     };

//     deleteClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         setShowDeleteAlert(false);
//         setDeletingClassroomId(null);
//       },
//     });
//   };

//   const renderClassroom = ({ item }: { item: any }) => (
//     <View style={styles.listItem}>
//       <View style={styles.listItemContent}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.listTitle}>{item.classRoomName ?? "—"}</Text>
//           <Text style={styles.listSubtitle}>
//             Capacity: {item.capacity ?? "-"} Location: {item.location ?? "—"}
//           </Text>
//         </View>

//         <View style={styles.actionButtons}>
//           <TouchableOpacity
//             onPress={() => handleEdit(item)}
//             style={styles.iconButton}
//           >
//             <AutoHeightImage source={IMAGES.editIcon} width={20} />
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => handleDelete(item)}
//             style={styles.iconButton}
//           >
//             <AutoHeightImage source={IMAGES.deleteIcon} width={20} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerRow}>
//         <Text style={styles.sectionTitle}>Classroom Management</Text>

//         <TouchableOpacity
//           style={styles.primaryButton}
//           onPress={() => {
//             resetForm();
//             setCreateModalVisible(true);
//           }}
//         >
//           <Text style={styles.primaryButtonText}>Add Classroom</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.listContainer}>
//         {isLoading ? (
//           <ActivityIndicator color={COLORS.primary} />
//         ) : classrooms.length === 0 ? (
//           <Text style={styles.placeholderText}>                         No Data Found</Text>
//         ) : (
//           <FlatList
//             data={classrooms}
//             keyExtractor={(item, index) =>
//               item?.classRoomId ?? item?.id ?? index.toString()
//             }
//             ItemSeparatorComponent={() => <View style={styles.separator} />}
//             renderItem={renderClassroom}
//           />
//         )}
//       </View>

//       {/* Create Modal */}
//       <Modal visible={isCreateModalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalSheet}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={closeCreateModal}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
//             </TouchableOpacity>

//             <Text style={styles.modalTitle}>Add New Classroom</Text>

//             <TextInput
//               style={styles.input}
//               placeholder="Classroom name *"
//               value={classRoomName}
//               onChangeText={setClassRoomName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Capacity"
//               keyboardType="numeric"
//               value={capacity}
//               onChangeText={setCapacity}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Location"
//               value={location}
//               onChangeText={setLocation}
//             />

//             <View style={styles.buttonsRow}>
//               <TouchableOpacity style={styles.cancelButton} onPress={closeCreateModal}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.addButton, createClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={handleSubmit}
//                 disabled={createClassroom.isPending}
//               >
//                 <Text style={styles.addButtonText}>
//                   {createClassroom.isPending ? "Saving..." : "Add Classroom"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Edit Modal */}
//       <Modal visible={isEditModalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalSheet}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={closeEditModal}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
//             </TouchableOpacity>

//             <Text style={styles.modalTitle}>Edit Classroom</Text>

//             <TextInput
//               style={styles.input}
//               placeholder="Classroom name *"
//               value={classRoomName}
//               onChangeText={setClassRoomName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Capacity"
//               keyboardType="numeric"
//               value={capacity}
//               onChangeText={setCapacity}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Location"
//               value={location}
//               onChangeText={setLocation}
//             />

//             <View style={styles.buttonsRow}>
//               <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.addButton, updateClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={handleUpdate}
//                 disabled={updateClassroom.isPending}
//               >
//                 <Text style={styles.addButtonText}>
//                   {updateClassroom.isPending ? "Updating..." : "Update Classroom"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Delete Confirmation */}
//       <Modal visible={showDeleteAlert} transparent animationType="fade">
//         <View style={styles.deleteDialogOverlay}>
//           <View style={styles.deleteDialogContainer}>
//             <TouchableOpacity
//               style={styles.deleteCloseButton}
//               onPress={() => {
//                 setShowDeleteAlert(false);
//                 setDeletingClassroomId(null);
//               }}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={20} />
//             </TouchableOpacity>

//             <View style={styles.warningIconContainer}>
//               <View style={styles.warningIconCircle}>
//               <AutoHeightImage source={IMAGES.deleteIcon} width={30} />
            
//               </View>
//             </View>

//             <Text style={styles.deleteTitle}>Are you sure?</Text>
//             <Text style={styles.deleteMessage}>
//               Deleting this classroom will also remove all slots assigned to it from the timetable.
//               This action cannot be undone.
//             </Text>

//             <View style={styles.deleteButtonsRow}>
//               <TouchableOpacity
//                 style={styles.deleteCancelButton}
//                 onPress={() => {
//                   setShowDeleteAlert(false);
//                   setDeletingClassroomId(null);
//                 }}
//               >
//                 <Text style={styles.deleteCancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.deleteConfirmButton, deleteClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={confirmDelete}
//                 disabled={deleteClassroom.isPending}
//               >
//                 <Text style={styles.deleteConfirmText}>
//                   {deleteClassroom.isPending ? "Deleting..." : "Delete"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       {/* Success Popup Modal */}
// <Modal visible={showSuccessPopup} transparent animationType="fade">
//   <View style={styles.successOverlay}>
//     <View style={styles.successBox}>
//       <Text style={styles.successText}>{successMessage}</Text>

//       <TouchableOpacity
//         style={styles.successButton}
//         onPress={() => setShowSuccessPopup(false)}
//       >
//         <Text style={styles.successButtonText}>OK</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// </Modal>
//     </View>
//   );
// };

// export default ClassroomsTab;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//   },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   primaryButton: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 8,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   primaryButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   listContainer: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     padding: 12,
//   },
//   placeholderText: {
//     color: "#6B7280",
//   },
//   listItem: {
//     paddingVertical: 12,
//   },
//   listItemContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   listTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   listSubtitle: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 4,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: "#E5E7EB",
//   },
//   actionButtons: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   iconButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: COLORS.white,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalSheet: {
//     width: "88%",           // Side panel se popup box
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 20,
//     elevation: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   closeButton: {
//     position: "absolute",
//     top: 20,
//     right: 20,
//     zIndex: 1,
//     padding: 5,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 16,
//     marginTop: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
//   buttonsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 12,
//   },
//   cancelButton: {
//     width: "48%",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//   },
//   cancelText: {
//     color: "#6B7280",
//     fontWeight: "500",
//   },
//   addButton: {
//     width: "48%",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//   },
//   addButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   deleteDialogOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   deleteDialogContainer: {
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 20,
//     margin: 20,
//     width: "85%",
//     position: "relative",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   deleteCloseButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     zIndex: 1,
//     padding: 5,
//   },
//   warningIconContainer: {
//     alignItems: "center",
//     marginTop: 10,
//     marginBottom: 16,
//   },
//   warningIconCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#FFF7ED",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   deleteTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#111827",
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   deleteMessage: {
//     fontSize: 14,
//     color: "#6B7280",
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   deleteButtonsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   deleteCancelButton: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.white,
//   },
//   deleteCancelText: {
//     color: "#3B82F6",
//     fontWeight: "500",
//     fontSize: 14,
//   },
//   deleteConfirmButton: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//   },
//   deleteConfirmText: {
//     color: COLORS.white,
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   successOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
  
//   successBox: {
//     backgroundColor: COLORS.white,
//     padding: 25,
//     borderRadius: 12,
//     width: "75%",
//     elevation: 6,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     alignItems: "center",
//   },
  
//   successText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 20,
//     textAlign: "center",
//   },
  
//   successButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//     borderRadius: 8,
//   },
  
//   successButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//     fontSize: 14,
//   },
// });




// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   FlatList,
//   ActivityIndicator,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../../app/store";
// import { COLORS } from "../../../../../colors";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { useCreateClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useCreateClassroom.mutation";
// import { useUpdateClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useUpdateClassroom.mutation";
// import { useDeleteClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useDeleteClassroom.mutation";
// import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { IMAGES } from "../../../../../images";
// import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";


// const ClassroomsTab = () => {
//   const [isCreateModalVisible, setCreateModalVisible] = useState(false);
//   const [classRoomName, setClassRoomName] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [location, setLocation] = useState("");

//   const [isEditModalVisible, setEditModalVisible] = useState(false);
//   const [editingClassroom, setEditingClassroom] = useState<any>(null);

//   const [showDeleteAlert, setShowDeleteAlert] = useState(false);
//   const [deletingClassroomId, setDeletingClassroomId] = useState<string | null>(null);

//   const { selectedOrganization } = useSelector((state: RootState) => state.auth);

//   const { data, isLoading, refetch } = useGetClassroomListQuery();

//   const createClassroom = useCreateClassroomMutation();
//   const updateClassroom = useUpdateClassroomMutation();
//   const deleteClassroom = useDeleteClassroomMutation();

//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");


//   const classrooms = useMemo(() => {
//     if (data?.data?.classRooms && Array.isArray(data.data.classRooms)) {
//       return [...data.data.classRooms].sort(
//         (a: any, b: any) => (b?.dateCreated ?? 0) - (a?.dateCreated ?? 0)
//       );
//     }
//     return [];
//   }, [data]);

//   const resetForm = () => {
//     setClassRoomName("");
//     setCapacity("");
//     setLocation("");
//   };

//   const closeCreateModal = () => {
//     setCreateModalVisible(false);
//     resetForm();
//   };

//   const closeEditModal = () => {
//     setEditModalVisible(false);
//     setEditingClassroom(null);
//     resetForm();
//   };

//   const handleSubmit = () => {
//     if (!selectedOrganization) {
//       console.warn("No organization selected");
//       return;
//     }

//     if (!classRoomName.trim()) {
//       console.warn("Classroom name is required");
//       return;
//     }

//     const payload = {
//       classRoomName: classRoomName.trim(),
//       capacity: capacity ? Number(capacity) : "",
//       location: location ? location.trim() : "",
//       customerId: selectedOrganization.customerId,
//       organizationId: selectedOrganization.organizationId,
//     };

//     createClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         closeCreateModal();
//         setSuccessMessage("Classroom created successfully!");
//         setShowSuccessPopup(true);
//       },
//     });
//   };

//   const handleEdit = (item: any) => {
//     setEditingClassroom(item);
//     setClassRoomName(item.classRoomName ?? "");
//     setCapacity(item.capacity?.toString() ?? "");
//     setLocation(item.location ?? "");
//     setEditModalVisible(true);
//   };

//   const handleUpdate = () => {
//     if (!selectedOrganization || !editingClassroom) {
//       console.warn("Missing organization or classroom");
//       return;
//     }

//     if (!classRoomName.trim()) {
//       console.warn("Classroom name is required");
//       return;
//     }

//     const payload = {
//       classRoomId: editingClassroom.classRoomId,
//       classRoomName: classRoomName.trim(),
//       capacity: capacity ? Number(capacity) : "",
//       location: location ? location.trim() : "",
//     };

//     updateClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         closeEditModal();
        
//     setSuccessMessage("Classroom updated successfully!");
//     setShowSuccessPopup(true);
//       },
//     });
//   };

//   const handleDelete = (item: any) => {
//     setDeletingClassroomId(item.classRoomId);
//     setShowDeleteAlert(true);
//   };

//   const confirmDelete = () => {
//     if (!selectedOrganization || !deletingClassroomId) {
//       console.warn("Missing organization or classroom id");
//       return;
//     }

//     const payload = {
//       classRoomId: deletingClassroomId,
//     };

//     deleteClassroom.mutate(payload, {
//       onSuccess: () => {
//         refetch();
//         setShowDeleteAlert(false);
//         setDeletingClassroomId(null);
//       },
//     });
//   };

//   const renderClassroom = ({ item }: { item: any }) => (
//     <View style={styles.listItem}>
//       <View style={styles.listItemContent}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.listTitle}>{item.classRoomName ?? "—"}</Text>
//           <Text style={styles.listSubtitle}>
//             Capacity: {item.capacity ?? "-"} Location: {item.location ?? "—"}
//           </Text>
//         </View>

//         <View style={styles.actionButtons}>
//           <TouchableOpacity
//             onPress={() => handleEdit(item)}
//             style={styles.iconButton}
//           >
//             <AutoHeightImage source={IMAGES.editIcon} width={20} />
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => handleDelete(item)}
//             style={styles.iconButton}
//           >
//             <AutoHeightImage source={IMAGES.deleteIcon} width={20} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerRow}>
//         <Text style={styles.sectionTitle}>Classroom Management</Text>

//         <TouchableOpacity
//           style={styles.primaryButton}
//           onPress={() => {
//             resetForm();
//             setCreateModalVisible(true);
//           }}
//         >
//           <Text style={styles.primaryButtonText}>Add Classroom</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.listContainer}>
//         {isLoading ? (
//           <ActivityIndicator color={COLORS.primary} />
//         ) : classrooms.length === 0 ? (
//           <Text style={styles.placeholderText}>                         No Data Found</Text>
//         ) : (
//           <FlatList
//           data={classrooms}
//            nestedScrollEnabled={true}        // ⭐ ADD
//            showsVerticalScrollIndicator={false} // ⭐ ADD
//            keyExtractor={(item, index) =>
//            item?.classRoomId ?? item?.id ?? index.toString()
//             }
//           ItemSeparatorComponent={() => <View style={styles.separator} />}
//            renderItem={renderClassroom}
//            />

//         )}
//       </View>

//       {/* Create Modal */}
//       <Modal visible={isCreateModalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalSheet}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={closeCreateModal}
//             >
//               {/* <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} /> */}
//             </TouchableOpacity>

//             <Text style={styles.modalTitle}>Add New Classroom</Text>

//             <Text style={styles.label}>Classroom Name *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Classroom name *"
//               value={classRoomName}
//               onChangeText={setClassRoomName}
//             />
//             <Text style={styles.label}>Capacity</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Capacity"
//               keyboardType="numeric"
//               value={capacity}
//               onChangeText={setCapacity}
//             />
//             <Text style={styles.label}>Location</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Location"
//               value={location}
//               onChangeText={setLocation}
//             />

//             <View style={styles.buttonsRow}>
//               <TouchableOpacity style={styles.cancelButton} onPress={closeCreateModal}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.addButton, createClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={handleSubmit}
//                 disabled={createClassroom.isPending}
//               >
//                 <Text style={styles.addButtonText}>
//                   {createClassroom.isPending ? "Saving..." : "Add Classroom"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Edit Modal */}
//       <Modal visible={isEditModalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalSheet}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={closeEditModal}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
//             </TouchableOpacity>

//             <Text style={styles.modalTitle}>Edit Classroom</Text>

//             <Text style={styles.label}>Classroom Name *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Classroom name *"
//               value={classRoomName}
//               onChangeText={setClassRoomName}
//             />
//             <Text style={styles.label}>Capacity</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Capacity"
//               keyboardType="numeric"
//               value={capacity}
//               onChangeText={setCapacity}
//             />
//             <Text style={styles.label}>Location</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Location"
//               value={location}
//               onChangeText={setLocation}
//             />

//             <View style={styles.buttonsRow}>
//               <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.addButton, updateClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={handleUpdate}
//                 disabled={updateClassroom.isPending}
//               >
//                 <Text style={styles.addButtonText}>
//                   {updateClassroom.isPending ? "Updating..." : "Update Classroom"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Delete Confirmation */}
//       <Modal visible={showDeleteAlert} transparent animationType="fade">
//         <View style={styles.deleteDialogOverlay}>
//           <View style={styles.deleteDialogContainer}>
//             <TouchableOpacity
//               style={styles.deleteCloseButton}
//               onPress={() => {
//                 setShowDeleteAlert(false);
//                 setDeletingClassroomId(null);
//               }}
//             >
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={20} />
//             </TouchableOpacity>

//             <View style={styles.warningIconContainer}>
//               <View style={styles.warningIconCircle}>
//               <AutoHeightImage source={IMAGES.deleteIcon} width={30} />
            
//               </View>
//             </View>

//             <Text style={styles.deleteTitle}>Are you sure?</Text>
//             <Text style={styles.deleteMessage}>
//               Deleting this classroom will also remove all slots assigned to it from the timetable.
//               This action cannot be undone.
//             </Text>

//             <View style={styles.deleteButtonsRow}>
//               <TouchableOpacity
//                 style={styles.deleteCancelButton}
//                 onPress={() => {
//                   setShowDeleteAlert(false);
//                   setDeletingClassroomId(null);
//                 }}
//               >
//                 <Text style={styles.deleteCancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.deleteConfirmButton, deleteClassroom.isPending && { opacity: 0.7 }]}
//                 onPress={confirmDelete}
//                 disabled={deleteClassroom.isPending}
//               >
//                 <Text style={styles.deleteConfirmText}>
//                   {deleteClassroom.isPending ? "Deleting..." : "Delete"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       {/* Success Popup Modal */}
// <Modal visible={showSuccessPopup} transparent animationType="fade">
//   <View style={styles.successOverlay}>
//     <View style={styles.successBox}>
//       <Text style={styles.successText}>{successMessage}</Text>

//       <TouchableOpacity
//         style={styles.successButton}
//         onPress={() => setShowSuccessPopup(false)}
//       >
//         <Text style={styles.successButtonText}>OK</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// </Modal>
//     </View>
//   );
// };

// export default ClassroomsTab;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//   },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   primaryButton: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 8,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   primaryButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   listContainer: {
//     backgroundColor: COLORS.white,
//     borderRadius: 14,
//     paddingVertical: 16,
//     paddingHorizontal: 14,
//      // shadow / elevation
//   elevation: 3,
//   shadowColor: "#000",
//   shadowOpacity: 0.1,
//   shadowRadius: 6,
//   shadowOffset: { width: 0, height: 3 },

//   // FIXED HEIGHT
//   maxHeight: 350, // 👈 same card look
//   },
//   placeholderText: {
//     color: "#6B7280",
//   },
//   listItem: {
//     paddingVertical: 12,
//   },
//   listItemContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   listTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   listSubtitle: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 4,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: "#E5E7EB",
//   },
//   actionButtons: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   iconButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: COLORS.white,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalSheet: {
//     width: "88%",           // Side panel se popup box
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 20,
//     elevation: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   closeButton: {
//     position: "absolute",
//     top: 20,
//     right: 20,
//     zIndex: 1,
//     padding: 5,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 16,
//     marginTop: 10,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 6,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
//   buttonsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 12,
//   },
//   cancelButton: {
//     width: "48%",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//   },
//   cancelText: {
//     color: "#6B7280",
//     fontWeight: "500",
//   },
//   addButton: {
//     width: "48%",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//   },
//   addButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   deleteDialogOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   deleteDialogContainer: {
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 20,
//     margin: 20,
//     width: "85%",
//     position: "relative",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   deleteCloseButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     zIndex: 1,
//     padding: 5,
//   },
//   warningIconContainer: {
//     alignItems: "center",
//     marginTop: 10,
//     marginBottom: 16,
//   },
//   warningIconCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#FFF7ED",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   deleteTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#111827",
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   deleteMessage: {
//     fontSize: 14,
//     color: "#6B7280",
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   deleteButtonsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   deleteCancelButton: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.white,
//   },
//   deleteCancelText: {
//     color: "#3B82F6",
//     fontWeight: "500",
//     fontSize: 14,
//   },
//   deleteConfirmButton: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//   },
//   deleteConfirmText: {
//     color: COLORS.white,
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   successOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
  
//   successBox: {
//     backgroundColor: COLORS.white,
//     padding: 25,
//     borderRadius: 12,
//     width: "75%",
//     elevation: 6,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     alignItems: "center",
//   },
  
//   successText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 20,
//     textAlign: "center",
//   },
  
//   successButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//     borderRadius: 8,
//   },
  
//   successButtonText: {
//     color: COLORS.white,
//     fontWeight: "600",
//     fontSize: 14,
//   },
// });




import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../app/store";
import { COLORS } from "../../../../../colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useCreateClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useCreateClassroom.mutation";
import { useUpdateClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useUpdateClassroom.mutation";
import { useDeleteClassroomMutation } from "../../../../../apis/hooks/classroom/mutation/useDeleteClassroom.mutation";
import { useGetClassroomListQuery } from "../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
import { IMAGES } from "../../../../../images";
import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";


const ClassroomsTab = () => {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [classRoomName, setClassRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<any>(null);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deletingClassroomId, setDeletingClassroomId] = useState<string | null>(null);

  const { selectedOrganization } = useSelector((state: RootState) => state.auth);

  const { data, isLoading, refetch } = useGetClassroomListQuery();

  const createClassroom = useCreateClassroomMutation();
  const updateClassroom = useUpdateClassroomMutation();
  const deleteClassroom = useDeleteClassroomMutation();

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  const classrooms = useMemo(() => {
    if (data?.data?.classRooms && Array.isArray(data.data.classRooms)) {
      return [...data.data.classRooms].sort(
        (a: any, b: any) => (b?.dateCreated ?? 0) - (a?.dateCreated ?? 0)
      );
    }
    return [];
  }, [data]);

  const resetForm = () => {
    setClassRoomName("");
    setCapacity("");
    setLocation("");
  };

  const closeCreateModal = () => {
    setCreateModalVisible(false);
    resetForm();
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingClassroom(null);
    resetForm();
  };

  const handleSubmit = () => {
    if (!selectedOrganization) {
      console.warn("No organization selected");
      return;
    }

    if (!classRoomName.trim()) {
      console.warn("Classroom name is required");
      return;
    }

    const payload = {
      classRoomName: classRoomName.trim(),
      capacity: capacity ? Number(capacity) : "",
      location: location ? location.trim() : "",
      customerId: selectedOrganization.customerId,
      organizationId: selectedOrganization.organizationId,
    };

    createClassroom.mutate(payload, {
      onSuccess: () => {
        refetch();
        closeCreateModal();
        setSuccessMessage("Classroom created successfully!");
        setShowSuccessPopup(true);
      },
    });
  };

  const handleEdit = (item: any) => {
    setEditingClassroom(item);
    setClassRoomName(item.classRoomName ?? "");
    setCapacity(item.capacity?.toString() ?? "");
    setLocation(item.location ?? "");
    setEditModalVisible(true);
  };

  const handleUpdate = () => {
    if (!selectedOrganization || !editingClassroom) {
      console.warn("Missing organization or classroom");
      return;
    }

    if (!classRoomName.trim()) {
      console.warn("Classroom name is required");
      return;
    }

    const payload = {
      classRoomId: editingClassroom.classRoomId,
      classRoomName: classRoomName.trim(),
      capacity: capacity ? Number(capacity) : "",
      location: location ? location.trim() : "",
    };

    updateClassroom.mutate(payload, {
      onSuccess: () => {
        refetch();
        closeEditModal();
        
    setSuccessMessage("Classroom updated successfully!");
    setShowSuccessPopup(true);
      },
    });
  };

  const handleDelete = (item: any) => {
    setDeletingClassroomId(item.classRoomId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (!selectedOrganization || !deletingClassroomId) {
      console.warn("Missing organization or classroom id");
      return;
    }

    const payload = {
      classRoomId: deletingClassroomId,
    };

    deleteClassroom.mutate(payload, {
      onSuccess: () => {
        refetch();
        setShowDeleteAlert(false);
        setDeletingClassroomId(null);
      },
    });
  };

  const renderClassroom = ({ item }: { item: any }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.listTitle}>{item.classRoomName ?? "—"}</Text>
          <Text style={styles.listSubtitle}>
            Capacity: {item.capacity ?? "-"} Location: {item.location ?? "—"}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={styles.iconButton}
          >
            <AutoHeightImage source={IMAGES.editIcon} width={20} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={styles.iconButton}
          >
            <AutoHeightImage source={IMAGES.deleteIcon} width={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Classroom Management</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            resetForm();
            setCreateModalVisible(true);
          }}
        >
          <Text style={styles.primaryButtonText}>Add Classroom</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : classrooms.length === 0 ? (
          <Text style={styles.placeholderText}>                         No Data Found</Text>
        ) : (
          <FlatList
          data={classrooms}
           nestedScrollEnabled={true}        // ⭐ ADD
           showsVerticalScrollIndicator={false} // ⭐ ADD
           keyExtractor={(item, index) =>
           item?.classRoomId ?? item?.id ?? index.toString()
            }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
           renderItem={renderClassroom}
           />

        )}
      </View>

      {/* Create Modal */}
      <Modal visible={isCreateModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeCreateModal}
            >
              {/* <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} /> */}
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Add New Classroom</Text>

            <Text style={styles.label}>Classroom Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Classroom name *"
              value={classRoomName}
              onChangeText={setClassRoomName}
            />
            <Text style={styles.label}>Capacity</Text>
            <TextInput
              style={styles.input}
              placeholder="Capacity"
              keyboardType="numeric"
              value={capacity}
              onChangeText={setCapacity}
            />
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
            />

            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeCreateModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addButton, createClassroom.isPending && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={createClassroom.isPending}
              >
                <Text style={styles.addButtonText}>
                  {createClassroom.isPending ? "Saving..." : "Add Classroom"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={isEditModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeEditModal}
            >
              <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Update Classroom</Text>

            <Text style={styles.label}>Classroom Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Classroom name *"
              value={classRoomName}
              onChangeText={setClassRoomName}
            />
            <Text style={styles.label}>Capacity</Text>
            <TextInput
              style={styles.input}
              placeholder="Capacity"
              keyboardType="numeric"
              value={capacity}
              onChangeText={setCapacity}
            />
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
            />

            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addButton, updateClassroom.isPending && { opacity: 0.7 }]}
                onPress={handleUpdate}
                disabled={updateClassroom.isPending}
              >
                <Text style={styles.addButtonText}>
                  {updateClassroom.isPending ? "Updating..." : "Update Classroom"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation */}
      <Modal visible={showDeleteAlert} transparent animationType="fade">
        <View style={styles.deleteDialogOverlay}>
          <View style={styles.deleteDialogContainer}>
            <TouchableOpacity
              style={styles.deleteCloseButton}
              onPress={() => {
                setShowDeleteAlert(false);
                setDeletingClassroomId(null);
              }}
            >
              <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={20} />
            </TouchableOpacity>

            <View style={styles.warningIconContainer}>
              <View style={styles.warningIconCircle}>
              <AutoHeightImage source={IMAGES.deleteIcon} width={30} />
            
              </View>
            </View>

            <Text style={styles.deleteTitle}>Are you sure?</Text>
            <Text style={styles.deleteMessage}>
              Deleting this classroom will also remove all slots assigned to it from the timetable.
              This action cannot be undone.
            </Text>

            <View style={styles.deleteButtonsRow}>
              <TouchableOpacity
                style={styles.deleteCancelButton}
                onPress={() => {
                  setShowDeleteAlert(false);
                  setDeletingClassroomId(null);
                }}
              >
                <Text style={styles.deleteCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteConfirmButton, deleteClassroom.isPending && { opacity: 0.7 }]}
                onPress={confirmDelete}
                disabled={deleteClassroom.isPending}
              >
                <Text style={styles.deleteConfirmText}>
                  {deleteClassroom.isPending ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Success Popup Modal */}
<Modal visible={showSuccessPopup} transparent animationType="fade">
  <View style={styles.successOverlay}>
    <View style={styles.successBox}>
      <Text style={styles.successText}>{successMessage}</Text>

      <TouchableOpacity
        style={styles.successButton}
        onPress={() => setShowSuccessPopup(false)}
      >
        <Text style={styles.successButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
  );
};

export default ClassroomsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  listContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
     // shadow / elevation
  elevation: 3,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },

  // FIXED HEIGHT
  maxHeight: 350, // 👈 same card look
  },
  placeholderText: {
    color: "#6B7280",
  },
  listItem: {
    paddingVertical: 12,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  listSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalSheet: {
    width: "88%",           // Side panel se popup box
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  cancelButton: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#6B7280",
    fontWeight: "500",
  },
  addButton: {
    width: "48%",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  deleteDialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteDialogContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    margin: 20,
    width: "85%",
    position: "relative",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  warningIconContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  warningIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  deleteMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  deleteButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  deleteCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  deleteCancelText: {
    color: "#3B82F6",
    fontWeight: "500",
    fontSize: 14,
  },
  deleteConfirmButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  deleteConfirmText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  successBox: {
    backgroundColor: COLORS.white,
    padding: 25,
    borderRadius: 12,
    width: "75%",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignItems: "center",
  },
  
  successText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  
  successButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  
  successButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
});









