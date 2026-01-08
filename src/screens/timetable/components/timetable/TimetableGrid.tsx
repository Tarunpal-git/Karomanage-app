



// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Animated,
//   Modal,
// } from "react-native";
// import { getIconComponent } from "../../../../utils/getIconComponent";
// import { COLORS } from "../../../../colors";
// import { IMAGES } from "../../../../images";
// import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";


// const screenW = Dimensions.get("window").width;
// const MaterialIcons = getIconComponent("MaterialIcons");

// export type TTimetableCell = {
//   dayIndex: number;
//   day: Date;
//   hour: string;
// };

// type TimetableGridProps = {
//   days: Date[];
//   hours: string[];
//   activeCell: TTimetableCell | null;
//   onCellPress: (cell: TTimetableCell) => void;
//   timeTableData?: any;
//   repeatDays?: { [key: string]: any[] };
//   teacherMap?: { [key: string]: string };
//   subjectMap?: { [key: string]: string };
//   classroomMap?: { [key: string]: string };
//   onEditSlot?: (slot: any, day: Date, hour: string) => void;
//   onDeleteSlot?: (slot: any, day: Date, hour: string) => void;
// };

// // Convert day to day key (M, T, W, Th, F, Sa, Su)
// const getDayKey = (day: Date): string => {
//   const dayOfWeek = day.getDay();
//   const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//   return dayKeys[dayOfWeek];
// };

// const ROW_HEIGHT = 70; // ⭐ original row height

// const gridStyles = StyleSheet.create({
//   outer: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 12,
//     elevation: 2,
//   },

//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 6,
//     overflow: "hidden",
//   },

//   timeColumn: {
//     width: 90,
//     borderRightWidth: 1,
//     borderColor: "#F3F4F6",
//     paddingVertical: 8,
//     paddingLeft: 10,
//     backgroundColor: "#FAFBFD",
//   },

//   timeHeaderText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#6B7280",
//   },

//   daysWrapper: { overflow: "hidden", flex: 1 },

//   daysContainer: {
//     flexDirection: "row",
//     minWidth: Math.max(screenW - 120, 600),
//   },

//   dayHeader: {
//     width: 140,
//     height: 30,            // ⭐ FIXED COMPACT HEIGHT (as you want)
//     justifyContent: "center",
//     alignItems: "center",
//     borderLeftWidth: 1,
//     borderColor: "#F3F4F6",
//     backgroundColor: "#FFF",
//   },

//   dayLabel: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#111827",
//   },

//   gridBodyWrapper: { flexDirection: "row", flex: 1 },

//   gridBodyColumnWrapper: { flexDirection: "column" },

//   gridBodyRow: {
//     flexDirection: "row",
//     height: ROW_HEIGHT,
//     borderTopWidth: 1,
//     borderColor: "#F3F4F6",
//   },

//   timeCell: {
//     width: 90,
//     height: ROW_HEIGHT,
//     alignItems: "flex-start",
//     justifyContent: "center",
//     paddingLeft: 10,
//     borderRightWidth: 1,
//     borderLeftWidth: 1,
//     borderColor: "#F3F4F6",
//     backgroundColor: "#FAFBFD",
//   },

//   timeCellText: {
//     fontSize: 12,
//     color: "#6B7280",
//     fontWeight: "600",
//   },

//   dayCell: {
//     width: 140,
//     height: ROW_HEIGHT, // ⭐ Fixed height for same size
//     padding: 0, // ⭐ No padding - blocks touch border
//     alignItems: "flex-start",
//     justifyContent: "flex-start",
//     borderLeftWidth: 1,
//     borderRightWidth: 1, // ⭐ Right border like left border
//     borderColor: "#F3F4F6",
//     position: "relative", // allow overlay controls (view icon)
//   },

//   activeSlot: {
//     backgroundColor: "rgba(67, 97, 238, 0.08)",
//   },

//   plusBadge: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     borderWidth: 1,
//     borderColor: "#CBD5F5",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   plusText: {
//     fontSize: 18,
//     color: COLORS.primary,
//     fontWeight: "700",
//   },
//   slotContainer: {
//     width: "100%",
//     alignSelf: "stretch", // ⭐ Stretch to full width - touch right border
//     paddingLeft: 0, // ⭐ No left padding - touch left border
//     paddingRight: 0, // ⭐ No right padding - touch right border horizontally
//     paddingBottom: 0, // ⭐ No bottom padding - fill vertically
//     paddingTop: 0, // ⭐ No top padding - fill vertically
//     borderRadius: 6, // ⭐ Slightly rounded corners like screenshot
//     marginBottom: 0, // ⭐ No margin - touch border
//     marginRight: 0, // ⭐ No right margin - touch right border
//     marginLeft: 0, // ⭐ No left margin - touch left border
//     height: "100%", // ⭐ Full height to fill white space
//     flexDirection: "column", // ⭐ Column layout
//     justifyContent: "space-between", // ⭐ Space between content and time
//   },
//   slotContent: {
//     flex: 1, // ⭐ Take available space, push time to bottom
//     justifyContent: "flex-start",
//     marginBottom: 12, // ⭐ More space between room and time (time aur niche)
//     paddingLeft: 6, // ⭐ Padding for text from left border
//     paddingRight: 50, // ⭐ Space for icons on right
//     paddingTop: 6, // ⭐ Top padding for content
//   },
//   slotText: {
//     fontSize: 10,
//     color: "#111827",
//     fontWeight: "400", // ⭐ Thinner font weight
//     marginBottom: 1, // ⭐ Even less spacing (classroom aur upar)
//   },
//   slotTime: {
//     fontSize: 9,
//     color: "#6B7280",
//     fontWeight: "300", // ⭐ Lighter font weight for time (different from text)
//     marginTop: 6, // ⭐ More space from room above (time aur niche)
//     alignSelf: "flex-start", // ⭐ Align time to left
//     paddingLeft: 6, // ⭐ Padding for time from left border
//     paddingBottom: 6, // ⭐ Bottom padding for time
//   },
//   editIcon: {
//     position: "absolute",
//     top: 4, // ⭐ Near border (moved up)
//     right: 4, // ⭐ Right side near border
//     padding: 4,
//     zIndex: 10001,
//     elevation: 10,
//   },
//   deleteIcon: {
//     position: "absolute",
//     top: 4, // ⭐ Near border (moved up)
//     right: 26, // ⭐ Next to edit icon (space for edit icon)
//     padding: 4,
//     zIndex: 10001,
//     elevation: 10,
//   },
//   viewIcon: {
//     position: "absolute",
//     top: 28, // ⭐ Below delete icon
//     right: 4, // ⭐ Right side near border
//     padding: 4,
//     zIndex: 10001,
//     elevation: 10,
//   },
// });

// const TimetableGrid = ({
//   days,
//   hours,
//   activeCell,
//   onCellPress,
//   timeTableData,
//   repeatDays = {},
//   teacherMap = {},
//   subjectMap = {},
//   classroomMap = {},
//   onEditSlot,
//   onDeleteSlot,
// }: TimetableGridProps) => {
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
//   const [slotToDelete, setSlotToDelete] = useState<{ slot: any; day: Date; hour: string } | null>(null);
//   const [selectedSlotInfo, setSelectedSlotInfo] = useState<{ slot: any; day: Date; hour: string } | null>(null);
//   const [infoPopupVisible, setInfoPopupVisible] = useState(false);
//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [viewModalData, setViewModalData] = useState<{ day: Date; hour: string; slots: any[] } | null>(null);

//   // ⭐ COLOR PALETTE (Web jaisa)
//   const subjectColorMap = useRef<{ [key: string]: string }>({});
//   const subjectTextColorMap = useRef<{ [key: string]: string }>({});
//   const bgPalette = [
//     "#B3E5FC", // Darker Light Blue (was Light Cyan)
//     "#C8E6C9", // Darker Soft Mint
//     "#FFF59D", // Darker Pastel Lemon
//     "#F48FB1", // Darker Soft Pink
//     "#CE93D8", // Darker Lilac
//     "#FFCC80", // Darker Apricot
//   ];
//   const textPalette = ["#0d47a1", "#1b5e20", "#f57f17", "#880e4f", "#311b92", "#4a148c"];

//   // ⭐ GET SUBJECT COLOR (Web jaisa logic)
//   const getSubjectColor = (subjectId: string) => {
//     if (!subjectId) {
//       return { bg: "#E5E7EB", text: "#111827" }; // Default gray
//     }
//     if (!subjectColorMap.current[subjectId]) {
//       const index = Object.keys(subjectColorMap.current).length % bgPalette.length;
//       subjectColorMap.current[subjectId] = bgPalette[index];
//       subjectTextColorMap.current[subjectId] = textPalette[index];
//     }
//     return {
//       bg: subjectColorMap.current[subjectId],
//       text: subjectTextColorMap.current[subjectId],
//     };

//   };

//   // ⭐ CALCULATE DURATION in minutes
//   const calculateDuration = (startTime: string, endTime: string): number => {
//     if (!startTime || !endTime) return 0;
    
//     const startParts = startTime.split(":");
//     const endParts = endTime.split(":");
    
//     if (startParts.length < 2 || endParts.length < 2) return 0;
    
//     const startMinutes = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
//     const endMinutes = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);
    
//     return endMinutes - startMinutes;
//   };

//   // ⭐ FIND ALL SLOTS for a specific day and hour (Web jaisa - multiple slots support)
//   // ⚠️ IMPORTANT: Only return slots that START in this hour (not slots that just overlap)
//   // This prevents slots from appearing in multiple hour rows
//   const findSlots = (day: Date, hour: string) => {
//     const dayKey = getDayKey(day);
//     const daySlots = repeatDays[dayKey] || [];
    
//     // Parse hour to get hour number (e.g., "04:00" -> 4)
//     const hourNumber = parseInt(hour.split(":")[0], 10);
    
//     // ⭐ Web jaisa: Only show slots that START in this hour
//     // A slot belongs to this hour ONLY if its startTime hour matches this hour
//     const foundSlots = daySlots.filter((slot: any) => {
//       if (!slot.startTime || !slot.endTime) return false;
      
//       // Parse startTime to get hour (handle both "04:00" and "4:00" formats)
//       const startTimeParts = slot.startTime.split(":");
//       if (startTimeParts.length < 2) return false; // Invalid format
      
//       const startH = parseInt(startTimeParts[0], 10);
      
//       // Only return slots that START in this hour (Web jaisa logic)
//       return startH === hourNumber;
//     });
  
//     // Clean slot IDs
//     foundSlots.forEach((slot: any) => {
//       if (slot.id && typeof slot.id === 'string') {
//         slot.id = slot.id.replace(/^["']+|["']+$/g, '').trim();
//       }
//     });
    
//     return foundSlots;
//   };

//   // ⭐ HANDLE VIEW ICON CLICK
//   const handleViewClick = (day: Date, hour: string) => {
//     const slots = findSlots(day, hour);
//     const secondarySlots = slots.slice(1); // show all additional slots in modal
//     setViewModalData({ day, hour, slots: secondarySlots });
//     setViewModalVisible(true);
//   };

//   // Handle edit button click
//   const handleEdit = (slot: any, day: Date, hour: string) => {
//     console.log("✏️ Edit icon clicked!");
//     console.log("✏️ Slot data:", slot);
//     console.log("✏️ Day:", day);
//     console.log("✏️ Hour:", hour);
//     if (onEditSlot) {
//       console.log("✏️ Calling onEditSlot callback...");
//       onEditSlot(slot, day, hour);
//     } else {
//       console.warn("⚠️ onEditSlot callback not provided!");
//     }
//   };

//   // Handle delete button click
//   const handleDeleteClick = (slot: any, day: Date, hour: string) => {
//     console.log("🗑️ Delete icon clicked!");
//     setSlotToDelete({ slot, day, hour });
//     setDeleteDialogVisible(true);
//   };

//   // Confirm delete
//   const handleConfirmDelete = () => {
//     if (slotToDelete && onDeleteSlot) {
//       onDeleteSlot(slotToDelete.slot, slotToDelete.day, slotToDelete.hour);
//     }
//     setDeleteDialogVisible(false);
//     setSlotToDelete(null);
//   };

//   // Cancel delete
//   const handleCancelDelete = () => {
//     setDeleteDialogVisible(false);
//     setSlotToDelete(null);
//   };

//   return (
//     <View style={gridStyles.outer}>

//       {/* HEADER (moves when grid scrolls) */}
//       <View style={gridStyles.headerRow}>
//         <View style={gridStyles.timeColumn}>
//           <Text style={gridStyles.timeHeaderText}>Time</Text>
//         </View>

//         <View style={gridStyles.daysWrapper}>
//           <Animated.View
//             style={[
//               gridStyles.daysContainer,
//               { transform: [{ translateX: Animated.multiply(scrollX, -1) }] },
//             ]}
//           >
//             {days.map((day) => (
//               <View key={day.toISOString()} style={gridStyles.dayHeader}>
//                 <Text style={gridStyles.dayLabel}>
//                   {day.toLocaleDateString(undefined, {
//                     weekday: "short",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </Text>
//               </View>
//             ))}
//           </Animated.View>
//         </View>
//       </View>

//       {/* BODY (single horizontal scroll controlling ALL rows) */}
//       <View style={{ flexDirection: "row", flex: 1 }}>
//         {/* FIXED TIME COLUMN */}
//         <View>
//           {hours.map((hour) => (
//             <View key={hour} style={gridStyles.timeCell}>
//               <Text style={gridStyles.timeCellText}>{hour}</Text>
//             </View>
//           ))}
//         </View>

//         {/* ALL GRID COLUMNS IN ONE SCROLL */}
//         <Animated.ScrollView
//           horizontal
//           scrollEventThrottle={16}
//           showsHorizontalScrollIndicator={false}
//           onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//             { useNativeDriver: true }
//           )}
//         >
//           <View style={gridStyles.gridBodyColumnWrapper}>
//             {hours.map((hour) => (
//               <View key={hour} style={gridStyles.gridBodyRow}>
//                 {days.map((day, dayIndex) => {
//                   const slots = findSlots(day, hour); // ⭐ Get all slots for this hour
//                   const primarySlot = slots[0];
//                   const secondarySlots = slots.slice(1);
//                   const showViewIcon = secondarySlots.length > 0;
//                   const primaryColors = primarySlot ? getSubjectColor(primarySlot.subjectId) : null;
//                   const isActive =
//                     activeCell &&
//                     activeCell.dayIndex === dayIndex &&
//                     activeCell.hour === hour;


//                   return (
//                     <View key={`${day.toISOString()}-${hour}`} style={gridStyles.dayCell}>
//                       {primarySlot ? (
//                         <TouchableOpacity
//                           key={`slot-${primarySlot.id || 0}`}
//                           activeOpacity={0.8}
//                           onPress={() => {
//                             setSelectedSlotInfo({ slot: primarySlot, day, hour });
//                             setInfoPopupVisible(true);
//                           }}
//                           style={{ width: "100%" }}
//                         >
//                           <View
//                             style={[
//                               gridStyles.slotContainer,
//                               {
//                                 backgroundColor: primaryColors?.bg || "#E5E7EB",
//                               },
//                             ]}
//                             pointerEvents="box-none"
//                           >
//                             <View style={gridStyles.slotContent} pointerEvents="none">
//                               <Text style={[gridStyles.slotText, { color: primaryColors?.text || "#111827" }]} numberOfLines={1}>
//                                 {subjectMap[primarySlot.subjectId] || primarySlot.subjectId || "Subject"}
//                               </Text>
//                               <Text style={[gridStyles.slotText, { color: primaryColors?.text || "#111827", marginBottom: 0 }]} numberOfLines={1}>
//                                 {teacherMap[primarySlot.teacherId] || primarySlot.teacherId || "Teacher"}
//                               </Text>
//                               <Text style={[gridStyles.slotText, { color: primaryColors?.text || "#111827", marginBottom: 0 }]} numberOfLines={1}>
//                                 {classroomMap[primarySlot.classRoomId] || primarySlot.classRoomId || "Room"}
//                               </Text>
//                               <Text style={[gridStyles.slotTime, { color: primaryColors?.text || "#374151" }]}>
//                                 {primarySlot.startTime} - {primarySlot.endTime}
//                               </Text>
//                             </View>
//                             {/* Edit Icon */}
//                             <TouchableOpacity
//                               style={gridStyles.editIcon}
//                               onPress={(e) => {
//                                 e.stopPropagation();
//                                 handleEdit(primarySlot, day, hour);
//                               }}
//                               activeOpacity={0.7}
//                               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                             >
//                              <AutoHeightImage source={IMAGES.editIcon} width={15} />
//                             </TouchableOpacity>
//                             {/* Delete Icon */}
//                             <TouchableOpacity
//                               style={gridStyles.deleteIcon}
//                               onPress={(e) => {
//                                 e.stopPropagation();
//                                 handleDeleteClick(primarySlot, day, hour);
//                               }}
//                               activeOpacity={0.7}
//                               hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//                             >
//                               {/* <MaterialIcons name="delete" size={16} color="#EF4444" /> */}
//                               {/* <AutoHeightImage source={IMAGES.editIcon} width={20} /> */}
//                               <AutoHeightImage source={IMAGES.deleteIcon} width={15} />
//                             </TouchableOpacity>
//                           </View>
//                         </TouchableOpacity>
//                       ) : (
//                         <TouchableOpacity
//                           style={[
//                             {width: "100%", 
//                               height: "100%",
//                               justifyContent: "center",  // ⭐ Center vertically
//                               alignItems: "center", 
                              
//                               },
//                             isActive && gridStyles.activeSlot,
//                           ]}
//                           onPress={() => onCellPress({ dayIndex, day, hour })}
//                         >
//                           {isActive && (
//                             <View style={gridStyles.plusBadge}>
//                               <Text style={gridStyles.plusText}>+</Text>
//                             </View>
//                           )}
//                         </TouchableOpacity>
//                       )}
//                       {showViewIcon && (
//                          <TouchableOpacity
//                            style={gridStyles.viewIcon}
//                            onPress={(e) => {
//                              e.stopPropagation();
//                              console.log("👁️ View icon clicked for hour:", hour);
//                              handleViewClick(day, hour);
//                            }}
//                            activeOpacity={0.7}
//                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//                          >
//                            {/* <MaterialIcons name="visibility" size={16} color="#6B7280" /> */}
//                            <AutoHeightImage source={IMAGES.calendarIcon} width={15} />

//                          </TouchableOpacity>
//                        )}
//                     </View>
//                   );
//                 })}
//               </View>
//             ))}
//           </View>
//         </Animated.ScrollView>
//       </View>

//       {/* Delete Confirmation Dialog */}
//       <Modal
//         visible={deleteDialogVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={handleCancelDelete}
//       >
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <View
//             style={{
//               backgroundColor: COLORS.white,
//               borderRadius: 12,
//               padding: 24,
//               width: "85%",
//               maxWidth: 400,
//               alignItems: "center",
//             }}
//           >
//             {/* Close Icon */}
//             <TouchableOpacity
//               style={{
//                 position: "absolute",
//                 top: 12,
//                 right: 12,
//                 padding: 4,
//               }}
//               onPress={handleCancelDelete}
//             >
//               {/* <MaterialIcons name="close" size={20} color="#6B7280" /> */}
//               <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
//             </TouchableOpacity>

//             {/* Warning Icon */}
//             <View
//               style={{
//                 width: 64,
//                 height: 64,
//                 borderRadius: 32,
//                 borderWidth: 3,
//                 borderColor: "#F97316",
//                 backgroundColor: "#FFF7ED",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 marginBottom: 16,
//               }}
//             >
//               <Text style={{ fontSize: 32, color: "#F97316", fontWeight: "700" }}>!</Text>
//             </View>

//             {/* Title */}
//             <Text
//               style={{
//                 fontSize: 20,
//                 fontWeight: "700",
//                 color: "#111827",
//                 marginBottom: 8,
//                 textAlign: "center",
//               }}
//             >
//               Are you sure?
//             </Text>

//             {/* Message */}
//             <Text
//               style={{
//                 fontSize: 14,
//                 color: "#6B7280",
//                 textAlign: "center",
//                 marginBottom: 24,
//               }}
//             >
//               You won't be able to revert this slot!
//             </Text>

//             {/* Buttons */}
//             <View style={{ flexDirection: "row", width: "100%", gap: 12 }}>
//               <TouchableOpacity
//                 style={{
//                   flex: 1,
//                   paddingVertical: 12,
//                   paddingHorizontal: 24,
//                   borderRadius: 8,
//                   borderWidth: 1,
//                   borderColor: "#6B57F2",
//                   backgroundColor: COLORS.white,
//                   alignItems: "center",
//                 }}
//                 onPress={handleCancelDelete}
//               >
//                 <Text style={{ fontSize: 14, fontWeight: "600", color: "#6B57F2" }}>CANCEL</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={{
//                   flex: 1,
//                   paddingVertical: 12,
//                   paddingHorizontal: 24,
//                   borderRadius: 8,
//                   backgroundColor: "#6B57F2",
//                   alignItems: "center",
//                 }}
//                 onPress={handleConfirmDelete}
//               >
//                 <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.white }}>DELETE</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* ⭐ Slot Info Popup (Web jaisa - information display) */}
//       <Modal
//         visible={infoPopupVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setInfoPopupVisible(false)}
//       >
//         <TouchableOpacity
//           style={{
//             flex: 1,
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//           activeOpacity={1}
//           onPress={() => setInfoPopupVisible(false)}
//         >
//           {selectedSlotInfo && (
//             <TouchableOpacity
//               activeOpacity={1}
//               onPress={(e) => e.stopPropagation()}
//               style={{
//                 backgroundColor: COLORS.white,
//                 borderRadius: 12,
//                 padding: 20,
//                 width: "85%",
//                 maxWidth: 350,
//                 shadowColor: "#000",
//                 shadowOffset: { width: 0, height: 2 },
//                 shadowOpacity: 0.25,
//                 shadowRadius: 3.84,
//                 elevation: 5,
//               }}
//             >
//               {/* Close button */}
//               <TouchableOpacity
//                 style={{ alignSelf: "flex-end", marginBottom: 10 }}
//                 onPress={() => setInfoPopupVisible(false)}
//               >
//                 {/* <MaterialIcons name="close" size={24} color="#6B7280" /> */}
//                 <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
//               </TouchableOpacity>

//               {/* Slot Information */}
//               <View style={{ marginBottom: 12 }}>
//                 <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 16 }}>
//                   {subjectMap[selectedSlotInfo.slot.subjectId] || selectedSlotInfo.slot.subjectId || "Subject"}
//                 </Text>
                
//                 <View style={{ marginBottom: 8 }}>
//                   <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Teacher</Text>
//                   <Text style={{ fontSize: 14, fontWeight: "600", color: "#111827" }}>
//                     {teacherMap[selectedSlotInfo.slot.teacherId] || selectedSlotInfo.slot.teacherId || "N/A"}
//                   </Text>
//                 </View>

//                 <View style={{ marginBottom: 8 }}>
//                   <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Room</Text>
//                   <Text style={{ fontSize: 14, fontWeight: "600", color: "#111827" }}>
//                     {classroomMap[selectedSlotInfo.slot.classRoomId] || selectedSlotInfo.slot.classRoomId || "N/A"}
//                   </Text>
//                 </View>

//                 <View style={{ marginBottom: 8 }}>
//                   <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Time</Text>
//                   <Text style={{ fontSize: 14, fontWeight: "600", color: "#111827" }}>
//                     {selectedSlotInfo.slot.startTime} - {selectedSlotInfo.slot.endTime}
//                   </Text>
//                 </View>
//               </View>

//               {/* Action buttons */}
//               <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
//                 <TouchableOpacity
//                   style={{
//                     flex: 1,
//                     backgroundColor: "#F3F4F6",
//                     paddingVertical: 12,
//                     borderRadius: 8,
//                     alignItems: "center",
//                     marginRight: 8,
//                   }}
//                   onPress={() => {
//                     setInfoPopupVisible(false);
//                     if (onEditSlot) {
//                       handleEdit(selectedSlotInfo.slot, selectedSlotInfo.day, selectedSlotInfo.hour);
//                     }
//                   }}
//                 >
//                   <Text style={{ fontSize: 14, fontWeight: "600", color: "#6B7280" }}>Edit</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={{
//                     flex: 1,
//                     backgroundColor: "#EF4444",
//                     paddingVertical: 12,
//                     borderRadius: 8,
//                     alignItems: "center",
//                     marginLeft: 8,
//                   }}
//                   onPress={() => {
//                     setInfoPopupVisible(false);
//                     handleDeleteClick(selectedSlotInfo.slot, selectedSlotInfo.day, selectedSlotInfo.hour);
//                   }}
//                 >
//                   <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.white }}>Delete</Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableOpacity>
//           )}
//         </TouchableOpacity>
//       </Modal>

//       {/* ⭐ View Modal - Shows all short slots (15/30/45 min) for an hour */}
//       <Modal
//         visible={viewModalVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setViewModalVisible(false)}
//       >
//         <TouchableOpacity
//           style={{
//             flex: 1,
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//           activeOpacity={1}
//           onPress={() => setViewModalVisible(false)}
//         >
//           {viewModalData && (
//             <TouchableOpacity
//               activeOpacity={1}
//               onPress={(e) => e.stopPropagation()}
//               style={{
//                 backgroundColor: COLORS.white,
//                 borderRadius: 12,
//                 padding: 20,
//                 width: "90%",
//                 maxWidth: 400,
//                 maxHeight: "80%",
//                 shadowColor: "#000",
//                 shadowOffset: { width: 0, height: 2 },
//                 shadowOpacity: 0.25,
//                 shadowRadius: 3.84,
//                 elevation: 5,
//               }}
//             >
//               {/* Close button */}
//               <TouchableOpacity
//                 style={{ alignSelf: "flex-end", marginBottom: 16 }}
//                 onPress={() => setViewModalVisible(false)}
//               >
//                 {/* <MaterialIcons name="close" size={24} color="#6B7280" /> */}
//                 <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
//               </TouchableOpacity>

//               {/* Header */}
//               <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 16 }}>
//                 {viewModalData.day.toLocaleDateString(undefined, {
//                   weekday: "short",
//                   month: "short",
//                   day: "numeric",
//                 })} - {viewModalData.hour}
//               </Text>

//               {/* Slots List */}
//               {viewModalData.slots.length > 0 ? (
//                 <FlatList
//                   data={viewModalData.slots}
//                   keyExtractor={(slot, index) => `view-slot-${slot.id || index}`}
//                   showsVerticalScrollIndicator
//                   nestedScrollEnabled
//                   keyboardShouldPersistTaps="handled"
//                   style={{ maxHeight: 400 }}
//                   contentContainerStyle={{ paddingBottom: 16 }}
//                   renderItem={({ item: slot }) => {
//                     const { bg: slotColor, text: slotTextColor } = getSubjectColor(slot.subjectId);
//                     const duration = calculateDuration(slot.startTime, slot.endTime);
//                     return (
//                       <View
//                         style={{
//                           backgroundColor: slotColor,
//                           borderRadius: 12,
//                           padding: 12,
//                           marginBottom: 12,
//                         }}
//                       >
//                         <Text style={{ fontSize: 14, fontWeight: "600", color: slotTextColor, marginBottom: 4 }}>
//                           {subjectMap[slot.subjectId] || slot.subjectId || "Subject"}
//                         </Text>
//                         <Text style={{ fontSize: 12, color: slotTextColor, marginBottom: 2 }}>
//                           {teacherMap[slot.teacherId] || slot.teacherId || "Teacher"}
//                         </Text>
//                         <Text style={{ fontSize: 12, color: slotTextColor, marginBottom: 2 }}>
//                           {classroomMap[slot.classRoomId] || slot.classRoomId || "Room"}
//                         </Text>
//                         <Text style={{ fontSize: 11, color: slotTextColor, marginTop: 4, marginBottom: 8 }}>
//                           {slot.startTime} - {slot.endTime} ({duration} min)
//                         </Text>

//                         {/* Action buttons - right below info */}
//                         <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 4 }}>
//                           <TouchableOpacity
//                             style={{
//                               flexDirection: "row",
//                               alignItems: "center",
//                               paddingVertical: 6,
//                               paddingHorizontal: 12,
//                               backgroundColor: "rgba(255,255,255,0.6)",
//                               borderRadius: 999,
//                             }}
//                             onPress={() => {
//                               setViewModalVisible(false);
//                               handleEdit(slot, viewModalData.day, viewModalData.hour);
//                             }}
//                           >
//                             {/* 
//                              */}
//                               <AutoHeightImage source={IMAGES.editIcon} width={20} />
//                             <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151" }}>Edit</Text>
//                           </TouchableOpacity>

//                           <TouchableOpacity
//                             style={{
//                               flexDirection: "row",
//                               alignItems: "center",
//                               paddingVertical: 6,
//                               paddingHorizontal: 12,
//                               backgroundColor: "rgba(239,68,68,0.15)",
//                               borderRadius: 999,
//                             }}
//                             onPress={() => {
//                               setViewModalVisible(false);
//                               handleDeleteClick(slot, viewModalData.day, viewModalData.hour);
//                             }}
//                           >
//                             {/* <MaterialIcons name="delete" size={16} color="#B91C1C" style={{ marginRight: 4 }} /> */}
//                              <AutoHeightImage source={IMAGES.deleteIcon}  width={20} />
//                             <Text style={{ fontSize: 12, fontWeight: "600", color: "#B91C1C" }}>Delete</Text>
//                           </TouchableOpacity>
//                         </View>
//                       </View>
//                     );
//                   }}
//                 />
//               ) : (
//                 <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center", padding: 20 }}>
//                   No additional slots
//                 </Text>
//               )}
//             </TouchableOpacity>
//           )}
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// };

// export default TimetableGrid;



import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
} from "react-native";
import { getIconComponent } from "../../../../utils/getIconComponent";
import { COLORS } from "../../../../colors";
import { IMAGES } from "../../../../images";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";


const screenW = Dimensions.get("window").width;
const MaterialIcons = getIconComponent("MaterialIcons");

export type TTimetableCell = {
  dayIndex: number;
  day: Date;
  hour: string;
};

type TimetableGridProps = {
  days: Date[];
  hours: string[];
  activeCell: TTimetableCell | null;
  onCellPress: (cell: TTimetableCell) => void;
  timeTableData?: any;
  repeatDays?: { [key: string]: any[] };
  teacherMap?: { [key: string]: string };
  subjectMap?: { [key: string]: string };
  classroomMap?: { [key: string]: string };
  onEditSlot?: (slot: any, day: Date, hour: string) => void;
  onDeleteSlot?: (slot: any, day: Date, hour: string) => void;
};

// Convert day to day key (M, T, W, Th, F, Sa, Su)
const getDayKey = (day: Date): string => {
  const dayOfWeek = day.getDay();
  const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
  return dayKeys[dayOfWeek];
};

const ROW_HEIGHT = 70; // ⭐ original row height

const gridStyles = StyleSheet.create({
  outer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 18,
    elevation: 2,
    width: '100%',
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    overflow: "hidden",
  },

  timeColumn: {
    width: 90,
    borderRightWidth: 1,
    borderColor: "#F3F4F6",
    paddingVertical: 8,
    paddingLeft: 10,
    backgroundColor: "#FAFBFD",
  },

  timeHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },

  daysWrapper: { overflow: "hidden", flex: 1 },

  daysContainer: {
    flexDirection: "row",
    minWidth: Math.max(screenW - 120, 600),
  },

  dayHeader: {
    width: 140,
    height: 30,            // ⭐ FIXED COMPACT HEIGHT (as you want)
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 1,
    borderColor: "#F3F4F6",
    backgroundColor: "#FFF",
  },

  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },

  gridBodyWrapper: { flexDirection: "row", flex: 1 },

  gridBodyColumnWrapper: { flexDirection: "column" },

  gridBodyRow: {
    flexDirection: "row",
    height: ROW_HEIGHT,
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
  },

  timeCell: {
    width: 90,
    height: ROW_HEIGHT,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 10,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#F3F4F6",
    backgroundColor: "#FAFBFD",
  },

  timeCellText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  dayCell: {
    width: 140,
    height: ROW_HEIGHT, // ⭐ Fixed height for same size
    padding: 0, // ⭐ No padding - blocks touch border
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderLeftWidth: 1,
    borderRightWidth: 1, // ⭐ Right border like left border
    borderColor: "#F3F4F6",
    position: "relative", // allow overlay controls (view icon)
  },

  activeSlot: {
    backgroundColor: "rgba(67, 97, 238, 0.08)",
  },

  plusBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    alignItems: "center",
    justifyContent: "center",
  },

  plusText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: "700",
  },
  slotContainer: {
    width: "100%",
    alignSelf: "stretch", // ⭐ Stretch to full width - touch right border
    paddingLeft: 0, // ⭐ No left padding - touch left border
    paddingRight: 0, // ⭐ No right padding - touch right border horizontally
    paddingBottom: 0, // ⭐ No bottom padding - fill vertically
    paddingTop: 0, // ⭐ No top padding - fill vertically
    borderRadius: 6, // ⭐ Slightly rounded corners like screenshot
    marginBottom: 0, // ⭐ No margin - touch border
    marginRight: 0, // ⭐ No right margin - touch right border
    marginLeft: 0, // ⭐ No left margin - touch left border
    height: "100%", // ⭐ Full height to fill white space
    flexDirection: "column", // ⭐ Column layout
    justifyContent: "space-between", // ⭐ Space between content and time
  },
  slotContent: {
    flex: 1, // ⭐ Take available space, push time to bottom
    justifyContent: "flex-start",
    marginBottom: 12, // ⭐ More space between room and time (time aur niche)
    paddingLeft: 6, // ⭐ Padding for text from left border
    paddingRight: 50, // ⭐ Space for icons on right
    paddingTop: 6, // ⭐ Top padding for content
  },
  slotText: {
    fontSize: 10,
    color: "#111827",
    fontWeight: "400", // ⭐ Thinner font weight
    marginBottom: 1, // ⭐ Even less spacing (classroom aur upar)
  },
  slotTime: {
    fontSize: 9,
    color: "#6B7280",
    fontWeight: "300", // ⭐ Lighter font weight for time (different from text)
    marginTop: 6, // ⭐ More space from room above (time aur niche)
    alignSelf: "flex-start", // ⭐ Align time to left
    paddingLeft: 6, // ⭐ Padding for time from left border
    paddingBottom: 6, // ⭐ Bottom padding for time
  },
  editIcon: {
    position: "absolute",
    top: 4, // ⭐ Near border (moved up)
    right: 4, // ⭐ Right side near border
    padding: 4,
    zIndex: 10001,
    elevation: 10,
  },
  deleteIcon: {
    position: "absolute",
    top: 4, // ⭐ Near border (moved up)
    right: 26, // ⭐ Next to edit icon (space for edit icon)
    padding: 4,
    zIndex: 10001,
    elevation: 10,
  },
  viewIcon: {
    position: "absolute",
    top: 28, // ⭐ Below delete icon
    right: 4, // ⭐ Right side near border
    padding: 4,
    zIndex: 10001,
    elevation: 10,
  },
});

const TimetableGrid = ({
  days,
  hours,
  activeCell,
  onCellPress,
  timeTableData,
  repeatDays = {},
  teacherMap = {},
  subjectMap = {},
  classroomMap = {},
  onEditSlot,
  onDeleteSlot,
}: TimetableGridProps) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<{ slot: any; day: Date; hour: string } | null>(null);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState<{ slot: any; day: Date; hour: string } | null>(null);
  const [infoPopupVisible, setInfoPopupVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewModalData, setViewModalData] = useState<{ day: Date; hour: string; slots: any[] } | null>(null);

  // ⭐ COLOR PALETTE (Web jaisa)
  const subjectColorMap = useRef<{ [key: string]: string }>({});
  const subjectTextColorMap = useRef<{ [key: string]: string }>({});
  const bgPalette = [
    "#B3E5FC", // Darker Light Blue (was Light Cyan)
    "#C8E6C9", // Darker Soft Mint
    "#FFF59D", // Darker Pastel Lemon
    "#F48FB1", // Darker Soft Pink
    "#CE93D8", // Darker Lilac
    "#FFCC80", // Darker Apricot
  ];
  const textPalette = ["#0d47a1", "#1b5e20", "#f57f17", "#880e4f", "#311b92", "#4a148c"];

  // ⭐ GET SUBJECT COLOR (Web jaisa logic)
  const getSubjectColor = (subjectId: string) => {
    if (!subjectId) {
      return { bg: "#E5E7EB", text: "#111827" }; // Default gray
    }
    if (!subjectColorMap.current[subjectId]) {
      const index = Object.keys(subjectColorMap.current).length % bgPalette.length;
      subjectColorMap.current[subjectId] = bgPalette[index];
      subjectTextColorMap.current[subjectId] = textPalette[index];
    }
    return {
      bg: subjectColorMap.current[subjectId],
      text: subjectTextColorMap.current[subjectId],
    };

  };

  // ⭐ CALCULATE DURATION in minutes
  const calculateDuration = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    
    const startParts = startTime.split(":");
    const endParts = endTime.split(":");
    
    if (startParts.length < 2 || endParts.length < 2) return 0;
    
    const startMinutes = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
    const endMinutes = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);
    
    return endMinutes - startMinutes;
  };

  // ⭐ FIND ALL SLOTS for a specific day and hour (Web jaisa - multiple slots support)
  // ⚠️ IMPORTANT: Only return slots that START in this hour (not slots that just overlap)
  // This prevents slots from appearing in multiple hour rows
  const findSlots = (day: Date, hour: string) => {
    const dayKey = getDayKey(day);
    const daySlots = repeatDays[dayKey] || [];
    
    // Parse hour to get hour number (e.g., "04:00" -> 4)
    const hourNumber = parseInt(hour.split(":")[0], 10);
    
    // ⭐ Web jaisa: Only show slots that START in this hour
    // A slot belongs to this hour ONLY if its startTime hour matches this hour
    const foundSlots = daySlots.filter((slot: any) => {
      if (!slot.startTime || !slot.endTime) return false;
      
      // Parse startTime to get hour (handle both "04:00" and "4:00" formats)
      const startTimeParts = slot.startTime.split(":");
      if (startTimeParts.length < 2) return false; // Invalid format
      
      const startH = parseInt(startTimeParts[0], 10);
      
      // Only return slots that START in this hour (Web jaisa logic)
      return startH === hourNumber;
    });
  
    // Clean slot IDs
    foundSlots.forEach((slot: any) => {
      if (slot.id && typeof slot.id === 'string') {
        slot.id = slot.id.replace(/^["']+|["']+$/g, '').trim();
      }
    });
    
    return foundSlots;
  };

  // ⭐ HANDLE VIEW ICON CLICK
  const handleViewClick = (day: Date, hour: string) => {
    const slots = findSlots(day, hour);
    const secondarySlots = slots.slice(1); // show all additional slots in modal
    setViewModalData({ day, hour, slots: secondarySlots });
    setViewModalVisible(true);
  };

  // Handle edit button click
  const handleEdit = (slot: any, day: Date, hour: string) => {
    console.log("✏️ Edit icon clicked!");
    console.log("✏️ Slot data:", slot);
    console.log("✏️ Day:", day);
    console.log("✏️ Hour:", hour);
    if (onEditSlot) {
      console.log("✏️ Calling onEditSlot callback...");
      onEditSlot(slot, day, hour);
    } else {
      console.warn("⚠️ onEditSlot callback not provided!");
    }
  };

  // Handle delete button click
  const handleDeleteClick = (slot: any, day: Date, hour: string) => {
    console.log("🗑️ Delete icon clicked!");
    setSlotToDelete({ slot, day, hour });
    setDeleteDialogVisible(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (slotToDelete && onDeleteSlot) {
      onDeleteSlot(slotToDelete.slot, slotToDelete.day, slotToDelete.hour);
    }
    setDeleteDialogVisible(false);
    setSlotToDelete(null);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setDeleteDialogVisible(false);
    setSlotToDelete(null);
  };

  return (
    <View style={gridStyles.outer}>

      {/* HEADER (moves when grid scrolls) */}
      <View style={gridStyles.headerRow}>
        <View style={gridStyles.timeColumn}>
          <Text style={gridStyles.timeHeaderText}>Time</Text>
        </View>

        <View style={gridStyles.daysWrapper}>
          <Animated.View
            style={[
              gridStyles.daysContainer,
              { transform: [{ translateX: Animated.multiply(scrollX, -1) }] },
            ]}
          >
            {days.map((day) => (
              <View key={day.toISOString()} style={gridStyles.dayHeader}>
                <Text style={gridStyles.dayLabel}>
                  {day.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
            ))}
          </Animated.View>
        </View>
      </View>

      {/* BODY (single horizontal scroll controlling ALL rows) */}
      <View style={{ flexDirection: "row" }}>
        {/* FIXED TIME COLUMN */}
        <View>
          {hours.map((hour) => (
            <View key={hour} style={gridStyles.timeCell}>
              <Text style={gridStyles.timeCellText}>{hour}</Text>
            </View>
          ))}
        </View>

        {/* ALL GRID COLUMNS IN ONE SCROLL */}
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
        >
          <View style={gridStyles.gridBodyColumnWrapper}>
            {hours.map((hour) => (
              <View key={hour} style={gridStyles.gridBodyRow}>
                {days.map((day, dayIndex) => {
                  const slots = findSlots(day, hour); // ⭐ Get all slots for this hour
                  const primarySlot = slots[0];
                  const secondarySlots = slots.slice(1);
                  const showViewIcon = secondarySlots.length > 0;
                  const primaryColors = primarySlot ? getSubjectColor(primarySlot.subjectId) : null;
                  const isActive =
                    activeCell &&
                    activeCell.dayIndex === dayIndex &&
                    activeCell.hour === hour;


                  return (
                    <View key={`${day.toISOString()}-${hour}`} style={gridStyles.dayCell}>
                      {primarySlot ? (
                        <TouchableOpacity
                          key={`slot-${primarySlot.id || 0}`}
                          activeOpacity={0.8}
                          onPress={() => {
                            setSelectedSlotInfo({ slot: primarySlot, day, hour });
                            setInfoPopupVisible(true);
                          }}
                          style={{ width: "100%" }}
                        >
                          <View
                            style={[
                              gridStyles.slotContainer,
                              {
                                backgroundColor: primaryColors?.bg || "#E5E7EB",
                              },
                            ]}
                            pointerEvents="box-none"
                          >
                            <View style={gridStyles.slotContent} pointerEvents="none">
                              <Text style={[gridStyles.slotText, { color: primaryColors?.text || "#111827" }]} numberOfLines={1}>
                                {subjectMap[primarySlot.subjectId] || primarySlot.subjectId || "Subject"}
                              </Text>
                              <Text style={[gridStyles.slotText, { color: primaryColors?.text || "#111827", marginBottom: 0 }]} numberOfLines={1}>
                                {teacherMap[primarySlot.teacherId] ? `Prof. ${teacherMap[primarySlot.teacherId]}` : (primarySlot.teacherId || "Teacher")}
                              </Text>
                              <Text style={[gridStyles.slotText, { color: primaryColors?.text || "#111827", marginBottom: 0 }]} numberOfLines={1}>
                                {classroomMap[primarySlot.classRoomId] || primarySlot.classRoomId || "Room"}
                              </Text>
                              <Text style={[gridStyles.slotTime, { color: primaryColors?.text || "#374151" }]}>
                                {primarySlot.startTime} - {primarySlot.endTime}
                              </Text>
                            </View>
                            {/* Edit Icon */}
                            <TouchableOpacity
                              style={gridStyles.editIcon}
                              onPress={(e) => {
                                e.stopPropagation();
                                handleEdit(primarySlot, day, hour);
                              }}
                              activeOpacity={0.7}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                             <AutoHeightImage source={IMAGES.editIcon} width={15} />
                            </TouchableOpacity>
                            {/* Delete Icon */}
                            <TouchableOpacity
                              style={gridStyles.deleteIcon}
                              onPress={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(primarySlot, day, hour);
                              }}
                              activeOpacity={0.7}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              {/* <MaterialIcons name="delete" size={16} color="#EF4444" /> */}
                              {/* <AutoHeightImage source={IMAGES.editIcon} width={20} /> */}
                              <AutoHeightImage source={IMAGES.deleteIcon} width={15} />
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[
                            {width: "100%", 
                              height: "100%",
                              justifyContent: "center",  // ⭐ Center vertically
                              alignItems: "center", 
                              
                              },
                            isActive && gridStyles.activeSlot,
                          ]}
                          onPress={() => onCellPress({ dayIndex, day, hour })}
                        >
                          {isActive && (
                            <View style={gridStyles.plusBadge}>
                              <Text style={gridStyles.plusText}>+</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      )}
                      {showViewIcon && (
                         <TouchableOpacity
                           style={gridStyles.viewIcon}
                           onPress={(e) => {
                             e.stopPropagation();
                             console.log("👁️ View icon clicked for hour:", hour);
                             handleViewClick(day, hour);
                           }}
                           activeOpacity={0.7}
                           hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                         >
                           {/* <MaterialIcons name="visibility" size={16} color="#6B7280" /> */}
                           <AutoHeightImage source={IMAGES.calendarIcon} width={15} />

                         </TouchableOpacity>
                       )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </Animated.ScrollView>
      </View>

      {/* Delete Confirmation Dialog */}
      <Modal
        visible={deleteDialogVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 12,
              padding: 24,
              width: "85%",
              maxWidth: 400,
              alignItems: "center",
            }}
          >
            {/* Close Icon */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                padding: 4,
              }}
              onPress={handleCancelDelete}
            >
              {/* <MaterialIcons name="close" size={20} color="#6B7280" /> */}
              <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
            </TouchableOpacity>

            {/* Warning Icon */}
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                borderWidth: 3,
                borderColor: "#F97316",
                backgroundColor: "#FFF7ED",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 32, color: "#F97316", fontWeight: "700" }}>!</Text>
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#111827",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Are you sure?
            </Text>

            {/* Message */}
            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              You won't be able to revert this slot!
            </Text>

            {/* Buttons */}
            <View style={{ flexDirection: "row", width: "100%", gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#6B57F2",
                  backgroundColor: COLORS.white,
                  alignItems: "center",
                }}
                onPress={handleCancelDelete}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#6B57F2" }}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  backgroundColor: "#6B57F2",
                  alignItems: "center",
                }}
                onPress={handleConfirmDelete}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.white }}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ⭐ Slot Info Popup (Web jaisa - information display) */}
      <Modal
        visible={infoPopupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoPopupVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={() => setInfoPopupVisible(false)}
        >
          {selectedSlotInfo && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 12,
                padding: 20,
                width: "85%",
                maxWidth: 350,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              {/* Close button */}
              <TouchableOpacity
                style={{ alignSelf: "flex-end", marginBottom: 10 }}
                onPress={() => setInfoPopupVisible(false)}
              >
                {/* <MaterialIcons name="close" size={24} color="#6B7280" /> */}
                <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
              </TouchableOpacity>

              {/* Slot Information */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 16 }}>
                  {subjectMap[selectedSlotInfo.slot.subjectId] || selectedSlotInfo.slot.subjectId || "Subject"}
                </Text>
                
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Teacher</Text>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#111827" }}>
                    {teacherMap[selectedSlotInfo.slot.teacherId] ? `Prof. ${teacherMap[selectedSlotInfo.slot.teacherId]}` : (selectedSlotInfo.slot.teacherId || "N/A")}
                  </Text>
                </View>

                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Room</Text>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#111827" }}>
                    {classroomMap[selectedSlotInfo.slot.classRoomId] || selectedSlotInfo.slot.classRoomId || "N/A"}
                  </Text>
                </View>

                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Time</Text>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#111827" }}>
                    {selectedSlotInfo.slot.startTime} - {selectedSlotInfo.slot.endTime}
                  </Text>
                </View>
              </View>

              {/* Action buttons */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#F3F4F6",
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: "center",
                    marginRight: 8,
                  }}
                  onPress={() => {
                    setInfoPopupVisible(false);
                    if (onEditSlot) {
                      handleEdit(selectedSlotInfo.slot, selectedSlotInfo.day, selectedSlotInfo.hour);
                    }
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#6B7280" }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#EF4444",
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                  onPress={() => {
                    setInfoPopupVisible(false);
                    handleDeleteClick(selectedSlotInfo.slot, selectedSlotInfo.day, selectedSlotInfo.hour);
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.white }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Modal>

      {/* ⭐ View Modal - Shows all short slots (15/30/45 min) for an hour */}
      <Modal
        visible={viewModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setViewModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={() => setViewModalVisible(false)}
        >
          {viewModalData && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 12,
                padding: 20,
                width: "90%",
                maxWidth: 400,
                maxHeight: "80%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              {/* Close button */}
              <TouchableOpacity
                style={{ alignSelf: "flex-end", marginBottom: 16 }}
                onPress={() => setViewModalVisible(false)}
              >
                {/* <MaterialIcons name="close" size={24} color="#6B7280" /> */}
                <AutoHeightImage source={IMAGES.crossPrimaryIcon} width={24} />
              </TouchableOpacity>

              {/* Header */}
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 16 }}>
                {viewModalData.day.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })} - {viewModalData.hour}
              </Text>

              {/* Slots List */}
              {viewModalData.slots.length > 0 ? (
                <FlatList
                  data={viewModalData.slots}
                  keyExtractor={(slot, index) => `view-slot-${slot.id || index}`}
                  showsVerticalScrollIndicator
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                  style={{ maxHeight: 400 }}
                  contentContainerStyle={{ paddingBottom: 16 }}
                  renderItem={({ item: slot }) => {
                    const { bg: slotColor, text: slotTextColor } = getSubjectColor(slot.subjectId);
                    const duration = calculateDuration(slot.startTime, slot.endTime);
                    return (
                      <View
                        style={{
                          backgroundColor: slotColor,
                          borderRadius: 12,
                          padding: 12,
                          marginBottom: 12,
                        }}
                      >
                        <Text style={{ fontSize: 14, fontWeight: "600", color: slotTextColor, marginBottom: 4 }}>
                          {subjectMap[slot.subjectId] || slot.subjectId || "Subject"}
                        </Text>
                        <Text style={{ fontSize: 12, color: slotTextColor, marginBottom: 2 }}>
                          {teacherMap[slot.teacherId] ? `Prof. ${teacherMap[slot.teacherId]}` : (slot.teacherId || "Teacher")}
                        </Text>
                        <Text style={{ fontSize: 12, color: slotTextColor, marginBottom: 2 }}>
                          {classroomMap[slot.classRoomId] || slot.classRoomId || "Room"}
                        </Text>
                        <Text style={{ fontSize: 11, color: slotTextColor, marginTop: 4, marginBottom: 8 }}>
                          {slot.startTime} - {slot.endTime} ({duration} min)
                        </Text>

                        {/* Action buttons - right below info */}
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 4 }}>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingVertical: 6,
                              paddingHorizontal: 12,
                              backgroundColor: "rgba(255,255,255,0.6)",
                              borderRadius: 999,
                            }}
                            onPress={() => {
                              setViewModalVisible(false);
                              handleEdit(slot, viewModalData.day, viewModalData.hour);
                            }}
                          >
                            {/* 
                             */}
                              <AutoHeightImage source={IMAGES.editIcon} width={20} />
                            <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151" }}>Edit</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingVertical: 6,
                              paddingHorizontal: 12,
                              backgroundColor: "rgba(239,68,68,0.15)",
                              borderRadius: 999,
                            }}
                            onPress={() => {
                              setViewModalVisible(false);
                              handleDeleteClick(slot, viewModalData.day, viewModalData.hour);
                            }}
                          >
                            {/* <MaterialIcons name="delete" size={16} color="#B91C1C" style={{ marginRight: 4 }} /> */}
                             <AutoHeightImage source={IMAGES.deleteIcon}  width={20} />
                            <Text style={{ fontSize: 12, fontWeight: "600", color: "#B91C1C" }}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                />
              ) : (
                <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center", padding: 20 }}>
                  No additional slots
                </Text>
              )}
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default TimetableGrid;



