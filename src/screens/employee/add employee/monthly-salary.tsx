

// import React, { useState, useEffect } from "react";
// import { StyleSheet, View, TouchableOpacity, Text, TextInput, Dimensions } from "react-native";
// import AutoHeightImage from "D:/Projects/Karomanage-mobile-android-app/src/@ui/auto-height-image/AutoHeightImage.tsx";
// import { IMAGES } from "D:/Projects/Karomanage-mobile-android-app/src/images";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import Button from "../../../@ui/button/Button";
// import { COLORS } from "../../../colors";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
// import { useBatchListsQuery } from "../../../apis/hooks/batch/query/useBatchLists.query";
// import { useBatchDetailsQuery } from "../../../apis/hooks/batch/query/useBatchDetails.query";
// import { useCourseDetailsQuery } from "../../../apis/hooks/course/query/useCourseDetails.query";
// import { useListEmployeeProfileQuery } from "../../../apis/hooks/employee/query/useListEmployeeProfile.query";

// export default function MonthlySalary(){

//   const navigation = useNavigation<THomeStackNavigator>();
//   const route = useRoute();
//   const employeeData = (route.params as any)?.employeeData;

//   const [employeeType, setEmployeeType] = useState("");
//   const [salaryType, setSalaryType] = useState("");

//   const [designation, setDesignation] = useState("");
//   const [salaryAmount, setSalaryAmount] = useState("");

//   const [fixedSalary, setFixedSalary] = useState("");
//   const [batch, setBatch] = useState("");
//   const [subject, setSubject] = useState("");

//   const [designationError, setDesignationError] = useState("");
//   const [salaryError, setSalaryError] = useState("");
//   const [fixedSalaryErr, setFixedSalaryErr] = useState("");
//   const [batchErr, setBatchErr] = useState("");
//   const [subjectErr, setSubjectErr] = useState("");
//   const [employeeTypeErr, setEmployeeTypeErr] = useState("");
//   const [salaryTypeErr, setSalaryTypeErr] = useState("");

//   const [openEmp, setOpenEmp] = useState(false);
//   const [openSalary, setOpenSalary] = useState(false);
//   const [openBatch, setOpenBatch] = useState(false);
//   const [openSubject, setOpenSubject] = useState(false);

//   const [batchId, setBatchId] = useState(""); // selected batchId for API call
//   const [courseIds, setCourseIds] = useState<string[]>([]); // courseIds from singleBatch response
//   const [subjectsList, setSubjectsList] = useState<any[]>([]); // subjects from singleCourse response
//   const [openDesignation, setOpenDesignation] = useState(false);
  
//   // Employee Profile API - for designation list
//   const { data: employeeProfileData, isLoading: isLoadingDesignation } = useListEmployeeProfileQuery();
//   const designationList: string[] = employeeProfileData?.data?.designation || [];
  
//   // Batch List API - dynamic batches
//   const { data: batchesListData, isLoading: batchesLoading } = useBatchListsQuery();
  
//   // Dynamic batch list from API
//   const batchList = batchesListData?.data?.map((batch: any) => ({
//     batchName: batch.batchName,
//     batchId: batch.batchId
//   })) || [];

//   // singleBatch API call - when batchId is selected
//   const { 
//     data: batchDetailsData, 
//     isLoading: batchDetailsLoading,
//     isSuccess: batchDetailsSuccess 
//   } = useBatchDetailsQuery(
//     { batchId: batchId || "" }
//   );

//   // useEffect - extract courseIds from singleBatch response
//   useEffect(() => {
//     if (batchDetailsSuccess && batchDetailsData?.data?.courses && batchDetailsData.data.courses.length > 0) {
//       const extractedCourseIds = batchDetailsData.data.courses.map(
//         (course: { courseId: string; courseStatus: string }) => course.courseId
//       );
//       setCourseIds(extractedCourseIds);
//       // Reset subject when batch changes
//       setSubject("");
//       setSubjectsList([]);
//     } else {
//       setCourseIds([]);
//       setSubjectsList([]);
//     }
//   }, [batchDetailsSuccess, batchDetailsData]);

//   // singleCourse API call - for first course (you can extend for multiple courses)
//   const firstCourseId = courseIds[0];
//   const { 
//     data: courseDetailsData, 
//     isLoading: courseDetailsLoading 
//   } = useCourseDetailsQuery(
//     { courseId: firstCourseId || "" }
//   );

//   // useEffect - extract subjects from singleCourse response
//   useEffect(() => {
//     if (courseDetailsData?.data?.subjects && courseDetailsData.data.subjects.length > 0) {
//       // Extract subjects from singleCourse response
//       const extractedSubjects = courseDetailsData.data.subjects.map(
//         (subject: any) => ({
//           subjectName: subject.subjectName,
//           subjectId: subject.subjectId
//         })
//       );
//       setSubjectsList(extractedSubjects);
//     } else {
//       setSubjectsList([]);
//     }
//   }, [courseDetailsData]);

//   // Dynamic subject list from API
//   const subjectList = subjectsList.map((s: any) => s.subjectName);

//   const onNext =()=>{

//     let valid = true;
//     setEmployeeTypeErr(""); setSalaryTypeErr("");
//     setDesignationError(""); setSalaryError("");
//     setFixedSalaryErr(""); setBatchErr(""); setSubjectErr("");

//     if(!employeeType){ setEmployeeTypeErr("This field is required"); valid=false; }
//     if(employeeType==="Teacher" && !salaryType){ setSalaryTypeErr("This field is required"); valid=false; }

//     if(employeeType==="Teacher" && salaryType==="Fixed Salary Per Month"){
//       if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
//       if(!batch.trim()){ setBatchErr("This field is required"); valid=false; }
//       if(!subject.trim()){ setSubjectErr("This field is required"); valid=false; }
//     }

//     if(employeeType==="Teacher" && salaryType==="Percentage Salary"){
//       if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
//       if(!batch.trim()){ setBatchErr("This field is required"); valid=false; }
//     }

//     if(employeeType==="Teacher" && salaryType==="Fixed and Percentage"){
//       if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
//       if(!salaryAmount.trim()){ setSalaryError("This field is required"); valid=false; }
//       if(!batch.trim()){ setBatchErr("This field is required"); valid=false; }
//     }

//     if(employeeType==="Teacher" && salaryType==="Lecture Based"){
//       if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
//       if(!batch.trim()){ setBatchErr("This field is required"); valid=false; }
//       if(!subject.trim()){ setSubjectErr("This field is required"); valid=false; }
//     }

//     if(employeeType==="Other"){
//       if(!designation.trim()){ setDesignationError("Designation is required"); valid=false; }
//       if(!salaryAmount.trim()){ setSalaryError("Salary amount is required"); valid=false; }
//       else if(isNaN(salaryAmount)){ setSalaryError("Numbers only"); valid=false; }
//     }

//     if(!valid) return;
    
//     // Debug: Check what we're passing to BankDetails
//     console.log("🔍 MonthlySalary - Passing to BankDetails:");
//     console.log("  - Employee Type:", employeeType);
//     console.log("  - Salary Type:", salaryType);
//     console.log("  - Fixed Salary:", fixedSalary);
//     console.log("  - Designation:", designation);
//     console.log("  - Salary Amount:", salaryAmount);
    
//     // Receive education data from route params
//     const highestQualificationData = (route.params as any)?.highestQualificationData || {};
//     const educationDetailsData = (route.params as any)?.educationDetailsData || {};
    
//     navigation.navigate("BankDetails",{
//       employeeData: employeeData,
//       highestQualificationData: highestQualificationData,
//       educationDetailsData: educationDetailsData,
//       employeeType,
//       salaryType,
//       fixedSalary,
//       batch,
//       subject,
//       designation,
//       salaryAmount
//     });
//   };

//   return(
//   <SafeView>
//     <AppHeader showDrawer={false} title="Employee Monthly Salary" handleBackClick={()=>navigation.goBack()}/>
//     <View style={styles.wrapper}>
//       <View style={styles.card}>
//         <ThemeScrollView contentContainerStyle={{paddingBottom:40}}>

//           <ScalableText style={styles.heading}>Monthly Salary</ScalableText>
//           <ScalableText style={styles.subtext}>Step 4 of 5 - Enter Information</ScalableText>

//           <ScalableText style={styles.label}>Employee Type*</ScalableText>
//           <TouchableOpacity 
//            style={[
//            styles.input,
//             employeeTypeErr&&styles.inputError,
//            {
//            flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             paddingRight: 10
//               }
//                ]} 
//                onPress={()=>setOpenEmp(!openEmp)}
//                   >
//                  <Text style={styles.text}>{employeeType || "Select Employee Type"}</Text>
//                 <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                 </TouchableOpacity>
//           {employeeTypeErr!=="" && <Text style={styles.errorMsg}>{employeeTypeErr}</Text>}

//           {openEmp && (
//             <View style={styles.dropdown}>
//               <TouchableOpacity onPress={()=>{setEmployeeType("Teacher");setOpenEmp(false);setEmployeeTypeErr("");}}>
//                 <Text style={styles.option}>Teacher</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={()=>{setEmployeeType("Other");setOpenEmp(false);setEmployeeTypeErr("");}}>
//                 <Text style={styles.option}>Other</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {employeeType==="Teacher" && (
//             <>
//               <ScalableText style={styles.label}>Salary Type*</ScalableText>
//               <TouchableOpacity 
//                   style={[
//                    styles.input,
//                   salaryTypeErr&&styles.inputError,
//                  {
//                    flexDirection: "row",
//                     justifyContent: "space-between",
//                    alignItems: "center",
//                   paddingRight: 10
//                   }
//                  ]} 
//               onPress={()=>setOpenSalary(!openSalary)}
//                >
//              <Text style={styles.text}>{salaryType || "Select Salary Type"}</Text>
//               <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                 </TouchableOpacity>
//               {salaryTypeErr!=="" && <Text style={styles.errorMsg}>{salaryTypeErr}</Text>}

//               {/* 🔥 Final i-icon dropdown merged without touching anything else */}
//               {openSalary && (
//                 <View style={styles.dropdown}>

//                   <View style={styles.salaryRow}>
//                     <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Fixed Salary Per Month");setOpenSalary(false); setSalaryTypeErr("");}}>
//                       <Text style={styles.salaryText}>Fixed salary per month</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={()=>alert("Every month fixed amount — no percentage included")}>
//                       <Text style={styles.infoIcon}>ⓘ</Text>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={styles.salaryRow}>
//                     <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Percentage Salary");setOpenSalary(false); setSalaryTypeErr("");}}>
//                       <Text style={styles.salaryText}>Percentage salary</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={()=>alert("Salary is % based on earning collection")}>
//                       <Text style={styles.infoIcon}>ⓘ</Text>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={styles.salaryRow}>
//                     <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Fixed and Percentage");setOpenSalary(false); setSalaryTypeErr("");}}>
//                       <Text style={styles.salaryText}>Fixed + Percentage</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={()=>alert("Fixed base + extra % bonus")}>
//                       <Text style={styles.infoIcon}>ⓘ</Text>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={styles.salaryRow}>
//                     <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Lecture Based");setOpenSalary(false); setSalaryTypeErr("");}}>
//                       <Text style={styles.salaryText}>Lecture Based</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={()=>alert("Salary = Rate × Lectures Taken")}>
//                       <Text style={styles.infoIcon}>ⓘ</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}

//               {/* FIXED SELECT – untouched, same */}
//               {salaryType==="Fixed Salary Per Month" && (
//                 <>
//                   <ScalableText style={styles.label}>Fixed Salary Per Month*</ScalableText>
//                   <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} keyboardType="numeric"
//                     placeholder="Enter fixed salary" value={fixedSalary}
//                     onChangeText={(v)=>{setFixedSalary(v);setFixedSalaryErr("");}}/>
//                   {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

//                   <ScalableText style={styles.label}>Select Batch*</ScalableText>
//                   <TouchableOpacity style={[
//                    styles.input,
//                    batchErr&&styles.inputError,
//                      {
//                    flexDirection: "row",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     paddingRight: 10
//                       }
//                          ]} onPress={()=>setOpenBatch(!openBatch)}>
//                      <Text style={styles.text}>{batch || "Select Batch"}</Text>
//                         <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                      </TouchableOpacity>
//                   {batchErr && <Text style={styles.errorMsg}>{batchErr}</Text>}
//                   {openBatch && (
//                     <View style={styles.dropdown}>
//                       {batchesLoading ? (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>Loading batches...</Text>
//                         </TouchableOpacity>
//                       ) : batchList.length > 0 ? (
//                         batchList.map((b: any, i: number) => (
//                           <TouchableOpacity 
//                             key={i} 
//                             onPress={() => {
//                               setBatch(b.batchName);
//                               setBatchId(b.batchId);
//                               setBatchErr("");
//                               setOpenBatch(false);
//                               setSubject("");
//                               setSubjectErr("");
//                             }}
//                           >
//                             <Text style={styles.option}>{b.batchName}</Text>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>No batches available</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   )}

//                   <ScalableText style={styles.label}>Select Subject*</ScalableText>
//                   <TouchableOpacity 
//                            style={[
//                             styles.input,
//                             subjectErr&&styles.inputError,
//                            (!batchId || batchDetailsLoading || courseDetailsLoading) && { opacity: 0.6 },
//                              {
//                           flexDirection: "row",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           paddingRight: 10
//                           }
//                           ]} 
//                        onPress={() => setOpenSubject(!openSubject)}
//                         disabled={!batchId || batchDetailsLoading || courseDetailsLoading}
//                        >
//                      <Text style={styles.text}>
//                      {subject || (batchDetailsLoading || courseDetailsLoading ? "Loading..." : "Select Subject")}
//                     </Text>
//                   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                  </TouchableOpacity>
//                   {subjectErr && <Text style={styles.errorMsg}>{subjectErr}</Text>}
//                   {openSubject && (
//                     <View style={styles.dropdown}>
//                       {batchDetailsLoading || courseDetailsLoading ? (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>Loading subjects...</Text>
//                         </TouchableOpacity>
//                       ) : subjectList.length > 0 ? (
//                         subjectList.map((s: string, i: number) => (
//                           <TouchableOpacity 
//                             key={i} 
//                             onPress={() => {
//                               setSubject(s);
//                               setSubjectErr("");
//                               setOpenSubject(false);
//                             }}
//                           >
//                             <Text style={styles.option}>{s}</Text>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>
//                             {batchId ? "No subjects available" : "Select batch first"}
//                           </Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   )}
//                 </>
//               )}

//               {/* PERCENTAGE */}
//               {salaryType==="Percentage Salary" && (
//                 <>
//                   <ScalableText style={styles.label}>Percentage Salary*</ScalableText>
//                   <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} placeholder="Enter % salary"
//                     keyboardType="numeric" value={fixedSalary}
//                     onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setFixedSalary(v);setFixedSalaryErr("");}}/>
//                   {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

//                   <ScalableText style={styles.label}>Select Batch*</ScalableText>
//                   <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
//                     <TouchableOpacity style={[styles.input,{flex:1},batchErr&&styles.inputError]}
//                       onPress={()=>setOpenBatch(!openBatch)}>
//                       <Text style={styles.text}>{batch || "Select Batch"}</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity 
//                      style={{width:40,height:40,borderRadius:40,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}
//                      onPress={() => navigation.navigate("CreateBatch")}
//                        >
//                      <Text style={{color:"#fff",fontSize:24,fontWeight:"bold"}}>+</Text>
//                       </TouchableOpacity>
//                   </View>
//                   {batchErr && <Text style={styles.errorMsg}>{batchErr}</Text>}
//                   {openBatch && (
//                     <View style={styles.dropdown}>
//                       {batchList.map((b: any, i: number) => (
//      <TouchableOpacity key={i} onPress={() => {
//        setBatch(b.batchName);
//        setBatchId(b.batchId);
//        setBatchErr("");
//        setOpenBatch(false);
//      }}>
//        <Text style={styles.option}>{b.batchName}</Text>
//      </TouchableOpacity>
//    ))}
//                     </View>
//                   )}
//                 </>
//               )}

//               {/* FIXED + % */}
//               {salaryType==="Fixed and Percentage" && (
//                 <>
//                   <ScalableText style={styles.label}>Fixed Salary Amount*</ScalableText>
//                   <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} keyboardType="numeric"
//                     placeholder="₹ fixed salary" value={fixedSalary}
//                     onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setFixedSalary(v);setFixedSalaryErr("");}}/>
//                   {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

//                   <ScalableText style={styles.label}>Percentage (%)*</ScalableText>
//                   <TextInput style={[styles.input,salaryError&&styles.inputError]} keyboardType="numeric"
//                     placeholder="% percentage" value={salaryAmount}
//                     onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setSalaryAmount(v);setSalaryError("");}}/>
//                   {salaryError && <Text style={styles.errorMsg}>{salaryError}</Text>}

//                   <ScalableText style={styles.label}>Select Batch*</ScalableText>
//                   <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
//                   <TouchableOpacity 
//                           style={[
//                          styles.input,
//                            {flex:1},
//                           batchErr&&styles.inputError,
//                           {
//                           flexDirection: "row",
//                          justifyContent: "space-between",
//                         alignItems: "center",
//                        paddingRight: 10
//                          }
//                           ]} 
//                         onPress={()=>setOpenBatch(!openBatch)}
//                        >
//                     <Text style={styles.text}>{batch || "Select Batch"}</Text>
//                      <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                     </TouchableOpacity>
//                     <TouchableOpacity 
//                      style={{width:40,height:40,borderRadius:40,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}
//                      onPress={() => navigation.navigate("CreateBatch")}
//                         >
//                       <Text style={{color:"#fff",fontSize:24,fontWeight:"bold"}}>+</Text>
//                      </TouchableOpacity>
//                   </View>
//                   {batchErr && <Text style={styles.errorMsg}>{batchErr}</Text>}
//                   {openBatch && (
//                     <View style={styles.dropdown}>
//                       {batchesLoading ? (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>Loading batches...</Text>
//                         </TouchableOpacity>
//                       ) : batchList.length > 0 ? (
//                         batchList.map((b: any, i: number) => (
//                           <TouchableOpacity 
//                             key={i} 
//                             onPress={() => {
//                               setBatch(b.batchName);
//                               setBatchId(b.batchId);
//                               setBatchErr("");
//                               setOpenBatch(false);
//                               setSubject("");
//                               setSubjectErr("");
//                             }}
//                           >
//                             <Text style={styles.option}>{b.batchName}</Text>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>No batches available</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   )}
//                 </>
//               )}

//               {/* LECTURE BASED */}
//               {salaryType==="Lecture Based" && (
//                 <>
//                   <ScalableText style={styles.label}>Lecture Rate (₹ per lecture)*</ScalableText>
//                   <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} keyboardType="numeric"
//                     placeholder="₹ per lecture" value={fixedSalary}
//                     onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setFixedSalary(v);setFixedSalaryErr("");}}/>
//                   {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

//                   <ScalableText style={styles.label}>Select Batch*</ScalableText>
//                   <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
//                   <TouchableOpacity 
//                       style={[
//                       styles.input,
//                         {flex:1},
//                          batchErr&&styles.inputError,
//                         {
//                          flexDirection: "row",
//                         justifyContent: "space-between",
//                        alignItems: "center",
//                         paddingRight: 10
//                          }
//                      ]} 
//                   onPress={()=>setOpenBatch(!openBatch)}
//                        >
//                  <Text style={styles.text}>{batch || "Select Batch"}</Text>
//                  <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                  </TouchableOpacity>
//                     <TouchableOpacity 
//                         style={{width:40,height:40,borderRadius:40,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}
//                      onPress={() => navigation.navigate("CreateBatch")}
//                          >
//                      <Text style={{color:"#fff",fontSize:24,fontWeight:"bold"}}>+</Text>
//                       </TouchableOpacity>
//                   </View>
//                   {batchErr && <Text style={styles.errorMsg}>{batchErr}</Text>}
//                   {openBatch && (
//                     <View style={styles.dropdown}>
//                       {batchesLoading ? (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>Loading batches...</Text>
//                         </TouchableOpacity>
//                       ) : batchList.length > 0 ? (
//                         batchList.map((b: any, i: number) => (
//                           <TouchableOpacity 
//                             key={i} 
//                             onPress={() => {
//                               setBatch(b.batchName);
//                               setBatchId(b.batchId);
//                               setBatchErr("");
//                               setOpenBatch(false);
//                               setSubject("");
//                               setSubjectErr("");
//                             }}
//                           >
//                             <Text style={styles.option}>{b.batchName}</Text>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>No batches available</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   )}

//                   <ScalableText style={styles.label}>Select Subject*</ScalableText>
//                   <TouchableOpacity 
//                                   style={[
//                                   styles.input,
//                                    subjectErr&&styles.inputError,
//                                   (!batchId || batchDetailsLoading || courseDetailsLoading) && { opacity: 0.6 },
//                                     {
//                                 flexDirection: "row",
//                                justifyContent: "space-between",
//                                alignItems: "center",
//                               paddingRight: 10
//                                }
//                              ]} 
//                          onPress={() => setOpenSubject(!openSubject)}
//                          disabled={!batchId || batchDetailsLoading || courseDetailsLoading}
//                         >
//                     <Text style={styles.text}>
//                     {subject || (batchDetailsLoading || courseDetailsLoading ? "Loading..." : "Select Subject")}
//                    </Text>
//                   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                   </TouchableOpacity>
//                   {subjectErr && <Text style={styles.errorMsg}>{subjectErr}</Text>}
//                   {openSubject && (
//                     <View style={styles.dropdown}>
//                       {subjectList.map((s,i)=>( 
//                         <TouchableOpacity key={i} onPress={()=>{setSubject(s);setSubjectErr("");setOpenSubject(false);}}>
//                           <Text style={styles.option}>{s}</Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
//                   )}
//                 </>
//               )}
//             </>
//           )}

//           {employeeType==="Other" && (
//             <>
//              <ScalableText style={styles.label}>Designation*</ScalableText>

// {/* Dropdown + Input Box */}
// <View style={styles.deptBox}>
//   <TextInput
//     value={designation}
//     onChangeText={(v) => {
//       setDesignation(v);
//       setDesignationError("");
//     }}
//     placeholder="Enter Designation"
//     style={[styles.deptInput, designationError && {borderColor:"red",borderWidth:1}]}
//   />
  
//   {/* Dropdown Icon */}
//   <TouchableOpacity
//     onPress={() => setOpenDesignation(!openDesignation)}
//     style={styles.deptIconWrap}
//   >
//     <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//   </TouchableOpacity>
// </View>

// {/* Error Message */}
// {designationError ? <Text style={styles.errorMsg}>{designationError}</Text> : null}

// {/* Dropdown List */}
// {openDesignation && (
//   <View style={styles.dropdown}>
//     {isLoadingDesignation ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>Loading designations...</Text>
//       </View>
//     ) : designationList.length === 0 ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>No designations found</Text>
//       </View>
//     ) : (
//       designationList.map((d, i) => (
//         <TouchableOpacity
//           key={i}
//           style={styles.option}
//           onPress={() => {
//             setDesignation(d);
//             setOpenDesignation(false);
//             setDesignationError("");
//           }}
//         >
//           <Text>{d}</Text>
//         </TouchableOpacity>
//       ))
//     )}
//   </View>
// )}

//               <ScalableText style={styles.label}>Salary Amount*</ScalableText>
//               <TextInput style={[styles.input,salaryError&&styles.inputError]} placeholder="Enter Salary"
//                 keyboardType="numeric" value={salaryAmount}
//                 onChangeText={(v)=>{setSalaryAmount(v);setSalaryError("");}}/>
//               {salaryError?<Text style={styles.errorMsg}>{salaryError}</Text>:null}
//             </>
//           )}

//         </ThemeScrollView>
//       </View>

//       <View style={styles.bottomBtnWrap}>
//         <Button title="Next" btnStyles={styles.nextBtn} btnTxtStyles={{fontSize:18}} onPress={onNext}/>
//       </View>
//     </View>
//   </SafeView>
//   );
// }

// const CARD_HEIGHT = Dimensions.get("window").height*0.62;

// const styles = StyleSheet.create({
//   wrapper:{flex:1,alignItems:"center",backgroundColor:COLORS.whiteSmoke,paddingTop:10},
//   card:{width:"88%",backgroundColor:"#fff",borderRadius:20,elevation:10,paddingHorizontal:25,paddingVertical:20,borderLeftWidth:6,borderLeftColor:COLORS.primary,height:CARD_HEIGHT},
//   heading:{fontSize:22,fontWeight:"bold",color:"#000",marginBottom:4,textAlign:"center"},
//   subtext:{fontSize:13,color:"#666",marginBottom:18,textAlign:"center"},
//   label:{fontSize:13,fontWeight:"800",marginBottom:6,color:"#000"},
//   input:{borderWidth:1,borderColor:"#000",borderRadius:10,height:48,paddingHorizontal:12,backgroundColor:"#fff",justifyContent:"center",marginBottom:5,width:"107%",fontFamily:undefined},
  
//   inputError:{borderColor:"red",borderWidth:2,height:44},
//   errorMsg:{color:"red",fontSize:12,marginTop:3,marginLeft:3},
//   text:{color:"#555",fontSize:14},

//   salaryRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingVertical:10,paddingHorizontal:10,borderBottomWidth:1,borderBottomColor:"#eee"},
//   salaryText:{fontSize:15,color:"#333"},
//   infoIcon:{fontSize:18,color:"#777",padding:4},

//   dropdown:{backgroundColor:"#fff",borderWidth:1,borderColor:"#ddd",borderRadius:10,marginTop:4,overflow:"hidden",width:"107%"},
//   option:{padding:12,fontSize:14,color:"#333",borderBottomWidth:1,borderBottomColor:"#eee"},
  
//   // Designation dropdown styles (same as department in index.tsx)
//   deptBox:{
//     height:44,
//     borderWidth:1,
//     borderColor:"#000",
//     borderRadius:10,
//     flexDirection:"row",
//     alignItems:"center",
//     paddingLeft:12,
//     marginBottom:5,
//     backgroundColor:"#fff",
//     width:"107%",
//   },
//   deptInput:{
//     flex:1,
//     fontSize:14,
//     color:"#555"
//   },
//   deptIconWrap:{
//     paddingHorizontal:12,
//     paddingVertical:6,
//     justifyContent:"center",
//     alignItems:"center"
//   },
  
//   bottomBtnWrap:{marginTop:12,width:"85%"},
//   nextBtn:{height:50,borderRadius:10,backgroundColor:COLORS.primary}
// });

// import React, { useState, useEffect } from "react";
// import { StyleSheet, View, TouchableOpacity, Text, TextInput, Dimensions } from "react-native";
// import AutoHeightImage from "D:/Projects/Karomanage-mobile-android-app/src/@ui/auto-height-image/AutoHeightImage.tsx";
// import { IMAGES } from "D:/Projects/Karomanage-mobile-android-app/src/images";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import Button from "../../../@ui/button/Button";
// import { COLORS } from "../../../colors";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
// import { useBatchListsQuery } from "../../../apis/hooks/batch/query/useBatchLists.query";
// import { useBatchDetailsQuery } from "../../../apis/hooks/batch/query/useBatchDetails.query";
// import { useCourseDetailsQuery } from "../../../apis/hooks/course/query/useCourseDetails.query";
// import { useListEmployeeProfileQuery } from "../../../apis/hooks/employee/query/useListEmployeeProfile.query";

// export default function MonthlySalary(){

//   const navigation = useNavigation<THomeStackNavigator>();
//   const route = useRoute();
//   const employeeData = (route.params as any)?.employeeData;

//   const [employeeType, setEmployeeType] = useState("");
//   const [salaryType, setSalaryType] = useState("");

//   const [designation, setDesignation] = useState("");
//   const [salaryAmount, setSalaryAmount] = useState("");

//   const [fixedSalary, setFixedSalary] = useState("");
//   const [batch, setBatch] = useState("");
//   const [subject, setSubject] = useState("");

//   const [designationError, setDesignationError] = useState("");
//   const [salaryError, setSalaryError] = useState("");
//   const [fixedSalaryErr, setFixedSalaryErr] = useState("");
//   const [batchErr, setBatchErr] = useState("");
//   const [subjectErr, setSubjectErr] = useState("");
//   const [employeeTypeErr, setEmployeeTypeErr] = useState("");
//   const [salaryTypeErr, setSalaryTypeErr] = useState("");

//   const [openEmp, setOpenEmp] = useState(false);
//   const [openSalary, setOpenSalary] = useState(false);
//   const [openBatch, setOpenBatch] = useState(false);
//   const [openSubject, setOpenSubject] = useState(false);

//   const [batchId, setBatchId] = useState(""); // selected batchId for API call
//   const [courseIds, setCourseIds] = useState<string[]>([]); // courseIds from singleBatch response
//   const [subjectsList, setSubjectsList] = useState<any[]>([]); // subjects from singleCourse response
//   const [openDesignation, setOpenDesignation] = useState(false);
  
//   // Employee Profile API - for designation list
//   const { data: employeeProfileData, isLoading: isLoadingDesignation } = useListEmployeeProfileQuery();
//   const designationList: string[] = employeeProfileData?.data?.designation || [];
  
//   // Batch List API - dynamic batches
//   const { data: batchesListData, isLoading: batchesLoading } = useBatchListsQuery();
  
//   // Dynamic batch list from API
//   const batchList = batchesListData?.data?.map((batch: any) => ({
//     batchName: batch.batchName,
//     batchId: batch.batchId
//   })) || [];

//   // singleBatch API call - when batchId is selected
//   const { 
//     data: batchDetailsData, 
//     isLoading: batchDetailsLoading,
//     isSuccess: batchDetailsSuccess 
//   } = useBatchDetailsQuery(
//     { batchId: batchId || "" }
//   );

//   // useEffect - extract courseIds from singleBatch response
//   useEffect(() => {
//     if (batchDetailsSuccess && batchDetailsData?.data?.courses && batchDetailsData.data.courses.length > 0) {
//       const extractedCourseIds = batchDetailsData.data.courses.map(
//         (course: { courseId: string; courseStatus: string }) => course.courseId
//       );
//       setCourseIds(extractedCourseIds);
//       // Reset subject when batch changes
//       setSubject("");
//       setSubjectsList([]);
//     } else {
//       setCourseIds([]);
//       setSubjectsList([]);
//     }
//   }, [batchDetailsSuccess, batchDetailsData]);

//   // singleCourse API call - for first course (you can extend for multiple courses)
//   const firstCourseId = courseIds[0];
//   const { 
//     data: courseDetailsData, 
//     isLoading: courseDetailsLoading 
//   } = useCourseDetailsQuery(
//     { courseId: firstCourseId || "" }
//   );

//   // useEffect - extract subjects from singleCourse response
//   useEffect(() => {
//     if (courseDetailsData?.data?.subjects && courseDetailsData.data.subjects.length > 0) {
//       // Extract subjects from singleCourse response
//       const extractedSubjects = courseDetailsData.data.subjects.map(
//         (subject: any) => ({
//           subjectName: subject.subjectName,
//           subjectId: subject.subjectId
//         })
//       );
//       setSubjectsList(extractedSubjects);
//     } else {
//       setSubjectsList([]);
//     }
//   }, [courseDetailsData]);

//   // Dynamic subject list from API
//   const subjectList = subjectsList.map((s: any) => s.subjectName);

//   const onNext =()=>{

//     let valid = true;
//     setEmployeeTypeErr(""); setSalaryTypeErr("");
//     setDesignationError(""); setSalaryError("");
//     setFixedSalaryErr(""); setBatchErr(""); setSubjectErr("");

//     if(!employeeType){ setEmployeeTypeErr("This field is required"); valid=false; }
//     if(employeeType==="Teacher" && !salaryType){ setSalaryTypeErr("This field is required"); valid=false; }

//     if(employeeType==="Teacher" && salaryType==="Fixed Salary Per Month"){
//       if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
//       if(!batch.trim()){ setBatchErr("This field is required"); valid=false; }
//       if(!subject.trim()){ setSubjectErr("This field is required"); valid=false; }
//     }

//     if(employeeType==="Teacher" && salaryType==="Percentage Salary"){
//       if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
//       if(!batch.trim()){ setBatchErr("This field is required"); valid=false; }
//     }

//     if(employeeType==="Teacher" && salaryType==="Fixed and Percentage"){
//       if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
//       if(!salaryAmount.trim()){ setSalaryError("This field is required"); valid=false; }
//       if(!batch.trim()){ setBatchErr("This field is required"); valid=false; }
//     }

//     if(employeeType==="Teacher" && salaryType==="Lecture Based"){
//       if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
//       if(!batch.trim()){ setBatchErr("This field is required"); valid=false; }
//       if(!subject.trim()){ setSubjectErr("This field is required"); valid=false; }
//     }

//     if(employeeType==="Other"){
//       if(!designation.trim()){ setDesignationError("Designation is required"); valid=false; }
//       if(!salaryAmount.trim()){ setSalaryError("Salary amount is required"); valid=false; }
//       else if(isNaN(salaryAmount)){ setSalaryError("Numbers only"); valid=false; }
//     }

//     if(!valid) return;
    
//     // Debug: Check what we're passing to BankDetails
//     console.log("🔍 MonthlySalary - Passing to BankDetails:");
//     console.log("  - Employee Type:", employeeType);
//     console.log("  - Salary Type:", salaryType);
//     console.log("  - Fixed Salary:", fixedSalary);
//     console.log("  - Designation:", designation);
//     console.log("  - Salary Amount:", salaryAmount);
    
//     // Receive education data from route params
//     const highestQualificationData = (route.params as any)?.highestQualificationData || {};
//     const educationDetailsData = (route.params as any)?.educationDetailsData || {};
    
//     navigation.navigate("BankDetails",{
//       employeeData: employeeData,
//       highestQualificationData: highestQualificationData,
//       educationDetailsData: educationDetailsData,
//       employeeType,
//       salaryType,
//       fixedSalary,
//       batch,
//       subject,
//       designation,
//       salaryAmount
//     });
//   };

//   return(
//   <SafeView>
//     <AppHeader showDrawer={false} title="Employee Monthly Salary" handleBackClick={()=>navigation.goBack()}/>
//     <View style={styles.wrapper}>
//       <View style={styles.card}>
//         <ThemeScrollView contentContainerStyle={{paddingBottom:40}}>

//           <ScalableText style={styles.heading}>Monthly Salary</ScalableText>
//           <ScalableText style={styles.subtext}>Step 4 of 5 - Enter Information</ScalableText>

//           <ScalableText style={styles.label}>Employee Type*</ScalableText>
//           <TouchableOpacity 
//            style={[
//            styles.input,
//             employeeTypeErr&&styles.inputError,
//            {
//            flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             paddingRight: 10
//               }
//                ]} 
//                onPress={()=>setOpenEmp(!openEmp)}
//                   >
//                  <Text style={styles.text}>{employeeType || "Select Employee Type"}</Text>
//                 <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                 </TouchableOpacity>
//           {employeeTypeErr!=="" && <Text style={styles.errorMsg}>{employeeTypeErr}</Text>}

//           {openEmp && (
//             <View style={styles.dropdown}>
//               <TouchableOpacity onPress={()=>{setEmployeeType("Teacher");setOpenEmp(false);setEmployeeTypeErr("");}}>
//                 <Text style={styles.option}>Teacher</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={()=>{setEmployeeType("Other");setOpenEmp(false);setEmployeeTypeErr("");}}>
//                 <Text style={styles.option}>Other</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {employeeType==="Teacher" && (
//             <>
//               <ScalableText style={styles.label}>Salary Type*</ScalableText>
//               <TouchableOpacity 
//                   style={[
//                    styles.input,
//                   salaryTypeErr&&styles.inputError,
//                  {
//                    flexDirection: "row",
//                     justifyContent: "space-between",
//                    alignItems: "center",
//                   paddingRight: 10
//                   }
//                  ]} 
//               onPress={()=>setOpenSalary(!openSalary)}
//                >
//              <Text style={styles.text}>{salaryType || "Select Salary Type"}</Text>
//               <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                 </TouchableOpacity>
//               {salaryTypeErr!=="" && <Text style={styles.errorMsg}>{salaryTypeErr}</Text>}

//               {/* 🔥 Final i-icon dropdown merged without touching anything else */}
//               {openSalary && (
//                 <View style={styles.dropdown}>

//                   <View style={styles.salaryRow}>
//                     <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Fixed Salary Per Month");setOpenSalary(false); setSalaryTypeErr("");}}>
//                       <Text style={styles.salaryText}>Fixed salary per month</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={()=>alert("Every month fixed amount — no percentage included")}>
//                       <Text style={styles.infoIcon}>ⓘ</Text>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={styles.salaryRow}>
//                     <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Percentage Salary");setOpenSalary(false); setSalaryTypeErr("");}}>
//                       <Text style={styles.salaryText}>Percentage salary</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={()=>alert("Salary is % based on earning collection")}>
//                       <Text style={styles.infoIcon}>ⓘ</Text>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={styles.salaryRow}>
//                     <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Fixed and Percentage");setOpenSalary(false); setSalaryTypeErr("");}}>
//                       <Text style={styles.salaryText}>Fixed + Percentage</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={()=>alert("Fixed base + extra % bonus")}>
//                       <Text style={styles.infoIcon}>ⓘ</Text>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={styles.salaryRow}>
//                     <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Lecture Based");setOpenSalary(false); setSalaryTypeErr("");}}>
//                       <Text style={styles.salaryText}>Lecture Based</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={()=>alert("Salary = Rate × Lectures Taken")}>
//                       <Text style={styles.infoIcon}>ⓘ</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}

//               {/* FIXED SELECT – untouched, same */}
//               {salaryType==="Fixed Salary Per Month" && (
//                 <>
//                   <ScalableText style={styles.label}>Fixed Salary Per Month*</ScalableText>
//                   <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} keyboardType="numeric"
//                     placeholder="Enter fixed salary" value={fixedSalary}
//                     onChangeText={(v)=>{setFixedSalary(v);setFixedSalaryErr("");}}/>
//                   {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

//                   <ScalableText style={styles.label}>Select Batch*</ScalableText>
//                   <TouchableOpacity style={[
//                    styles.input,
//                    batchErr&&styles.inputError,
//                      {
//                    flexDirection: "row",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     paddingRight: 10
//                       }
//                          ]} onPress={()=>setOpenBatch(!openBatch)}>
//                      <Text style={styles.text}>{batch || "Select Batch"}</Text>
//                         <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                      </TouchableOpacity>
//                   {batchErr && <Text style={styles.errorMsg}>{batchErr}</Text>}
//                   {openBatch && (
//                     <View style={styles.dropdown}>
//                       {batchesLoading ? (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>Loading batches...</Text>
//                         </TouchableOpacity>
//                       ) : batchList.length > 0 ? (
//                         batchList.map((b: any, i: number) => (
//                           <TouchableOpacity 
//                             key={i} 
//                             onPress={() => {
//                               setBatch(b.batchName);
//                               setBatchId(b.batchId);
//                               setBatchErr("");
//                               setOpenBatch(false);
//                               setSubject("");
//                               setSubjectErr("");
//                             }}
//                           >
//                             <Text style={styles.option}>{b.batchName}</Text>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>No batches available</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   )}

//                   <ScalableText style={styles.label}>Select Subject*</ScalableText>
//                   <TouchableOpacity 
//                            style={[
//                             styles.input,
//                             subjectErr&&styles.inputError,
//                            (!batchId || batchDetailsLoading || courseDetailsLoading) && { opacity: 0.6 },
//                              {
//                           flexDirection: "row",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           paddingRight: 10
//                           }
//                           ]} 
//                        onPress={() => setOpenSubject(!openSubject)}
//                         disabled={!batchId || batchDetailsLoading || courseDetailsLoading}
//                        >
//                      <Text style={styles.text}>
//                      {subject || (batchDetailsLoading || courseDetailsLoading ? "Loading..." : "Select Subject")}
//                     </Text>
//                   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                  </TouchableOpacity>
//                   {subjectErr && <Text style={styles.errorMsg}>{subjectErr}</Text>}
//                   {openSubject && (
//                     <View style={styles.dropdown}>
//                       {batchDetailsLoading || courseDetailsLoading ? (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>Loading subjects...</Text>
//                         </TouchableOpacity>
//                       ) : subjectList.length > 0 ? (
//                         subjectList.map((s: string, i: number) => (
//                           <TouchableOpacity 
//                             key={i} 
//                             onPress={() => {
//                               setSubject(s);
//                               setSubjectErr("");
//                               setOpenSubject(false);
//                             }}
//                           >
//                             <Text style={styles.option}>{s}</Text>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>
//                             {batchId ? "No subjects available" : "Select batch first"}
//                           </Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   )}
//                 </>
//               )}

//               {/* PERCENTAGE */}
//               {salaryType==="Percentage Salary" && (
//                 <>
//                   <ScalableText style={styles.label}>Percentage Salary*</ScalableText>
//                   <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} placeholder="Enter % salary"
//                     keyboardType="numeric" value={fixedSalary}
//                     onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setFixedSalary(v);setFixedSalaryErr("");}}/>
//                   {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

//                   <ScalableText style={styles.label}>Select Batch*</ScalableText>
//                   <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
//                     <TouchableOpacity style={[styles.input,{flex:1},batchErr&&styles.inputError]}
//                       onPress={()=>setOpenBatch(!openBatch)}>
//                       <Text style={styles.text}>{batch || "Select Batch"}</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity 
//                      style={{width:40,height:40,borderRadius:40,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}
//                      onPress={() => navigation.navigate("CreateBatch")}
//                        >
//                      <Text style={{color:"#fff",fontSize:24,fontWeight:"bold"}}>+</Text>
//                       </TouchableOpacity>
//                   </View>
//                   {batchErr && <Text style={styles.errorMsg}>{batchErr}</Text>}
//                   {openBatch && (
//                     <View style={styles.dropdown}>
//                       {batchList.map((b: any, i: number) => (
//      <TouchableOpacity key={i} onPress={() => {
//        setBatch(b.batchName);
//        setBatchId(b.batchId);
//        setBatchErr("");
//        setOpenBatch(false);
//      }}>
//        <Text style={styles.option}>{b.batchName}</Text>
//      </TouchableOpacity>
//    ))}
//                     </View>
//                   )}
//                 </>
//               )}

//               {/* FIXED + % */}
//               {salaryType==="Fixed and Percentage" && (
//                 <>
//                   <ScalableText style={styles.label}>Fixed Salary Amount*</ScalableText>
//                   <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} keyboardType="numeric"
//                     placeholder="₹ fixed salary" value={fixedSalary}
//                     onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setFixedSalary(v);setFixedSalaryErr("");}}/>
//                   {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

//                   <ScalableText style={styles.label}>Percentage (%)*</ScalableText>
//                   <TextInput style={[styles.input,salaryError&&styles.inputError]} keyboardType="numeric"
//                     placeholder="% percentage" value={salaryAmount}
//                     onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setSalaryAmount(v);setSalaryError("");}}/>
//                   {salaryError && <Text style={styles.errorMsg}>{salaryError}</Text>}

//                   <ScalableText style={styles.label}>Select Batch*</ScalableText>
//                   <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
//                   <TouchableOpacity 
//                           style={[
//                          styles.input,
//                            {flex:1},
//                           batchErr&&styles.inputError,
//                           {
//                           flexDirection: "row",
//                          justifyContent: "space-between",
//                         alignItems: "center",
//                        paddingRight: 10
//                          }
//                           ]} 
//                         onPress={()=>setOpenBatch(!openBatch)}
//                        >
//                     <Text style={styles.text}>{batch || "Select Batch"}</Text>
//                      <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                     </TouchableOpacity>
//                     <TouchableOpacity 
//                      style={{width:40,height:40,borderRadius:40,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}
//                      onPress={() => navigation.navigate("CreateBatch")}
//                         >
//                       <Text style={{color:"#fff",fontSize:24,fontWeight:"bold"}}>+</Text>
//                      </TouchableOpacity>
//                   </View>
//                   {batchErr && <Text style={styles.errorMsg}>{batchErr}</Text>}
//                   {openBatch && (
//                     <View style={styles.dropdown}>
//                       {batchesLoading ? (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>Loading batches...</Text>
//                         </TouchableOpacity>
//                       ) : batchList.length > 0 ? (
//                         batchList.map((b: any, i: number) => (
//                           <TouchableOpacity 
//                             key={i} 
//                             onPress={() => {
//                               setBatch(b.batchName);
//                               setBatchId(b.batchId);
//                               setBatchErr("");
//                               setOpenBatch(false);
//                               setSubject("");
//                               setSubjectErr("");
//                             }}
//                           >
//                             <Text style={styles.option}>{b.batchName}</Text>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>No batches available</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   )}
//                 </>
//               )}

//               {/* LECTURE BASED */}
//               {salaryType==="Lecture Based" && (
//                 <>
//                   <ScalableText style={styles.label}>Lecture Rate (₹ per lecture)*</ScalableText>
//                   <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} keyboardType="numeric"
//                     placeholder="₹ per lecture" value={fixedSalary}
//                     onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setFixedSalary(v);setFixedSalaryErr("");}}/>
//                   {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

//                   <ScalableText style={styles.label}>Select Batch*</ScalableText>
//                   <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
//                   <TouchableOpacity 
//                       style={[
//                       styles.input,
//                         {flex:1},
//                          batchErr&&styles.inputError,
//                         {
//                          flexDirection: "row",
//                         justifyContent: "space-between",
//                        alignItems: "center",
//                         paddingRight: 10
//                          }
//                      ]} 
//                   onPress={()=>setOpenBatch(!openBatch)}
//                        >
//                  <Text style={styles.text}>{batch || "Select Batch"}</Text>
//                  <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                  </TouchableOpacity>
//                     <TouchableOpacity 
//                         style={{width:40,height:40,borderRadius:40,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}
//                      onPress={() => navigation.navigate("CreateBatch")}
//                          >
//                      <Text style={{color:"#fff",fontSize:24,fontWeight:"bold"}}>+</Text>
//                       </TouchableOpacity>
//                   </View>
//                   {batchErr && <Text style={styles.errorMsg}>{batchErr}</Text>}
//                   {openBatch && (
//                     <View style={styles.dropdown}>
//                       {batchesLoading ? (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>Loading batches...</Text>
//                         </TouchableOpacity>
//                       ) : batchList.length > 0 ? (
//                         batchList.map((b: any, i: number) => (
//                           <TouchableOpacity 
//                             key={i} 
//                             onPress={() => {
//                               setBatch(b.batchName);
//                               setBatchId(b.batchId);
//                               setBatchErr("");
//                               setOpenBatch(false);
//                               setSubject("");
//                               setSubjectErr("");
//                             }}
//                           >
//                             <Text style={styles.option}>{b.batchName}</Text>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>No batches available</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   )}

//                   <ScalableText style={styles.label}>Select Subject*</ScalableText>
//                   <TouchableOpacity 
//                                   style={[
//                                   styles.input,
//                                    subjectErr&&styles.inputError,
//                                   (!batchId || batchDetailsLoading || courseDetailsLoading) && { opacity: 0.6 },
//                                     {
//                                 flexDirection: "row",
//                                justifyContent: "space-between",
//                                alignItems: "center",
//                               paddingRight: 10
//                                }
//                              ]} 
//                          onPress={() => setOpenSubject(!openSubject)}
//                          disabled={!batchId || batchDetailsLoading || courseDetailsLoading}
//                         >
//                     <Text style={styles.text}>
//                     {subject || (batchDetailsLoading || courseDetailsLoading ? "Loading..." : "Select Subject")}
//                    </Text>
//                   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                   </TouchableOpacity>
//                   {subjectErr && <Text style={styles.errorMsg}>{subjectErr}</Text>}
//                   {openSubject && (
//                     <View style={styles.dropdown}>
//                       {subjectList.map((s,i)=>( 
//                         <TouchableOpacity key={i} onPress={()=>{setSubject(s);setSubjectErr("");setOpenSubject(false);}}>
//                           <Text style={styles.option}>{s}</Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
//                   )}
//                 </>
//               )}
//             </>
//           )}

//           {employeeType==="Other" && (
//             <>
//              <ScalableText style={styles.label}>Designation*</ScalableText>

// {/* Dropdown + Input Box */}
// <View style={styles.deptBox}>
//   <TextInput
//     value={designation}
//     onChangeText={(v) => {
//       setDesignation(v);
//       setDesignationError("");
//     }}
//     placeholder="Enter Designation"
//     style={[styles.deptInput, designationError && {borderColor:"red",borderWidth:1}]}
//   />
  
//   {/* Dropdown Icon */}
//   <TouchableOpacity
//     onPress={() => setOpenDesignation(!openDesignation)}
//     style={styles.deptIconWrap}
//   >
//     <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//   </TouchableOpacity>
// </View>

// {/* Error Message */}
// {designationError ? <Text style={styles.errorMsg}>{designationError}</Text> : null}

// {/* Dropdown List */}
// {openDesignation && (
//   <View style={styles.dropdown}>
//     {isLoadingDesignation ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>Loading designations...</Text>
//       </View>
//     ) : designationList.length === 0 ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>No designations found</Text>
//       </View>
//     ) : (
//       designationList.map((d, i) => (
//         <TouchableOpacity
//           key={i}
//           style={styles.option}
//           onPress={() => {
//             setDesignation(d);
//             setOpenDesignation(false);
//             setDesignationError("");
//           }}
//         >
//           <Text>{d}</Text>
//         </TouchableOpacity>
//       ))
//     )}
//   </View>
// )}

//               <ScalableText style={styles.label}>Salary Amount*</ScalableText>
//               <TextInput style={[styles.input,salaryError&&styles.inputError]} placeholder="Enter Salary"
//                 keyboardType="numeric" value={salaryAmount}
//                 onChangeText={(v)=>{setSalaryAmount(v);setSalaryError("");}}/>
//               {salaryError?<Text style={styles.errorMsg}>{salaryError}</Text>:null}
//             </>
//           )}

//         </ThemeScrollView>
//       </View>

//       <View style={styles.bottomBtnWrap}>
//         <Button title="Next" btnStyles={styles.nextBtn} btnTxtStyles={{fontSize:18}} onPress={onNext}/>
//       </View>
//     </View>
//   </SafeView>
//   );
// }

// const CARD_HEIGHT = Dimensions.get("window").height*0.62;

// const styles = StyleSheet.create({
//   wrapper:{flex:1,alignItems:"center",backgroundColor:COLORS.whiteSmoke,paddingTop:10},
//   card:{width:"88%",backgroundColor:"#fff",borderRadius:20,elevation:10,paddingHorizontal:25,paddingVertical:20,borderLeftWidth:6,borderLeftColor:COLORS.primary,height:CARD_HEIGHT},
//   heading:{fontSize:22,fontWeight:"bold",color:"#000",marginBottom:4,textAlign:"center"},
//   subtext:{fontSize:13,color:"#666",marginBottom:18,textAlign:"center"},
//   label:{fontSize:13,fontWeight:"800",marginBottom:6,color:"#000"},
//   input:{borderWidth:1,borderColor:"#000",borderRadius:10,height:48,paddingHorizontal:12,backgroundColor:"#fff",justifyContent:"center",marginBottom:5,width:"107%",fontFamily:undefined},
  
//   inputError:{borderColor:"red",borderWidth:2,height:44},
//   errorMsg:{color:"red",fontSize:12,marginTop:3,marginLeft:3},
//   text:{color:"#555",fontSize:14},

//   salaryRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingVertical:10,paddingHorizontal:10,borderBottomWidth:1,borderBottomColor:"#eee"},
//   salaryText:{fontSize:15,color:"#333"},
//   infoIcon:{fontSize:18,color:"#777",padding:4},

//   dropdown:{backgroundColor:"#fff",borderWidth:1,borderColor:"#ddd",borderRadius:10,marginTop:4,overflow:"hidden",width:"107%"},
//   option:{padding:12,fontSize:14,color:"#333",borderBottomWidth:1,borderBottomColor:"#eee"},
  
//   // Designation dropdown styles (same as department in index.tsx)
//   deptBox:{
//     height:44,
//     borderWidth:1,
//     borderColor:"#000",
//     borderRadius:10,
//     flexDirection:"row",
//     alignItems:"center",
//     paddingLeft:12,
//     marginBottom:5,
//     backgroundColor:"#fff",
//     width:"107%",
//   },
//   deptInput:{
//     flex:1,
//     fontSize:14,
//     color:"#555"
//   },
//   deptIconWrap:{
//     paddingHorizontal:12,
//     paddingVertical:6,
//     justifyContent:"center",
//     alignItems:"center"
//   },
  
//   bottomBtnWrap:{marginTop:12,width:"85%"},
//   nextBtn:{height:50,borderRadius:10,backgroundColor:COLORS.primary}
// });

// import React, { useState, useEffect } from "react";
// import { StyleSheet, View, TouchableOpacity, Text, TextInput, Dimensions } from "react-native";
// import AutoHeightImage from "D:/Projects/Karomanage-mobile-android-app/src/@ui/auto-height-image/AutoHeightImage.tsx";
// import { IMAGES } from "D:/Projects/Karomanage-mobile-android-app/src/images";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import Button from "../../../@ui/button/Button";
// import { COLORS } from "../../../colors";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
// import { useBatchListsQuery } from "../../../apis/hooks/batch/query/useBatchLists.query";
// import { useBatchDetailsQuery } from "../../../apis/hooks/batch/query/useBatchDetails.query";
// import { useCourseDetailsQuery } from "../../../apis/hooks/course/query/useCourseDetails.query";
// import { useListEmployeeProfileQuery } from "../../../apis/hooks/employee/query/useListEmployeeProfile.query";

// export default function MonthlySalary(){

//   const navigation = useNavigation<THomeStackNavigator>();
//   const route = useRoute();
//   const employeeData = (route.params as any)?.employeeData;

//   const [employeeType, setEmployeeType] = useState("");
//   const [salaryType, setSalaryType] = useState("");

//   const [designation, setDesignation] = useState("");
//   const [salaryAmount, setSalaryAmount] = useState("");

//   const [fixedSalary, setFixedSalary] = useState("");
//   const [batch, setBatch] = useState("");
//   const [subject, setSubject] = useState("");

//   const [designationError, setDesignationError] = useState("");
//   const [salaryError, setSalaryError] = useState("");
//   const [fixedSalaryErr, setFixedSalaryErr] = useState("");
//   const [batchErr, setBatchErr] = useState("");
//   const [subjectErr, setSubjectErr] = useState("");
//   const [employeeTypeErr, setEmployeeTypeErr] = useState("");
//   const [salaryTypeErr, setSalaryTypeErr] = useState("");

//   const [openEmp, setOpenEmp] = useState(false);
//   const [openSalary, setOpenSalary] = useState(false);
//   const [openBatch, setOpenBatch] = useState(false);
//   const [openSubject, setOpenSubject] = useState(false);

//   const [batchId, setBatchId] = useState(""); // selected batchId for API call
//   const [courseIds, setCourseIds] = useState<string[]>([]); // courseIds from singleBatch response
//   const [subjectsList, setSubjectsList] = useState<any[]>([]); // subjects from singleCourse response
//   const [openDesignation, setOpenDesignation] = useState(false);
  
//   // Employee Profile API - for designation list
//   const { data: employeeProfileData, isLoading: isLoadingDesignation } = useListEmployeeProfileQuery();
//   const designationList: string[] = employeeProfileData?.data?.designation || [];
  
//   // Batch List API - dynamic batches
//   const { data: batchesListData, isLoading: batchesLoading } = useBatchListsQuery();
  
//   // Dynamic batch list from API
//   const batchList = batchesListData?.data?.map((batch: any) => ({
//     batchName: batch.batchName,
//     batchId: batch.batchId
//   })) || [];

//   // singleBatch API call - when batchId is selected
//   const { 
//     data: batchDetailsData, 
//     isLoading: batchDetailsLoading,
//     isSuccess: batchDetailsSuccess 
//   } = useBatchDetailsQuery(
//     { batchId: batchId || "" }
//   );

//   // useEffect - extract courseIds from singleBatch response
//   useEffect(() => {
//     if (batchDetailsSuccess && batchDetailsData?.data?.courses && batchDetailsData.data.courses.length > 0) {
//       const extractedCourseIds = batchDetailsData.data.courses.map(
//         (course: { courseId: string; courseStatus: string }) => course.courseId
//       );
//       setCourseIds(extractedCourseIds);
//       // Reset subject when batch changes
//       setSubject("");
//       setSubjectsList([]);
//     } else {
//       setCourseIds([]);
//       setSubjectsList([]);
//     }
//   }, [batchDetailsSuccess, batchDetailsData]);

//   // singleCourse API call - for first course (you can extend for multiple courses)
//   const firstCourseId = courseIds[0];
//   const { 
//     data: courseDetailsData, 
//     isLoading: courseDetailsLoading 
//   } = useCourseDetailsQuery(
//     { courseId: firstCourseId || "" }
//   );

//   // useEffect - extract subjects from singleCourse response
//   useEffect(() => {
//     if (courseDetailsData?.data?.subjects && courseDetailsData.data.subjects.length > 0) {
//       // Extract subjects from singleCourse response
//       const extractedSubjects = courseDetailsData.data.subjects.map(
//         (subject: any) => ({
//           subjectName: subject.subjectName,
//           subjectId: subject.subjectId
//         })
//       );
//       setSubjectsList(extractedSubjects);
//     } else {
//       setSubjectsList([]);
//     }
//   }, [courseDetailsData]);

//   // Dynamic subject list from API
//   const subjectList = subjectsList.map((s: any) => s.subjectName);

//   const onNext =()=>{

//     let valid = true;
//     setEmployeeTypeErr(""); setSalaryTypeErr("");
//     setDesignationError(""); setSalaryError("");
//     setFixedSalaryErr(""); setBatchErr(""); setSubjectErr("");

//     if(!employeeType){ setEmployeeTypeErr("This field is required"); valid=false; }
//     if(employeeType==="Teacher" && !salaryType){ setSalaryTypeErr("This field is required"); valid=false; }

//     if(employeeType==="Teacher" && salaryType==="Fixed Salary Per Month"){
//       if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
//       if(!batch.trim()){ setBatchErr("This field is required"); valid=false; }
//       if(!subject.trim()){ setSubjectErr("This field is required"); valid=false; }
//     }

//     if(employeeType==="Teacher" && salaryType==="Percentage Salary"){
//       if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
//       if(!batch.trim()){ setBatchErr("This field is required"); valid=false; }
//     }

//     if(employeeType==="Teacher" && salaryType==="Fixed and Percentage"){
//       if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
//       if(!salaryAmount.trim()){ setSalaryError("This field is required"); valid=false; }
//       if(!batch.trim()){ setBatchErr("This field is required"); valid=false; }
//     }

//     if(employeeType==="Teacher" && salaryType==="Lecture Based"){
//       if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
//       if(!batch.trim()){ setBatchErr("This field is required"); valid=false; }
//       if(!subject.trim()){ setSubjectErr("This field is required"); valid=false; }
//     }

//     if(employeeType==="Other"){
//       if(!designation.trim()){ setDesignationError("Designation is required"); valid=false; }
//       if(!salaryAmount.trim()){ setSalaryError("Salary amount is required"); valid=false; }
//       else if(isNaN(salaryAmount)){ setSalaryError("Numbers only"); valid=false; }
//     }

//     if(!valid) return;
    
//     // Debug: Check what we're passing to BankDetails
//     console.log("🔍 MonthlySalary - Passing to BankDetails:");
//     console.log("  - Employee Type:", employeeType);
//     console.log("  - Salary Type:", salaryType);
//     console.log("  - Fixed Salary:", fixedSalary);
//     console.log("  - Designation:", designation);
//     console.log("  - Salary Amount:", salaryAmount);
    
//     // Receive education data from route params
//     const highestQualificationData = (route.params as any)?.highestQualificationData || {};
//     const educationDetailsData = (route.params as any)?.educationDetailsData || {};
    
//     navigation.navigate("BankDetails",{
//       employeeData: employeeData,
//       highestQualificationData: highestQualificationData,
//       educationDetailsData: educationDetailsData,
//       employeeType,
//       salaryType,
//       fixedSalary,
//       batch,
//       subject,
//       designation,
//       salaryAmount
//     });
//   };

//   return(
//   <SafeView>
//     <AppHeader showDrawer={false} title="Employee Monthly Salary" handleBackClick={()=>navigation.goBack()}/>
//     <View style={styles.wrapper}>
//       <View style={styles.card}>
//         <ThemeScrollView contentContainerStyle={{paddingBottom:40}}>

//           <ScalableText style={styles.heading}>Monthly Salary</ScalableText>
//           <ScalableText style={styles.subtext}>Step 4 of 5 - Enter Information</ScalableText>

//           <ScalableText style={styles.label}>Employee Type*</ScalableText>
//           <TouchableOpacity 
//            style={[
//            styles.input,
//             employeeTypeErr&&styles.inputError,
//            {
//            flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             paddingRight: 10
//               }
//                ]} 
//                onPress={()=>setOpenEmp(!openEmp)}
//                   >
//                  <Text style={styles.text}>{employeeType || "Select Employee Type"}</Text>
//                 <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                 </TouchableOpacity>
//           {employeeTypeErr!=="" && <Text style={styles.errorMsg}>{employeeTypeErr}</Text>}

//           {openEmp && (
//             <View style={styles.dropdown}>
//               <TouchableOpacity onPress={()=>{setEmployeeType("Teacher");setOpenEmp(false);setEmployeeTypeErr("");}}>
//                 <Text style={styles.option}>Teacher</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={()=>{setEmployeeType("Other");setOpenEmp(false);setEmployeeTypeErr("");}}>
//                 <Text style={styles.option}>Other</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {employeeType==="Teacher" && (
//             <>
//               <ScalableText style={styles.label}>Salary Type*</ScalableText>
//               <TouchableOpacity 
//                   style={[
//                    styles.input,
//                   salaryTypeErr&&styles.inputError,
//                  {
//                    flexDirection: "row",
//                     justifyContent: "space-between",
//                    alignItems: "center",
//                   paddingRight: 10
//                   }
//                  ]} 
//               onPress={()=>setOpenSalary(!openSalary)}
//                >
//              <Text style={styles.text}>{salaryType || "Select Salary Type"}</Text>
//               <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                 </TouchableOpacity>
//               {salaryTypeErr!=="" && <Text style={styles.errorMsg}>{salaryTypeErr}</Text>}

//               {/* 🔥 Final i-icon dropdown merged without touching anything else */}
//               {openSalary && (
//                 <View style={styles.dropdown}>

//                   <View style={styles.salaryRow}>
//                     <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Fixed Salary Per Month");setOpenSalary(false); setSalaryTypeErr("");}}>
//                       <Text style={styles.salaryText}>Fixed salary per month</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={()=>alert("Every month fixed amount — no percentage included")}>
//                       <Text style={styles.infoIcon}>ⓘ</Text>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={styles.salaryRow}>
//                     <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Percentage Salary");setOpenSalary(false); setSalaryTypeErr("");}}>
//                       <Text style={styles.salaryText}>Percentage salary</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={()=>alert("Salary is % based on earning collection")}>
//                       <Text style={styles.infoIcon}>ⓘ</Text>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={styles.salaryRow}>
//                     <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Fixed and Percentage");setOpenSalary(false); setSalaryTypeErr("");}}>
//                       <Text style={styles.salaryText}>Fixed + Percentage</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={()=>alert("Fixed base + extra % bonus")}>
//                       <Text style={styles.infoIcon}>ⓘ</Text>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={styles.salaryRow}>
//                     <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Lecture Based");setOpenSalary(false); setSalaryTypeErr("");}}>
//                       <Text style={styles.salaryText}>Lecture Based</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={()=>alert("Salary = Rate × Lectures Taken")}>
//                       <Text style={styles.infoIcon}>ⓘ</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}

//               {/* FIXED SELECT – untouched, same */}
//               {salaryType==="Fixed Salary Per Month" && (
//                 <>
//                   <ScalableText style={styles.label}>Fixed Salary Per Month*</ScalableText>
//                   <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} keyboardType="numeric"
//                     placeholder="Enter fixed salary" value={fixedSalary}
//                     onChangeText={(v)=>{setFixedSalary(v);setFixedSalaryErr("");}}/>
//                   {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

//                   <ScalableText style={styles.label}>Select Batch*</ScalableText>
//                   <TouchableOpacity style={[
//                    styles.input,
//                    batchErr&&styles.inputError,
//                      {
//                    flexDirection: "row",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     paddingRight: 10
//                       }
//                          ]} onPress={()=>setOpenBatch(!openBatch)}>
//                      <Text style={styles.text}>{batch || "Select Batch"}</Text>
//                         <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                      </TouchableOpacity>
//                   {batchErr && <Text style={styles.errorMsg}>{batchErr}</Text>}
//                   {openBatch && (
//                     <View style={styles.dropdown}>
//                       {batchesLoading ? (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>Loading batches...</Text>
//                         </TouchableOpacity>
//                       ) : batchList.length > 0 ? (
//                         batchList.map((b: any, i: number) => (
//                           <TouchableOpacity 
//                             key={i} 
//                             onPress={() => {
//                               setBatch(b.batchName);
//                               setBatchId(b.batchId);
//                               setBatchErr("");
//                               setOpenBatch(false);
//                               setSubject("");
//                               setSubjectErr("");
//                             }}
//                           >
//                             <Text style={styles.option}>{b.batchName}</Text>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>No batches available</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   )}

//                   <ScalableText style={styles.label}>Select Subject*</ScalableText>
//                   <TouchableOpacity 
//                            style={[
//                             styles.input,
//                             subjectErr&&styles.inputError,
//                            (!batchId || batchDetailsLoading || courseDetailsLoading) && { opacity: 0.6 },
//                              {
//                           flexDirection: "row",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           paddingRight: 10
//                           }
//                           ]} 
//                        onPress={() => setOpenSubject(!openSubject)}
//                         disabled={!batchId || batchDetailsLoading || courseDetailsLoading}
//                        >
//                      <Text style={styles.text}>
//                      {subject || (batchDetailsLoading || courseDetailsLoading ? "Loading..." : "Select Subject")}
//                     </Text>
//                   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                  </TouchableOpacity>
//                   {subjectErr && <Text style={styles.errorMsg}>{subjectErr}</Text>}
//                   {openSubject && (
//                     <View style={styles.dropdown}>
//                       {batchDetailsLoading || courseDetailsLoading ? (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>Loading subjects...</Text>
//                         </TouchableOpacity>
//                       ) : subjectList.length > 0 ? (
//                         subjectList.map((s: string, i: number) => (
//                           <TouchableOpacity 
//                             key={i} 
//                             onPress={() => {
//                               setSubject(s);
//                               setSubjectErr("");
//                               setOpenSubject(false);
//                             }}
//                           >
//                             <Text style={styles.option}>{s}</Text>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>
//                             {batchId ? "No subjects available" : "Select batch first"}
//                           </Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   )}
//                 </>
//               )}

//               {/* PERCENTAGE */}
//               {salaryType==="Percentage Salary" && (
//                 <>
//                   <ScalableText style={styles.label}>Percentage Salary*</ScalableText>
//                   <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} placeholder="Enter % salary"
//                     keyboardType="numeric" value={fixedSalary}
//                     onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setFixedSalary(v);setFixedSalaryErr("");}}/>
//                   {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

//                   <ScalableText style={styles.label}>Select Batch*</ScalableText>
//                   <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
//                     <TouchableOpacity style={[styles.input,{flex:1},batchErr&&styles.inputError]}
//                       onPress={()=>setOpenBatch(!openBatch)}>
//                       <Text style={styles.text}>{batch || "Select Batch"}</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity 
//                      style={{width:40,height:40,borderRadius:40,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}
//                      onPress={() => navigation.navigate("CreateBatch")}
//                        >
//                      <Text style={{color:"#fff",fontSize:24,fontWeight:"bold"}}>+</Text>
//                       </TouchableOpacity>
//                   </View>
//                   {batchErr && <Text style={styles.errorMsg}>{batchErr}</Text>}
//                   {openBatch && (
//                     <View style={styles.dropdown}>
//                       {batchList.map((b: any, i: number) => (
//      <TouchableOpacity key={i} onPress={() => {
//        setBatch(b.batchName);
//        setBatchId(b.batchId);
//        setBatchErr("");
//        setOpenBatch(false);
//      }}>
//        <Text style={styles.option}>{b.batchName}</Text>
//      </TouchableOpacity>
//    ))}
//                     </View>
//                   )}
//                 </>
//               )}

//               {/* FIXED + % */}
//               {salaryType==="Fixed and Percentage" && (
//                 <>
//                   <ScalableText style={styles.label}>Fixed Salary Amount*</ScalableText>
//                   <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} keyboardType="numeric"
//                     placeholder="₹ fixed salary" value={fixedSalary}
//                     onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setFixedSalary(v);setFixedSalaryErr("");}}/>
//                   {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

//                   <ScalableText style={styles.label}>Percentage (%)*</ScalableText>
//                   <TextInput style={[styles.input,salaryError&&styles.inputError]} keyboardType="numeric"
//                     placeholder="% percentage" value={salaryAmount}
//                     onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setSalaryAmount(v);setSalaryError("");}}/>
//                   {salaryError && <Text style={styles.errorMsg}>{salaryError}</Text>}

//                   <ScalableText style={styles.label}>Select Batch*</ScalableText>
//                   <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
//                   <TouchableOpacity 
//                           style={[
//                          styles.input,
//                            {flex:1},
//                           batchErr&&styles.inputError,
//                           {
//                           flexDirection: "row",
//                          justifyContent: "space-between",
//                         alignItems: "center",
//                        paddingRight: 10
//                          }
//                           ]} 
//                         onPress={()=>setOpenBatch(!openBatch)}
//                        >
//                     <Text style={styles.text}>{batch || "Select Batch"}</Text>
//                      <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                     </TouchableOpacity>
//                     <TouchableOpacity 
//                      style={{width:40,height:40,borderRadius:40,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}
//                      onPress={() => navigation.navigate("CreateBatch")}
//                         >
//                       <Text style={{color:"#fff",fontSize:24,fontWeight:"bold"}}>+</Text>
//                      </TouchableOpacity>
//                   </View>
//                   {batchErr && <Text style={styles.errorMsg}>{batchErr}</Text>}
//                   {openBatch && (
//                     <View style={styles.dropdown}>
//                       {batchesLoading ? (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>Loading batches...</Text>
//                         </TouchableOpacity>
//                       ) : batchList.length > 0 ? (
//                         batchList.map((b: any, i: number) => (
//                           <TouchableOpacity 
//                             key={i} 
//                             onPress={() => {
//                               setBatch(b.batchName);
//                               setBatchId(b.batchId);
//                               setBatchErr("");
//                               setOpenBatch(false);
//                               setSubject("");
//                               setSubjectErr("");
//                             }}
//                           >
//                             <Text style={styles.option}>{b.batchName}</Text>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>No batches available</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   )}
//                 </>
//               )}

//               {/* LECTURE BASED */}
//               {salaryType==="Lecture Based" && (
//                 <>
//                   <ScalableText style={styles.label}>Lecture Rate (₹ per lecture)*</ScalableText>
//                   <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} keyboardType="numeric"
//                     placeholder="₹ per lecture" value={fixedSalary}
//                     onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setFixedSalary(v);setFixedSalaryErr("");}}/>
//                   {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

//                   <ScalableText style={styles.label}>Select Batch*</ScalableText>
//                   <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
//                   <TouchableOpacity 
//                       style={[
//                       styles.input,
//                         {flex:1},
//                          batchErr&&styles.inputError,
//                         {
//                          flexDirection: "row",
//                         justifyContent: "space-between",
//                        alignItems: "center",
//                         paddingRight: 10
//                          }
//                      ]} 
//                   onPress={()=>setOpenBatch(!openBatch)}
//                        >
//                  <Text style={styles.text}>{batch || "Select Batch"}</Text>
//                  <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                  </TouchableOpacity>
//                     <TouchableOpacity 
//                         style={{width:40,height:40,borderRadius:40,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}
//                      onPress={() => navigation.navigate("CreateBatch")}
//                          >
//                      <Text style={{color:"#fff",fontSize:24,fontWeight:"bold"}}>+</Text>
//                       </TouchableOpacity>
//                   </View>
//                   {batchErr && <Text style={styles.errorMsg}>{batchErr}</Text>}
//                   {openBatch && (
//                     <View style={styles.dropdown}>
//                       {batchesLoading ? (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>Loading batches...</Text>
//                         </TouchableOpacity>
//                       ) : batchList.length > 0 ? (
//                         batchList.map((b: any, i: number) => (
//                           <TouchableOpacity 
//                             key={i} 
//                             onPress={() => {
//                               setBatch(b.batchName);
//                               setBatchId(b.batchId);
//                               setBatchErr("");
//                               setOpenBatch(false);
//                               setSubject("");
//                               setSubjectErr("");
//                             }}
//                           >
//                             <Text style={styles.option}>{b.batchName}</Text>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <TouchableOpacity disabled>
//                           <Text style={styles.option}>No batches available</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   )}

//                   <ScalableText style={styles.label}>Select Subject*</ScalableText>
//                   <TouchableOpacity 
//                                   style={[
//                                   styles.input,
//                                    subjectErr&&styles.inputError,
//                                   (!batchId || batchDetailsLoading || courseDetailsLoading) && { opacity: 0.6 },
//                                     {
//                                 flexDirection: "row",
//                                justifyContent: "space-between",
//                                alignItems: "center",
//                               paddingRight: 10
//                                }
//                              ]} 
//                          onPress={() => setOpenSubject(!openSubject)}
//                          disabled={!batchId || batchDetailsLoading || courseDetailsLoading}
//                         >
//                     <Text style={styles.text}>
//                     {subject || (batchDetailsLoading || courseDetailsLoading ? "Loading..." : "Select Subject")}
//                    </Text>
//                   <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//                   </TouchableOpacity>
//                   {subjectErr && <Text style={styles.errorMsg}>{subjectErr}</Text>}
//                   {openSubject && (
//                     <View style={styles.dropdown}>
//                       {subjectList.map((s,i)=>( 
//                         <TouchableOpacity key={i} onPress={()=>{setSubject(s);setSubjectErr("");setOpenSubject(false);}}>
//                           <Text style={styles.option}>{s}</Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
//                   )}
//                 </>
//               )}
//             </>
//           )}

//           {employeeType==="Other" && (
//             <>
//              <ScalableText style={styles.label}>Designation*</ScalableText>

// {/* Dropdown + Input Box */}
// <View style={styles.deptBox}>
//   <TextInput
//     value={designation}
//     onChangeText={(v) => {
//       setDesignation(v);
//       setDesignationError("");
//     }}
//     placeholder="Enter Designation"
//     style={[styles.deptInput, designationError && {borderColor:"red",borderWidth:1}]}
//   />
  
//   {/* Dropdown Icon */}
//   <TouchableOpacity
//     onPress={() => setOpenDesignation(!openDesignation)}
//     style={styles.deptIconWrap}
//   >
//     <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
//   </TouchableOpacity>
// </View>

// {/* Error Message */}
// {designationError ? <Text style={styles.errorMsg}>{designationError}</Text> : null}

// {/* Dropdown List */}
// {openDesignation && (
//   <View style={styles.dropdown}>
//     {isLoadingDesignation ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>Loading designations...</Text>
//       </View>
//     ) : designationList.length === 0 ? (
//       <View style={styles.option}>
//         <Text style={{ color: "#888" }}>No designations found</Text>
//       </View>
//     ) : (
//       designationList.map((d, i) => (
//         <TouchableOpacity
//           key={i}
//           style={styles.option}
//           onPress={() => {
//             setDesignation(d);
//             setOpenDesignation(false);
//             setDesignationError("");
//           }}
//         >
//           <Text>{d}</Text>
//         </TouchableOpacity>
//       ))
//     )}
//   </View>
// )}

//               <ScalableText style={styles.label}>Salary Amount*</ScalableText>
//               <TextInput style={[styles.input,salaryError&&styles.inputError]} placeholder="Enter Salary"
//                 keyboardType="numeric" value={salaryAmount}
//                 onChangeText={(v)=>{setSalaryAmount(v);setSalaryError("");}}/>
//               {salaryError?<Text style={styles.errorMsg}>{salaryError}</Text>:null}
//             </>
//           )}

//         </ThemeScrollView>
//       </View>

//       <View style={styles.bottomBtnWrap}>
//         <Button title="Next" btnStyles={styles.nextBtn} btnTxtStyles={{fontSize:18}} onPress={onNext}/>
//       </View>
//     </View>
//   </SafeView>
//   );
// }

// const CARD_HEIGHT = Dimensions.get("window").height*0.62;

// const styles = StyleSheet.create({
//   wrapper:{flex:1,alignItems:"center",backgroundColor:COLORS.whiteSmoke,paddingTop:10},
//   card:{width:"88%",backgroundColor:"#fff",borderRadius:20,elevation:10,paddingHorizontal:25,paddingVertical:20,borderLeftWidth:6,borderLeftColor:COLORS.primary,height:CARD_HEIGHT},
//   heading:{fontSize:22,fontWeight:"bold",color:"#000",marginBottom:4,textAlign:"center"},
//   subtext:{fontSize:13,color:"#666",marginBottom:18,textAlign:"center"},
//   label:{fontSize:13,fontWeight:"800",marginBottom:6,color:"#000"},
//   input:{borderWidth:1,borderColor:"#000",borderRadius:10,height:48,paddingHorizontal:12,backgroundColor:"#fff",justifyContent:"center",marginBottom:5,width:"107%",fontFamily:undefined},
  
//   inputError:{borderColor:"red",borderWidth:2,height:44},
//   errorMsg:{color:"red",fontSize:12,marginTop:3,marginLeft:3},
//   text:{color:"#555",fontSize:14},

//   salaryRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingVertical:10,paddingHorizontal:10,borderBottomWidth:1,borderBottomColor:"#eee"},
//   salaryText:{fontSize:15,color:"#333"},
//   infoIcon:{fontSize:18,color:"#777",padding:4},

//   dropdown:{backgroundColor:"#fff",borderWidth:1,borderColor:"#ddd",borderRadius:10,marginTop:4,overflow:"hidden",width:"107%"},
//   option:{padding:12,fontSize:14,color:"#333",borderBottomWidth:1,borderBottomColor:"#eee"},
  
//   // Designation dropdown styles (same as department in index.tsx)
//   deptBox:{
//     height:44,
//     borderWidth:1,
//     borderColor:"#000",
//     borderRadius:10,
//     flexDirection:"row",
//     alignItems:"center",
//     paddingLeft:12,
//     marginBottom:5,
//     backgroundColor:"#fff",
//     width:"107%",
//   },
//   deptInput:{
//     flex:1,
//     fontSize:14,
//     color:"#555"
//   },
//   deptIconWrap:{
//     paddingHorizontal:12,
//     paddingVertical:6,
//     justifyContent:"center",
//     alignItems:"center"
//   },
  
//   bottomBtnWrap:{marginTop:12,width:"85%"},
//   nextBtn:{height:50,borderRadius:10,backgroundColor:COLORS.primary}
// });

import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, TextInput, Dimensions } from "react-native";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage.tsx";
import { IMAGES } from "../../../images";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import Button from "../../../@ui/button/Button";
import { COLORS } from "../../../colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
import { useBatchListsQuery } from "../../../apis/hooks/batch/query/useBatchLists.query";
import { useBatchDetailsQuery } from "../../../apis/hooks/batch/query/useBatchDetails.query";
import { useCourseDetailsQuery } from "../../../apis/hooks/course/query/useCourseDetails.query";
import { useListEmployeeProfileQuery } from "../../../apis/hooks/employee/query/useListEmployeeProfile.query";

export default function MonthlySalary(){

  const navigation = useNavigation<THomeStackNavigator>();
  const route = useRoute();
  const employeeData = (route.params as any)?.employeeData;

  const [employeeType, setEmployeeType] = useState("");
  const [salaryType, setSalaryType] = useState("");

  const [designation, setDesignation] = useState("");
  const [salaryAmount, setSalaryAmount] = useState("");

  const [fixedSalary, setFixedSalary] = useState("");
  const [batch, setBatch] = useState("");
  const [subject, setSubject] = useState("");

  const [designationError, setDesignationError] = useState("");
  const [salaryError, setSalaryError] = useState("");
  const [fixedSalaryErr, setFixedSalaryErr] = useState("");
  const [batchErr, setBatchErr] = useState("");
  const [subjectErr, setSubjectErr] = useState("");
  const [employeeTypeErr, setEmployeeTypeErr] = useState("");
  const [salaryTypeErr, setSalaryTypeErr] = useState("");

  const [openEmp, setOpenEmp] = useState(false);
  const [openSalary, setOpenSalary] = useState(false);
  const [openBatch, setOpenBatch] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);

  const [batchId, setBatchId] = useState(""); // selected batchId for API call
  const [courseIds, setCourseIds] = useState<string[]>([]); // courseIds from singleBatch response
  const [subjectsList, setSubjectsList] = useState<any[]>([]); // subjects from singleCourse response
  const [openDesignation, setOpenDesignation] = useState(false);
  
  // Employee Profile API - for designation list
  const { data: employeeProfileData, isLoading: isLoadingDesignation } = useListEmployeeProfileQuery();
  const designationList: string[] = employeeProfileData?.data?.designation || [];
  
  // Batch List API - dynamic batches
  const { data: batchesListData, isLoading: batchesLoading } = useBatchListsQuery();
  
  // Dynamic batch list from API
  const batchList = batchesListData?.data?.map((batch: any) => ({
    batchName: batch.batchName,
    batchId: batch.batchId
  })) || [];

  // singleBatch API call - when batchId is selected
  const { 
    data: batchDetailsData, 
    isLoading: batchDetailsLoading,
    isSuccess: batchDetailsSuccess 
  } = useBatchDetailsQuery(
    { batchId: batchId || "" }
  );

  // useEffect - extract courseIds from singleBatch response
  useEffect(() => {
    if (batchDetailsSuccess && batchDetailsData?.data?.courses && batchDetailsData.data.courses.length > 0) {
      const extractedCourseIds = batchDetailsData.data.courses.map(
        (course: { courseId: string; courseStatus: string }) => course.courseId
      );
      setCourseIds(extractedCourseIds);
      // Reset subject when batch changes
      setSubject("");
      setSubjectsList([]);
    } else {
      setCourseIds([]);
      setSubjectsList([]);
    }
  }, [batchDetailsSuccess, batchDetailsData]);

  // singleCourse API call - for first course (you can extend for multiple courses)
  const firstCourseId = courseIds[0];
  const { 
    data: courseDetailsData, 
    isLoading: courseDetailsLoading 
  } = useCourseDetailsQuery(
    { courseId: firstCourseId || "" }
  );

  // useEffect - extract subjects from singleCourse response
  useEffect(() => {
    if (courseDetailsData?.data?.subjects && courseDetailsData.data.subjects.length > 0) {
      // Extract subjects from singleCourse response
      const extractedSubjects = courseDetailsData.data.subjects.map(
        (subject: any) => ({
          subjectName: subject.subjectName,
          subjectId: subject.subjectId
        })
      );
      setSubjectsList(extractedSubjects);
    } else {
      setSubjectsList([]);
    }
  }, [courseDetailsData]);

  // Dynamic subject list from API
  const subjectList = subjectsList.map((s: any) => s.subjectName);

  const onNext =()=>{

    let valid = true;
    setEmployeeTypeErr(""); setSalaryTypeErr("");
    setDesignationError(""); setSalaryError("");
    setFixedSalaryErr(""); setBatchErr(""); setSubjectErr("");

    if(!employeeType){ setEmployeeTypeErr("This field is required"); valid=false; }
    if(employeeType==="Teacher" && !salaryType){ setSalaryTypeErr("This field is required"); valid=false; }

    if(employeeType==="Teacher" && salaryType==="Fixed Salary Per Month"){
      if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
    }

    if(employeeType==="Teacher" && salaryType==="Percentage Salary"){
      if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
    }

    if(employeeType==="Teacher" && salaryType==="Fixed and Percentage"){
      if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
      if(!salaryAmount.trim()){ setSalaryError("This field is required"); valid=false; }
    }

    if(employeeType==="Teacher" && salaryType==="Lecture Based"){
      if(!fixedSalary.trim()){ setFixedSalaryErr("This field is required"); valid=false; }
    }

    if(employeeType==="Other"){
      if(!designation.trim()){ setDesignationError("Designation is required"); valid=false; }
      if(!salaryAmount.trim()){ setSalaryError("Salary amount is required"); valid=false; }
      else if(isNaN(salaryAmount)){ setSalaryError("Numbers only"); valid=false; }
    }

    if(!valid) return;
    
    // Debug: Check what we're passing to BankDetails
    console.log("🔍 MonthlySalary - Passing to BankDetails:");
    console.log("  - Employee Type:", employeeType);
    console.log("  - Salary Type:", salaryType);
    console.log("  - Fixed Salary:", fixedSalary);
    console.log("  - Designation:", designation);
    console.log("  - Salary Amount:", salaryAmount);
    
    // Receive education data from route params
    const highestQualificationData = (route.params as any)?.highestQualificationData || {};
    const educationDetailsData = (route.params as any)?.educationDetailsData || {};
    
    navigation.navigate("BankDetails",{
      employeeData: employeeData,
      highestQualificationData: highestQualificationData,
      educationDetailsData: educationDetailsData,
      employeeType,
      salaryType,
      fixedSalary,
      batch,
      subject,
      designation,
      salaryAmount
    });
  };

  return(
  <SafeView>
    <AppHeader showDrawer={false} title="Employee Monthly Salary" handleBackClick={()=>navigation.goBack()}/>
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <ThemeScrollView contentContainerStyle={{paddingBottom:40}}>

          <ScalableText style={styles.heading}>Monthly Salary</ScalableText>
          <ScalableText style={styles.subtext}>Step 4 of 5 - Enter Information</ScalableText>

          <ScalableText style={styles.label}>Employee Type*</ScalableText>
          <TouchableOpacity 
           style={[
           styles.input,
            employeeTypeErr&&styles.inputError,
           {
           flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 10
              }
               ]} 
               onPress={()=>setOpenEmp(!openEmp)}
                  >
                 <Text style={styles.text}>{employeeType || "Select Employee Type"}</Text>
                <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
                </TouchableOpacity>
          {employeeTypeErr!=="" && <Text style={styles.errorMsg}>{employeeTypeErr}</Text>}

          {openEmp && (
            <View style={styles.dropdown}>
              <TouchableOpacity onPress={()=>{setEmployeeType("Teacher");setOpenEmp(false);setEmployeeTypeErr("");}}>
                <Text style={styles.option}>Teacher</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{setEmployeeType("Other");setOpenEmp(false);setEmployeeTypeErr("");}}>
                <Text style={styles.option}>Other</Text>
              </TouchableOpacity>
            </View>
          )}

          {employeeType==="Teacher" && (
            <>
              <ScalableText style={styles.label}>Salary Type*</ScalableText>
              <TouchableOpacity 
                  style={[
                   styles.input,
                  salaryTypeErr&&styles.inputError,
                 {
                   flexDirection: "row",
                    justifyContent: "space-between",
                   alignItems: "center",
                  paddingRight: 10
                  }
                 ]} 
              onPress={()=>setOpenSalary(!openSalary)}
               >
             <Text style={styles.text}>{salaryType || "Select Salary Type"}</Text>
              <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
                </TouchableOpacity>
              {salaryTypeErr!=="" && <Text style={styles.errorMsg}>{salaryTypeErr}</Text>}

              {/* 🔥 Final i-icon dropdown merged without touching anything else */}
              {openSalary && (
                <View style={styles.dropdown}>

                  <View style={styles.salaryRow}>
                    <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Fixed Salary Per Month");setOpenSalary(false); setSalaryTypeErr("");}}>
                      <Text style={styles.salaryText}>Fixed salary per month</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>alert("Every month fixed amount — no percentage included")}>
                      <Text style={styles.infoIcon}>ⓘ</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.salaryRow}>
                    <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Percentage Salary");setOpenSalary(false); setSalaryTypeErr("");}}>
                      <Text style={styles.salaryText}>Percentage salary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>alert("Salary is % based on earning collection")}>
                      <Text style={styles.infoIcon}>ⓘ</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.salaryRow}>
                    <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Fixed and Percentage");setOpenSalary(false); setSalaryTypeErr("");}}>
                      <Text style={styles.salaryText}>Fixed + Percentage</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>alert("Fixed base + extra % bonus")}>
                      <Text style={styles.infoIcon}>ⓘ</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.salaryRow}>
                    <TouchableOpacity style={{flex:1}} onPress={()=>{setSalaryType("Lecture Based");setOpenSalary(false); setSalaryTypeErr("");}}>
                      <Text style={styles.salaryText}>Lecture Based</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>alert("Salary = Rate × Lectures Taken")}>
                      <Text style={styles.infoIcon}>ⓘ</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* FIXED SELECT – untouched, same */}
              {salaryType==="Fixed Salary Per Month" && (
                <>
                  <ScalableText style={styles.label}>Fixed Salary Per Month*</ScalableText>
                  <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} keyboardType="numeric"
                    placeholder="Enter fixed salary" value={fixedSalary}
                    onChangeText={(v)=>{setFixedSalary(v);setFixedSalaryErr("");}}/>
                  {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

                  <ScalableText style={styles.label}>Select Batch</ScalableText>
                  <TouchableOpacity style={[
                   styles.input,
                     {
                   flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: 10
                      }
                         ]} onPress={()=>setOpenBatch(!openBatch)}>
                     <Text style={styles.text}>{batch || "Select Batch"}</Text>
                        <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
                     </TouchableOpacity>
                  {openBatch && (
                    <View style={styles.dropdown}>
                      {batchesLoading ? (
                        <TouchableOpacity disabled>
                          <Text style={styles.option}>Loading batches...</Text>
                        </TouchableOpacity>
                      ) : batchList.length > 0 ? (
                        batchList.map((b: any, i: number) => (
                          <TouchableOpacity 
                            key={i} 
                            onPress={() => {
                              setBatch(b.batchName);
                              setBatchId(b.batchId);
                              setBatchErr("");
                              setOpenBatch(false);
                              setSubject("");
                              setSubjectErr("");
                            }}
                          >
                            <Text style={styles.option}>{b.batchName}</Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <TouchableOpacity disabled>
                          <Text style={styles.option}>No batches available</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  <ScalableText style={styles.label}>Select Subject</ScalableText>
                  <TouchableOpacity 
                           style={[
                            styles.input,
                           (!batchId || batchDetailsLoading || courseDetailsLoading) && { opacity: 0.6 },
                             {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingRight: 10
                          }
                          ]} 
                       onPress={() => setOpenSubject(!openSubject)}
                        disabled={!batchId || batchDetailsLoading || courseDetailsLoading}
                       >
                     <Text style={styles.text}>
                     {subject || (batchDetailsLoading || courseDetailsLoading ? "Loading..." : "Select Subject")}
                    </Text>
                  <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
                 </TouchableOpacity>
                  {openSubject && (
                    <View style={styles.dropdown}>
                      {batchDetailsLoading || courseDetailsLoading ? (
                        <TouchableOpacity disabled>
                          <Text style={styles.option}>Loading subjects...</Text>
                        </TouchableOpacity>
                      ) : subjectList.length > 0 ? (
                        subjectList.map((s: string, i: number) => (
                          <TouchableOpacity 
                            key={i} 
                            onPress={() => {
                              setSubject(s);
                              setSubjectErr("");
                              setOpenSubject(false);
                            }}
                          >
                            <Text style={styles.option}>{s}</Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <TouchableOpacity disabled>
                          <Text style={styles.option}>
                            {batchId ? "No subjects available" : "Select batch first"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </>
              )}

              {/* PERCENTAGE */}
              {salaryType==="Percentage Salary" && (
                <>
                  <ScalableText style={styles.label}>Percentage Salary*</ScalableText>
                  <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} placeholder="Enter % salary"
                    keyboardType="numeric" value={fixedSalary}
                    onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setFixedSalary(v);setFixedSalaryErr("");}}/>
                  {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

                  <ScalableText style={styles.label}>Select Batch</ScalableText>
                  <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
                    <TouchableOpacity style={[styles.input,{flex:1}]}
                      onPress={()=>setOpenBatch(!openBatch)}>
                      <Text style={styles.text}>{batch || "Select Batch"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                     style={{width:40,height:40,borderRadius:40,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}
                     onPress={() => navigation.navigate("CreateBatch")}
                       >
                     <Text style={{color:"#fff",fontSize:24,fontWeight:"bold"}}>+</Text>
                      </TouchableOpacity>
                  </View>
                  {openBatch && (
                    <View style={styles.dropdown}>
                      {batchList.map((b: any, i: number) => (
     <TouchableOpacity key={i} onPress={() => {
       setBatch(b.batchName);
       setBatchId(b.batchId);
       setBatchErr("");
       setOpenBatch(false);
     }}>
       <Text style={styles.option}>{b.batchName}</Text>
     </TouchableOpacity>
   ))}
                    </View>
                  )}
                </>
              )}

              {/* FIXED + % */}
              {salaryType==="Fixed and Percentage" && (
                <>
                  <ScalableText style={styles.label}>Fixed Salary Amount*</ScalableText>
                  <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} keyboardType="numeric"
                    placeholder="₹ fixed salary" value={fixedSalary}
                    onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setFixedSalary(v);setFixedSalaryErr("");}}/>
                  {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

                  <ScalableText style={styles.label}>Percentage (%)*</ScalableText>
                  <TextInput style={[styles.input,salaryError&&styles.inputError]} keyboardType="numeric"
                    placeholder="% percentage" value={salaryAmount}
                    onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setSalaryAmount(v);setSalaryError("");}}/>
                  {salaryError && <Text style={styles.errorMsg}>{salaryError}</Text>}

                  <ScalableText style={styles.label}>Select Batch</ScalableText>
                  <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
                  <TouchableOpacity 
                          style={[
                         styles.input,
                           {flex:1},
                          {
                          flexDirection: "row",
                         justifyContent: "space-between",
                        alignItems: "center",
                       paddingRight: 10
                         }
                          ]} 
                        onPress={()=>setOpenBatch(!openBatch)}
                       >
                    <Text style={styles.text}>{batch || "Select Batch"}</Text>
                     <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                     style={{width:40,height:40,borderRadius:40,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}
                     onPress={() => navigation.navigate("CreateBatch")}
                        >
                      <Text style={{color:"#fff",fontSize:24,fontWeight:"bold"}}>+</Text>
                     </TouchableOpacity>
                  </View>
                  {openBatch && (
                    <View style={styles.dropdown}>
                      {batchesLoading ? (
                        <TouchableOpacity disabled>
                          <Text style={styles.option}>Loading batches...</Text>
                        </TouchableOpacity>
                      ) : batchList.length > 0 ? (
                        batchList.map((b: any, i: number) => (
                          <TouchableOpacity 
                            key={i} 
                            onPress={() => {
                              setBatch(b.batchName);
                              setBatchId(b.batchId);
                              setBatchErr("");
                              setOpenBatch(false);
                              setSubject("");
                              setSubjectErr("");
                            }}
                          >
                            <Text style={styles.option}>{b.batchName}</Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <TouchableOpacity disabled>
                          <Text style={styles.option}>No batches available</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </>
              )}

              {/* LECTURE BASED */}
              {salaryType==="Lecture Based" && (
                <>
                  <ScalableText style={styles.label}>Lecture Rate (₹ per lecture)*</ScalableText>
                  <TextInput style={[styles.input,fixedSalaryErr&&styles.inputError]} keyboardType="numeric"
                    placeholder="₹ per lecture" value={fixedSalary}
                    onChangeText={(v)=>{if(/^[0-9]*$/.test(v)) setFixedSalary(v);setFixedSalaryErr("");}}/>
                  {fixedSalaryErr && <Text style={styles.errorMsg}>{fixedSalaryErr}</Text>}

                  <ScalableText style={styles.label}>Select Batch</ScalableText>
                  <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
                  <TouchableOpacity 
                      style={[
                      styles.input,
                        {flex:1},
                        {
                         flexDirection: "row",
                        justifyContent: "space-between",
                       alignItems: "center",
                        paddingRight: 10
                         }
                     ]} 
                  onPress={()=>setOpenBatch(!openBatch)}
                       >
                 <Text style={styles.text}>{batch || "Select Batch"}</Text>
                 <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
                 </TouchableOpacity>
                    <TouchableOpacity 
                        style={{width:40,height:40,borderRadius:40,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}
                     onPress={() => navigation.navigate("CreateBatch")}
                         >
                     <Text style={{color:"#fff",fontSize:24,fontWeight:"bold"}}>+</Text>
                      </TouchableOpacity>
                  </View>
                  {openBatch && (
                    <View style={styles.dropdown}>
                      {batchesLoading ? (
                        <TouchableOpacity disabled>
                          <Text style={styles.option}>Loading batches...</Text>
                        </TouchableOpacity>
                      ) : batchList.length > 0 ? (
                        batchList.map((b: any, i: number) => (
                          <TouchableOpacity 
                            key={i} 
                            onPress={() => {
                              setBatch(b.batchName);
                              setBatchId(b.batchId);
                              setBatchErr("");
                              setOpenBatch(false);
                              setSubject("");
                              setSubjectErr("");
                            }}
                          >
                            <Text style={styles.option}>{b.batchName}</Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <TouchableOpacity disabled>
                          <Text style={styles.option}>No batches available</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  <ScalableText style={styles.label}>Select Subject</ScalableText>
                  <TouchableOpacity 
                                  style={[
                                  styles.input,
                                  (!batchId || batchDetailsLoading || courseDetailsLoading) && { opacity: 0.6 },
                                    {
                                flexDirection: "row",
                               justifyContent: "space-between",
                               alignItems: "center",
                              paddingRight: 10
                               }
                             ]} 
                         onPress={() => setOpenSubject(!openSubject)}
                         disabled={!batchId || batchDetailsLoading || courseDetailsLoading}
                        >
                    <Text style={styles.text}>
                    {subject || (batchDetailsLoading || courseDetailsLoading ? "Loading..." : "Select Subject")}
                   </Text>
                  <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
                  </TouchableOpacity>
                  {openSubject && (
                    <View style={styles.dropdown}>
                      {subjectList.map((s,i)=>( 
                        <TouchableOpacity key={i} onPress={()=>{setSubject(s);setSubjectErr("");setOpenSubject(false);}}>
                          <Text style={styles.option}>{s}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}
            </>
          )}

          {employeeType==="Other" && (
            <>
             <ScalableText style={styles.label}>Designation*</ScalableText>

{/* Dropdown + Input Box */}
<View style={[styles.deptBox, designationError && styles.inputError]}>

  <TextInput
    value={designation}
    onChangeText={(v) => {
      setDesignation(v);
      setDesignationError("");
    }}
    placeholder="Enter Designation"
    style={styles.deptInput}

  />
  
  {/* Dropdown Icon */}
  <TouchableOpacity
    onPress={() => setOpenDesignation(!openDesignation)}
    style={styles.deptIconWrap}
  >
    <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
  </TouchableOpacity>
</View>

{/* Error Message */}
{designationError ? <Text style={styles.errorMsg}>{designationError}</Text> : null}

{/* Dropdown List */}
{openDesignation && (
  <View style={styles.dropdown}>
    {isLoadingDesignation ? (
      <View style={styles.option}>
        <Text style={{ color: "#888" }}>Loading designations...</Text>
      </View>
    ) : designationList.length === 0 ? (
      <View style={styles.option}>
        <Text style={{ color: "#888" }}>No designations found</Text>
      </View>
    ) : (
      designationList.map((d, i) => (
        <TouchableOpacity
          key={i}
          style={styles.option}
          onPress={() => {
            setDesignation(d);
            setOpenDesignation(false);
            setDesignationError("");
          }}
        >
          <Text>{d}</Text>
        </TouchableOpacity>
      ))
    )}
  </View>
)}

              <ScalableText style={styles.label}>Salary Amount*</ScalableText>
              <TextInput style={[styles.input,salaryError&&styles.inputError]} placeholder="Enter Salary"
                keyboardType="numeric" value={salaryAmount}
                onChangeText={(v)=>{setSalaryAmount(v);setSalaryError("");}}/>
              {salaryError?<Text style={styles.errorMsg}>{salaryError}</Text>:null}
            </>
          )}

        </ThemeScrollView>
      </View>

      <View style={styles.bottomBtnWrap}>
        <Button title="Next" btnStyles={styles.nextBtn} btnTxtStyles={{fontSize:18}} onPress={onNext}/>
      </View>
    </View>
  </SafeView>
  );
}

const CARD_HEIGHT = Dimensions.get("window").height*0.62;

const styles = StyleSheet.create({
  wrapper:{flex:1,alignItems:"center",backgroundColor:COLORS.whiteSmoke,paddingTop:10},
  card:{width:"88%",backgroundColor:"#fff",borderRadius:20,elevation:10,paddingHorizontal:25,paddingVertical:20,borderLeftWidth:6,borderLeftColor:COLORS.primary,height:CARD_HEIGHT},
  heading:{fontSize:22,fontWeight:"bold",color:"#000",marginBottom:4,textAlign:"center"},
  subtext:{fontSize:13,color:"#666",marginBottom:18,textAlign:"center"},
  label:{fontSize:13,fontWeight:"800",marginBottom:6,color:"#000"},
  input:{borderWidth:1,borderColor:"#000",borderRadius:10,height:48,paddingHorizontal:12,backgroundColor:"#fff",justifyContent:"center",marginBottom:5,width:"107%",fontFamily:undefined},
  
  inputError:{borderColor:"red",borderWidth:2,height:44},
  errorMsg:{color:"red",fontSize:12,marginTop:3,marginLeft:3},
  text:{color:"#555",fontSize:14},

  salaryRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingVertical:10,paddingHorizontal:10,borderBottomWidth:1,borderBottomColor:"#eee"},
  salaryText:{fontSize:15,color:"#333"},
  infoIcon:{fontSize:18,color:"#777",padding:4},

  dropdown:{backgroundColor:"#fff",borderWidth:1,borderColor:"#ddd",borderRadius:10,marginTop:4,overflow:"hidden",width:"107%"},
  option:{padding:12,fontSize:14,color:"#333",borderBottomWidth:1,borderBottomColor:"#eee"},
  
  // Designation dropdown styles (same as department in index.tsx)
  deptBox:{
    height:44,
    borderWidth:1,
    borderColor:"#000",
    borderRadius:10,
    flexDirection:"row",
    alignItems:"center",
    paddingLeft:12,
    marginBottom:5,
    backgroundColor:"#fff",
    width:"107%",
  },
  deptInput:{
    flex:1,
    fontSize:14,
    color:"#555"
  },
  deptIconWrap:{
    paddingHorizontal:12,
    paddingVertical:6,
    justifyContent:"center",
    alignItems:"center"
  },
  
  bottomBtnWrap:{marginTop:12,width:"85%"},
  nextBtn:{height:50,borderRadius:10,backgroundColor:COLORS.primary}
});

