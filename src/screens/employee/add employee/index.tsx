
// import React, { useState } from "react";
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Image,        // ← YEH ADD KARO (Line 3823 ke baad)
//   Alert,
//   Modal,
//   ScrollView,
// } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import { launchImageLibrary } from 'react-native-image-picker';
// import { useNavigation } from "@react-navigation/native";

// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import Button from "../../../@ui/button/Button";
// import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
// import AutoHeightImage from "D:/Projects/Karomanage-mobile-android-app/src/@ui/auto-height-image/AutoHeightImage.tsx";
// import { IMAGES } from "D:/Projects/Karomanage-mobile-android-app/src/images";
// import DateInput from "../../../@ui/date-input/DateInput";
// import { useListAllEmployeesQuery } from "../../../apis/hooks/employee/query/useListAllEmployees.query";
// import { useEffect } from "react";
// // Modal Import
// import AgentSelectionModal from "../../../@ui/agent-selection-modal/AgentSelectionModal";
// import { useGetReferralAgentsQuery } from "../../../apis/hooks/agent-management/query/useGetReferralAgents.query";
// import { useListEmployeeProfileQuery } from "../../../apis/hooks/employee/query/useListEmployeeProfile.query";
// import ControlledSelect from "../../../@ui/controlled-select/ControlledSelect";
// import { COLORS } from "../../../colors";

// const PAYMENT_MODE_OPTIONS = [
//   { label: 'Online', value: 'Online' },
//   { label: 'Cash', value: 'Cash' },
//   { label: 'Other', value: 'Other' },
// ];

// export default function AddEmployeeScreen() {

//   const navigation = useNavigation<THomeStackNavigator>();
//   // REFERRED BY
//   const [showReferralModal, setShowReferralModal] = useState(false);
//   const [openReferralDropdown, setOpenReferralDropdown] = useState(false);
//   const [referredBy, setReferredBy] = useState("");
//   const [referredById, setReferredById] = useState("");
//   // Referral Payment Modal States
//   const [referralModalVisible, setReferralModalVisible] = useState(false);
//   const [selectedAgentForReferral, setSelectedAgentForReferral] = useState<{
//     agentId: string;
//     agentName: string;
//   } | null>(null);
//   const [referralAmount, setReferralAmount] = useState('');
//   const [referralPaymentStatus, setReferralPaymentStatus] = useState('');
//   const [referralPaymentMode, setReferralPaymentMode] = useState('');
//   const [referralAmountError, setReferralAmountError] = useState('');
//   const [dropdownValue, setDropdownValue] = useState({ label: '', value: '' });

//   // API Call - Referral Agents
//   const { data: agentsData, isLoading: isLoadingAgents } = useGetReferralAgentsQuery();
  
//   // Extract agent list from API response (keep objects for ID/name access)
// const referralList = Array.isArray(agentsData?.data) ? agentsData.data : [];

//   // FORM
     
//   const handler = useForm({
//     defaultValues:{
//       first:"",last:"",code:"",phone:"",email:"",
//       dob:"",father:"",fphone:"",address:"",
//       doj:"",skills:""
//     }
//   });
  
//   const { control, handleSubmit, formState:{errors}, setValue } = handler;


// // ✅ API Call - Employee List
// const { data: employeesData, isLoading: isLoadingEmployees } = useListAllEmployeesQuery();

// // ✅ API Call - Employee Profile (for skills and departments)
// const { data: employeeProfileData, isLoading: isLoadingProfile } = useListEmployeeProfileQuery();

// // ✅ Function to generate next employee code
// const generateNextEmployeeCode = () => {
//   // API returns: { data: 16, statuscode: 200, message: "Success" }
//   // data is directly the latest employee number
//   if (!employeesData?.data || typeof employeesData.data !== 'number') {
//     return "RO-1"; // Default if no data
//   }

//   // Get the latest employee number from API
//   const latestNumber = employeesData.data;
  
//   // Generate next code (e.g., 16 -> "RO-17")
//   const nextNumber = latestNumber + 1;
//   return `RO-${nextNumber}`;
// };

// // ✅ Auto-fill employee code when API data loads
// useEffect(() => {
//   if (!isLoadingEmployees && employeesData?.data) {
//     const nextCode = generateNextEmployeeCode();
//     setValue("code", nextCode);
//   }
// }, [employeesData, isLoadingEmployees, setValue]);

// // Dropdowns

//   // Dropdowns
//   const [gender,setGender] = useState<string>();
//   const [genderOpen,setGenderOpen] = useState(false);

//   const [department, setDepartment] = useState<string>("");
//   const [deptInput, setDeptInput] = useState("");
//   const [deptOpen, setDeptOpen] = useState(false);

//   // Employee Skill Dropdown
// const [skillOpen, setSkillOpen] = useState(false);

// // Skill list - API se extract karo
// const skillList: string[] = employeeProfileData?.data?.skill || [];

//   // Department list - API se extract karo
//   const departmentList: string[] = employeeProfileData?.data?.department || [];

//   const [expYear,setExpYear] = useState<string>();
//   const [expOpen,setExpOpen] = useState(false);

//   const [aadharImageUri, setAadharImageUri] = useState("");
//   const [panImageUri, setPanImageUri] = useState("");
//   // Aadhar Card Image Handler
// const handleSelectAadharImage = () => {
//   launchImageLibrary(
//     { 
//       mediaType: 'photo', 
//       quality: 0.7,
//       maxWidth: 1024,
//       maxHeight: 1024,
//     }, 
//     (response) => {
//       if (response.assets && response.assets.length > 0) {
//         const asset = response.assets[0];
//         if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
//           Alert.alert('Error', 'File size exceeds 5MB limit');
//           return;
//         }
//         setAadharImageUri(asset.uri || '');
//       }
//     }
//   );
// };

// const handleClearAadharImage = () => {
//   setAadharImageUri('');
// };

// // PAN Card Image Handler
// const handleSelectPanImage = () => {
//   launchImageLibrary(
//     { 
//       mediaType: 'photo', 
//       quality: 0.7,
//       maxWidth: 1024,
//       maxHeight: 1024,
//     }, 
//     (response) => {
//       if (response.assets && response.assets.length > 0) {
//         const asset = response.assets[0];
//         if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
//           Alert.alert('Error', 'File size exceeds 5MB limit');
//           return;
//         }
//         setPanImageUri(asset.uri || '');
//       }
//     }
//   );
// };

// const handleClearPanImage = () => {
//   setPanImageUri('');
// };

//   // Referral Payment Functions
//   const handleReferralAmountChange = (text: string) => {
//     if (referralAmountError) {
//       setReferralAmountError('');
//     }
//     const cleanText = text.replace(/[^0-9.]/g, '');
//     const parts = cleanText.split('.');
//     if (parts.length > 2) return;
//     if (parts[1] && parts[1].length > 2) return;
//     setReferralAmount(cleanText);
//   };

//   const handleReferralSubmit = () => {
//     setReferralAmountError('');
    
//     if (!referralAmount.trim()) {
//       setReferralAmountError('Referral amount is required');
//       return;
//     }
    
//     const amount = parseFloat(referralAmount);
//     if (isNaN(amount) || amount <= 0) {
//       setReferralAmountError('Please enter a valid amount (numbers only)');
//       return;
//     }
    
//     if (!referralPaymentStatus.trim()) {
//       Alert.alert('Error', 'Please select payment status');
//       return;
//     }

//     if (referralPaymentStatus === 'paid' && !referralPaymentMode.trim()) {
//       Alert.alert('Error', 'Please select payment mode');
//       return;
//     }

//     // Set referred by value
//     setReferredBy(selectedAgentForReferral?.agentName || '');
//     setReferredById(selectedAgentForReferral?.agentId || '');
    
//     // Store referral details
//     console.log('Referral details saved:', {
//       agentId: selectedAgentForReferral?.agentId || '',
//       agentName: selectedAgentForReferral?.agentName || '',
//       referredAmount: amount,
//       paymentStatus: referralPaymentStatus,
//       paymentMode: referralPaymentMode,
//     });
    
//     // Reset and close
//     setReferralAmount('');
//     setReferralPaymentStatus('');
//     setReferralPaymentMode('');
//     setReferralAmountError('');
//     setSelectedAgentForReferral(null);
//     setReferralModalVisible(false);
//     setOpenReferralDropdown(false);
//   };

//   const onSubmit = (d:any)=>{
//     const final = {
//       ...d,
//       gender,
//       experience:expYear,
//       referredBy,
//       referredById,
//       referralAmount: parseFloat(referralAmount) || 0,
//       referralPaymentStatus: referralPaymentStatus || '',
//       referralPaymentMode: referralPaymentMode || '',
//       department,
//       aadharImageUri: aadharImageUri,  // ← Line 3985 me add karo
//   panImageUri: panImageUri,  
//     };
//     navigation.navigate("HighestQualification",{employeeData:final});
//   };


//   return (
//     <SafeView>
//       <AppHeader title="Personal Information" showDrawer={false}/>

//       <View style={styles.page}>
//         <View style={styles.card}>
          
//           <ScalableText style={styles.title} fontFamily="Bold">Personal Information</ScalableText>
//           <ScalableText style={styles.sub} fontFamily="Regular">Step 1 of 1 • Enter Information</ScalableText>

//           <ThemeScrollView contentContainerStyle={styles.scroll}>


//             {/* ================== FIELDS ================== */}
//             <Field label="First Name*" name="first" required control={control} errors={errors}
//               rules={{required:"Required",pattern:{value:/^[A-Za-z ]+$/,message:"Only alphabets"}}}/>
//             <Field label="Last Name" name="last" control={control} errors={errors}
//               rules={{pattern:{value:/^[A-Za-z ]+$/,message:"Only alphabets"}}}/>
//             <Field label="Employee Code*" name="code" required control={control} errors={errors}
//               rules={{required:"Required"}}/>
//             <Field label="Phone Number*" name="phone" required keyboard="numeric" control={control} errors={errors}
//               rules={{required:"Required",pattern:{value:/^[0-9]{10}$/,message:"10 digits required"}}}/>
//             <Field label="Email*" name="email" required keyboard="email-address" control={control} errors={errors}
//               rules={{required:"Required"}}/>
//             {/* Date of Birth */}
//             <Text style={styles.label}>Date of Birth*</Text>
// <View style={styles.drop}>
//   <DateInput
//     handler={handler} 
//     name="dob"
//     label="Enter date of birth"
//     inputRoot={{ 
//       width: undefined,
//       borderWidth: 0, 
//       paddingLeft: -3,
//       paddingRight: 12,
//       elevation: 0,
//       backgroundColor: 'transparent',
//       height: 44
//       // ← color: '#777' grey karne ke liye
//     }}
//     maximumDate={new Date(2010, 11, 31)} // 2010 tak limit
//     minimumDate={new Date(1950, 0, 1)} // 1950 se start
//     inputTextStyles={{ fontSize: 13, color: '#777' }}  // ← color: '#777' grey karne ke liye
//   />
// </View>
//             <Field label="Father Name" name="father" control={control} errors={errors}
//               rules={{pattern:{value:/^[A-Za-z ]+$/,message:"Only alphabets"}}}/>
//             <Field label="Father Phone Number" name="fphone" keyboard="numeric" control={control} errors={errors}
//               rules={{pattern:{value:/^[0-9]{10}$/,message:"10 digits"}}}/>
//             <Field label="Address" name="address" control={control} errors={errors}
//               rules={{minLength:{value:3,message:"Min 3 Character"}}}/>
//             {/* DEPARTMENT FIELD */}
// <Text style={styles.label}>Department</Text>

// <View style={styles.deptBox}>
//   <TextInput
//     value={department}
//     onChangeText={setDepartment}
//     placeholder="Department"
//     style={styles.deptInput}
//   />

//   <TouchableOpacity
//     onPress={() => setDeptOpen(!deptOpen)}
//     style={styles.deptIconWrap}
//   >
//     <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//   </TouchableOpacity>
// </View>

// {deptOpen && (
//   <View style={styles.list}>
//     {isLoadingProfile ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>Loading departments...</Text>
//       </View>
//     ) : departmentList.length === 0 ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>No departments found</Text>
//       </View>
//     ) : (
//       departmentList.map(d => (
//         <TouchableOpacity
//           key={d}
//           style={styles.option}
//           onPress={() => {
//             setDepartment(d);
//             setDeptOpen(false);
//           }}
//         >
//           <Text>{d}</Text>
//         </TouchableOpacity>
//       ))
//     )}
//   </View>
// )}

             


//             {/* EXPERIENCE
//             <Text style={styles.label}>Experience (Years)</Text>
//             <TouchableOpacity style={styles.drop} onPress={()=>setExpOpen(!expOpen)}>
//               <Text>{expYear || "Select experience"}</Text>
//             </TouchableOpacity> */}
//             <Text style={styles.label}>Experience (Years)</Text>
//             <TouchableOpacity
//            style={[styles.drop, {
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//           paddingRight: 10,
//           height:48
//   }]}
//   onPress={() => setExpOpen(!expOpen)}
// >
//   <Text>{expYear || "Select experience"}</Text>

//   {/* ▼ ICON ON RIGHT SIDE */}
//   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
// </TouchableOpacity>
//             {expOpen && (
//               <View style={styles.list}>
//                 {["0–1","1–3","3–5","5–10","10+"].map(v=>(
//                   <TouchableOpacity key={v} style={styles.option} onPress={()=>{setExpYear(v);setExpOpen(false);}}>
//                     <Text>{v}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}

//             {/* OPTIONAL */}
//             {/* Date of Joining */}
//             <Text style={styles.label}>Date of Joining</Text>
// <View style={styles.drop}>
//   <DateInput
//     handler={handler} 
//     name="doj"
//     label="Enter date of joining"
    
//     inputRoot={{ 
//       width: undefined,
      
//       borderWidth: 0, 
//       paddingLeft: -3,
//       paddingRight: 12,
//       elevation: 0,
//       backgroundColor: 'transparent',
//       height: 44
//       // ← color: '#777' grey karne ke liye
//     }}
//     inputTextStyles={{ fontSize: 13, color: '#777' }}  // ← color: '#777' grey karne ke liye
//   />
// </View>
//             {/* <Field label="Employee Skills" name="skills" control={control}/> */}
//             {/* EMPLOYEE SKILL FIELD */}
// <Text style={styles.label}>Employee Skills</Text>

// <View style={styles.deptBox}>
//   {/* Existing Field input logic */}
//   <Controller
//     control={control}
//     name="skills"
//     render={({ field:{ value, onChange }, fieldState:{ error } }) => (
//       <TextInput
//         value={value}
//         onChangeText={onChange}
//         placeholder="Employee Skill"
//         style={[styles.deptInput, error && {borderColor:"red",borderWidth:1}]}
//       />
//     )}
//   />

//   {/* Dropdown icon */}
//   <TouchableOpacity
//     onPress={() => setSkillOpen(!skillOpen)}
//     style={styles.deptIconWrap}
//   >
//     <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//   </TouchableOpacity>
// </View>

// {/* Dropdown list */}
// {skillOpen && (
//   <View style={styles.list}>
//     {isLoadingProfile ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>Loading skills...</Text>
//       </View>
//     ) : skillList.length === 0 ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>No skills found</Text>
//       </View>
//     ) : (
//       skillList.map(s => (
//         <TouchableOpacity
//           key={s}
//           style={styles.option}
//           onPress={() => {
//             setValue("skills", s);  // form me skill set
//             setSkillOpen(false);
//           }}
//         >
//           <Text>{s}</Text>
//         </TouchableOpacity>
//       ))
//     )}
//   </View>
// )}


//             {/* UPLOAD */}
//             {/* Aadhar Card Image */}
// <View style={styles.inputSpacing}>
// <Text style={styles.label}>
//   Aadhaar Card Image
// </Text>
//   <View style={styles.imageButtons}>
//     <TouchableOpacity
//       style={styles.imageButton}
//       onPress={handleSelectAadharImage}
//     >
//       <Text style={styles.imageButtonText}>
//         {aadharImageUri ? 'Change Image' : 'Select Image'}
//       </Text>
//     </TouchableOpacity>
//     {aadharImageUri && (
//       <TouchableOpacity
//         style={[styles.imageButton, { backgroundColor: '#FF3B30' }]}
//         onPress={handleClearAadharImage}
//       >
//         <Text style={styles.imageButtonText}>Remove</Text>
//       </TouchableOpacity>
//     )}
//   </View>
//   {aadharImageUri ? (
//     <Image source={{ uri: aadharImageUri }} style={styles.imagePreview} />
//   ) : null}
// </View>

// {/* PAN Card Image */}
// <View style={styles.inputSpacing}>
// <Text style={styles.label}>
//   PAN Card Image
// </Text>
//   <View style={styles.imageButtons}>
//     <TouchableOpacity
//       style={styles.imageButton}
//       onPress={handleSelectPanImage}
//     >
//       <Text style={styles.imageButtonText}>
//         {panImageUri ? 'Change Image' : 'Select Image'}
//       </Text>
//     </TouchableOpacity>
//     {panImageUri && (
//       <TouchableOpacity
//         style={[styles.imageButton, { backgroundColor: '#FF3B30' }]}
//         onPress={handleClearPanImage}
//       >
//         <Text style={styles.imageButtonText}>Remove</Text>
//       </TouchableOpacity>
//     )}
//   </View>
//   {panImageUri ? (
//     <Image source={{ uri: panImageUri }} style={styles.imagePreview} />
//   ) : null}
// </View>

           
//              <Text style={styles.label}>Gender</Text>
            

//             <TouchableOpacity 
//   style={[styles.drop,{
//     flexDirection:"row",
//     justifyContent:"space-between",
//     alignItems:"center",
//     paddingRight:10,
//     height:48
//   }]}
//   onPress={()=>setGenderOpen(!genderOpen)}
// >
//   <Text>{gender || "Select gender"}</Text>
//   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
// </TouchableOpacity>
//             {genderOpen &&(
//               <View style={styles.list}>
//                 {["Male","Female","Other"].map(g=>(
//                   <TouchableOpacity key={g} style={styles.option} onPress={()=>{setGender(g);setGenderOpen(false);}}>
//                     <Text>{g}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}


//             {/* ================== REFERRED BY 🔥 FINAL ================== */}
//             <Text style={styles.label}>Referred By</Text>

//             <View style={styles.refWrap}>

//               {/* dropdown kholne wala */}
//               <TouchableOpacity 
//                 style={styles.refBox}
//                 onPress={()=>setOpenReferralDropdown(!openReferralDropdown)}
//               >
             
//                 <Text style={{color:"#444"}}>{referredBy || "Select referral..."}</Text>
               
//               </TouchableOpacity>

//               {/* + icon modal open karega */}
//               <TouchableOpacity style={styles.addBtn} onPress={()=>setShowReferralModal(true)}>
//                 <Text style={styles.addTxt}>+</Text>
//               </TouchableOpacity>
//             </View>

//             {/* DROPDOWN APPEAR HERE */}
//             {openReferralDropdown && (
//               <View style={styles.refDropdown}>
//                {referralList.map((agent: any, i: number) => {
//   // Extract agent name from object
//   const agentName = agent?.agentName 
//     ? `${agent.agentName} ${agent.agentLastName || ''}`.trim()
//     : agent?.agentId || 'Unknown';
  
//   return (
//     <TouchableOpacity 
//       key={agent?.agentId || i} 
//       style={styles.refOption} 
//       onPress={() => {
//         // Agent select hote hi payment modal open karo
//         setSelectedAgentForReferral({
//           agentId: agent?.agentId || '',
//           agentName: agentName,
//         });
//         setOpenReferralDropdown(false);
//         setReferralModalVisible(true); // Payment modal open
//       }}>
//       <Text>{agentName}</Text>
//     </TouchableOpacity>
//   );
// })} 
//               </View>
//             )}


//           </ThemeScrollView>
//         </View>


//         <Button title="Next" btnStyles={styles.btn} onPress={handleSubmit(onSubmit)}/>
//       </View>


//       {/* MODAL */}
//       <AgentSelectionModal
//         visible={showReferralModal}
//         onClose={()=>setShowReferralModal(false)}
//         agents={referralList}
//         onAgentSelected={(id,name)=>{
//           setReferredBy(name);
//           setReferredById(id);
//           setShowReferralModal(false);
//         }}
//       />

//       {/* Referral Payment Modal */}
//       <Modal
//         visible={referralModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => {
//           setReferralModalVisible(false);
//           setReferralAmount('');
//           setReferralPaymentStatus('');
//           setReferralPaymentMode('');
//           setReferralAmountError('');
//           setDropdownValue({ label: '', value: '' });
//           setSelectedAgentForReferral(null);
//           setReferredBy('');
//         }}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <ScalableText style={styles.modalTitle} fontFamily="Medium">
//                 Please Select The Payment For The Agents
//               </ScalableText>
//               <TouchableOpacity onPress={() => {
//                 setReferralModalVisible(false);
//                 setReferralAmount('');
//                 setReferralPaymentStatus('');
//                 setReferralPaymentMode('');
//                 setReferralAmountError('');
//                 setDropdownValue({ label: '', value: '' });
//                 setSelectedAgentForReferral(null);
//                 setReferredBy('');
//               }} style={styles.closeButton}>
//                 <Text style={styles.closeButtonText}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.modalBody}>
//               <ScrollView 
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={styles.modalScrollContent}
//               >
//                 <View style={styles.modalField}>
//                   <ScalableText style={styles.modalLabel} fontFamily="Medium">
//                     Agent name
//                   </ScalableText>
//                   <TextInput
//                     style={styles.modalInput}
//                     value={selectedAgentForReferral?.agentName || ''}
//                     editable={false}
//                     placeholder="Agent name"
//                   />
//                 </View>

//                 <View style={styles.modalField}>
//                   <ScalableText style={styles.modalLabel} fontFamily="Medium">
//                     Referred amount *
//                   </ScalableText>
//                   <TextInput
//                     style={[
//                       styles.modalInput,
//                       referralAmountError ? styles.modalInputError : null
//                     ]}
//                     placeholder="Enter referred amount"
//                     keyboardType="numeric"
//                     value={referralAmount}
//                     onChangeText={handleReferralAmountChange}
//                   />
//                   {referralAmountError ? (
//                     <ScalableText style={styles.modalErrorText} fontFamily="Regular">
//                       {referralAmountError}
//                     </ScalableText>
//                   ) : null}
//                 </View>

//                 <View style={styles.modalField}>
//                   <ScalableText style={styles.modalLabel} fontFamily="Medium">
//                     Payment status *
//                   </ScalableText>
//                   <ControlledSelect
//                     handler={handler}
//                     name="referralPaymentStatus"
//                     label="Select payment status"
//                     options={[
//                       { label: 'Paid', value: 'paid' },
//                       { label: 'Due', value: 'due' }
//                     ]}
//                     value={referralPaymentStatus ? 
//                       { label: referralPaymentStatus === 'paid' ? 'Paid' : 'Due', value: referralPaymentStatus } : 
//                       { label: 'Select payment status', value: '' }
//                     }
//                     dropdownButtonStyle={styles.modalDropdown}
//                     onChangeValue={(value) => {
//                       console.log('Payment status changed to:', value);
//                       setReferralPaymentStatus(value);
//                     }}
//                   />
//                 </View>

//                 {/* Payment Mode Field - Only show when status is "Paid" */}
//                 {referralPaymentStatus === 'paid' && (
//                   <View style={styles.modalField}>
//                     <ScalableText style={styles.modalLabel} fontFamily="Medium">
//                       Please select the payment mode *
//                     </ScalableText>
//                     <ControlledSelect
//                       handler={handler}
//                       name="referralPaymentMode"
//                       label="Select payment mode"
//                       options={PAYMENT_MODE_OPTIONS}
//                       value={PAYMENT_MODE_OPTIONS.find(opt => opt.value === referralPaymentMode) || { label: '', value: '' }}
//                       dropdownButtonStyle={styles.modalDropdown}
//                       onChangeValue={(value) => {
//                         console.log('Payment mode changed to:', value);
//                         setReferralPaymentMode(value);
//                       }}
//                     />
//                   </View>
//                 )}
//               </ScrollView>
//             </View>

//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={() => {
//                   setReferralModalVisible(false);
//                   setReferralAmount('');
//                   setReferralPaymentStatus('');
//                   setReferralPaymentMode('');
//                   setReferralAmountError('');
//                   setDropdownValue({ label: '', value: '' });
//                   setSelectedAgentForReferral(null);
//                   setReferredBy('');
//                 }}
//               >
//                 <Text style={styles.modalCancelButtonText}>CANCEL</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalSubmitButton}
//                 onPress={handleReferralSubmit}
//               >
//                 <Text style={styles.modalSubmitButtonText}>SUBMIT</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//     </SafeView>
//   );
// }


// /* FIELD */
// const Field = ({label,name,control,errors,rules={},required,keyboard="default"}:any)=>(
//   <View>
//     <Text style={styles.label}>{label}</Text>
//     <Controller control={control} name={name} rules={rules}
//       render={({field:{value,onChange},fieldState:{error}})=>(
//         <TextInput
//           value={value}
//           onChangeText={onChange}
//           placeholder={label}
//           keyboardType={keyboard}
//           style={[styles.input,error && {borderColor:"red",borderWidth:2}]}
//         />
//       )}/>
//     {errors?.[name] && <Text style={{color:"red",marginBottom:6}}>{errors[name]?.message}</Text>}
//   </View>
// );


// /* STYLES */
// const H=Dimensions.get("window").height;
// const styles=StyleSheet.create({
//   page:{flex:1,alignItems:"center",backgroundColor:"#F5F7FA"},
//   card:{width:"90%",backgroundColor:"#fff",borderRadius:18,elevation:6,padding:18,minHeight:H*0.55,maxHeight:H*0.60,marginTop:8,borderLeftWidth:7,borderLeftColor:"#004C93"},
//   scroll:{paddingBottom:60},
//   title:{fontSize:22,fontWeight:"bold",textAlign:"center"},
//   sub:{fontSize:13,textAlign:"center",color:"#666",marginBottom:15},
//   label:{fontSize:13,fontWeight:"600",marginBottom:6,color:"#000"},
//   input:{height:48,borderWidth:1,borderColor:"#000",borderRadius:10,paddingLeft:10,marginBottom:10,width:"97%"},


//   drop:{height:48,borderWidth:1,borderColor:"#000",borderRadius:10,justifyContent:"center",paddingLeft:12,marginBottom:10,width:"97%"},
//   list:{backgroundColor:"#fff",borderWidth:1,borderColor:"#000",borderRadius:10,marginBottom:14,overflow:"hidden"},
//   option:{padding:12,borderBottomWidth:1,borderBottomColor:"#eee"},

//   upload:{height:44,borderWidth:1,borderColor:"#004C93",borderRadius:10,alignItems:"center",justifyContent:"center",marginBottom:14},

//   refWrap:{flexDirection:"row",alignItems:"center",marginBottom:10},
//   refBox:{flex:1,height:48,borderWidth:1,borderRadius:10,borderColor:"#000",justifyContent:"center",paddingLeft:12},
//   addBtn:{width:44,height:44,borderRadius:22,backgroundColor:"#004C93",justifyContent:"center",alignItems:"center",marginLeft:10},
//   addTxt:{color:"#fff",fontSize:22,fontWeight:"bold"},

//   /* 🔥 dropdown under referral */
//   refDropdown:{backgroundColor:"#fff",borderWidth:1,borderRadius:10,borderColor:"#BFC4CA",marginBottom:16},
//   refOption:{padding:12,borderBottomWidth:1,borderBottomColor:"#eee"},

//   btn:{width:"80%",height:45,backgroundColor:"#004C93",borderRadius:10,marginVertical:18},
//    /* 🔥 department styles insert here */
//    deptBox:{
//     height:48,
//     borderWidth:1,
//     borderColor:"#000",
//     borderRadius:10,
//     flexDirection:"row",
//     alignItems:"center",
//     paddingLeft:10,
//     marginBottom:10,
//      width:"97%"
//   },
//   deptInput:{
//     flex:1,
//     fontSize:14,
//     color:"#000"
//   },
//   deptIconWrap:{
//     paddingHorizontal:12,
//     paddingVertical:6,
//     justifyContent:"center",
//     alignItems:"center"
//   },                   // ← Line 4336 - comma add karo
//   inputSpacing: {      // ← Line 4337 se start karo
//     marginBottom: 15,
//   },
//   imageButtons: {
//     flexDirection: 'row',
//     gap: 10,
//     marginBottom: 10,
//   },
//   imageButton: {
//     backgroundColor: '#004C93',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     flex: 1,
//   },
//   imageButtonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   imagePreview: {
//     width: '100%',
//     height: 200,
//     borderRadius: 8,
//     marginTop: 10,
//     resizeMode: 'contain',
//   },
//   inputContainer: {
//     marginBottom: 10,
//   },
//   dateInputStyle: {
//     height: 44,
//     borderWidth: 1,
//     borderColor: '#BFC4CA',
//     borderRadius: 10,
//     paddingLeft: 10,
//     justifyContent: 'center',
//   },
//   // Modal styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: COLORS.white,
//     borderRadius: 20,
//     padding: 0,
//     width: Dimensions.get('window').width * 0.9,
//     minHeight: 520,
//     maxHeight: Dimensions.get('window').height * 0.9,
//     flexDirection: 'column',
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 24,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   modalTitle: {
//     fontSize: 20,
//     color: COLORS.black,
//     flex: 1,
//     fontFamily: 'Poppins-SemiBold',
//   },
//   closeButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#F8F9FA',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     fontSize: 18,
//     color: '#666',
//   },
//   modalBody: {
//     padding: 24,
//     paddingTop: 20,
//     paddingBottom: 20,
//     flex: 1,
//     justifyContent: 'flex-start',
//     minHeight: 300,
//   },
//   modalScrollContent: {
//     paddingBottom: 20,
//   },
//   modalField: {
//     marginBottom: 24,
//   },
//   modalLabel: {
//     fontSize: 15,
//     color: COLORS.black,
//     marginBottom: 10,
//     fontFamily: 'Poppins-Medium',
//   },
//   modalInput: {
//     height: 52,
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     backgroundColor: '#FAFAFA',
//     paddingHorizontal: 18,
//     fontSize: 15,
//     fontFamily: 'Poppins-Regular',
//     color: COLORS.black,
//   },
//   modalDropdown: {
//     height: 52,
//     borderRadius: 12,
//     backgroundColor: '#FAFAFA',
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     paddingHorizontal: 18,
//     fontSize: 15,
//     fontFamily: 'Poppins-Regular',
//     color: COLORS.black,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 16,
//     padding: 24,
//     paddingTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#F0F0F0',
//     backgroundColor: '#FAFAFA',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   modalCancelButton: {
//     flex: 1,
//     height: 52,
//     borderRadius: 12,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   modalCancelButtonText: {
//     color: '#666',
//     fontSize: 14,
//     fontFamily: 'Poppins-Medium',
//   },
//   modalSubmitButton: {
//     flex: 1,
//     height: 52,
//     borderRadius: 12,
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   modalSubmitButtonText: {
//     color: COLORS.white,
//     fontSize: 14,
//     fontFamily: 'Poppins-Medium',
//   },
//   modalInputError: {
//     borderColor: '#FF3B30',
//     borderWidth: 2,
//     backgroundColor: '#FFF5F5',
//   },
//   modalErrorText: {
//     color: '#FF3B30',
//     fontSize: 13,
//     marginTop: 6,
//     fontFamily: 'Poppins-Regular',
//     marginLeft: 4,
//   },
//                   // ← Last me closing brace
// });


// import React, { useState } from "react";
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Image,        // ← YEH ADD KARO (Line 3823 ke baad)
//   Alert,
//   Modal,
//   ScrollView,
// } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import { launchImageLibrary } from 'react-native-image-picker';
// import { useNavigation } from "@react-navigation/native";

// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import Button from "../../../@ui/button/Button";
// import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
// import AutoHeightImage from "D:/Projects/Karomanage-mobile-android-app/src/@ui/auto-height-image/AutoHeightImage.tsx";
// import { IMAGES } from "D:/Projects/Karomanage-mobile-android-app/src/images";
// import DateInput from "../../../@ui/date-input/DateInput";
// import { useListAllEmployeesQuery } from "../../../apis/hooks/employee/query/useListAllEmployees.query";
// import { useEffect } from "react";
// // Modal Import
// import AgentSelectionModal from "../../../@ui/agent-selection-modal/AgentSelectionModal";
// import { useGetReferralAgentsQuery } from "../../../apis/hooks/agent-management/query/useGetReferralAgents.query";
// import { useListEmployeeProfileQuery } from "../../../apis/hooks/employee/query/useListEmployeeProfile.query";
// import ControlledSelect from "../../../@ui/controlled-select/ControlledSelect";
// import { COLORS } from "../../../colors";

// const PAYMENT_MODE_OPTIONS = [
//   { label: 'Online', value: 'Online' },
//   { label: 'Cash', value: 'Cash' },
//   { label: 'Other', value: 'Other' },
// ];

// export default function AddEmployeeScreen() {

//   const navigation = useNavigation<THomeStackNavigator>();
//   // REFERRED BY
//   const [showReferralModal, setShowReferralModal] = useState(false);
//   const [openReferralDropdown, setOpenReferralDropdown] = useState(false);
//   const [referredBy, setReferredBy] = useState("");
//   const [referredById, setReferredById] = useState("");
//   // Referral Payment Modal States
//   const [referralModalVisible, setReferralModalVisible] = useState(false);
//   const [selectedAgentForReferral, setSelectedAgentForReferral] = useState<{
//     agentId: string;
//     agentName: string;
//   } | null>(null);
//   const [referralAmount, setReferralAmount] = useState('');
//   const [referralPaymentStatus, setReferralPaymentStatus] = useState('');
//   const [referralPaymentMode, setReferralPaymentMode] = useState('');
//   const [referralAmountError, setReferralAmountError] = useState('');
//   const [dropdownValue, setDropdownValue] = useState({ label: '', value: '' });

//   // API Call - Referral Agents
//   const { data: agentsData, isLoading: isLoadingAgents } = useGetReferralAgentsQuery();
  
//   // Extract agent list from API response (keep objects for ID/name access)
// const referralList = Array.isArray(agentsData?.data) ? agentsData.data : [];

//   // FORM
     
//   const handler = useForm({
//     defaultValues:{
//       first:"",last:"",code:"",phone:"",email:"",
//       dob:"",father:"",fphone:"",address:"",
//       doj:"",skills:""
//     }
//   });
  
//   const { control, handleSubmit, formState:{errors}, setValue } = handler;


// // ✅ API Call - Employee List
// const { data: employeesData, isLoading: isLoadingEmployees } = useListAllEmployeesQuery();

// // ✅ API Call - Employee Profile (for skills and departments)
// const { data: employeeProfileData, isLoading: isLoadingProfile } = useListEmployeeProfileQuery();

// // ✅ Function to generate next employee code
// const generateNextEmployeeCode = () => {
//   // API returns: { data: 16, statuscode: 200, message: "Success" }
//   // data is directly the latest employee number
//   if (!employeesData?.data || typeof employeesData.data !== 'number') {
//     return "RO-1"; // Default if no data
//   }

//   // Get the latest employee number from API
//   const latestNumber = employeesData.data;
  
//   // Generate next code (e.g., 16 -> "RO-17")
//   const nextNumber = latestNumber + 1;
//   return `RO-${nextNumber}`;
// };

// // ✅ Auto-fill employee code when API data loads
// useEffect(() => {
//   if (!isLoadingEmployees && employeesData?.data) {
//     const nextCode = generateNextEmployeeCode();
//     setValue("code", nextCode);
//   }
// }, [employeesData, isLoadingEmployees, setValue]);

// // Dropdowns

//   // Dropdowns
//   const [gender,setGender] = useState<string>();
//   const [genderOpen,setGenderOpen] = useState(false);

//   const [department, setDepartment] = useState<string>("");
//   const [deptInput, setDeptInput] = useState("");
//   const [deptOpen, setDeptOpen] = useState(false);

//   // Employee Skill Dropdown
// const [skillOpen, setSkillOpen] = useState(false);

// // Skill list - API se extract karo
// const skillList: string[] = employeeProfileData?.data?.skill || [];

//   // Department list - API se extract karo
//   const departmentList: string[] = employeeProfileData?.data?.department || [];

//   const [expYear,setExpYear] = useState<string>();
//   const [expOpen,setExpOpen] = useState(false);

//   const [aadharImageUri, setAadharImageUri] = useState("");
//   const [panImageUri, setPanImageUri] = useState("");
//   // Aadhar Card Image Handler
// const handleSelectAadharImage = () => {
//   launchImageLibrary(
//     { 
//       mediaType: 'photo', 
//       quality: 0.7,
//       maxWidth: 1024,
//       maxHeight: 1024,
//     }, 
//     (response) => {
//       if (response.assets && response.assets.length > 0) {
//         const asset = response.assets[0];
//         if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
//           Alert.alert('Error', 'File size exceeds 5MB limit');
//           return;
//         }
//         setAadharImageUri(asset.uri || '');
//       }
//     }
//   );
// };

// const handleClearAadharImage = () => {
//   setAadharImageUri('');
// };

// // PAN Card Image Handler
// const handleSelectPanImage = () => {
//   launchImageLibrary(
//     { 
//       mediaType: 'photo', 
//       quality: 0.7,
//       maxWidth: 1024,
//       maxHeight: 1024,
//     }, 
//     (response) => {
//       if (response.assets && response.assets.length > 0) {
//         const asset = response.assets[0];
//         if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
//           Alert.alert('Error', 'File size exceeds 5MB limit');
//           return;
//         }
//         setPanImageUri(asset.uri || '');
//       }
//     }
//   );
// };

// const handleClearPanImage = () => {
//   setPanImageUri('');
// };

//   // Referral Payment Functions
//   const handleReferralAmountChange = (text: string) => {
//     if (referralAmountError) {
//       setReferralAmountError('');
//     }
//     const cleanText = text.replace(/[^0-9.]/g, '');
//     const parts = cleanText.split('.');
//     if (parts.length > 2) return;
//     if (parts[1] && parts[1].length > 2) return;
//     setReferralAmount(cleanText);
//   };

//   const handleReferralSubmit = () => {
//     setReferralAmountError('');
    
//     if (!referralAmount.trim()) {
//       setReferralAmountError('Referral amount is required');
//       return;
//     }
    
//     const amount = parseFloat(referralAmount);
//     if (isNaN(amount) || amount <= 0) {
//       setReferralAmountError('Please enter a valid amount (numbers only)');
//       return;
//     }
    
//     if (!referralPaymentStatus.trim()) {
//       Alert.alert('Error', 'Please select payment status');
//       return;
//     }

//     if (referralPaymentStatus === 'paid' && !referralPaymentMode.trim()) {
//       Alert.alert('Error', 'Please select payment mode');
//       return;
//     }

//     // Set referred by value
//     setReferredBy(selectedAgentForReferral?.agentName || '');
//     setReferredById(selectedAgentForReferral?.agentId || '');
    
//     // Store referral details
//     console.log('Referral details saved:', {
//       agentId: selectedAgentForReferral?.agentId || '',
//       agentName: selectedAgentForReferral?.agentName || '',
//       referredAmount: amount,
//       paymentStatus: referralPaymentStatus,
//       paymentMode: referralPaymentMode,
//     });
    
//     // Reset and close
//     setReferralAmount('');
//     setReferralPaymentStatus('');
//     setReferralPaymentMode('');
//     setReferralAmountError('');
//     setSelectedAgentForReferral(null);
//     setReferralModalVisible(false);
//     setOpenReferralDropdown(false);
//   };

//   const onSubmit = (d:any)=>{
//     const final = {
//       ...d,
//       gender,
//       experience:expYear,
//       referredBy,
//       referredById,
//       referralAmount: parseFloat(referralAmount) || 0,
//       referralPaymentStatus: referralPaymentStatus || '',
//       referralPaymentMode: referralPaymentMode || '',
//       department,
//       aadharImageUri: aadharImageUri,  // ← Line 3985 me add karo
//       panImageUri: panImageUri,  
//     };
//     navigation.navigate("HighestQualification",{employeeData:final});
//   };


//   return (
//     <SafeView>
//       <AppHeader title="Personal Information" showDrawer={false}/>

//       <View style={styles.page}>
//         <View style={styles.card}>
          
//           <ScalableText style={styles.title} fontFamily="Bold">Personal Information</ScalableText>
//           <ScalableText style={styles.sub} fontFamily="Regular">Step 1 of 1 • Enter Information</ScalableText>

//           <ThemeScrollView contentContainerStyle={styles.scroll}>


//             {/* ================== FIELDS ================== */}
//             <Field label="First Name*" name="first" required control={control} errors={errors}
//               rules={{required:"This field is required",pattern:{value:/^[A-Za-z ]+$/,message:"Only alphabets"}}}/>
//             <Field label="Last Name" name="last" control={control} errors={errors}
//               rules={{pattern:{value:/^[A-Za-z ]+$/,message:"Only alphabets"}}}/>
//             <Field label="Employee Code*" name="code" required control={control} errors={errors}
//               rules={{required:"This field is required"}}/>
//             <Field label="Phone Number*" name="phone" required keyboard="numeric" control={control} errors={errors}
//               rules={{required:"This field is required",pattern:{value:/^[0-9]{10}$/,message:"10 digits required"}}}/>
//             <Field label="Email*" name="email" required keyboard="email-address" control={control} errors={errors}
//               rules={{required:"This field is required",pattern:{value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:"Enter valid email"}}}/>
//             {/* Date of Birth */}
//             <Text style={styles.label}>Date of Birth*</Text>
// <View style={styles.drop}>
//   <DateInput
//     handler={handler} 
//     name="dob"
//     label="Enter date of birth"
  
//     inputRoot={{ 
//       width: undefined,
//       borderWidth: 0, 
//       paddingLeft: -3,
//       paddingRight: 12,
//       elevation: 0,
//       backgroundColor: 'transparent',
//       height: 44
//       // ← color: '#777' grey karne ke liye
//     }}
//     maximumDate={new Date(2010, 11, 31)} // 2010 tak limit
//     minimumDate={new Date(1950, 0, 1)} // 1950 se start
//     inputTextStyles={{ fontSize: 13, color: '#777' }}  // ← color: '#777' grey karne ke liye
//   />
// </View>
//             <Field label="Father Name" name="father" control={control} errors={errors}
//               rules={{pattern:{value:/^[A-Za-z ]+$/,message:"Only alphabets"}}}/>
//             <Field label="Father Phone Number" name="fphone" keyboard="numeric" control={control} errors={errors}
//               rules={{pattern:{value:/^[0-9]{10}$/,message:"10 digits"}}}/>
//             <Field label="Address" name="address" control={control} errors={errors}
//               rules={{minLength:{value:3,message:"Min 3 Character"}}}/>
//             {/* DEPARTMENT FIELD */}
// <Text style={styles.label}>Department</Text>

// <View style={styles.deptBox}>
//   <TextInput
//     value={department}
//     onChangeText={setDepartment}
//     placeholder="Department"
//     style={styles.deptInput}
//   />

//   <TouchableOpacity
//     onPress={() => setDeptOpen(!deptOpen)}
//     style={styles.deptIconWrap}
//   >
//     <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//   </TouchableOpacity>
// </View>

// {deptOpen && (
//   <View style={styles.list}>
//     {isLoadingProfile ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>Loading departments...</Text>
//       </View>
//     ) : departmentList.length === 0 ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>No departments found</Text>
//       </View>
//     ) : (
//       departmentList.map(d => (
//         <TouchableOpacity
//           key={d}
//           style={styles.option}
//           onPress={() => {
//             setDepartment(d);
//             setDeptOpen(false);
//           }}
//         >
//           <Text>{d}</Text>
//         </TouchableOpacity>
//       ))
//     )}
//   </View>
// )}

             


//             {/* EXPERIENCE
//             <Text style={styles.label}>Experience (Years)</Text>
//             <TouchableOpacity style={styles.drop} onPress={()=>setExpOpen(!expOpen)}>
//               <Text>{expYear || "Select experience"}</Text>
//             </TouchableOpacity> */}
//             <Text style={styles.label}>Experience (Years)</Text>
//             <TouchableOpacity
//            style={[styles.drop, {
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//           paddingRight: 10,
//           height:48
//   }]}
//   onPress={() => setExpOpen(!expOpen)}
// >
//   <Text>{expYear || "Select experience"}</Text>

//   {/* ▼ ICON ON RIGHT SIDE */}
//   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
// </TouchableOpacity>
//             {expOpen && (
//               <View style={styles.list}>
//                 {["0–1","1–3","3–5","5–10","10+"].map(v=>(
//                   <TouchableOpacity key={v} style={styles.option} onPress={()=>{setExpYear(v);setExpOpen(false);}}>
//                     <Text>{v}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}

//             {/* OPTIONAL */}
//             {/* Date of Joining */}
//             <Text style={styles.label}>Date of Joining</Text>
// <View style={styles.drop}>
//   <DateInput
//     handler={handler} 
//     name="doj"
//     label="Enter date of joining"
    
//     inputRoot={{ 
//       width: undefined,
      
//       borderWidth: 0, 
//       paddingLeft: -3,
//       paddingRight: 12,
//       elevation: 0,
//       backgroundColor: 'transparent',
//       height: 44
//       // ← color: '#777' grey karne ke liye
//     }}
//     inputTextStyles={{ fontSize: 13, color: '#777' }}  // ← color: '#777' grey karne ke liye
//   />
// </View>
//             {/* <Field label="Employee Skills" name="skills" control={control}/> */}
//             {/* EMPLOYEE SKILL FIELD */}
// <Text style={styles.label}>Employee Skills</Text>

// <View style={styles.deptBox}>
//   {/* Existing Field input logic */}
//   <Controller
//     control={control}
//     name="skills"
//     render={({ field:{ value, onChange }, fieldState:{ error } }) => (
//       <TextInput
//         value={value}
//         onChangeText={onChange}
//         placeholder="Employee Skill"
//         style={[styles.deptInput, error && {borderColor:"red",borderWidth:1}]}
//       />
//     )}
//   />

//   {/* Dropdown icon */}
//   <TouchableOpacity
//     onPress={() => setSkillOpen(!skillOpen)}
//     style={styles.deptIconWrap}
//   >
//     <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//   </TouchableOpacity>
// </View>

// {/* Dropdown list */}
// {skillOpen && (
//   <View style={styles.list}>
//     {isLoadingProfile ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>Loading skills...</Text>
//       </View>
//     ) : skillList.length === 0 ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>No skills found</Text>
//       </View>
//     ) : (
//       skillList.map(s => (
//         <TouchableOpacity
//           key={s}
//           style={styles.option}
//           onPress={() => {
//             setValue("skills", s);  // form me skill set
//             setSkillOpen(false);
//           }}
//         >
//           <Text>{s}</Text>
//         </TouchableOpacity>
//       ))
//     )}
//   </View>
// )}


//             {/* UPLOAD */}
//             {/* Aadhar Card Image */}
// <View style={styles.inputSpacing}>
// <Text style={styles.label}>
//   Aadhaar Card Image
// </Text>
//   <View style={styles.imageButtons}>
//     <TouchableOpacity
//       style={styles.imageButton}
//       onPress={handleSelectAadharImage}
//     >
//       <Text style={styles.imageButtonText}>
//         {aadharImageUri ? 'Change Image' : 'Select Image'}
//       </Text>
//     </TouchableOpacity>
//     {aadharImageUri && (
//       <TouchableOpacity
//         style={[styles.imageButton, { backgroundColor: '#FF3B30' }]}
//         onPress={handleClearAadharImage}
//       >
//         <Text style={styles.imageButtonText}>Remove</Text>
//       </TouchableOpacity>
//     )}
//   </View>
//   {aadharImageUri ? (
//     <Image source={{ uri: aadharImageUri }} style={styles.imagePreview} />
//   ) : null}
// </View>

// {/* PAN Card Image */}
// <View style={styles.inputSpacing}>
// <Text style={styles.label}>
//   PAN Card Image
// </Text>
//   <View style={styles.imageButtons}>
//     <TouchableOpacity
//       style={styles.imageButton}
//       onPress={handleSelectPanImage}
//     >
//       <Text style={styles.imageButtonText}>
//         {panImageUri ? 'Change Image' : 'Select Image'}
//       </Text>
//     </TouchableOpacity>
//     {panImageUri && (
//       <TouchableOpacity
//         style={[styles.imageButton, { backgroundColor: '#FF3B30' }]}
//         onPress={handleClearPanImage}
//       >
//         <Text style={styles.imageButtonText}>Remove</Text>
//       </TouchableOpacity>
//     )}
//   </View>
//   {panImageUri ? (
//     <Image source={{ uri: panImageUri }} style={styles.imagePreview} />
//   ) : null}
// </View>

           
//              <Text style={styles.label}>Gender</Text>
            

//             <TouchableOpacity 
//   style={[styles.drop,{
//     flexDirection:"row",
//     justifyContent:"space-between",
//     alignItems:"center",
//     paddingRight:10,
//     height:48
//   }]}
//   onPress={()=>setGenderOpen(!genderOpen)}
// >
//   <Text>{gender || "Select gender"}</Text>
//   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
// </TouchableOpacity>
//             {genderOpen &&(
//               <View style={styles.list}>
//                 {["Male","Female","Other"].map(g=>(
//                   <TouchableOpacity key={g} style={styles.option} onPress={()=>{setGender(g);setGenderOpen(false);}}>
//                     <Text>{g}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}


//             {/* ================== REFERRED BY 🔥 FINAL ================== */}
//             <Text style={styles.label}>Referred By</Text>

//             <View style={styles.refWrap}>

//               {/* dropdown kholne wala */}
//               <TouchableOpacity 
//   style={[styles.refBox, {
//     flexDirection:"row",
//     justifyContent:"space-between",
//     alignItems:"center",
//     paddingRight:12
//   }]}
//   onPress={()=>setOpenReferralDropdown(!openReferralDropdown)}
// >
//   <Text style={{color:"#444"}}>{referredBy || "Select referral"}</Text>
//   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
// </TouchableOpacity>
//               {/* + icon modal open karega */}
//               <TouchableOpacity style={styles.addBtn} onPress={()=>setShowReferralModal(true)}>
//                 <Text style={styles.addTxt}>+</Text>
//               </TouchableOpacity>
//             </View>

//             {/* DROPDOWN APPEAR HERE */}
//             {openReferralDropdown && (
//               <View style={styles.refDropdown}>
//                {referralList.map((agent: any, i: number) => {
//   // Extract agent name from object
//   const agentName = agent?.agentName 
//     ? `${agent.agentName} ${agent.agentLastName || ''}`.trim()
//     : agent?.agentId || 'Unknown';
  
//   return (
//     <TouchableOpacity 
//       key={agent?.agentId || i} 
//       style={styles.refOption} 
//       onPress={() => {
//         // Agent select hote hi payment modal open karo
//         setSelectedAgentForReferral({
//           agentId: agent?.agentId || '',
//           agentName: agentName,
//         });
//         setOpenReferralDropdown(false);
//         setReferralModalVisible(true); // Payment modal open
//       }}>
//       <Text>{agentName}</Text>
//     </TouchableOpacity>
//   );
// })} 
//               </View>
//             )}


//           </ThemeScrollView>
//         </View>


//         <Button title="Next" btnStyles={styles.btn} onPress={handleSubmit(onSubmit)}/>
//       </View>


//       {/* MODAL */}
//       <AgentSelectionModal
//         visible={showReferralModal}
//         onClose={()=>setShowReferralModal(false)}
//         agents={referralList}
//         onAgentSelected={(id,name)=>{
//           setReferredBy(name);
//           setReferredById(id);
//           setShowReferralModal(false);
//         }}
//       />

//       {/* Referral Payment Modal */}
//       <Modal
//         visible={referralModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => {
//           setReferralModalVisible(false);
//           setReferralAmount('');
//           setReferralPaymentStatus('');
//           setReferralPaymentMode('');
//           setReferralAmountError('');
//           setDropdownValue({ label: '', value: '' });
//           setSelectedAgentForReferral(null);
//           setReferredBy('');
//         }}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <ScalableText style={styles.modalTitle} fontFamily="Medium">
//                 Please Select The Payment For The Agents
//               </ScalableText>
//               <TouchableOpacity onPress={() => {
//                 setReferralModalVisible(false);
//                 setReferralAmount('');
//                 setReferralPaymentStatus('');
//                 setReferralPaymentMode('');
//                 setReferralAmountError('');
//                 setDropdownValue({ label: '', value: '' });
//                 setSelectedAgentForReferral(null);
//                 setReferredBy('');
//               }} style={styles.closeButton}>
//                 <Text style={styles.closeButtonText}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.modalBody}>
//               <ScrollView 
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={styles.modalScrollContent}
//               >
//                 <View style={styles.modalField}>
//                   <ScalableText style={styles.modalLabel} fontFamily="Medium">
//                     Agent name
//                   </ScalableText>
//                   <TextInput
//                     style={styles.modalInput}
//                     value={selectedAgentForReferral?.agentName || ''}
//                     editable={false}
//                     placeholder="Agent name"
//                   />
//                 </View>

//                 <View style={styles.modalField}>
//                   <ScalableText style={styles.modalLabel} fontFamily="Medium">
//                     Referred amount *
//                   </ScalableText>
//                   <TextInput
//                     style={[
//                       styles.modalInput,
//                       referralAmountError ? styles.modalInputError : null
//                     ]}
//                     placeholder="Enter referred amount"
//                     keyboardType="numeric"
//                     value={referralAmount}
//                     onChangeText={handleReferralAmountChange}
//                   />
//                   {referralAmountError ? (
//                     <ScalableText style={styles.modalErrorText} fontFamily="Regular">
//                       {referralAmountError}
//                     </ScalableText>
//                   ) : null}
//                 </View>

//                 <View style={styles.modalField}>
//                   <ScalableText style={styles.modalLabel} fontFamily="Medium">
//                     Payment status *
//                   </ScalableText>
//                   <ControlledSelect
//                     handler={handler}
//                     name="referralPaymentStatus"
//                     label="Select payment status"
//                     options={[
//                       { label: 'Paid', value: 'paid' },
//                       { label: 'Due', value: 'due' }
//                     ]}
//                     value={referralPaymentStatus ? 
//                       { label: referralPaymentStatus === 'paid' ? 'Paid' : 'Due', value: referralPaymentStatus } : 
//                       { label: 'Select payment status', value: '' }
//                     }
//                     dropdownButtonStyle={styles.modalDropdown}
//                     onChangeValue={(value) => {
//                       console.log('Payment status changed to:', value);
//                       setReferralPaymentStatus(value);
//                     }}
//                   />
//                 </View>

//                 {/* Payment Mode Field - Only show when status is "Paid" */}
//                 {referralPaymentStatus === 'paid' && (
//                   <View style={styles.modalField}>
//                     <ScalableText style={styles.modalLabel} fontFamily="Medium">
//                       Please select the payment mode *
//                     </ScalableText>
//                     <ControlledSelect
//                       handler={handler}
//                       name="referralPaymentMode"
//                       label="Select payment mode"
//                       options={PAYMENT_MODE_OPTIONS}
//                       value={PAYMENT_MODE_OPTIONS.find(opt => opt.value === referralPaymentMode) || { label: '', value: '' }}
//                       dropdownButtonStyle={styles.modalDropdown}
//                       onChangeValue={(value) => {
//                         console.log('Payment mode changed to:', value);
//                         setReferralPaymentMode(value);
//                       }}
//                     />
//                   </View>
//                 )}
//               </ScrollView>
//             </View>

//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={() => {
//                   setReferralModalVisible(false);
//                   setReferralAmount('');
//                   setReferralPaymentStatus('');
//                   setReferralPaymentMode('');
//                   setReferralAmountError('');
//                   setDropdownValue({ label: '', value: '' });
//                   setSelectedAgentForReferral(null);
//                   setReferredBy('');
//                 }}
//               >
//                 <Text style={styles.modalCancelButtonText}>CANCEL</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalSubmitButton}
//                 onPress={handleReferralSubmit}
//               >
//                 <Text style={styles.modalSubmitButtonText}>SUBMIT</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//     </SafeView>
//   );
// }


// /* FIELD */
// const Field = ({label,name,control,errors,rules={},required,keyboard="default"}:any)=>(
//   <View>
//     <Text style={styles.label}>{label}</Text>
//     <Controller control={control} name={name} rules={rules}
//       render={({field:{value,onChange},fieldState:{error}})=>(
//         <TextInput
//           value={value}
//           onChangeText={onChange}
//           placeholder={label}
//           keyboardType={keyboard}
//           style={[styles.input,error && {borderColor:"red",borderWidth:2}]}
//         />
//       )}/>
//     {errors?.[name] && <Text style={{color:"red",marginBottom:6,fontSize:11 }}>{errors[name]?.message}</Text>}
//   </View>
// );


// /* STYLES */
// const H=Dimensions.get("window").height;
// const styles=StyleSheet.create({
//   page:{flex:1,alignItems:"center",backgroundColor:"#F5F7FA"},
//   card:{width:"90%",backgroundColor:"#fff",borderRadius:18,elevation:6,padding:18,minHeight:H*0.55,maxHeight:H*0.60,marginTop:8,borderLeftWidth:7,borderLeftColor:"#004C93"},
//   scroll:{paddingBottom:60},
//   title:{fontSize:22,fontWeight:"bold",textAlign:"center"},
//   sub:{fontSize:13,textAlign:"center",color:"#666",marginBottom:15},
//   label:{fontSize:13,fontWeight:"600",marginBottom:6,color:"#000"},
//   input:{height:48,borderWidth:1,borderColor:"#000",borderRadius:10,paddingLeft:10,marginBottom:10,width:"97%"},


//   drop:{height:48,borderWidth:1,borderColor:"BFC4CA",borderRadius:10,justifyContent:"center",paddingLeft:12,marginBottom:10,width:"97%"},
//   list:{backgroundColor:"#fff",borderWidth:1,borderColor:"#BFC4CA",borderRadius:10,marginBottom:14,overflow:"hidden"},
//   option:{padding:12,borderBottomWidth:1,borderBottomColor:"#eee"},

//   upload:{height:44,borderWidth:1,borderColor:"#004C93",borderRadius:10,alignItems:"center",justifyContent:"center",marginBottom:14},

//   refWrap:{flexDirection:"row",alignItems:"center",marginBottom:10},
//   refBox:{flex:1,height:48,borderWidth:1,borderRadius:10,borderColor:"#000",justifyContent:"center",paddingLeft:12},
//   addBtn:{width:44,height:44,borderRadius:22,backgroundColor:"#004C93",justifyContent:"center",alignItems:"center",marginLeft:10},
//   addTxt:{color:"#fff",fontSize:22,fontWeight:"bold"},

//   /* 🔥 dropdown under referral */
//   refDropdown:{backgroundColor:"#fff",borderWidth:1,borderRadius:10,borderColor:"#BFC4CA",marginBottom:16},
//   refOption:{padding:12,borderBottomWidth:1,borderBottomColor:"#eee"},

//   btn:{width:"80%",height:45,backgroundColor:"#004C93",borderRadius:10,marginVertical:18},
//    /* 🔥 department styles insert here */
//    deptBox:{
//     height:48,
//     borderWidth:1,
//     borderColor:"#000",
//     borderRadius:10,
//     flexDirection:"row",
//     alignItems:"center",
//     paddingLeft:10,
//     marginBottom:10,
//      width:"97%"
//   },
//   deptInput:{
//     flex:1,
//     fontSize:14,
//     color:"#000"
//   },
//   deptIconWrap:{
//     paddingHorizontal:12,
//     paddingVertical:6,
//     justifyContent:"center",
//     alignItems:"center"
//   },                   // ← Line 4336 - comma add karo
//   inputSpacing: {      // ← Line 4337 se start karo
//     marginBottom: 15,
//   },
//   imageButtons: {
//     flexDirection: 'row',
//     gap: 10,
//     marginBottom: 10,
//   },
//   imageButton: {
//     backgroundColor: '#004C93',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     flex: 1,
//   },
//   imageButtonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   imagePreview: {
//     width: '100%',
//     height: 200,
//     borderRadius: 8,
//     marginTop: 10,
//     resizeMode: 'contain',
//   },
//   inputContainer: {
//     marginBottom: 10,
//   },
//   dateInputStyle: {
//     height: 44,
//     borderWidth: 1,
//     borderColor: '#BFC4CA',
//     borderRadius: 10,
//     paddingLeft: 10,
//     justifyContent: 'center',
//   },
//   // Modal styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: COLORS.white,
//     borderRadius: 20,
//     padding: 0,
//     width: Dimensions.get('window').width * 0.9,
//     minHeight: 520,
//     maxHeight: Dimensions.get('window').height * 0.9,
//     flexDirection: 'column',
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 24,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   modalTitle: {
//     fontSize: 20,
//     color: COLORS.black,
//     flex: 1,
//     fontFamily: 'Poppins-SemiBold',
//   },
//   closeButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#F8F9FA',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     fontSize: 18,
//     color: '#666',
//   },
//   modalBody: {
//     padding: 24,
//     paddingTop: 20,
//     paddingBottom: 20,
//     flex: 1,
//     justifyContent: 'flex-start',
//     minHeight: 300,
//   },
//   modalScrollContent: {
//     paddingBottom: 20,
//   },
//   modalField: {
//     marginBottom: 24,
//   },
//   modalLabel: {
//     fontSize: 15,
//     color: COLORS.black,
//     marginBottom: 10,
//     fontFamily: 'Poppins-Medium',
//   },
//   modalInput: {
//     height: 52,
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     backgroundColor: '#FAFAFA',
//     paddingHorizontal: 18,
//     fontSize: 15,
//     fontFamily: 'Poppins-Regular',
//     color: COLORS.black,
//   },
//   modalDropdown: {
//     height: 52,
//     borderRadius: 12,
//     backgroundColor: '#FAFAFA',
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     paddingHorizontal: 18,
//     fontSize: 15,
//     fontFamily: 'Poppins-Regular',
//     color: COLORS.black,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 16,
//     padding: 24,
//     paddingTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#F0F0F0',
//     backgroundColor: '#FAFAFA',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   modalCancelButton: {
//     flex: 1,
//     height: 52,
//     borderRadius: 12,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   modalCancelButtonText: {
//     color: '#666',
//     fontSize: 14,
//     fontFamily: 'Poppins-Medium',
//   },
//   modalSubmitButton: {
//     flex: 1,
//     height: 52,
//     borderRadius: 12,
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   modalSubmitButtonText: {
//     color: COLORS.white,
//     fontSize: 14,
//     fontFamily: 'Poppins-Medium',
//   },
//   modalInputError: {
//     borderColor: '#FF3B30',
//     borderWidth: 2,
//     backgroundColor: '#FFF5F5',
//   },
//   modalErrorText: {
//     color: '#FF3B30',
//     fontSize: 13,
//     marginTop: 6,
//     fontFamily: 'Poppins-Regular',
//     marginLeft: 4,
//   },
//                   // ← Last me closing brace
// });












// import React, { useState } from "react";
// import { getFirstCharactersOfWords } from '../../../utils/getFirstCharactersOfWords';
// import { store } from '../../../app/store';
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Image,        // ← YEH ADD KARO (Line 3823 ke baad)
//   Alert,
//   Modal,
//   ScrollView,
// } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import { launchImageLibrary } from 'react-native-image-picker';
// import { useNavigation } from "@react-navigation/native";

// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import Button from "../../../@ui/button/Button";
// import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
// import AutoHeightImage from "D:/Projects/Karomanage-mobile-android-app/src/@ui/auto-height-image/AutoHeightImage.tsx";
// import { IMAGES } from "D:/Projects/Karomanage-mobile-android-app/src/images";
// import DateInput from "../../../@ui/date-input/DateInput";
// import { useListAllEmployeesQuery } from "../../../apis/hooks/employee/query/useListAllEmployees.query";
// import { useEffect } from "react";
// // Modal Import
// import AgentSelectionModal from "../../../@ui/agent-selection-modal/AgentSelectionModal";
// import { useGetReferralAgentsQuery } from "../../../apis/hooks/agent-management/query/useGetReferralAgents.query";
// import { useListEmployeeProfileQuery } from "../../../apis/hooks/employee/query/useListEmployeeProfile.query";
// import ControlledSelect from "../../../@ui/controlled-select/ControlledSelect";
// import { COLORS } from "../../../colors";

// const PAYMENT_MODE_OPTIONS = [
//   { label: 'Online', value: 'Online' },
//   { label: 'Cash', value: 'Cash' },
//   { label: 'Other', value: 'Other' },
// ];

// export default function AddEmployeeScreen() {

//   const navigation = useNavigation<THomeStackNavigator>();
//   // REFERRED BY
//   const [showReferralModal, setShowReferralModal] = useState(false);
//   const [openReferralDropdown, setOpenReferralDropdown] = useState(false);
//   const [referredBy, setReferredBy] = useState("");
//   const [referredById, setReferredById] = useState("");
//   // Referral Payment Modal States
//   const [referralModalVisible, setReferralModalVisible] = useState(false);
//   const [selectedAgentForReferral, setSelectedAgentForReferral] = useState<{
//     agentId: string;
//     agentName: string;
//   } | null>(null);
//   const [referralAmount, setReferralAmount] = useState('');
//   const [referralPaymentStatus, setReferralPaymentStatus] = useState('');
//   const [referralPaymentMode, setReferralPaymentMode] = useState('');
//   const [referralAmountError, setReferralAmountError] = useState('');
//   const [dropdownValue, setDropdownValue] = useState({ label: '', value: '' });

//   // API Call - Referral Agents
//   const { data: agentsData, isLoading: isLoadingAgents } = useGetReferralAgentsQuery();
  
//   // Extract agent list from API response (keep objects for ID/name access)
// const referralList = Array.isArray(agentsData?.data) ? agentsData.data : [];

//   // FORM
     
//   const handler = useForm({
//     defaultValues:{
//       first:"",last:"",code:"",phone:"",email:"",
//       dob:"",father:"",fphone:"",address:"",
//       doj:"",skills:""
//     }
//   });
  
//   const { control, handleSubmit, formState:{errors}, setValue } = handler;


// // ✅ API Call - Employee List
// const { data: employeesData, isLoading: isLoadingEmployees } = useListAllEmployeesQuery();

// // ✅ API Call - Employee Profile (for skills and departments)
// const { data: employeeProfileData, isLoading: isLoadingProfile } = useListEmployeeProfileQuery();

// // ✅ Function to generate prefix from organization name
// const getOrganizationPrefix = () => {
//   const selectedOrganization = store.getState().auth.selectedOrganization;
  
//   if (selectedOrganization?.organizationName) {
//     // Organization name se first letters extract karo
//     // "Ghanashyam Classes" → "GC"
//     // "Khote Classes" → "KC"
//     const prefix = getFirstCharactersOfWords(selectedOrganization.organizationName, 2);
//     return prefix.toUpperCase(); // Uppercase me convert
//   }
  
//   // Fallback agar organization name nahi mila
//   return "EMP";
// };

// // ✅ Function to generate next employee code
// const generateNextEmployeeCode = () => {
//   const prefix = getOrganizationPrefix(); // e.g., "GC", "KH"
  
//   // Check if employeesData is an array (employee list)
//   if (employeesData?.data && Array.isArray(employeesData.data) && employeesData.data.length > 0) {
//     // Sort by dateCreated descending (latest first) - Student jaisa
//     const sorted = [...employeesData.data].sort((a, b) => {
//       const dateA = a.dateCreated || a.createdAt || a.date || 0;
//       const dateB = b.dateCreated || b.createdAt || b.date || 0;
//       return dateB - dateA;
//     });
    
//     const lastEmployee = sorted[0];
//     // Check actual field name - could be 'code', 'employeeCode', etc.
//     const lastCode = lastEmployee.code || lastEmployee.employeeCode || lastEmployee.employee_code;
    
//     if (lastCode) {
//       // Extract prefix and number (e.g., "GC-27" → prefix: "GC", number: 27)
//       const match = lastCode.match(/^(.*?)-(\d+)$/);
//       if (match) {
//         const existingPrefix = match[1];
//         const number = parseInt(match[2], 10) + 1;
//         // Same prefix use karo (organization same hai to prefix same rahega)
//         return `${existingPrefix}-${number}`;
//       }
//     }
    
//     // Fallback: agar last code format sahi nahi hai, to prefix se start karo
//     return `${prefix}-1`;
//   }
  
//   // Agar API number return karta hai (old logic)
//   if (employeesData?.data && typeof employeesData.data === 'number') {
//     const latestNumber = employeesData.data;
//     const nextNumber = latestNumber + 1;
//     return `${prefix}-${nextNumber}`;
//   }
  
//   // Agar koi employee nahi hai, to 1 se start karo
//   return `${prefix}-1`; // e.g., "GC-1", "KH-1"
// };

// // ✅ Auto-fill employee code when API data loads
// useEffect(() => {
//   if (
//     !isLoadingEmployees && 
//     employeesData && 
//     !handler.getValues('code') // Only auto-fill if field is empty
//   ) {
//     const nextCode = generateNextEmployeeCode();
//     setValue("code", nextCode);
//   }
// }, [employeesData, isLoadingEmployees, setValue, handler]);

// // ✅ Re-generate code when organization changes
// useEffect(() => {
//   const selectedOrganization = store.getState().auth.selectedOrganization;
//   if (selectedOrganization?.organizationName && !handler.getValues('code')) {
//     const nextCode = generateNextEmployeeCode();
//     setValue("code", nextCode);
//   }
// }, [setValue, handler]);

// // Dropdowns

//   // Dropdowns
//   const [gender,setGender] = useState<string>();
//   const [genderOpen,setGenderOpen] = useState(false);

//   const [department, setDepartment] = useState<string>("");
//   const [deptInput, setDeptInput] = useState("");
//   const [deptOpen, setDeptOpen] = useState(false);

//   // Employee Skill Dropdown
// const [skillOpen, setSkillOpen] = useState(false);

// // Skill list - API se extract karo
// const skillList: string[] = employeeProfileData?.data?.skill || [];

//   // Department list - API se extract karo
//   const departmentList: string[] = employeeProfileData?.data?.department || [];

//   const [expYear,setExpYear] = useState<string>();
//   const [expOpen,setExpOpen] = useState(false);

//   const [aadharImageUri, setAadharImageUri] = useState("");
//   const [panImageUri, setPanImageUri] = useState("");
//   // Aadhar Card Image Handler
//   const handleSelectAadharImage = () => {
//     launchImageLibrary(
//       {
//         mediaType: 'photo',
//         includeBase64: true,
//         quality: 0.7
//       },
//       (response) => {
//         if (response.assets && response.assets.length > 0) {
//           const asset = response.assets[0];
  
//           if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
//             Alert.alert('Error', 'File size exceeds 5MB limit');
//             return;
//           }
  
//           setAadharImageUri(`data:${asset.type};base64,${asset.base64}`);
//         }
//       }
//     );
//   };
// const handleClearAadharImage = () => {
//   setAadharImageUri('');
// };

// // PAN Card Image Handler
// const handleSelectPanImage = () => {
//   launchImageLibrary(
//     {
//       mediaType: 'photo',
//       includeBase64: true,
//       quality: 0.7
//     },
//     (response) => {
//       if (response.assets && response.assets.length > 0) {
//         const asset = response.assets[0];

//         if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
//           Alert.alert('Error', 'File size exceeds 5MB limit');
//           return;
//         }

//         setPanImageUri(`data:${asset.type};base64,${asset.base64}`);
//       }
//     }
//   );
// };


// const handleClearPanImage = () => {
//   setPanImageUri('');
// };

//   // Referral Payment Functions
//   const handleReferralAmountChange = (text: string) => {
//     if (referralAmountError) {
//       setReferralAmountError('');
//     }
//     const cleanText = text.replace(/[^0-9.]/g, '');
//     const parts = cleanText.split('.');
//     if (parts.length > 2) return;
//     if (parts[1] && parts[1].length > 2) return;
//     setReferralAmount(cleanText);
//   };

//   const handleReferralSubmit = () => {
//     setReferralAmountError('');
    
//     if (!referralAmount.trim()) {
//       setReferralAmountError('Referral amount is required');
//       return;
//     }
    
//     const amount = parseFloat(referralAmount);
//     if (isNaN(amount) || amount <= 0) {
//       setReferralAmountError('Please enter a valid amount (numbers only)');
//       return;
//     }
    
//     if (!referralPaymentStatus.trim()) {
//       Alert.alert('Error', 'Please select payment status');
//       return;
//     }

//     if (referralPaymentStatus === 'paid' && !referralPaymentMode.trim()) {
//       Alert.alert('Error', 'Please select payment mode');
//       return;
//     }

//     // Set referred by value
//     setReferredBy(selectedAgentForReferral?.agentName || '');
//     setReferredById(selectedAgentForReferral?.agentId || '');
    
//     // Store referral details
//     console.log('Referral details saved:', {
//       agentId: selectedAgentForReferral?.agentId || '',
//       agentName: selectedAgentForReferral?.agentName || '',
//       referredAmount: amount,
//       paymentStatus: referralPaymentStatus,
//       paymentMode: referralPaymentMode,
//     });
    
//     // Reset and close
//     setReferralAmount('');
//     setReferralPaymentStatus('');
//     setReferralPaymentMode('');
//     setReferralAmountError('');
//     setSelectedAgentForReferral(null);
//     setReferralModalVisible(false);
//     setOpenReferralDropdown(false);
//   };

//   const onSubmit = (d:any)=>{
//     const final = {
//       ...d,
//       gender,
//       experience:expYear,
//       referredBy,
//       referredById,
//       referralAmount: parseFloat(referralAmount) || 0,
//       referralPaymentStatus: referralPaymentStatus || '',
//       referralPaymentMode: referralPaymentMode || '',
//       department,
//       aadharImageUri: aadharImageUri,  // ← Line 3985 me add karo
//       panImageUri: panImageUri,  
//     };
//     navigation.navigate("HighestQualification",{employeeData:final});
//   };


//   return (
//     <SafeView>
//       <AppHeader title="Personal Information" showDrawer={false}/>

//       <View style={styles.page}>
//         <View style={styles.card}>
          
//           <ScalableText style={styles.title} fontFamily="Bold">Personal Information</ScalableText>
//           <ScalableText style={styles.sub} fontFamily="Regular">Step 1 of 1 • Enter Information</ScalableText>

//           <ThemeScrollView contentContainerStyle={styles.scroll}>


//             {/* ================== FIELDS ================== */}
//             <Field label="First Name*" name="first" required control={control} errors={errors}
//               rules={{required:"This field is required",pattern:{value:/^[A-Za-z ]+$/,message:"Only alphabets"}}}/>
//             <Field label="Last Name" name="last" control={control} errors={errors}
//               rules={{pattern:{value:/^[A-Za-z ]+$/,message:"Only alphabets"}}}/>
//             <Field label="Employee Code*" name="code" required control={control} errors={errors}
//               rules={{required:"This field is required"}}/>
//             <Field label="Phone Number*" name="phone" required keyboard="numeric" control={control} errors={errors}
//               rules={{required:"This field is required",pattern:{value:/^[0-9]{10}$/,message:"10 digits required"}}}/>
//             <Field label="Email*" name="email" required keyboard="email-address" control={control} errors={errors}
//               rules={{required:"This field is required",pattern:{value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:"Enter valid email"}}}/>
//             {/* Date of Birth */}
//             <Text style={styles.label}>Date of Birth*</Text>
// <View style={styles.drop}>
//   <DateInput
//     handler={handler} 
//     name="dob"
//     label="Enter date of birth"
  
//     inputRoot={{ 
//       width: undefined,
//       borderWidth: 0, 
//       paddingLeft: -3,
//       paddingRight: 12,
//       elevation: 0,
//       backgroundColor: 'transparent',
//       height: 44
//       // ← color: '#777' grey karne ke liye
//     }}
//     maximumDate={new Date(2010, 11, 31)} // 2010 tak limit
//     minimumDate={new Date(1950, 0, 1)} // 1950 se start
//     inputTextStyles={{ fontSize: 13, color: '#777' }}  // ← color: '#777' grey karne ke liye
//   />
// </View>
//             <Field label="Father Name" name="father" control={control} errors={errors}
//               rules={{pattern:{value:/^[A-Za-z ]+$/,message:"Only alphabets"}}}/>
//             <Field label="Father Phone Number" name="fphone" keyboard="numeric" control={control} errors={errors}
//               rules={{pattern:{value:/^[0-9]{10}$/,message:"10 digits"}}}/>
//             <Field label="Address" name="address" control={control} errors={errors}
//               rules={{minLength:{value:3,message:"Min 3 Character"}}}/>
//             {/* DEPARTMENT FIELD */}
// <Text style={styles.label}>Department</Text>

// <View style={styles.deptBox}>
//   <TextInput
//     value={department}
//     onChangeText={setDepartment}
//     placeholder="Department"
//     style={styles.deptInput}
//   />

//   <TouchableOpacity
//     onPress={() => setDeptOpen(!deptOpen)}
//     style={styles.deptIconWrap}
//   >
//     <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//   </TouchableOpacity>
// </View>

// {deptOpen && (
//   <View style={styles.list}>
//     {isLoadingProfile ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>Loading departments...</Text>
//       </View>
//     ) : departmentList.length === 0 ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>No departments found</Text>
//       </View>
//     ) : (
//       departmentList.map(d => (
//         <TouchableOpacity
//           key={d}
//           style={styles.option}
//           onPress={() => {
//             setDepartment(d);
//             setDeptOpen(false);
//           }}
//         >
//           <Text>{d}</Text>
//         </TouchableOpacity>
//       ))
//     )}
//   </View>
// )}

             


//             {/* EXPERIENCE
//             <Text style={styles.label}>Experience (Years)</Text>
//             <TouchableOpacity style={styles.drop} onPress={()=>setExpOpen(!expOpen)}>
//               <Text>{expYear || "Select experience"}</Text>
//             </TouchableOpacity> */}
//             <Text style={styles.label}>Experience (Years)</Text>
//             <TouchableOpacity
//            style={[styles.drop, {
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//           paddingRight: 10,
//           height:48
//   }]}
//   onPress={() => setExpOpen(!expOpen)}
// >
//   <Text>{expYear || "Select experience"}</Text>

//   {/* ▼ ICON ON RIGHT SIDE */}
//   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
// </TouchableOpacity>
//             {expOpen && (
//               <View style={styles.list}>
//                 {["0–1","1–3","3–5","5–10","10+"].map(v=>(
//                   <TouchableOpacity key={v} style={styles.option} onPress={()=>{setExpYear(v);setExpOpen(false);}}>
//                     <Text>{v}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}

//             {/* OPTIONAL */}
//             {/* Date of Joining */}
//             <Text style={styles.label}>Date of Joining</Text>
// <View style={styles.drop}>
//   <DateInput
//     handler={handler} 
//     name="doj"
//     label="Enter date of joining"
    
//     inputRoot={{ 
//       width: undefined,
      
//       borderWidth: 0, 
//       paddingLeft: -3,
//       paddingRight: 12,
//       elevation: 0,
//       backgroundColor: 'transparent',
//       height: 44
//       // ← color: '#777' grey karne ke liye
//     }}
//     inputTextStyles={{ fontSize: 13, color: '#777' }}  // ← color: '#777' grey karne ke liye
//   />
// </View>
//             {/* <Field label="Employee Skills" name="skills" control={control}/> */}
//             {/* EMPLOYEE SKILL FIELD */}
// <Text style={styles.label}>Employee Skills</Text>

// <View style={styles.deptBox}>
//   {/* Existing Field input logic */}
//   <Controller
//     control={control}
//     name="skills"
//     render={({ field:{ value, onChange }, fieldState:{ error } }) => (
//       <TextInput
//         value={value}
//         onChangeText={onChange}
//         placeholder="Employee Skill"
//         style={[styles.deptInput, error && {borderColor:"red",borderWidth:1}]}
//       />
//     )}
//   />

//   {/* Dropdown icon */}
//   <TouchableOpacity
//     onPress={() => setSkillOpen(!skillOpen)}
//     style={styles.deptIconWrap}
//   >
//     <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//   </TouchableOpacity>
// </View>

// {/* Dropdown list */}
// {skillOpen && (
//   <View style={styles.list}>
//     {isLoadingProfile ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>Loading skills...</Text>
//       </View>
//     ) : skillList.length === 0 ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>No skills found</Text>
//       </View>
//     ) : (
//       skillList.map(s => (
//         <TouchableOpacity
//           key={s}
//           style={styles.option}
//           onPress={() => {
//             setValue("skills", s);  // form me skill set
//             setSkillOpen(false);
//           }}
//         >
//           <Text>{s}</Text>
//         </TouchableOpacity>
//       ))
//     )}
//   </View>
// )}


//             {/* UPLOAD */}
//             {/* Aadhar Card Image */}
// <View style={styles.inputSpacing}>
// <Text style={styles.label}>
//   Aadhaar Card Image
// </Text>
//   <View style={styles.imageButtons}>
//     <TouchableOpacity
//       style={styles.imageButton}
//       onPress={handleSelectAadharImage}
//     >
//       <Text style={styles.imageButtonText}>
//         {aadharImageUri ? 'Change Image' : 'Select Image'}
//       </Text>
//     </TouchableOpacity>
//     {aadharImageUri && (
//       <TouchableOpacity
//         style={[styles.imageButton, { backgroundColor: '#FF3B30' }]}
//         onPress={handleClearAadharImage}
//       >
//         <Text style={styles.imageButtonText}>Remove</Text>
//       </TouchableOpacity>
//     )}
//   </View>
//   {aadharImageUri ? (
//     <Image source={{ uri: aadharImageUri }} style={styles.imagePreview} />
//   ) : null}
// </View>

// {/* PAN Card Image */}
// <View style={styles.inputSpacing}>
// <Text style={styles.label}>
//   PAN Card Image
// </Text>
//   <View style={styles.imageButtons}>
//     <TouchableOpacity
//       style={styles.imageButton}
//       onPress={handleSelectPanImage}
//     >
//       <Text style={styles.imageButtonText}>
//         {panImageUri ? 'Change Image' : 'Select Image'}
//       </Text>
//     </TouchableOpacity>
//     {panImageUri && (
//       <TouchableOpacity
//         style={[styles.imageButton, { backgroundColor: '#FF3B30' }]}
//         onPress={handleClearPanImage}
//       >
//         <Text style={styles.imageButtonText}>Remove</Text>
//       </TouchableOpacity>
//     )}
//   </View>
//   {panImageUri ? (
//     <Image source={{ uri: panImageUri }} style={styles.imagePreview} />
//   ) : null}
// </View>

           
//              <Text style={styles.label}>Gender</Text>
            

//             <TouchableOpacity 
//   style={[styles.drop,{
//     flexDirection:"row",
//     justifyContent:"space-between",
//     alignItems:"center",
//     paddingRight:10,
//     height:48
//   }]}
//   onPress={()=>setGenderOpen(!genderOpen)}
// >
//   <Text>{gender || "Select gender"}</Text>
//   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
// </TouchableOpacity>
//             {genderOpen &&(
//               <View style={styles.list}>
//                 {["Male","Female","Other"].map(g=>(
//                   <TouchableOpacity key={g} style={styles.option} onPress={()=>{setGender(g);setGenderOpen(false);}}>
//                     <Text>{g}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}


//             {/* ================== REFERRED BY 🔥 FINAL ================== */}
//             <Text style={styles.label}>Referred By</Text>

//             <View style={styles.refWrap}>

//               {/* dropdown kholne wala */}
//               <TouchableOpacity 
//   style={[styles.refBox, {
//     flexDirection:"row",
//     justifyContent:"space-between",
//     alignItems:"center",
//     paddingRight:12
//   }]}
//   onPress={()=>setOpenReferralDropdown(!openReferralDropdown)}
// >
//   <Text style={{color:"#444"}}>{referredBy || "Select referral"}</Text>
//   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
// </TouchableOpacity>
//               {/* + icon modal open karega */}
//               <TouchableOpacity style={styles.addBtn} onPress={()=>setShowReferralModal(true)}>
//                 <Text style={styles.addTxt}>+</Text>
//               </TouchableOpacity>
//             </View>

//             {/* DROPDOWN APPEAR HERE */}
//             {openReferralDropdown && (
//               <View style={styles.refDropdown}>
//                {referralList.map((agent: any, i: number) => {
//   // Extract agent name from object
//   const agentName = agent?.agentName 
//     ? `${agent.agentName} ${agent.agentLastName || ''}`.trim()
//     : agent?.agentId || 'Unknown';
  
//   return (
//     <TouchableOpacity 
//       key={agent?.agentId || i} 
//       style={styles.refOption} 
//       onPress={() => {
//         // Agent select hote hi payment modal open karo
//         setSelectedAgentForReferral({
//           agentId: agent?.agentId || '',
//           agentName: agentName,
//         });
//         setOpenReferralDropdown(false);
//         setReferralModalVisible(true); // Payment modal open
//       }}>
//       <Text>{agentName}</Text>
//     </TouchableOpacity>
//   );
// })} 
//               </View>
//             )}


//           </ThemeScrollView>
//         </View>


//         <Button title="Next" btnStyles={styles.btn} onPress={handleSubmit(onSubmit)}/>
//       </View>


//       {/* MODAL */}
//       <AgentSelectionModal
//         visible={showReferralModal}
//         onClose={()=>setShowReferralModal(false)}
//         agents={referralList}
//         onAgentSelected={(id,name)=>{
//           setReferredBy(name);
//           setReferredById(id);
//           setShowReferralModal(false);
//         }}
//       />

//       {/* Referral Payment Modal */}
//       <Modal
//         visible={referralModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => {
//           setReferralModalVisible(false);
//           setReferralAmount('');
//           setReferralPaymentStatus('');
//           setReferralPaymentMode('');
//           setReferralAmountError('');
//           setDropdownValue({ label: '', value: '' });
//           setSelectedAgentForReferral(null);
//           setReferredBy('');
//         }}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <ScalableText style={styles.modalTitle} fontFamily="Medium">
//                 Please Select The Payment For The Agents
//               </ScalableText>
//               <TouchableOpacity onPress={() => {
//                 setReferralModalVisible(false);
//                 setReferralAmount('');
//                 setReferralPaymentStatus('');
//                 setReferralPaymentMode('');
//                 setReferralAmountError('');
//                 setDropdownValue({ label: '', value: '' });
//                 setSelectedAgentForReferral(null);
//                 setReferredBy('');
//               }} style={styles.closeButton}>
//                 <Text style={styles.closeButtonText}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.modalBody}>
//               <ScrollView 
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={styles.modalScrollContent}
//               >
//                 <View style={styles.modalField}>
//                   <ScalableText style={styles.modalLabel} fontFamily="Medium">
//                     Agent name
//                   </ScalableText>
//                   <TextInput
//                     style={styles.modalInput}
//                     value={selectedAgentForReferral?.agentName || ''}
//                     editable={false}
//                     placeholder="Agent name"
//                   />
//                 </View>

//                 <View style={styles.modalField}>
//                   <ScalableText style={styles.modalLabel} fontFamily="Medium">
//                     Referred amount *
//                   </ScalableText>
//                   <TextInput
//                     style={[
//                       styles.modalInput,
//                       referralAmountError ? styles.modalInputError : null
//                     ]}
//                     placeholder="Enter referred amount"
//                     keyboardType="numeric"
//                     value={referralAmount}
//                     onChangeText={handleReferralAmountChange}
//                   />
//                   {referralAmountError ? (
//                     <ScalableText style={styles.modalErrorText} fontFamily="Regular">
//                       {referralAmountError}
//                     </ScalableText>
//                   ) : null}
//                 </View>

//                 <View style={styles.modalField}>
//                   <ScalableText style={styles.modalLabel} fontFamily="Medium">
//                     Payment status *
//                   </ScalableText>
//                   <ControlledSelect
//                     handler={handler}
//                     name="referralPaymentStatus"
//                     label="Select payment status"
//                     options={[
//                       { label: 'Paid', value: 'paid' },
//                       { label: 'Due', value: 'due' }
//                     ]}
//                     value={referralPaymentStatus ? 
//                       { label: referralPaymentStatus === 'paid' ? 'Paid' : 'Due', value: referralPaymentStatus } : 
//                       { label: 'Select payment status', value: '' }
//                     }
//                     dropdownButtonStyle={styles.modalDropdown}
//                     onChangeValue={(value) => {
//                       console.log('Payment status changed to:', value);
//                       setReferralPaymentStatus(value);
//                     }}
//                   />
//                 </View>

//                 {/* Payment Mode Field - Only show when status is "Paid" */}
//                 {referralPaymentStatus === 'paid' && (
//                   <View style={styles.modalField}>
//                     <ScalableText style={styles.modalLabel} fontFamily="Medium">
//                       Please select the payment mode *
//                     </ScalableText>
//                     <ControlledSelect
//                       handler={handler}
//                       name="referralPaymentMode"
//                       label="Select payment mode"
//                       options={PAYMENT_MODE_OPTIONS}
//                       value={PAYMENT_MODE_OPTIONS.find(opt => opt.value === referralPaymentMode) || { label: '', value: '' }}
//                       dropdownButtonStyle={styles.modalDropdown}
//                       onChangeValue={(value) => {
//                         console.log('Payment mode changed to:', value);
//                         setReferralPaymentMode(value);
//                       }}
//                     />
//                   </View>
//                 )}
//               </ScrollView>
//             </View>

//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={() => {
//                   setReferralModalVisible(false);
//                   setReferralAmount('');
//                   setReferralPaymentStatus('');
//                   setReferralPaymentMode('');
//                   setReferralAmountError('');
//                   setDropdownValue({ label: '', value: '' });
//                   setSelectedAgentForReferral(null);
//                   setReferredBy('');
//                 }}
//               >
//                 <Text style={styles.modalCancelButtonText}>CANCEL</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalSubmitButton}
//                 onPress={handleReferralSubmit}
//               >
//                 <Text style={styles.modalSubmitButtonText}>SUBMIT</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//     </SafeView>
//   );
// }


// /* FIELD */
// const Field = ({label,name,control,errors,rules={},required,keyboard="default"}:any)=>(
//   <View>
//     <Text style={styles.label}>{label}</Text>
//     <Controller control={control} name={name} rules={rules}
//       render={({field:{value,onChange},fieldState:{error}})=>(
//         <TextInput
//           value={value}
//           onChangeText={onChange}
//           placeholder={label}
//           keyboardType={keyboard}
//           style={[styles.input,error && {borderColor:"red",borderWidth:2}]}
//         />
//       )}/>
//     {errors?.[name] && <Text style={{color:"red",marginBottom:6,fontSize:11 }}>{errors[name]?.message}</Text>}
//   </View>
// );


// /* STYLES */
// const H=Dimensions.get("window").height;
// const styles=StyleSheet.create({
//   page:{flex:1,alignItems:"center",backgroundColor:"#F5F7FA"},
//   card:{width:"90%",backgroundColor:"#fff",borderRadius:18,elevation:6,padding:18,minHeight:H*0.55,maxHeight:H*0.60,marginTop:8,borderLeftWidth:7,borderLeftColor:"#004C93"},
//   scroll:{paddingBottom:60},
//   title:{fontSize:22,fontWeight:"bold",textAlign:"center"},
//   sub:{fontSize:13,textAlign:"center",color:"#666",marginBottom:15},
//   label:{fontSize:13,fontWeight:"600",marginBottom:6,color:"#000"},
//   input:{height:48,borderWidth:1,borderColor:"#000",borderRadius:10,paddingLeft:10,marginBottom:10,width:"97%"},


//   drop:{height:48,borderWidth:1,borderColor:"BFC4CA",borderRadius:10,justifyContent:"center",paddingLeft:12,marginBottom:10,width:"97%"},
//   list:{backgroundColor:"#fff",borderWidth:1,borderColor:"#BFC4CA",borderRadius:10,marginBottom:14,overflow:"hidden"},
//   option:{padding:12,borderBottomWidth:1,borderBottomColor:"#eee"},

//   upload:{height:44,borderWidth:1,borderColor:"#004C93",borderRadius:10,alignItems:"center",justifyContent:"center",marginBottom:14},

//   refWrap:{flexDirection:"row",alignItems:"center",marginBottom:10},
//   refBox:{flex:1,height:48,borderWidth:1,borderRadius:10,borderColor:"#000",justifyContent:"center",paddingLeft:12},
//   addBtn:{width:44,height:44,borderRadius:22,backgroundColor:"#004C93",justifyContent:"center",alignItems:"center",marginLeft:10},
//   addTxt:{color:"#fff",fontSize:22,fontWeight:"bold"},

//   /* 🔥 dropdown under referral */
//   refDropdown:{backgroundColor:"#fff",borderWidth:1,borderRadius:10,borderColor:"#BFC4CA",marginBottom:16},
//   refOption:{padding:12,borderBottomWidth:1,borderBottomColor:"#eee"},

//   btn:{width:"80%",height:45,backgroundColor:"#004C93",borderRadius:10,marginVertical:18},
//    /* 🔥 department styles insert here */
//    deptBox:{
//     height:48,
//     borderWidth:1,
//     borderColor:"#000",
//     borderRadius:10,
//     flexDirection:"row",
//     alignItems:"center",
//     paddingLeft:10,
//     marginBottom:10,
//      width:"97%"
//   },
//   deptInput:{
//     flex:1,
//     fontSize:14,
//     color:"#000"
//   },
//   deptIconWrap:{
//     paddingHorizontal:12,
//     paddingVertical:6,
//     justifyContent:"center",
//     alignItems:"center"
//   },                   // ← Line 4336 - comma add karo
//   inputSpacing: {      // ← Line 4337 se start karo
//     marginBottom: 15,
//   },
//   imageButtons: {
//     flexDirection: 'row',
//     gap: 10,
//     marginBottom: 10,
//   },
//   imageButton: {
//     backgroundColor: '#004C93',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     flex: 1,
//   },
//   imageButtonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   imagePreview: {
//     width: '100%',
//     height: 200,
//     borderRadius: 8,
//     marginTop: 10,
//     resizeMode: 'contain',
//   },
//   inputContainer: {
//     marginBottom: 10,
//   },
//   dateInputStyle: {
//     height: 44,
//     borderWidth: 1,
//     borderColor: '#BFC4CA',
//     borderRadius: 10,
//     paddingLeft: 10,
//     justifyContent: 'center',
//   },
//   // Modal styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: COLORS.white,
//     borderRadius: 20,
//     padding: 0,
//     width: Dimensions.get('window').width * 0.9,
//     minHeight: 520,
//     maxHeight: Dimensions.get('window').height * 0.9,
//     flexDirection: 'column',
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 24,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   modalTitle: {
//     fontSize: 20,
//     color: COLORS.black,
//     flex: 1,
//     fontFamily: 'Poppins-SemiBold',
//   },
//   closeButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#F8F9FA',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     fontSize: 18,
//     color: '#666',
//   },
//   modalBody: {
//     padding: 24,
//     paddingTop: 20,
//     paddingBottom: 20,
//     flex: 1,
//     justifyContent: 'flex-start',
//     minHeight: 300,
//   },
//   modalScrollContent: {
//     paddingBottom: 20,
//   },
//   modalField: {
//     marginBottom: 24,
//   },
//   modalLabel: {
//     fontSize: 15,
//     color: COLORS.black,
//     marginBottom: 10,
//     fontFamily: 'Poppins-Medium',
//   },
//   modalInput: {
//     height: 52,
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     backgroundColor: '#FAFAFA',
//     paddingHorizontal: 18,
//     fontSize: 15,
//     fontFamily: 'Poppins-Regular',
//     color: COLORS.black,
//   },
//   modalDropdown: {
//     height: 52,
//     borderRadius: 12,
//     backgroundColor: '#FAFAFA',
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     paddingHorizontal: 18,
//     fontSize: 15,
//     fontFamily: 'Poppins-Regular',
//     color: COLORS.black,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 16,
//     padding: 24,
//     paddingTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#F0F0F0',
//     backgroundColor: '#FAFAFA',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   modalCancelButton: {
//     flex: 1,
//     height: 52,
//     borderRadius: 12,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   modalCancelButtonText: {
//     color: '#666',
//     fontSize: 14,
//     fontFamily: 'Poppins-Medium',
//   },
//   modalSubmitButton: {
//     flex: 1,
//     height: 52,
//     borderRadius: 12,
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   modalSubmitButtonText: {
//     color: COLORS.white,
//     fontSize: 14,
//     fontFamily: 'Poppins-Medium',
//   },
//   modalInputError: {
//     borderColor: '#FF3B30',
//     borderWidth: 2,
//     backgroundColor: '#FFF5F5',
//   },
//   modalErrorText: {
//     color: '#FF3B30',
//     fontSize: 13,
//     marginTop: 6,
//     fontFamily: 'Poppins-Regular',
//     marginLeft: 4,
//   },
//                   // ← Last me closing brace
// });



import React, { useState } from "react";
import { getFirstCharactersOfWords } from '../../../utils/getFirstCharactersOfWords';
import { store } from '../../../app/store';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  Image,        // ← YEH ADD KARO (Line 3823 ke baad)
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from "@react-navigation/native";

import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import Button from "../../../@ui/button/Button";
import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage.tsx";
import { IMAGES } from "../../../images";
import DateInput from "../../../@ui/date-input/DateInput";
import { useListAllEmployeesQuery } from "../../../apis/hooks/employee/query/useListAllEmployees.query";
import { useEffect } from "react";
// Modal Import
import AgentSelectionModal from "../../../@ui/agent-selection-modal/AgentSelectionModal";
import { useGetReferralAgentsQuery } from "../../../apis/hooks/agent-management/query/useGetReferralAgents.query";
import { useListEmployeeProfileQuery } from "../../../apis/hooks/employee/query/useListEmployeeProfile.query";
import ControlledSelect from "../../../@ui/controlled-select/ControlledSelect";
import { COLORS } from "../../../colors";

const PAYMENT_MODE_OPTIONS = [
  { label: 'Online', value: 'Online' },
  { label: 'Cash', value: 'Cash' },
  { label: 'Other', value: 'Other' },
];

export default function AddEmployeeScreen() {

  const navigation = useNavigation<THomeStackNavigator>();
  // REFERRED BY
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [openReferralDropdown, setOpenReferralDropdown] = useState(false);
  const [referredBy, setReferredBy] = useState("");
  const [referredById, setReferredById] = useState("");
  // Referral Payment Modal States
  const [referralModalVisible, setReferralModalVisible] = useState(false);
  const [selectedAgentForReferral, setSelectedAgentForReferral] = useState<{
    agentId: string;
    agentName: string;
  } | null>(null);
  const [referralAmount, setReferralAmount] = useState('');
  const [referralPaymentStatus, setReferralPaymentStatus] = useState('');
  const [referralPaymentMode, setReferralPaymentMode] = useState('');
  const [referralAmountError, setReferralAmountError] = useState('');
  const [dropdownValue, setDropdownValue] = useState({ label: '', value: '' });

  // API Call - Referral Agents
  const { data: agentsData, isLoading: isLoadingAgents } = useGetReferralAgentsQuery();
  
  // Extract agent list from API response (keep objects for ID/name access)
const referralList = Array.isArray(agentsData?.data) ? agentsData.data : [];

  // FORM
     
  const handler = useForm({
    defaultValues:{
      first:"",last:"",code:"",phone:"",email:"",
      dob:"",father:"",fphone:"",address:"",
      doj:"",skills:""
    }
  });
  
  const { control, handleSubmit, formState:{errors}, setValue } = handler;


// ✅ API Call - Employee List
const { data: employeesData, isLoading: isLoadingEmployees } = useListAllEmployeesQuery();

// ✅ API Call - Employee Profile (for skills and departments)
const { data: employeeProfileData, isLoading: isLoadingProfile } = useListEmployeeProfileQuery();

// ✅ Function to generate prefix from organization name
const getOrganizationPrefix = () => {
  const selectedOrganization = store.getState().auth.selectedOrganization;
  
  if (selectedOrganization?.organizationName) {
    // Organization name se first letters extract karo - sabhi words ke first letters
    // "Thosniwal Classes" → "TC"
    // "Advance Coaching Classes" → "ACC"
    // "Riyan Coaching Center Classes" → "RCCC"
    const words = selectedOrganization.organizationName.trim().split(/\s+/);
    const wordCount = words.length; // Sabhi words count karo
    const prefix = getFirstCharactersOfWords(selectedOrganization.organizationName, wordCount);
    return prefix.toUpperCase(); // Uppercase me convert
  }
  
  // Fallback agar organization name nahi mila
  return "EMP";
};

// ✅ Function to generate next employee code
const generateNextEmployeeCode = () => {
  const prefix = getOrganizationPrefix(); // e.g., "GC", "KH"
  
  // Check if employeesData is an array (employee list)
  if (employeesData?.data && Array.isArray(employeesData.data) && employeesData.data.length > 0) {
    // Sort by dateCreated descending (latest first) - Student jaisa
    const sorted = [...employeesData.data].sort((a, b) => {
      const dateA = a.dateCreated || a.createdAt || a.date || 0;
      const dateB = b.dateCreated || b.createdAt || b.date || 0;
      return dateB - dateA;
    });
    
    const lastEmployee = sorted[0];
    // Check actual field name - could be 'code', 'employeeCode', etc.
    const lastCode = lastEmployee.code || lastEmployee.employeeCode || lastEmployee.employee_code;
    
    if (lastCode) {
      // Extract prefix and number (e.g., "GC-27" → prefix: "GC", number: 27)
      const match = lastCode.match(/^(.*?)-(\d+)$/);
      if (match) {
        const existingPrefix = match[1];
        const number = parseInt(match[2], 10) + 1;
        // Same prefix use karo (organization same hai to prefix same rahega)
        return `${existingPrefix}-${number}`;
      }
    }
    
    // Fallback: agar last code format sahi nahi hai, to prefix se start karo
    return `${prefix}-1`;
  }
  
  // Agar API number return karta hai (old logic)
  if (employeesData?.data && typeof employeesData.data === 'number') {
    const latestNumber = employeesData.data;
    const nextNumber = latestNumber + 1;
    return `${prefix}-${nextNumber}`;
  }
  
  // Agar koi employee nahi hai, to 1 se start karo
  return `${prefix}-1`; // e.g., "GC-1", "KH-1"
};

// ✅ Auto-fill employee code when API data loads
useEffect(() => {
  if (
    !isLoadingEmployees && 
    employeesData?.data && // 👈 Ye line change karni hai - employeesData?.data check karo
    (Array.isArray(employeesData.data) ? employeesData.data.length > 0 : true) && // 👈 Agar array hai to length check karo
    !handler.getValues('code') // Only auto-fill if field is empty
  ) {
    const nextCode = generateNextEmployeeCode();
    setValue("code", nextCode);
  }
}, [employeesData, isLoadingEmployees, setValue, handler]);

// ✅ Re-generate code when organization changes
useEffect(() => {
  const selectedOrganization = store.getState().auth.selectedOrganization;
  if (selectedOrganization?.organizationName && !handler.getValues('code')) {
    const nextCode = generateNextEmployeeCode();
    setValue("code", nextCode);
  }
}, [setValue, handler]);

// Dropdowns

  // Dropdowns
  const [gender,setGender] = useState<string>();
  const [genderOpen,setGenderOpen] = useState(false);

  const [department, setDepartment] = useState<string>("");
  const [deptInput, setDeptInput] = useState("");
  const [deptOpen, setDeptOpen] = useState(false);

  // Employee Skill Dropdown
const [skillOpen, setSkillOpen] = useState(false);

// Skill list - API se extract karo
const skillList: string[] = employeeProfileData?.data?.skill || [];

  // Department list - API se extract karo
  const departmentList: string[] = employeeProfileData?.data?.department || [];

  const [expYear,setExpYear] = useState<string>();
  const [expOpen,setExpOpen] = useState(false);

  const [aadharImageUri, setAadharImageUri] = useState("");
  const [panImageUri, setPanImageUri] = useState("");
  // Aadhar Card Image Handler
  const handleSelectAadharImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.7
      },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
  
          if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
            Alert.alert('Error', 'File size exceeds 5MB limit');
            return;
          }
  
          setAadharImageUri(`data:${asset.type};base64,${asset.base64}`);
        }
      }
    );
  };
const handleClearAadharImage = () => {
  setAadharImageUri('');
};

// PAN Card Image Handler
const handleSelectPanImage = () => {
  launchImageLibrary(
    {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.7
    },
    (response) => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];

        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          Alert.alert('Error', 'File size exceeds 5MB limit');
          return;
        }

        setPanImageUri(`data:${asset.type};base64,${asset.base64}`);
      }
    }
  );
};


const handleClearPanImage = () => {
  setPanImageUri('');
};

  // Referral Payment Functions
  const handleReferralAmountChange = (text: string) => {
    if (referralAmountError) {
      setReferralAmountError('');
    }
    const cleanText = text.replace(/[^0-9.]/g, '');
    const parts = cleanText.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setReferralAmount(cleanText);
  };

  const handleReferralSubmit = () => {
    setReferralAmountError('');
    
    if (!referralAmount.trim()) {
      setReferralAmountError('Referral amount is required');
      return;
    }
    
    const amount = parseFloat(referralAmount);
    if (isNaN(amount) || amount <= 0) {
      setReferralAmountError('Please enter a valid amount (numbers only)');
      return;
    }
    
    if (!referralPaymentStatus.trim()) {
      Alert.alert('Error', 'Please select payment status');
      return;
    }

    if (referralPaymentStatus === 'paid' && !referralPaymentMode.trim()) {
      Alert.alert('Error', 'Please select payment mode');
      return;
    }

    // Set referred by value
    setReferredBy(selectedAgentForReferral?.agentName || '');
    setReferredById(selectedAgentForReferral?.agentId || '');
    
    // Store referral details
    console.log('Referral details saved:', {
      agentId: selectedAgentForReferral?.agentId || '',
      agentName: selectedAgentForReferral?.agentName || '',
      referredAmount: amount,
      paymentStatus: referralPaymentStatus,
      paymentMode: referralPaymentMode,
    });
    
    // Reset and close
    setReferralAmount('');
    setReferralPaymentStatus('');
    setReferralPaymentMode('');
    setReferralAmountError('');
    setSelectedAgentForReferral(null);
    setReferralModalVisible(false);
    setOpenReferralDropdown(false);
  };

  const onSubmit = (d:any)=>{
    const final = {
      ...d,
      gender,
      experience:expYear,
      referredBy,
      referredById,
      referralAmount: parseFloat(referralAmount) || 0,
      referralPaymentStatus: referralPaymentStatus || '',
      referralPaymentMode: referralPaymentMode || '',
      department,
      aadharImageUri: aadharImageUri,  // ← Line 3985 me add karo
      panImageUri: panImageUri,  
    };
    navigation.navigate("HighestQualification",{employeeData:final});
  };


  return (
    <SafeView>
      <AppHeader title="Personal Information" showDrawer={false}/>

      <View style={styles.page}>
        <View style={styles.card}>
          
          <ScalableText style={styles.title} fontFamily="Bold">Personal Information</ScalableText>
          <ScalableText style={styles.sub} fontFamily="Regular">Step 1 of 1 • Enter Information</ScalableText>

          <ThemeScrollView contentContainerStyle={styles.scroll}>


            {/* ================== FIELDS ================== */}
            <Field label="First Name*" name="first" required control={control} errors={errors}
              rules={{required:"This field is required",pattern:{value:/^[A-Za-z ]+$/,message:"Only alphabets"}}}/>
            <Field label="Last Name" name="last" control={control} errors={errors}
              rules={{pattern:{value:/^[A-Za-z ]+$/,message:"Only alphabets"}}}/>
            <Field label="Employee Code*" name="code" required control={control} errors={errors}
              rules={{required:"This field is required"}}/>
            <Field label="Phone Number*" name="phone" required keyboard="numeric" control={control} errors={errors}
              rules={{required:"This field is required",pattern:{value:/^[0-9]{10}$/,message:"10 digits required"}}}/>
            <Field label="Email*" name="email" required keyboard="email-address" control={control} errors={errors}
              rules={{required:"This field is required",pattern:{value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:"Enter valid email"}}}/>
            {/* Date of Birth */}
            <Text style={styles.label}>Date of Birth*</Text>
<View style={styles.drop}>
  <DateInput
    handler={handler} 
    name="dob"
    label="Enter date of birth"
  
    inputRoot={{ 
      width: undefined,
      borderWidth: 0, 
      paddingLeft: -3,
      paddingRight: 12,
      elevation: 0,
      backgroundColor: 'transparent',
      height: 44
      // ← color: '#777' grey karne ke liye
    }}
    maximumDate={new Date(2010, 11, 31)} // 2010 tak limit
    minimumDate={new Date(1950, 0, 1)} // 1950 se start
    inputTextStyles={{ fontSize: 13, color: '#777' }}  // ← color: '#777' grey karne ke liye
  />
</View>
            <Field label="Father Name" name="father" control={control} errors={errors}
              rules={{pattern:{value:/^[A-Za-z ]+$/,message:"Only alphabets"}}}/>
            <Field label="Father Phone Number" name="fphone" keyboard="numeric" control={control} errors={errors}
              rules={{pattern:{value:/^[0-9]{10}$/,message:"10 digits"}}}/>
            <Field label="Address" name="address" control={control} errors={errors}
              rules={{minLength:{value:3,message:"Min 3 Character"}}}/>
            {/* DEPARTMENT FIELD */}
<Text style={styles.label}>Department</Text>

<View style={styles.deptBox}>
  <TextInput
    value={department}
    onChangeText={setDepartment}
    placeholder="Department"
    style={styles.deptInput}
  />

  <TouchableOpacity
    onPress={() => setDeptOpen(!deptOpen)}
    style={styles.deptIconWrap}
  >
    <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
  </TouchableOpacity>
</View>

{deptOpen && (
  <View style={styles.list}>
    {isLoadingProfile ? (
      <View style={styles.option}>
        <Text style={{ color: "#888" }}>Loading departments...</Text>
      </View>
    ) : departmentList.length === 0 ? (
      <View style={styles.option}>
        <Text style={{ color: "#888" }}>No departments found</Text>
      </View>
    ) : (
      departmentList.map(d => (
        <TouchableOpacity
          key={d}
          style={styles.option}
          onPress={() => {
            setDepartment(d);
            setDeptOpen(false);
          }}
        >
          <Text>{d}</Text>
        </TouchableOpacity>
      ))
    )}
  </View>
)}

             


            {/* EXPERIENCE
            <Text style={styles.label}>Experience (Years)</Text>
            <TouchableOpacity style={styles.drop} onPress={()=>setExpOpen(!expOpen)}>
              <Text>{expYear || "Select experience"}</Text>
            </TouchableOpacity> */}
            <Text style={styles.label}>Experience (Years)</Text>
            <TouchableOpacity
           style={[styles.drop, {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 10,
          height:48
  }]}
  onPress={() => setExpOpen(!expOpen)}
>
  <Text>{expYear || "Select experience"}</Text>

  {/* ▼ ICON ON RIGHT SIDE */}
  <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
</TouchableOpacity>
            {expOpen && (
              <View style={styles.list}>
                {["0–1","1–3","3–5","5–10","10+"].map(v=>(
                  <TouchableOpacity key={v} style={styles.option} onPress={()=>{setExpYear(v);setExpOpen(false);}}>
                    <Text>{v}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* OPTIONAL */}
            {/* Date of Joining */}
            <Text style={styles.label}>Date of Joining</Text>
<View style={styles.drop}>
  <DateInput
    handler={handler} 
    name="doj"
    label="Enter date of joining"
    
    inputRoot={{ 
      width: undefined,
      
      borderWidth: 0, 
      paddingLeft: -3,
      paddingRight: 12,
      elevation: 0,
      backgroundColor: 'transparent',
      height: 44
      // ← color: '#777' grey karne ke liye
    }}
    inputTextStyles={{ fontSize: 13, color: '#777' }}  // ← color: '#777' grey karne ke liye
  />
</View>
            {/* <Field label="Employee Skills" name="skills" control={control}/> */}
            {/* EMPLOYEE SKILL FIELD */}
<Text style={styles.label}>Employee Skills</Text>

<View style={styles.deptBox}>
  {/* Existing Field input logic */}
  <Controller
    control={control}
    name="skills"
    render={({ field:{ value, onChange }, fieldState:{ error } }) => (
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Employee Skill"
        style={[styles.deptInput, error && {borderColor:"red",borderWidth:1}]}
      />
    )}
  />

  {/* Dropdown icon */}
  <TouchableOpacity
    onPress={() => setSkillOpen(!skillOpen)}
    style={styles.deptIconWrap}
  >
    <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
  </TouchableOpacity>
</View>

{/* Dropdown list */}
{skillOpen && (
  <View style={styles.list}>
    {isLoadingProfile ? (
      <View style={styles.option}>
        <Text style={{ color: "#888" }}>Loading skills...</Text>
      </View>
    ) : skillList.length === 0 ? (
      <View style={styles.option}>
        <Text style={{ color: "#888" }}>No skills found</Text>
      </View>
    ) : (
      skillList.map(s => (
        <TouchableOpacity
          key={s}
          style={styles.option}
          onPress={() => {
            setValue("skills", s);  // form me skill set
            setSkillOpen(false);
          }}
        >
          <Text>{s}</Text>
        </TouchableOpacity>
      ))
    )}
  </View>
)}


            {/* UPLOAD */}
            {/* Aadhar Card Image */}
<View style={styles.inputSpacing}>
<Text style={styles.label}>
  Aadhaar Card Image
</Text>
  <View style={styles.imageButtons}>
    <TouchableOpacity
      style={styles.imageButton}
      onPress={handleSelectAadharImage}
    >
      <Text style={styles.imageButtonText}>
        {aadharImageUri ? 'Change Image' : 'Select Image'}
      </Text>
    </TouchableOpacity>
    {aadharImageUri && (
      <TouchableOpacity
        style={[styles.imageButton, { backgroundColor: '#FF3B30' }]}
        onPress={handleClearAadharImage}
      >
        <Text style={styles.imageButtonText}>Remove</Text>
      </TouchableOpacity>
    )}
  </View>
  {aadharImageUri ? (
    <Image source={{ uri: aadharImageUri }} style={styles.imagePreview} />
  ) : null}
</View>

{/* PAN Card Image */}
<View style={styles.inputSpacing}>
<Text style={styles.label}>
  PAN Card Image
</Text>
  <View style={styles.imageButtons}>
    <TouchableOpacity
      style={styles.imageButton}
      onPress={handleSelectPanImage}
    >
      <Text style={styles.imageButtonText}>
        {panImageUri ? 'Change Image' : 'Select Image'}
      </Text>
    </TouchableOpacity>
    {panImageUri && (
      <TouchableOpacity
        style={[styles.imageButton, { backgroundColor: '#FF3B30' }]}
        onPress={handleClearPanImage}
      >
        <Text style={styles.imageButtonText}>Remove</Text>
      </TouchableOpacity>
    )}
  </View>
  {panImageUri ? (
    <Image source={{ uri: panImageUri }} style={styles.imagePreview} />
  ) : null}
</View>

           
             <Text style={styles.label}>Gender</Text>
            

            <TouchableOpacity 
  style={[styles.drop,{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingRight:10,
    height:48
  }]}
  onPress={()=>setGenderOpen(!genderOpen)}
>
  <Text>{gender || "Select gender"}</Text>
  <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
</TouchableOpacity>
            {genderOpen &&(
              <View style={styles.list}>
                {["Male","Female","Other"].map(g=>(
                  <TouchableOpacity key={g} style={styles.option} onPress={()=>{setGender(g);setGenderOpen(false);}}>
                    <Text>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}


            {/* ================== REFERRED BY 🔥 FINAL ================== */}
            <Text style={styles.label}>Referred By</Text>

            <View style={styles.refWrap}>

              {/* dropdown kholne wala */}
              <TouchableOpacity 
  style={[styles.refBox, {
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingRight:12
  }]}
  onPress={()=>setOpenReferralDropdown(!openReferralDropdown)}
>
  <Text style={{color:"#444"}}>{referredBy || "Select referral"}</Text>
  <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
</TouchableOpacity>
              {/* + icon modal open karega */}
              <TouchableOpacity style={styles.addBtn} onPress={()=>setShowReferralModal(true)}>
                <Text style={styles.addTxt}>+</Text>
              </TouchableOpacity>
            </View>

            {/* DROPDOWN APPEAR HERE */}
            {openReferralDropdown && (
              <View style={styles.refDropdown}>
               {referralList.map((agent: any, i: number) => {
  // Extract agent name from object
  const agentName = agent?.agentName 
    ? `${agent.agentName} ${agent.agentLastName || ''}`.trim()
    : agent?.agentId || 'Unknown';
  
  return (
    <TouchableOpacity 
      key={agent?.agentId || i} 
      style={styles.refOption} 
      onPress={() => {
        // Agent select hote hi payment modal open karo
        setSelectedAgentForReferral({
          agentId: agent?.agentId || '',
          agentName: agentName,
        });
        setOpenReferralDropdown(false);
        setReferralModalVisible(true); // Payment modal open
      }}>
      <Text>{agentName}</Text>
    </TouchableOpacity>
  );
})} 
              </View>
            )}


          </ThemeScrollView>
        </View>


        <Button title="Next" btnStyles={styles.btn} onPress={handleSubmit(onSubmit)}/>
      </View>


      {/* MODAL */}
      <AgentSelectionModal
        visible={showReferralModal}
        onClose={()=>setShowReferralModal(false)}
        agents={referralList}
        onAgentSelected={(id,name)=>{
          setReferredBy(name);
          setReferredById(id);
          setShowReferralModal(false);
        }}
      />

      {/* Referral Payment Modal */}
      <Modal
        visible={referralModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setReferralModalVisible(false);
          setReferralAmount('');
          setReferralPaymentStatus('');
          setReferralPaymentMode('');
          setReferralAmountError('');
          setDropdownValue({ label: '', value: '' });
          setSelectedAgentForReferral(null);
          setReferredBy('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ScalableText style={styles.modalTitle} fontFamily="Medium">
                Please Select The Payment For The Agents
              </ScalableText>
              <TouchableOpacity onPress={() => {
                setReferralModalVisible(false);
                setReferralAmount('');
                setReferralPaymentStatus('');
                setReferralPaymentMode('');
                setReferralAmountError('');
                setDropdownValue({ label: '', value: '' });
                setSelectedAgentForReferral(null);
                setReferredBy('');
              }} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
              >
                <View style={styles.modalField}>
                  <ScalableText style={styles.modalLabel} fontFamily="Medium">
                    Agent name
                  </ScalableText>
                  <TextInput
                    style={styles.modalInput}
                    value={selectedAgentForReferral?.agentName || ''}
                    editable={false}
                    placeholder="Agent name"
                  />
                </View>

                <View style={styles.modalField}>
                  <ScalableText style={styles.modalLabel} fontFamily="Medium">
                    Referred amount *
                  </ScalableText>
                  <TextInput
                    style={[
                      styles.modalInput,
                      referralAmountError ? styles.modalInputError : null
                    ]}
                    placeholder="Enter referred amount"
                    keyboardType="numeric"
                    value={referralAmount}
                    onChangeText={handleReferralAmountChange}
                  />
                  {referralAmountError ? (
                    <ScalableText style={styles.modalErrorText} fontFamily="Regular">
                      {referralAmountError}
                    </ScalableText>
                  ) : null}
                </View>

                <View style={styles.modalField}>
                  <ScalableText style={styles.modalLabel} fontFamily="Medium">
                    Payment status *
                  </ScalableText>
                  <ControlledSelect
                    handler={handler}
                    name="referralPaymentStatus"
                    label="Select payment status"
                    options={[
                      { label: 'Paid', value: 'paid' },
                      { label: 'Due', value: 'due' }
                    ]}
                    value={referralPaymentStatus ? 
                      { label: referralPaymentStatus === 'paid' ? 'Paid' : 'Due', value: referralPaymentStatus } : 
                      { label: 'Select payment status', value: '' }
                    }
                    dropdownButtonStyle={styles.modalDropdown}
                    onChangeValue={(value) => {
                      console.log('Payment status changed to:', value);
                      setReferralPaymentStatus(value);
                    }}
                  />
                </View>

                {/* Payment Mode Field - Only show when status is "Paid" */}
                {referralPaymentStatus === 'paid' && (
                  <View style={styles.modalField}>
                    <ScalableText style={styles.modalLabel} fontFamily="Medium">
                      Please select the payment mode *
                    </ScalableText>
                    <ControlledSelect
                      handler={handler}
                      name="referralPaymentMode"
                      label="Select payment mode"
                      options={PAYMENT_MODE_OPTIONS}
                      value={PAYMENT_MODE_OPTIONS.find(opt => opt.value === referralPaymentMode) || { label: '', value: '' }}
                      dropdownButtonStyle={styles.modalDropdown}
                      onChangeValue={(value) => {
                        console.log('Payment mode changed to:', value);
                        setReferralPaymentMode(value);
                      }}
                    />
                  </View>
                )}
              </ScrollView>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setReferralModalVisible(false);
                  setReferralAmount('');
                  setReferralPaymentStatus('');
                  setReferralPaymentMode('');
                  setReferralAmountError('');
                  setDropdownValue({ label: '', value: '' });
                  setSelectedAgentForReferral(null);
                  setReferredBy('');
                }}
              >
                <Text style={styles.modalCancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleReferralSubmit}
              >
                <Text style={styles.modalSubmitButtonText}>SUBMIT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeView>
  );
}


/* FIELD */
const Field = ({label,name,control,errors,rules={},required,keyboard="default"}:any)=>(
  <View>
    <Text style={styles.label}>{label}</Text>
    <Controller control={control} name={name} rules={rules}
      render={({field:{value,onChange},fieldState:{error}})=>(
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={label}
          keyboardType={keyboard}
          style={[styles.input,error && {borderColor:"red",borderWidth:2}]}
        />
      )}/>
    {errors?.[name] && <Text style={{color:"red",marginBottom:6,fontSize:11 }}>{errors[name]?.message}</Text>}
  </View>
);


/* STYLES */
const H=Dimensions.get("window").height;
const styles=StyleSheet.create({
  page:{flex:1,alignItems:"center",backgroundColor:"#F5F7FA"},
  card:{width:"90%",backgroundColor:"#fff",borderRadius:18,elevation:6,padding:18,minHeight:H*0.55,maxHeight:H*0.60,marginTop:8,borderLeftWidth:7,borderLeftColor:"#004C93"},
  scroll:{paddingBottom:60},
  title:{fontSize:22,fontWeight:"bold",textAlign:"center"},
  sub:{fontSize:13,textAlign:"center",color:"#666",marginBottom:15},
  label:{fontSize:13,fontWeight:"600",marginBottom:6,color:"#000"},
  input:{height:48,borderWidth:1,borderColor:"#000",borderRadius:10,paddingLeft:10,marginBottom:10,width:"97%"},


  drop:{height:48,borderWidth:1,borderColor:"BFC4CA",borderRadius:10,justifyContent:"center",paddingLeft:12,marginBottom:10,width:"97%"},
  list:{backgroundColor:"#fff",borderWidth:1,borderColor:"#BFC4CA",borderRadius:10,marginBottom:14,overflow:"hidden"},
  option:{padding:12,borderBottomWidth:1,borderBottomColor:"#eee"},

  upload:{height:44,borderWidth:1,borderColor:"#004C93",borderRadius:10,alignItems:"center",justifyContent:"center",marginBottom:14},

  refWrap:{flexDirection:"row",alignItems:"center",marginBottom:10},
  refBox:{flex:1,height:48,borderWidth:1,borderRadius:10,borderColor:"#000",justifyContent:"center",paddingLeft:12},
  addBtn:{width:44,height:44,borderRadius:22,backgroundColor:"#004C93",justifyContent:"center",alignItems:"center",marginLeft:10},
  addTxt:{color:"#fff",fontSize:22,fontWeight:"bold"},

  /* 🔥 dropdown under referral */
  refDropdown:{backgroundColor:"#fff",borderWidth:1,borderRadius:10,borderColor:"#BFC4CA",marginBottom:16},
  refOption:{padding:12,borderBottomWidth:1,borderBottomColor:"#eee"},

  btn:{width:"80%",height:45,backgroundColor:"#004C93",borderRadius:10,marginVertical:18},
   /* 🔥 department styles insert here */
   deptBox:{
    height:48,
    borderWidth:1,
    borderColor:"#000",
    borderRadius:10,
    flexDirection:"row",
    alignItems:"center",
    paddingLeft:10,
    marginBottom:10,
     width:"97%"
  },
  deptInput:{
    flex:1,
    fontSize:14,
    color:"#000"
  },
  deptIconWrap:{
    paddingHorizontal:12,
    paddingVertical:6,
    justifyContent:"center",
    alignItems:"center"
  },                   // ← Line 4336 - comma add karo
  inputSpacing: {      // ← Line 4337 se start karo
    marginBottom: 15,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: '#004C93',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
  },
  imageButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: 'contain',
  },
  inputContainer: {
    marginBottom: 10,
  },
  dateInputStyle: {
    height: 44,
    borderWidth: 1,
    borderColor: '#BFC4CA',
    borderRadius: 10,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 0,
    width: Dimensions.get('window').width * 0.9,
    minHeight: 520,
    maxHeight: Dimensions.get('window').height * 0.9,
    flexDirection: 'column',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    color: COLORS.black,
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  modalBody: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flex: 1,
    justifyContent: 'flex-start',
    minHeight: 300,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalField: {
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  modalInput: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 18,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: COLORS.black,
  },
  modalDropdown: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingHorizontal: 18,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: COLORS.black,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    padding: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  modalCancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalCancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  modalSubmitButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalSubmitButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  modalInputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
    backgroundColor: '#FFF5F5',
  },
  modalErrorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginTop: 6,
    fontFamily: 'Poppins-Regular',
    marginLeft: 4,
  },
                  // ← Last me closing brace
});





















