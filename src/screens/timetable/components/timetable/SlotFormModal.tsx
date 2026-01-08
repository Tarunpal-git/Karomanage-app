

// import React, { useState, useMemo, useEffect } from "react";
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Switch,
//   Alert,
//   TextInput,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useTeachersListQuery } from "../../../../apis/hooks/teachers/query/useTeachersList.query";
// import { useGetClassroomListQuery } from "../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { useCourseDetailsQuery } from "../../../../apis/hooks/course/query/useCourseDetails.query";
// import { useCreateTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useCreateTimeTable.mutation";
// import { useUpdateTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useUpdateTimeTable.mutation";
// import { useQueryClient } from "@tanstack/react-query";
// import { apiUrls } from "../../../../apis/urls";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../app/store";
// import { COLORS } from "../../../../colors";
// import { TTimetableCell } from "./TimetableGrid";

// type SlotFormModalProps = {
//   visible: boolean;
//   selectedCell: TTimetableCell | null;
//   editingSlot?: any | null; // Slot data when editing
//   onClose: () => void;
//   onNavigateToClassrooms?: () => void;
//   selectedBatch?: string;
//   selectedBatchId?: string;
//   batchData?: any;
//   onSuccess?: () => void; // Callback after successful creation
//   weekStart?: Date; // Week start date for refetch
//   selectedOrganization?: any; // Organization for refetch params
//   timeTableData?: any; // Timetable data for conflict validation
// };

// const PURPLE = "#6B57F2";
// const DAY_KEYS = ["M", "T", "W", "Th", "F", "Sa", "Su"];

// // Convert time string to minutes
// const timeToMinutes = (time: string): number => {
//   const [h, m] = time.split(":").map(Number);
//   return h * 60 + m;
// };

// // Convert minutes to time string
// const minutesToTime = (minutes: number): string => {
//   const h = Math.floor(minutes / 60).toString().padStart(2, "0");
//   const m = (minutes % 60).toString().padStart(2, "0");
//   return `${h}:${m}`;
// };

// // Generate start times: operating hours ke andar 15 min intervals
// const generateStartTimes = (opening: string, closing: string) => {
//   const startMin = timeToMinutes(opening);
//   const endMin = timeToMinutes(closing);
//   const times: string[] = [];

//   for (let minutes = startMin; minutes <= endMin; minutes += 15) {
//     times.push(minutesToTime(minutes));
//   }
//   return times;
// };

// // Generate end times = start + 15 min increments, lekin closing time se zyada nahi
// const generateEndTimes = (start: string, closing: string) => {
//   const startMin = timeToMinutes(start);
//   const closingMin = timeToMinutes(closing);
//   const endTimes: string[] = [];

//   for (let minutes = startMin + 15; minutes <= closingMin; minutes += 15) {
//     endTimes.push(minutesToTime(minutes));
//   }
//   return endTimes;
// };

// // Check if two time slots overlap
// const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
//   const start1Min = timeToMinutes(start1);
//   const end1Min = timeToMinutes(end1);
//   const start2Min = timeToMinutes(start2);
//   const end2Min = timeToMinutes(end2);
  
//   // Two slots overlap if: start1 < end2 AND end1 > start2
//   return start1Min < end2Min && end1Min > start2Min;
// };

// const SlotFormModal = ({
//   visible,
//   selectedCell,
//   editingSlot,
//   onClose,
//   onNavigateToClassrooms,
//   selectedBatch = "Batch",
//   selectedBatchId = "",
//   batchData,
//   onSuccess,
//   weekStart,
//   selectedOrganization: propSelectedOrganization,
//   timeTableData,
// }: SlotFormModalProps) => {
//   console.log("📋 === SLOT FORM MODAL RENDERED ===");
//   console.log("📋 visible:", visible);
//   console.log("📋 editingSlot prop:", editingSlot);
//   console.log("📋 selectedCell:", selectedCell);
  
//   // ⭐ TEACHER LIST API
//   const { data: teacherData } = useTeachersListQuery();

//   // ⭐ CLASSROOM LIST API
//   const { data: classroomData } = useGetClassroomListQuery();

//   // ⭐ Selected batch info + courseId
//   const selectedBatchInfo = useMemo(() => {
//     if (batchData?.statusCode === 200 && Array.isArray(batchData.data) && selectedBatchId) {
//       return batchData.data.find((b: any) => b.batchId === selectedBatchId) || null;
//     }
//     return null;
//   }, [batchData, selectedBatchId]);

//   const courseId = selectedBatchInfo?.courses?.[0]?.courseId || "";

//   // ⭐ COURSE DETAIL API (subjects ke liye)
//   const { data: courseDetailData } = useCourseDetailsQuery(
//     { courseId: courseId || "" },
//     { enabled: !!courseId }
//   );

//   const [selectedTeacher, setSelectedTeacher] = useState("");
//   const [selectedRoom, setSelectedRoom] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [customSubjects, setCustomSubjects] = useState<{ value: string; label: string }[]>([]);
//   const [addSubjectModalVisible, setAddSubjectModalVisible] = useState(false);
//   const [newSubjectName, setNewSubjectName] = useState("");
//   const [pendingSubjects, setPendingSubjects] = useState<string[]>([]);
//   const [subjectModalStep, setSubjectModalStep] = useState<"select" | "create">("select");
//   const [tempSubjectSelection, setTempSubjectSelection] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [repeat, setRepeat] = useState(true);

//   // ⭐ Cascading dropdown states
//   const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
//   const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
//   const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);
//   const [startTimeDropdownOpen, setStartTimeDropdownOpen] = useState(false);
//   const [endTimeDropdownOpen, setEndTimeDropdownOpen] = useState(false);

//   // ⭐ TEACHER OPTIONS for Picker
//   const teacherOptions = useMemo(() => {
//     if (teacherData?.statuscode === 200 && Array.isArray(teacherData.data)) {
//       return teacherData.data.map((t: any) => ({
//         value: t.teacherId,
//         label: `${t.teacherFirstName} ${t.teacherLastName || ""}`.trim(),
//       }));
//     }
//     return [];
//   }, [teacherData]);

//   // ⭐ CLASSROOM OPTIONS for Picker
//   const classroomOptions = useMemo(() => {
//     if (classroomData?.statusCode === 200 && classroomData.data?.classRooms) {
//       return classroomData.data.classRooms.map((room: any) => ({
//         value: room.classRoomId,
//         label: room.classRoomName,
//       }));
//     }
//     return [];
//   }, [classroomData]);

//   // ⭐ SUBJECT OPTIONS from Course Detail API
//   const subjectOptions = useMemo(() => {
//     if (courseDetailData?.data?.subjects && Array.isArray(courseDetailData.data.subjects)) {
//       return courseDetailData.data.subjects.map((s: any) => ({
//         value: s.subjectId,
//         label: s.subjectName,
//       }));
//     }
//     return [];
//   }, [courseDetailData]);

//   const courseName = courseDetailData?.data?.courseName || selectedBatchInfo?.courses?.[0]?.courseName || "Course";
//   const batchName = selectedBatchInfo?.batchName || selectedBatch || "Batch";

//   const combinedSubjectOptions = useMemo(
//     () => [...subjectOptions, ...customSubjects],
//     [subjectOptions, customSubjects]
//   );

//   // ⭐ OPERATING HOURS
//   const DEFAULT_HOURS = { openingTime: "09:00", closingTime: "18:00" };
//   const operatingHours = useMemo(() => {
//     const opening =
//       classroomData?.data?.openingTime ??
//       classroomData?.data?.operatingHours?.openingTime ??
//       DEFAULT_HOURS.openingTime;
//     const closing =
//       classroomData?.data?.closingTime ??
//       classroomData?.data?.operatingHours?.closingTime ??
//       DEFAULT_HOURS.closingTime;
//     return { openingTime: opening, closingTime: closing };
//   }, [classroomData]);

//   // ⭐ START TIMES (operating hours ke andar 15 min intervals)
//   const startTimes = useMemo(
//     () => generateStartTimes(operatingHours.openingTime, operatingHours.closingTime),
//     [operatingHours]
//   );

//   // ⭐ END TIMES (start time se 15 min increments, closing time se zyada nahi)
//   const endTimes = useMemo(() => {
//     if (!startTime) return [];
//     return generateEndTimes(startTime, operatingHours.closingTime);
//   }, [startTime, operatingHours.closingTime]);

//   // ⭐ Reset endTime when startTime changes
//   useEffect(() => {
//     if (startTime) {
//       setEndTime("");
//     }
//   }, [startTime]);

//   // ⭐ Cascading dropdown logic
//   useEffect(() => {
//     if (selectedSubject) {
//       setSubjectDropdownOpen(false);
//       setTeacherDropdownOpen(true);
//     }
//   }, [selectedSubject]);

//   useEffect(() => {
//     if (selectedTeacher) {
//       setTeacherDropdownOpen(false);
//       setRoomDropdownOpen(true);
//     }
//   }, [selectedTeacher]);

//   useEffect(() => {
//     if (selectedRoom) {
//       setRoomDropdownOpen(false);
//       setStartTimeDropdownOpen(true);
//     }
//   }, [selectedRoom]);

//   useEffect(() => {
//     if (startTime) {
//       setStartTimeDropdownOpen(false);
//       setEndTimeDropdownOpen(true);
//     }
//   }, [startTime]);

//   useEffect(() => {
//     if (endTime) {
//       setEndTimeDropdownOpen(false);
//     }
//   }, [endTime]);

//   const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2]); // M T W default

//   // ⭐ Check if in edit mode (declare early so it can be used in useEffect)
//   const isEditMode = !!editingSlot;

//   // ⭐ Prefill form when editingSlot exists
//   useEffect(() => {
//     console.log("📝 === SLOT FORM MODAL EFFECT ===");
//     console.log("📝 visible:", visible);
//     console.log("📝 editingSlot:", editingSlot ? JSON.stringify(editingSlot, null, 2) : "null");
//     console.log("📝 isEditMode:", isEditMode);
    
//     if (editingSlot && visible) {
//       console.log("📝 Prefilling form with editingSlot");
//       console.log("📝 Subject ID:", editingSlot.subjectId);
//       console.log("📝 Teacher ID:", editingSlot.teacherId);
//       console.log("📝 Room ID:", editingSlot.classRoomId);
//       console.log("📝 Start Time:", editingSlot.startTime);
//       console.log("📝 End Time:", editingSlot.endTime);
//       console.log("📝 Day:", editingSlot.day);
      
//       // Set values immediately - Picker will update when options are available
//       setSelectedSubject(editingSlot.subjectId || "");
//       setSelectedTeacher(editingSlot.teacherId || "");
//       setSelectedRoom(editingSlot.classRoomId || "");
//       setStartTime(editingSlot.startTime || "");
//       setEndTime(editingSlot.endTime || "");
//       setRepeat(true); // Single day for edit mode
      
//       // Set active day based on editingSlot.day
//       if (editingSlot.day) {
//         const dayDate = editingSlot.day instanceof Date ? editingSlot.day : new Date(editingSlot.day);
//         const dayOfWeek = dayDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
//         // Convert to our day index (0 = Monday)
//         const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
//         console.log("📝 Day of week:", dayOfWeek, "Adjusted index:", adjustedIndex);
//         setActiveDays([adjustedIndex]);
//       }
      
//       console.log("✅ Form values set:", {
//         subject: editingSlot.subjectId,
//         teacher: editingSlot.teacherId,
//         room: editingSlot.classRoomId,
//         startTime: editingSlot.startTime,
//         endTime: editingSlot.endTime,
//       });
//     } else if (!editingSlot && visible) {
//       console.log("📝 Resetting form for new slot");
//       // Reset form when opening for new slot
//       setSelectedSubject("");
//       setSelectedTeacher("");
//       setSelectedRoom("");
//       setStartTime("");
//       setEndTime("");
//       setRepeat(true);
//       setActiveDays([]);
//     }
//   }, [editingSlot, visible, isEditMode]);

//   // ⭐ Log state values when they change (for debugging)
//   useEffect(() => {
//     if (visible && isEditMode) {
//       console.log("📊 Current form state:", {
//         selectedSubject,
//         selectedTeacher,
//         selectedRoom,
//         startTime,
//         endTime,
//         activeDays,
//         subjectOptionsCount: subjectOptions.length,
//         teacherOptionsCount: teacherOptions.length,
//         classroomOptionsCount: classroomOptions.length,
//       });
//     }
//   }, [visible, isEditMode, selectedSubject, selectedTeacher, selectedRoom, startTime, endTime, activeDays, subjectOptions.length, teacherOptions.length, classroomOptions.length]);

//   useEffect(() => {
//     if (addSubjectModalVisible) {
//       setSubjectModalStep("select");
//       setTempSubjectSelection(selectedSubject || "");
//     } else {
//       setPendingSubjects([]);
//       setNewSubjectName("");
//     }
//   }, [addSubjectModalVisible, selectedSubject]);
//   const toggleDay = (index: number) => {
//     // In edit mode, only one day can be selected at a time
//     if (isEditMode) {
//       // If clicking the same day, deselect it (optional - or keep it selected)
//       // If clicking a different day, replace the selection
//       setActiveDays([index]);
//     } else {
//       // Normal mode: allow multiple days selection
//       setActiveDays((prev) =>
//         prev.includes(index)
//           ? prev.filter((i) => i !== index)
//           : [...prev, index]
//       );
//     }
//   };
 
//   const handleAddPendingSubject = () => {
//     const trimmed = newSubjectName.trim();
//     if (!trimmed) {
//       return;
//     }
//     if (pendingSubjects.some((name) => name.toLowerCase() === trimmed.toLowerCase())) {
//       Alert.alert("Duplicate", "Subject already added in list.");
//       return;
//     }
//     setPendingSubjects((prev) => [...prev, trimmed]);
//     setNewSubjectName("");
//   };

//   const handleRemovePendingSubject = (name: string) => {
//     setPendingSubjects((prev) => prev.filter((item) => item !== name));
//   };

//   const handleSubmitNewSubjects = () => {
//     if (pendingSubjects.length === 0) {
//       return;
//     }
//     const created = pendingSubjects.map((name, index) => ({
//       value: `temp-${Date.now()}-${index}-${name}`,
//       label: name,
//     }));
//     setCustomSubjects((prev) => [...prev, ...created]);
//     const last = created[created.length - 1];
//     setSelectedSubject(last.value);
//     setPendingSubjects([]);
//     setNewSubjectName("");
//     setAddSubjectModalVisible(false);
//     Alert.alert("Subject added", "New subject has been added locally.");
//   };

//   const handleRoomPlusPress = () => {
//     onClose();
//     requestAnimationFrame(() => {
//       onNavigateToClassrooms?.();
//     });
//   };

//   // ⭐ REDUX: Organization data (use prop if provided, else from Redux)
//   const reduxOrganization = useSelector((state: RootState) => state.auth.selectedOrganization);
//   const selectedOrganization = propSelectedOrganization || reduxOrganization;

//   // ⭐ MUTATION: Create and Update TimeTable
//   const createMutation = useCreateTimeTableMutation();
//   const updateMutation = useUpdateTimeTableMutation();
//   const queryClient = useQueryClient();

//   // ⭐ HANDLE ADD/UPDATE SLOT
//   const handleAddSlot = () => {
//     const action = isEditMode ? "UPDATE" : "ADD";
//     console.log(`🔵 === ${action} SLOT CLICKED ===`);
//     console.log("Form Values:", {
//       selectedSubject,
//       selectedTeacher,
//       selectedRoom,
//       startTime,
//       endTime,
//       selectedBatchId,
//       repeat,
//       activeDays,
//       selectedCell: selectedCell ? "exists" : "null",
//       editingSlot: editingSlot ? "exists" : "null",
//     });

//     // Validation
//     if (!selectedSubject) {
//       console.log("❌ Validation failed: Subject not selected");
//       Alert.alert("Error", "Please select a subject");
//       return;
//     }
//     if (!selectedTeacher) {
//       console.log("❌ Validation failed: Teacher not selected");
//       Alert.alert("Error", "Please select a teacher");
//       return;
//     }
//     if (!selectedRoom) {
//       console.log("❌ Validation failed: Room not selected");
//       Alert.alert("Error", "Please select a room");
//       return;
//     }
//     if (!startTime) {
//       console.log("❌ Validation failed: Start time not selected");
//       Alert.alert("Error", "Please select start time");
//       return;
//     }
//     if (!endTime) {
//       console.log("❌ Validation failed: End time not selected");
//       Alert.alert("Error", "Please select end time");
//       return;
//     }
//     if (!selectedBatchId) {
//       console.log("❌ Validation failed: Batch ID not found");
//       Alert.alert("Error", "Batch not selected");
//       return;
//     }
//     if (repeat && activeDays.length === 0) {
//       console.log("❌ Validation failed: No days selected");
//       Alert.alert("Error", "Please select at least one day");
//       return;
//     }
//     if (!repeat && !selectedCell) {
//       console.log("❌ Validation failed: No cell selected and repeat is off");
//       Alert.alert("Error", "Please select a cell or enable repeat");
//       return;
//     }

//     console.log("✅ All validations passed");

//     // ⭐ CONFLICT VALIDATION: Check for time conflicts with existing slots
//     const repeatDaysData = timeTableData?.data?.repeatDays || {};
//     const conflicts: string[] = [];
//     const dayNames: { [key: string]: string } = {
//       "M": "Monday",
//       "T": "Tuesday",
//       "W": "Wednesday",
//       "Th": "Thursday",
//       "F": "Friday",
//       "Sa": "Saturday",
//       "Su": "Sunday"
//     };

//     // Build daysToUse first to check conflicts
//     let daysToUse: string[] = [];
//     if (repeat) {
//       if (weekStart) {
//         daysToUse = activeDays.map((dayIndex) => {
//           const dayDate = new Date(weekStart);
//           dayDate.setDate(weekStart.getDate() + dayIndex);
//           const dayOfWeek = dayDate.getDay();
//           const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//           return dayKeys[dayOfWeek];
//         });
//       } else {
//         daysToUse = activeDays.map((dayIndex) => DAY_KEYS[dayIndex]);
//       }
//     } else if (isEditMode && editingSlot?.day) {
//       const dayOfWeek = editingSlot.day.getDay();
//       const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//       daysToUse = [dayKeys[dayOfWeek]];
//     } else if (selectedCell) {
//       const dayOfWeek = selectedCell.day.getDay();
//       const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//       daysToUse = [dayKeys[dayOfWeek]];
//     }

//     // Check conflicts for each selected day
//     for (const dayKey of daysToUse) {
//       const daySlots = repeatDaysData[dayKey] || [];
//       const dayName = dayNames[dayKey] || dayKey;

//       for (const existingSlot of daySlots) {
//         // Skip the current slot if we're editing (to avoid self-conflict)
//         if (isEditMode && editingSlot && (existingSlot.id === editingSlot.id || existingSlot.slotId === editingSlot.id)) {
//           continue;
//         }

//         // Check if times overlap
//         if (isTimeOverlap(startTime, endTime, existingSlot.startTime, existingSlot.endTime)) {
//           // Check if same teacher
//           if (existingSlot.teacherId === selectedTeacher) {
//             conflicts.push(`${dayName}: Teacher already has a slot from ${existingSlot.startTime} to ${existingSlot.endTime}`);
//           }
//           // Check if same classroom
//           else if (existingSlot.classRoomId === selectedRoom) {
//             conflicts.push(`${dayName}: Classroom already booked from ${existingSlot.startTime} to ${existingSlot.endTime}`);
//           }
//         }
//       }
//     }

//     // If conflicts found, show error and return
//     if (conflicts.length > 0) {
//       const conflictMessage = `⛔ Time Conflict Detected:\n\n${conflicts.map((c, i) => `${i + 1}. ${c}`).join("\n")}`;
//       console.log("❌ Conflict detected:", conflictMessage);
//       Alert.alert("Time Conflict", conflictMessage);
//       return;
//     }

//     // Build slot object
//     const slotObject = {
//       subjectId: selectedSubject,
//       teacherId: selectedTeacher,
//       classRoomId: selectedRoom,
//       startTime: startTime,
//       endTime: endTime,
//     };

//     // Build repeatDays payload (daysToUse already calculated above in conflict validation)
//     // Final validation: ensure we have at least one day
//     if (daysToUse.length === 0) {
//       Alert.alert("Error", "Please select at least one day");
//       return;
//     }

//     let payload: any;

//     // For UPDATE: Use flat structure like web (simple object with repeatDays array)
//     if (isEditMode && editingSlot) {
//       // Clean the ID - remove any extra quotes or whitespace
//       let slotId = (editingSlot.id || editingSlot.slotId || "").toString();
//       // Remove quotes from start and end only (not from middle)
//       slotId = slotId.replace(/^["']+|["']+$/g, "").trim();
      
//       console.log("✏️ Edit mode - Slot ID:", slotId);
//       console.log("✏️ Original ID from editingSlot:", editingSlot.id);
      
//       if (!slotId) {
//         Alert.alert("Error", "Slot ID is missing. Cannot update slot.");
//         return;
//       }

//       // Convert day keys to day indices (like web: [0, 1, 2] for M, T, W)
//       // Web uses: 0=Monday, 1=Tuesday, etc.
//       const dayKeyToIndex: Record<string, number> = {
//         "M": 0,
//         "T": 1,
//         "W": 2,
//         "Th": 3,
//         "F": 4,
//         "Sa": 5,
//         "Su": 6,
//       };
//       const repeatDaysArray = daysToUse
//         .map(dayKey => dayKeyToIndex[dayKey])
//         .filter(idx => idx !== undefined);

//       // Build flat payload like web version
//       payload = {
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         batchId: selectedBatchId,
//         id: slotId,
//         subjectId: selectedSubject,
//         teacherId: selectedTeacher,
//         classRoomId: selectedRoom,
//         startTime: startTime,
//         endTime: endTime,
//         repeatDays: repeatDaysArray, // Array of day indices, not nested object
//         startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
//         endDate: weekStart ? (() => {
//           const end = new Date(weekStart);
//           end.setDate(weekStart.getDate() + 6);
//           return end.toISOString().split('T')[0];
//         })() : "",
//       };
      
//       console.log("✏️ Update payload (flat structure like web):", JSON.stringify(payload, null, 2));
//     } else {
//       // For CREATE: Use FLAT structure like web (not nested)
//       // Convert day keys to day indices (0=Monday, 1=Tuesday, etc.)
//       const dayKeyToIndex: Record<string, number> = {
//         "M": 0,
//         "T": 1,
//         "W": 2,
//         "Th": 3,
//         "F": 4,
//         "Sa": 5,
//         "Su": 6,
//       };
//       const repeatDaysArray = daysToUse
//         .map(dayKey => dayKeyToIndex[dayKey])
//         .filter(idx => idx !== undefined);

//       // Build flat payload like web version
//       payload = {
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         batchId: selectedBatchId,
//         subjectId: selectedSubject,
//         teacherId: selectedTeacher,
//         classRoomId: selectedRoom,
//         startTime: startTime,
//         endTime: endTime,
//         repeatDays: repeatDaysArray, // Array of day indices, not nested object
//         startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
//         endDate: weekStart ? (() => {
//           const end = new Date(weekStart);
//           end.setDate(weekStart.getDate() + 6);
//           return end.toISOString().split('T')[0];
//         })() : "",
//       };
      
//       console.log("📦 CREATE payload (flat structure like web):", JSON.stringify(payload, null, 2));
//     }

//     console.log(`📦 Final Payload (${isEditMode ? "UPDATE" : "CREATE"}):`, JSON.stringify(payload, null, 2));
//     console.log("📦 Organization:", {
//       customerId: selectedOrganization?.customerId,
//       organizationId: selectedOrganization?.organizationId,
//     });

//     // Call API
//     const mutation = isEditMode ? updateMutation : createMutation;
//     console.log(`🚀 Calling ${isEditMode ? "updateMutation" : "createMutation"}.mutate...`);
//     mutation.mutate(payload, {
//       onSuccess: (response) => {
//         console.log(`✅ TimeTable ${isEditMode ? "updated" : "created"} successfully:`, response);
//         console.log("📝 Response type:", typeof response);
//         console.log("📝 Response stringified:", JSON.stringify(response));
//         console.log("📝 Response data:", response?.data);
//         console.log("📝 Response statusCode:", response?.statusCode);
//         console.log("📝 Response message:", response?.message);
        
//         // Check for error responses (404, etc.) - If axios returns error as response
//         if (response?.status === 404 || response?.data?.statusCode === 404) {
//           console.error("❌ 404 Error: Resource not found (caught in onSuccess)");
//           // Throw error so it goes to onError handler for proper handling
//           throw new Error(response?.data?.message || "API endpoint not found (404). Please check the backend service.");
//         }
        
//         // Check if response is empty string (backend returns "" but saves data like web)
//         const isEmptyResponse = typeof response === "string" && response === "";
//         const hasNoData = !response?.data && !response?.statusCode;
        
//         if (isEmptyResponse) {
//           console.log("ℹ️ Backend returned empty string (like web), but data should be saved");
//           // Don't show warning - web me bhi same response aata hai and it works
//           // Proceed with refetch - data should be saved
//         } else if (hasNoData && !isEmptyResponse) {
//           console.warn("⚠️ WARNING: Backend returned invalid response!");
//           console.warn("⚠️ This might indicate the data was not saved properly.");
          
//           // Show warning to user only if response is not empty string
//           Alert.alert(
//             "Warning",
//             "Slot creation may have failed. Please check if the slot appears in the timetable. If not, please try again or contact support.",
//             [
//               {
//                 text: "OK",
//                 style: "default",
//               },
//             ]
//           );
//         }
        
//         // Invalidate ALL timetable queries (with any params) to refresh grid
//         queryClient.invalidateQueries({
//           predicate: (query) => {
//             return query.queryKey[0] === "timeTable";
//           },
//         });
        
//         // If weekStart is provided, refetch with exact params
//         if (weekStart && selectedOrganization && selectedBatchId) {
//           const startWeekDate = weekStart.toISOString().split('T')[0];
//           const endDate = new Date(weekStart);
//           endDate.setDate(weekStart.getDate() + 6);
//           const endWeekDate = endDate.toISOString().split('T')[0];
          
//           const refetchParams = {
//             customerId: selectedOrganization.customerId,
//             organizationId: selectedOrganization.organizationId,
//             batchId: selectedBatchId,
//             startWeekDate: startWeekDate,
//             endWeekDate: endWeekDate,
//           };
          
//           console.log("🔄 Refetching with params:", refetchParams);
          
//           // Longer delay to ensure backend has fully processed and committed
//           setTimeout(() => {
//             console.log("🔄 Executing refetch now...");
//             queryClient.refetchQueries({
//               queryKey: ["timeTable", refetchParams],
//             }).then(() => {
//               console.log("✅ Refetch completed");
//             }).catch((err) => {
//               console.error("❌ Refetch error:", err);
//             });
//           }, 2000); // Increased to 2 seconds
//         } else {
//           // Fallback: refetch all timeTable queries
//           setTimeout(() => {
//             queryClient.refetchQueries({
//               predicate: (query) => {
//                 return query.queryKey[0] === "timeTable";
//               },
//             });
//           }, 2000);
//         }
        
//         // Call onSuccess callback if provided
//         if (onSuccess) {
//           onSuccess();
//         }
//         // Close modal
//         onClose();
//         // Reset form
//         setSelectedSubject("");
//         setSelectedTeacher("");
//         setSelectedRoom("");
//         setStartTime("");
//         setEndTime("");
//         setActiveDays([]);
//       },
//       onError: (error: any) => {
//         console.error(`❌ Error ${isEditMode ? "updating" : "creating"} TimeTable:`, error);
//         console.error("❌ Error details:", JSON.stringify(error, null, 2));
//         console.error("❌ Error type:", typeof error);
//         console.error("❌ Error message:", error?.message);
//         console.error("❌ Error response:", error?.response);
//         console.error("❌ Error status:", error?.response?.status);
//         console.error("❌ Error statusCode:", error?.response?.data?.statusCode);
//         console.error("❌ Error response message:", error?.response?.data?.message);
//         console.error("❌ API URL that failed:", isEditMode ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE);
        
//         // Get error message from different possible locations
//         const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEditMode ? "update" : "create"} slot. Please try again.`;
//         const is404 = error?.response?.status === 404 || 
//                      error?.response?.data?.statusCode === 404 || 
//                      error?.message?.includes("404") || 
//                      error?.message?.includes("not found") ||
//                      error?.message?.includes("Not Found");
        
//         // Check for 404 specifically
//         if (is404) {
//           const apiUrl = isEditMode ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE;
//           Alert.alert(
//             "404 - Resource Not Found",
//             `The API endpoint was not found. Please check:\n\n1. API URL: ${apiUrl}\n2. Payload structure\n3. Backend service status\n\nError: ${errorMessage}`
//           );
//         } else {
//           Alert.alert(
//             "Error",
//             errorMessage
//           );
//         }
//       },
//     });
//   };

//   return (
//     <>
//       <Modal visible={visible} transparent animationType="slide">
//         <View style={styles.backdrop}>
//           <ScrollView
//             style={styles.modalContainer}
//             contentContainerStyle={{ paddingBottom: 40 }}
//           >
//           {/* Title */}
//           <Text style={styles.title}>
//             {isEditMode ? "Edit Slot" : `Add New Slot for ${selectedBatch}`}
//           </Text>

//           {/* SUBJECT */}
//           <Text style={styles.label}>Subject</Text>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={styles.dropdownBox}
//               onPress={() => {
//                 setSubjectDropdownOpen(!subjectDropdownOpen);
//                 if (subjectDropdownOpen) {
//                   setTeacherDropdownOpen(false);
//                   setRoomDropdownOpen(false);
//                   setStartTimeDropdownOpen(false);
//                   setEndTimeDropdownOpen(false);
//                 }
//               }}
//             >
//               <View style={styles.dropdownContent}>
//                 <Text style={[styles.dropdownText, !selectedSubject && styles.dropdownPlaceholder]}>
//                   {selectedSubject 
//                     ? combinedSubjectOptions.find((s: { value: string; label: string }) => s.value === selectedSubject)?.label 
//                     : "Select subject"}
//                 </Text>
//                 <Text style={styles.dropdownArrow}>{subjectDropdownOpen ? "▲" : "▼"}</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.plusBtn}
//               onPress={() => setAddSubjectModalVisible(true)}
//             >
//               <Text style={styles.plusText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Subject Dropdown List */}
//           {subjectDropdownOpen && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select subject</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {combinedSubjectOptions.map((subject: { value: string; label: string }) => {
//                   const isSelected = selectedSubject === subject.value;
//                   return (
//                     <TouchableOpacity
//                       key={subject.value}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setSelectedSubject(subject.value);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {subject.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* TEACHER */}
//           <Text style={styles.label}>Teacher</Text>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={[styles.dropdownBox, !selectedSubject && styles.dropdownBoxDisabled]}
//               onPress={() => {
//                 if (selectedSubject) {
//                   setTeacherDropdownOpen(!teacherDropdownOpen);
//                   if (teacherDropdownOpen) {
//                     setRoomDropdownOpen(false);
//                     setStartTimeDropdownOpen(false);
//                     setEndTimeDropdownOpen(false);
//                   }
//                 }
//               }}
//               disabled={!selectedSubject}
//             >
//               <View style={styles.dropdownContent}>
//                 <Text style={[styles.dropdownText, (!selectedTeacher || !selectedSubject) && styles.dropdownPlaceholder]}>
//                   {selectedTeacher 
//                     ? teacherOptions.find((t: { value: string; label: string }) => t.value === selectedTeacher)?.label 
//                     : "Select teacher"}
//                 </Text>
//                 <Text style={[styles.dropdownArrow, !selectedSubject && { opacity: 0.5 }]}>
//                   {teacherDropdownOpen ? "▲" : "▼"}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.plusBtn}>
//               <Text style={styles.plusText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Teacher Dropdown List */}
//           {teacherDropdownOpen && selectedSubject && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select teacher</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {teacherOptions.map((teacher: { value: string; label: string }) => {
//                   const isSelected = selectedTeacher === teacher.value;
//                   return (
//                     <TouchableOpacity
//                       key={teacher.value}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setSelectedTeacher(teacher.value);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {teacher.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* ROOM */}
//           <Text style={styles.label}>Room</Text>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={[styles.dropdownBox, !selectedTeacher && styles.dropdownBoxDisabled]}
//               onPress={() => {
//                 if (selectedTeacher) {
//                   setRoomDropdownOpen(!roomDropdownOpen);
//                   if (roomDropdownOpen) {
//                     setStartTimeDropdownOpen(false);
//                     setEndTimeDropdownOpen(false);
//                   }
//                 }
//               }}
//               disabled={!selectedTeacher}
//             >
//               <View style={styles.dropdownContent}>
//                 <Text style={[styles.dropdownText, (!selectedRoom || !selectedTeacher) && styles.dropdownPlaceholder]}>
//                   {selectedRoom 
//                     ? classroomOptions.find((r: { value: string; label: string }) => r.value === selectedRoom)?.label 
//                     : "Select room"}
//                 </Text>
//                 <Text style={[styles.dropdownArrow, !selectedTeacher && { opacity: 0.5 }]}>
//                   {roomDropdownOpen ? "▲" : "▼"}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.plusBtn} onPress={handleRoomPlusPress}>
//               <Text style={styles.plusText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Room Dropdown List */}
//           {roomDropdownOpen && selectedTeacher && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select room</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {classroomOptions.map((room: { value: string; label: string }) => {
//                   const isSelected = selectedRoom === room.value;
//                   return (
//                     <TouchableOpacity
//                       key={room.value}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setSelectedRoom(room.value);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {room.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* START TIME */}
//           <Text style={styles.label}>Start Time</Text>
//           <TouchableOpacity 
//             style={[styles.dropdownBox, !selectedRoom && styles.dropdownBoxDisabled]}
//             onPress={() => {
//               if (selectedRoom) {
//                 setStartTimeDropdownOpen(!startTimeDropdownOpen);
//                 if (startTimeDropdownOpen) {
//                   setEndTimeDropdownOpen(false);
//                 }
//               }
//             }}
//             disabled={!selectedRoom}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownText, (!startTime || !selectedRoom) && styles.dropdownPlaceholder]}>
//                 {startTime || "Select start time"}
//               </Text>
//               <Text style={[styles.dropdownArrow, !selectedRoom && { opacity: 0.5 }]}>
//                 {startTimeDropdownOpen ? "▲" : "▼"}
//               </Text>
//             </View>
//           </TouchableOpacity>

//           {/* Start Time Dropdown List */}
//           {startTimeDropdownOpen && selectedRoom && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select start time</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {startTimes.map((time: string) => {
//                   const isSelected = startTime === time;
//                   return (
//                     <TouchableOpacity
//                       key={time}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setStartTime(time);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {time}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* END TIME */}
//           <Text style={styles.label}>End Time</Text>
//           <TouchableOpacity 
//             style={[styles.dropdownBox, !startTime && styles.dropdownBoxDisabled]}
//             onPress={() => {
//               if (startTime) {
//                 setEndTimeDropdownOpen(!endTimeDropdownOpen);
//               }
//             }}
//             disabled={!startTime}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownText, (!endTime || !startTime) && styles.dropdownPlaceholder]}>
//                 {endTime || "Select end time"}
//               </Text>
//               <Text style={[styles.dropdownArrow, !startTime && { opacity: 0.5 }]}>
//                 {endTimeDropdownOpen ? "▲" : "▼"}
//               </Text>
//             </View>
//           </TouchableOpacity>

//           {/* End Time Dropdown List */}
//           {endTimeDropdownOpen && startTime && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select end time</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {endTimes.map((time: string) => {
//                   const isSelected = endTime === time;
//                   return (
//                     <TouchableOpacity
//                       key={time}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setEndTime(time);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {time}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* REPEAT TOGGLE */}
//           <View style={styles.repeatRow}>
//             <Text style={styles.repeatLabel}>Repeat this slot</Text>
//             <Switch
//               value={repeat}
//               onValueChange={setRepeat}
//               thumbColor="#FFF"
//               trackColor={{ true: COLORS.primary, false: "#CCC" }}
//             />
//           </View>

//           {/* SELECT DAYS */}
//           {/* SELECT DAYS (Visible only when REPEAT = true) */}
// {repeat && (
//   <>
//     <Text style={styles.label}>Select days</Text>

//     <View style={styles.daysRow}>
//       {DAY_KEYS.map((d, i) => {
//         const isActive = activeDays.includes(i);
//         return (
//           <TouchableOpacity
//             key={i}
//             style={[
//               styles.dayCircle,
//               isActive && { backgroundColor: PURPLE },
//             ]}
//             onPress={() => toggleDay(i)}
//           >
//             <Text
//               style={[
//                 styles.dayText,
//                 isActive && { color: "#FFF", fontWeight: "700" },
//               ]}
//             >
//               {d}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   </>
// )}


//           {/* FOOTER BUTTONS */}
//           <View style={styles.footerRow}>
//             <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
//               <Text style={styles.cancelText}>Cancel</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.saveBtn, (isEditMode ? updateMutation : createMutation).isPending && styles.saveBtnDisabled]}
//               onPress={() => {
//                 console.log("🟢 BUTTON CLICKED!");
//                 handleAddSlot();
//               }}
//               disabled={(isEditMode ? updateMutation : createMutation).isPending}
//             >
//               <Text style={styles.saveBtnText}>
//                 {(isEditMode ? updateMutation : createMutation).isPending 
//                   ? (isEditMode ? "Updating..." : "Adding...") 
//                   : (isEditMode ? "UPDATE SLOT" : "ADD SLOT +")}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </View>
//     </Modal>

//       <Modal
//         visible={addSubjectModalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setAddSubjectModalVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.addSubjectBackdrop}
//           activeOpacity={1}
//           onPress={() => setAddSubjectModalVisible(false)}
//         >
//           <TouchableOpacity
//             style={styles.addSubjectCard}
//             activeOpacity={1}
//             onPress={(e) => e.stopPropagation()}
//           >
//             <View style={styles.addSubjectHeader}>
//               <Text style={styles.addSubjectTitle}>Add Subject</Text>
//               <TouchableOpacity onPress={() => setAddSubjectModalVisible(false)}>
//                 <Text style={styles.addSubjectClose}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.addSubjectMeta}>
//               <Text style={styles.addSubjectMetaLabel}>Course: </Text>
//               {courseName}
//             </Text>
//             <Text style={styles.addSubjectMeta}>
//               <Text style={styles.addSubjectMetaLabel}>Batch: </Text>
//               {batchName}
//             </Text>

//             {subjectModalStep === "select" ? (
//               <>
//                 <View style={styles.selectDropdownBox}>
//                   <Picker
//                     selectedValue={tempSubjectSelection}
//                     onValueChange={(val) => setTempSubjectSelection(val)}
//                   >
//                     <Picker.Item label="Select subject" value="" />
//                     {combinedSubjectOptions.map((subject) => (
//                       <Picker.Item
//                         key={`modal-subject-${subject.value}`}
//                         label={subject.label}
//                         value={subject.value}
//                       />
//                     ))}
//                   </Picker>
//                 </View>

//                 <ScrollView style={styles.subjectList} nestedScrollEnabled>
//                   {combinedSubjectOptions.map((subject) => {
//                     const isActive = tempSubjectSelection === subject.value;
//                     return (
//                       <TouchableOpacity
//                         key={`modal-option-${subject.value}`}
//                         style={styles.subjectOptionRow}
//                         onPress={() => setTempSubjectSelection(subject.value)}
//                       >
//                         <View style={[styles.subjectCheckbox, isActive && styles.subjectCheckboxActive]}>
//                           {isActive && <Text style={styles.subjectCheckboxTick}>✓</Text>}
//                         </View>
//                         <Text style={styles.subjectOptionLabel}>{subject.label}</Text>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </ScrollView>

//                 <TouchableOpacity style={styles.createLinkRow} onPress={() => setSubjectModalStep("create")}>
//                   <Text style={styles.createLinkIcon}>＋</Text>
//                   <Text style={styles.createLinkText}>Create New Subject</Text>
//                 </TouchableOpacity>

//                 <View style={styles.addSubjectFooter}>
//                   <TouchableOpacity
//                     style={styles.addSubjectCancel}
//                     onPress={() => setAddSubjectModalVisible(false)}
//                   >
//                     <Text style={styles.addSubjectCancelText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.addSubjectSubmit,
//                       !tempSubjectSelection && styles.addSubjectSubmitDisabled,
//                     ]}
//                     disabled={!tempSubjectSelection}
//                     onPress={() => {
//                       if (tempSubjectSelection) {
//                         setSelectedSubject(tempSubjectSelection);
//                         setAddSubjectModalVisible(false);
//                       }
//                     }}
//                   >
//                     <Text style={styles.addSubjectSubmitText}>Submit</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             ) : (
//               <>
//                 <View style={styles.addSubjectInputRow}>
//                   <TextInput
//                     style={styles.addSubjectTextInput}
//                     placeholder="Enter new subject name"
//                     value={newSubjectName}
//                     onChangeText={setNewSubjectName}
//                     placeholderTextColor="#9CA3AF"
//                   />
//                   <TouchableOpacity style={styles.addSubjectAddBtn} onPress={handleAddPendingSubject}>
//                     <Text style={styles.addSubjectAddText}>＋ ADD</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {pendingSubjects.length > 0 ? (
//                   <View style={styles.pendingList}>
//                     {pendingSubjects.map((name) => (
//                       <View key={name} style={styles.pendingItem}>
//                         <View style={styles.pendingHeader}>
//                           <Text style={styles.pendingTitle}>{name}</Text>
//                           <TouchableOpacity onPress={() => handleRemovePendingSubject(name)}>
//                             <Text style={styles.pendingRemove}>✕</Text>
//                           </TouchableOpacity>
//                         </View>
//                         <View style={styles.pendingTimeRow}>
//                           <TextInput style={styles.pendingTimeInput} placeholder="Start time" editable={false} />
//                           <TextInput style={styles.pendingTimeInput} placeholder="End time" editable={false} />
//                         </View>
//                       </View>
//                     ))}
//                   </View>
//                 ) : (
//                   <Text style={styles.addSubjectEmpty}>Subjects you add will appear here.</Text>
//                 )}

//                 <View style={styles.addSubjectFooter}>
//                   <TouchableOpacity
//                     style={styles.addSubjectCancel}
//                     onPress={() => {
//                       setSubjectModalStep("select");
//                       setPendingSubjects([]);
//                       setNewSubjectName("");
//                     }}
//                   >
//                     <Text style={styles.addSubjectCancelText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.addSubjectSubmit,
//                       pendingSubjects.length === 0 && styles.addSubjectSubmitDisabled,
//                     ]}
//                     disabled={pendingSubjects.length === 0}
//                     onPress={handleSubmitNewSubjects}
//                   >
//                     <Text style={styles.addSubjectSubmitText}>Submit</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>
//     </>
//   );
// };

// export default SlotFormModal;

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.35)",
//     justifyContent: "center",  // ✅ Center me show hoga
//     alignItems: "center",
//   },
//   modalContainer: {
//     maxHeight: "50%",        // ✅ 70% se 50% (ya 45% agar aur chahiye)
//   width: "85%",            // ✅ 90% se 85% (ya 80% agar aur chahiye)
//   backgroundColor: "#FFF",
//   borderRadius: 20,
//   padding: 16,             // ✅ 20 se 16 (padding kam karein)
//   alignSelf: "center",
//   // maxHeight: "70%",        // Current
//   // width: "90%",            // Current
//   // backgroundColor: "#FFF",
//   // borderRadius: 20,
//   // padding: 20,
//   // alignSelf: "center",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginTop: 12,
//     marginBottom: 4,
//   },
//   dropdownBox: {
//     flex: 1,
//     height: 45,              // ✅ Fixed height add karein (default se kam)
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     borderRadius: 10,
//     overflow: "hidden",
//     justifyContent: "center"
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   plusBtn: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     borderWidth: 2,
//     borderColor: "#0B4DA2",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   plusText: {
//     color: "#0B4DA2",
//     fontSize: 22,
//     fontWeight: "700",
//   },
//   repeatRow: {
//     marginTop: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   repeatLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   daysRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 8,
//   },
//   dayCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   dayText: {
//     color: "#444",
//     fontWeight: "600",
//   },
//   footerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 26,
//   },
//   cancelBtn: {
//     flex: 1,
//     marginRight: 10,
//     padding: 14,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     alignItems: "center",
//   },
//   cancelText: { fontSize: 15, fontWeight: "600", color: "#111" },
//   saveBtn: {
//     flex: 1,
//     marginLeft: 10,
//     padding: 14,
//     borderRadius: 8,
//     backgroundColor: COLORS.primary,
//     alignItems: "center",
//   },
//   saveBtnText: {
//     color: "#FFF",
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   saveBtnDisabled: {
//     opacity: 0.6,
//   },
//   addSubjectBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   addSubjectCard: {
//     width: "100%",
//     maxWidth: 420,
//     backgroundColor: "#FFF",
//     borderRadius: 16,
//     padding: 20,
//   },
//   addSubjectHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   addSubjectTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//   },
//   addSubjectClose: {
//     fontSize: 18,
//     color: "#6B7280",
//   },
//   addSubjectMeta: {
//     fontSize: 14,
//     color: "#4B5563",
//     marginBottom: 4,
//   },
//   addSubjectMetaLabel: {
//     fontWeight: "600",
//     color: "#111827",
//   },
//   selectDropdownBox: {
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     borderRadius: 10,
//     overflow: "hidden",
//     marginTop: 16,
//   },
//   subjectList: {
//     maxHeight: 220,
//     marginTop: 12,
//   },
//   subjectOptionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   subjectCheckbox: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   subjectCheckboxActive: {
//     borderColor: COLORS.primary,
//     backgroundColor: "rgba(107,87,242,0.15)",
//   },
//   subjectCheckboxTick: {
//     color: COLORS.primary,
//     fontSize: 12,
//     fontWeight: "700",
//   },
//   subjectOptionLabel: {
//     color: "#111827",
//     fontSize: 14,
//   },
//   createLinkRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 16,
//   },
//   createLinkIcon: {
//     color: COLORS.primary,
//     fontSize: 18,
//     marginRight: 6,
//   },
//   createLinkText: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
//   addSubjectInputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     marginTop: 16,
//   },
//   addSubjectTextInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     fontSize: 15,
//     color: "#111827",
//   },
//   addSubjectAddBtn: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#16A34A",
//     backgroundColor: "rgba(34,197,94,0.1)",
//   },
//   addSubjectAddText: {
//     color: "#16A34A",
//     fontWeight: "700",
//   },
//   pendingList: {
//     marginTop: 16,
//   },
//   pendingItem: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//   },
//   pendingHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   pendingTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   pendingRemove: {
//     color: "#9CA3AF",
//     fontSize: 16,
//   },
//   pendingTimeRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginTop: 10,
//   },
//   pendingTimeInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     color: "#9CA3AF",
//   },
//   addSubjectEmpty: {
//     textAlign: "center",
//     color: "#9CA3AF",
//     marginVertical: 24,
//   },
//   addSubjectFooter: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 12,
//     marginTop: 12,
//   },
//   addSubjectCancel: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//   },
//   addSubjectCancelText: {
//     color: "#6B7280",
//     fontWeight: "600",
//   },
//   addSubjectSubmit: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     backgroundColor: COLORS.primary,
//   },
//   addSubjectSubmitDisabled: {
//     backgroundColor: "#CBD5F5",
//   },
//   addSubjectSubmitText: {
//     color: "#FFF",
//     fontWeight: "700",
//   },
//   // Cascading dropdown styles
//   dropdownContent: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     height: "100%",
//   },
//   dropdownText: {
//     fontSize: 14,
//     color: "#111827",
//     flex: 1,
//   },
//   dropdownPlaceholder: {
//     color: "#9CA3AF",
//   },
//   dropdownArrow: {
//     color: "#9CA3AF",
//     fontSize: 12,
//     marginLeft: 8,
//   },
//   dropdownBoxDisabled: {
//     opacity: 0.5,
//   },
//   cascadingDropdown: {
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     marginTop: 8,
//     marginBottom: 8,
//     maxHeight: 250,
//     overflow: "hidden",
//   },
//   cascadingDropdownTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#111827",
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   cascadingDropdownList: {
//     maxHeight: 200,
//   },
//   cascadingDropdownItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   cascadingDropdownItemSelected: {
//     backgroundColor: "rgba(107,87,242,0.05)",
//   },
//   cascadingDropdownItemText: {
//     fontSize: 14,
//     color: "#111827",
//     flex: 1,
//   },
//   cascadingDropdownItemTextSelected: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
//   cascadingDropdownCheck: {
//     color: COLORS.primary,
//     fontSize: 16,
//     fontWeight: "700",
//     marginLeft: 8,
//   },
// });



// import React, { useState, useMemo, useEffect } from "react";
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Switch,
//   Alert,
//   TextInput,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useTeachersListQuery } from "../../../../apis/hooks/teachers/query/useTeachersList.query";
// import { useGetClassroomListQuery } from "../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { useCourseDetailsQuery } from "../../../../apis/hooks/course/query/useCourseDetails.query";
// import { useCreateTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useCreateTimeTable.mutation";
// import { useUpdateTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useUpdateTimeTable.mutation";
// import { useDeleteTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useDeleteTimeTable.mutation";
// import { useQueryClient } from "@tanstack/react-query";
// import { apiUrls } from "../../../../apis/urls";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../app/store";
// import { COLORS } from "../../../../colors";
// import { TTimetableCell } from "./TimetableGrid";

// type SlotFormModalProps = {
//   visible: boolean;
//   selectedCell: TTimetableCell | null;
//   editingSlot?: any | null; // Slot data when editing
//   onClose: () => void;
//   onNavigateToClassrooms?: () => void;
//   selectedBatch?: string;
//   selectedBatchId?: string;
//   batchData?: any;
//   onSuccess?: () => void; // Callback after successful creation
//   weekStart?: Date; // Week start date for refetch
//   selectedOrganization?: any; // Organization for refetch params
//   timeTableData?: any; // Timetable data for conflict validation
// };

// const PURPLE = "#6B57F2";
// const DAY_KEYS = ["M", "T", "W", "Th", "F", "Sa", "Su"];

// // Convert time string to minutes
// const timeToMinutes = (time: string): number => {
//   const [h, m] = time.split(":").map(Number);
//   return h * 60 + m;
// };

// // Convert minutes to time string
// const minutesToTime = (minutes: number): string => {
//   const h = Math.floor(minutes / 60).toString().padStart(2, "0");
//   const m = (minutes % 60).toString().padStart(2, "0");
//   return `${h}:${m}`;
// };

// // Generate start times: operating hours ke andar 15 min intervals
// const generateStartTimes = (opening: string, closing: string) => {
//   const startMin = timeToMinutes(opening);
//   const endMin = timeToMinutes(closing);
//   const times: string[] = [];

//   for (let minutes = startMin; minutes <= endMin; minutes += 15) {
//     times.push(minutesToTime(minutes));
//   }
//   return times;
// };

// // Generate end times = start + 15 min increments, lekin closing time se zyada nahi
// const generateEndTimes = (start: string, closing: string) => {
//   const startMin = timeToMinutes(start);
//   const closingMin = timeToMinutes(closing);
//   const endTimes: string[] = [];

//   for (let minutes = startMin + 15; minutes <= closingMin; minutes += 15) {
//     endTimes.push(minutesToTime(minutes));
//   }
//   return endTimes;
// };

// // Check if two time slots overlap
// const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
//   const start1Min = timeToMinutes(start1);
//   const end1Min = timeToMinutes(end1);
//   const start2Min = timeToMinutes(start2);
//   const end2Min = timeToMinutes(end2);
  
//   // Two slots overlap if: start1 < end2 AND end1 > start2
//   return start1Min < end2Min && end1Min > start2Min;
// };

// const SlotFormModal = ({
//   visible,
//   selectedCell,
//   editingSlot,
//   onClose,
//   onNavigateToClassrooms,
//   selectedBatch = "Batch",
//   selectedBatchId = "",
//   batchData,
//   onSuccess,
//   weekStart,
//   selectedOrganization: propSelectedOrganization,
//   timeTableData,
// }: SlotFormModalProps) => {
//   console.log("📋 === SLOT FORM MODAL RENDERED ===");
//   console.log("📋 visible:", visible);
//   console.log("📋 editingSlot prop:", editingSlot);
//   console.log("📋 selectedCell:", selectedCell);
  
//   // ⭐ TEACHER LIST API
//   const { data: teacherData } = useTeachersListQuery();

//   // ⭐ CLASSROOM LIST API
//   const { data: classroomData } = useGetClassroomListQuery();

//   // ⭐ Selected batch info + courseId
//   const selectedBatchInfo = useMemo(() => {
//     if (batchData?.statusCode === 200 && Array.isArray(batchData.data) && selectedBatchId) {
//       return batchData.data.find((b: any) => b.batchId === selectedBatchId) || null;
//     }
//     return null;
//   }, [batchData, selectedBatchId]);

//   const courseId = selectedBatchInfo?.courses?.[0]?.courseId || "";

//   // ⭐ COURSE DETAIL API (subjects ke liye)
//   const { data: courseDetailData } = useCourseDetailsQuery({
//     courseId: courseId || "",
//   });

//   const [selectedTeacher, setSelectedTeacher] = useState("");
//   const [selectedRoom, setSelectedRoom] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [customSubjects, setCustomSubjects] = useState<{ value: string; label: string }[]>([]);
//   const [addSubjectModalVisible, setAddSubjectModalVisible] = useState(false);
//   const [newSubjectName, setNewSubjectName] = useState("");
//   const [pendingSubjects, setPendingSubjects] = useState<string[]>([]);
//   const [subjectModalStep, setSubjectModalStep] = useState<"select" | "create">("select");
//   const [tempSubjectSelection, setTempSubjectSelection] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [repeat, setRepeat] = useState(true);

//   // ⭐ Cascading dropdown states
//   const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
//   const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
//   const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);
//   const [startTimeDropdownOpen, setStartTimeDropdownOpen] = useState(false);
//   const [endTimeDropdownOpen, setEndTimeDropdownOpen] = useState(false);

//   // ⭐ TEACHER OPTIONS for Picker
//   const teacherOptions = useMemo(() => {
//     if (teacherData?.statuscode === 200 && Array.isArray(teacherData.data)) {
//       return teacherData.data.map((t: any) => ({
//         value: t.teacherId,
//         label: `${t.teacherFirstName} ${t.teacherLastName || ""}`.trim(),
//       }));
//     }
//     return [];
//   }, [teacherData]);

//   // ⭐ CLASSROOM OPTIONS for Picker
//   const classroomOptions = useMemo(() => {
//     if (classroomData?.statusCode === 200 && classroomData.data?.classRooms) {
//       return classroomData.data.classRooms.map((room: any) => ({
//         value: room.classRoomId,
//         label: room.classRoomName,
//       }));
//     }
//     return [];
//   }, [classroomData]);

//   // ⭐ SUBJECT OPTIONS from Course Detail API
//   const subjectOptions = useMemo(() => {
//     if (courseDetailData?.data?.subjects && Array.isArray(courseDetailData.data.subjects)) {
//       return courseDetailData.data.subjects.map((s: any) => ({
//         value: s.subjectId,
//         label: s.subjectName,
//       }));
//     }
//     return [];
//   }, [courseDetailData]);

//   const courseName = courseDetailData?.data?.courseName || selectedBatchInfo?.courses?.[0]?.courseName || "Course";
//   const batchName = selectedBatchInfo?.batchName || selectedBatch || "Batch";

//   const combinedSubjectOptions = useMemo(
//     () => [...subjectOptions, ...customSubjects],
//     [subjectOptions, customSubjects]
//   );

//   // ⭐ OPERATING HOURS
//   const DEFAULT_HOURS = { openingTime: "09:00", closingTime: "18:00" };
//   const operatingHours = useMemo(() => {
//     const opening =
//       classroomData?.data?.openingTime ??
//       classroomData?.data?.operatingHours?.openingTime ??
//       DEFAULT_HOURS.openingTime;
//     const closing =
//       classroomData?.data?.closingTime ??
//       classroomData?.data?.operatingHours?.closingTime ??
//       DEFAULT_HOURS.closingTime;
//     return { openingTime: opening, closingTime: closing };
//   }, [classroomData]);

//   // ⭐ START TIMES (operating hours ke andar 15 min intervals)
//   const startTimes = useMemo(
//     () => generateStartTimes(operatingHours.openingTime, operatingHours.closingTime),
//     [operatingHours]
//   );

//   // ⭐ END TIMES (start time se 15 min increments, closing time se zyada nahi)
//   const endTimes = useMemo(() => {
//     if (!startTime) return [];
//     return generateEndTimes(startTime, operatingHours.closingTime);
//   }, [startTime, operatingHours.closingTime]);

//   // ⭐ Reset endTime when startTime changes
//   useEffect(() => {
//     if (startTime) {
//       setEndTime("");
//     }
//   }, [startTime]);

//   // ⭐ Cascading dropdown logic
//   useEffect(() => {
//     if (selectedSubject) {
//       setSubjectDropdownOpen(false);
//       setTeacherDropdownOpen(true);
//     }
//   }, [selectedSubject]);

//   useEffect(() => {
//     if (selectedTeacher) {
//       setTeacherDropdownOpen(false);
//       setRoomDropdownOpen(true);
//     }
//   }, [selectedTeacher]);

//   useEffect(() => {
//     if (selectedRoom) {
//       setRoomDropdownOpen(false);
//       setStartTimeDropdownOpen(true);
//     }
//   }, [selectedRoom]);

//   useEffect(() => {
//     if (startTime) {
//       setStartTimeDropdownOpen(false);
//       setEndTimeDropdownOpen(true);
//     }
//   }, [startTime]);

//   useEffect(() => {
//     if (endTime) {
//       setEndTimeDropdownOpen(false);
//     }
//   }, [endTime]);

//   const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2]); // M T W default

//   // ⭐ Check if in edit mode (declare early so it can be used in useEffect)
//   const isEditMode = !!editingSlot;

//   // ⭐ Prefill form when editingSlot exists
//   useEffect(() => {
//     console.log("📝 === SLOT FORM MODAL EFFECT ===");
//     console.log("📝 visible:", visible);
//     console.log("📝 editingSlot:", editingSlot ? JSON.stringify(editingSlot, null, 2) : "null");
//     console.log("📝 isEditMode:", isEditMode);
    
//     if (editingSlot && visible) {
//       console.log("📝 Prefilling form with editingSlot");
//       console.log("📝 Subject ID:", editingSlot.subjectId);
//       console.log("📝 Teacher ID:", editingSlot.teacherId);
//       console.log("📝 Room ID:", editingSlot.classRoomId);
//       console.log("📝 Start Time:", editingSlot.startTime);
//       console.log("📝 End Time:", editingSlot.endTime);
//       console.log("📝 Day:", editingSlot.day);
      
//       // Set values immediately - Picker will update when options are available
//       setSelectedSubject(editingSlot.subjectId || "");
//       setSelectedTeacher(editingSlot.teacherId || "");
//       setSelectedRoom(editingSlot.classRoomId || "");
//       setStartTime(editingSlot.startTime || "");
//       setEndTime(editingSlot.endTime || "");
//       setRepeat(true); // Single day for edit mode
      
//       // Set active day based on editingSlot.day
//       if (editingSlot.day) {
//         const dayDate = editingSlot.day instanceof Date ? editingSlot.day : new Date(editingSlot.day);
//         const dayOfWeek = dayDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
//         // Convert to our day index (0 = Monday)
//         const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
//         console.log("📝 Day of week:", dayOfWeek, "Adjusted index:", adjustedIndex);
//         setActiveDays([adjustedIndex]);
//       }
      
//       console.log("✅ Form values set:", {
//         subject: editingSlot.subjectId,
//         teacher: editingSlot.teacherId,
//         room: editingSlot.classRoomId,
//         startTime: editingSlot.startTime,
//         endTime: editingSlot.endTime,
//       });
//     } else if (!editingSlot && visible) {
//       console.log("📝 Resetting form for new slot");
//       // Reset form when opening for new slot
//       setSelectedSubject("");
//       setSelectedTeacher("");
//       setSelectedRoom("");
//       setStartTime("");
//       setEndTime("");
//       setRepeat(true);
//       setActiveDays([]);
//     }
//   }, [editingSlot, visible, isEditMode]);

//   // ⭐ Log state values when they change (for debugging)
//   useEffect(() => {
//     if (visible && isEditMode) {
//       console.log("📊 Current form state:", {
//         selectedSubject,
//         selectedTeacher,
//         selectedRoom,
//         startTime,
//         endTime,
//         activeDays,
//         subjectOptionsCount: subjectOptions.length,
//         teacherOptionsCount: teacherOptions.length,
//         classroomOptionsCount: classroomOptions.length,
//       });
//     }
//   }, [visible, isEditMode, selectedSubject, selectedTeacher, selectedRoom, startTime, endTime, activeDays, subjectOptions.length, teacherOptions.length, classroomOptions.length]);

//   useEffect(() => {
//     if (addSubjectModalVisible) {
//       setSubjectModalStep("select");
//       setTempSubjectSelection(selectedSubject || "");
//     } else {
//       setPendingSubjects([]);
//       setNewSubjectName("");
//     }
//   }, [addSubjectModalVisible, selectedSubject]);
//   const toggleDay = (index: number) => {
//     // In edit mode, only one day can be selected at a time
//     if (isEditMode) {
//       // If clicking the same day, deselect it (optional - or keep it selected)
//       // If clicking a different day, replace the selection
//       setActiveDays([index]);
//     } else {
//       // Normal mode: allow multiple days selection
//       setActiveDays((prev) =>
//         prev.includes(index)
//           ? prev.filter((i) => i !== index)
//           : [...prev, index]
//       );
//     }
//   };
 
//   const handleAddPendingSubject = () => {
//     const trimmed = newSubjectName.trim();
//     if (!trimmed) {
//       return;
//     }
//     if (pendingSubjects.some((name) => name.toLowerCase() === trimmed.toLowerCase())) {
//       Alert.alert("Duplicate", "Subject already added in list.");
//       return;
//     }
//     setPendingSubjects((prev) => [...prev, trimmed]);
//     setNewSubjectName("");
//   };

//   const handleRemovePendingSubject = (name: string) => {
//     setPendingSubjects((prev) => prev.filter((item) => item !== name));
//   };

//   const handleSubmitNewSubjects = () => {
//     if (pendingSubjects.length === 0) {
//       return;
//     }
//     const created = pendingSubjects.map((name, index) => ({
//       value: `temp-${Date.now()}-${index}-${name}`,
//       label: name,
//     }));
//     setCustomSubjects((prev) => [...prev, ...created]);
//     const last = created[created.length - 1];
//     setSelectedSubject(last.value);
//     setPendingSubjects([]);
//     setNewSubjectName("");
//     setAddSubjectModalVisible(false);
//     Alert.alert("Subject added", "New subject has been added locally.");
//   };

//   const handleRoomPlusPress = () => {
//     onClose();
//     requestAnimationFrame(() => {
//       onNavigateToClassrooms?.();
//     });
//   };

//   // ⭐ REDUX: Organization data (use prop if provided, else from Redux)
//   const reduxOrganization = useSelector((state: RootState) => state.auth.selectedOrganization);
//   const selectedOrganization = propSelectedOrganization || reduxOrganization;

//   // ⭐ MUTATION: Create, Update and Delete TimeTable
//   const createMutation = useCreateTimeTableMutation();
//   const updateMutation = useUpdateTimeTableMutation();
//   const deleteMutation = useDeleteTimeTableMutation();
//   const queryClient = useQueryClient();

//   // ⭐ HELPER: Handle success response (refetch and close modal)
//   const handleSuccessResponse = (response: any, isEdit: boolean) => {
//     console.log(`✅ TimeTable ${isEdit ? "updated" : "created"} successfully:`, response);
    
//     // Check for error responses (404, etc.)
//     if (response?.status === 404 || response?.data?.statusCode === 404) {
//       console.error("❌ 404 Error: Resource not found");
//       Alert.alert("Error", response?.data?.message || "API endpoint not found (404). Please check the backend service.");
//       return;
//     }
    
//     // Check if response is empty string (backend returns "" but saves data like web)
//     const isEmptyResponse = typeof response === "string" && response === "";
//     const hasNoData = !response?.data && !response?.statusCode;
    
//     if (isEmptyResponse) {
//       console.log("ℹ️ Backend returned empty string (like web), but data should be saved");
//     } else if (hasNoData && !isEmptyResponse) {
//       console.warn("⚠️ WARNING: Backend returned invalid response!");
//       Alert.alert(
//         "Warning",
//         "Slot operation may have failed. Please check if the slot appears in the timetable. If not, please try again or contact support.",
//         [{ text: "OK", style: "default" }]
//       );
//     }
    
//     // Invalidate ALL timetable queries (with any params) to refresh grid
//     queryClient.invalidateQueries({
//       predicate: (query) => {
//         return query.queryKey[0] === "timeTable";
//       },
//     });
    
//     // If weekStart is provided, refetch with exact params
//     if (weekStart && selectedOrganization && selectedBatchId) {
//       const startWeekDate = weekStart.toISOString().split('T')[0];
//       const endDate = new Date(weekStart);
//       endDate.setDate(weekStart.getDate() + 6);
//       const endWeekDate = endDate.toISOString().split('T')[0];
      
//       const refetchParams = {
//         customerId: selectedOrganization.customerId,
//         organizationId: selectedOrganization.organizationId,
//         batchId: selectedBatchId,
//         startWeekDate: startWeekDate,
//         endWeekDate: endWeekDate,
//       };
      
//       console.log("🔄 Refetching with params:", refetchParams);
      
//       setTimeout(() => {
//         console.log("🔄 Executing refetch now...");
//         queryClient.refetchQueries({
//           queryKey: ["timeTable", refetchParams],
//         }).then(() => {
//           console.log("✅ Refetch completed");
//         }).catch((err) => {
//           console.error("❌ Refetch error:", err);
//         });
//       }, 2000);
//     } else {
//       setTimeout(() => {
//         queryClient.refetchQueries({
//           predicate: (query) => {
//             return query.queryKey[0] === "timeTable";
//           },
//         });
//       }, 2000);
//     }
    
//     // Call onSuccess callback if provided
//     if (onSuccess) {
//       onSuccess();
//     }
//     // Close modal
//     onClose();
//     // Reset form
//     setSelectedSubject("");
//     setSelectedTeacher("");
//     setSelectedRoom("");
//     setStartTime("");
//     setEndTime("");
//     setActiveDays([]);
//   };

//   // ⭐ HELPER: Handle error response
//   const handleErrorResponse = (error: any, isEdit: boolean) => {
//     console.error(`❌ Error ${isEdit ? "updating" : "creating"} TimeTable:`, error);
//     console.error("❌ Error details:", JSON.stringify(error, null, 2));
//     console.error("❌ API URL that failed:", isEdit ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE);
    
//     const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEdit ? "update" : "create"} slot. Please try again.`;
//     const is404 = error?.response?.status === 404 || 
//                  error?.response?.data?.statusCode === 404 || 
//                  error?.message?.includes("404") || 
//                  error?.message?.includes("not found") ||
//                  error?.message?.includes("Not Found");
    
//     if (is404) {
//       Alert.alert(
//         "Error",
//         "API endpoint not found (404). Please check the backend service or contact support.",
//         [{ text: "OK", style: "default" }]
//       );
//     } else {
//       Alert.alert("Error", errorMessage, [{ text: "OK", style: "default" }]);
//     }
//   };

//   // ⭐ HANDLE ADD/UPDATE SLOT
//   const handleAddSlot = () => {
//     const action = isEditMode ? "UPDATE" : "ADD";
//     console.log(`🔵 === ${action} SLOT CLICKED ===`);
//     console.log("Form Values:", {
//       selectedSubject,
//       selectedTeacher,
//       selectedRoom,
//       startTime,
//       endTime,
//       selectedBatchId,
//       repeat,
//       activeDays,
//       selectedCell: selectedCell ? "exists" : "null",
//       editingSlot: editingSlot ? "exists" : "null",
//     });

//     // Validation
//     if (!selectedSubject) {
//       console.log("❌ Validation failed: Subject not selected");
//       Alert.alert("Error", "Please select a subject");
//       return;
//     }
//     if (!selectedTeacher) {
//       console.log("❌ Validation failed: Teacher not selected");
//       Alert.alert("Error", "Please select a teacher");
//       return;
//     }
//     if (!selectedRoom) {
//       console.log("❌ Validation failed: Room not selected");
//       Alert.alert("Error", "Please select a room");
//       return;
//     }
//     if (!startTime) {
//       console.log("❌ Validation failed: Start time not selected");
//       Alert.alert("Error", "Please select start time");
//       return;
//     }
//     if (!endTime) {
//       console.log("❌ Validation failed: End time not selected");
//       Alert.alert("Error", "Please select end time");
//       return;
//     }
//     if (!selectedBatchId) {
//       console.log("❌ Validation failed: Batch ID not found");
//       Alert.alert("Error", "Batch not selected");
//       return;
//     }
//     if (repeat && activeDays.length === 0) {
//       console.log("❌ Validation failed: No days selected");
//       Alert.alert("Error", "Please select at least one day");
//       return;
//     }
//     if (!repeat && !selectedCell) {
//       console.log("❌ Validation failed: No cell selected and repeat is off");
//       Alert.alert("Error", "Please select a cell or enable repeat");
//       return;
//     }

//     console.log("✅ All validations passed");

//     // ⭐ CONFLICT VALIDATION: Check for time conflicts with existing slots
//     const repeatDaysData = timeTableData?.data?.repeatDays || {};
//     const conflicts: string[] = [];
//     const dayNames: { [key: string]: string } = {
//       "M": "Monday",
//       "T": "Tuesday",
//       "W": "Wednesday",
//       "Th": "Thursday",
//       "F": "Friday",
//       "Sa": "Saturday",
//       "Su": "Sunday"
//     };

//     // Build daysToUse first to check conflicts
//     let daysToUse: string[] = [];
//     if (repeat) {
//       if (weekStart) {
//         daysToUse = activeDays.map((dayIndex) => {
//           const dayDate = new Date(weekStart);
//           dayDate.setDate(weekStart.getDate() + dayIndex);
//           const dayOfWeek = dayDate.getDay();
//           const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//           return dayKeys[dayOfWeek];
//         });
//       } else {
//         daysToUse = activeDays.map((dayIndex) => DAY_KEYS[dayIndex]);
//       }
//     } else if (isEditMode && editingSlot?.day) {
//       const dayOfWeek = editingSlot.day.getDay();
//       const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//       daysToUse = [dayKeys[dayOfWeek]];
//     } else if (selectedCell) {
//       const dayOfWeek = selectedCell.day.getDay();
//       const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//       daysToUse = [dayKeys[dayOfWeek]];
//     }

//     // Check conflicts for each selected day
//     for (const dayKey of daysToUse) {
//       const daySlots = repeatDaysData[dayKey] || [];
//       const dayName = dayNames[dayKey] || dayKey;

//       for (const existingSlot of daySlots) {
//         // Skip the current slot if we're editing (to avoid self-conflict)
//         if (isEditMode && editingSlot && (existingSlot.id === editingSlot.id || existingSlot.slotId === editingSlot.id)) {
//           continue;
//         }

//         // Check if times overlap
//         if (isTimeOverlap(startTime, endTime, existingSlot.startTime, existingSlot.endTime)) {
//           // Check if same teacher
//           if (existingSlot.teacherId === selectedTeacher) {
//             conflicts.push(`${dayName}: Teacher already has a slot from ${existingSlot.startTime} to ${existingSlot.endTime}`);
//           }
//           // Check if same classroom
//           else if (existingSlot.classRoomId === selectedRoom) {
//             conflicts.push(`${dayName}: Classroom already booked from ${existingSlot.startTime} to ${existingSlot.endTime}`);
//           }
//         }
//       }
//     }

//     // If conflicts found, show error and return
//     if (conflicts.length > 0) {
//       const conflictMessage = `⛔ Time Conflict Detected:\n\n${conflicts.map((c, i) => `${i + 1}. ${c}`).join("\n")}`;
//       console.log("❌ Conflict detected:", conflictMessage);
//       Alert.alert("Time Conflict", conflictMessage);
//       return;
//     }

//     // Build slot object
//     const slotObject = {
//       subjectId: selectedSubject,
//       teacherId: selectedTeacher,
//       classRoomId: selectedRoom,
//       startTime: startTime,
//       endTime: endTime,
//     };

//     // Build repeatDays payload (daysToUse already calculated above in conflict validation)
//     // Final validation: ensure we have at least one day
//     if (daysToUse.length === 0) {
//       Alert.alert("Error", "Please select at least one day");
//       return;
//     }

//     // ⭐ CHECK IF DAY HAS CHANGED (for edit mode)
//     let dayChanged = false;
//     let originalDayKey = "";
    
//     if (isEditMode && editingSlot?.day) {
//       // Get original day key from editingSlot
//       const originalDayDate = editingSlot.day instanceof Date ? editingSlot.day : new Date(editingSlot.day);
//       const originalDayOfWeek = originalDayDate.getDay();
//       const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//       originalDayKey = dayKeys[originalDayOfWeek];
      
//       // Check if new day is different from original day
//       // For single day edit, daysToUse should have only one day
//       if (daysToUse.length === 1 && daysToUse[0] !== originalDayKey) {
//         dayChanged = true;
//         console.log("🔄 Day changed detected!");
//         console.log("🔄 Original day:", originalDayKey);
//         console.log("🔄 New day:", daysToUse[0]);
//       }
//     }

//     let payload: any;

//     // For UPDATE: Use flat structure like web (simple object with repeatDays array)
//     if (isEditMode && editingSlot) {
//       // Clean the ID - remove any extra quotes or whitespace
//       let slotId = (editingSlot.id || editingSlot.slotId || "").toString();
//       // Remove quotes from start and end only (not from middle)
//       slotId = slotId.replace(/^["']+|["']+$/g, "").trim();
      
//       console.log("✏️ Edit mode - Slot ID:", slotId);
//       console.log("✏️ Original ID from editingSlot:", editingSlot.id);
      
//       if (!slotId) {
//         Alert.alert("Error", "Slot ID is missing. Cannot update slot.");
//         return;
//       }

//       // Convert day keys to day indices (like web: [0, 1, 2] for M, T, W)
//       // Web uses: 0=Monday, 1=Tuesday, etc.
//       const dayKeyToIndex: Record<string, number> = {
//         "M": 0,
//         "T": 1,
//         "W": 2,
//         "Th": 3,
//         "F": 4,
//         "Sa": 5,
//         "Su": 6,
//       };
//       const repeatDaysArray = daysToUse
//         .map(dayKey => dayKeyToIndex[dayKey])
//         .filter(idx => idx !== undefined);

//       // Build flat payload like web version
//       payload = {
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         batchId: selectedBatchId,
//         id: slotId,
//         subjectId: selectedSubject,
//         teacherId: selectedTeacher,
//         classRoomId: selectedRoom,
//         startTime: startTime,
//         endTime: endTime,
//         repeatDays: repeatDaysArray, // Array of day indices, not nested object
//         startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
//         endDate: weekStart ? (() => {
//           const end = new Date(weekStart);
//           end.setDate(weekStart.getDate() + 6);
//           return end.toISOString().split('T')[0];
//         })() : "",
//       };
      
//       console.log("✏️ Update payload (flat structure like web):", JSON.stringify(payload, null, 2));
//     } else {
//       // For CREATE: Use FLAT structure like web (not nested)
//       // Convert day keys to day indices (0=Monday, 1=Tuesday, etc.)
//       const dayKeyToIndex: Record<string, number> = {
//         "M": 0,
//         "T": 1,
//         "W": 2,
//         "Th": 3,
//         "F": 4,
//         "Sa": 5,
//         "Su": 6,
//       };
//       const repeatDaysArray = daysToUse
//         .map(dayKey => dayKeyToIndex[dayKey])
//         .filter(idx => idx !== undefined);

//       // Build flat payload like web version
//       payload = {
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         batchId: selectedBatchId,
//         subjectId: selectedSubject,
//         teacherId: selectedTeacher,
//         classRoomId: selectedRoom,
//         startTime: startTime,
//         endTime: endTime,
//         repeatDays: repeatDaysArray, // Array of day indices, not nested object
//         startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
//         endDate: weekStart ? (() => {
//           const end = new Date(weekStart);
//           end.setDate(weekStart.getDate() + 6);
//           return end.toISOString().split('T')[0];
//         })() : "",
//       };
      
//       console.log("📦 CREATE payload (flat structure like web):", JSON.stringify(payload, null, 2));
//     }

//     console.log(`📦 Final Payload (${isEditMode ? "UPDATE" : "CREATE"}):`, JSON.stringify(payload, null, 2));
//     console.log("📦 Organization:", {
//       customerId: selectedOrganization?.customerId,
//       organizationId: selectedOrganization?.organizationId,
//     });

//     // ⭐ HANDLE DAY CHANGE: If day changed, delete old slot first, then create new one
//     if (dayChanged && isEditMode && editingSlot) {
//       console.log("🔄 Day changed - Deleting old slot and creating new one...");
      
//       // Clean the ID
//       let slotId = (editingSlot.id || editingSlot.slotId || "").toString();
//       slotId = slotId.replace(/^["']+|["']+$/g, "").trim();
      
//       // Build delete payload
//       const deletePayload = {
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         batchId: selectedBatchId,
//         startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
//         endDate: weekStart ? (() => {
//           const end = new Date(weekStart);
//           end.setDate(weekStart.getDate() + 6);
//           return end.toISOString().split('T')[0];
//         })() : "",
//         id: slotId,
//         dayKey: originalDayKey,
//         startTime: editingSlot.startTime || startTime,
//         endTime: editingSlot.endTime || endTime,
//       };
      
//       console.log("🗑️ Delete payload (old day):", JSON.stringify(deletePayload, null, 2));
      
//       // First delete from old day
//       deleteMutation.mutate(deletePayload, {
//         onSuccess: (deleteResponse) => {
//           console.log("✅ Old slot deleted successfully:", deleteResponse);
          
//           // Now create new slot in new day
//           console.log("➕ Creating new slot in new day...");
//           createMutation.mutate(payload, {
//             onSuccess: (createResponse) => {
//               console.log("✅ New slot created successfully:", createResponse);
//               handleSuccessResponse(createResponse, false);
//             },
//             onError: (createError) => {
//               console.error("❌ Error creating new slot:", createError);
//               handleErrorResponse(createError, false);
//             },
//           });
//         },
//         onError: (deleteError: any) => {
//           console.error("❌ Error deleting old slot:", deleteError);
//           const errorMessage = deleteError?.response?.data?.message || deleteError?.message || "Failed to delete old slot. Please try again.";
//           Alert.alert("Error", errorMessage);
//         },
//       });
      
//       return; // Exit early, don't proceed with normal update
//     }

//     // Call API (normal update or create)
//     const mutation = isEditMode ? updateMutation : createMutation;
//     console.log(`🚀 Calling ${isEditMode ? "updateMutation" : "createMutation"}.mutate...`);
//     mutation.mutate(payload, {
//       onSuccess: (response) => {
//         console.log(`✅ TimeTable ${isEditMode ? "updated" : "created"} successfully:`, response);
//         console.log("📝 Response type:", typeof response);
//         console.log("📝 Response stringified:", JSON.stringify(response));
//         console.log("📝 Response data:", response?.data);
//         console.log("📝 Response statusCode:", response?.statusCode);
//         console.log("📝 Response message:", response?.message);
        
//         // Check for error responses (404, etc.) - If axios returns error as response
//         if (response?.status === 404 || response?.data?.statusCode === 404) {
//           console.error("❌ 404 Error: Resource not found (caught in onSuccess)");
//           // Throw error so it goes to onError handler for proper handling
//           throw new Error(response?.data?.message || "API endpoint not found (404). Please check the backend service.");
//         }
        
//         // Check if response is empty string (backend returns "" but saves data like web)
//         const isEmptyResponse = typeof response === "string" && response === "";
//         const hasNoData = !response?.data && !response?.statusCode;
        
//         if (isEmptyResponse) {
//           console.log("ℹ️ Backend returned empty string (like web), but data should be saved");
//           // Don't show warning - web me bhi same response aata hai and it works
//           // Proceed with refetch - data should be saved
//         } else if (hasNoData && !isEmptyResponse) {
//           console.warn("⚠️ WARNING: Backend returned invalid response!");
//           console.warn("⚠️ This might indicate the data was not saved properly.");
          
//           // Show warning to user only if response is not empty string
//           Alert.alert(
//             "Warning",
//             "Slot creation may have failed. Please check if the slot appears in the timetable. If not, please try again or contact support.",
//             [
//               {
//                 text: "OK",
//                 style: "default",
//               },
//             ]
//           );
//         }
        
//         // Invalidate ALL timetable queries (with any params) to refresh grid
//         queryClient.invalidateQueries({
//           predicate: (query) => {
//             return query.queryKey[0] === "timeTable";
//           },
//         });
        
//         // If weekStart is provided, refetch with exact params
//         if (weekStart && selectedOrganization && selectedBatchId) {
//           const startWeekDate = weekStart.toISOString().split('T')[0];
//           const endDate = new Date(weekStart);
//           endDate.setDate(weekStart.getDate() + 6);
//           const endWeekDate = endDate.toISOString().split('T')[0];
          
//           const refetchParams = {
//             customerId: selectedOrganization.customerId,
//             organizationId: selectedOrganization.organizationId,
//             batchId: selectedBatchId,
//             startWeekDate: startWeekDate,
//             endWeekDate: endWeekDate,
//           };
          
//           console.log("🔄 Refetching with params:", refetchParams);
          
//           // Longer delay to ensure backend has fully processed and committed
//           setTimeout(() => {
//             console.log("🔄 Executing refetch now...");
//             queryClient.refetchQueries({
//               queryKey: ["timeTable", refetchParams],
//             }).then(() => {
//               console.log("✅ Refetch completed");
//             }).catch((err) => {
//               console.error("❌ Refetch error:", err);
//             });
//           }, 2000); // Increased to 2 seconds
//         } else {
//           // Fallback: refetch all timeTable queries
//           setTimeout(() => {
//             queryClient.refetchQueries({
//               predicate: (query) => {
//                 return query.queryKey[0] === "timeTable";
//               },
//             });
//           }, 2000);
//         }
        
//         // Call onSuccess callback if provided
//         if (onSuccess) {
//           onSuccess();
//         }
//         // Close modal
//         onClose();
//         // Reset form
//         setSelectedSubject("");
//         setSelectedTeacher("");
//         setSelectedRoom("");
//         setStartTime("");
//         setEndTime("");
//         setActiveDays([]);
//       },
//       onError: (error: any) => {
//         console.error(`❌ Error ${isEditMode ? "updating" : "creating"} TimeTable:`, error);
//         console.error("❌ Error details:", JSON.stringify(error, null, 2));
//         console.error("❌ Error type:", typeof error);
//         console.error("❌ Error message:", error?.message);
//         console.error("❌ Error response:", error?.response);
//         console.error("❌ Error status:", error?.response?.status);
//         console.error("❌ Error statusCode:", error?.response?.data?.statusCode);
//         console.error("❌ Error response message:", error?.response?.data?.message);
//         console.error("❌ API URL that failed:", isEditMode ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE);
        
//         // Get error message from different possible locations
//         const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEditMode ? "update" : "create"} slot. Please try again.`;
//         const is404 = error?.response?.status === 404 || 
//                      error?.response?.data?.statusCode === 404 || 
//                      error?.message?.includes("404") || 
//                      error?.message?.includes("not found") ||
//                      error?.message?.includes("Not Found");
        
//         // Check for 404 specifically
//         if (is404) {
//           const apiUrl = isEditMode ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE;
//           Alert.alert(
//             "404 - Resource Not Found",
//             `The API endpoint was not found. Please check:\n\n1. API URL: ${apiUrl}\n2. Payload structure\n3. Backend service status\n\nError: ${errorMessage}`
//           );
//         } else {
//           Alert.alert(
//             "Error",
//             errorMessage
//           );
//         }
//       },
//     });
//   };

//   return (
//     <>
//       <Modal visible={visible} transparent animationType="slide">
//         <View style={styles.backdrop}>
//           <ScrollView
//             style={styles.modalContainer}
//             contentContainerStyle={{ paddingBottom: 40 }}
//           >
//           {/* Title */}
//           <Text style={styles.title}>
//             {isEditMode ? "Edit Slot" : `Add New Slot for ${selectedBatch}`}
//           </Text>

//           {/* SUBJECT */}
//           <Text style={styles.label}>Subject</Text>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={styles.dropdownBox}
//               onPress={() => {
//                 setSubjectDropdownOpen(!subjectDropdownOpen);
//                 if (subjectDropdownOpen) {
//                   setTeacherDropdownOpen(false);
//                   setRoomDropdownOpen(false);
//                   setStartTimeDropdownOpen(false);
//                   setEndTimeDropdownOpen(false);
//                 }
//               }}
//             >
//               <View style={styles.dropdownContent}>
//                 <Text style={[styles.dropdownText, !selectedSubject && styles.dropdownPlaceholder]}>
//                   {selectedSubject 
//                     ? combinedSubjectOptions.find((s: { value: string; label: string }) => s.value === selectedSubject)?.label 
//                     : "Select subject"}
//                 </Text>
//                 <Text style={styles.dropdownArrow}>{subjectDropdownOpen ? "▲" : "▼"}</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.plusBtn}
//               onPress={() => setAddSubjectModalVisible(true)}
//             >
//               <Text style={styles.plusText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Subject Dropdown List */}
//           {subjectDropdownOpen && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select subject</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {combinedSubjectOptions.map((subject: { value: string; label: string }) => {
//                   const isSelected = selectedSubject === subject.value;
//                   return (
//                     <TouchableOpacity
//                       key={subject.value}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setSelectedSubject(subject.value);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {subject.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* TEACHER */}
//           <Text style={styles.label}>Teacher</Text>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={[styles.dropdownBox, !selectedSubject && styles.dropdownBoxDisabled]}
//               onPress={() => {
//                 if (selectedSubject) {
//                   setTeacherDropdownOpen(!teacherDropdownOpen);
//                   if (teacherDropdownOpen) {
//                     setRoomDropdownOpen(false);
//                     setStartTimeDropdownOpen(false);
//                     setEndTimeDropdownOpen(false);
//                   }
//                 }
//               }}
//               disabled={!selectedSubject}
//             >
//               <View style={styles.dropdownContent}>
//                 <Text style={[styles.dropdownText, (!selectedTeacher || !selectedSubject) && styles.dropdownPlaceholder]}>
//                   {selectedTeacher 
//                     ? teacherOptions.find((t: { value: string; label: string }) => t.value === selectedTeacher)?.label 
//                     : "Select teacher"}
//                 </Text>
//                 <Text style={[styles.dropdownArrow, !selectedSubject && { opacity: 0.5 }]}>
//                   {teacherDropdownOpen ? "▲" : "▼"}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.plusBtn}>
//               <Text style={styles.plusText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Teacher Dropdown List */}
//           {teacherDropdownOpen && selectedSubject && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select teacher</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {teacherOptions.map((teacher: { value: string; label: string }) => {
//                   const isSelected = selectedTeacher === teacher.value;
//                   return (
//                     <TouchableOpacity
//                       key={teacher.value}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setSelectedTeacher(teacher.value);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {teacher.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* ROOM */}
//           <Text style={styles.label}>Room</Text>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={[styles.dropdownBox, !selectedTeacher && styles.dropdownBoxDisabled]}
//               onPress={() => {
//                 if (selectedTeacher) {
//                   setRoomDropdownOpen(!roomDropdownOpen);
//                   if (roomDropdownOpen) {
//                     setStartTimeDropdownOpen(false);
//                     setEndTimeDropdownOpen(false);
//                   }
//                 }
//               }}
//               disabled={!selectedTeacher}
//             >
//               <View style={styles.dropdownContent}>
//                 <Text style={[styles.dropdownText, (!selectedRoom || !selectedTeacher) && styles.dropdownPlaceholder]}>
//                   {selectedRoom 
//                     ? classroomOptions.find((r: { value: string; label: string }) => r.value === selectedRoom)?.label 
//                     : "Select room"}
//                 </Text>
//                 <Text style={[styles.dropdownArrow, !selectedTeacher && { opacity: 0.5 }]}>
//                   {roomDropdownOpen ? "▲" : "▼"}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.plusBtn} onPress={handleRoomPlusPress}>
//               <Text style={styles.plusText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Room Dropdown List */}
//           {roomDropdownOpen && selectedTeacher && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select room</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {classroomOptions.map((room: { value: string; label: string }) => {
//                   const isSelected = selectedRoom === room.value;
//                   return (
//                     <TouchableOpacity
//                       key={room.value}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setSelectedRoom(room.value);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {room.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* START TIME */}
//           <Text style={styles.label}>Start Time</Text>
//           <TouchableOpacity 
//             style={[styles.dropdownBox, !selectedRoom && styles.dropdownBoxDisabled]}
//             onPress={() => {
//               if (selectedRoom) {
//                 setStartTimeDropdownOpen(!startTimeDropdownOpen);
//                 if (startTimeDropdownOpen) {
//                   setEndTimeDropdownOpen(false);
//                 }
//               }
//             }}
//             disabled={!selectedRoom}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownText, (!startTime || !selectedRoom) && styles.dropdownPlaceholder]}>
//                 {startTime || "Select start time"}
//               </Text>
//               <Text style={[styles.dropdownArrow, !selectedRoom && { opacity: 0.5 }]}>
//                 {startTimeDropdownOpen ? "▲" : "▼"}
//               </Text>
//             </View>
//           </TouchableOpacity>

//           {/* Start Time Dropdown List */}
//           {startTimeDropdownOpen && selectedRoom && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select start time</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {startTimes.map((time: string) => {
//                   const isSelected = startTime === time;
//                   return (
//                     <TouchableOpacity
//                       key={time}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setStartTime(time);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {time}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* END TIME */}
//           <Text style={styles.label}>End Time</Text>
//           <TouchableOpacity 
//             style={[styles.dropdownBox, !startTime && styles.dropdownBoxDisabled]}
//             onPress={() => {
//               if (startTime) {
//                 setEndTimeDropdownOpen(!endTimeDropdownOpen);
//               }
//             }}
//             disabled={!startTime}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownText, (!endTime || !startTime) && styles.dropdownPlaceholder]}>
//                 {endTime || "Select end time"}
//               </Text>
//               <Text style={[styles.dropdownArrow, !startTime && { opacity: 0.5 }]}>
//                 {endTimeDropdownOpen ? "▲" : "▼"}
//               </Text>
//             </View>
//           </TouchableOpacity>

//           {/* End Time Dropdown List */}
//           {endTimeDropdownOpen && startTime && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select end time</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {endTimes.map((time: string) => {
//                   const isSelected = endTime === time;
//                   return (
//                     <TouchableOpacity
//                       key={time}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setEndTime(time);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {time}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* REPEAT TOGGLE */}
//           <View style={styles.repeatRow}>
//             <Text style={styles.repeatLabel}>Repeat this slot</Text>
//             <Switch
//               value={repeat}
//               onValueChange={setRepeat}
//               thumbColor="#FFF"
//               trackColor={{ true: COLORS.primary, false: "#CCC" }}
//             />
//           </View>

//           {/* SELECT DAYS */}
//           {/* SELECT DAYS (Visible only when REPEAT = true) */}
// {repeat && (
//   <>
//     <Text style={styles.label}>Select days</Text>

//     <View style={styles.daysRow}>
//       {DAY_KEYS.map((d, i) => {
//         const isActive = activeDays.includes(i);
//         return (
//           <TouchableOpacity
//             key={i}
//             style={[
//               styles.dayCircle,
//               isActive && { backgroundColor: PURPLE },
//             ]}
//             onPress={() => toggleDay(i)}
//           >
//             <Text
//               style={[
//                 styles.dayText,
//                 isActive && { color: "#FFF", fontWeight: "700" },
//               ]}
//             >
//               {d}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   </>
// )}


//           {/* FOOTER BUTTONS */}
//           <View style={styles.footerRow}>
//             <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
//               <Text style={styles.cancelText}>Cancel</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.saveBtn, (isEditMode ? updateMutation : createMutation).isPending && styles.saveBtnDisabled]}
//               onPress={() => {
//                 console.log("🟢 BUTTON CLICKED!");
//                 handleAddSlot();
//               }}
//               disabled={(isEditMode ? updateMutation : createMutation).isPending}
//             >
//               <Text style={styles.saveBtnText}>
//                 {(isEditMode ? updateMutation : createMutation).isPending 
//                   ? (isEditMode ? "Updating..." : "Adding...") 
//                   : (isEditMode ? "UPDATE SLOT" : "ADD SLOT +")}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </View>
//     </Modal>

//       <Modal
//         visible={addSubjectModalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setAddSubjectModalVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.addSubjectBackdrop}
//           activeOpacity={1}
//           onPress={() => setAddSubjectModalVisible(false)}
//         >
//           <TouchableOpacity
//             style={styles.addSubjectCard}
//             activeOpacity={1}
//             onPress={(e) => e.stopPropagation()}
//           >
//             <View style={styles.addSubjectHeader}>
//               <Text style={styles.addSubjectTitle}>Add Subject</Text>
//               <TouchableOpacity onPress={() => setAddSubjectModalVisible(false)}>
//                 <Text style={styles.addSubjectClose}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.addSubjectMeta}>
//               <Text style={styles.addSubjectMetaLabel}>Course: </Text>
//               {courseName}
//             </Text>
//             <Text style={styles.addSubjectMeta}>
//               <Text style={styles.addSubjectMetaLabel}>Batch: </Text>
//               {batchName}
//             </Text>

//             {subjectModalStep === "select" ? (
//               <>
//                 <View style={styles.selectDropdownBox}>
//                   <Picker
//                     selectedValue={tempSubjectSelection}
//                     onValueChange={(val) => setTempSubjectSelection(val)}
//                   >
//                     <Picker.Item label="Select subject" value="" />
//                     {combinedSubjectOptions.map((subject) => (
//                       <Picker.Item
//                         key={`modal-subject-${subject.value}`}
//                         label={subject.label}
//                         value={subject.value}
//                       />
//                     ))}
//                   </Picker>
//                 </View>

//                 <ScrollView style={styles.subjectList} nestedScrollEnabled>
//                   {combinedSubjectOptions.map((subject) => {
//                     const isActive = tempSubjectSelection === subject.value;
//                     return (
//                       <TouchableOpacity
//                         key={`modal-option-${subject.value}`}
//                         style={styles.subjectOptionRow}
//                         onPress={() => setTempSubjectSelection(subject.value)}
//                       >
//                         <View style={[styles.subjectCheckbox, isActive && styles.subjectCheckboxActive]}>
//                           {isActive && <Text style={styles.subjectCheckboxTick}>✓</Text>}
//                         </View>
//                         <Text style={styles.subjectOptionLabel}>{subject.label}</Text>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </ScrollView>

//                 <TouchableOpacity style={styles.createLinkRow} onPress={() => setSubjectModalStep("create")}>
//                   <Text style={styles.createLinkIcon}>＋</Text>
//                   <Text style={styles.createLinkText}>Create New Subject</Text>
//                 </TouchableOpacity>

//                 <View style={styles.addSubjectFooter}>
//                   <TouchableOpacity
//                     style={styles.addSubjectCancel}
//                     onPress={() => setAddSubjectModalVisible(false)}
//                   >
//                     <Text style={styles.addSubjectCancelText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.addSubjectSubmit,
//                       !tempSubjectSelection && styles.addSubjectSubmitDisabled,
//                     ]}
//                     disabled={!tempSubjectSelection}
//                     onPress={() => {
//                       if (tempSubjectSelection) {
//                         setSelectedSubject(tempSubjectSelection);
//                         setAddSubjectModalVisible(false);
//                       }
//                     }}
//                   >
//                     <Text style={styles.addSubjectSubmitText}>Submit</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             ) : (
//               <>
//                 <View style={styles.addSubjectInputRow}>
//                   <TextInput
//                     style={styles.addSubjectTextInput}
//                     placeholder="Enter new subject name"
//                     value={newSubjectName}
//                     onChangeText={setNewSubjectName}
//                     placeholderTextColor="#9CA3AF"
//                   />
//                   <TouchableOpacity style={styles.addSubjectAddBtn} onPress={handleAddPendingSubject}>
//                     <Text style={styles.addSubjectAddText}>＋ ADD</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {pendingSubjects.length > 0 ? (
//                   <View style={styles.pendingList}>
//                     {pendingSubjects.map((name) => (
//                       <View key={name} style={styles.pendingItem}>
//                         <View style={styles.pendingHeader}>
//                           <Text style={styles.pendingTitle}>{name}</Text>
//                           <TouchableOpacity onPress={() => handleRemovePendingSubject(name)}>
//                             <Text style={styles.pendingRemove}>✕</Text>
//                           </TouchableOpacity>
//                         </View>
//                         <View style={styles.pendingTimeRow}>
//                           <TextInput style={styles.pendingTimeInput} placeholder="Start time" editable={false} />
//                           <TextInput style={styles.pendingTimeInput} placeholder="End time" editable={false} />
//                         </View>
//                       </View>
//                     ))}
//                   </View>
//                 ) : (
//                   <Text style={styles.addSubjectEmpty}>Subjects you add will appear here.</Text>
//                 )}

//                 <View style={styles.addSubjectFooter}>
//                   <TouchableOpacity
//                     style={styles.addSubjectCancel}
//                     onPress={() => {
//                       setSubjectModalStep("select");
//                       setPendingSubjects([]);
//                       setNewSubjectName("");
//                     }}
//                   >
//                     <Text style={styles.addSubjectCancelText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.addSubjectSubmit,
//                       pendingSubjects.length === 0 && styles.addSubjectSubmitDisabled,
//                     ]}
//                     disabled={pendingSubjects.length === 0}
//                     onPress={handleSubmitNewSubjects}
//                   >
//                     <Text style={styles.addSubjectSubmitText}>Submit</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>
//     </>
//   );
// };

// export default SlotFormModal;

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.35)",
//     justifyContent: "center",  // ✅ Center me show hoga
//     alignItems: "center",
//   },
//   modalContainer: {
//     maxHeight: "50%",        // ✅ 70% se 50% (ya 45% agar aur chahiye)
//   width: "85%",            // ✅ 90% se 85% (ya 80% agar aur chahiye)
//   backgroundColor: "#FFF",
//   borderRadius: 20,
//   padding: 16,             // ✅ 20 se 16 (padding kam karein)
//   alignSelf: "center",
//   // maxHeight: "70%",        // Current
//   // width: "90%",            // Current
//   // backgroundColor: "#FFF",
//   // borderRadius: 20,
//   // padding: 20,
//   // alignSelf: "center",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginTop: 12,
//     marginBottom: 4,
//   },
//   dropdownBox: {
//     flex: 1,
//     height: 45,              // ✅ Fixed height add karein (default se kam)
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     borderRadius: 10,
//     overflow: "hidden",
//     justifyContent: "center"
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   plusBtn: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     borderWidth: 2,
//     borderColor: "#0B4DA2",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   plusText: {
//     color: "#0B4DA2",
//     fontSize: 22,
//     fontWeight: "700",
//   },
//   repeatRow: {
//     marginTop: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   repeatLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   daysRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 8,
//   },
//   dayCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   dayText: {
//     color: "#444",
//     fontWeight: "600",
//   },
//   footerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 26,
//   },
//   cancelBtn: {
//     flex: 1,
//     marginRight: 10,
//     padding: 14,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     alignItems: "center",
//   },
//   cancelText: { fontSize: 15, fontWeight: "600", color: "#111" },
//   saveBtn: {
//     flex: 1,
//     marginLeft: 10,
//     padding: 14,
//     borderRadius: 8,
//     backgroundColor: COLORS.primary,
//     alignItems: "center",
//   },
//   saveBtnText: {
//     color: "#FFF",
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   saveBtnDisabled: {
//     opacity: 0.6,
//   },
//   addSubjectBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   addSubjectCard: {
//     width: "100%",
//     maxWidth: 420,
//     backgroundColor: "#FFF",
//     borderRadius: 16,
//     padding: 20,
//   },
//   addSubjectHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   addSubjectTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//   },
//   addSubjectClose: {
//     fontSize: 18,
//     color: "#6B7280",
//   },
//   addSubjectMeta: {
//     fontSize: 14,
//     color: "#4B5563",
//     marginBottom: 4,
//   },
//   addSubjectMetaLabel: {
//     fontWeight: "600",
//     color: "#111827",
//   },
//   selectDropdownBox: {
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     borderRadius: 10,
//     overflow: "hidden",
//     marginTop: 16,
//   },
//   subjectList: {
//     maxHeight: 220,
//     marginTop: 12,
//   },
//   subjectOptionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   subjectCheckbox: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   subjectCheckboxActive: {
//     borderColor: COLORS.primary,
//     backgroundColor: "rgba(107,87,242,0.15)",
//   },
//   subjectCheckboxTick: {
//     color: COLORS.primary,
//     fontSize: 12,
//     fontWeight: "700",
//   },
//   subjectOptionLabel: {
//     color: "#111827",
//     fontSize: 14,
//   },
//   createLinkRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 16,
//   },
//   createLinkIcon: {
//     color: COLORS.primary,
//     fontSize: 18,
//     marginRight: 6,
//   },
//   createLinkText: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
//   addSubjectInputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     marginTop: 16,
//   },
//   addSubjectTextInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     fontSize: 15,
//     color: "#111827",
//   },
//   addSubjectAddBtn: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#16A34A",
//     backgroundColor: "rgba(34,197,94,0.1)",
//   },
//   addSubjectAddText: {
//     color: "#16A34A",
//     fontWeight: "700",
//   },
//   pendingList: {
//     marginTop: 16,
//   },
//   pendingItem: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//   },
//   pendingHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   pendingTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   pendingRemove: {
//     color: "#9CA3AF",
//     fontSize: 16,
//   },
//   pendingTimeRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginTop: 10,
//   },
//   pendingTimeInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     color: "#9CA3AF",
//   },
//   addSubjectEmpty: {
//     textAlign: "center",
//     color: "#9CA3AF",
//     marginVertical: 24,
//   },
//   addSubjectFooter: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 12,
//     marginTop: 12,
//   },
//   addSubjectCancel: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//   },
//   addSubjectCancelText: {
//     color: "#6B7280",
//     fontWeight: "600",
//   },
//   addSubjectSubmit: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     backgroundColor: COLORS.primary,
//   },
//   addSubjectSubmitDisabled: {
//     backgroundColor: "#CBD5F5",
//   },
//   addSubjectSubmitText: {
//     color: "#FFF",
//     fontWeight: "700",
//   },
//   // Cascading dropdown styles
//   dropdownContent: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     height: "100%",
//   },
//   dropdownText: {
//     fontSize: 14,
//     color: "#111827",
//     flex: 1,
//   },
//   dropdownPlaceholder: {
//     color: "#9CA3AF",
//   },
//   dropdownArrow: {
//     color: "#9CA3AF",
//     fontSize: 12,
//     marginLeft: 8,
//   },
//   dropdownBoxDisabled: {
//     opacity: 0.5,
//   },
//   cascadingDropdown: {
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     marginTop: 8,
//     marginBottom: 8,
//     maxHeight: 250,
//     overflow: "hidden",
//   },
//   cascadingDropdownTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#111827",
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   cascadingDropdownList: {
//     maxHeight: 200,
//   },
//   cascadingDropdownItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   cascadingDropdownItemSelected: {
//     backgroundColor: "rgba(107,87,242,0.05)",
//   },
//   cascadingDropdownItemText: {
//     fontSize: 14,
//     color: "#111827",
//     flex: 1,
//   },
//   cascadingDropdownItemTextSelected: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
//   cascadingDropdownCheck: {
//     color: COLORS.primary,
//     fontSize: 16,
//     fontWeight: "700",
//     marginLeft: 8,
//   },
// });


// import React, { useState, useMemo, useEffect } from "react";
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Switch,
//   Alert,
//   TextInput,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useTeachersListQuery } from "../../../../apis/hooks/teachers/query/useTeachersList.query";
// import { useGetClassroomListQuery } from "../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { useCourseDetailsQuery } from "../../../../apis/hooks/course/query/useCourseDetails.query";
// import { useCreateTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useCreateTimeTable.mutation";
// import { useUpdateTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useUpdateTimeTable.mutation";
// import { useDeleteTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useDeleteTimeTable.mutation";
// import { useQueryClient } from "@tanstack/react-query";
// import { apiUrls } from "../../../../apis/urls";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../app/store";
// import { COLORS } from "../../../../colors";
// import { TTimetableCell } from "./TimetableGrid";

// type SlotFormModalProps = {
//   visible: boolean;
//   selectedCell: TTimetableCell | null;
//   editingSlot?: any | null; // Slot data when editing
//   onClose: () => void;
//   onNavigateToClassrooms?: () => void;
//   selectedBatch?: string;
//   selectedBatchId?: string;
//   batchData?: any;
//   onSuccess?: () => void; // Callback after successful creation
//   weekStart?: Date; // Week start date for refetch
//   selectedOrganization?: any; // Organization for refetch params
//   timeTableData?: any; // Timetable data for conflict validation
// };

// const PURPLE = "#6B57F2";
// const DAY_KEYS = ["M", "T", "W", "Th", "F", "Sa", "Su"];

// // Convert time string to minutes
// const timeToMinutes = (time: string): number => {
//   const [h, m] = time.split(":").map(Number);
//   return h * 60 + m;
// };

// // Convert minutes to time string
// const minutesToTime = (minutes: number): string => {
//   const h = Math.floor(minutes / 60).toString().padStart(2, "0");
//   const m = (minutes % 60).toString().padStart(2, "0");
//   return `${h}:${m}`;
// };

// // Generate start times: operating hours ke andar 15 min intervals
// const generateStartTimes = (opening: string, closing: string) => {
//   const startMin = timeToMinutes(opening);
//   const endMin = timeToMinutes(closing);
//   const times: string[] = [];

//   for (let minutes = startMin; minutes <= endMin; minutes += 15) {
//     times.push(minutesToTime(minutes));
//   }
//   return times;
// };

// // Generate end times = start + 15 min increments, lekin closing time se zyada nahi
// const generateEndTimes = (start: string, closing: string) => {
//   const startMin = timeToMinutes(start);
//   const closingMin = timeToMinutes(closing);
//   const endTimes: string[] = [];

//   for (let minutes = startMin + 15; minutes <= closingMin; minutes += 15) {
//     endTimes.push(minutesToTime(minutes));
//   }
//   return endTimes;
// };

// // Check if two time slots overlap
// const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
//   const start1Min = timeToMinutes(start1);
//   const end1Min = timeToMinutes(end1);
//   const start2Min = timeToMinutes(start2);
//   const end2Min = timeToMinutes(end2);
  
//   // Two slots overlap if: start1 < end2 AND end1 > start2
//   return start1Min < end2Min && end1Min > start2Min;
// };

// const SlotFormModal = ({
//   visible,
//   selectedCell,
//   editingSlot,
//   onClose,
//   onNavigateToClassrooms,
//   selectedBatch = "Batch",
//   selectedBatchId = "",
//   batchData,
//   onSuccess,
//   weekStart,
//   selectedOrganization: propSelectedOrganization,
//   timeTableData,
// }: SlotFormModalProps) => {
//   console.log("📋 === SLOT FORM MODAL RENDERED ===");
//   console.log("📋 visible:", visible);
//   console.log("📋 editingSlot prop:", editingSlot);
//   console.log("📋 selectedCell:", selectedCell);
  
//   // ⭐ TEACHER LIST API
//   const { data: teacherData } = useTeachersListQuery();

//   // ⭐ CLASSROOM LIST API
//   const { data: classroomData } = useGetClassroomListQuery();

//   // ⭐ Selected batch info + courseId
//   const selectedBatchInfo = useMemo(() => {
//     if (batchData?.statusCode === 200 && Array.isArray(batchData.data) && selectedBatchId) {
//       return batchData.data.find((b: any) => b.batchId === selectedBatchId) || null;
//     }
//     return null;
//   }, [batchData, selectedBatchId]);

//   const courseId = selectedBatchInfo?.courses?.[0]?.courseId || "";

//   // ⭐ COURSE DETAIL API (subjects ke liye)
//   const { data: courseDetailData } = useCourseDetailsQuery({
//     courseId: courseId || "",
//   });

//   const [selectedTeacher, setSelectedTeacher] = useState("");
//   const [selectedRoom, setSelectedRoom] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [customSubjects, setCustomSubjects] = useState<{ value: string; label: string }[]>([]);
//   const [addSubjectModalVisible, setAddSubjectModalVisible] = useState(false);
//   const [newSubjectName, setNewSubjectName] = useState("");
//   const [pendingSubjects, setPendingSubjects] = useState<string[]>([]);
//   const [subjectModalStep, setSubjectModalStep] = useState<"select" | "create">("select");
//   const [tempSubjectSelection, setTempSubjectSelection] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [repeat, setRepeat] = useState(true);

//   // ⭐ Cascading dropdown states
//   const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
//   const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
//   const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);
//   const [startTimeDropdownOpen, setStartTimeDropdownOpen] = useState(false);
//   const [endTimeDropdownOpen, setEndTimeDropdownOpen] = useState(false);

//   // ⭐ TEACHER OPTIONS for Picker
//   const teacherOptions = useMemo(() => {
//     if (teacherData?.statuscode === 200 && Array.isArray(teacherData.data)) {
//       return teacherData.data.map((t: any) => ({
//         value: t.teacherId,
//         label: `${t.teacherFirstName} ${t.teacherLastName || ""}`.trim(),
//       }));
//     }
//     return [];
//   }, [teacherData]);

//   // ⭐ CLASSROOM OPTIONS for Picker
//   const classroomOptions = useMemo(() => {
//     if (classroomData?.statusCode === 200 && classroomData.data?.classRooms) {
//       return classroomData.data.classRooms.map((room: any) => ({
//         value: room.classRoomId,
//         label: room.classRoomName,
//       }));
//     }
//     return [];
//   }, [classroomData]);

//   // ⭐ SUBJECT OPTIONS from Course Detail API
//   const subjectOptions = useMemo(() => {
//     if (courseDetailData?.data?.subjects && Array.isArray(courseDetailData.data.subjects)) {
//       return courseDetailData.data.subjects.map((s: any) => ({
//         value: s.subjectId,
//         label: s.subjectName,
//       }));
//     }
//     return [];
//   }, [courseDetailData]);

//   const courseName = courseDetailData?.data?.courseName || selectedBatchInfo?.courses?.[0]?.courseName || "Course";
//   const batchName = selectedBatchInfo?.batchName || selectedBatch || "Batch";

//   const combinedSubjectOptions = useMemo(
//     () => [...subjectOptions, ...customSubjects],
//     [subjectOptions, customSubjects]
//   );

//   // ⭐ OPERATING HOURS
//   const DEFAULT_HOURS = { openingTime: "09:00", closingTime: "18:00" };
//   const operatingHours = useMemo(() => {
//     const opening =
//       classroomData?.data?.openingTime ??
//       classroomData?.data?.operatingHours?.openingTime ??
//       DEFAULT_HOURS.openingTime;
//     const closing =
//       classroomData?.data?.closingTime ??
//       classroomData?.data?.operatingHours?.closingTime ??
//       DEFAULT_HOURS.closingTime;
//     return { openingTime: opening, closingTime: closing };
//   }, [classroomData]);

//   // ⭐ START TIMES (operating hours ke andar 15 min intervals)
//   const startTimes = useMemo(
//     () => generateStartTimes(operatingHours.openingTime, operatingHours.closingTime),
//     [operatingHours]
//   );

//   // ⭐ END TIMES (start time se 15 min increments, closing time se zyada nahi)
//   const endTimes = useMemo(() => {
//     if (!startTime) return [];
//     return generateEndTimes(startTime, operatingHours.closingTime);
//   }, [startTime, operatingHours.closingTime]);

//   // ⭐ Reset endTime when startTime changes
//   useEffect(() => {
//     if (startTime) {
//       setEndTime("");
//     }
//   }, [startTime]);

//   // ⭐ Cascading dropdown logic
//   useEffect(() => {
//     if (selectedSubject) {
//       setSubjectDropdownOpen(false);
//       setTeacherDropdownOpen(true);
//     }
//   }, [selectedSubject]);

//   useEffect(() => {
//     if (selectedTeacher) {
//       setTeacherDropdownOpen(false);
//       setRoomDropdownOpen(true);
//     }
//   }, [selectedTeacher]);

//   useEffect(() => {
//     if (selectedRoom) {
//       setRoomDropdownOpen(false);
//       setStartTimeDropdownOpen(true);
//     }
//   }, [selectedRoom]);

//   useEffect(() => {
//     if (startTime) {
//       setStartTimeDropdownOpen(false);
//       setEndTimeDropdownOpen(true);
//     }
//   }, [startTime]);

//   useEffect(() => {
//     if (endTime) {
//       setEndTimeDropdownOpen(false);
//     }
//   }, [endTime]);

//   const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2]); // M T W default

//   // ⭐ Check if in edit mode (declare early so it can be used in useEffect)
//   const isEditMode = !!editingSlot;

//   // ⭐ Prefill form when editingSlot exists
//   useEffect(() => {
//     console.log("📝 === SLOT FORM MODAL EFFECT ===");
//     console.log("📝 visible:", visible);
//     console.log("📝 editingSlot:", editingSlot ? JSON.stringify(editingSlot, null, 2) : "null");
//     console.log("📝 isEditMode:", isEditMode);
    
//     if (editingSlot && visible) {
//       console.log("📝 Prefilling form with editingSlot");
//       console.log("📝 Subject ID:", editingSlot.subjectId);
//       console.log("📝 Teacher ID:", editingSlot.teacherId);
//       console.log("📝 Room ID:", editingSlot.classRoomId);
//       console.log("📝 Start Time:", editingSlot.startTime);
//       console.log("📝 End Time:", editingSlot.endTime);
//       console.log("📝 Day:", editingSlot.day);
      
//       // Set values immediately - Picker will update when options are available
//       setSelectedSubject(editingSlot.subjectId || "");
//       setSelectedTeacher(editingSlot.teacherId || "");
//       setSelectedRoom(editingSlot.classRoomId || "");
//       setStartTime(editingSlot.startTime || "");
//       setEndTime(editingSlot.endTime || "");
//       setRepeat(true); // Single day for edit mode
      
//       // Set active day based on editingSlot.day
//       if (editingSlot.day) {
//         const dayDate = editingSlot.day instanceof Date ? editingSlot.day : new Date(editingSlot.day);
//         const dayOfWeek = dayDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
//         // Convert to our day index (0 = Monday)
//         const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
//         console.log("📝 Day of week:", dayOfWeek, "Adjusted index:", adjustedIndex);
//         setActiveDays([adjustedIndex]);
//       }
      
//       console.log("✅ Form values set:", {
//         subject: editingSlot.subjectId,
//         teacher: editingSlot.teacherId,
//         room: editingSlot.classRoomId,
//         startTime: editingSlot.startTime,
//         endTime: editingSlot.endTime,
//       });
//     } else if (!editingSlot && visible) {
//       console.log("📝 Resetting form for new slot");
//       // Reset form when opening for new slot
//       setSelectedSubject("");
//       setSelectedTeacher("");
//       setSelectedRoom("");
//       setStartTime("");
//       setEndTime("");
//       setRepeat(true);
//       setActiveDays([]);
//     }
//   }, [editingSlot, visible, isEditMode]);

//   // ⭐ Log state values when they change (for debugging)
//   useEffect(() => {
//     if (visible && isEditMode) {
//       console.log("📊 Current form state:", {
//         selectedSubject,
//         selectedTeacher,
//         selectedRoom,
//         startTime,
//         endTime,
//         activeDays,
//         subjectOptionsCount: subjectOptions.length,
//         teacherOptionsCount: teacherOptions.length,
//         classroomOptionsCount: classroomOptions.length,
//       });
//     }
//   }, [visible, isEditMode, selectedSubject, selectedTeacher, selectedRoom, startTime, endTime, activeDays, subjectOptions.length, teacherOptions.length, classroomOptions.length]);

//   useEffect(() => {
//     if (addSubjectModalVisible) {
//       setSubjectModalStep("select");
//       setTempSubjectSelection(selectedSubject || "");
//     } else {
//       setPendingSubjects([]);
//       setNewSubjectName("");
//     }
//   }, [addSubjectModalVisible, selectedSubject]);
//   const toggleDay = (index: number) => {
//     // In edit mode, only one day can be selected at a time
//     if (isEditMode) {
//       // If clicking the same day, deselect it (optional - or keep it selected)
//       // If clicking a different day, replace the selection
//       setActiveDays([index]);
//     } else {
//       // Normal mode: allow multiple days selection
//       setActiveDays((prev) =>
//         prev.includes(index)
//           ? prev.filter((i) => i !== index)
//           : [...prev, index]
//       );
//     }
//   };

//   // Format selected days for display
//   const formatSelectedDays = () => {
//     if (activeDays.length === 0) return "";
    
//     const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
//     const selectedDayNames = activeDays
//       .sort((a, b) => a - b) // Sort by index to maintain order
//       .map((index) => dayNames[index]);
    
//     return `Occurs weekly on ${selectedDayNames.join(", ")}`;
//   };
 
//   const handleAddPendingSubject = () => {
//     const trimmed = newSubjectName.trim();
//     if (!trimmed) {
//       return;
//     }
//     if (pendingSubjects.some((name) => name.toLowerCase() === trimmed.toLowerCase())) {
//       Alert.alert("Duplicate", "Subject already added in list.");
//       return;
//     }
//     setPendingSubjects((prev) => [...prev, trimmed]);
//     setNewSubjectName("");
//   };

//   const handleRemovePendingSubject = (name: string) => {
//     setPendingSubjects((prev) => prev.filter((item) => item !== name));
//   };

//   const handleSubmitNewSubjects = () => {
//     if (pendingSubjects.length === 0) {
//       return;
//     }
//     const created = pendingSubjects.map((name, index) => ({
//       value: `temp-${Date.now()}-${index}-${name}`,
//       label: name,
//     }));
//     setCustomSubjects((prev) => [...prev, ...created]);
//     const last = created[created.length - 1];
//     setSelectedSubject(last.value);
//     setPendingSubjects([]);
//     setNewSubjectName("");
//     setAddSubjectModalVisible(false);
//     Alert.alert("Subject added", "New subject has been added locally.");
//   };

//   const handleRoomPlusPress = () => {
//     onClose();
//     requestAnimationFrame(() => {
//       onNavigateToClassrooms?.();
//     });
//   };

//   // ⭐ REDUX: Organization data (use prop if provided, else from Redux)
//   const reduxOrganization = useSelector((state: RootState) => state.auth.selectedOrganization);
//   const selectedOrganization = propSelectedOrganization || reduxOrganization;

//   // ⭐ MUTATION: Create, Update and Delete TimeTable
//   const createMutation = useCreateTimeTableMutation();
//   const updateMutation = useUpdateTimeTableMutation();
//   const deleteMutation = useDeleteTimeTableMutation();
//   const queryClient = useQueryClient();

//   // ⭐ HELPER: Handle success response (refetch and close modal)
//   const handleSuccessResponse = (response: any, isEdit: boolean) => {
//     console.log(`✅ TimeTable ${isEdit ? "updated" : "created"} successfully:`, response);
    
//     // Check for error responses (404, etc.)
//     if (response?.status === 404 || response?.data?.statusCode === 404) {
//       console.error("❌ 404 Error: Resource not found");
//       Alert.alert("Error", response?.data?.message || "API endpoint not found (404). Please check the backend service.");
//       return;
//     }
    
//     // Check if response is empty string (backend returns "" but saves data like web)
//     const isEmptyResponse = typeof response === "string" && response === "";
//     const hasNoData = !response?.data && !response?.statusCode;
    
//     if (isEmptyResponse) {
//       console.log("ℹ️ Backend returned empty string (like web), but data should be saved");
//     } else if (hasNoData && !isEmptyResponse) {
//       console.warn("⚠️ WARNING: Backend returned invalid response!");
//       Alert.alert(
//         "Warning",
//         "Slot operation may have failed. Please check if the slot appears in the timetable. If not, please try again or contact support.",
//         [{ text: "OK", style: "default" }]
//       );
//     }
    
//     // Invalidate ALL timetable queries (with any params) to refresh grid
//     queryClient.invalidateQueries({
//       predicate: (query) => {
//         return query.queryKey[0] === "timeTable";
//       },
//     });
    
//     // If weekStart is provided, refetch with exact params
//     if (weekStart && selectedOrganization && selectedBatchId) {
//       const startWeekDate = weekStart.toISOString().split('T')[0];
//       const endDate = new Date(weekStart);
//       endDate.setDate(weekStart.getDate() + 6);
//       const endWeekDate = endDate.toISOString().split('T')[0];
      
//       const refetchParams = {
//         customerId: selectedOrganization.customerId,
//         organizationId: selectedOrganization.organizationId,
//         batchId: selectedBatchId,
//         startWeekDate: startWeekDate,
//         endWeekDate: endWeekDate,
//       };
      
//       console.log("🔄 Refetching with params:", refetchParams);
      
//       setTimeout(() => {
//         console.log("🔄 Executing refetch now...");
//         queryClient.refetchQueries({
//           queryKey: ["timeTable", refetchParams],
//         }).then(() => {
//           console.log("✅ Refetch completed");
//         }).catch((err) => {
//           console.error("❌ Refetch error:", err);
//         });
//       }, 2000);
//     } else {
//       setTimeout(() => {
//         queryClient.refetchQueries({
//           predicate: (query) => {
//             return query.queryKey[0] === "timeTable";
//           },
//         });
//       }, 2000);
//     }
    
//     // Call onSuccess callback if provided
//     if (onSuccess) {
//       onSuccess();
//     }
//     // Close modal
//     onClose();
//     // Reset form
//     setSelectedSubject("");
//     setSelectedTeacher("");
//     setSelectedRoom("");
//     setStartTime("");
//     setEndTime("");
//     setActiveDays([]);
//   };

//   // ⭐ HELPER: Handle error response
//   const handleErrorResponse = (error: any, isEdit: boolean) => {
//     console.error(`❌ Error ${isEdit ? "updating" : "creating"} TimeTable:`, error);
//     console.error("❌ Error details:", JSON.stringify(error, null, 2));
//     console.error("❌ API URL that failed:", isEdit ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE);
    
//     const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEdit ? "update" : "create"} slot. Please try again.`;
//     const is404 = error?.response?.status === 404 || 
//                  error?.response?.data?.statusCode === 404 || 
//                  error?.message?.includes("404") || 
//                  error?.message?.includes("not found") ||
//                  error?.message?.includes("Not Found");
    
//     if (is404) {
//       Alert.alert(
//         "Error",
//         "API endpoint not found (404). Please check the backend service or contact support.",
//         [{ text: "OK", style: "default" }]
//       );
//     } else {
//       Alert.alert("Error", errorMessage, [{ text: "OK", style: "default" }]);
//     }
//   };

//   // ⭐ HANDLE ADD/UPDATE SLOT
//   const handleAddSlot = () => {
//     const action = isEditMode ? "UPDATE" : "ADD";
//     console.log(`🔵 === ${action} SLOT CLICKED ===`);
//     console.log("Form Values:", {
//       selectedSubject,
//       selectedTeacher,
//       selectedRoom,
//       startTime,
//       endTime,
//       selectedBatchId,
//       repeat,
//       activeDays,
//       selectedCell: selectedCell ? "exists" : "null",
//       editingSlot: editingSlot ? "exists" : "null",
//     });

//     // Validation
//     if (!selectedSubject) {
//       console.log("❌ Validation failed: Subject not selected");
//       Alert.alert("Error", "Please select a subject");
//       return;
//     }
//     if (!selectedTeacher) {
//       console.log("❌ Validation failed: Teacher not selected");
//       Alert.alert("Error", "Please select a teacher");
//       return;
//     }
//     if (!selectedRoom) {
//       console.log("❌ Validation failed: Room not selected");
//       Alert.alert("Error", "Please select a room");
//       return;
//     }
//     if (!startTime) {
//       console.log("❌ Validation failed: Start time not selected");
//       Alert.alert("Error", "Please select start time");
//       return;
//     }
//     if (!endTime) {
//       console.log("❌ Validation failed: End time not selected");
//       Alert.alert("Error", "Please select end time");
//       return;
//     }
//     if (!selectedBatchId) {
//       console.log("❌ Validation failed: Batch ID not found");
//       Alert.alert("Error", "Batch not selected");
//       return;
//     }
//     if (repeat && activeDays.length === 0) {
//       console.log("❌ Validation failed: No days selected");
//       Alert.alert("Error", "Please select at least one day");
//       return;
//     }
//     if (!repeat && !selectedCell) {
//       console.log("❌ Validation failed: No cell selected and repeat is off");
//       Alert.alert("Error", "Please select a cell or enable repeat");
//       return;
//     }

//     console.log("✅ All validations passed");

//     // ⭐ CONFLICT VALIDATION: Check for time conflicts with existing slots
//     const repeatDaysData = timeTableData?.data?.repeatDays || {};
//     const conflicts: string[] = [];
//     const dayNames: { [key: string]: string } = {
//       "M": "Monday",
//       "T": "Tuesday",
//       "W": "Wednesday",
//       "Th": "Thursday",
//       "F": "Friday",
//       "Sa": "Saturday",
//       "Su": "Sunday"
//     };

//     // Build daysToUse first to check conflicts
//     let daysToUse: string[] = [];
//     if (repeat) {
//       if (weekStart) {
//         daysToUse = activeDays.map((dayIndex) => {
//           const dayDate = new Date(weekStart);
//           dayDate.setDate(weekStart.getDate() + dayIndex);
//           const dayOfWeek = dayDate.getDay();
//           const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//           return dayKeys[dayOfWeek];
//         });
//       } else {
//         daysToUse = activeDays.map((dayIndex) => DAY_KEYS[dayIndex]);
//       }
//     } else if (isEditMode && editingSlot?.day) {
//       const dayOfWeek = editingSlot.day.getDay();
//       const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//       daysToUse = [dayKeys[dayOfWeek]];
//     } else if (selectedCell) {
//       const dayOfWeek = selectedCell.day.getDay();
//       const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//       daysToUse = [dayKeys[dayOfWeek]];
//     }

//     // Check conflicts for each selected day
//     for (const dayKey of daysToUse) {
//       const daySlots = repeatDaysData[dayKey] || [];
//       const dayName = dayNames[dayKey] || dayKey;

//       for (const existingSlot of daySlots) {
//         // Skip the current slot if we're editing (to avoid self-conflict)
//         if (isEditMode && editingSlot && (existingSlot.id === editingSlot.id || existingSlot.slotId === editingSlot.id)) {
//           continue;
//         }

//         // Check if times overlap
//         if (isTimeOverlap(startTime, endTime, existingSlot.startTime, existingSlot.endTime)) {
//           // Check if same teacher
//           if (existingSlot.teacherId === selectedTeacher) {
//             conflicts.push(`${dayName}: Teacher already has a slot from ${existingSlot.startTime} to ${existingSlot.endTime}`);
//           }
//           // Check if same classroom
//           else if (existingSlot.classRoomId === selectedRoom) {
//             conflicts.push(`${dayName}: Classroom already booked from ${existingSlot.startTime} to ${existingSlot.endTime}`);
//           }
//         }
//       }
//     }

//     // If conflicts found, show error and return
//     if (conflicts.length > 0) {
//       const conflictMessage = `⛔ Time Conflict Detected:\n\n${conflicts.map((c, i) => `${i + 1}. ${c}`).join("\n")}`;
//       console.log("❌ Conflict detected:", conflictMessage);
//       Alert.alert("Time Conflict", conflictMessage);
//       return;
//     }

//     // Build slot object
//     const slotObject = {
//       subjectId: selectedSubject,
//       teacherId: selectedTeacher,
//       classRoomId: selectedRoom,
//       startTime: startTime,
//       endTime: endTime,
//     };

//     // Build repeatDays payload (daysToUse already calculated above in conflict validation)
//     // Final validation: ensure we have at least one day
//     if (daysToUse.length === 0) {
//       Alert.alert("Error", "Please select at least one day");
//       return;
//     }

//     // ⭐ CHECK IF DAY HAS CHANGED (for edit mode)
//     let dayChanged = false;
//     let originalDayKey = "";
    
//     if (isEditMode && editingSlot?.day) {
//       // Get original day key from editingSlot
//       const originalDayDate = editingSlot.day instanceof Date ? editingSlot.day : new Date(editingSlot.day);
//       const originalDayOfWeek = originalDayDate.getDay();
//       const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//       originalDayKey = dayKeys[originalDayOfWeek];
      
//       // Check if new day is different from original day
//       // For single day edit, daysToUse should have only one day
//       if (daysToUse.length === 1 && daysToUse[0] !== originalDayKey) {
//         dayChanged = true;
//         console.log("🔄 Day changed detected!");
//         console.log("🔄 Original day:", originalDayKey);
//         console.log("🔄 New day:", daysToUse[0]);
//       }
//     }

//     let payload: any;

//     // For UPDATE: Use flat structure like web (simple object with repeatDays array)
//     if (isEditMode && editingSlot) {
//       // Clean the ID - remove any extra quotes or whitespace
//       let slotId = (editingSlot.id || editingSlot.slotId || "").toString();
//       // Remove quotes from start and end only (not from middle)
//       slotId = slotId.replace(/^["']+|["']+$/g, "").trim();
      
//       console.log("✏️ Edit mode - Slot ID:", slotId);
//       console.log("✏️ Original ID from editingSlot:", editingSlot.id);
      
//       if (!slotId) {
//         Alert.alert("Error", "Slot ID is missing. Cannot update slot.");
//         return;
//       }

//       // Convert day keys to day indices (like web: [0, 1, 2] for M, T, W)
//       // Web uses: 0=Monday, 1=Tuesday, etc.
//       const dayKeyToIndex: Record<string, number> = {
//         "M": 0,
//         "T": 1,
//         "W": 2,
//         "Th": 3,
//         "F": 4,
//         "Sa": 5,
//         "Su": 6,
//       };
//       const repeatDaysArray = daysToUse
//         .map(dayKey => dayKeyToIndex[dayKey])
//         .filter(idx => idx !== undefined);

//       // Build flat payload like web version
//       payload = {
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         batchId: selectedBatchId,
//         id: slotId,
//         subjectId: selectedSubject,
//         teacherId: selectedTeacher,
//         classRoomId: selectedRoom,
//         startTime: startTime,
//         endTime: endTime,
//         repeatDays: repeatDaysArray, // Array of day indices, not nested object
//         startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
//         endDate: weekStart ? (() => {
//           const end = new Date(weekStart);
//           end.setDate(weekStart.getDate() + 6);
//           return end.toISOString().split('T')[0];
//         })() : "",
//       };
      
//       console.log("✏️ Update payload (flat structure like web):", JSON.stringify(payload, null, 2));
//     } else {
//       // For CREATE: Use FLAT structure like web (not nested)
//       // Convert day keys to day indices (0=Monday, 1=Tuesday, etc.)
//       const dayKeyToIndex: Record<string, number> = {
//         "M": 0,
//         "T": 1,
//         "W": 2,
//         "Th": 3,
//         "F": 4,
//         "Sa": 5,
//         "Su": 6,
//       };
//       const repeatDaysArray = daysToUse
//         .map(dayKey => dayKeyToIndex[dayKey])
//         .filter(idx => idx !== undefined);

//       // Build flat payload like web version
//       payload = {
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         batchId: selectedBatchId,
//         subjectId: selectedSubject,
//         teacherId: selectedTeacher,
//         classRoomId: selectedRoom,
//         startTime: startTime,
//         endTime: endTime,
//         repeatDays: repeatDaysArray, // Array of day indices, not nested object
//         startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
//         endDate: weekStart ? (() => {
//           const end = new Date(weekStart);
//           end.setDate(weekStart.getDate() + 6);
//           return end.toISOString().split('T')[0];
//         })() : "",
//       };
      
//       console.log("📦 CREATE payload (flat structure like web):", JSON.stringify(payload, null, 2));
//     }

//     console.log(`📦 Final Payload (${isEditMode ? "UPDATE" : "CREATE"}):`, JSON.stringify(payload, null, 2));
//     console.log("📦 Organization:", {
//       customerId: selectedOrganization?.customerId,
//       organizationId: selectedOrganization?.organizationId,
//     });

//     // ⭐ HANDLE DAY CHANGE: If day changed, delete old slot first, then create new one
//     if (dayChanged && isEditMode && editingSlot) {
//       console.log("🔄 Day changed - Deleting old slot and creating new one...");
      
//       // Clean the ID
//       let slotId = (editingSlot.id || editingSlot.slotId || "").toString();
//       slotId = slotId.replace(/^["']+|["']+$/g, "").trim();
      
//       // Build delete payload
//       const deletePayload = {
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         batchId: selectedBatchId,
//         startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
//         endDate: weekStart ? (() => {
//           const end = new Date(weekStart);
//           end.setDate(weekStart.getDate() + 6);
//           return end.toISOString().split('T')[0];
//         })() : "",
//         id: slotId,
//         dayKey: originalDayKey,
//         startTime: editingSlot.startTime || startTime,
//         endTime: editingSlot.endTime || endTime,
//       };
      
//       console.log("🗑️ Delete payload (old day):", JSON.stringify(deletePayload, null, 2));
      
//       // First delete from old day
//       deleteMutation.mutate(deletePayload, {
//         onSuccess: (deleteResponse) => {
//           console.log("✅ Old slot deleted successfully:", deleteResponse);
          
//           // Now create new slot in new day
//           console.log("➕ Creating new slot in new day...");
//           createMutation.mutate(payload, {
//             onSuccess: (createResponse) => {
//               console.log("✅ New slot created successfully:", createResponse);
//               handleSuccessResponse(createResponse, false);
//             },
//             onError: (createError) => {
//               console.error("❌ Error creating new slot:", createError);
//               handleErrorResponse(createError, false);
//             },
//           });
//         },
//         onError: (deleteError: any) => {
//           console.error("❌ Error deleting old slot:", deleteError);
//           const errorMessage = deleteError?.response?.data?.message || deleteError?.message || "Failed to delete old slot. Please try again.";
//           Alert.alert("Error", errorMessage);
//         },
//       });
      
//       return; // Exit early, don't proceed with normal update
//     }

//     // Call API (normal update or create)
//     const mutation = isEditMode ? updateMutation : createMutation;
//     console.log(`🚀 Calling ${isEditMode ? "updateMutation" : "createMutation"}.mutate...`);
//     mutation.mutate(payload, {
//       onSuccess: (response) => {
//         console.log(`✅ TimeTable ${isEditMode ? "updated" : "created"} successfully:`, response);
//         console.log("📝 Response type:", typeof response);
//         console.log("📝 Response stringified:", JSON.stringify(response));
//         console.log("📝 Response data:", response?.data);
//         console.log("📝 Response statusCode:", response?.statusCode);
//         console.log("📝 Response message:", response?.message);
        
//         // Check for error responses (404, etc.) - If axios returns error as response
//         if (response?.status === 404 || response?.data?.statusCode === 404) {
//           console.error("❌ 404 Error: Resource not found (caught in onSuccess)");
//           // Throw error so it goes to onError handler for proper handling
//           throw new Error(response?.data?.message || "API endpoint not found (404). Please check the backend service.");
//         }
        
//         // Check if response is empty string (backend returns "" but saves data like web)
//         const isEmptyResponse = typeof response === "string" && response === "";
//         const hasNoData = !response?.data && !response?.statusCode;
        
//         if (isEmptyResponse) {
//           console.log("ℹ️ Backend returned empty string (like web), but data should be saved");
//           // Don't show warning - web me bhi same response aata hai and it works
//           // Proceed with refetch - data should be saved
//         } else if (hasNoData && !isEmptyResponse) {
//           console.warn("⚠️ WARNING: Backend returned invalid response!");
//           console.warn("⚠️ This might indicate the data was not saved properly.");
          
//           // Show warning to user only if response is not empty string
//           Alert.alert(
//             "Warning",
//             "Slot creation may have failed. Please check if the slot appears in the timetable. If not, please try again or contact support.",
//             [
//               {
//                 text: "OK",
//                 style: "default",
//               },
//             ]
//           );
//         }
        
//         // Invalidate ALL timetable queries (with any params) to refresh grid
//         queryClient.invalidateQueries({
//           predicate: (query) => {
//             return query.queryKey[0] === "timeTable";
//           },
//         });
        
//         // If weekStart is provided, refetch with exact params
//         if (weekStart && selectedOrganization && selectedBatchId) {
//           const startWeekDate = weekStart.toISOString().split('T')[0];
//           const endDate = new Date(weekStart);
//           endDate.setDate(weekStart.getDate() + 6);
//           const endWeekDate = endDate.toISOString().split('T')[0];
          
//           const refetchParams = {
//             customerId: selectedOrganization.customerId,
//             organizationId: selectedOrganization.organizationId,
//             batchId: selectedBatchId,
//             startWeekDate: startWeekDate,
//             endWeekDate: endWeekDate,
//           };
          
//           console.log("🔄 Refetching with params:", refetchParams);
          
//           // Longer delay to ensure backend has fully processed and committed
//           setTimeout(() => {
//             console.log("🔄 Executing refetch now...");
//             queryClient.refetchQueries({
//               queryKey: ["timeTable", refetchParams],
//             }).then(() => {
//               console.log("✅ Refetch completed");
//             }).catch((err) => {
//               console.error("❌ Refetch error:", err);
//             });
//           }, 2000); // Increased to 2 seconds
//         } else {
//           // Fallback: refetch all timeTable queries
//           setTimeout(() => {
//             queryClient.refetchQueries({
//               predicate: (query) => {
//                 return query.queryKey[0] === "timeTable";
//               },
//             });
//           }, 2000);
//         }
        
//         // Call onSuccess callback if provided
//         if (onSuccess) {
//           onSuccess();
//         }
//         // Close modal
//         onClose();
//         // Reset form
//         setSelectedSubject("");
//         setSelectedTeacher("");
//         setSelectedRoom("");
//         setStartTime("");
//         setEndTime("");
//         setActiveDays([]);
//       },
//       onError: (error: any) => {
//         console.error(`❌ Error ${isEditMode ? "updating" : "creating"} TimeTable:`, error);
//         console.error("❌ Error details:", JSON.stringify(error, null, 2));
//         console.error("❌ Error type:", typeof error);
//         console.error("❌ Error message:", error?.message);
//         console.error("❌ Error response:", error?.response);
//         console.error("❌ Error status:", error?.response?.status);
//         console.error("❌ Error statusCode:", error?.response?.data?.statusCode);
//         console.error("❌ Error response message:", error?.response?.data?.message);
//         console.error("❌ API URL that failed:", isEditMode ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE);
        
//         // Get error message from different possible locations
//         const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEditMode ? "update" : "create"} slot. Please try again.`;
//         const is404 = error?.response?.status === 404 || 
//                      error?.response?.data?.statusCode === 404 || 
//                      error?.message?.includes("404") || 
//                      error?.message?.includes("not found") ||
//                      error?.message?.includes("Not Found");
        
//         // Check for 404 specifically
//         if (is404) {
//           const apiUrl = isEditMode ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE;
//           Alert.alert(
//             "404 - Resource Not Found",
//             `The API endpoint was not found. Please check:\n\n1. API URL: ${apiUrl}\n2. Payload structure\n3. Backend service status\n\nError: ${errorMessage}`
//           );
//         } else {
//           Alert.alert(
//             "Error",
//             errorMessage
//           );
//         }
//       },
//     });
//   };

//   return (
//     <>
//       <Modal visible={visible} transparent animationType="slide">
//         <View style={styles.backdrop}>
//           <View style={styles.modalContentWrapper}>
//             <ScrollView
//               style={styles.modalContainer}
//               contentContainerStyle={{ paddingBottom: 40 }}
//             >
//           {/* Title */}
//           <Text style={styles.title}>
//             {isEditMode ? "Edit Slot" : `Add New Slot for ${selectedBatch}`}
//           </Text>

//           {/* SUBJECT */}
//           <Text style={styles.label}>Subject</Text>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={styles.dropdownBox}
//               onPress={() => {
//                 setSubjectDropdownOpen(!subjectDropdownOpen);
//                 if (subjectDropdownOpen) {
//                   setTeacherDropdownOpen(false);
//                   setRoomDropdownOpen(false);
//                   setStartTimeDropdownOpen(false);
//                   setEndTimeDropdownOpen(false);
//                 }
//               }}
//             >
//               <View style={styles.dropdownContent}>
//                 <Text style={[styles.dropdownText, !selectedSubject && styles.dropdownPlaceholder]}>
//                   {selectedSubject 
//                     ? combinedSubjectOptions.find((s: { value: string; label: string }) => s.value === selectedSubject)?.label 
//                     : "Select subject"}
//                 </Text>
//                 <Text style={styles.dropdownArrow}>{subjectDropdownOpen ? "▲" : "▼"}</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.plusBtn}
//               onPress={() => setAddSubjectModalVisible(true)}
//             >
//               <Text style={styles.plusText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Subject Dropdown List */}
//           {subjectDropdownOpen && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select subject</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {combinedSubjectOptions.map((subject: { value: string; label: string }) => {
//                   const isSelected = selectedSubject === subject.value;
//                   return (
//                     <TouchableOpacity
//                       key={subject.value}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setSelectedSubject(subject.value);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {subject.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* TEACHER */}
//           <Text style={styles.label}>Teacher</Text>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={[styles.dropdownBox, !selectedSubject && styles.dropdownBoxDisabled]}
//               onPress={() => {
//                 if (selectedSubject) {
//                   setTeacherDropdownOpen(!teacherDropdownOpen);
//                   if (teacherDropdownOpen) {
//                     setRoomDropdownOpen(false);
//                     setStartTimeDropdownOpen(false);
//                     setEndTimeDropdownOpen(false);
//                   }
//                 }
//               }}
//               disabled={!selectedSubject}
//             >
//               <View style={styles.dropdownContent}>
//                 <Text style={[styles.dropdownText, (!selectedTeacher || !selectedSubject) && styles.dropdownPlaceholder]}>
//                   {selectedTeacher 
//                     ? teacherOptions.find((t: { value: string; label: string }) => t.value === selectedTeacher)?.label 
//                     : "Select teacher"}
//                 </Text>
//                 <Text style={[styles.dropdownArrow, !selectedSubject && { opacity: 0.5 }]}>
//                   {teacherDropdownOpen ? "▲" : "▼"}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.plusBtn}>
//               <Text style={styles.plusText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Teacher Dropdown List */}
//           {teacherDropdownOpen && selectedSubject && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select teacher</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {teacherOptions.map((teacher: { value: string; label: string }) => {
//                   const isSelected = selectedTeacher === teacher.value;
//                   return (
//                     <TouchableOpacity
//                       key={teacher.value}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setSelectedTeacher(teacher.value);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {teacher.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* ROOM */}
//           <Text style={styles.label}>Room</Text>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={[styles.dropdownBox, !selectedTeacher && styles.dropdownBoxDisabled]}
//               onPress={() => {
//                 if (selectedTeacher) {
//                   setRoomDropdownOpen(!roomDropdownOpen);
//                   if (roomDropdownOpen) {
//                     setStartTimeDropdownOpen(false);
//                     setEndTimeDropdownOpen(false);
//                   }
//                 }
//               }}
//               disabled={!selectedTeacher}
//             >
//               <View style={styles.dropdownContent}>
//                 <Text style={[styles.dropdownText, (!selectedRoom || !selectedTeacher) && styles.dropdownPlaceholder]}>
//                   {selectedRoom 
//                     ? classroomOptions.find((r: { value: string; label: string }) => r.value === selectedRoom)?.label 
//                     : "Select room"}
//                 </Text>
//                 <Text style={[styles.dropdownArrow, !selectedTeacher && { opacity: 0.5 }]}>
//                   {roomDropdownOpen ? "▲" : "▼"}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.plusBtn} onPress={handleRoomPlusPress}>
//               <Text style={styles.plusText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Room Dropdown List */}
//           {roomDropdownOpen && selectedTeacher && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select room</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {classroomOptions.map((room: { value: string; label: string }) => {
//                   const isSelected = selectedRoom === room.value;
//                   return (
//                     <TouchableOpacity
//                       key={room.value}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setSelectedRoom(room.value);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {room.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* START TIME */}
//           <Text style={styles.label}>Start Time</Text>
//           <TouchableOpacity 
//             style={[styles.dropdownBox, !selectedRoom && styles.dropdownBoxDisabled]}
//             onPress={() => {
//               if (selectedRoom) {
//                 setStartTimeDropdownOpen(!startTimeDropdownOpen);
//                 if (startTimeDropdownOpen) {
//                   setEndTimeDropdownOpen(false);
//                 }
//               }
//             }}
//             disabled={!selectedRoom}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownText, (!startTime || !selectedRoom) && styles.dropdownPlaceholder]}>
//                 {startTime || "Select start time"}
//               </Text>
//               <Text style={[styles.dropdownArrow, !selectedRoom && { opacity: 0.5 }]}>
//                 {startTimeDropdownOpen ? "▲" : "▼"}
//               </Text>
//             </View>
//           </TouchableOpacity>

//           {/* Start Time Dropdown List */}
//           {startTimeDropdownOpen && selectedRoom && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select start time</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {startTimes.map((time: string) => {
//                   const isSelected = startTime === time;
//                   return (
//                     <TouchableOpacity
//                       key={time}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setStartTime(time);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {time}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* END TIME */}
//           <Text style={styles.label}>End Time</Text>
//           <TouchableOpacity 
//             style={[styles.dropdownBox, !startTime && styles.dropdownBoxDisabled]}
//             onPress={() => {
//               if (startTime) {
//                 setEndTimeDropdownOpen(!endTimeDropdownOpen);
//               }
//             }}
//             disabled={!startTime}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownText, (!endTime || !startTime) && styles.dropdownPlaceholder]}>
//                 {endTime || "Select end time"}
//               </Text>
//               <Text style={[styles.dropdownArrow, !startTime && { opacity: 0.5 }]}>
//                 {endTimeDropdownOpen ? "▲" : "▼"}
//               </Text>
//             </View>
//           </TouchableOpacity>

//           {/* End Time Dropdown List */}
//           {endTimeDropdownOpen && startTime && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select end time</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {endTimes.map((time: string) => {
//                   const isSelected = endTime === time;
//                   return (
//                     <TouchableOpacity
//                       key={time}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setEndTime(time);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {time}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* REPEAT TOGGLE */}
//           <View style={styles.repeatRow}>
//             <Text style={styles.repeatLabel}>Schedule Days</Text>
//             <Switch
//               value={repeat}
//               onValueChange={setRepeat}
//               thumbColor="#FFF"
//               trackColor={{ true: COLORS.primary, false: "#CCC" }}
//             />
//           </View>

//           {/* SELECT DAYS */}
//           {/* SELECT DAYS (Visible only when REPEAT = true) */}
// {repeat && (
//   <>
//     <Text style={styles.label}>Select Days</Text>

//     <View style={styles.daysRow}>
//       {DAY_KEYS.map((d, i) => {
//         const isActive = activeDays.includes(i);
//         return (
//           <TouchableOpacity
//             key={i}
//             style={[
//               styles.dayCircle,
//               isActive && { backgroundColor: PURPLE },
//             ]}
//             onPress={() => toggleDay(i)}
//           >
//             <Text
//               style={[
//                 styles.dayText,
//                 isActive && { color: "#FFF", fontWeight: "700" },
//               ]}
//             >
//               {d}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>

//     {activeDays.length > 0 && (
//       <View style={styles.daySummaryBox}>
//         <Text style={styles.daySummaryText}>{formatSelectedDays()}</Text>
//       </View>
//     )}
//   </>
// )}


//         </ScrollView>

//         {/* FOOTER BUTTONS */}
//         <View style={styles.footerRow}>
//           <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
//             <Text style={styles.cancelText}>Cancel</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.saveBtn, (isEditMode ? updateMutation : createMutation).isPending && styles.saveBtnDisabled]}
//             onPress={() => {
//               console.log("🟢 BUTTON CLICKED!");
//               handleAddSlot();
//             }}
//             disabled={(isEditMode ? updateMutation : createMutation).isPending}
//           >
//             <Text style={styles.saveBtnText}>
//               {(isEditMode ? updateMutation : createMutation).isPending 
//                 ? (isEditMode ? "Updating..." : "Adding...") 
//                 : (isEditMode ? "UPDATE SLOT" : "ADD SLOT +")}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       </View>
//     </Modal>

//       <Modal
//         visible={addSubjectModalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setAddSubjectModalVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.addSubjectBackdrop}
//           activeOpacity={1}
//           onPress={() => setAddSubjectModalVisible(false)}
//         >
//           <TouchableOpacity
//             style={styles.addSubjectCard}
//             activeOpacity={1}
//             onPress={(e) => e.stopPropagation()}
//           >
//             <View style={styles.addSubjectHeader}>
//               <Text style={styles.addSubjectTitle}>Add Subject</Text>
//               <TouchableOpacity onPress={() => setAddSubjectModalVisible(false)}>
//                 <Text style={styles.addSubjectClose}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.addSubjectMeta}>
//               <Text style={styles.addSubjectMetaLabel}>Course: </Text>
//               {courseName}
//             </Text>
//             <Text style={styles.addSubjectMeta}>
//               <Text style={styles.addSubjectMetaLabel}>Batch: </Text>
//               {batchName}
//             </Text>

//             {subjectModalStep === "select" ? (
//               <>
//                 <View style={styles.selectDropdownBox}>
//                   <Picker
//                     selectedValue={tempSubjectSelection}
//                     onValueChange={(val) => setTempSubjectSelection(val)}
//                   >
//                     <Picker.Item label="Select subject" value="" />
//                     {combinedSubjectOptions.map((subject) => (
//                       <Picker.Item
//                         key={`modal-subject-${subject.value}`}
//                         label={subject.label}
//                         value={subject.value}
//                       />
//                     ))}
//                   </Picker>
//                 </View>

//                 <ScrollView style={styles.subjectList} nestedScrollEnabled>
//                   {combinedSubjectOptions.map((subject) => {
//                     const isActive = tempSubjectSelection === subject.value;
//                     return (
//                       <TouchableOpacity
//                         key={`modal-option-${subject.value}`}
//                         style={styles.subjectOptionRow}
//                         onPress={() => setTempSubjectSelection(subject.value)}
//                       >
//                         <View style={[styles.subjectCheckbox, isActive && styles.subjectCheckboxActive]}>
//                           {isActive && <Text style={styles.subjectCheckboxTick}>✓</Text>}
//                         </View>
//                         <Text style={styles.subjectOptionLabel}>{subject.label}</Text>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </ScrollView>

//                 <TouchableOpacity style={styles.createLinkRow} onPress={() => setSubjectModalStep("create")}>
//                   <Text style={styles.createLinkIcon}>＋</Text>
//                   <Text style={styles.createLinkText}>Create New Subject</Text>
//                 </TouchableOpacity>

//                 <View style={styles.addSubjectFooter}>
//                   <TouchableOpacity
//                     style={styles.addSubjectCancel}
//                     onPress={() => setAddSubjectModalVisible(false)}
//                   >
//                     <Text style={styles.addSubjectCancelText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.addSubjectSubmit,
//                       !tempSubjectSelection && styles.addSubjectSubmitDisabled,
//                     ]}
//                     disabled={!tempSubjectSelection}
//                     onPress={() => {
//                       if (tempSubjectSelection) {
//                         setSelectedSubject(tempSubjectSelection);
//                         setAddSubjectModalVisible(false);
//                       }
//                     }}
//                   >
//                     <Text style={styles.addSubjectSubmitText}>Submit</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             ) : (
//               <>
//                 <View style={styles.addSubjectInputRow}>
//                   <TextInput
//                     style={styles.addSubjectTextInput}
//                     placeholder="Enter new subject name"
//                     value={newSubjectName}
//                     onChangeText={setNewSubjectName}
//                     placeholderTextColor="#9CA3AF"
//                   />
//                   <TouchableOpacity style={styles.addSubjectAddBtn} onPress={handleAddPendingSubject}>
//                     <Text style={styles.addSubjectAddText}>＋ ADD</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {pendingSubjects.length > 0 ? (
//                   <View style={styles.pendingList}>
//                     {pendingSubjects.map((name) => (
//                       <View key={name} style={styles.pendingItem}>
//                         <View style={styles.pendingHeader}>
//                           <Text style={styles.pendingTitle}>{name}</Text>
//                           <TouchableOpacity onPress={() => handleRemovePendingSubject(name)}>
//                             <Text style={styles.pendingRemove}>✕</Text>
//                           </TouchableOpacity>
//                         </View>
//                         <View style={styles.pendingTimeRow}>
//                           <TextInput style={styles.pendingTimeInput} placeholder="Start time" editable={false} />
//                           <TextInput style={styles.pendingTimeInput} placeholder="End time" editable={false} />
//                         </View>
//                       </View>
//                     ))}
//                   </View>
//                 ) : (
//                   <Text style={styles.addSubjectEmpty}>Subjects you add will appear here.</Text>
//                 )}

//                 <View style={styles.addSubjectFooter}>
//                   <TouchableOpacity
//                     style={styles.addSubjectCancel}
//                     onPress={() => {
//                       setSubjectModalStep("select");
//                       setPendingSubjects([]);
//                       setNewSubjectName("");
//                     }}
//                   >
//                     <Text style={styles.addSubjectCancelText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.addSubjectSubmit,
//                       pendingSubjects.length === 0 && styles.addSubjectSubmitDisabled,
//                     ]}
//                     disabled={pendingSubjects.length === 0}
//                     onPress={handleSubmitNewSubjects}
//                   >
//                     <Text style={styles.addSubjectSubmitText}>Submit</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>
//     </>
//   );
// };

// export default SlotFormModal;

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.35)",
//     justifyContent: "center",  // ✅ Center me show hoga
//     alignItems: "center",
//   },
//   modalContentWrapper: {
//     flex: 1,
//     width: "85%",
//     maxHeight: "50%",
//     backgroundColor: "#FFF",
//     borderRadius: 20,
//     overflow: "hidden",
//   },
//   modalContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginTop: 12,
//     marginBottom: 4,
//   },
//   dropdownBox: {
//     flex: 1,
//     height: 45,              // ✅ Fixed height add karein (default se kam)
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     borderRadius: 10,
//     overflow: "hidden",
//     justifyContent: "center"
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   plusBtn: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     borderWidth: 2,
//     borderColor: "#0B4DA2",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   plusText: {
//     color: "#0B4DA2",
//     fontSize: 22,
//     fontWeight: "700",
//   },
//   repeatRow: {
//     marginTop: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   repeatLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   daysRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 8,
//   },
//   dayCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   dayText: {
//     color: "#444",
//     fontWeight: "600",
//   },
//   daySummaryBox: {
//     marginTop: 12,
//     padding: 12,
//     backgroundColor: "#F3F4F6",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   daySummaryText: {
//     fontSize: 14,
//     color: "#111827",
//     lineHeight: 20,
//   },
//   footerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: "#FFF",
//     borderTopWidth: 1,
//     borderTopColor: "#E5E7EB",
//   },
//   cancelBtn: {
//     flex: 1,
//     marginRight: 10,
//     padding: 14,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     alignItems: "center",
//   },
//   cancelText: { fontSize: 15, fontWeight: "600", color: "#111" },
//   saveBtn: {
//     flex: 1,
//     marginLeft: 10,
//     padding: 14,
//     borderRadius: 8,
//     backgroundColor: COLORS.primary,
//     alignItems: "center",
//   },
//   saveBtnText: {
//     color: "#FFF",
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   saveBtnDisabled: {
//     opacity: 0.6,
//   },
//   addSubjectBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   addSubjectCard: {
//     width: "100%",
//     maxWidth: 420,
//     backgroundColor: "#FFF",
//     borderRadius: 16,
//     padding: 20,
//   },
//   addSubjectHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   addSubjectTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//   },
//   addSubjectClose: {
//     fontSize: 18,
//     color: "#6B7280",
//   },
//   addSubjectMeta: {
//     fontSize: 14,
//     color: "#4B5563",
//     marginBottom: 4,
//   },
//   addSubjectMetaLabel: {
//     fontWeight: "600",
//     color: "#111827",
//   },
//   selectDropdownBox: {
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     borderRadius: 10,
//     overflow: "hidden",
//     marginTop: 16,
//   },
//   subjectList: {
//     maxHeight: 220,
//     marginTop: 12,
//   },
//   subjectOptionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   subjectCheckbox: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   subjectCheckboxActive: {
//     borderColor: COLORS.primary,
//     backgroundColor: "rgba(107,87,242,0.15)",
//   },
//   subjectCheckboxTick: {
//     color: COLORS.primary,
//     fontSize: 12,
//     fontWeight: "700",
//   },
//   subjectOptionLabel: {
//     color: "#111827",
//     fontSize: 14,
//   },
//   createLinkRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 16,
//   },
//   createLinkIcon: {
//     color: COLORS.primary,
//     fontSize: 18,
//     marginRight: 6,
//   },
//   createLinkText: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
//   addSubjectInputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     marginTop: 16,
//   },
//   addSubjectTextInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     fontSize: 15,
//     color: "#111827",
//   },
//   addSubjectAddBtn: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#16A34A",
//     backgroundColor: "rgba(34,197,94,0.1)",
//   },
//   addSubjectAddText: {
//     color: "#16A34A",
//     fontWeight: "700",
//   },
//   pendingList: {
//     marginTop: 16,
//   },
//   pendingItem: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//   },
//   pendingHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   pendingTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   pendingRemove: {
//     color: "#9CA3AF",
//     fontSize: 16,
//   },
//   pendingTimeRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginTop: 10,
//   },
//   pendingTimeInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     color: "#9CA3AF",
//   },
//   addSubjectEmpty: {
//     textAlign: "center",
//     color: "#9CA3AF",
//     marginVertical: 24,
//   },
//   addSubjectFooter: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 12,
//     marginTop: 12,
//   },
//   addSubjectCancel: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//   },
//   addSubjectCancelText: {
//     color: "#6B7280",
//     fontWeight: "600",
//   },
//   addSubjectSubmit: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     backgroundColor: COLORS.primary,
//   },
//   addSubjectSubmitDisabled: {
//     backgroundColor: "#CBD5F5",
//   },
//   addSubjectSubmitText: {
//     color: "#FFF",
//     fontWeight: "700",
//   },
//   // Cascading dropdown styles
//   dropdownContent: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     height: "100%",
//   },
//   dropdownText: {
//     fontSize: 14,
//     color: "#111827",
//     flex: 1,
//   },
//   dropdownPlaceholder: {
//     color: "#9CA3AF",
//   },
//   dropdownArrow: {
//     color: "#9CA3AF",
//     fontSize: 12,
//     marginLeft: 8,
//   },
//   dropdownBoxDisabled: {
//     opacity: 0.5,
//   },
//   cascadingDropdown: {
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     marginTop: 8,
//     marginBottom: 8,
//     maxHeight: 250,
//     overflow: "hidden",
//   },
//   cascadingDropdownTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#111827",
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   cascadingDropdownList: {
//     maxHeight: 200,
//   },
//   cascadingDropdownItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   cascadingDropdownItemSelected: {
//     backgroundColor: "rgba(107,87,242,0.05)",
//   },
//   cascadingDropdownItemText: {
//     fontSize: 14,
//     color: "#111827",
//     flex: 1,
//   },
//   cascadingDropdownItemTextSelected: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
//   cascadingDropdownCheck: {
//     color: COLORS.primary,
//     fontSize: 16,
//     fontWeight: "700",
//     marginLeft: 8,
//   },
// });


// import React, { useState, useMemo, useEffect } from "react";
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Switch,
//   Alert,
//   TextInput,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useTeachersListQuery } from "../../../../apis/hooks/teachers/query/useTeachersList.query";
// import { useGetClassroomListQuery } from "../../../../apis/hooks/teachers/query/useGetClassroomList.query";
// import { useCourseDetailsQuery } from "../../../../apis/hooks/course/query/useCourseDetails.query";
// import { useCreateTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useCreateTimeTable.mutation";
// import { useUpdateTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useUpdateTimeTable.mutation";
// import { useDeleteTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useDeleteTimeTable.mutation";
// import { useQueryClient } from "@tanstack/react-query";
// import { apiUrls } from "../../../../apis/urls";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../app/store";
// import { COLORS } from "../../../../colors";
// import { TTimetableCell } from "./TimetableGrid";

// type SlotFormModalProps = {
//   visible: boolean;
//   selectedCell: TTimetableCell | null;
//   editingSlot?: any | null; // Slot data when editing
//   onClose: () => void;
//   onNavigateToClassrooms?: () => void;
//   selectedBatch?: string;
//   selectedBatchId?: string;
//   batchData?: any;
//   onSuccess?: () => void; // Callback after successful creation
//   weekStart?: Date; // Week start date for refetch
//   selectedOrganization?: any; // Organization for refetch params
//   timeTableData?: any; // Timetable data for conflict validation
// };

// const PURPLE = "#6B57F2";
// const DAY_KEYS = ["M", "T", "W", "Th", "F", "Sa", "Su"];

// // Convert time string to minutes
// const timeToMinutes = (time: string): number => {
//   const [h, m] = time.split(":").map(Number);
//   return h * 60 + m;
// };

// // Convert minutes to time string
// const minutesToTime = (minutes: number): string => {
//   const h = Math.floor(minutes / 60).toString().padStart(2, "0");
//   const m = (minutes % 60).toString().padStart(2, "0");
//   return `${h}:${m}`;
// };

// // Generate start times: operating hours ke andar 15 min intervals
// const generateStartTimes = (opening: string, closing: string) => {
//   const startMin = timeToMinutes(opening);
//   const endMin = timeToMinutes(closing);
//   const times: string[] = [];

//   for (let minutes = startMin; minutes <= endMin; minutes += 15) {
//     times.push(minutesToTime(minutes));
//   }
//   return times;
// };

// // Generate end times = start + 15 min increments, lekin closing time se zyada nahi
// const generateEndTimes = (start: string, closing: string) => {
//   const startMin = timeToMinutes(start);
//   const closingMin = timeToMinutes(closing);
//   const endTimes: string[] = [];

//   for (let minutes = startMin + 15; minutes <= closingMin; minutes += 15) {
//     endTimes.push(minutesToTime(minutes));
//   }
//   return endTimes;
// };

// // Check if two time slots overlap
// const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
//   const start1Min = timeToMinutes(start1);
//   const end1Min = timeToMinutes(end1);
//   const start2Min = timeToMinutes(start2);
//   const end2Min = timeToMinutes(end2);
  
//   // Two slots overlap if: start1 < end2 AND end1 > start2
//   return start1Min < end2Min && end1Min > start2Min;
// };

// const SlotFormModal = ({
//   visible,
//   selectedCell,
//   editingSlot,
//   onClose,
//   onNavigateToClassrooms,
//   selectedBatch = "Batch",
//   selectedBatchId = "",
//   batchData,
//   onSuccess,
//   weekStart,
//   selectedOrganization: propSelectedOrganization,
//   timeTableData,
// }: SlotFormModalProps) => {
//   console.log("📋 === SLOT FORM MODAL RENDERED ===");
//   console.log("📋 visible:", visible);
//   console.log("📋 editingSlot prop:", editingSlot);
//   console.log("📋 selectedCell:", selectedCell);
  
//   // ⭐ TEACHER LIST API
//   const { data: teacherData } = useTeachersListQuery();

//   // ⭐ CLASSROOM LIST API
//   const { data: classroomData } = useGetClassroomListQuery();

//   // ⭐ Selected batch info + courseId
//   const selectedBatchInfo = useMemo(() => {
//     if (batchData?.statusCode === 200 && Array.isArray(batchData.data) && selectedBatchId) {
//       return batchData.data.find((b: any) => b.batchId === selectedBatchId) || null;
//     }
//     return null;
//   }, [batchData, selectedBatchId]);

//   const courseId = selectedBatchInfo?.courses?.[0]?.courseId || "";

//   // ⭐ COURSE DETAIL API (subjects ke liye)
//   const { data: courseDetailData } = useCourseDetailsQuery({
//     courseId: courseId || "",
//   });

//   const [selectedTeacher, setSelectedTeacher] = useState("");
//   const [selectedRoom, setSelectedRoom] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [customSubjects, setCustomSubjects] = useState<{ value: string; label: string }[]>([]);
//   const [addSubjectModalVisible, setAddSubjectModalVisible] = useState(false);
//   const [newSubjectName, setNewSubjectName] = useState("");
//   const [pendingSubjects, setPendingSubjects] = useState<string[]>([]);
//   const [subjectModalStep, setSubjectModalStep] = useState<"select" | "create">("select");
//   const [tempSubjectSelection, setTempSubjectSelection] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [repeat, setRepeat] = useState(true);

//   // ⭐ Cascading dropdown states
//   const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
//   const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
//   const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);
//   const [startTimeDropdownOpen, setStartTimeDropdownOpen] = useState(false);
//   const [endTimeDropdownOpen, setEndTimeDropdownOpen] = useState(false);

//   // ⭐ TEACHER OPTIONS for Picker
//   const teacherOptions = useMemo(() => {
//     if (teacherData?.statuscode === 200 && Array.isArray(teacherData.data)) {
//       return teacherData.data.map((t: any) => ({
//         value: t.teacherId,
//         label: `${t.teacherFirstName} ${t.teacherLastName || ""}`.trim(),
//       }));
//     }
//     return [];
//   }, [teacherData]);

//   // ⭐ CLASSROOM OPTIONS for Picker
//   const classroomOptions = useMemo(() => {
//     if (classroomData?.statusCode === 200 && classroomData.data?.classRooms) {
//       return classroomData.data.classRooms.map((room: any) => ({
//         value: room.classRoomId,
//         label: room.classRoomName,
//       }));
//     }
//     return [];
//   }, [classroomData]);

//   // ⭐ SUBJECT OPTIONS from Course Detail API
//   const subjectOptions = useMemo(() => {
//     if (courseDetailData?.data?.subjects && Array.isArray(courseDetailData.data.subjects)) {
//       return courseDetailData.data.subjects.map((s: any) => ({
//         value: s.subjectId,
//         label: s.subjectName,
//       }));
//     }
//     return [];
//   }, [courseDetailData]);

//   const courseName = courseDetailData?.data?.courseName || selectedBatchInfo?.courses?.[0]?.courseName || "Course";
//   const batchName = selectedBatchInfo?.batchName || selectedBatch || "Batch";

//   const combinedSubjectOptions = useMemo(
//     () => [...subjectOptions, ...customSubjects],
//     [subjectOptions, customSubjects]
//   );

//   // ⭐ OPERATING HOURS
//   const DEFAULT_HOURS = { openingTime: "09:00", closingTime: "18:00" };
//   const operatingHours = useMemo(() => {
//     const opening =
//       classroomData?.data?.openingTime ??
//       classroomData?.data?.operatingHours?.openingTime ??
//       DEFAULT_HOURS.openingTime;
//     const closing =
//       classroomData?.data?.closingTime ??
//       classroomData?.data?.operatingHours?.closingTime ??
//       DEFAULT_HOURS.closingTime;
//     return { openingTime: opening, closingTime: closing };
//   }, [classroomData]);

//   // ⭐ START TIMES (operating hours ke andar 15 min intervals)
//   const startTimes = useMemo(
//     () => generateStartTimes(operatingHours.openingTime, operatingHours.closingTime),
//     [operatingHours]
//   );

//   // ⭐ END TIMES (start time se 15 min increments, closing time se zyada nahi)
//   const endTimes = useMemo(() => {
//     if (!startTime) return [];
//     return generateEndTimes(startTime, operatingHours.closingTime);
//   }, [startTime, operatingHours.closingTime]);

//   // ⭐ Reset endTime when startTime changes
//   useEffect(() => {
//     if (startTime) {
//       setEndTime("");
//     }
//   }, [startTime]);

//   // ⭐ Cascading dropdown logic
//   useEffect(() => {
//     if (selectedSubject) {
//       setSubjectDropdownOpen(false);
//       setTeacherDropdownOpen(true);
//     }
//   }, [selectedSubject]);

//   useEffect(() => {
//     if (selectedTeacher) {
//       setTeacherDropdownOpen(false);
//       setRoomDropdownOpen(true);
//     }
//   }, [selectedTeacher]);

//   useEffect(() => {
//     if (selectedRoom) {
//       setRoomDropdownOpen(false);
//       setStartTimeDropdownOpen(true);
//     }
//   }, [selectedRoom]);

//   useEffect(() => {
//     if (startTime) {
//       setStartTimeDropdownOpen(false);
//       setEndTimeDropdownOpen(true);
//     }
//   }, [startTime]);

//   useEffect(() => {
//     if (endTime) {
//       setEndTimeDropdownOpen(false);
//     }
//   }, [endTime]);

//   const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2]); // M T W default

//   // ⭐ Check if in edit mode (declare early so it can be used in useEffect)
//   const isEditMode = !!editingSlot;

//   // ⭐ Prefill form when editingSlot exists
//   useEffect(() => {
//     console.log("📝 === SLOT FORM MODAL EFFECT ===");
//     console.log("📝 visible:", visible);
//     console.log("📝 editingSlot:", editingSlot ? JSON.stringify(editingSlot, null, 2) : "null");
//     console.log("📝 isEditMode:", isEditMode);
    
//     if (editingSlot && visible) {
//       console.log("📝 Prefilling form with editingSlot");
//       console.log("📝 Subject ID:", editingSlot.subjectId);
//       console.log("📝 Teacher ID:", editingSlot.teacherId);
//       console.log("📝 Room ID:", editingSlot.classRoomId);
//       console.log("📝 Start Time:", editingSlot.startTime);
//       console.log("📝 End Time:", editingSlot.endTime);
//       console.log("📝 Day:", editingSlot.day);
      
//       // Set values immediately - Picker will update when options are available
//       setSelectedSubject(editingSlot.subjectId || "");
//       setSelectedTeacher(editingSlot.teacherId || "");
//       setSelectedRoom(editingSlot.classRoomId || "");
//       setStartTime(editingSlot.startTime || "");
//       setEndTime(editingSlot.endTime || "");
//       setRepeat(true); // Single day for edit mode
      
//       // Set active day based on editingSlot.day
//       if (editingSlot.day) {
//         const dayDate = editingSlot.day instanceof Date ? editingSlot.day : new Date(editingSlot.day);
//         const dayOfWeek = dayDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
//         // Convert to our day index (0 = Monday)
//         const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
//         console.log("📝 Day of week:", dayOfWeek, "Adjusted index:", adjustedIndex);
//         setActiveDays([adjustedIndex]);
//       }
      
//       console.log("✅ Form values set:", {
//         subject: editingSlot.subjectId,
//         teacher: editingSlot.teacherId,
//         room: editingSlot.classRoomId,
//         startTime: editingSlot.startTime,
//         endTime: editingSlot.endTime,
//       });
//     } else if (!editingSlot && visible) {
//       console.log("📝 Resetting form for new slot");
//       // Reset form when opening for new slot
//       setSelectedSubject("");
//       setSelectedTeacher("");
//       setSelectedRoom("");
//       setStartTime("");
//       setEndTime("");
//       setRepeat(true);
//       setActiveDays([]);
//     }
//   }, [editingSlot, visible, isEditMode]);

//   // ⭐ Log state values when they change (for debugging)
//   useEffect(() => {
//     if (visible && isEditMode) {
//       console.log("📊 Current form state:", {
//         selectedSubject,
//         selectedTeacher,
//         selectedRoom,
//         startTime,
//         endTime,
//         activeDays,
//         subjectOptionsCount: subjectOptions.length,
//         teacherOptionsCount: teacherOptions.length,
//         classroomOptionsCount: classroomOptions.length,
//       });
//     }
//   }, [visible, isEditMode, selectedSubject, selectedTeacher, selectedRoom, startTime, endTime, activeDays, subjectOptions.length, teacherOptions.length, classroomOptions.length]);

//   useEffect(() => {
//     if (addSubjectModalVisible) {
//       setSubjectModalStep("select");
//       setTempSubjectSelection(selectedSubject || "");
//     } else {
//       setPendingSubjects([]);
//       setNewSubjectName("");
//     }
//   }, [addSubjectModalVisible, selectedSubject]);
//   const toggleDay = (index: number) => {
//     // In edit mode, only one day can be selected at a time
//     if (isEditMode) {
//       // If clicking the same day, deselect it (optional - or keep it selected)
//       // If clicking a different day, replace the selection
//       setActiveDays([index]);
//     } else {
//       // Normal mode: allow multiple days selection
//       setActiveDays((prev) =>
//         prev.includes(index)
//           ? prev.filter((i) => i !== index)
//           : [...prev, index]
//       );
//     }
//   };

//   // Format selected days for display
//   const formatSelectedDays = () => {
//     if (activeDays.length === 0) return "";
    
//     const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
//     const selectedDayNames = activeDays
//       .sort((a, b) => a - b) // Sort by index to maintain order
//       .map((index) => dayNames[index]);
    
//     return `Occurs weekly on ${selectedDayNames.join(", ")}`;
//   };
 
//   const handleAddPendingSubject = () => {
//     const trimmed = newSubjectName.trim();
//     if (!trimmed) {
//       return;
//     }
//     if (pendingSubjects.some((name) => name.toLowerCase() === trimmed.toLowerCase())) {
//       Alert.alert("Duplicate", "Subject already added in list.");
//       return;
//     }
//     setPendingSubjects((prev) => [...prev, trimmed]);
//     setNewSubjectName("");
//   };

//   const handleRemovePendingSubject = (name: string) => {
//     setPendingSubjects((prev) => prev.filter((item) => item !== name));
//   };

//   const handleSubmitNewSubjects = () => {
//     if (pendingSubjects.length === 0) {
//       return;
//     }
//     const created = pendingSubjects.map((name, index) => ({
//       value: `temp-${Date.now()}-${index}-${name}`,
//       label: name,
//     }));
//     setCustomSubjects((prev) => [...prev, ...created]);
//     const last = created[created.length - 1];
//     setSelectedSubject(last.value);
//     setPendingSubjects([]);
//     setNewSubjectName("");
//     setAddSubjectModalVisible(false);
//     Alert.alert("Subject added", "New subject has been added locally.");
//   };

//   const handleRoomPlusPress = () => {
//     onClose();
//     requestAnimationFrame(() => {
//       onNavigateToClassrooms?.();
//     });
//   };

//   // ⭐ REDUX: Organization data (use prop if provided, else from Redux)
//   const reduxOrganization = useSelector((state: RootState) => state.auth.selectedOrganization);
//   const selectedOrganization = propSelectedOrganization || reduxOrganization;

//   // ⭐ MUTATION: Create, Update and Delete TimeTable
//   const createMutation = useCreateTimeTableMutation();
//   const updateMutation = useUpdateTimeTableMutation();
//   const deleteMutation = useDeleteTimeTableMutation();
//   const queryClient = useQueryClient();

//   // ⭐ HELPER: Handle success response (refetch and close modal)
//   const handleSuccessResponse = (response: any, isEdit: boolean) => {
//     console.log(`✅ TimeTable ${isEdit ? "updated" : "created"} successfully:`, response);
    
//     // Check for error responses (404, etc.)
//     if (response?.status === 404 || response?.data?.statusCode === 404) {
//       console.error("❌ 404 Error: Resource not found");
//       Alert.alert("Error", response?.data?.message || "API endpoint not found (404). Please check the backend service.");
//       return;
//     }
    
//     // Check if response is empty string (backend returns "" but saves data like web)
//     const isEmptyResponse = typeof response === "string" && response === "";
//     const hasNoData = !response?.data && !response?.statusCode;
    
//     if (isEmptyResponse) {
//       console.log("ℹ️ Backend returned empty string (like web), but data should be saved");
//     } else if (hasNoData && !isEmptyResponse) {
//       console.warn("⚠️ WARNING: Backend returned invalid response!");
//       Alert.alert(
//         "Warning",
//         "Slot operation may have failed. Please check if the slot appears in the timetable. If not, please try again or contact support.",
//         [{ text: "OK", style: "default" }]
//       );
//     }
    
//     // Invalidate ALL timetable queries (with any params) to refresh grid
//     queryClient.invalidateQueries({
//       predicate: (query) => {
//         return query.queryKey[0] === "timeTable";
//       },
//     });
    
//     // If weekStart is provided, refetch with exact params
//     if (weekStart && selectedOrganization && selectedBatchId) {
//       const startWeekDate = weekStart.toISOString().split('T')[0];
//       const endDate = new Date(weekStart);
//       endDate.setDate(weekStart.getDate() + 6);
//       const endWeekDate = endDate.toISOString().split('T')[0];
      
//       const refetchParams = {
//         customerId: selectedOrganization.customerId,
//         organizationId: selectedOrganization.organizationId,
//         batchId: selectedBatchId,
//         startWeekDate: startWeekDate,
//         endWeekDate: endWeekDate,
//       };
      
//       console.log("🔄 Refetching with params:", refetchParams);
      
//       setTimeout(() => {
//         console.log("🔄 Executing refetch now...");
//         queryClient.refetchQueries({
//           queryKey: ["timeTable", refetchParams],
//         }).then(() => {
//           console.log("✅ Refetch completed");
//         }).catch((err) => {
//           console.error("❌ Refetch error:", err);
//         });
//       }, 2000);
//     } else {
//       setTimeout(() => {
//         queryClient.refetchQueries({
//           predicate: (query) => {
//             return query.queryKey[0] === "timeTable";
//           },
//         });
//       }, 2000);
//     }
    
//     // Call onSuccess callback if provided
//     if (onSuccess) {
//       onSuccess();
//     }
//     // Close modal
//     onClose();
//     // Reset form
//     setSelectedSubject("");
//     setSelectedTeacher("");
//     setSelectedRoom("");
//     setStartTime("");
//     setEndTime("");
//     setActiveDays([]);
//   };

//   // ⭐ HELPER: Handle error response
//   const handleErrorResponse = (error: any, isEdit: boolean) => {
//     console.error(`❌ Error ${isEdit ? "updating" : "creating"} TimeTable:`, error);
//     console.error("❌ Error details:", JSON.stringify(error, null, 2));
//     console.error("❌ API URL that failed:", isEdit ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE);
    
//     const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEdit ? "update" : "create"} slot. Please try again.`;
//     const is404 = error?.response?.status === 404 || 
//                  error?.response?.data?.statusCode === 404 || 
//                  error?.message?.includes("404") || 
//                  error?.message?.includes("not found") ||
//                  error?.message?.includes("Not Found");
    
//     if (is404) {
//       Alert.alert(
//         "Error",
//         "API endpoint not found (404). Please check the backend service or contact support.",
//         [{ text: "OK", style: "default" }]
//       );
//     } else {
//       Alert.alert("Error", errorMessage, [{ text: "OK", style: "default" }]);
//     }
//   };

//   // ⭐ HANDLE ADD/UPDATE SLOT
//   const handleAddSlot = () => {
//     const action = isEditMode ? "UPDATE" : "ADD";
//     console.log(`🔵 === ${action} SLOT CLICKED ===`);
//     console.log("Form Values:", {
//       selectedSubject,
//       selectedTeacher,
//       selectedRoom,
//       startTime,
//       endTime,
//       selectedBatchId,
//       repeat,
//       activeDays,
//       selectedCell: selectedCell ? "exists" : "null",
//       editingSlot: editingSlot ? "exists" : "null",
//     });

//     // Validation
//     if (!selectedSubject) {
//       console.log("❌ Validation failed: Subject not selected");
//       Alert.alert("Error", "Please select a subject");
//       return;
//     }
//     if (!selectedTeacher) {
//       console.log("❌ Validation failed: Teacher not selected");
//       Alert.alert("Error", "Please select a teacher");
//       return;
//     }
//     if (!selectedRoom) {
//       console.log("❌ Validation failed: Room not selected");
//       Alert.alert("Error", "Please select a room");
//       return;
//     }
//     if (!startTime) {
//       console.log("❌ Validation failed: Start time not selected");
//       Alert.alert("Error", "Please select start time");
//       return;
//     }
//     if (!endTime) {
//       console.log("❌ Validation failed: End time not selected");
//       Alert.alert("Error", "Please select end time");
//       return;
//     }
//     if (!selectedBatchId) {
//       console.log("❌ Validation failed: Batch ID not found");
//       Alert.alert("Error", "Batch not selected");
//       return;
//     }
//     if (repeat && activeDays.length === 0) {
//       console.log("❌ Validation failed: No days selected");
//       Alert.alert("Error", "Please select at least one day");
//       return;
//     }
//     if (!repeat && !selectedCell) {
//       console.log("❌ Validation failed: No cell selected and repeat is off");
//       Alert.alert("Error", "Please select a cell or enable repeat");
//       return;
//     }

//     console.log("✅ All validations passed");

//     // ⭐ CONFLICT VALIDATION: Check for time conflicts with existing slots
//     const repeatDaysData = timeTableData?.data?.repeatDays || {};
//     const conflicts: string[] = [];
//     const dayNames: { [key: string]: string } = {
//       "M": "Monday",
//       "T": "Tuesday",
//       "W": "Wednesday",
//       "Th": "Thursday",
//       "F": "Friday",
//       "Sa": "Saturday",
//       "Su": "Sunday"
//     };

//     // Build daysToUse first to check conflicts
//     let daysToUse: string[] = [];
//     if (repeat) {
//       if (weekStart) {
//         daysToUse = activeDays.map((dayIndex) => {
//           const dayDate = new Date(weekStart);
//           dayDate.setDate(weekStart.getDate() + dayIndex);
//           const dayOfWeek = dayDate.getDay();
//           const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//           return dayKeys[dayOfWeek];
//         });
//       } else {
//         daysToUse = activeDays.map((dayIndex) => DAY_KEYS[dayIndex]);
//       }
//     } else if (isEditMode && editingSlot?.day) {
//       const dayOfWeek = editingSlot.day.getDay();
//       const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//       daysToUse = [dayKeys[dayOfWeek]];
//     } else if (selectedCell) {
//       const dayOfWeek = selectedCell.day.getDay();
//       const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//       daysToUse = [dayKeys[dayOfWeek]];
//     }

//     // Check conflicts for each selected day
//     for (const dayKey of daysToUse) {
//       const daySlots = repeatDaysData[dayKey] || [];
//       const dayName = dayNames[dayKey] || dayKey;

//       for (const existingSlot of daySlots) {
//         // Skip the current slot if we're editing (to avoid self-conflict)
//         if (isEditMode && editingSlot && (existingSlot.id === editingSlot.id || existingSlot.slotId === editingSlot.id)) {
//           continue;
//         }

//         // Check if times overlap
//         if (isTimeOverlap(startTime, endTime, existingSlot.startTime, existingSlot.endTime)) {
//           // Check if same teacher
//           if (existingSlot.teacherId === selectedTeacher) {
//             conflicts.push(`${dayName}: Teacher already has a slot from ${existingSlot.startTime} to ${existingSlot.endTime}`);
//           }
//           // Check if same classroom
//           else if (existingSlot.classRoomId === selectedRoom) {
//             conflicts.push(`${dayName}: Classroom already booked from ${existingSlot.startTime} to ${existingSlot.endTime}`);
//           }
//         }
//       }
//     }

//     // If conflicts found, show error and return
//     if (conflicts.length > 0) {
//       const conflictMessage = `⛔ Time Conflict Detected:\n\n${conflicts.map((c, i) => `${i + 1}. ${c}`).join("\n")}`;
//       console.log("❌ Conflict detected:", conflictMessage);
//       Alert.alert("Time Conflict", conflictMessage);
//       return;
//     }

//     // Build slot object
//     const slotObject = {
//       subjectId: selectedSubject,
//       teacherId: selectedTeacher,
//       classRoomId: selectedRoom,
//       startTime: startTime,
//       endTime: endTime,
//     };

//     // Build repeatDays payload (daysToUse already calculated above in conflict validation)
//     // Final validation: ensure we have at least one day
//     if (daysToUse.length === 0) {
//       Alert.alert("Error", "Please select at least one day");
//       return;
//     }

//     // ⭐ CHECK IF DAY HAS CHANGED (for edit mode)
//     let dayChanged = false;
//     let originalDayKey = "";
    
//     if (isEditMode && editingSlot?.day) {
//       // Get original day key from editingSlot
//       const originalDayDate = editingSlot.day instanceof Date ? editingSlot.day : new Date(editingSlot.day);
//       const originalDayOfWeek = originalDayDate.getDay();
//       const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
//       originalDayKey = dayKeys[originalDayOfWeek];
      
//       // Check if new day is different from original day
//       // For single day edit, daysToUse should have only one day
//       if (daysToUse.length === 1 && daysToUse[0] !== originalDayKey) {
//         dayChanged = true;
//         console.log("🔄 Day changed detected!");
//         console.log("🔄 Original day:", originalDayKey);
//         console.log("🔄 New day:", daysToUse[0]);
//       }
//     }

//     let payload: any;

//     // For UPDATE: Use flat structure like web (simple object with repeatDays array)
//     if (isEditMode && editingSlot) {
//       // Clean the ID - remove any extra quotes or whitespace
//       let slotId = (editingSlot.id || editingSlot.slotId || "").toString();
//       // Remove quotes from start and end only (not from middle)
//       slotId = slotId.replace(/^["']+|["']+$/g, "").trim();
      
//       console.log("✏️ Edit mode - Slot ID:", slotId);
//       console.log("✏️ Original ID from editingSlot:", editingSlot.id);
      
//       if (!slotId) {
//         Alert.alert("Error", "Slot ID is missing. Cannot update slot.");
//         return;
//       }

//       // Convert day keys to day indices (like web: [0, 1, 2] for M, T, W)
//       // Web uses: 0=Monday, 1=Tuesday, etc.
//       const dayKeyToIndex: Record<string, number> = {
//         "M": 0,
//         "T": 1,
//         "W": 2,
//         "Th": 3,
//         "F": 4,
//         "Sa": 5,
//         "Su": 6,
//       };
//       const repeatDaysArray = daysToUse
//         .map(dayKey => dayKeyToIndex[dayKey])
//         .filter(idx => idx !== undefined);

//       // Build flat payload like web version
//       payload = {
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         batchId: selectedBatchId,
//         id: slotId,
//         subjectId: selectedSubject,
//         teacherId: selectedTeacher,
//         classRoomId: selectedRoom,
//         startTime: startTime,
//         endTime: endTime,
//         repeatDays: repeatDaysArray, // Array of day indices, not nested object
//         startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
//         endDate: weekStart ? (() => {
//           const end = new Date(weekStart);
//           end.setDate(weekStart.getDate() + 6);
//           return end.toISOString().split('T')[0];
//         })() : "",
//       };
      
//       console.log("✏️ Update payload (flat structure like web):", JSON.stringify(payload, null, 2));
//     } else {
//       // For CREATE: Use FLAT structure like web (not nested)
//       // Convert day keys to day indices (0=Monday, 1=Tuesday, etc.)
//       const dayKeyToIndex: Record<string, number> = {
//         "M": 0,
//         "T": 1,
//         "W": 2,
//         "Th": 3,
//         "F": 4,
//         "Sa": 5,
//         "Su": 6,
//       };
//       const repeatDaysArray = daysToUse
//         .map(dayKey => dayKeyToIndex[dayKey])
//         .filter(idx => idx !== undefined);

//       // Build flat payload like web version
//       payload = {
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         batchId: selectedBatchId,
//         subjectId: selectedSubject,
//         teacherId: selectedTeacher,
//         classRoomId: selectedRoom,
//         startTime: startTime,
//         endTime: endTime,
//         repeatDays: repeatDaysArray, // Array of day indices, not nested object
//         startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
//         endDate: weekStart ? (() => {
//           const end = new Date(weekStart);
//           end.setDate(weekStart.getDate() + 6);
//           return end.toISOString().split('T')[0];
//         })() : "",
//       };
      
//       console.log("📦 CREATE payload (flat structure like web):", JSON.stringify(payload, null, 2));
//     }

//     console.log(`📦 Final Payload (${isEditMode ? "UPDATE" : "CREATE"}):`, JSON.stringify(payload, null, 2));
//     console.log("📦 Organization:", {
//       customerId: selectedOrganization?.customerId,
//       organizationId: selectedOrganization?.organizationId,
//     });

//     // ⭐ HANDLE DAY CHANGE: If day changed, delete old slot first, then create new one
//     if (dayChanged && isEditMode && editingSlot) {
//       console.log("🔄 Day changed - Deleting old slot and creating new one...");
      
//       // Clean the ID
//       let slotId = (editingSlot.id || editingSlot.slotId || "").toString();
//       slotId = slotId.replace(/^["']+|["']+$/g, "").trim();
      
//       // Build delete payload
//       const deletePayload = {
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         batchId: selectedBatchId,
//         startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
//         endDate: weekStart ? (() => {
//           const end = new Date(weekStart);
//           end.setDate(weekStart.getDate() + 6);
//           return end.toISOString().split('T')[0];
//         })() : "",
//         id: slotId,
//         dayKey: originalDayKey,
//         startTime: editingSlot.startTime || startTime,
//         endTime: editingSlot.endTime || endTime,
//       };
      
//       console.log("🗑️ Delete payload (old day):", JSON.stringify(deletePayload, null, 2));
      
//       // First delete from old day
//       deleteMutation.mutate(deletePayload, {
//         onSuccess: (deleteResponse) => {
//           console.log("✅ Old slot deleted successfully:", deleteResponse);
          
//           // Now create new slot in new day
//           console.log("➕ Creating new slot in new day...");
//           createMutation.mutate(payload, {
//             onSuccess: (createResponse) => {
//               console.log("✅ New slot created successfully:", createResponse);
//               handleSuccessResponse(createResponse, false);
//             },
//             onError: (createError) => {
//               console.error("❌ Error creating new slot:", createError);
//               handleErrorResponse(createError, false);
//             },
//           });
//         },
//         onError: (deleteError: any) => {
//           console.error("❌ Error deleting old slot:", deleteError);
//           const errorMessage = deleteError?.response?.data?.message || deleteError?.message || "Failed to delete old slot. Please try again.";
//           Alert.alert("Error", errorMessage);
//         },
//       });
      
//       return; // Exit early, don't proceed with normal update
//     }

//     // Call API (normal update or create)
//     const mutation = isEditMode ? updateMutation : createMutation;
//     console.log(`🚀 Calling ${isEditMode ? "updateMutation" : "createMutation"}.mutate...`);
//     mutation.mutate(payload, {
//       onSuccess: (response) => {
//         console.log(`✅ TimeTable ${isEditMode ? "updated" : "created"} successfully:`, response);
//         console.log("📝 Response type:", typeof response);
//         console.log("📝 Response stringified:", JSON.stringify(response));
//         console.log("📝 Response data:", response?.data);
//         console.log("📝 Response statusCode:", response?.statusCode);
//         console.log("📝 Response message:", response?.message);
        
//         // Check for error responses (404, etc.) - If axios returns error as response
//         if (response?.status === 404 || response?.data?.statusCode === 404) {
//           console.error("❌ 404 Error: Resource not found (caught in onSuccess)");
//           // Throw error so it goes to onError handler for proper handling
//           throw new Error(response?.data?.message || "API endpoint not found (404). Please check the backend service.");
//         }
        
//         // Check if response is empty string (backend returns "" but saves data like web)
//         const isEmptyResponse = typeof response === "string" && response === "";
//         const hasNoData = !response?.data && !response?.statusCode;
        
//         if (isEmptyResponse) {
//           console.log("ℹ️ Backend returned empty string (like web), but data should be saved");
//           // Don't show warning - web me bhi same response aata hai and it works
//           // Proceed with refetch - data should be saved
//         } else if (hasNoData && !isEmptyResponse) {
//           console.warn("⚠️ WARNING: Backend returned invalid response!");
//           console.warn("⚠️ This might indicate the data was not saved properly.");
          
//           // Show warning to user only if response is not empty string
//           Alert.alert(
//             "Warning",
//             "Slot creation may have failed. Please check if the slot appears in the timetable. If not, please try again or contact support.",
//             [
//               {
//                 text: "OK",
//                 style: "default",
//               },
//             ]
//           );
//         }
        
//         // Invalidate ALL timetable queries (with any params) to refresh grid
//         queryClient.invalidateQueries({
//           predicate: (query) => {
//             return query.queryKey[0] === "timeTable";
//           },
//         });
        
//         // If weekStart is provided, refetch with exact params
//         if (weekStart && selectedOrganization && selectedBatchId) {
//           const startWeekDate = weekStart.toISOString().split('T')[0];
//           const endDate = new Date(weekStart);
//           endDate.setDate(weekStart.getDate() + 6);
//           const endWeekDate = endDate.toISOString().split('T')[0];
          
//           const refetchParams = {
//             customerId: selectedOrganization.customerId,
//             organizationId: selectedOrganization.organizationId,
//             batchId: selectedBatchId,
//             startWeekDate: startWeekDate,
//             endWeekDate: endWeekDate,
//           };
          
//           console.log("🔄 Refetching with params:", refetchParams);
          
//           // Longer delay to ensure backend has fully processed and committed
//           setTimeout(() => {
//             console.log("🔄 Executing refetch now...");
//             queryClient.refetchQueries({
//               queryKey: ["timeTable", refetchParams],
//             }).then(() => {
//               console.log("✅ Refetch completed");
//             }).catch((err) => {
//               console.error("❌ Refetch error:", err);
//             });
//           }, 2000); // Increased to 2 seconds
//         } else {
//           // Fallback: refetch all timeTable queries
//           setTimeout(() => {
//             queryClient.refetchQueries({
//               predicate: (query) => {
//                 return query.queryKey[0] === "timeTable";
//               },
//             });
//           }, 2000);
//         }
        
//         // Call onSuccess callback if provided
//         if (onSuccess) {
//           onSuccess();
//         }
//         // Close modal
//         onClose();
//         // Reset form
//         setSelectedSubject("");
//         setSelectedTeacher("");
//         setSelectedRoom("");
//         setStartTime("");
//         setEndTime("");
//         setActiveDays([]);
//       },
//       onError: (error: any) => {
//         console.error(`❌ Error ${isEditMode ? "updating" : "creating"} TimeTable:`, error);
//         console.error("❌ Error details:", JSON.stringify(error, null, 2));
//         console.error("❌ Error type:", typeof error);
//         console.error("❌ Error message:", error?.message);
//         console.error("❌ Error response:", error?.response);
//         console.error("❌ Error status:", error?.response?.status);
//         console.error("❌ Error statusCode:", error?.response?.data?.statusCode);
//         console.error("❌ Error response message:", error?.response?.data?.message);
//         console.error("❌ API URL that failed:", isEditMode ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE);
        
//         // Get error message from different possible locations
//         const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEditMode ? "update" : "create"} slot. Please try again.`;
//         const is404 = error?.response?.status === 404 || 
//                      error?.response?.data?.statusCode === 404 || 
//                      error?.message?.includes("404") || 
//                      error?.message?.includes("not found") ||
//                      error?.message?.includes("Not Found");
        
//         // Check for 404 specifically
//         if (is404) {
//           const apiUrl = isEditMode ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE;
//           Alert.alert(
//             "404 - Resource Not Found",
//             `The API endpoint was not found. Please check:\n\n1. API URL: ${apiUrl}\n2. Payload structure\n3. Backend service status\n\nError: ${errorMessage}`
//           );
//         } else {
//           Alert.alert(
//             "Error",
//             errorMessage
//           );
//         }
//       },
//     });
//   };

//   return (
//     <>
//       <Modal visible={visible} transparent animationType="slide">
//         <View style={styles.backdrop}>
//           <View style={styles.modalContentWrapper}>
//             <ScrollView
//               style={styles.modalContainer}
//               contentContainerStyle={{ paddingBottom: 40 }}
//             >
//           {/* Title */}
//           <Text style={styles.title}>
//             {isEditMode ? "Update Slot" : `Add New Slot for ${selectedBatch}`}
//           </Text>

//           {/* SUBJECT */}
//           <Text style={styles.label}>Subject</Text>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={styles.dropdownBox}
//               onPress={() => {
//                 setSubjectDropdownOpen(!subjectDropdownOpen);
//                 if (subjectDropdownOpen) {
//                   setTeacherDropdownOpen(false);
//                   setRoomDropdownOpen(false);
//                   setStartTimeDropdownOpen(false);
//                   setEndTimeDropdownOpen(false);
//                 }
//               }}
//             >
//               <View style={styles.dropdownContent}>
//                 <Text style={[styles.dropdownText, !selectedSubject && styles.dropdownPlaceholder]}>
//                   {selectedSubject 
//                     ? combinedSubjectOptions.find((s: { value: string; label: string }) => s.value === selectedSubject)?.label 
//                     : "Select subject"}
//                 </Text>
//                 <Text style={styles.dropdownArrow}>{subjectDropdownOpen ? "▲" : "▼"}</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.plusBtn}
//               onPress={() => setAddSubjectModalVisible(true)}
//             >
//               <Text style={styles.plusText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Subject Dropdown List */}
//           {subjectDropdownOpen && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select subject</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {combinedSubjectOptions.map((subject: { value: string; label: string }) => {
//                   const isSelected = selectedSubject === subject.value;
//                   return (
//                     <TouchableOpacity
//                       key={subject.value}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setSelectedSubject(subject.value);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {subject.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* TEACHER */}
//           <Text style={styles.label}>Teacher</Text>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={[styles.dropdownBox, !selectedSubject && styles.dropdownBoxDisabled]}
//               onPress={() => {
//                 if (selectedSubject) {
//                   setTeacherDropdownOpen(!teacherDropdownOpen);
//                   if (teacherDropdownOpen) {
//                     setRoomDropdownOpen(false);
//                     setStartTimeDropdownOpen(false);
//                     setEndTimeDropdownOpen(false);
//                   }
//                 }
//               }}
//               disabled={!selectedSubject}
//             >
//               <View style={styles.dropdownContent}>
//                 <Text style={[styles.dropdownText, (!selectedTeacher || !selectedSubject) && styles.dropdownPlaceholder]}>
//                   {selectedTeacher 
//                     ? teacherOptions.find((t: { value: string; label: string }) => t.value === selectedTeacher)?.label 
//                     : "Select teacher"}
//                 </Text>
//                 <Text style={[styles.dropdownArrow, !selectedSubject && { opacity: 0.5 }]}>
//                   {teacherDropdownOpen ? "▲" : "▼"}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.plusBtn}>
//               <Text style={styles.plusText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Teacher Dropdown List */}
//           {teacherDropdownOpen && selectedSubject && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select teacher</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {teacherOptions.map((teacher: { value: string; label: string }) => {
//                   const isSelected = selectedTeacher === teacher.value;
//                   return (
//                     <TouchableOpacity
//                       key={teacher.value}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setSelectedTeacher(teacher.value);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {teacher.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* ROOM */}
//           <Text style={styles.label}>Room</Text>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={[styles.dropdownBox, !selectedTeacher && styles.dropdownBoxDisabled]}
//               onPress={() => {
//                 if (selectedTeacher) {
//                   setRoomDropdownOpen(!roomDropdownOpen);
//                   if (roomDropdownOpen) {
//                     setStartTimeDropdownOpen(false);
//                     setEndTimeDropdownOpen(false);
//                   }
//                 }
//               }}
//               disabled={!selectedTeacher}
//             >
//               <View style={styles.dropdownContent}>
//                 <Text style={[styles.dropdownText, (!selectedRoom || !selectedTeacher) && styles.dropdownPlaceholder]}>
//                   {selectedRoom 
//                     ? classroomOptions.find((r: { value: string; label: string }) => r.value === selectedRoom)?.label 
//                     : "Select room"}
//                 </Text>
//                 <Text style={[styles.dropdownArrow, !selectedTeacher && { opacity: 0.5 }]}>
//                   {roomDropdownOpen ? "▲" : "▼"}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.plusBtn} onPress={handleRoomPlusPress}>
//               <Text style={styles.plusText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Room Dropdown List */}
//           {roomDropdownOpen && selectedTeacher && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select room</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {classroomOptions.map((room: { value: string; label: string }) => {
//                   const isSelected = selectedRoom === room.value;
//                   return (
//                     <TouchableOpacity
//                       key={room.value}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setSelectedRoom(room.value);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {room.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* START TIME */}
//           <Text style={styles.label}>Start Time</Text> 
//           <View style={styles.row}>       
//           <TouchableOpacity 
//             style={[styles.dropdownBox, !selectedRoom && styles.dropdownBoxDisabled]}
//             onPress={() => {
//               if (selectedRoom) {
//                 setStartTimeDropdownOpen(!startTimeDropdownOpen);
//                 if (startTimeDropdownOpen) {
//                   setEndTimeDropdownOpen(false);
//                 }
//               }
//             }}
//             disabled={!selectedRoom}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownText, (!startTime || !selectedRoom) && styles.dropdownPlaceholder]}>
//                 {startTime || "Select start time"}
//               </Text>
//               <Text style={[styles.dropdownArrow, !selectedRoom && { opacity: 0.5 }]}>
//                 {startTimeDropdownOpen ? "▲" : "▼"}
//               </Text>
//             </View>
//           </TouchableOpacity>
//           <View style={{ width: 38, height: 38 }} />
//           </View>
//           {/* Start Time Dropdown List */}
//           {startTimeDropdownOpen && selectedRoom && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select start time</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {startTimes.map((time: string) => {
//                   const isSelected = startTime === time;
//                   return (
//                     <TouchableOpacity
//                       key={time}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setStartTime(time);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {time}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* END TIME */}
//           <Text style={styles.label}>End Time</Text>
//           <View style={styles.row}>
//           <TouchableOpacity 
//             style={[styles.dropdownBox, !startTime && styles.dropdownBoxDisabled]}
//             onPress={() => {
//               if (startTime) {
//                 setEndTimeDropdownOpen(!endTimeDropdownOpen);
//               }
//             }}
//             disabled={!startTime}
//           >
//             <View style={styles.dropdownContent}>
//               <Text style={[styles.dropdownText, (!endTime || !startTime) && styles.dropdownPlaceholder]}>
//                 {endTime || "Select end time"}
//               </Text>
//               <Text style={[styles.dropdownArrow, !startTime && { opacity: 0.5 }]}>
//                 {endTimeDropdownOpen ? "▲" : "▼"}
//               </Text>
//             </View>
//           </TouchableOpacity>
//             {/* Invisible spacer to match Teacher field width */}
//           <View style={{ width: 38, height: 38 }} />
//           </View>

//           {/* End Time Dropdown List */}
//           {endTimeDropdownOpen && startTime && (
//             <View style={styles.cascadingDropdown}>
//               <Text style={styles.cascadingDropdownTitle}>Select end time</Text>
//               <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
//                 {endTimes.map((time: string) => {
//                   const isSelected = endTime === time;
//                   return (
//                     <TouchableOpacity
//                       key={time}
//                       style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
//                       onPress={() => {
//                         setEndTime(time);
//                       }}
//                     >
//                       <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
//                         {time}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}

//           {/* REPEAT TOGGLE */}
//           <View style={styles.repeatRow}>
//             <Text style={styles.repeatLabel}>Schedule Days</Text>
//             <Switch
//               value={repeat}
//               onValueChange={setRepeat}
//               thumbColor="#FFF"
//               trackColor={{ true: COLORS.primary, false: "#CCC" }}
//             />
//           </View>

//           {/* SELECT DAYS */}
//           {/* SELECT DAYS (Visible only when REPEAT = true) */}
// {repeat && (
//   <>
//     <Text style={styles.label}>Select Days</Text>

//     <View style={styles.daysRow}>
//       {DAY_KEYS.map((d, i) => {
//         const isActive = activeDays.includes(i);
//         return (
//           <TouchableOpacity
//             key={i}
//             style={[
//               styles.dayCircle,
//               isActive && { backgroundColor: PURPLE },
//             ]}
//             onPress={() => toggleDay(i)}
//           >
//             <Text
//               style={[
//                 styles.dayText,
//                 isActive && { color: "#FFF", fontWeight: "700" },
//               ]}
//             >
//               {d}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>

//     {activeDays.length > 0 && (
//       <View style={styles.daySummaryBox}>
//         <Text style={styles.daySummaryText}>{formatSelectedDays()}</Text>
//       </View>
//     )}
//   </>
// )}


//         </ScrollView>

//         {/* FOOTER BUTTONS */}
//         <View style={styles.footerRow}>
//           <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
//             <Text style={styles.cancelText}>Cancel</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.saveBtn, (isEditMode ? updateMutation : createMutation).isPending && styles.saveBtnDisabled]}
//             onPress={() => {
//               console.log("🟢 BUTTON CLICKED!");
//               handleAddSlot();
//             }}
//             disabled={(isEditMode ? updateMutation : createMutation).isPending}
//           >
//             <Text style={styles.saveBtnText}>
//               {(isEditMode ? updateMutation : createMutation).isPending 
//                 ? (isEditMode ? "Updating..." : "Adding...") 
//                 : (isEditMode ? "UPDATE SLOT" : "ADD SLOT +")}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       </View>
//     </Modal>

//       <Modal
//         visible={addSubjectModalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setAddSubjectModalVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.addSubjectBackdrop}
//           activeOpacity={1}
//           onPress={() => setAddSubjectModalVisible(false)}
//         >
//           <TouchableOpacity
//             style={styles.addSubjectCard}
//             activeOpacity={1}
//             onPress={(e) => e.stopPropagation()}
//           >
//             <View style={styles.addSubjectHeader}>
//               <Text style={styles.addSubjectTitle}>Add Subject</Text>
//               <TouchableOpacity onPress={() => setAddSubjectModalVisible(false)}>
//                 <Text style={styles.addSubjectClose}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.addSubjectMeta}>
//               <Text style={styles.addSubjectMetaLabel}>Course: </Text>
//               {courseName}
//             </Text>
//             <Text style={styles.addSubjectMeta}>
//               <Text style={styles.addSubjectMetaLabel}>Batch: </Text>
//               {batchName}
//             </Text>

//             {subjectModalStep === "select" ? (
//               <>
//                 <View style={styles.selectDropdownBox}>
//                   <Picker
//                     selectedValue={tempSubjectSelection}
//                     onValueChange={(val) => setTempSubjectSelection(val)}
//                   >
//                     <Picker.Item label="Select subject" value="" />
//                     {combinedSubjectOptions.map((subject) => (
//                       <Picker.Item
//                         key={`modal-subject-${subject.value}`}
//                         label={subject.label}
//                         value={subject.value}
//                       />
//                     ))}
//                   </Picker>
//                 </View>

//                 <ScrollView style={styles.subjectList} nestedScrollEnabled>
//                   {combinedSubjectOptions.map((subject) => {
//                     const isActive = tempSubjectSelection === subject.value;
//                     return (
//                       <TouchableOpacity
//                         key={`modal-option-${subject.value}`}
//                         style={styles.subjectOptionRow}
//                         onPress={() => setTempSubjectSelection(subject.value)}
//                       >
//                         <View style={[styles.subjectCheckbox, isActive && styles.subjectCheckboxActive]}>
//                           {isActive && <Text style={styles.subjectCheckboxTick}>✓</Text>}
//                         </View>
//                         <Text style={styles.subjectOptionLabel}>{subject.label}</Text>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </ScrollView>

//                 <TouchableOpacity style={styles.createLinkRow} onPress={() => setSubjectModalStep("create")}>
//                   <Text style={styles.createLinkIcon}>＋</Text>
//                   <Text style={styles.createLinkText}>Create New Subject</Text>
//                 </TouchableOpacity>

//                 <View style={styles.addSubjectFooter}>
//                   <TouchableOpacity
//                     style={styles.addSubjectCancel}
//                     onPress={() => setAddSubjectModalVisible(false)}
//                   >
//                     <Text style={styles.addSubjectCancelText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.addSubjectSubmit,
//                       !tempSubjectSelection && styles.addSubjectSubmitDisabled,
//                     ]}
//                     disabled={!tempSubjectSelection}
//                     onPress={() => {
//                       if (tempSubjectSelection) {
//                         setSelectedSubject(tempSubjectSelection);
//                         setAddSubjectModalVisible(false);
//                       }
//                     }}
//                   >
//                     <Text style={styles.addSubjectSubmitText}>Submit</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             ) : (
//               <>
//                 <View style={styles.addSubjectInputRow}>
//                   <TextInput
//                     style={styles.addSubjectTextInput}
//                     placeholder="Enter new subject name"
//                     value={newSubjectName}
//                     onChangeText={setNewSubjectName}
//                     placeholderTextColor="#9CA3AF"
//                   />
//                   <TouchableOpacity style={styles.addSubjectAddBtn} onPress={handleAddPendingSubject}>
//                     <Text style={styles.addSubjectAddText}>＋ ADD</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {pendingSubjects.length > 0 ? (
//                   <View style={styles.pendingList}>
//                     {pendingSubjects.map((name) => (
//                       <View key={name} style={styles.pendingItem}>
//                         <View style={styles.pendingHeader}>
//                           <Text style={styles.pendingTitle}>{name}</Text>
//                           <TouchableOpacity onPress={() => handleRemovePendingSubject(name)}>
//                             <Text style={styles.pendingRemove}>✕</Text>
//                           </TouchableOpacity>
//                         </View>
//                         <View style={styles.pendingTimeRow}>
//                           <TextInput style={styles.pendingTimeInput} placeholder="Start time" editable={false} />
//                           <TextInput style={styles.pendingTimeInput} placeholder="End time" editable={false} />
//                         </View>
//                       </View>
//                     ))}
//                   </View>
//                 ) : (
//                   <Text style={styles.addSubjectEmpty}>Subjects you add will appear here.</Text>
//                 )}

//                 <View style={styles.addSubjectFooter}>
//                   <TouchableOpacity
//                     style={styles.addSubjectCancel}
//                     onPress={() => {
//                       setSubjectModalStep("select");
//                       setPendingSubjects([]);
//                       setNewSubjectName("");
//                     }}
//                   >
//                     <Text style={styles.addSubjectCancelText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.addSubjectSubmit,
//                       pendingSubjects.length === 0 && styles.addSubjectSubmitDisabled,
//                     ]}
//                     disabled={pendingSubjects.length === 0}
//                     onPress={handleSubmitNewSubjects}
//                   >
//                     <Text style={styles.addSubjectSubmitText}>Submit</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>
//     </>
//   );
// };

// export default SlotFormModal;

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.35)",
//     justifyContent: "center",  // ✅ Center me show hoga
//     alignItems: "center",
//   },
//   modalContentWrapper: {
//     flex: 1,
//     width: "85%",
//     maxHeight: "50%",
//     backgroundColor: "#FFF",
//     borderRadius: 20,
//     overflow: "hidden",
//   },
//   modalContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginTop: 12,
//     marginBottom: 4,
//   },
//   dropdownBox: {
//     flex: 1,
    
//     height: 45,             
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     borderRadius: 10,
//     overflow: "hidden",
//     justifyContent: "center"
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   plusBtn: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     borderWidth: 2,
//     borderColor: "#0B4DA2",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   plusText: {
//     color: "#0B4DA2",
//     fontSize: 22,
//     fontWeight: "700",
//   },
//   repeatRow: {
//     marginTop: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   repeatLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   daysRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 8,
//   },
//   dayCircle: {
//     width: 34,
//     height: 34,
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   dayText: {
//     color: "#444",
//     fontWeight: "600",
//   },
//   daySummaryBox: {
//     marginTop: 12,
//     padding: 12,
//     backgroundColor: "#F3F4F6",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   daySummaryText: {
//     fontSize: 14,
//     color: "#111827",
//     lineHeight: 20,
//   },
//   footerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: "#FFF",
//     borderTopWidth: 1,
//     borderTopColor: "#E5E7EB",
//   },
//   cancelBtn: {
//     flex: 1,
//     marginRight: 10,
//     padding: 14,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     alignItems: "center",
//   },
//   cancelText: { fontSize: 15, fontWeight: "600", color: "#111" },
//   saveBtn: {
//     flex: 1,
//     marginLeft: 10,
//     padding: 14,
//     borderRadius: 8,
//     backgroundColor: COLORS.primary,
//     alignItems: "center",
//   },
//   saveBtnText: {
//     color: "#FFF",
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   saveBtnDisabled: {
//     opacity: 0.6,
//   },
//   addSubjectBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   addSubjectCard: {
//     width: "100%",
//     maxWidth: 420,
//     backgroundColor: "#FFF",
//     borderRadius: 16,
//     padding: 20,
//   },
//   addSubjectHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   addSubjectTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//   },
//   addSubjectClose: {
//     fontSize: 18,
//     color: "#6B7280",
//   },
//   addSubjectMeta: {
//     fontSize: 14,
//     color: "#4B5563",
//     marginBottom: 4,
//   },
//   addSubjectMetaLabel: {
//     fontWeight: "600",
//     color: "#111827",
//   },
//   selectDropdownBox: {
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     borderRadius: 10,
//     overflow: "hidden",
//     marginTop: 16,
//   },
//   subjectList: {
//     maxHeight: 220,
//     marginTop: 12,
//   },
//   subjectOptionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   subjectCheckbox: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   subjectCheckboxActive: {
//     borderColor: COLORS.primary,
//     backgroundColor: "rgba(107,87,242,0.15)",
//   },
//   subjectCheckboxTick: {
//     color: COLORS.primary,
//     fontSize: 12,
//     fontWeight: "700",
//   },
//   subjectOptionLabel: {
//     color: "#111827",
//     fontSize: 14,
//   },
//   createLinkRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 16,
//   },
//   createLinkIcon: {
//     color: COLORS.primary,
//     fontSize: 18,
//     marginRight: 6,
//   },
//   createLinkText: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
//   addSubjectInputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     marginTop: 16,
//   },
//   addSubjectTextInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     fontSize: 15,
//     color: "#111827",
//   },
//   addSubjectAddBtn: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#16A34A",
//     backgroundColor: "rgba(34,197,94,0.1)",
//   },
//   addSubjectAddText: {
//     color: "#16A34A",
//     fontWeight: "700",
//   },
//   pendingList: {
//     marginTop: 16,
//   },
//   pendingItem: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//   },
//   pendingHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   pendingTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   pendingRemove: {
//     color: "#9CA3AF",
//     fontSize: 16,
//   },
//   pendingTimeRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginTop: 10,
//   },
//   pendingTimeInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     color: "#9CA3AF",
//   },
//   addSubjectEmpty: {
//     textAlign: "center",
//     color: "#9CA3AF",
//     marginVertical: 24,
//   },
//   addSubjectFooter: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 12,
//     marginTop: 12,
//   },
//   addSubjectCancel: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//   },
//   addSubjectCancelText: {
//     color: "#6B7280",
//     fontWeight: "600",
//   },
//   addSubjectSubmit: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     backgroundColor: COLORS.primary,
//   },
//   addSubjectSubmitDisabled: {
//     backgroundColor: "#CBD5F5",
//   },
//   addSubjectSubmitText: {
//     color: "#FFF",
//     fontWeight: "700",
//   },
//   // Cascading dropdown styles
//   dropdownContent: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     height: "100%",
//   },
//   dropdownText: {
//     fontSize: 14,
//     color: "#111827",
//     flex: 1,
//   },
//   dropdownPlaceholder: {
//     color: "#9CA3AF",
//   },
//   dropdownArrow: {
//     color: "#9CA3AF",
//     fontSize: 12,
//     marginLeft: 8,
//   },
//   dropdownBoxDisabled: {
//     opacity: 0.5,
//   },
//   cascadingDropdown: {
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#C9D4F1",
//     marginTop: 8,
//     marginBottom: 8,
//     maxHeight: 250,
//     overflow: "hidden",
//     width: "85%",
//   },
//   cascadingDropdownTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#111827",
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   cascadingDropdownList: {
//     maxHeight: 200,
//   },
//   cascadingDropdownItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   cascadingDropdownItemSelected: {
//     backgroundColor: "rgba(107,87,242,0.05)",
//   },
//   cascadingDropdownItemText: {
//     fontSize: 14,
//     color: "#111827",
//     flex: 1,
//   },
//   cascadingDropdownItemTextSelected: {
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
//   cascadingDropdownCheck: {
//     color: COLORS.primary,
//     fontSize: 16,
//     fontWeight: "700",
//     marginLeft: 8,
//   },
// });


import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TextInput,
} from "react-native";
import { useUpdateCourseMutation } from "../../../../apis/hooks/courses/mutation/useUpdateCourse.mutation";
import { useUpdateBatchMutation } from "../../../../apis/hooks/batch/mutation/useUpdateBatch.mutation";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { useTeachersListQuery } from "../../../../apis/hooks/teachers/query/useTeachersList.query";
import { useGetClassroomListQuery } from "../../../../apis/hooks/teachers/query/useGetClassroomList.query";
import { useCourseDetailsQuery } from "../../../../apis/hooks/course/query/useCourseDetails.query";
import { useCreateTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useCreateTimeTable.mutation";
import { useUpdateTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useUpdateTimeTable.mutation";
import { useDeleteTimeTableMutation } from "../../../../apis/hooks/timetable/mutations/useDeleteTimeTable.mutation";
import { useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../../../../apis/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { COLORS } from "../../../../colors";
import { TTimetableCell } from "./TimetableGrid";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../../types/navigator/screen-navigator";

type SlotFormModalProps = {
  visible: boolean;
  selectedCell: TTimetableCell | null;
  editingSlot?: any | null; // Slot data when editing
  onClose: () => void;
  onNavigateToClassrooms?: () => void;
  selectedBatch?: string;
  selectedBatchId?: string;
  batchData?: any;
  onSuccess?: () => void; // Callback after successful creation
  weekStart?: Date; // Week start date for refetch
  selectedOrganization?: any; // Organization for refetch params
  timeTableData?: any; // Timetable data for conflict validation
};

const PURPLE = "#6B57F2";
const DAY_KEYS = ["M", "T", "W", "Th", "F", "Sa", "Su"];

// Convert time string to minutes
const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// Convert minutes to time string
const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

// Generate start times: operating hours ke andar 15 min intervals
const generateStartTimes = (opening: string, closing: string) => {
  const startMin = timeToMinutes(opening);
  const endMin = timeToMinutes(closing);
  const times: string[] = [];

  for (let minutes = startMin; minutes <= endMin; minutes += 15) {
    times.push(minutesToTime(minutes));
  }
  return times;
};

// Generate end times = start + 15 min increments, lekin closing time se zyada nahi
const generateEndTimes = (start: string, closing: string) => {
  const startMin = timeToMinutes(start);
  const closingMin = timeToMinutes(closing);
  const endTimes: string[] = [];

  for (let minutes = startMin + 15; minutes <= closingMin; minutes += 15) {
    endTimes.push(minutesToTime(minutes));
  }
  return endTimes;
};

// Check if two time slots overlap
const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);
  
  // Two slots overlap if: start1 < end2 AND end1 > start2
  return start1Min < end2Min && end1Min > start2Min;
};

const SlotFormModal = ({
  visible,
  selectedCell,
  editingSlot,
  onClose,
  onNavigateToClassrooms,
  selectedBatch = "Batch",
  selectedBatchId = "",
  batchData,
  onSuccess,
  weekStart,
  selectedOrganization: propSelectedOrganization,
  timeTableData,
}: SlotFormModalProps) => {
  console.log("📋 === SLOT FORM MODAL RENDERED ===");
  console.log("📋 visible:", visible);
  console.log("📋 editingSlot prop:", editingSlot);
  console.log("📋 selectedCell:", selectedCell);
  
  const navigation = useNavigation<TScreenNavigator>();
  
  // ⭐ TEACHER LIST API
  const { data: teacherData } = useTeachersListQuery();

  // ⭐ CLASSROOM LIST API
  const { data: classroomData } = useGetClassroomListQuery();

  // ⭐ Selected batch info + courseId
  const selectedBatchInfo = useMemo(() => {
    if (batchData?.statusCode === 200 && Array.isArray(batchData.data) && selectedBatchId) {
      return batchData.data.find((b: any) => b.batchId === selectedBatchId) || null;
    }
    return null;
  }, [batchData, selectedBatchId]);

  const courseId = selectedBatchInfo?.courses?.[0]?.courseId || "";

  // ⭐ COURSE DETAIL API (subjects ke liye)
  const { data: courseDetailData } = useCourseDetailsQuery({
    courseId: courseId || "",
  });

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [customSubjects, setCustomSubjects] = useState<{ value: string; label: string }[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repeat, setRepeat] = useState(true);

  // ⭐ Cascading dropdown states
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
  const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);
  const [startTimeDropdownOpen, setStartTimeDropdownOpen] = useState(false);
  const [endTimeDropdownOpen, setEndTimeDropdownOpen] = useState(false);

  // ⭐ TEACHER OPTIONS for Picker
  const teacherOptions = useMemo(() => {
    if (teacherData?.statuscode === 200 && Array.isArray(teacherData.data)) {
      return teacherData.data.map((t: any) => ({
        value: t.teacherId,
        label: `${t.teacherFirstName} ${t.teacherLastName || ""}`.trim(),
      }));
    }
    return [];
  }, [teacherData]);

  // ⭐ CLASSROOM OPTIONS for Picker
  const classroomOptions = useMemo(() => {
    if (classroomData?.statusCode === 200 && classroomData.data?.classRooms) {
      return classroomData.data.classRooms.map((room: any) => ({
        value: room.classRoomId,
        label: room.classRoomName,
      }));
    }
    return [];
  }, [classroomData]);

  // ⭐ SUBJECT OPTIONS from Course Detail API
  const subjectOptions = useMemo(() => {
    if (courseDetailData?.data?.subjects && Array.isArray(courseDetailData.data.subjects)) {
      return courseDetailData.data.subjects.map((s: any) => ({
        value: s.subjectId,
        label: s.subjectName,
      }));
    }
    return [];
  }, [courseDetailData]);

  const courseName = courseDetailData?.data?.courseName || selectedBatchInfo?.courses?.[0]?.courseName || "Course";
  const batchName = selectedBatchInfo?.batchName || selectedBatch || "Batch";

  const combinedSubjectOptions = useMemo(
    () => [...subjectOptions, ...customSubjects],
    [subjectOptions, customSubjects]
  );

  // ⭐ OPERATING HOURS
  const DEFAULT_HOURS = { openingTime: "09:00", closingTime: "18:00" };
  const operatingHours = useMemo(() => {
    const opening =
      classroomData?.data?.openingTime ??
      classroomData?.data?.operatingHours?.openingTime ??
      DEFAULT_HOURS.openingTime;
    const closing =
      classroomData?.data?.closingTime ??
      classroomData?.data?.operatingHours?.closingTime ??
      DEFAULT_HOURS.closingTime;
    return { openingTime: opening, closingTime: closing };
  }, [classroomData]);

  // ⭐ START TIMES (operating hours ke andar 15 min intervals)
  const startTimes = useMemo(
    () => generateStartTimes(operatingHours.openingTime, operatingHours.closingTime),
    [operatingHours]
  );

  // ⭐ END TIMES (start time se 15 min increments, closing time se zyada nahi)
  const endTimes = useMemo(() => {
    if (!startTime) return [];
    return generateEndTimes(startTime, operatingHours.closingTime);
  }, [startTime, operatingHours.closingTime]);

  // ⭐ Reset endTime when startTime changes (but not in edit mode when initializing)
  useEffect(() => {
    if (startTime && !editingSlot) {
      setEndTime("");
    }
  }, [startTime, editingSlot]);

  // ⭐ Cascading dropdown logic (dropdowns always close, but next opens only in normal mode)
  useEffect(() => {
    if (selectedSubject) {
      setSubjectDropdownOpen(false);
      if (!editingSlot) {
        setTeacherDropdownOpen(true);
      }
    }
  }, [selectedSubject, editingSlot]);

  useEffect(() => {
    if (selectedTeacher) {
      setTeacherDropdownOpen(false);
      if (!editingSlot) {
        setRoomDropdownOpen(true);
      }
    }
  }, [selectedTeacher, editingSlot]);

  useEffect(() => {
    if (selectedRoom) {
      setRoomDropdownOpen(false);
      if (!editingSlot) {
        setStartTimeDropdownOpen(true);
      }
    }
  }, [selectedRoom, editingSlot]);

  useEffect(() => {
    if (startTime) {
      setStartTimeDropdownOpen(false);
      if (!editingSlot) {
        setEndTimeDropdownOpen(true);
      }
    }
  }, [startTime, editingSlot]);

  useEffect(() => {
    if (endTime) {
      setEndTimeDropdownOpen(false);
    }
  }, [endTime]);

  const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2]); // M T W default

  // ⭐ Check if in edit mode (declare early so it can be used in useEffect)
  const isEditMode = !!editingSlot;

  // ⭐ Prefill form when editingSlot exists
  useEffect(() => {
    console.log("📝 === SLOT FORM MODAL EFFECT ===");
    console.log("📝 visible:", visible);
    console.log("📝 editingSlot:", editingSlot ? JSON.stringify(editingSlot, null, 2) : "null");
    console.log("📝 isEditMode:", isEditMode);
    
    if (editingSlot && visible) {
      console.log("📝 Prefilling form with editingSlot");
      console.log("📝 Subject ID:", editingSlot.subjectId);
      console.log("📝 Teacher ID:", editingSlot.teacherId);
      console.log("📝 Room ID:", editingSlot.classRoomId);
      console.log("📝 Start Time:", editingSlot.startTime);
      console.log("📝 End Time:", editingSlot.endTime);
      console.log("📝 Day:", editingSlot.day);
      
      // Set values immediately - Picker will update when options are available
      setSelectedSubject(editingSlot.subjectId || "");
      setSelectedTeacher(editingSlot.teacherId || "");
      setSelectedRoom(editingSlot.classRoomId || "");
      setStartTime(editingSlot.startTime || "");
      setEndTime(editingSlot.endTime || "");
      setRepeat(true); // Single day for edit mode
      
      // Set active day based on editingSlot.day
      if (editingSlot.day) {
        const dayDate = editingSlot.day instanceof Date ? editingSlot.day : new Date(editingSlot.day);
        const dayOfWeek = dayDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        // Convert to our day index (0 = Monday)
        const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        console.log("📝 Day of week:", dayOfWeek, "Adjusted index:", adjustedIndex);
        setActiveDays([adjustedIndex]);
      }
      
      console.log("✅ Form values set:", {
        subject: editingSlot.subjectId,
        teacher: editingSlot.teacherId,
        room: editingSlot.classRoomId,
        startTime: editingSlot.startTime,
        endTime: editingSlot.endTime,
      });
    } else if (!editingSlot && visible) {
      console.log("📝 Resetting form for new slot");
      // Reset form when opening for new slot
      setSelectedSubject("");
      setSelectedTeacher("");
      setSelectedRoom("");
      setStartTime("");
      setEndTime("");
      setRepeat(true);
      setActiveDays([]);
    }
  }, [editingSlot, visible, isEditMode]);

  // ⭐ Log state values when they change (for debugging)
  useEffect(() => {
    if (visible && isEditMode) {
      console.log("📊 Current form state:", {
        selectedSubject,
        selectedTeacher,
        selectedRoom,
        startTime,
        endTime,
        activeDays,
        subjectOptionsCount: subjectOptions.length,
        teacherOptionsCount: teacherOptions.length,
        classroomOptionsCount: classroomOptions.length,
      });
    }
  }, [visible, isEditMode, selectedSubject, selectedTeacher, selectedRoom, startTime, endTime, activeDays, subjectOptions.length, teacherOptions.length, classroomOptions.length]);

  const toggleDay = (index: number) => {
    // In edit mode, only one day can be selected at a time
    if (isEditMode) {
      // If clicking the same day, deselect it (optional - or keep it selected)
      // If clicking a different day, replace the selection
      setActiveDays([index]);
    } else {
      // Normal mode: allow multiple days selection
      setActiveDays((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    }
  };

  // Format selected days for display
  const formatSelectedDays = () => {
    if (activeDays.length === 0) return "";
    
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const selectedDayNames = activeDays
      .sort((a, b) => a - b) // Sort by index to maintain order
      .map((index) => dayNames[index]);
    
    return `Occurs weekly on ${selectedDayNames.join(", ")}`;
  };

  const handleRoomPlusPress = () => {
    onClose();
    requestAnimationFrame(() => {
      onNavigateToClassrooms?.();
    });
  };

  // ⭐ REDUX: Organization data (use prop if provided, else from Redux)
  const reduxOrganization = useSelector((state: RootState) => state.auth.selectedOrganization);
  const selectedOrganization = propSelectedOrganization || reduxOrganization;

  // ⭐ MUTATION: Create, Update and Delete TimeTable
  const createMutation = useCreateTimeTableMutation();
  const updateMutation = useUpdateTimeTableMutation();
  const deleteMutation = useDeleteTimeTableMutation();
  const queryClient = useQueryClient();
  const updateCourseMutation = useUpdateCourseMutation();
  const updateBatchMutation = useUpdateBatchMutation();

  // ⭐ HELPER: Handle success response (refetch and close modal)
  const handleSuccessResponse = (response: any, isEdit: boolean) => {
    console.log(`✅ TimeTable ${isEdit ? "updated" : "created"} successfully:`, response);
    
    // Check for error responses (404, etc.)
    if (response?.status === 404 || response?.data?.statusCode === 404) {
      console.error("❌ 404 Error: Resource not found");
      Alert.alert("Error", response?.data?.message || "API endpoint not found (404). Please check the backend service.");
      return;
    }
    
    // Check if response is empty string (backend returns "" but saves data like web)
    const isEmptyResponse = typeof response === "string" && response === "";
    const hasNoData = !response?.data && !response?.statusCode;
    
    if (isEmptyResponse) {
      console.log("ℹ️ Backend returned empty string (like web), but data should be saved");
    } else if (hasNoData && !isEmptyResponse) {
      console.warn("⚠️ WARNING: Backend returned invalid response!");
      Alert.alert(
        "Warning",
        "Slot operation may have failed. Please check if the slot appears in the timetable. If not, please try again or contact support.",
        [{ text: "OK", style: "default" }]
      );
    }
    
    // Invalidate ALL timetable queries (with any params) to refresh grid
    queryClient.invalidateQueries({
      predicate: (query) => {
        return query.queryKey[0] === "timeTable";
      },
    });
    
    // If weekStart is provided, refetch with exact params
    if (weekStart && selectedOrganization && selectedBatchId) {
      const startWeekDate = weekStart.toISOString().split('T')[0];
      const endDate = new Date(weekStart);
      endDate.setDate(weekStart.getDate() + 6);
      const endWeekDate = endDate.toISOString().split('T')[0];
      
      const refetchParams = {
        customerId: selectedOrganization.customerId,
        organizationId: selectedOrganization.organizationId,
        batchId: selectedBatchId,
        startWeekDate: startWeekDate,
        endWeekDate: endWeekDate,
      };
      
      console.log("🔄 Refetching with params:", refetchParams);
      
      setTimeout(() => {
        console.log("🔄 Executing refetch now...");
        queryClient.refetchQueries({
          queryKey: ["timeTable", refetchParams],
        }).then(() => {
          console.log("✅ Refetch completed");
        }).catch((err) => {
          console.error("❌ Refetch error:", err);
        });
      }, 2000);
    } else {
      setTimeout(() => {
        queryClient.refetchQueries({
          predicate: (query) => {
            return query.queryKey[0] === "timeTable";
          },
        });
      }, 2000);
    }
    
    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess();
    }
    // Close modal
    onClose();
    // Reset form
    setSelectedSubject("");
    setSelectedTeacher("");
    setSelectedRoom("");
    setStartTime("");
    setEndTime("");
    setActiveDays([]);
  };

  // ⭐ HELPER: Handle error response
  const handleErrorResponse = (error: any, isEdit: boolean) => {
    console.error(`❌ Error ${isEdit ? "updating" : "creating"} TimeTable:`, error);
    console.error("❌ Error details:", JSON.stringify(error, null, 2));
    console.error("❌ API URL that failed:", isEdit ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE);
    
    const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEdit ? "update" : "create"} slot. Please try again.`;
    const is404 = error?.response?.status === 404 || 
                 error?.response?.data?.statusCode === 404 || 
                 error?.message?.includes("404") || 
                 error?.message?.includes("not found") ||
                 error?.message?.includes("Not Found");
    
    if (is404) {
      Alert.alert(
        "Error",
        "API endpoint not found (404). Please check the backend service or contact support.",
        [{ text: "OK", style: "default" }]
      );
    } else {
      Alert.alert("Error", errorMessage, [{ text: "OK", style: "default" }]);
    }
  };

  // ⭐ HANDLE ADD/UPDATE SLOT
  const handleAddSlot = () => {
    const action = isEditMode ? "UPDATE" : "ADD";
    console.log(`🔵 === ${action} SLOT CLICKED ===`);
    console.log("Form Values:", {
      selectedSubject,
      selectedTeacher,
      selectedRoom,
      startTime,
      endTime,
      selectedBatchId,
      repeat,
      activeDays,
      selectedCell: selectedCell ? "exists" : "null",
      editingSlot: editingSlot ? "exists" : "null",
    });

    // Validation
    if (!selectedSubject) {
      console.log("❌ Validation failed: Subject not selected");
      Alert.alert("Error", "Please select a subject");
      return;
    }
    if (!selectedTeacher) {
      console.log("❌ Validation failed: Teacher not selected");
      Alert.alert("Error", "Please select a teacher");
      return;
    }
    if (!selectedRoom) {
      console.log("❌ Validation failed: Room not selected");
      Alert.alert("Error", "Please select a room");
      return;
    }
    if (!startTime) {
      console.log("❌ Validation failed: Start time not selected");
      Alert.alert("Error", "Please select start time");
      return;
    }
    if (!endTime) {
      console.log("❌ Validation failed: End time not selected");
      Alert.alert("Error", "Please select end time");
      return;
    }
    if (!selectedBatchId) {
      console.log("❌ Validation failed: Batch ID not found");
      Alert.alert("Error", "Batch not selected");
      return;
    }
    if (repeat && activeDays.length === 0) {
      console.log("❌ Validation failed: No days selected");
      Alert.alert("Error", "Please select at least one day");
      return;
    }
    if (!repeat && !selectedCell) {
      console.log("❌ Validation failed: No cell selected and repeat is off");
      Alert.alert("Error", "Please select a cell or enable repeat");
      return;
    }

    console.log("✅ All validations passed");

    // ⭐ CONFLICT VALIDATION: Check for time conflicts with existing slots
    const repeatDaysData = timeTableData?.data?.repeatDays || {};
    const conflicts: string[] = [];
    const dayNames: { [key: string]: string } = {
      "M": "Monday",
      "T": "Tuesday",
      "W": "Wednesday",
      "Th": "Thursday",
      "F": "Friday",
      "Sa": "Saturday",
      "Su": "Sunday"
    };

    // Build daysToUse first to check conflicts
    let daysToUse: string[] = [];
    if (repeat) {
      if (weekStart) {
        daysToUse = activeDays.map((dayIndex) => {
          const dayDate = new Date(weekStart);
          dayDate.setDate(weekStart.getDate() + dayIndex);
          const dayOfWeek = dayDate.getDay();
          const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
          return dayKeys[dayOfWeek];
        });
      } else {
        daysToUse = activeDays.map((dayIndex) => DAY_KEYS[dayIndex]);
      }
    } else if (isEditMode && editingSlot?.day) {
      const dayOfWeek = editingSlot.day.getDay();
      const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
      daysToUse = [dayKeys[dayOfWeek]];
    } else if (selectedCell) {
      const dayOfWeek = selectedCell.day.getDay();
      const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
      daysToUse = [dayKeys[dayOfWeek]];
    }

    // Check conflicts for each selected day
    for (const dayKey of daysToUse) {
      const daySlots = repeatDaysData[dayKey] || [];
      const dayName = dayNames[dayKey] || dayKey;

      for (const existingSlot of daySlots) {
        // Skip the current slot if we're editing (to avoid self-conflict)
        if (isEditMode && editingSlot && (existingSlot.id === editingSlot.id || existingSlot.slotId === editingSlot.id)) {
          continue;
        }

        // Check if times overlap
        if (isTimeOverlap(startTime, endTime, existingSlot.startTime, existingSlot.endTime)) {
          // Check if same teacher
          if (existingSlot.teacherId === selectedTeacher) {
            conflicts.push(`${dayName}: Teacher already has a slot from ${existingSlot.startTime} to ${existingSlot.endTime}`);
          }
          // Check if same classroom
          else if (existingSlot.classRoomId === selectedRoom) {
            conflicts.push(`${dayName}: Classroom already booked from ${existingSlot.startTime} to ${existingSlot.endTime}`);
          }
        }
      }
    }

    // If conflicts found, show error and return
    if (conflicts.length > 0) {
      const conflictMessage = `⛔ Time Conflict Detected:\n\n${conflicts.map((c, i) => `${i + 1}. ${c}`).join("\n")}`;
      console.log("❌ Conflict detected:", conflictMessage);
      Alert.alert("Time Conflict", conflictMessage);
      return;
    }

    // Build slot object
    const slotObject = {
      subjectId: selectedSubject,
      teacherId: selectedTeacher,
      classRoomId: selectedRoom,
      startTime: startTime,
      endTime: endTime,
    };

    // Build repeatDays payload (daysToUse already calculated above in conflict validation)
    // Final validation: ensure we have at least one day
    if (daysToUse.length === 0) {
      Alert.alert("Error", "Please select at least one day");
      return;
    }

    // ⭐ CHECK IF DAY HAS CHANGED (for edit mode)
    let dayChanged = false;
    let originalDayKey = "";
    
    if (isEditMode && editingSlot?.day) {
      // Get original day key from editingSlot
      const originalDayDate = editingSlot.day instanceof Date ? editingSlot.day : new Date(editingSlot.day);
      const originalDayOfWeek = originalDayDate.getDay();
      const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
      originalDayKey = dayKeys[originalDayOfWeek];
      
      // Check if new day is different from original day
      // For single day edit, daysToUse should have only one day
      if (daysToUse.length === 1 && daysToUse[0] !== originalDayKey) {
        dayChanged = true;
        console.log("🔄 Day changed detected!");
        console.log("🔄 Original day:", originalDayKey);
        console.log("🔄 New day:", daysToUse[0]);
      }
    }

    let payload: any;

    // For UPDATE: Use flat structure like web (simple object with repeatDays array)
    if (isEditMode && editingSlot) {
      // Clean the ID - remove any extra quotes or whitespace
      let slotId = (editingSlot.id || editingSlot.slotId || "").toString();
      // Remove quotes from start and end only (not from middle)
      slotId = slotId.replace(/^["']+|["']+$/g, "").trim();
      
      console.log("✏️ Edit mode - Slot ID:", slotId);
      console.log("✏️ Original ID from editingSlot:", editingSlot.id);
      
      if (!slotId) {
        Alert.alert("Error", "Slot ID is missing. Cannot update slot.");
        return;
      }

      // Convert day keys to day indices (like web: [0, 1, 2] for M, T, W)
      // Web uses: 0=Monday, 1=Tuesday, etc.
      const dayKeyToIndex: Record<string, number> = {
        "M": 0,
        "T": 1,
        "W": 2,
        "Th": 3,
        "F": 4,
        "Sa": 5,
        "Su": 6,
      };
      const repeatDaysArray = daysToUse
        .map(dayKey => dayKeyToIndex[dayKey])
        .filter(idx => idx !== undefined);

      // Build flat payload like web version
      payload = {
        customerId: selectedOrganization?.customerId,
        organizationId: selectedOrganization?.organizationId,
        batchId: selectedBatchId,
        id: slotId,
        subjectId: selectedSubject,
        teacherId: selectedTeacher,
        classRoomId: selectedRoom,
        startTime: startTime,
        endTime: endTime,
        repeatDays: repeatDaysArray, // Array of day indices, not nested object
        startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
        endDate: weekStart ? (() => {
          const end = new Date(weekStart);
          end.setDate(weekStart.getDate() + 6);
          return end.toISOString().split('T')[0];
        })() : "",
      };
      
      console.log("✏️ Update payload (flat structure like web):", JSON.stringify(payload, null, 2));
    } else {
      // For CREATE: Use FLAT structure like web (not nested)
      // Convert day keys to day indices (0=Monday, 1=Tuesday, etc.)
      const dayKeyToIndex: Record<string, number> = {
        "M": 0,
        "T": 1,
        "W": 2,
        "Th": 3,
        "F": 4,
        "Sa": 5,
        "Su": 6,
      };
      const repeatDaysArray = daysToUse
        .map(dayKey => dayKeyToIndex[dayKey])
        .filter(idx => idx !== undefined);

      // Build flat payload like web version
      payload = {
        customerId: selectedOrganization?.customerId,
        organizationId: selectedOrganization?.organizationId,
        batchId: selectedBatchId,
        subjectId: selectedSubject,
        teacherId: selectedTeacher,
        classRoomId: selectedRoom,
        startTime: startTime,
        endTime: endTime,
        repeatDays: repeatDaysArray, // Array of day indices, not nested object
        startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
        endDate: weekStart ? (() => {
          const end = new Date(weekStart);
          end.setDate(weekStart.getDate() + 6);
          return end.toISOString().split('T')[0];
        })() : "",
      };
      
      console.log("📦 CREATE payload (flat structure like web):", JSON.stringify(payload, null, 2));
    }

    console.log(`📦 Final Payload (${isEditMode ? "UPDATE" : "CREATE"}):`, JSON.stringify(payload, null, 2));
    console.log("📦 Organization:", {
      customerId: selectedOrganization?.customerId,
      organizationId: selectedOrganization?.organizationId,
    });

    // ⭐ HANDLE DAY CHANGE: If day changed, delete old slot first, then create new one
    if (dayChanged && isEditMode && editingSlot) {
      console.log("🔄 Day changed - Deleting old slot and creating new one...");
      
      // Clean the ID
      let slotId = (editingSlot.id || editingSlot.slotId || "").toString();
      slotId = slotId.replace(/^["']+|["']+$/g, "").trim();
      
      // Build delete payload
      const deletePayload = {
        customerId: selectedOrganization?.customerId,
        organizationId: selectedOrganization?.organizationId,
        batchId: selectedBatchId,
        startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
        endDate: weekStart ? (() => {
          const end = new Date(weekStart);
          end.setDate(weekStart.getDate() + 6);
          return end.toISOString().split('T')[0];
        })() : "",
        id: slotId,
        dayKey: originalDayKey,
        startTime: editingSlot.startTime || startTime,
        endTime: editingSlot.endTime || endTime,
      };
      
      console.log("🗑️ Delete payload (old day):", JSON.stringify(deletePayload, null, 2));
      
      // First delete from old day
      deleteMutation.mutate(deletePayload, {
        onSuccess: (deleteResponse) => {
          console.log("✅ Old slot deleted successfully:", deleteResponse);
          
          // Now create new slot in new day
          console.log("➕ Creating new slot in new day...");
          createMutation.mutate(payload, {
            onSuccess: (createResponse) => {
              console.log("✅ New slot created successfully:", createResponse);
              handleSuccessResponse(createResponse, false);
            },
            onError: (createError) => {
              console.error("❌ Error creating new slot:", createError);
              handleErrorResponse(createError, false);
            },
          });
        },
        onError: (deleteError: any) => {
          console.error("❌ Error deleting old slot:", deleteError);
          const errorMessage = deleteError?.response?.data?.message || deleteError?.message || "Failed to delete old slot. Please try again.";
          Alert.alert("Error", errorMessage);
        },
      });
      
      return; // Exit early, don't proceed with normal update
    }

    // Call API (normal update or create)
    const mutation = isEditMode ? updateMutation : createMutation;
    console.log(`🚀 Calling ${isEditMode ? "updateMutation" : "createMutation"}.mutate...`);
    mutation.mutate(payload, {
      onSuccess: (response) => {
        console.log(`✅ TimeTable ${isEditMode ? "updated" : "created"} successfully:`, response);
        console.log("📝 Response type:", typeof response);
        console.log("📝 Response stringified:", JSON.stringify(response));
        console.log("📝 Response data:", response?.data);
        console.log("📝 Response statusCode:", response?.statusCode);
        console.log("📝 Response message:", response?.message);
        
        // Check for error responses (404, etc.) - If axios returns error as response
        if (response?.status === 404 || response?.data?.statusCode === 404) {
          console.error("❌ 404 Error: Resource not found (caught in onSuccess)");
          // Throw error so it goes to onError handler for proper handling
          throw new Error(response?.data?.message || "API endpoint not found (404). Please check the backend service.");
        }
        
        // Check if response is empty string (backend returns "" but saves data like web)
        const isEmptyResponse = typeof response === "string" && response === "";
        const hasNoData = !response?.data && !response?.statusCode;
        
        if (isEmptyResponse) {
          console.log("ℹ️ Backend returned empty string (like web), but data should be saved");
          // Don't show warning - web me bhi same response aata hai and it works
          // Proceed with refetch - data should be saved
        } else if (hasNoData && !isEmptyResponse) {
          console.warn("⚠️ WARNING: Backend returned invalid response!");
          console.warn("⚠️ This might indicate the data was not saved properly.");
          
          // Show warning to user only if response is not empty string
          Alert.alert(
            "Warning",
            "Slot creation may have failed. Please check if the slot appears in the timetable. If not, please try again or contact support.",
            [
              {
                text: "OK",
                style: "default",
              },
            ]
          );
        }
        
        // Invalidate ALL timetable queries (with any params) to refresh grid
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey[0] === "timeTable";
          },
        });
        
        // If weekStart is provided, refetch with exact params
        if (weekStart && selectedOrganization && selectedBatchId) {
          const startWeekDate = weekStart.toISOString().split('T')[0];
          const endDate = new Date(weekStart);
          endDate.setDate(weekStart.getDate() + 6);
          const endWeekDate = endDate.toISOString().split('T')[0];
          
          const refetchParams = {
            customerId: selectedOrganization.customerId,
            organizationId: selectedOrganization.organizationId,
            batchId: selectedBatchId,
            startWeekDate: startWeekDate,
            endWeekDate: endWeekDate,
          };
          
          console.log("🔄 Refetching with params:", refetchParams);
          
          // Longer delay to ensure backend has fully processed and committed
          setTimeout(() => {
            console.log("🔄 Executing refetch now...");
            queryClient.refetchQueries({
              queryKey: ["timeTable", refetchParams],
            }).then(() => {
              console.log("✅ Refetch completed");
            }).catch((err) => {
              console.error("❌ Refetch error:", err);
            });
          }, 2000); // Increased to 2 seconds
        } else {
          // Fallback: refetch all timeTable queries
          setTimeout(() => {
            queryClient.refetchQueries({
              predicate: (query) => {
                return query.queryKey[0] === "timeTable";
              },
            });
          }, 2000);
        }
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
        // Close modal
        onClose();
        // Reset form
        setSelectedSubject("");
        setSelectedTeacher("");
        setSelectedRoom("");
        setStartTime("");
        setEndTime("");
        setActiveDays([]);
      },
      onError: (error: any) => {
        console.error(`❌ Error ${isEditMode ? "updating" : "creating"} TimeTable:`, error);
        console.error("❌ Error details:", JSON.stringify(error, null, 2));
        console.error("❌ Error type:", typeof error);
        console.error("❌ Error message:", error?.message);
        console.error("❌ Error response:", error?.response);
        console.error("❌ Error status:", error?.response?.status);
        console.error("❌ Error statusCode:", error?.response?.data?.statusCode);
        console.error("❌ Error response message:", error?.response?.data?.message);
        console.error("❌ API URL that failed:", isEditMode ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE);
        
        // Get error message from different possible locations
        const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEditMode ? "update" : "create"} slot. Please try again.`;
        const is404 = error?.response?.status === 404 || 
                     error?.response?.data?.statusCode === 404 || 
                     error?.message?.includes("404") || 
                     error?.message?.includes("not found") ||
                     error?.message?.includes("Not Found");
        
        // Check for 404 specifically
        if (is404) {
          const apiUrl = isEditMode ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE;
          Alert.alert(
            "404 - Resource Not Found",
            `The API endpoint was not found. Please check:\n\n1. API URL: ${apiUrl}\n2. Payload structure\n3. Backend service status\n\nError: ${errorMessage}`
          );
        } else {
          Alert.alert(
            "Error",
            errorMessage
          );
        }
      },
    });
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.backdrop}>
          <View style={styles.modalContentWrapper}>
            <ScrollView
              style={styles.modalContainer}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
          {/* Title */}
          <Text style={styles.title}>
            {isEditMode ? "Update Slot" : `Add New Slot for ${selectedBatch}`}
          </Text>

          {/* SUBJECT */}
          <Text style={styles.label}>Subject</Text>
          <View style={styles.row}>
            <TouchableOpacity 
              style={styles.dropdownBox}
              onPress={() => {
                setSubjectDropdownOpen(!subjectDropdownOpen);
                if (subjectDropdownOpen) {
                  setTeacherDropdownOpen(false);
                  setRoomDropdownOpen(false);
                  setStartTimeDropdownOpen(false);
                  setEndTimeDropdownOpen(false);
                }
              }}
            >
              <View style={styles.dropdownContent}>
                <Text style={[styles.dropdownText, !selectedSubject && styles.dropdownPlaceholder]}>
                  {selectedSubject 
                    ? combinedSubjectOptions.find((s: { value: string; label: string }) => s.value === selectedSubject)?.label 
                    : "Select subject"}
                </Text>
                <Text style={styles.dropdownArrow}>{subjectDropdownOpen ? "▲" : "▼"}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.plusBtn}
              onPress={() => {
                if (courseId) {
                  onClose(); // Close slot form modal first
                  navigation.navigate("CourseDetails", { courseId, autoOpenEdit: true });
                } else {
                  Alert.alert("Error", "Course ID not found. Please select a batch first.");
                }
              }}
            >
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Subject Dropdown List */}
          {subjectDropdownOpen && (
            <View style={styles.cascadingDropdown}>
              <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
                {combinedSubjectOptions.length > 0 ? (
                  combinedSubjectOptions.map((subject: { value: string; label: string }) => {
                    const isSelected = selectedSubject === subject.value;
                    return (
                      <TouchableOpacity
                        key={subject.value}
                        style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
                        onPress={() => {
                          setSelectedSubject(subject.value);
                        }}
                      >
                        <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
                          {subject.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={styles.cascadingDropdownItem}>
                    <Text style={styles.cascadingDropdownItemText}>Data not found</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}

          {/* TEACHER */}
          <Text style={styles.label}>Teacher</Text>
          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.dropdownBox, !selectedSubject && styles.dropdownBoxDisabled]}
              onPress={() => {
                if (selectedSubject) {
                  setTeacherDropdownOpen(!teacherDropdownOpen);
                  if (teacherDropdownOpen) {
                    setRoomDropdownOpen(false);
                    setStartTimeDropdownOpen(false);
                    setEndTimeDropdownOpen(false);
                  }
                }
              }}
              disabled={!selectedSubject}
            >
              <View style={styles.dropdownContent}>
                <Text style={[styles.dropdownText, (!selectedTeacher || !selectedSubject) && styles.dropdownPlaceholder]}>
                  {selectedTeacher 
                    ? teacherOptions.find((t: { value: string; label: string }) => t.value === selectedTeacher)?.label 
                    : "Select teacher"}
                </Text>
                <Text style={[styles.dropdownArrow, !selectedSubject && { opacity: 0.5 }]}>
                  {teacherDropdownOpen ? "▲" : "▼"}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.plusBtn}
              onPress={() => {
                onClose(); // Close slot form modal first
                (navigation as any).navigate("AddEmployeeScreen");
              }}
            >
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Teacher Dropdown List */}
          {teacherDropdownOpen && selectedSubject && (
            <View style={styles.cascadingDropdown}>
              <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
                {teacherOptions.length > 0 ? (
                  teacherOptions.map((teacher: { value: string; label: string }) => {
                    const isSelected = selectedTeacher === teacher.value;
                    return (
                      <TouchableOpacity
                        key={teacher.value}
                        style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
                        onPress={() => {
                          setSelectedTeacher(teacher.value);
                        }}
                      >
                        <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
                          {teacher.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={styles.cascadingDropdownItem}>
                    <Text style={styles.cascadingDropdownItemText}>Data not found</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}

          {/* ROOM */}
          <Text style={styles.label}>Room</Text>
          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.dropdownBox, !selectedTeacher && styles.dropdownBoxDisabled]}
              onPress={() => {
                if (selectedTeacher) {
                  setRoomDropdownOpen(!roomDropdownOpen);
                  if (roomDropdownOpen) {
                    setStartTimeDropdownOpen(false);
                    setEndTimeDropdownOpen(false);
                  }
                }
              }}
              disabled={!selectedTeacher}
            >
              <View style={styles.dropdownContent}>
                <Text style={[styles.dropdownText, (!selectedRoom || !selectedTeacher) && styles.dropdownPlaceholder]}>
                  {selectedRoom 
                    ? classroomOptions.find((r: { value: string; label: string }) => r.value === selectedRoom)?.label 
                    : "Select room"}
                </Text>
                <Text style={[styles.dropdownArrow, !selectedTeacher && { opacity: 0.5 }]}>
                  {roomDropdownOpen ? "▲" : "▼"}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.plusBtn} onPress={handleRoomPlusPress}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Room Dropdown List */}
          {roomDropdownOpen && selectedTeacher && (
            <View style={styles.cascadingDropdown}>
              <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
                {classroomOptions.length > 0 ? (
                  classroomOptions.map((room: { value: string; label: string }) => {
                    const isSelected = selectedRoom === room.value;
                    return (
                      <TouchableOpacity
                        key={room.value}
                        style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
                        onPress={() => {
                          setSelectedRoom(room.value);
                        }}
                      >
                        <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
                          {room.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={styles.cascadingDropdownItem}>
                    <Text style={styles.cascadingDropdownItemText}>Data not found</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}

          {/* START TIME */}
          <Text style={styles.label}>Start Time</Text> 
          <View style={styles.row}>       
          <TouchableOpacity
            style={[styles.dropdownBox, !selectedRoom && styles.dropdownBoxDisabled]}
            onPress={() => {
              if (selectedRoom) {
                setStartTimeDropdownOpen(!startTimeDropdownOpen);
                if (startTimeDropdownOpen) {
                  setEndTimeDropdownOpen(false);
                }
              }
            }}
            disabled={!selectedRoom}
          >
            <View style={styles.dropdownContent}>
              <Text style={[styles.dropdownText, (!startTime || !selectedRoom) && styles.dropdownPlaceholder]}>
                {startTime || "Select start time"}
              </Text>
              <Text style={[styles.dropdownArrow, !selectedRoom && { opacity: 0.5 }]}>
                {startTimeDropdownOpen ? "▲" : "▼"}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ width: 38, height: 38 }} />
          </View>
          {/* Start Time Dropdown List */}
          {startTimeDropdownOpen && selectedRoom && (
            <View style={styles.cascadingDropdown}>
              <Text style={styles.cascadingDropdownTitle}>Select start time</Text>
              <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
                {startTimes.map((time: string) => {
                  const isSelected = startTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
                      onPress={() => {
                        setStartTime(time);
                      }}
                    >
                      <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* END TIME */}
          <Text style={styles.label}>End Time</Text>
          <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.dropdownBox, !startTime && styles.dropdownBoxDisabled]}
            onPress={() => {
              if (startTime) {
                setEndTimeDropdownOpen(!endTimeDropdownOpen);
              }
            }}
            disabled={!startTime}
          >
            <View style={styles.dropdownContent}>
              <Text style={[styles.dropdownText, (!endTime || !startTime) && styles.dropdownPlaceholder]}>
                {endTime || "Select end time"}
              </Text>
              <Text style={[styles.dropdownArrow, !startTime && { opacity: 0.5 }]}>
                {endTimeDropdownOpen ? "▲" : "▼"}
              </Text>
            </View>
          </TouchableOpacity>
            {/* Invisible spacer to match Teacher field width */}
          <View style={{ width: 38, height: 38 }} />
          </View>

          {/* End Time Dropdown List */}
          {endTimeDropdownOpen && startTime && (
            <View style={styles.cascadingDropdown}>
              <Text style={styles.cascadingDropdownTitle}>Select end time</Text>
              <ScrollView style={styles.cascadingDropdownList} nestedScrollEnabled>
                {endTimes.map((time: string) => {
                  const isSelected = endTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[styles.cascadingDropdownItem, isSelected && styles.cascadingDropdownItemSelected]}
                      onPress={() => {
                        setEndTime(time);
                      }}
                    >
                      <Text style={[styles.cascadingDropdownItemText, isSelected && styles.cascadingDropdownItemTextSelected]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* REPEAT TOGGLE */}
          <View style={styles.repeatRow}>
            <Text style={styles.repeatLabel}>Schedule Days</Text>
            <Switch
              value={repeat}
              onValueChange={setRepeat}
              thumbColor="#FFF"
              trackColor={{ true: COLORS.primary, false: "#CCC" }}
            />
          </View>

          {/* SELECT DAYS */}
          {/* SELECT DAYS (Visible only when REPEAT = true) */}
{repeat && (
  <>
    <Text style={styles.label}>Select Days</Text>

    <View style={styles.daysRow}>
      {DAY_KEYS.map((d, i) => {
        const isActive = activeDays.includes(i);
        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.dayCircle,
              isActive && { backgroundColor: PURPLE },
            ]}
            onPress={() => toggleDay(i)}
          >
            <Text
              style={[
                styles.dayText,
                isActive && { color: "#FFF", fontWeight: "700" },
              ]}
            >
              {d}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

    {activeDays.length > 0 && (
      <View style={styles.daySummaryBox}>
        <Text style={styles.daySummaryText}>{formatSelectedDays()}</Text>
      </View>
    )}
  </>
)}
        </ScrollView>

        {/* FOOTER BUTTONS */}
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, (isEditMode ? updateMutation : createMutation).isPending && styles.saveBtnDisabled]}
            onPress={() => {
              console.log("🟢 BUTTON CLICKED!");
              handleAddSlot();
            }}
            disabled={(isEditMode ? updateMutation : createMutation).isPending}
          >
            <Text style={styles.saveBtnText}>
              {(isEditMode ? updateMutation : createMutation).isPending 
                ? (isEditMode ? "Updating..." : "Adding...") 
                : (isEditMode ? "UPDATE SLOT" : "ADD SLOT +")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </Modal>
    </>
  );
};

export default SlotFormModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",  // ✅ Center me show hoga
    alignItems: "center",
  },
  modalContentWrapper: {
    flex: 1,
    width: "85%",
    maxHeight: "50%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color:'black'
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  dropdownBox: {
    flex: 1,
    
    height: 45,             
    borderWidth: 1,
    borderColor: "#C9D4F1",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  plusBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "#0B4DA2",
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: "#0B4DA2",
    fontSize: 22,
    fontWeight: "700",
  },
  repeatRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  repeatLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  daysRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#C9D4F1",
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    color: "#444",
    fontWeight: "600",
  },
  daySummaryBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  daySummaryText: {
    fontSize: 14,
    color: "#111827",
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  cancelBtn: {
    flex: 1,
    marginRight: 10,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  cancelText: { fontSize: 15, fontWeight: "600", color: "#111" },
  saveBtn: {
    flex: 1,
    marginLeft: 10,
    padding: 14,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  addSubjectBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  addSubjectCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
  },
  addSubjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addSubjectTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  addSubjectClose: {
    fontSize: 18,
    color: "#6B7280",
  },
  addSubjectMeta: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  addSubjectMetaLabel: {
    fontWeight: "600",
    color: "#111827",
  },
  selectDropdownBox: {
    borderWidth: 1,
    borderColor: "#C9D4F1",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },
  subjectList: {
    maxHeight: 220,
    marginTop: 12,
  },
  subjectOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  subjectCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  subjectCheckboxActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(107,87,242,0.15)",
  },
  subjectCheckboxTick: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  subjectOptionLabel: {
    color: "#111827",
    fontSize: 14,
  },
  createLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  createLinkIcon: {
    color: COLORS.primary,
    fontSize: 18,
    marginRight: 6,
  },
  createLinkText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  addSubjectInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  addSubjectTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },
  addSubjectAddBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#16A34A",
    backgroundColor: "rgba(34,197,94,0.1)",
  },
  addSubjectAddText: {
    color: "#16A34A",
    fontWeight: "700",
  },
  pendingList: {
    marginTop: 16,
  },
  pendingItem: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  pendingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pendingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  pendingRemove: {
    color: "#9CA3AF",
    fontSize: 16,
  },
  pendingTimeRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  pendingTimeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#9CA3AF",
  },
  addSubjectEmpty: {
    textAlign: "center",
    color: "#9CA3AF",
    marginVertical: 24,
  },
  addSubjectFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  addSubjectCancel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  addSubjectCancelText: {
    color: "#6B7280",
    fontWeight: "600",
  },
  addSubjectSubmit: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  addSubjectSubmitDisabled: {
    backgroundColor: "#CBD5F5",
  },
  addSubjectSubmitText: {
    color: "#FFF",
    fontWeight: "700",
  },
  // Cascading dropdown styles
  dropdownContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    height: "100%",
  },
  dropdownText: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
  },
  dropdownPlaceholder: {
    color: "#9CA3AF",
  },
  dropdownArrow: {
    color: "#9CA3AF",
    fontSize: 12,
    marginLeft: 8,
  },
  dropdownBoxDisabled: {
    opacity: 0.5,
  },
  cascadingDropdown: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C9D4F1",
    marginTop: 8,
    marginBottom: 8,
    maxHeight: 250,
    overflow: "hidden",
    width: "85%",
  },
  cascadingDropdownTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cascadingDropdownList: {
    maxHeight: 200,
  },
  cascadingDropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cascadingDropdownItemSelected: {
    backgroundColor: "rgba(107,87,242,0.05)",
  },
  cascadingDropdownItemText: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
  },
  cascadingDropdownItemTextSelected: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  cascadingDropdownCheck: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});