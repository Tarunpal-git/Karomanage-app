
// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
// import { COLORS } from "../../../../../../colors";

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
// };

// const headerStyles = StyleSheet.create({
//   container: {
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     marginBottom: 18,
//     elevation: 2,
//   },

//   // TOP AREA
//   topRow: {
//     flexDirection: "column",
//     gap: 10,
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#111",
//   },

//   batchHighlight: {
//     color: "#0B4DA2",
//     fontWeight: "700",
//   },

//   controlsRow: {
//     flexDirection: "row",
//     justifyContent: "center",   // ⭐ CENTER ALIGN
//     alignItems: "center",
//     gap: 12,
//     marginTop: 6,
//   },

//   // ⭐ FINAL FIX → Compact dropdown same size as ADD SLOT
//   batchDropdown: {
//     height: 40,                    // SAME height as ADD SLOT
//     paddingHorizontal: 12,
//     width: 120,                    // Compact width

//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",

//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     borderRadius: 8,
//     backgroundColor: "#FFFFFF",
//   },

//   batchText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#111",
//   },

//   caret: {
//     fontSize: 16,
//     color: "#111",
//   },

//   addButton: {
//     backgroundColor: "#0B4DA2",
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },

//   addButtonText: {
//     color: "#FFF",
//     fontWeight: "700",
//     fontSize: 14,
//   },

//   // MONTH CONTROLS
//   monthSection: {
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
//     borderColor: "#E5E7EB",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   monthLabel: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111",
//   },

//   copyButton: {
//   marginTop: 16,
//   alignSelf: "center",

//   paddingHorizontal: 18,
//   paddingVertical: 10,

//   backgroundColor: "#EEF4FF",  // ⭐ light blue like screenshot
//   borderWidth: 1,
//   borderColor: "#0B4DA2",      // ⭐ blue outline
//   borderRadius: 8,
//   },

//   copyText: {
//     color: "#0B4DA2",
//     fontWeight: "600",
//     textDecorationLine: "underline",
//   },

//   // Batch Picker Modal Styles
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.35)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//   },
//   modalContainer: {
//     width: "100%",
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 12,
//   },
//   modalOption: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   modalOptionActive: {
//     backgroundColor: "rgba(67, 97, 238, 0.08)",
//   },
//   modalOptionText: {
//     color: "#111827",
//     fontWeight: "500",
//   },
//   modalOptionTextActive: {
//     color: COLORS.primary,
//   },
//   modalEmptyText: {
//     textAlign: "center",
//     color: "#6B7280",
//     paddingVertical: 16,
//   },
//   modalCloseButton: {
//     marginTop: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     paddingVertical: 10,
//     alignItems: "center",
//   },
//   modalCloseButtonText: {
//     color: "#6B7280",
//     fontWeight: "600",
//   },
// });

// const TimetableHeader = ({
//   selectedBatch,
//   batchOptions,
//   onBatchSelect,
//   onAddSlotPress,
//   monthLabel,
//   onPrevPress,
//   onNextPress,
// }: TimetableHeaderProps) => {
//   const [batchPickerVisible, setBatchPickerVisible] = useState(false);

//   const handleBatchSelect = (option: TBatchOption) => {
//     onBatchSelect(option.label);
//     setBatchPickerVisible(false);
//   };

//   return (
//     <View style={headerStyles.container}>

//       {/* Title + Batch in BLUE */}
//       <View style={headerStyles.topRow}>
//         <Text style={headerStyles.title}>
//           Weekly Schedule for -{" "}
//           <Text style={headerStyles.batchHighlight}>{selectedBatch || "Batch"}</Text>
//         </Text>

//         {/* Batch Dropdown + ADD SLOT */}
//         <View style={headerStyles.controlsRow}>
//           <TouchableOpacity
//             style={headerStyles.batchDropdown}
//             onPress={() => setBatchPickerVisible(true)}
//           >
//             <Text style={headerStyles.batchText}>{selectedBatch || "Select batch"}</Text>
//             <Text style={headerStyles.caret}>⌄</Text>
//           </TouchableOpacity>

//           {/* <TouchableOpacity
//             style={headerStyles.addButton}
//             onPress={onAddSlotPress}
//           >
//             <Text style={headerStyles.addButtonText}>ADD SLOT +</Text>
//           </TouchableOpacity> */}
//         </View>
//       </View>

//       {/* MONTH ROW */}
//       <View style={headerStyles.monthSection}>
//         <TouchableOpacity style={headerStyles.iconBox} onPress={onPrevPress}>
//           <Text>{"<"}</Text>
//         </TouchableOpacity>

//         <Text style={headerStyles.monthLabel}>{monthLabel}</Text>

//         <TouchableOpacity style={headerStyles.iconBox} onPress={onNextPress}>
//           <Text>{">"}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* COPY PREVIOUS WEEK BUTTON
//       // <TouchableOpacity style={headerStyles.copyButton}>
//       //   <Text style={headerStyles.copyText}>COPY FROM PREVIOUS WEEK </Text>
//       // </TouchableOpacity> */}

//       {/* Batch Picker Modal */}
//       <Modal visible={batchPickerVisible} transparent animationType="fade">
//         <View style={headerStyles.modalBackdrop}>
//           <View style={headerStyles.modalContainer}>
//             <Text style={headerStyles.modalTitle}>Select Batch</Text>
//             <ScrollView style={{ maxHeight: 280 }}>
//               {batchOptions.length === 0 ? (
//                 <Text style={headerStyles.modalEmptyText}>No batches available</Text>
//               ) : (
//                 batchOptions.map((option) => {
//                   const isActive = option.label === selectedBatch;
//                   return (
//                     <TouchableOpacity
//                       key={option.id || option.label}
//                       style={[
//                         headerStyles.modalOption,
//                         isActive && headerStyles.modalOptionActive,
//                       ]}
//                       onPress={() => handleBatchSelect(option)}
//                     >
//                       <Text
//                         style={[
//                           headerStyles.modalOptionText,
//                           isActive && headerStyles.modalOptionTextActive,
//                         ]}
//                       >
//                         {option.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })
//               )}
//             </ScrollView>
//             <TouchableOpacity
//               style={headerStyles.modalCloseButton}
//               onPress={() => setBatchPickerVisible(false)}
//             >
//               <Text style={headerStyles.modalCloseButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//     </View>
//   );
// };

// export default TimetableHeader;




import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from "react-native";
import { COLORS } from "../../../../../../colors";

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
  inputWrapper: {
    flex: 1,
  },
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
}: TimetableHeaderProps) => {

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  const [dropdownY, setDropdownY] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>

        <Text style={styles.title}>
          Weekly Schedule for - <Text style={styles.batchHighlight}>{selectedBatch}</Text>
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
              <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: "600" }}>
                  {selectedBatch || "Select batch"}
                </Text>
                <Text>{open ? "▲" : "▼"}</Text>
              </View>
            </TouchableOpacity>

          </View>

          {/* <TouchableOpacity style={styles.addButton} onPress={onAddSlotPress}>
            <Text style={styles.addButtonText}>ADD SLOT +</Text>
          </TouchableOpacity> */}

        </View>
      </View>

      {/* Month Navigation */}
      <View style={styles.monthRow}>
        <TouchableOpacity style={styles.iconBox} onPress={onPrevPress}>
          <Text>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.monthLabel}>{monthLabel}</Text>

        <TouchableOpacity style={styles.iconBox} onPress={onNextPress}>
          <Text>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Final Modal Dropdown */}
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
              <ScrollView nestedScrollEnabled showsVerticalScrollIndicator keyboardShouldPersistTaps="handled">
                {batchOptions.map((item, index) => {
                  const active = selectedBatch === item.label;

                  return (
                    <TouchableOpacity
                      key={item.id || index}
                      style={[styles.dropdownItem, active && { backgroundColor: "rgba(0,0,255,0.08)" }]}
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
