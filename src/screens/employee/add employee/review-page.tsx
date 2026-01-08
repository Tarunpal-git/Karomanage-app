

// import React from "react";
// import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import { useNavigation } from "@react-navigation/native";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import Button from "../../../@ui/button/Button";
// import { useCreateEmployeeMutation } from "../../../apis/hooks/employee/mutation/useCreateEmployee.mutation";
// import { store } from "../../../app/store";
// import { COLORS } from "../../../colors";

// export default function ReviewScreenUI() {
//   const route = useRoute();
//   const navigation = useNavigation();
// const createEmployeeMutation = useCreateEmployeeMutation();
//   const employeeData = (route.params as any)?.employeeData || {};
//   const employeeType = (route.params as any)?.employeeType || "";
//   const salaryType = (route.params as any)?.salaryType || "";
//   const fixedSalary = (route.params as any)?.fixedSalary || "";
//   const designation = (route.params as any)?.designation || "";
//   const salaryAmount = (route.params as any)?.salaryAmount || "";
//   const bankDetailsData = (route.params as any)?.bankDetailsData || {};
//   const educationDetailsData = (route.params as any)?.educationDetailsData || {}
//   const highestQualificationData = (route.params as any)?.highestQualificationData || "";

//   // Debug: Check what data we're receiving
//   console.log("🔍 Review Page - Employee Type:", employeeType);
//   console.log("🔍 Review Page - Salary Type:", salaryType);
//   console.log("🔍 Review Page - Fixed Salary:", fixedSalary);
//   console.log("🔍 Review Page - Designation:", designation);
//   console.log("🔍 Review Page - Salary Amount:", salaryAmount);

//   const onBack = () => {
//     (navigation as any).navigate("BankDetails", route.params);
//   };
//   const onPrint = () => {};
//   const onSubmit = async () => {
//     try {
//       // Store se user aur organization data
//       const user = store.getState().auth.authUser;
//       const selectedOrganization = store.getState().auth.selectedOrganization;
      
//       // Payload prepare karein
//       const payload = {
//         user: {
//           userCustomerId: user?.customerId,
//           userCustomerName: user?.customerName,
//           userCustomerEmail: user?.customerEmail,
//           roleName: user?.roleName || "",
//           roleId: user?.roleId || "",
//           userEmployeeId: user?.employeeId || "",
//         },
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         employeeId: `${employeeData.code || 'EMP'}${Date.now().toString().slice(-5)}`,
//         employeeType: employeeType === "Teacher" ? "teacher" : "other",
//         employeeCode: employeeData.code || "",
//         referralAmount: 0,
//         referralpaymentStatus: '',
//         referralPaymentMethod: '',
//         employeePersonalDetails: {
//           employeeFirstname: employeeData.first || '',
//           employeeLastname: employeeData.last || '',
//           employeeEmail: employeeData.email || '',
//           employeePhoneNumber: employeeData.phone || '',
//           employeeCode: employeeData.code || '',
//           employeeGurdianName: employeeData.father || '',
//           employeeGurdianContactNumber: employeeData.fphone || '',
//           employeeAddress: employeeData.address || '',
//           employeeDateOfBirth: employeeData.dob || '',
//           employeeDepartment: employeeData.department || '',
//           employeeDesignation: employeeType === "Teacher" ? "teacher" : designation || '',
//           employeeEducationDetails: highestQualificationData || '',
//           employeeGender: '',
//           referenceByEmployee: ''
//         },
//         employeeProfessionalDetails: {
//           employeeSkills: employeeData.skills ? (Array.isArray(employeeData.skills) ? employeeData.skills : [employeeData.skills]) : [],
//           dateOfJoining: employeeData.doj || '',
//           releventExperienceYear: '',
//           referedBy: '',
//           employeeHighSchoolName: educationDetailsData.hs_name || '',
//           employeeHighSchoolPercentage: educationDetailsData.hs_percentage || '',
//           employeeHighSchoolBoard: educationDetailsData.hs_board || '',
//           employeeHighSchoolAddress: educationDetailsData.hs_address || '',
//           employeeHigherSecondarySchoolName: educationDetailsData.hsc_name || '',
//           employeeHigherSecondarySchoolPercentage: educationDetailsData.hsc_percentage || '',
//           employeeHigherSecondarySchoolBoard: educationDetailsData.hsc_board || '',
//           employeeHigherSecondarySchoolAddress: educationDetailsData.hsc_address || '',
//           employeeUnderGraduationCollegeName: educationDetailsData.grad_name || '',
//           employeeUnderGraduationCollegeCourseName: educationDetailsData.grad_course || '',
//           employeeUnderGraduationCollegeAddress: educationDetailsData.grad_address || '',
//           employeeUnderGraduationCollegePercentage: educationDetailsData.grad_percentage || '',
//           employeePostGraduationCollegeName: educationDetailsData.pg_name || '',
//           employeePostGraduationCollegeCourseName: educationDetailsData.pg_course || '',
//           employeePostGraduationCollegeAddress: educationDetailsData.pg_address || '',
//           employeePostGraduationCollegePercentage: educationDetailsData.pg_percentage || '',
//           employeeAadharCard: '',
//           employeePanCard: ''
//         },
//         employeeBankDetails: {
//           employeeBankName: bankDetailsData.bankName || '',
//           employeeAccountNo: bankDetailsData.accountNo || '',
//           employeeIfsceCode: bankDetailsData.ifsc || ''
//         },
//         employeeSalaryDetails: {
//           type: salaryType === "Fixed Salary Per Month" ? "fixedSalary" : 
//                 salaryType === "Percentage Salary" ? "percentageSalary" :
//                 salaryType === "Fixed and Percentage" ? "fixedAndPercentage" :
//                 salaryType === "Lecture Based" ? "lectureBased" : "fixedSalary",
//           batchId: "",
//           salaryType: {
//             fixedSalary: (salaryType === "Fixed Salary Per Month" || salaryType === "Fixed and Percentage") ? {
//               fixedSalaryValue: parseInt(fixedSalary) || 0
//             } : {},
//             percentageSalary: (salaryType === "Percentage Salary" || salaryType === "Fixed and Percentage") ? {
//               percentageSalaryValue: parseInt(salaryAmount || fixedSalary) || 0
//             } : {},
//             lectureBased: salaryType === "Lecture Based" ? [{
//               batchId: '',
//               subjects: [{
//                 subjectId: '',
//                 lectureAmount: parseInt(fixedSalary) || 0
//               }]
//             }] : {}
//           }
//         }
//       };
  
//       console.log('📤 Sending employee data:', JSON.stringify(payload, null, 2));
  
//       // API call
//       const response = await createEmployeeMutation.mutateAsync(payload);
      
//       console.log('📥 API Response:', response);
      
//       if (response?.statusCode === 200) {
//         // Success
//         console.log("✅ Employee created successfully!");
//         (navigation as any).navigate("EmployeeList");
//       } else {
//         console.error("❌ Error:", response?.message || "Failed to create employee");
//       }
//     } catch (error) {
//       console.error("❌ Error creating employee:", error);
//     }
//   };
//   const getFieldValue = (value: any) => {
//     if (!value || value === "" || value === null || value === undefined) {
//       return "-";
//     }
//     return String(value);
//   };

//   // ⭐ Updated row layout with aligned colon
//   const Row = ({ label, value }: any) => (
//     <View style={styles.row}>

//       <View style={styles.leftSide}>
//         <ScalableText style={styles.rowLabel}>{label}</ScalableText>
//         <ScalableText style={styles.colonText}>:</ScalableText>
//       </View>

//       <ScalableText style={styles.rowValue}>{value}</ScalableText>
//     </View>
//   );

//   const renderSection = (title: string, children: any) => (
//     <View style={styles.section}>
//       <View style={styles.sectionHeader}>
//         <ScalableText style={styles.sectionTitle}>{title}</ScalableText>
//       </View>
//       <View style={styles.sectionContent}>{children}</View>
//     </View>
//   );

//   return (
//     <SafeView>
//       <AppHeader
//         title="Review Page"
//         showDrawer={false}
//         handleBackClick={onBack}
//       />

//       <View style={styles.screenRoot}>
        
//         <View style={styles.mainContainer}>
          
//           <View style={styles.fullWidthPanel}>
//             <ScrollView
//               style={styles.scrollView}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.scrollContent}
//             >

//               <View style={styles.reviewHeader}>
//                 <ScalableText style={styles.stepIndicator}>
//                   Check Your Filled Details
//                 </ScalableText>
//               </View>

//               {renderSection("👔 Employee Personal Details", (
//                 <>
//                 <Row label="First Name" value={getFieldValue(employeeData.first)} />
//                 <Row label="Last Name" value={getFieldValue(employeeData.last)} />
//                 <Row label="Mobile Number" value={getFieldValue(employeeData.phone)} />
//                 <Row label="Email" value={getFieldValue(employeeData.email)} />
//                <Row label="Date of Birth" value={getFieldValue(employeeData.dob)} />
//                 <Row label="Father Name" value={getFieldValue(employeeData.father)} />
//                 <Row label="Father Mobile No" value={getFieldValue(employeeData.fphone)} />
//                 <Row label="Department" value={getFieldValue(employeeData.department)} />
//                 <Row label="Employee Skills" value={getFieldValue(employeeData.skills)} />
//          </>
//          ))}  

// {highestQualificationData && Object.keys(highestQualificationData).length > 0 && educationDetailsData && Object.keys(educationDetailsData).length > 0 && renderSection("🎓 Education Details", (
//   <>
//     {/* High School - Always show if education details exist */}
//     {educationDetailsData.hs_name && (
//       <>
//         <Row label="High School Name" value={getFieldValue(educationDetailsData.hs_name)} />
//         <Row label="HS Percentage" value={getFieldValue(educationDetailsData.hs_percentage)} />
//         <Row label="HS Board" value={getFieldValue(educationDetailsData.hs_board)} />
//         <Row label="HS Address" value={getFieldValue(educationDetailsData.hs_address)} />
//       </>
//     )}
    
//     {/* Higher Secondary - Show if hsc_name exists */}
//     {educationDetailsData.hsc_name && (
//       <>
//         <Row label="Higher Secondary School Name" value={getFieldValue(educationDetailsData.hsc_name)} />
//         <Row label="HSC Percentage" value={getFieldValue(educationDetailsData.hsc_percentage)} />
//         <Row label="HSC Board" value={getFieldValue(educationDetailsData.hsc_board)} />
//         <Row label="HSC Address" value={getFieldValue(educationDetailsData.hsc_address)} />
//       </>
//     )}
    
//     {/* Graduation - Show if grad_name exists */}
//     {educationDetailsData.grad_name && (
//       <>
//         <Row label="Graduation College Name" value={getFieldValue(educationDetailsData.grad_name)} />
//         <Row label="Graduation Percentage" value={getFieldValue(educationDetailsData.grad_percentage)} />
//         <Row label="Graduation Course" value={getFieldValue(educationDetailsData.grad_course)} />
//         <Row label="Graduation Address" value={getFieldValue(educationDetailsData.grad_address)} />
//       </>
//     )}
    
//     {/* Post Graduation - Show if pg_name exists */}
//     {educationDetailsData.pg_name && (
//       <>
//         <Row label="Post Graduation College Name" value={getFieldValue(educationDetailsData.pg_name)} />
//         <Row label="PG Percentage" value={getFieldValue(educationDetailsData.pg_percentage)} />
//         <Row label="PG Course" value={getFieldValue(educationDetailsData.pg_course)} />
//         <Row label="PG Address" value={getFieldValue(educationDetailsData.pg_address)} />
//       </>
//     )}
//   </>
// ))}

//               {renderSection("💰 Monthly Salary", (
//                 <>
//                   {/* Designation Field */}
//                   <Row 
//                     label="Employee designation" 
//                     value={getFieldValue(employeeType === "Teacher" ? "Teacher" : designation)} 
//                   />
                  
//                   {/* Salary Type Field */}
//                   <Row label="Salary type" value={getFieldValue(salaryType)} />
                  
//                   {/* Salary Values - Conditional based on salaryType */}
//                   {salaryType === "Fixed Salary Per Month" && (
//                     <Row label="Salary flat value" value={getFieldValue(fixedSalary)} />
//                   )}
                  
//                   {salaryType === "Percentage Salary" && (
//                     <Row label="Salary percentage value" value={getFieldValue(fixedSalary)} />
//                   )}
                  
//                   {salaryType === "Fixed and Percentage" && (
//                     <>
//                       <Row label="Salary flat value" value={getFieldValue(fixedSalary)} />
//                       <Row label="Salary percentage value" value={getFieldValue(salaryAmount)} />
//                     </>
//                   )}
                  
//                   {salaryType === "Lecture Based" && (
//                     <Row label="Salary per lecture" value={getFieldValue(fixedSalary)} />
//                   )}
//                 </>
//               ))}

//               {renderSection("🏦 Bank Details", (
//                 <>
//                   <Row label="Bank Name" value={getFieldValue(bankDetailsData.bankName)} />
//                   <Row label="Account Number" value={getFieldValue(bankDetailsData.accountNo)} />
//                   <Row label="IFSC Code" value={getFieldValue(bankDetailsData.ifsc)} />
//                 </>
//               ))}

//             </ScrollView>
//           </View>

//         </View>

//         {/* bottom buttons */}
//         <View style={styles.buttonBelowCardWrapper}>
//           <View style={styles.buttonRow}>
//             <Button 
//               title="BACK" 
//               onPress={onBack}
//               btnStyles={styles.backBtn}
//               btnTxtStyles={styles.backBtnText}
//             />
//             <Button 
//               title="PRINT"
//               onPress={onPrint}
//               btnStyles={styles.printBtn}
//               btnTxtStyles={styles.printBtnText}
//             />
//             <Button 
//              title={createEmployeeMutation.isPending ? "SUBMITTING..." : "SUBMIT"}
//              onPress={onSubmit}
//              btnStyles={styles.submitBtn}
//              btnTxtStyles={styles.submitBtnText}
//              disabled={createEmployeeMutation.isPending}
//             />
//           </View>
//         </View>

//       </View>
//     </SafeView>
//   );
// }

// const styles = StyleSheet.create({
//   screenRoot: {
//     flex: 1, 
//     backgroundColor: COLORS.whiteSmoke,
//     paddingHorizontal: 8,
//     paddingTop: 20,
//   },
//   mainContainer: { flex: 1 },
//   fullWidthPanel: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 16,
//     elevation: 3,
//     maxHeight: Dimensions.get("window").height * 0.65,
//   },
//   scrollView: { flex: 1 },
//   scrollContent: { padding: 24, paddingBottom: 40 },

//   reviewHeader: {
//     marginBottom: 24,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E0E0E0",
//   },
//   stepIndicator: { fontSize: 16, color: "#666" },

//   section: {
//     marginBottom: 24,
//     backgroundColor: "#FAFAFA",
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   sectionHeader: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   sectionContent: { padding: 20 },

//   // ⭐ Perfect colon alignment here
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     marginBottom: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E6E6E6",
//   },
//   leftSide: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "48%"    // makes colon fixed alignment ⭐
//   },
//   rowLabel: {
//     fontSize: 14,
//     color: "#555",
//   },
//   colonText: {
//     fontSize: 14,
//     color: COLORS.black,
//     fontWeight: "600",
//     marginLeft: 4,
//   },
//   rowValue: {
//     flex: 1,
//     fontSize: 14,
//     color: COLORS.black,
//     fontWeight: "500",
//     textAlign: "left",
//   },

//   buttonBelowCardWrapper: {
//     marginTop: 16,
//     alignItems: "center",
//     marginBottom: "30%",
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "90%",
//     gap: 12,
//   },
//   backBtn: {
//     flex: 1,
//     borderRadius: 12,
//     backgroundColor: "#E0E0E0",
//   },
//   backBtnText: { 
//     fontSize: 16, 
//     color: COLORS.black 
//   },

//   printBtn: {
//     flex: 1,
//     borderRadius: 12,
//     backgroundColor: "#007AFF",
//   },
//   printBtnText: { 
//     fontSize: 16, 
//     color: COLORS.white 
//   },

//   submitBtn: {
//     flex: 1,
//     borderRadius: 12,
//     backgroundColor: COLORS.primary,
//   },
//   submitBtnText: { 
//     fontSize: 16, 
//     color: COLORS.white 
//   },
// });





// import React from "react";
// import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import { useNavigation } from "@react-navigation/native";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import Button from "../../../@ui/button/Button";
// import { useCreateEmployeeMutation } from "../../../apis/hooks/employee/mutation/useCreateEmployee.mutation";
// import { store } from "../../../app/store";
// import { COLORS } from "../../../colors";

// export default function ReviewScreenUI() {
//   const route = useRoute();
//   const navigation = useNavigation();
// const createEmployeeMutation = useCreateEmployeeMutation();
//   const employeeData = (route.params as any)?.employeeData || {};
//   const employeeType = (route.params as any)?.employeeType || "";
//   const salaryType = (route.params as any)?.salaryType || "";
//   const fixedSalary = (route.params as any)?.fixedSalary || "";
//   const designation = (route.params as any)?.designation || "";
//   const salaryAmount = (route.params as any)?.salaryAmount || "";
//   const bankDetailsData = (route.params as any)?.bankDetailsData || {};
//   const educationDetailsData = (route.params as any)?.educationDetailsData || {}
//   const highestQualificationData = (route.params as any)?.highestQualificationData || "";

//   // Debug: Check what data we're receiving
//   console.log("🔍 Review Page - Employee Type:", employeeType);
//   console.log("🔍 Review Page - Salary Type:", salaryType);
//   console.log("🔍 Review Page - Fixed Salary:", fixedSalary);
//   console.log("🔍 Review Page - Designation:", designation);
//   console.log("🔍 Review Page - Salary Amount:", salaryAmount);

//   const onBack = () => {
//     (navigation as any).navigate("BankDetails", route.params);
//   };
//   const onPrint = () => {};
//   const onSubmit = async () => {
//     try {
//       // Store se user aur organization data
//       const user = store.getState().auth.authUser;
//       const selectedOrganization = store.getState().auth.selectedOrganization;
      
//       // Payload prepare karein
//       const payload = {
//         user: {
//           userCustomerId: user?.customerId,
//           userCustomerName: user?.customerName,
//           userCustomerEmail: user?.customerEmail,
//           roleName: user?.roleName || "",
//           roleId: user?.roleId || "",
//           userEmployeeId: user?.employeeId || "",
//         },
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         employeeId: `${employeeData.code || 'EMP'}${Date.now().toString().slice(-5)}`,
//         employeeType: employeeType === "Teacher" ? "teacher" : "other",
//         employeeCode: employeeData.code || "",
//         referralAmount: 0,
//         referralpaymentStatus: '',
//         referralPaymentMethod: '',
//         employeePersonalDetails: {
//           employeeFirstname: employeeData.first || '',
//           employeeLastname: employeeData.last || '',
//           employeeEmail: employeeData.email || '',
//           employeePhoneNumber: employeeData.phone || '',
//           employeeCode: employeeData.code || '',
//           employeeGurdianName: employeeData.father || '',
//           employeeGurdianContactNumber: employeeData.fphone || '',
//           employeeAddress: employeeData.address || '',
//           employeeDateOfBirth: employeeData.dob || '',
//           employeeDepartment: employeeData.department || '',
//           employeeDesignation: employeeType === "Teacher" ? "teacher" : designation || '',
//           employeeEducationDetails: highestQualificationData || '',
//           employeeGender: '',
//           referenceByEmployee: ''
//         },
//         employeeProfessionalDetails: {
//           employeeSkills: employeeData.skills ? (Array.isArray(employeeData.skills) ? employeeData.skills : [employeeData.skills]) : [],
//           dateOfJoining: employeeData.doj || '',
//           releventExperienceYear: '',
//           referedBy: '',
//           employeeHighSchoolName: educationDetailsData.hs_name || '',
//           employeeHighSchoolPercentage: educationDetailsData.hs_percentage || '',
//           employeeHighSchoolBoard: educationDetailsData.hs_board || '',
//           employeeHighSchoolAddress: educationDetailsData.hs_address || '',
//           employeeHighSchoolCertificate: educationDetailsData.hs_certificate || '',
//           employeeHigherSecondarySchoolName: educationDetailsData.hsc_name || '',
//           employeeHigherSecondarySchoolPercentage: educationDetailsData.hsc_percentage || '',
//           employeeHigherSecondarySchoolBoard: educationDetailsData.hsc_board || '',
//           employeeHigherSecondarySchoolAddress: educationDetailsData.hsc_address || '',
//           employeeHigherSecondaryCertificate: educationDetailsData.hsc_certificate || '',
//           employeeUnderGraduationCollegeName: educationDetailsData.grad_name || '',
//           employeeUnderGraduationCollegeCourseName: educationDetailsData.grad_course || '',
//           employeeUnderGraduationCollegeAddress: educationDetailsData.grad_address || '',
//           employeeUnderGraduationCollegePercentage: educationDetailsData.grad_percentage || '',
//           employeeUnderGraduationCertificate: educationDetailsData.grad_certificate || '',
//           employeePostGraduationCollegeName: educationDetailsData.pg_name || '',
//           employeePostGraduationCollegeCourseName: educationDetailsData.pg_course || '',
//           employeePostGraduationCollegeAddress: educationDetailsData.pg_address || '',
//           employeePostGraduationCollegePercentage: educationDetailsData.pg_percentage || '',
//           employeePostGraduationCertificate: educationDetailsData.pg_certificate || '',
//           employeeAadharCard: '',
//           employeePanCard: ''
//         },
//         employeeBankDetails: {
//           employeeBankName: bankDetailsData.bankName || '',
//           employeeAccountNo: bankDetailsData.accountNo || '',
//           employeeIfsceCode: bankDetailsData.ifsc || ''
//         },
//         employeeSalaryDetails: {
//           type: salaryType === "Fixed Salary Per Month" ? "fixedSalary" : 
//                 salaryType === "Percentage Salary" ? "percentageSalary" :
//                 salaryType === "Fixed and Percentage" ? "fixedAndPercentage" :
//                 salaryType === "Lecture Based" ? "lectureBased" : "fixedSalary",
//           batchId: "",
//           salaryType: {
//             fixedSalary: (salaryType === "Fixed Salary Per Month" || salaryType === "Fixed and Percentage") ? {
//               fixedSalaryValue: parseInt(fixedSalary) || 0
//             } : {},
//             percentageSalary: (salaryType === "Percentage Salary" || salaryType === "Fixed and Percentage") ? {
//               percentageSalaryValue: parseInt(salaryAmount || fixedSalary) || 0
//             } : {},
//             lectureBased: salaryType === "Lecture Based" ? [{
//               batchId: '',
//               subjects: [{
//                 subjectId: '',
//                 lectureAmount: parseInt(fixedSalary) || 0
//               }]
//             }] : {}
//           }
//         }
//       };
  
//       console.log('📤 Sending employee data:', JSON.stringify(payload, null, 2));
  
//       // API call
//       const response = await createEmployeeMutation.mutateAsync(payload);
      
//       console.log('📥 API Response:', response);
      
//       if (response?.statusCode === 200) {
//         // Success
//         console.log("✅ Employee created successfully!");
//         (navigation as any).navigate("EmployeeList");
//       } else {
//         console.error("❌ Error:", response?.message || "Failed to create employee");
//       }
//     } catch (error) {
//       console.error("❌ Error creating employee:", error);
//     }
//   };
//   const getFieldValue = (value: any) => {
//     if (!value || value === "" || value === null || value === undefined) {
//       return "-";
//     }
//     return String(value);
//   };

//   // ⭐ Updated row layout with aligned colon
//   const Row = ({ label, value }: any) => (
//     <View style={styles.row}>

//       <View style={styles.leftSide}>
//         <ScalableText style={styles.rowLabel}>{label}</ScalableText>
//         <ScalableText style={styles.colonText}>:</ScalableText>
//       </View>

//       <ScalableText style={styles.rowValue}>{value}</ScalableText>
//     </View>
//   );

//   const renderSection = (title: string, children: any) => (
//     <View style={styles.section}>
//       <View style={styles.sectionHeader}>
//         <ScalableText style={styles.sectionTitle}>{title}</ScalableText>
//       </View>
//       <View style={styles.sectionContent}>{children}</View>
//     </View>
//   );

//   return (
//     <SafeView>
//       <AppHeader
//         title="Review Page"
//         showDrawer={false}
//         handleBackClick={onBack}
//       />

//       <View style={styles.screenRoot}>
        
//         <View style={styles.mainContainer}>
          
//           <View style={styles.fullWidthPanel}>
//             <ScrollView
//               style={styles.scrollView}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.scrollContent}
//             >

//               <View style={styles.reviewHeader}>
//                 <ScalableText style={styles.stepIndicator}>
//                   Check Your Filled Details
//                 </ScalableText>
//               </View>

//               {renderSection("👔 Employee Personal Details", (
//                 <>
//                 <Row label="First Name" value={getFieldValue(employeeData.first)} />
//                 <Row label="Last Name" value={getFieldValue(employeeData.last)} />
//                 <Row label="Mobile Number" value={getFieldValue(employeeData.phone)} />
//                 <Row label="Email" value={getFieldValue(employeeData.email)} />
//                <Row label="Date of Birth" value={getFieldValue(employeeData.dob)} />
//                 <Row label="Father Name" value={getFieldValue(employeeData.father)} />
//                 <Row label="Father Mobile No" value={getFieldValue(employeeData.fphone)} />
//                 <Row label="Department" value={getFieldValue(employeeData.department)} />
//                 <Row label="Employee Skills" value={getFieldValue(employeeData.skills)} />
//          </>
//          ))}  

// {highestQualificationData && Object.keys(highestQualificationData).length > 0 && educationDetailsData && Object.keys(educationDetailsData).length > 0 && renderSection("🎓 Education Details", (
//   <>
//     {/* High School - Always show if education details exist */}
//     {educationDetailsData.hs_name && (
//       <>
//         <Row label="High School Name" value={getFieldValue(educationDetailsData.hs_name)} />
//         <Row label="HS Percentage" value={getFieldValue(educationDetailsData.hs_percentage)} />
//         <Row label="HS Board" value={getFieldValue(educationDetailsData.hs_board)} />
//         <Row label="HS Address" value={getFieldValue(educationDetailsData.hs_address)} />
//       </>
//     )}
    
//     {/* Higher Secondary - Show if hsc_name exists */}
//     {educationDetailsData.hsc_name && (
//       <>
//         <Row label="Higher Secondary School Name" value={getFieldValue(educationDetailsData.hsc_name)} />
//         <Row label="HSC Percentage" value={getFieldValue(educationDetailsData.hsc_percentage)} />
//         <Row label="HSC Board" value={getFieldValue(educationDetailsData.hsc_board)} />
//         <Row label="HSC Address" value={getFieldValue(educationDetailsData.hsc_address)} />
//       </>
//     )}
    
//     {/* Graduation - Show if grad_name exists */}
//     {educationDetailsData.grad_name && (
//       <>
//         <Row label="Graduation College Name" value={getFieldValue(educationDetailsData.grad_name)} />
//         <Row label="Graduation Percentage" value={getFieldValue(educationDetailsData.grad_percentage)} />
//         <Row label="Graduation Course" value={getFieldValue(educationDetailsData.grad_course)} />
//         <Row label="Graduation Address" value={getFieldValue(educationDetailsData.grad_address)} />
//       </>
//     )}
    
//     {/* Post Graduation - Show if pg_name exists */}
//     {educationDetailsData.pg_name && (
//       <>
//         <Row label="Post Graduation College Name" value={getFieldValue(educationDetailsData.pg_name)} />
//         <Row label="PG Percentage" value={getFieldValue(educationDetailsData.pg_percentage)} />
//         <Row label="PG Course" value={getFieldValue(educationDetailsData.pg_course)} />
//         <Row label="PG Address" value={getFieldValue(educationDetailsData.pg_address)} />
//       </>
//     )}
//   </>
// ))}

//               {renderSection("💰 Monthly Salary", (
//                 <>
//                   {/* Designation Field */}
//                   <Row 
//                     label="Employee designation" 
//                     value={getFieldValue(employeeType === "Teacher" ? "Teacher" : designation)} 
//                   />
                  
//                   {/* Salary Type Field */}
//                   <Row label="Salary type" value={getFieldValue(salaryType)} />
                  
//                   {/* Salary Values - Conditional based on salaryType */}
//                   {salaryType === "Fixed Salary Per Month" && (
//                     <Row label="Salary flat value" value={getFieldValue(fixedSalary)} />
//                   )}
                  
//                   {salaryType === "Percentage Salary" && (
//                     <Row label="Salary percentage value" value={getFieldValue(fixedSalary)} />
//                   )}
                  
//                   {salaryType === "Fixed and Percentage" && (
//                     <>
//                       <Row label="Salary flat value" value={getFieldValue(fixedSalary)} />
//                       <Row label="Salary percentage value" value={getFieldValue(salaryAmount)} />
//                     </>
//                   )}
                  
//                   {salaryType === "Lecture Based" && (
//                     <Row label="Salary per lecture" value={getFieldValue(fixedSalary)} />
//                   )}
//                 </>
//               ))}

//               {renderSection("🏦 Bank Details", (
//                 <>
//                   <Row label="Bank Name" value={getFieldValue(bankDetailsData.bankName)} />
//                   <Row label="Account Number" value={getFieldValue(bankDetailsData.accountNo)} />
//                   <Row label="IFSC Code" value={getFieldValue(bankDetailsData.ifsc)} />
//                 </>
//               ))}

//             </ScrollView>
//           </View>

//         </View>

//         {/* bottom buttons */}
//         <View style={styles.buttonBelowCardWrapper}>
//           <View style={styles.buttonRow}>
//             <Button 
//               title="BACK" 
//               onPress={onBack}
//               btnStyles={styles.backBtn}
//               btnTxtStyles={styles.backBtnText}
//             />
//             <Button 
//               title="PRINT"
//               onPress={onPrint}
//               btnStyles={styles.printBtn}
//               btnTxtStyles={styles.printBtnText}
//             />
//             <Button 
//              title={createEmployeeMutation.isPending ? "SUBMITTING..." : "SUBMIT"}
//              onPress={onSubmit}
//              btnStyles={styles.submitBtn}
//              btnTxtStyles={styles.submitBtnText}
//              disabled={createEmployeeMutation.isPending}
//             />
//           </View>
//         </View>

//       </View>
//     </SafeView>
//   );
// }

// const styles = StyleSheet.create({
//   screenRoot: {
//     flex: 1, 
//     backgroundColor: COLORS.whiteSmoke,
//     paddingHorizontal: 8,
//     paddingTop: 20,
//   },
//   mainContainer: { flex: 1 },
//   fullWidthPanel: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 16,
//     elevation: 3,
//     maxHeight: Dimensions.get("window").height * 0.65,
//   },
//   scrollView: { flex: 1 },
//   scrollContent: { padding: 24, paddingBottom: 40 },

//   reviewHeader: {
//     marginBottom: 24,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E0E0E0",
//   },
//   stepIndicator: { fontSize: 16, color: "#666" },

//   section: {
//     marginBottom: 24,
//     backgroundColor: "#FAFAFA",
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   sectionHeader: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   sectionContent: { padding: 20 },

//   // ⭐ Perfect colon alignment here
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     marginBottom: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E6E6E6",
//   },
//   leftSide: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "48%"    // makes colon fixed alignment ⭐
//   },
//   rowLabel: {
//     fontSize: 14,
//     color: "#555",
//   },
//   colonText: {
//     fontSize: 14,
//     color: COLORS.black,
//     fontWeight: "600",
//     marginLeft: 4,
//   },
//   rowValue: {
//     flex: 1,
//     fontSize: 14,
//     color: COLORS.black,
//     fontWeight: "500",
//     textAlign: "left",
//   },

//   buttonBelowCardWrapper: {
//     marginTop: 16,
//     alignItems: "center",
//     marginBottom: "30%",
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "90%",
//     gap: 12,
//   },
//   backBtn: {
//     flex: 1,
//     borderRadius: 12,
//     backgroundColor: "#E0E0E0",
//   },
//   backBtnText: { 
//     fontSize: 16, 
//     color: COLORS.black 
//   },

//   printBtn: {
//     flex: 1,
//     borderRadius: 12,
//     backgroundColor: "#007AFF",
//   },
//   printBtnText: { 
//     fontSize: 16, 
//     color: COLORS.white 
//   },

//   submitBtn: {
//     flex: 1,
//     borderRadius: 12,
//     backgroundColor: COLORS.primary,
//   },
//   submitBtnText: { 
//     fontSize: 16, 
//     color: COLORS.white 
//   },
// });

// ye sahi he
// import React from "react";
// import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import { useNavigation } from "@react-navigation/native";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import Button from "../../../@ui/button/Button";
// import { useCreateEmployeeMutation } from "../../../apis/hooks/employee/mutation/useCreateEmployee.mutation";
// import { store } from "../../../app/store";
// import { COLORS } from "../../../colors";

// export default function ReviewScreenUI() {
//   const route = useRoute();
//   const navigation = useNavigation();
// const createEmployeeMutation = useCreateEmployeeMutation();
//   const employeeData = (route.params as any)?.employeeData || {};
//   const employeeType = (route.params as any)?.employeeType || "";
//   const salaryType = (route.params as any)?.salaryType || "";
//   const fixedSalary = (route.params as any)?.fixedSalary || "";
//   const designation = (route.params as any)?.designation || "";
//   const salaryAmount = (route.params as any)?.salaryAmount || "";
//   const bankDetailsData = (route.params as any)?.bankDetailsData || {};
//   const educationDetailsData = (route.params as any)?.educationDetailsData || {}
//   const highestQualificationData = (route.params as any)?.highestQualificationData || "";

//   // Debug: Check what data we're receiving
//   console.log("🔍 Review Page - Employee Type:", employeeType);
//   console.log("🔍 Review Page - Salary Type:", salaryType);
//   console.log("🔍 Review Page - Fixed Salary:", fixedSalary);
//   console.log("🔍 Review Page - Designation:", designation);
//   console.log("🔍 Review Page - Salary Amount:", salaryAmount);

//   const onBack = () => {
//     (navigation as any).navigate("BankDetails", route.params);
//   };
//   const onPrint = () => {};
//   const onSubmit = async () => {
//     try {
//       // Store se user aur organization data
//       const user = store.getState().auth.authUser;
//       const selectedOrganization = store.getState().auth.selectedOrganization;
      
//       // Payload prepare karein
//       const payload = {
//         user: {
//           userCustomerId: user?.customerId,
//           userCustomerName: user?.customerName,
//           userCustomerEmail: user?.customerEmail,
//           roleName: user?.roleName || "",
//           roleId: user?.roleId || "",
//           userEmployeeId: user?.employeeId || "",
//         },
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         employeeId: `${employeeData.code || 'EMP'}${Date.now().toString().slice(-5)}`,
//         employeeType: employeeType === "Teacher" ? "teacher" : "other",
//         employeeCode: employeeData.code || "",
//         referralAmount: 0,
//         referralpaymentStatus: '',
//         referralPaymentMethod: '',
//         employeePersonalDetails: {
//           employeeFirstname: employeeData.first || '',
//           employeeLastname: employeeData.last || '',
//           employeeEmail: employeeData.email || '',
//           employeePhoneNumber: employeeData.phone || '',
//           employeeCode: employeeData.code || '',
//           employeeGurdianName: employeeData.father || '',
//           employeeGurdianContactNumber: employeeData.fphone || '',
//           employeeAddress: employeeData.address || '',
//           employeeDateOfBirth: employeeData.dob || '',
//           employeeDepartment: employeeData.department || '',
//           employeeDesignation: employeeType === "Teacher" ? "teacher" : designation || '',
//           employeeEducationDetails: highestQualificationData || '',
//           employeeGender: '',
//           referenceByEmployee: ''
//         },
//         employeeProfessionalDetails: {
//           employeeSkills: employeeData.skills ? (Array.isArray(employeeData.skills) ? employeeData.skills : [employeeData.skills]) : [],
//           dateOfJoining: employeeData.doj || '',
//           releventExperienceYear: '',
//           referedBy: '',
//           employeeHighSchoolName: educationDetailsData.hs_name || '',
//           employeeHighSchoolPercentage: educationDetailsData.hs_percentage || '',
//           employeeHighSchoolBoard: educationDetailsData.hs_board || '',
//           employeeHighSchoolAddress: educationDetailsData.hs_address || '',
//           employeeHighSchoolCertificate: educationDetailsData.hs_certificate || '',
//           employeeHigherSecondarySchoolName: educationDetailsData.hsc_name || '',
//           employeeHigherSecondarySchoolPercentage: educationDetailsData.hsc_percentage || '',
//           employeeHigherSecondarySchoolBoard: educationDetailsData.hsc_board || '',
//           employeeHigherSecondarySchoolAddress: educationDetailsData.hsc_address || '',
//           employeeHigherSecondaryCertificate: educationDetailsData.hsc_certificate || '',
//           employeeUnderGraduationCollegeName: educationDetailsData.grad_name || '',
//           employeeUnderGraduationCollegeCourseName: educationDetailsData.grad_course || '',
//           employeeUnderGraduationCollegeAddress: educationDetailsData.grad_address || '',
//           employeeUnderGraduationCollegePercentage: educationDetailsData.grad_percentage || '',
//           employeeUnderGraduationCertificate: educationDetailsData.grad_certificate || '',
//           employeePostGraduationCollegeName: educationDetailsData.pg_name || '',
//           employeePostGraduationCollegeCourseName: educationDetailsData.pg_course || '',
//           employeePostGraduationCollegeAddress: educationDetailsData.pg_address || '',
//           employeePostGraduationCollegePercentage: educationDetailsData.pg_percentage || '',
//           employeePostGraduationCertificate: educationDetailsData.pg_certificate || '',
//           employeeAadharCard: employeeData.aadharImageUri || "",
//           employeePanCard: employeeData.panImageUri || "",

        
//         },
//         employeeBankDetails: {
//           employeeBankName: bankDetailsData.bankName || '',
//           employeeAccountNo: bankDetailsData.accountNo || '',
//           employeeIfsceCode: bankDetailsData.ifsc || ''
//         },
//         employeeSalaryDetails: {
//           type: salaryType === "Fixed Salary Per Month" ? "fixedSalary" : 
//                 salaryType === "Percentage Salary" ? "percentageSalary" :
//                 salaryType === "Fixed and Percentage" ? "fixedAndPercentage" :
//                 salaryType === "Lecture Based" ? "lectureBased" : "fixedSalary",
//           batchId: "",
//           salaryType: {
//             fixedSalary: (salaryType === "Fixed Salary Per Month" || salaryType === "Fixed and Percentage") ? {
//               fixedSalaryValue: parseInt(fixedSalary) || 0
//             } : {},
//             percentageSalary: (salaryType === "Percentage Salary" || salaryType === "Fixed and Percentage") ? {
//               percentageSalaryValue: parseInt(salaryAmount || fixedSalary) || 0
//             } : {},
//             lectureBased: salaryType === "Lecture Based" ? [{
//               batchId: '',
//               subjects: [{
//                 subjectId: '',
//                 lectureAmount: parseInt(fixedSalary) || 0
//               }]
//             }] : {}
//           }
//         }
//       };
  
//       console.log('📤 Sending employee data:', JSON.stringify(payload, null, 2));
  
//       // API call
//       const response = await createEmployeeMutation.mutateAsync(payload);
      
//       console.log('📥 API Response:', response);
      
//       if (response?.statusCode === 200) {
//         // Success
//         console.log("✅ Employee created successfully!");
//         (navigation as any).navigate("EmployeeList");
//       } else {
//         console.error("❌ Error:", response?.message || "Failed to create employee");
//       }
//     } catch (error) {
//       console.error("❌ Error creating employee:", error);
//     }
//   };
//   const getFieldValue = (value: any) => {
//     if (!value || value === "" || value === null || value === undefined) {
//       return "-";
//     }
//     return String(value);
//   };

//   // ⭐ Updated row layout with aligned colon
//   const Row = ({ label, value }: any) => (
//     <View style={styles.row}>

//       <View style={styles.leftSide}>
//         <ScalableText style={styles.rowLabel}>{label}</ScalableText>
//         <ScalableText style={styles.colonText}>:</ScalableText>
//       </View>

//       <ScalableText style={styles.rowValue}>{value}</ScalableText>
//     </View>
//   );

//   const renderSection = (title: string, children: any) => (
//     <View style={styles.section}>
//       <View style={styles.sectionHeader}>
//         <ScalableText style={styles.sectionTitle}>{title}</ScalableText>
//       </View>
//       <View style={styles.sectionContent}>{children}</View>
//     </View>
//   );

//   return (
//     <SafeView>
//       <AppHeader
//         title="Review Page"
//         showDrawer={false}
//         handleBackClick={onBack}
//       />

//       <View style={styles.screenRoot}>
        
//         <View style={styles.mainContainer}>
          
//           <View style={styles.fullWidthPanel}>
//             <ScrollView
//               style={styles.scrollView}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.scrollContent}
//             >

//               <View style={styles.reviewHeader}>
//                 <ScalableText style={styles.stepIndicator}>
//                   Check Your Filled Details
//                 </ScalableText>
//               </View>

//               {renderSection("👔 Employee Personal Details", (
//                 <>
//                 <Row label="First Name" value={getFieldValue(employeeData.first)} />
//                 <Row label="Last Name" value={getFieldValue(employeeData.last)} />
//                 <Row label="Mobile Number" value={getFieldValue(employeeData.phone)} />
//                 <Row label="Email" value={getFieldValue(employeeData.email)} />
//                <Row label="Date of Birth" value={getFieldValue(employeeData.dob)} />
//                 <Row label="Father Name" value={getFieldValue(employeeData.father)} />
//                 <Row label="Father Mobile No" value={getFieldValue(employeeData.fphone)} />
//                 <Row label="Department" value={getFieldValue(employeeData.department)} />
//                 <Row label="Employee Skills" value={getFieldValue(employeeData.skills)} />
//          </>
//          ))}  

// {highestQualificationData && Object.keys(highestQualificationData).length > 0 && educationDetailsData && Object.keys(educationDetailsData).length > 0 && renderSection("🎓 Education Details", (
//   <>
//     {/* High School - Always show if education details exist */}
//     {educationDetailsData.hs_name && (
//       <>
//         <Row label="High School Name" value={getFieldValue(educationDetailsData.hs_name)} />
//         <Row label="HS Percentage" value={getFieldValue(educationDetailsData.hs_percentage)} />
//         <Row label="HS Board" value={getFieldValue(educationDetailsData.hs_board)} />
//         <Row label="HS Address" value={getFieldValue(educationDetailsData.hs_address)} />
//       </>
//     )}
    
//     {/* Higher Secondary - Show if hsc_name exists */}
//     {educationDetailsData.hsc_name && (
//       <>
//         <Row label="Higher Secondary School Name" value={getFieldValue(educationDetailsData.hsc_name)} />
//         <Row label="HSC Percentage" value={getFieldValue(educationDetailsData.hsc_percentage)} />
//         <Row label="HSC Board" value={getFieldValue(educationDetailsData.hsc_board)} />
//         <Row label="HSC Address" value={getFieldValue(educationDetailsData.hsc_address)} />
//       </>
//     )}
    
//     {/* Graduation - Show if grad_name exists */}
//     {educationDetailsData.grad_name && (
//       <>
//         <Row label="Graduation College Name" value={getFieldValue(educationDetailsData.grad_name)} />
//         <Row label="Graduation Percentage" value={getFieldValue(educationDetailsData.grad_percentage)} />
//         <Row label="Graduation Course" value={getFieldValue(educationDetailsData.grad_course)} />
//         <Row label="Graduation Address" value={getFieldValue(educationDetailsData.grad_address)} />
//       </>
//     )}
    
//     {/* Post Graduation - Show if pg_name exists */}
//     {educationDetailsData.pg_name && (
//       <>
//         <Row label="Post Graduation College Name" value={getFieldValue(educationDetailsData.pg_name)} />
//         <Row label="PG Percentage" value={getFieldValue(educationDetailsData.pg_percentage)} />
//         <Row label="PG Course" value={getFieldValue(educationDetailsData.pg_course)} />
//         <Row label="PG Address" value={getFieldValue(educationDetailsData.pg_address)} />
//       </>
//     )}
//   </>
// ))}

//               {renderSection("💰 Monthly Salary", (
//                 <>
//                   {/* Designation Field */}
//                   <Row 
//                     label="Employee designation" 
//                     value={getFieldValue(employeeType === "Teacher" ? "Teacher" : designation)} 
//                   />
                  
//                   {/* Salary Type Field */}
//                   <Row label="Salary type" value={getFieldValue(salaryType)} />
                  
//                   {/* Salary Values - Conditional based on salaryType */}
//                   {salaryType === "Fixed Salary Per Month" && (
//                     <Row label="Salary flat value" value={getFieldValue(fixedSalary)} />
//                   )}
                  
//                   {salaryType === "Percentage Salary" && (
//                     <Row label="Salary percentage value" value={getFieldValue(fixedSalary)} />
//                   )}
                  
//                   {salaryType === "Fixed and Percentage" && (
//                     <>
//                       <Row label="Salary flat value" value={getFieldValue(fixedSalary)} />
//                       <Row label="Salary percentage value" value={getFieldValue(salaryAmount)} />
//                     </>
//                   )}
                  
//                   {salaryType === "Lecture Based" && (
//                     <Row label="Salary per lecture" value={getFieldValue(fixedSalary)} />
//                   )}
//                 </>
//               ))}

//               {renderSection("🏦 Bank Details", (
//                 <>
//                   <Row label="Bank Name" value={getFieldValue(bankDetailsData.bankName)} />
//                   <Row label="Account Number" value={getFieldValue(bankDetailsData.accountNo)} />
//                   <Row label="IFSC Code" value={getFieldValue(bankDetailsData.ifsc)} />
//                 </>
//               ))}

//             </ScrollView>
//           </View>

//         </View>

//         {/* bottom buttons */}
//         <View style={styles.buttonBelowCardWrapper}>
//           <View style={styles.buttonRow}>
//             <Button 
//               title="BACK" 
//               onPress={onBack}
//               btnStyles={styles.backBtn}
//               btnTxtStyles={styles.backBtnText}
//             />
//             <Button 
//               title="PRINT"
//               onPress={onPrint}
//               btnStyles={styles.printBtn}
//               btnTxtStyles={styles.printBtnText}
//             />
//             <Button 
//              title={createEmployeeMutation.isPending ? "SUBMITTING..." : "SUBMIT"}
//              onPress={onSubmit}
//              btnStyles={styles.submitBtn}
//              btnTxtStyles={styles.submitBtnText}
//              disabled={createEmployeeMutation.isPending}
//             />
//           </View>
//         </View>

//       </View>
//     </SafeView>
//   );
// }

// const styles = StyleSheet.create({
//   screenRoot: {
//     flex: 1, 
//     backgroundColor: COLORS.whiteSmoke,
//     paddingHorizontal: 8,
//     paddingTop: 20,
//   },
//   mainContainer: { flex: 1 },
//   fullWidthPanel: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 16,
//     elevation: 3,
//     maxHeight: Dimensions.get("window").height * 0.65,
//   },
//   scrollView: { flex: 1 },
//   scrollContent: { padding: 24, paddingBottom: 40 },

//   reviewHeader: {
//     marginBottom: 24,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E0E0E0",
//   },
//   stepIndicator: { fontSize: 16, color: "#666" },

//   section: {
//     marginBottom: 24,
//     backgroundColor: "#FAFAFA",
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   sectionHeader: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   sectionContent: { padding: 20 },

//   // ⭐ Perfect colon alignment here
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     marginBottom: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E6E6E6",
//   },
//   leftSide: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "48%"    // makes colon fixed alignment ⭐
//   },
//   rowLabel: {
//     fontSize: 14,
//     color: "#555",
//   },
//   colonText: {
//     fontSize: 14,
//     color: COLORS.black,
//     fontWeight: "600",
//     marginLeft: 4,
//   },
//   rowValue: {
//     flex: 1,
//     fontSize: 14,
//     color: COLORS.black,
//     fontWeight: "500",
//     textAlign: "left",
//   },

//   buttonBelowCardWrapper: {
//     marginTop: 16,
//     alignItems: "center",
//     marginBottom: "30%",
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "90%",
//     gap: 12,
//   },
//   backBtn: {
//     flex: 1,
//     borderRadius: 12,
//     backgroundColor: "#E0E0E0",
//   },
//   backBtnText: { 
//     fontSize: 16, 
//     color: COLORS.black 
//   },

//   printBtn: {
//     flex: 1,
//     borderRadius: 12,
//     backgroundColor: "#007AFF",
//   },
//   printBtnText: { 
//     fontSize: 16, 
//     color: COLORS.white 
//   },

//   submitBtn: {
//     flex: 1,
//     borderRadius: 12,
//     backgroundColor: COLORS.primary,
//   },
//   submitBtnText: { 
//     fontSize: 16, 
//     color: COLORS.white 
//   },
// });


// import React from "react";
// import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import { useNavigation } from "@react-navigation/native";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import Button from "../../../@ui/button/Button";
// import { useCreateEmployeeMutation } from "../../../apis/hooks/employee/mutation/useCreateEmployee.mutation";
// import { useCreateTeacherMutation } from "../../../apis/hooks/teachers/query/mutation/useCreateTeacher.mutation";
//   // ⭐ ADD KIYA
// import { store } from "../../../app/store";
// import { COLORS } from "../../../colors";

// export default function ReviewScreenUI() {
//   const route = useRoute();
//   const navigation = useNavigation();

//   const createEmployeeMutation = useCreateEmployeeMutation();
//   const createTeacherMutation = useCreateTeacherMutation(); // ⭐ ADD KIYA

//   const employeeData = (route.params as any)?.employeeData || {};
//   const employeeType = (route.params as any)?.employeeType || "";
//   const salaryType = (route.params as any)?.salaryType || "";
//   const fixedSalary = (route.params as any)?.fixedSalary || "";
//   const designation = (route.params as any)?.designation || "";
//   const salaryAmount = (route.params as any)?.salaryAmount || "";
//   const bankDetailsData = (route.params as any)?.bankDetailsData || {};
//   const educationDetailsData = (route.params as any)?.educationDetailsData || {}
//   const highestQualificationData = (route.params as any)?.highestQualificationData || "";
//   const batchId = (route.params as any)?.batchId || "";     // ⭐ ADD
//   const subjectId = (route.params as any)?.subjectId || ""; // ⭐ ADD

//   const onBack = () => {
//     (navigation as any).navigate("BankDetails", route.params);
//   };

//   const onPrint = () => {};

//   // ⭐⭐⭐ MERGED onSubmit — NOTHING REMOVED, ONLY ADDED ⭐⭐⭐
//   const onSubmit = async () => {
//     try {
//       const user = store.getState().auth.authUser;
//       const selectedOrganization = store.getState().auth.selectedOrganization;

//       // EMPLOYEE PAYLOAD
//       const payload = {
//         user: {
//           userCustomerId: user?.customerId,
//           userCustomerName: user?.customerName,
//           userCustomerEmail: user?.customerEmail,
//           roleName: user?.roleName || "",
//           roleId: user?.roleId || "",
//           userEmployeeId: user?.employeeId || "",
//         },
//         customerId: selectedOrganization?.customerId,
//         organizationId: selectedOrganization?.organizationId,
//         employeeId: `${employeeData.code || 'EMP'}${Date.now().toString().slice(-5)}`,
//         employeeType: employeeType === "Teacher" ? "teacher" : "other",
//         employeeCode: employeeData.code || "",
//         referralAmount: 0,
//         referralpaymentStatus: '',
//         referralPaymentMethod: '',
//         employeePersonalDetails: {
//           employeeFirstname: employeeData.first || '',
//           employeeLastname: employeeData.last || '',
//           employeeEmail: employeeData.email || '',
//           employeePhoneNumber: employeeData.phone || '',
//           employeeCode: employeeData.code || '',
//           employeeGurdianName: employeeData.father || '',
//           employeeGurdianContactNumber: employeeData.fphone || '',
//           employeeAddress: employeeData.address || '',
//           employeeDateOfBirth: employeeData.dob || '',
//           employeeDepartment: employeeData.department || '',
//           employeeDesignation: employeeType === "Teacher" ? "teacher" : designation || '',
//           employeeEducationDetails: highestQualificationData || '',
//           employeeGender: '',
//           referenceByEmployee: ''
//         },
//         employeeProfessionalDetails: {
//           employeeSkills: employeeData.skills ? (Array.isArray(employeeData.skills) ? employeeData.skills : [employeeData.skills]) : [],
//           dateOfJoining: employeeData.doj || '',
//           releventExperienceYear: '',
//           referedBy: '',
//           employeeHighSchoolName: educationDetailsData.hs_name || '',
//           employeeHighSchoolPercentage: educationDetailsData.hs_percentage || '',
//           employeeHighSchoolBoard: educationDetailsData.hs_board || '',
//           employeeHighSchoolAddress: educationDetailsData.hs_address || '',
//           employeeHighSchoolCertificate: educationDetailsData.hs_certificate || '',
//           employeeHigherSecondarySchoolName: educationDetailsData.hsc_name || '',
//           employeeHigherSecondarySchoolPercentage: educationDetailsData.hsc_percentage || '',
//           employeeHigherSecondarySchoolBoard: educationDetailsData.hsc_board || '',
//           employeeHigherSecondarySchoolAddress: educationDetailsData.hsc_address || '',
//           employeeHigherSecondaryCertificate: educationDetailsData.hsc_certificate || '',
//           employeeUnderGraduationCollegeName: educationDetailsData.grad_name || '',
//           employeeUnderGraduationCollegeCourseName: educationDetailsData.grad_course || '',
//           employeeUnderGraduationCollegeAddress: educationDetailsData.grad_address || '',
//           employeeUnderGraduationCollegePercentage: educationDetailsData.grad_percentage || '',
//           employeeUnderGraduationCertificate: educationDetailsData.grad_certificate || '',
//           employeePostGraduationCollegeName: educationDetailsData.pg_name || '',
//           employeePostGraduationCollegeCourseName: educationDetailsData.pg_course || '',
//           employeePostGraduationCollegeAddress: educationDetailsData.pg_address || '',
//           employeePostGraduationCollegePercentage: educationDetailsData.pg_percentage || '',
//           employeePostGraduationCertificate: educationDetailsData.pg_certificate || '',
//           employeeAadharCard: employeeData.aadharImageUri || "",
//           employeePanCard: employeeData.panImageUri || "",
//         },
//         employeeBankDetails: {
//           employeeBankName: bankDetailsData.bankName || '',
//           employeeAccountNo: bankDetailsData.accountNo || '',
//           employeeIfsceCode: bankDetailsData.ifsc || ''
//         },
//         employeeSalaryDetails: {
//           type: salaryType === "Fixed Salary Per Month" ? "fixedSalary" : 
//                 salaryType === "Percentage Salary" ? "percentageSalary" :
//                 salaryType === "Fixed and Percentage" ? "fixedAndPercentage" :
//                 salaryType === "Lecture Based" ? "lectureBased" : "fixedSalary",
//           batchId: "",
//           salaryType: {
//             fixedSalary: (salaryType === "Fixed Salary Per Month" || salaryType === "Fixed and Percentage")
//               ? { fixedSalaryValue: parseInt(fixedSalary) || 0 }
//               : {},
//             percentageSalary: (salaryType === "Percentage Salary" || salaryType === "Fixed and Percentage")
//               ? { percentageSalaryValue: parseInt(salaryAmount || fixedSalary) || 0 }
//               : {},
//             lectureBased: salaryType === "Lecture Based" ? [{
//               batchId: '',
//               subjects: [{
//                 subjectId: '',
//                 lectureAmount: parseInt(fixedSalary) || 0
//               }]
//             }] : {}
//           }
//         }
//       };

//       // EMPLOYEE API CALL
//       const response = await createEmployeeMutation.mutateAsync(payload);

//       if (response?.statusCode === 200) {
//         console.log("✅ Employee created");

//         // ⭐⭐⭐ TEACHER API CALL (ONLY IF TEACHER) ⭐⭐⭐
//         if (employeeType === "Teacher") {
//           let finalBatch = [];

// // ⭐ Only add batch if user selected something (no blank IDs)
// if (batchId && subjectId) {
//   if (salaryType === "Fixed Salary Per Month") {
//     finalBatch = [{ batchId, subjects: [{ subjectId }] }];
//   } 
//   else if (salaryType === "Percentage Salary") {
//     finalBatch = [{ batchId, subjects: [] }];
//   } 
//   else if (salaryType === "Fixed and Percentage") {
//     finalBatch = [{ batchId, subjects: [] }];
//   } 
//   else if (salaryType === "Lecture Based") {
//     finalBatch = [{ batchId, subjects: [{ subjectId }] }];
//   }
// }

// // ⭐ If user didn't select batch → send empty array
// else {
//   finalBatch = [];
// }

//           const teacherPayload = {
//             customerId: selectedOrganization?.customerId,
//             organizationId: selectedOrganization?.organizationId,
//             teacherId: `TEA-${Date.now().toString().slice(-5)}`,
//             teacherFirstName: employeeData.first,
//             dateOfBirth: employeeData.dob,
//             teacherEmail: employeeData.email,
//             teacherPhoneNumber: employeeData.phone,
//             courses: [],
//             batch: finalBatch,
//             user: {
//               userCustomerId: user?.customerId,
//               userCustomerName: user?.customerName,
//               userCustomerEmail: user?.customerEmail,
//               roleName: user?.roleName,
//               roleId: user?.roleId,
//               userEmployeeId: user?.employeeId,
//             }
//           };

//           console.log("📤 TEACHER PAYLOAD:", teacherPayload);

//           await createTeacherMutation.mutateAsync(teacherPayload);
//           console.log("🎉 Teacher created!");
//         }

//         (navigation as any).navigate("EmployeeList");
//       }

//     } catch (error) {
//       console.error("❌ Error creating employee:", error);
//     }
//   };

//   const getFieldValue = (value: any) => {
//     if (!value || value === "" || value === null || value === undefined) return "-";
//     return String(value);
//   };

//   const Row = ({ label, value }: any) => (
//     <View style={styles.row}>
//       <View style={styles.leftSide}>
//         <ScalableText style={styles.rowLabel}>{label}</ScalableText>
//         <ScalableText style={styles.colonText}>:</ScalableText>
//       </View>
//       <ScalableText style={styles.rowValue}>{value}</ScalableText>
//     </View>
//   );

//   const renderSection = (title: string, children: any) => (
//     <View style={styles.section}>
//       <View style={styles.sectionHeader}>
//         <ScalableText style={styles.sectionTitle}>{title}</ScalableText>
//       </View>
//       <View style={styles.sectionContent}>{children}</View>
//     </View>
//   );

//   return (
//     <SafeView>
//       <AppHeader title="Review Page" showDrawer={false} handleBackClick={onBack} />

//       <View style={styles.screenRoot}>
//         <View style={styles.mainContainer}>
//           <View style={styles.fullWidthPanel}>
//             <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//               <View style={styles.reviewHeader}>
//                 <ScalableText style={styles.stepIndicator}>
//                   Check Your Filled Details
//                 </ScalableText>
//               </View>

//               {renderSection("👔 Employee Personal Details", (
//                 <>
//                   <Row label="First Name" value={getFieldValue(employeeData.first)} />
//                   <Row label="Last Name" value={getFieldValue(employeeData.last)} />
//                   <Row label="Mobile Number" value={getFieldValue(employeeData.phone)} />
//                   <Row label="Email" value={getFieldValue(employeeData.email)} />
//                   <Row label="Date of Birth" value={getFieldValue(employeeData.dob)} />
//                   <Row label="Father Name" value={getFieldValue(employeeData.father)} />
//                   <Row label="Father Mobile No" value={getFieldValue(employeeData.fphone)} />
//                   <Row label="Department" value={getFieldValue(employeeData.department)} />
//                   <Row label="Employee Skills" value={getFieldValue(employeeData.skills)} />
//                 </>
//               ))}

//               {highestQualificationData && educationDetailsData && renderSection("🎓 Education Details", (
//                 <>
//                   {educationDetailsData.hs_name && (
//                     <>
//                       <Row label="High School Name" value={getFieldValue(educationDetailsData.hs_name)} />
//                       <Row label="HS Percentage" value={getFieldValue(educationDetailsData.hs_percentage)} />
//                       <Row label="HS Board" value={getFieldValue(educationDetailsData.hs_board)} />
//                       <Row label="HS Address" value={getFieldValue(educationDetailsData.hs_address)} />
//                     </>
//                   )}

//                   {educationDetailsData.hsc_name && (
//                     <>
//                       <Row label="Higher Secondary School Name" value={getFieldValue(educationDetailsData.hsc_name)} />
//                       <Row label="HSC Percentage" value={getFieldValue(educationDetailsData.hsc_percentage)} />
//                       <Row label="HSC Board" value={getFieldValue(educationDetailsData.hsc_board)} />
//                       <Row label="HSC Address" value={getFieldValue(educationDetailsData.hsc_address)} />
//                     </>
//                   )}

//                   {educationDetailsData.grad_name && (
//                     <>
//                       <Row label="Graduation College Name" value={getFieldValue(educationDetailsData.grad_name)} />
//                       <Row label="Graduation Percentage" value={getFieldValue(educationDetailsData.grad_percentage)} />
//                       <Row label="Graduation Course" value={getFieldValue(educationDetailsData.grad_course)} />
//                       <Row label="Graduation Address" value={getFieldValue(educationDetailsData.grad_address)} />
//                     </>
//                   )}

//                   {educationDetailsData.pg_name && (
//                     <>
//                       <Row label="Post Graduation College Name" value={getFieldValue(educationDetailsData.pg_name)} />
//                       <Row label="PG Percentage" value={getFieldValue(educationDetailsData.pg_percentage)} />
//                       <Row label="PG Course" value={getFieldValue(educationDetailsData.pg_course)} />
//                       <Row label="PG Address" value={getFieldValue(educationDetailsData.pg_address)} />
//                     </>
//                   )}
//                 </>
//               ))}

//               {renderSection("💰 Monthly Salary", (
//                 <>
//                   <Row label="Employee designation" value={getFieldValue(employeeType === "Teacher" ? "Teacher" : designation)} />
//                   <Row label="Salary type" value={getFieldValue(salaryType)} />

//                   {salaryType === "Fixed Salary Per Month" && (
//                     <Row label="Salary flat value" value={getFieldValue(fixedSalary)} />
//                   )}

//                   {salaryType === "Percentage Salary" && (
//                     <Row label="Salary percentage value" value={getFieldValue(fixedSalary)} />
//                   )}

//                   {salaryType === "Fixed and Percentage" && (
//                     <>
//                       <Row label="Salary flat value" value={getFieldValue(fixedSalary)} />
//                       <Row label="Salary percentage value" value={getFieldValue(salaryAmount)} />
//                     </>
//                   )}

//                   {salaryType === "Lecture Based" && (
//                     <Row label="Salary per lecture" value={getFieldValue(fixedSalary)} />
//                   )}
//                 </>
//               ))}

//               {renderSection("🏦 Bank Details", (
//                 <>
//                   <Row label="Bank Name" value={getFieldValue(bankDetailsData.bankName)} />
//                   <Row label="Account Number" value={getFieldValue(bankDetailsData.accountNo)} />
//                   <Row label="IFSC Code" value={getFieldValue(bankDetailsData.ifsc)} />
//                 </>
//               ))}

//             </ScrollView>
//           </View>
//         </View>

//         {/* bottom buttons */}
//         <View style={styles.buttonBelowCardWrapper}>
//           <View style={styles.buttonRow}>
//             <Button title="BACK" onPress={onBack} btnStyles={styles.backBtn} btnTxtStyles={styles.backBtnText} />
//             <Button title="PRINT" onPress={onPrint} btnStyles={styles.printBtn} btnTxtStyles={styles.printBtnText} />
//             <Button
//               title={createEmployeeMutation.isPending ? "SUBMITTING..." : "SUBMIT"}
//               onPress={onSubmit}
//               btnStyles={styles.submitBtn}
//               btnTxtStyles={styles.submitBtnText}
//               disabled={createEmployeeMutation.isPending}
//             />
//           </View>
//         </View>

//       </View>
//     </SafeView>
//   );
// }

// const styles = StyleSheet.create({
//   screenRoot: {
//     flex: 1,
//     backgroundColor: COLORS.whiteSmoke,
//     paddingHorizontal: 8,
//     paddingTop: 20,
//   },
//   mainContainer: { flex: 1 },
//   fullWidthPanel: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 16,
//     elevation: 3,
//     maxHeight: Dimensions.get("window").height * 0.65,
//   },
//   scrollView: { flex: 1 },
//   scrollContent: { padding: 24, paddingBottom: 40 },

//   reviewHeader: {
//     marginBottom: 24,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E0E0E0",
//   },
//   stepIndicator: { fontSize: 16, color: "#666" },

//   section: {
//     marginBottom: 24,
//     backgroundColor: "#FAFAFA",
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   sectionHeader: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     color: COLORS.white,
//     fontWeight: "600",
//   },
//   sectionContent: { padding: 20 },

//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     marginBottom: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E6E6E6",
//   },
//   leftSide: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "48%"
//   },
//   rowLabel: {
//     fontSize: 14,
//     color: "#555",
//   },
//   colonText: {
//     fontSize: 14,
//     color: COLORS.black,
//     fontWeight: "600",
//     marginLeft: 4,
//   },
//   rowValue: {
//     flex: 1,
//     fontSize: 14,
//     color: COLORS.black,
//     fontWeight: "500",
//     textAlign: "left",
//   },

//   buttonBelowCardWrapper: {
//     marginTop: 16,
//     alignItems: "center",
//     marginBottom: "30%",
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "90%",
//     gap: 12,
//   },
//   backBtn: {
//     flex: 1,
//     borderRadius: 12,
//     backgroundColor: "#E0E0E0",
//   },
//   backBtnText: {
//     fontSize: 16,
//     color: COLORS.black
//   },

//   printBtn: {
//     flex: 1,
//     borderRadius: 12,
//     backgroundColor: "#007AFF",
//   },
//   printBtnText: {
//     fontSize: 16,
//     color: COLORS.white
//   },

//   submitBtn: {
//     flex: 1,
//     borderRadius: 12,
//     backgroundColor: COLORS.primary,
//   },
//   submitBtnText: {
//     fontSize: 16,
//     color: COLORS.white
//   },
// });

import React from "react";
import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import Button from "../../../@ui/button/Button";
import { useCreateEmployeeMutation } from "../../../apis/hooks/employee/mutation/useCreateEmployee.mutation";
import { store } from "../../../app/store";
import { COLORS } from "../../../colors";

export default function ReviewScreenUI() {
  const route = useRoute();
  const navigation = useNavigation();
const createEmployeeMutation = useCreateEmployeeMutation();
  const employeeData = (route.params as any)?.employeeData || {};
  const employeeType = (route.params as any)?.employeeType || "";
  const salaryType = (route.params as any)?.salaryType || "";
  const fixedSalary = (route.params as any)?.fixedSalary || "";
  const designation = (route.params as any)?.designation || "";
  const salaryAmount = (route.params as any)?.salaryAmount || "";
  const bankDetailsData = (route.params as any)?.bankDetailsData || {};
  const educationDetailsData = (route.params as any)?.educationDetailsData || {}
  const highestQualificationData = (route.params as any)?.highestQualificationData || "";

  // Debug: Check what data we're receiving
  console.log("🔍 Review Page - Employee Type:", employeeType);
  console.log("🔍 Review Page - Salary Type:", salaryType);
  console.log("🔍 Review Page - Fixed Salary:", fixedSalary);
  console.log("🔍 Review Page - Designation:", designation);
  console.log("🔍 Review Page - Salary Amount:", salaryAmount);

  const onBack = () => {
    (navigation as any).navigate("BankDetails", route.params);
  };
  const onPrint = () => {};
  const onSubmit = async () => {
    try {
      // Store se user aur organization data
      const user = store.getState().auth.authUser;
      const selectedOrganization = store.getState().auth.selectedOrganization;
      
      // Payload prepare karein
      const payload = {
        user: {
          userCustomerId: user?.customerId,
          userCustomerName: user?.customerName,
          userCustomerEmail: user?.customerEmail,
          roleName: user?.roleName || "",
          roleId: user?.roleId || "",
          userEmployeeId: user?.employeeId || "",
        },
        customerId: selectedOrganization?.customerId,
        organizationId: selectedOrganization?.organizationId,
        employeeId: `${employeeData.code || 'EMP'}${Date.now().toString().slice(-5)}`,
        employeeType: employeeType === "Teacher" ? "teacher" : "other",
        employeeCode: employeeData.code || "",
        referralAmount: 0,
        referralpaymentStatus: '',
        referralPaymentMethod: '',
        employeePersonalDetails: {
          employeeFirstname: employeeData.first || '',
          employeeLastname: employeeData.last || '',
          employeeEmail: employeeData.email || '',
          employeePhoneNumber: employeeData.phone || '',
          employeeCode: employeeData.code || '',
          employeeGurdianName: employeeData.father || '',
          employeeGurdianContactNumber: employeeData.fphone || '',
          employeeAddress: employeeData.address || '',
          employeeDateOfBirth: employeeData.dob || '',
          employeeDepartment: employeeData.department || '',
          employeeDesignation: employeeType === "Teacher" ? "teacher" : designation || '',
          employeeEducationDetails: highestQualificationData || '',
          employeeGender: '',
          referenceByEmployee: ''
        },
        employeeProfessionalDetails: {
          employeeSkills: employeeData.skills ? (Array.isArray(employeeData.skills) ? employeeData.skills : [employeeData.skills]) : [],
          dateOfJoining: employeeData.doj || '',
          releventExperienceYear: '',
          referedBy: '',
          employeeHighSchoolName: educationDetailsData.hs_name || '',
          employeeHighSchoolPercentage: educationDetailsData.hs_percentage || '',
          employeeHighSchoolBoard: educationDetailsData.hs_board || '',
          employeeHighSchoolAddress: educationDetailsData.hs_address || '',
          employeeHighSchoolCertificate: educationDetailsData.hs_certificate || '',
          employeeHigherSecondarySchoolName: educationDetailsData.hsc_name || '',
          employeeHigherSecondarySchoolPercentage: educationDetailsData.hsc_percentage || '',
          employeeHigherSecondarySchoolBoard: educationDetailsData.hsc_board || '',
          employeeHigherSecondarySchoolAddress: educationDetailsData.hsc_address || '',
          employeeHigherSecondaryCertificate: educationDetailsData.hsc_certificate || '',
          employeeUnderGraduationCollegeName: educationDetailsData.grad_name || '',
          employeeUnderGraduationCollegeCourseName: educationDetailsData.grad_course || '',
          employeeUnderGraduationCollegeAddress: educationDetailsData.grad_address || '',
          employeeUnderGraduationCollegePercentage: educationDetailsData.grad_percentage || '',
          employeeUnderGraduationCertificate: educationDetailsData.grad_certificate || '',
          employeePostGraduationCollegeName: educationDetailsData.pg_name || '',
          employeePostGraduationCollegeCourseName: educationDetailsData.pg_course || '',
          employeePostGraduationCollegeAddress: educationDetailsData.pg_address || '',
          employeePostGraduationCollegePercentage: educationDetailsData.pg_percentage || '',
          employeePostGraduationCertificate: educationDetailsData.pg_certificate || '',
          employeeAadharCard: employeeData.aadharImageUri || "",
          employeePanCard: employeeData.panImageUri || "",

        
        },
        employeeBankDetails: {
          employeeBankName: bankDetailsData.bankName || '',
          employeeAccountNo: bankDetailsData.accountNo || '',
          employeeIfsceCode: bankDetailsData.ifsc || ''
        },
        employeeSalaryDetails: {
          type: salaryType === "Fixed Salary Per Month" ? "fixedSalary" : 
                salaryType === "Percentage Salary" ? "percentageSalary" :
                salaryType === "Fixed and Percentage" ? "fixedAndPercentage" :
                salaryType === "Lecture Based" ? "lectureBased" : "fixedSalary",
          batchId: "",
          salaryType: {
            fixedSalary: (salaryType === "Fixed Salary Per Month" || salaryType === "Fixed and Percentage") ? {
              fixedSalaryValue: parseInt(fixedSalary) || 0
            } : {},
            percentageSalary: (salaryType === "Percentage Salary" || salaryType === "Fixed and Percentage") ? {
              percentageSalaryValue: parseInt(salaryAmount || fixedSalary) || 0
            } : {},
            lectureBased: salaryType === "Lecture Based" ? [{
              batchId: '',
              subjects: [{
                subjectId: '',
                lectureAmount: parseInt(fixedSalary) || 0
              }]
            }] : {}
          }
        }
      };
  
      console.log('📤 Sending employee data:', JSON.stringify(payload, null, 2));
  
      // API call
      const response = await createEmployeeMutation.mutateAsync(payload);
      
      console.log('📥 API Response:', response);
      
      if (response?.statusCode === 200) {
        // Success
        console.log("✅ Employee created successfully!");
        (navigation as any).navigate("EmployeeList");
      } else {
        console.error("❌ Error:", response?.message || "Failed to create employee");
      }
    } catch (error) {
      console.error("❌ Error creating employee:", error);
    }
  };
  const getFieldValue = (value: any) => {
    if (!value || value === "" || value === null || value === undefined) {
      return "-";
    }
    return String(value);
  };

  // ⭐ Updated row layout with aligned colon
  const Row = ({ label, value }: any) => (
    <View style={styles.row}>

      <View style={styles.leftSide}>
        <ScalableText style={styles.rowLabel}>{label}</ScalableText>
        <ScalableText style={styles.colonText}>:</ScalableText>
      </View>

      <ScalableText style={styles.rowValue}>{value}</ScalableText>
    </View>
  );

  const renderSection = (title: string, children: any) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ScalableText style={styles.sectionTitle}>{title}</ScalableText>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <SafeView>
      <AppHeader
        title="Review Page"
        showDrawer={false}
        handleBackClick={onBack}
      />

      <View style={styles.screenRoot}>
        
        <View style={styles.mainContainer}>
          
          <View style={styles.fullWidthPanel}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >

              <View style={styles.reviewHeader}>
                <ScalableText style={styles.stepIndicator}>
                  Check Your Filled Details
                </ScalableText>
              </View>

              {renderSection("👔 Employee Personal Details", (
                <>
                <Row label="First Name" value={getFieldValue(employeeData.first)} />
                <Row label="Last Name" value={getFieldValue(employeeData.last)} />
                <Row label="Mobile Number" value={getFieldValue(employeeData.phone)} />
                <Row label="Email" value={getFieldValue(employeeData.email)} />
               <Row label="Date of Birth" value={getFieldValue(employeeData.dob)} />
                <Row label="Father Name" value={getFieldValue(employeeData.father)} />
                <Row label="Father Mobile No" value={getFieldValue(employeeData.fphone)} />
                <Row label="Department" value={getFieldValue(employeeData.department)} />
                <Row label="Employee Skills" value={getFieldValue(employeeData.skills)} />
         </>
         ))}  

{highestQualificationData && Object.keys(highestQualificationData).length > 0 && educationDetailsData && Object.keys(educationDetailsData).length > 0 && renderSection("🎓 Education Details", (
  <>
    {/* High School - Always show if education details exist */}
    {educationDetailsData.hs_name && (
      <>
        <Row label="High School Name" value={getFieldValue(educationDetailsData.hs_name)} />
        <Row label="HS Percentage" value={getFieldValue(educationDetailsData.hs_percentage)} />
        <Row label="HS Board" value={getFieldValue(educationDetailsData.hs_board)} />
        <Row label="HS Address" value={getFieldValue(educationDetailsData.hs_address)} />
      </>
    )}
    
    {/* Higher Secondary - Show if hsc_name exists */}
    {educationDetailsData.hsc_name && (
      <>
        <Row label="Higher Secondary School Name" value={getFieldValue(educationDetailsData.hsc_name)} />
        <Row label="HSC Percentage" value={getFieldValue(educationDetailsData.hsc_percentage)} />
        <Row label="HSC Board" value={getFieldValue(educationDetailsData.hsc_board)} />
        <Row label="HSC Address" value={getFieldValue(educationDetailsData.hsc_address)} />
      </>
    )}
    
    {/* Graduation - Show if grad_name exists */}
    {educationDetailsData.grad_name && (
      <>
        <Row label="Graduation College Name" value={getFieldValue(educationDetailsData.grad_name)} />
        <Row label="Graduation Percentage" value={getFieldValue(educationDetailsData.grad_percentage)} />
        <Row label="Graduation Course" value={getFieldValue(educationDetailsData.grad_course)} />
        <Row label="Graduation Address" value={getFieldValue(educationDetailsData.grad_address)} />
      </>
    )}
    
    {/* Post Graduation - Show if pg_name exists */}
    {educationDetailsData.pg_name && (
      <>
        <Row label="Post Graduation College Name" value={getFieldValue(educationDetailsData.pg_name)} />
        <Row label="PG Percentage" value={getFieldValue(educationDetailsData.pg_percentage)} />
        <Row label="PG Course" value={getFieldValue(educationDetailsData.pg_course)} />
        <Row label="PG Address" value={getFieldValue(educationDetailsData.pg_address)} />
      </>
    )}
  </>
))}

              {renderSection("💰 Monthly Salary", (
                <>
                  {/* Designation Field */}
                  <Row 
                    label="Employee designation" 
                    value={getFieldValue(employeeType === "Teacher" ? "Teacher" : designation)} 
                  />
                  
                  {/* Salary Type Field */}
                  <Row label="Salary type" value={getFieldValue(salaryType)} />
                  
                  {/* Salary Values - Conditional based on salaryType */}
                  {salaryType === "Fixed Salary Per Month" && (
                    <Row label="Salary flat value" value={getFieldValue(fixedSalary)} />
                  )}
                  
                  {salaryType === "Percentage Salary" && (
                    <Row label="Salary percentage value" value={getFieldValue(fixedSalary)} />
                  )}
                  
                  {salaryType === "Fixed and Percentage" && (
                    <>
                      <Row label="Salary flat value" value={getFieldValue(fixedSalary)} />
                      <Row label="Salary percentage value" value={getFieldValue(salaryAmount)} />
                    </>
                  )}
                  
                  {salaryType === "Lecture Based" && (
                    <Row label="Salary per lecture" value={getFieldValue(fixedSalary)} />
                  )}
                </>
              ))}

              {renderSection("🏦 Bank Details", (
                <>
                  <Row label="Bank Name" value={getFieldValue(bankDetailsData.bankName)} />
                  <Row label="Account Number" value={getFieldValue(bankDetailsData.accountNo)} />
                  <Row label="IFSC Code" value={getFieldValue(bankDetailsData.ifsc)} />
                </>
              ))}

            </ScrollView>
          </View>

        </View>

        {/* bottom buttons */}
        <View style={styles.buttonBelowCardWrapper}>
          <View style={styles.buttonRow}>
            <Button 
              title="BACK" 
              onPress={onBack}
              btnStyles={styles.backBtn}
              btnTxtStyles={styles.backBtnText}
            />
            <Button 
              title="PRINT"
              onPress={onPrint}
              btnStyles={styles.printBtn}
              btnTxtStyles={styles.printBtnText}
            />
            <Button 
             title={createEmployeeMutation.isPending ? "SUBMITTING..." : "SUBMIT"}
             onPress={onSubmit}
             btnStyles={styles.submitBtn}
             btnTxtStyles={styles.submitBtnText}
             disabled={createEmployeeMutation.isPending}
            />
          </View>
        </View>

      </View>
    </SafeView>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1, 
    backgroundColor: COLORS.whiteSmoke,
    paddingHorizontal: 8,
    paddingTop: 20,
  },
  mainContainer: { flex: 1 },
  fullWidthPanel: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 3,
    maxHeight: Dimensions.get("window").height * 0.65,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },

  reviewHeader: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  stepIndicator: { fontSize: 16, color: "#666" },

  section: {
    marginBottom: 24,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: "600",
  },
  sectionContent: { padding: 20 },

  // ⭐ Perfect colon alignment here
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%"    // makes colon fixed alignment ⭐
  },
  rowLabel: {
    fontSize: 14,
    color: "#555",
  },
  colonText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: "600",
    marginLeft: 4,
  },
  rowValue: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
    fontWeight: "500",
    textAlign: "left",
  },

  buttonBelowCardWrapper: {
    marginTop: 16,
    alignItems: "center",
    marginBottom: "30%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    gap: 12,
  },
  backBtn: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
  },
  backBtnText: { 
    fontSize: 16, 
    color: COLORS.black 
  },

  printBtn: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#007AFF",
  },
  printBtnText: { 
    fontSize: 16, 
    color: COLORS.white 
  },

  submitBtn: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  submitBtnText: { 
    fontSize: 16, 
    color: COLORS.white 
  },
});