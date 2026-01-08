

// import React, { useRef, useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from "react-native";
// import { COLORS } from "../../../../colors";

// type TBatchOption = {
//   id?: string;
//   label: string;
// };

// type TimetableHeaderProps = {
//   selectedBatch: string;
//   batchOptions: TBatchOption[];
//   onBatchSelect: (batchLabel: string) => void;
//   onAddSlotPress: () => void;
//   monthLabel: string;
//   onPrevPress: () => void;
//   onNextPress: () => void;
//   onBatchDropdownToggle?: (open: boolean) => void;
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     marginBottom: 18,
//     elevation: 2,
//   },
//   topRow: { flexDirection: "column", gap: 10 },
//   title: { fontSize: 18, fontWeight: "600", color: "#111" },
//   batchHighlight: { color: "#0B4DA2", fontWeight: "700" },
//   controlsRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   inputWrapper: {
//     flex: 1,
//   },
//   inputBox: {
//     height: 45,
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     borderRadius: 10,
//     justifyContent: "center",
//     backgroundColor: "#FFF",
//   },
//   dropdownItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: "#EEE",
//   },
//   addButton: {
//     backgroundColor: "#0B4DA2",
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   addButtonText: { color: "#FFF", fontWeight: "700" },
//   monthRow: {
//     marginTop: 20,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 18,
//   },
//   iconBox: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#DDD",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   monthLabel: { fontSize: 18, fontWeight: "700" },
// });

// const TimetableHeader = ({
//   selectedBatch,
//   batchOptions,
//   onBatchSelect,
//   onAddSlotPress,
//   monthLabel,
//   onPrevPress,
//   onNextPress,
//   onBatchDropdownToggle,
// }: TimetableHeaderProps) => {

//   const [open, setOpen] = useState(false);

//   const dropdownRef = useRef(null);
//   const [dropdownY, setDropdownY] = useState(0);
//   const [dropdownLeft, setDropdownLeft] = useState(0);
//   const [dropdownWidth, setDropdownWidth] = useState(0);

//   return (
//     <View style={styles.container}>
//       <View style={styles.topRow}>

//         <Text style={styles.title}>
//           Weekly Schedule for - <Text style={styles.batchHighlight}>{selectedBatch}</Text>
//         </Text>

//         <View style={styles.controlsRow}>

//           <View
//             ref={dropdownRef}
//             style={styles.inputWrapper}
//             onLayout={() => {
//               dropdownRef.current?.measure((fx, fy, w, h, px, py) => {
//                 setDropdownY(py + h + 5);
//                 setDropdownLeft(px);
//                 setDropdownWidth(w);
//               });
//             }}
//           >

//             <TouchableOpacity
//               style={styles.inputBox}
//               onPress={() => {
//                 const next = !open;
//                 setOpen(next);
//                 onBatchDropdownToggle?.(next);

//                 dropdownRef.current?.measure((fx, fy, w, h, px, py) => {
//                   setDropdownY(py + h - 25);
//                   setDropdownLeft(px);
//                   setDropdownWidth(w);
//                 });
//               }}
//             >
//               <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 12 }}>
//                 <Text style={{ fontSize: 14, fontWeight: "600" }}>
//                   {selectedBatch || "Select batch"}
//                 </Text>
//                 <Text>{open ? "▲" : "▼"}</Text>
//               </View>
//             </TouchableOpacity>

//           </View>

//           <TouchableOpacity style={styles.addButton} onPress={onAddSlotPress}>
//             <Text style={styles.addButtonText}>ADD SLOT +</Text>
//           </TouchableOpacity>

//         </View>
//       </View>

//       {/* Month Navigation */}
//       <View style={styles.monthRow}>
//         <TouchableOpacity style={styles.iconBox} onPress={onPrevPress}>
//           <Text>{"<"}</Text>
//         </TouchableOpacity>

//         <Text style={styles.monthLabel}>{monthLabel}</Text>

//         <TouchableOpacity style={styles.iconBox} onPress={onNextPress}>
//           <Text>{">"}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Final Modal Dropdown */}
//       {open && (
//         <Modal transparent animationType="fade">
//           <TouchableOpacity
//             style={{ flex: 1 }}
//             activeOpacity={1}
//             onPress={() => {
//               setOpen(false);
//               onBatchDropdownToggle?.(false);
//             }}
//           >
//             <View
//               style={{
//                 position: "absolute",
//                 top: dropdownY,
//                 left: dropdownLeft,
//                 width: dropdownWidth,
//                 backgroundColor: "#FFF",
//                 borderRadius: 10,
//                 borderWidth: 1,
//                 borderColor: "#C9D4F1",
//                 maxHeight: 150,
//                 elevation: 20,
//               }}
//             >
//               <ScrollView nestedScrollEnabled showsVerticalScrollIndicator keyboardShouldPersistTaps="handled">
//                 {batchOptions.map((item, index) => {
//                   const active = selectedBatch === item.label;

//                   return (
//                     <TouchableOpacity
//                       key={item.id || index}
//                       style={[styles.dropdownItem, active && { backgroundColor: "rgba(0,0,255,0.08)" }]}
//                       onPress={() => {
//                         onBatchSelect(item.label);
//                         setOpen(false);
//                         onBatchDropdownToggle?.(false);
//                       }}
//                     >
//                       <Text style={{ fontSize: 14 }}>{item.label}</Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           </TouchableOpacity>
//         </Modal>
//       )}

//     </View>
//   );
// };

// export default TimetableHeader;



// import React, { useRef, useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from "react-native";
// import { COLORS } from "../../../../colors";
// import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
// import { IMAGES } from "../../../../images";

// type TBatchOption = {
//   id?: string;
//   label: string;
// };

// type TimetableHeaderProps = {
//   selectedBatch: string;
//   batchOptions: TBatchOption[];
//   onBatchSelect: (batchLabel: string) => void;
//   onAddSlotPress: () => void;
//   monthLabel: string;
//   onPrevPress: () => void;
//   onNextPress: () => void;
//   onBatchDropdownToggle?: (open: boolean) => void;
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     marginBottom: 18,
//     elevation: 2,
//   },
//   topRow: { flexDirection: "column", gap: 10 },
//   title: { fontSize: 18, fontWeight: "600", color: "#111" },
//   batchHighlight: { color: "#0B4DA2", fontWeight: "700" },
//   controlsRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   inputWrapper: {
//     flex: 1,
//   },
//   inputBox: {
//     height: 45,
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     borderRadius: 10,
//     justifyContent: "center",
//     backgroundColor: "#FFF",
//   },
//   dropdownItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: "#EEE",
//   },
//   addButton: {
//     backgroundColor: "#0B4DA2",
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   addButtonText: { color: "#FFF", fontWeight: "700" },
//   monthRow: {
//     marginTop: 20,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 18,
//   },
//   iconBox: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#DDD",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   monthLabel: { fontSize: 18, fontWeight: "700" },
// });

// const TimetableHeader = ({
//   selectedBatch,
//   batchOptions,
//   onBatchSelect,
//   onAddSlotPress,
//   monthLabel,
//   onPrevPress,
//   onNextPress,
//   onBatchDropdownToggle,
// }: TimetableHeaderProps) => {

//   const [open, setOpen] = useState(false);

//   const dropdownRef = useRef(null);
//   const [dropdownY, setDropdownY] = useState(0);
//   const [dropdownLeft, setDropdownLeft] = useState(0);
//   const [dropdownWidth, setDropdownWidth] = useState(0);

//   return (
//     <View style={styles.container}>
//       <View style={styles.topRow}>

//         <Text style={styles.title}>
//           Weekly Schedule for - <Text style={styles.batchHighlight}>{selectedBatch}</Text>
//         </Text>

//         <View style={styles.controlsRow}>

//           <View
//             ref={dropdownRef}
//             style={styles.inputWrapper}
//             onLayout={() => {
//               dropdownRef.current?.measure((fx, fy, w, h, px, py) => {
//                 setDropdownY(py + h + 5);
//                 setDropdownLeft(px);
//                 setDropdownWidth(w);
//               });
//             }}
//           >

//             <TouchableOpacity
//               style={styles.inputBox}
//               onPress={() => {
//                 const next = !open;
//                 setOpen(next);
//                 onBatchDropdownToggle?.(next);

//                 dropdownRef.current?.measure((fx, fy, w, h, px, py) => {
//                   setDropdownY(py + h - 25);
//                   setDropdownLeft(px);
//                   setDropdownWidth(w);
//                 });
//               }}
//             >
//               <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 12 }}>
//                 <Text style={{ fontSize: 14, fontWeight: "600" }}>
//                   {selectedBatch || "Select batch"}
//                 </Text>
//                 <Text>{open ? "▲" : "▼"}</Text>
//               </View>
//             </TouchableOpacity>

//           </View>

//           <TouchableOpacity style={styles.addButton} onPress={onAddSlotPress}>
//             <Text style={styles.addButtonText}>ADD SLOT +</Text>
//           </TouchableOpacity>

//         </View>
//       </View>

//       {/* Month Navigation */}
//       <View style={styles.monthRow}>
//         <TouchableOpacity style={styles.iconBox} onPress={onPrevPress}>
//         <AutoHeightImage width={16} source={IMAGES.chevronArrowLeftIcon} />
//         </TouchableOpacity>

//         <Text style={styles.monthLabel}>{monthLabel}</Text>

//         <TouchableOpacity style={styles.iconBox} onPress={onNextPress}>
//         <AutoHeightImage width={16} source={IMAGES.chevronArrowRightIcon} />
//         </TouchableOpacity>
//       </View>

//       {/* Final Modal Dropdown */}
//       {open && (
//         <Modal transparent animationType="fade">
//           <TouchableOpacity
//             style={{ flex: 1 }}
//             activeOpacity={1}
//             onPress={() => {
//               setOpen(false);
//               onBatchDropdownToggle?.(false);
//             }}
//           >
//             <View
//               style={{
//                 position: "absolute",
//                 top: dropdownY,
//                 left: dropdownLeft,
//                 width: dropdownWidth,
//                 backgroundColor: "#FFF",
//                 borderRadius: 10,
//                 borderWidth: 1,
//                 borderColor: "#C9D4F1",
//                 maxHeight: 150,
//                 elevation: 20,
//               }}
//             >
//               <ScrollView nestedScrollEnabled showsVerticalScrollIndicator keyboardShouldPersistTaps="handled">
//                 {batchOptions.map((item, index) => {
//                   const active = selectedBatch === item.label;

//                   return (
//                     <TouchableOpacity
//                       key={item.id || index}
//                       style={[styles.dropdownItem, active && { backgroundColor: "rgba(0,0,255,0.08)" }]}
//                       onPress={() => {
//                         onBatchSelect(item.label);
//                         setOpen(false);
//                         onBatchDropdownToggle?.(false);
//                       }}
//                     >
//                       <Text style={{ fontSize: 14 }}>{item.label}</Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           </TouchableOpacity>
//         </Modal>
//       )}

//     </View>
//   );
// };

// export default TimetableHeader;


import React, { useRef, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from "react-native";
import { COLORS } from "../../../../colors";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import { useRepeatTimeTableSlotMutation } from "../../../../apis/hooks/timetable/mutations/useRepeatTimeTableSlot.mutation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { useQueryClient } from "@tanstack/react-query";
import { useTimeTableQuery } from "../../../../apis/hooks/teachers/query/useTimeTable.query";

type TBatchOption = {
  id?: string;
  label: string;
};

type TimetableHeaderProps = {
  selectedBatch: string;
  batchOptions: TBatchOption[];
  onBatchSelect: (batchLabel: string) => void;
  onAddSlotPress: () => void;
  monthLabel: string;
  onPrevPress: () => void;
  onNextPress: () => void;
  onBatchDropdownToggle?: (open: boolean) => void;
  currentWeekStart: Date;
  selectedBatchId: string;
  onCopySuccess?: () => void;
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 18,
    elevation: 2,
  },

  topRow: { flexDirection: "column", gap: 10 },

  title: { fontSize: 18, fontWeight: "600", color: "#111" },

  batchHighlight: { color: "#0B4DA2", fontWeight: "700" },

  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  inputWrapper: { flex: 1 },

  inputBox: {
    height: 45,
    borderWidth: 1,
    borderColor: "#C9D4F1",
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: "#FFF",
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  addButton: {
    backgroundColor: "#0B4DA2",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },

  addButtonText: { color: "#FFF", fontWeight: "700" },

  monthRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },

  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
  },

  monthLabel: { fontSize: 18, fontWeight: "700" },

  /* 🔹 COPY BUTTON STYLES */
  copyButtonWrapper: {
    marginTop: 14,
    alignItems: "center",
  },

  copyButton: {
    borderWidth: 1,
    borderColor: "#4F6EF7",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#F7F9FF",
  },

  copyButtonText: {
    color: "#4F6EF7",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});

const TimetableHeader = ({
  selectedBatch,
  batchOptions,
  onBatchSelect,
  onAddSlotPress,
  monthLabel,
  onPrevPress,
  onNextPress,
  onBatchDropdownToggle,
  currentWeekStart,
  selectedBatchId,
  onCopySuccess,
}: TimetableHeaderProps) => {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<View>(null);
  const [dropdownY, setDropdownY] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  const { selectedOrganization } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const repeatSlotMutation = useRepeatTimeTableSlotMutation();

  // ✅ Previous week calculate karein (current week se 7 days pehle)
  const previousWeekStart = useMemo(() => {
    const prev = new Date(currentWeekStart);
    prev.setDate(currentWeekStart.getDate() - 7);
    return prev;
  }, [currentWeekStart]);

  const previousWeekEnd = useMemo(() => {
    const end = new Date(previousWeekStart);
    end.setDate(previousWeekStart.getDate() + 6);
    return end;
  }, [previousWeekStart]);

  // ✅ Current week end date calculate karein
  const currentWeekEnd = useMemo(() => {
    const end = new Date(currentWeekStart);
    end.setDate(currentWeekStart.getDate() + 6);
    return end;
  }, [currentWeekStart]);

  // ✅ Date format helper function
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // "YYYY-MM-DD" format
  };

  // ✅ Current week ka timetable data fetch karein
  const currentWeekParams = useMemo(() => ({
    customerId: selectedOrganization?.customerId || "",
    organizationId: selectedOrganization?.organizationId || "",
    batchId: selectedBatchId,
    startWeekDate: formatDate(currentWeekStart),
    endWeekDate: formatDate(currentWeekEnd),
  }), [selectedOrganization, selectedBatchId, currentWeekStart, currentWeekEnd]);

  const { data: currentWeekData } = useTimeTableQuery(currentWeekParams);

  // ✅ Check karein ki current week empty hai ya nahi (koi slots nahi hain)
  const isCurrentWeekEmpty = useMemo(() => {
    if (!currentWeekData?.data?.repeatDays) {
      return true; // Agar data hi nahi hai to empty hai
    }
    
    const repeatDays = currentWeekData.data.repeatDays;
    const days = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
    
    // Check karein ki kisi bhi day mein slots hain ya nahi
    const hasAnySlots = days.some(day => {
      const daySlots = repeatDays[day];
      return Array.isArray(daySlots) && daySlots.length > 0;
    });
    
    return !hasAnySlots; // Agar koi slots nahi hain to empty hai
  }, [currentWeekData]);

  // ✅ Previous week ka timetable data fetch karein
  const previousWeekParams = useMemo(() => ({
    customerId: selectedOrganization?.customerId || "",
    organizationId: selectedOrganization?.organizationId || "",
    batchId: selectedBatchId,
    startWeekDate: formatDate(previousWeekStart),
    endWeekDate: formatDate(previousWeekEnd),
  }), [selectedOrganization, selectedBatchId, previousWeekStart, previousWeekEnd]);

  const { data: previousWeekData } = useTimeTableQuery(previousWeekParams);

  // ✅ Check karein ki previous week mein data hai ya nahi
  const hasPreviousWeekData = useMemo(() => {
    if (!previousWeekData?.data?.repeatDays) {
      return false;
    }
    
    const repeatDays = previousWeekData.data.repeatDays;
    const days = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
    
    // Check karein ki kisi bhi day mein slots hain ya nahi
    return days.some(day => {
      const daySlots = repeatDays[day];
      return Array.isArray(daySlots) && daySlots.length > 0;
    });
  }, [previousWeekData]);

  // ✅ Copy from previous week handler
  const handleCopyFromPreviousWeek = async () => {
    if (!selectedOrganization || !selectedBatchId) {
      Alert.alert("Error", "Please select organization and batch");
      return;
    }

    // ✅ Pehle check karein ki previous week mein data hai ya nahi
    if (!hasPreviousWeekData) {
      Alert.alert("No Data Found", "No timetable slots found in the previous week to copy.");
      return;
    }

    const payload = {
      customerId: selectedOrganization.customerId,
      organizationId: selectedOrganization.organizationId,
      batchId: selectedBatchId,
      currentWeek: {
        startDate: formatDate(previousWeekStart), // Previous week start (15-21)
        endDate: formatDate(previousWeekEnd),     // Previous week end
      },
      nextWeek: {
        startDate: formatDate(currentWeekStart),  // Current week start (22-28)
        endDate: formatDate(currentWeekEnd),       // Current week end
      },
    };

    try {
      const result = await repeatSlotMutation.mutateAsync(payload);
      
      if (result.statusCode === 200) {
        Alert.alert("Success", result.message || "Slots copied successfully");
        
        // ✅ Timetable queries invalidate karein taaki list refresh ho
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey[0] === "timeTable" || query.queryKey[0] === "getTimeTable";
          },
        });
        
        // ✅ Optional callback call karein
        onCopySuccess?.();
      }
    } catch (error: any) {
      console.error("Error copying slots:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to copy slots. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* TOP SECTION */}
      <View style={styles.topRow}>
        <Text style={styles.title}>
          Weekly Schedule for -{" "}
          <Text style={styles.batchHighlight}>{selectedBatch}</Text>
        </Text>

        <View style={styles.controlsRow}>
          <View
            ref={dropdownRef}
            style={styles.inputWrapper}
            onLayout={() => {
              dropdownRef.current?.measure((fx, fy, w, h, px, py) => {
                setDropdownY(py + h + 5);
                setDropdownLeft(px);
                setDropdownWidth(w);
              });
            }}
          >
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => {
                const next = !open;
                setOpen(next);
                onBatchDropdownToggle?.(next);

                dropdownRef.current?.measure((fx, fy, w, h, px, py) => {
                  setDropdownY(py + h - 25);
                  setDropdownLeft(px);
                  setDropdownWidth(w);
                });
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 12,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600" }}>
                  {selectedBatch || "Select batch"}
                </Text>
                <Text>{open ? "▲" : "▼"}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={onAddSlotPress}>
            <Text style={styles.addButtonText}>ADD SLOT +</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MONTH NAVIGATION */}
      <View style={styles.monthRow}>
        <TouchableOpacity style={styles.iconBox} onPress={onPrevPress}>
          <AutoHeightImage width={16} source={IMAGES.chevronArrowLeftIcon} />
        </TouchableOpacity>

        <Text style={styles.monthLabel}>{monthLabel}</Text>

        <TouchableOpacity style={styles.iconBox} onPress={onNextPress}>
          <AutoHeightImage width={16} source={IMAGES.chevronArrowRightIcon} />
        </TouchableOpacity>
      </View>

      {/* ✅ COPY FROM PREVIOUS WEEK BUTTON - Sirf tab visible jab current week empty ho */}
      {isCurrentWeekEmpty && (
        <View style={styles.copyButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.copyButton,
              repeatSlotMutation.isPending && { opacity: 0.6 }
            ]}
            onPress={handleCopyFromPreviousWeek}
            disabled={repeatSlotMutation.isPending}
          >
            <Text style={styles.copyButtonText}>
              {repeatSlotMutation.isPending 
                ? "COPYING..." 
                : "COPY FROM PREVIOUS WEEK"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* DROPDOWN MODAL */}
      {open && (
        <Modal transparent animationType="fade">
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => {
              setOpen(false);
              onBatchDropdownToggle?.(false);
            }}
          >
            <View
              style={{
                position: "absolute",
                top: dropdownY,
                left: dropdownLeft,
                width: dropdownWidth,
                backgroundColor: "#FFF",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#C9D4F1",
                maxHeight: 150,
                elevation: 20,
              }}
            >
              <ScrollView nestedScrollEnabled>
                {batchOptions.map((item, index) => {
                  const active = selectedBatch === item.label;
                  return (
                    <TouchableOpacity
                      key={item.id || index}
                      style={[
                        styles.dropdownItem,
                        active && { backgroundColor: "rgba(0,0,255,0.08)" },
                      ]}
                      onPress={() => {
                        onBatchSelect(item.label);
                        setOpen(false);
                        onBatchDropdownToggle?.(false);
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default TimetableHeader;

