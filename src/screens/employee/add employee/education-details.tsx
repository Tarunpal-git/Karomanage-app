



// import React from "react";
// import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import { useRoute } from "@react-navigation/native";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import Input from "../../../@ui/input/Input";
// import Button from "../../../@ui/button/Button";
// import { COLORS } from "../../../colors";
// import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
// import { useNavigation } from "@react-navigation/native";

// export default function EducationDetails() {

//   const route = useRoute();
//   const { educationType } = route.params as { educationType:string };

//   const { control, handleSubmit, formState:{errors} } = useForm({mode:"onSubmit"});
//   const navigation = useNavigation<THomeStackNavigator>();
//     const onNext = (data:any)=>{
//     console.log("📌 EDUCATION DETAILS ==> ",data);
    
//     // Previous screens ka data get karo
//     const employeeData = route.params?.employeeData;
//     const highestQualificationData = route.params?.highestQualificationData;
    
//     // Monthly Salary screen pe navigate karo
//     navigation.navigate("MonthlySalary", {
//       employeeData: employeeData,
//       highestQualificationData: highestQualificationData,
//       educationDetailsData: data
//     });
//   };
//   return (
//     <SafeView>
//       {/* <AppHeader title="Education Details" showDrawer={false}/> */}
//       <AppHeader title="Education Details" showDrawer={false} handleBackClick={()=>navigation.goBack()}/>
//       <View style={styles.wrapper}>

//         <View style={[styles.card,{height:Heights.cardHeight}]}>
//         <ThemeScrollView contentContainerStyle={{paddingBottom:60}}>

//           <ScalableText style={styles.heading}>Education Details</ScalableText>
//           {/* <ScalableText style={styles.subtext}>Selected: {educationType}</ScalableText> */}
//           <ScalableText style={styles.sub}>Step 3 of 5 • Enter Information</ScalableText>


//           {/* =================== BLOCK : HIGH SCHOOL =================== */}
//           {educationType && <>
//             <Title text="High School"/>
//             <Field name="hs_name" label="School Name*" rules={{ required:"Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="hs_percentage" label="Percentage*" rules={{ required:"Required", pattern:{value:/^[0-9]{1,3}$/,message:"Number only"} }} control={control} errors={errors}/>
//             <Field name="hs_board" label="Board*" rules={{ required:"Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="hs_address" label="School Address*" rules={{ required:"Required", pattern:{value:/^[A-Za-z0-9 ,.-]+$/,message:"Alphanumeric only"} }} control={control} errors={errors}/>
//             <CertificateBtn/>
//           </>}


//           {/* ================= HIGHER SECONDARY ================= */}
//           {(educationType==="Higher Secondary School"||educationType==="Graduation"||educationType==="Post Graduation") && <>
//             <Title text="Higher Secondary"/>
//             <Field name="hsc_name" label="School Name*" rules={{ required:"Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="hsc_percentage" label="Percentage*" rules={{ required:"Required", pattern:{value:/^[0-9]{1,3}$/,message:"Number only"} }} control={control} errors={errors}/>
//             <Field name="hsc_board" label="Board*" rules={{ required:"Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="hsc_address" label="Address*" rules={{ required:"Required", pattern:{value:/^[A-Za-z0-9 ,.-]+$/,message:"Alphanumeric only"} }} control={control} errors={errors}/>
//             <CertificateBtn/>
//           </>}


//           {/* ================= GRADUATION ================= */}
//           {(educationType==="Graduation"||educationType==="Post Graduation") && <>
//             <Title text="Graduation"/>
//             <Field name="grad_name" label="College Name*" rules={{ required:"Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="grad_percentage" label="Percentage*" rules={{ required:"Required", pattern:{value:/^[0-9]{1,3}$/,message:"Number only"} }} control={control} errors={errors}/>
//             <Field name="grad_course" label="Course*" rules={{ required:"Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="grad_address" label="Address*" rules={{ required:"Required", pattern:{value:/^[A-Za-z0-9 ,.-]+$/,message:"Alphanumeric only"} }} control={control} errors={errors}/>
//             <CertificateBtn/>
//           </>}


//           {/* ================= POST GRAD ================= */}
//           {educationType==="Post Graduation" && <>
//             <Title text="Post Graduation"/>
//             <Field name="pg_name" label="College Name*" rules={{ required:"Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="pg_percentage" label="Percentage*" rules={{ required:"Required", pattern:{value:/^[0-9]{1,3}$/,message:"Number only"} }} control={control} errors={errors}/>
//             <Field name="pg_course" label="Course*" rules={{ required:"Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="pg_address" label="Address*" rules={{ required:"Required", pattern:{value:/^[A-Za-z0-9 ,.-]+$/,message:"Alphanumeric only"} }} control={control} errors={errors}/>
//             <CertificateBtn/>
//           </>}


//         </ThemeScrollView>
//         </View>

//         <Button title="Next" btnStyles={styles.nextBtn} onPress={handleSubmit(onNext)}/>
//       </View>
//     </SafeView>
//   );
//   }

// /* ================= INPUT FIELD COMPONENT WITH VALIDATION =============== */
// const Field = ({name,label,rules,control,errors}:any)=>(
//   <>
//     <Text style={styles.label}>{label}</Text>
//     <Controller control={control} name={name} rules={rules}
//       render={({field:{value,onChange}})=>(
//         <Input 
//           handler={{control,onChangeText:onChange,value}}
//           name={name}
//           placeholder={label}
//           inputRoot={styles.input}
//           inputStyles={{height: 44, flex: 1}}
//           containerStyles={{width: '100%', flex: 0}}
//         />
//       )}
//     />
//     {/* {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>} */}
//   </>
// );


// /* ================= CERTIFICATE BUTTON ================== */
// const CertificateBtn = () => (
//   <TouchableOpacity style={styles.certBtn}>
//     <Text style={styles.certTxt}>＋ CERTIFICATE</Text>
//   </TouchableOpacity>
// );


// /* ================= TITLE ================== */
// const Title = ({text}:{text:string}) => (
//   <ScalableText style={styles.title}>{text}</ScalableText>
// );


// /* ================= STYLES ================== */
// const Heights = { cardHeight: Dimensions.get("window").height * 0.62 };

// const styles = StyleSheet.create({
//   wrapper:{flex:1,alignItems:"center",backgroundColor:"#F5F7FA"},
//   card:{width:"89%",backgroundColor:"#fff",borderRadius:15,elevation:6,padding:40,borderLeftWidth:6,borderLeftColor:"#004C93",marginTop:1},
  
//   heading:{fontSize:22,fontWeight:"bold",color:"#000"},
//   subtext:{fontSize:13,color:"#666",marginBottom:10},

//   input:{
//     height:48,
//     borderWidth:1,
//     borderColor:"#000",
//     borderRadius:10,
//     paddingLeft:10,
//     paddingRight:10,
//     marginBottom:10,
//     width:'120%'
//   },
  
 
//   label:{fontSize:13,fontWeight:"600",marginTop:10 ,color:"#000"},
//   error:{color:"red",fontSize:12,marginBottom:6},

//   title:{fontSize:16,fontWeight:"bold",marginTop:15,marginBottom:6},

//   certBtn:{width:"100%",height:44,backgroundColor:"#6d6fff",borderRadius:10,justifyContent:"center",alignItems:"center",marginBottom:15},
//   certTxt:{color:"#fff",fontWeight:"bold"},

//   nextBtn:{width:"80%",height:50,borderRadius:10,backgroundColor:"#004C93",marginTop:12}
// });



// import React from "react";
// import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import { useRoute } from "@react-navigation/native";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import Input from "../../../@ui/input/Input";
// import Button from "../../../@ui/button/Button";
// import { COLORS } from "../../../colors";
// import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
// import { useNavigation } from "@react-navigation/native";

// export default function EducationDetails() {

//   const route = useRoute();
//   const { educationType } = route.params as { educationType:string };

//   const { control, handleSubmit, formState:{errors} } = useForm({mode:"onSubmit"});
//   const navigation = useNavigation<THomeStackNavigator>();
//     const onNext = (data:any)=>{
//     console.log("📌 EDUCATION DETAILS ==> ",data);
    
//     // Previous screens ka data get karo
//     const employeeData = route.params?.employeeData;
//     const highestQualificationData = route.params?.highestQualificationData;
    
//     // Monthly Salary screen pe navigate karo
//     navigation.navigate("MonthlySalary", {
//       employeeData: employeeData,
//       highestQualificationData: highestQualificationData,
//       educationDetailsData: data
//     });
//   };
//   return (
//     <SafeView>
//       {/* <AppHeader title="Education Details" showDrawer={false}/> */}
//       <AppHeader title="Education Details" showDrawer={false} handleBackClick={()=>navigation.goBack()}/>
//       <View style={styles.wrapper}>

//         <View style={[styles.card,{height:Heights.cardHeight}]}>
//         <ThemeScrollView contentContainerStyle={{paddingBottom:60}}>

//           <ScalableText style={styles.heading}>Education Details</ScalableText>
//           {/* <ScalableText style={styles.subtext}>Selected: {educationType}</ScalableText> */}
//           <ScalableText style={styles.sub}>Step 3 of 5 • Enter Information</ScalableText>


//           {/* =================== BLOCK : HIGH SCHOOL =================== */}
//           {educationType && <>
//             <Title text="High School"/>
//             <Field name="hs_name" label="School Name*" rules={{ required:"This is Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="hs_percentage" label="Percentage*" rules={{ required:"This is Required", pattern:{value:/^[0-9]{1,3}$/,message:"Number only"} }} control={control} errors={errors}/>
//             <Field name="hs_board" label="Board*" rules={{ required:"This is Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="hs_address" label="School Address*" rules={{ required:"This is Required", pattern:{value:/^[A-Za-z0-9 ,.-]+$/,message:"Alphanumeric only"} }} control={control} errors={errors}/>
//             <CertificateBtn/>
//           </>}


//           {/* ================= HIGHER SECONDARY ================= */}
//           {(educationType==="Higher Secondary School"||educationType==="Graduation"||educationType==="Post Graduation") && <>
//             <Title text="Higher Secondary"/>
//             <Field name="hsc_name" label="School Name*" rules={{ required:"This is Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="hsc_percentage" label="Percentage*" rules={{ required:"This is Required", pattern:{value:/^[0-9]{1,3}$/,message:"Number only"} }} control={control} errors={errors}/>
//             <Field name="hsc_board" label="Board*" rules={{ required:"This is Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="hsc_address" label="Address*" rules={{ required:"This is Required", pattern:{value:/^[A-Za-z0-9 ,.-]+$/,message:"Alphanumeric only"} }} control={control} errors={errors}/>
//             <CertificateBtn/>
//           </>}


//           {/* ================= GRADUATION ================= */}
//           {(educationType==="Graduation"||educationType==="Post Graduation") && <>
//             <Title text="Graduation"/>
//             <Field name="grad_name" label="College Name*" rules={{ required:"This is Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="grad_percentage" label="Percentage*" rules={{ required:"This is Required", pattern:{value:/^[0-9]{1,3}$/,message:"Number only"} }} control={control} errors={errors}/>
//             <Field name="grad_course" label="Course*" rules={{ required:"This is Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="grad_address" label="Address*" rules={{ required:"This is Required", pattern:{value:/^[A-Za-z0-9 ,.-]+$/,message:"Alphanumeric only"} }} control={control} errors={errors}/>
//             <CertificateBtn/>
//           </>}


//           {/* ================= POST GRAD ================= */}
//           {educationType==="Post Graduation" && <>
//             <Title text="Post Graduation"/>
//             <Field name="pg_name" label="College Name*" rules={{ required:"This is Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="pg_percentage" label="Percentage*" rules={{ required:"This is Required", pattern:{value:/^[0-9]{1,3}$/,message:"Number only"} }} control={control} errors={errors}/>
//             <Field name="pg_course" label="Course*" rules={{ required:"This is Required", pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"} }} control={control} errors={errors}/>
//             <Field name="pg_address" label="Address*" rules={{ required:"This is Required", pattern:{value:/^[A-Za-z0-9 ,.-]+$/,message:"Alphanumeric only"} }} control={control} errors={errors}/>
//             <CertificateBtn/>
//           </>}


//         </ThemeScrollView>
//         </View>

//         <Button title="Next" btnStyles={styles.nextBtn} onPress={handleSubmit(onNext)}/>
//       </View>
//     </SafeView>
//   );
//   }

// /* ================= INPUT FIELD COMPONENT WITH VALIDATION =============== */
// const Field = ({name,label,rules,control,errors}:any)=>(
//   <>
//     <Text style={styles.label}>{label}</Text>
//     <Controller control={control} name={name} rules={rules}
//       render={({field:{value,onChange}})=>(
//         <Input 
//           handler={{control,onChangeText:onChange,value}}
//           name={name}
//           placeholder={label}
//           inputRoot={styles.input}
//           inputStyles={{height: 44, flex: 1}}
//           containerStyles={{width: '100%', flex: 0}}
//         />
//       )}
//     />
//     {/* {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>} */}
//   </>
// );


// /* ================= CERTIFICATE BUTTON ================== */
// const CertificateBtn = () => (
//   <TouchableOpacity style={styles.certBtn}>
//     <Text style={styles.certTxt}>＋ CERTIFICATE</Text>
//   </TouchableOpacity>
// );


// /* ================= TITLE ================== */
// const Title = ({text}:{text:string}) => (
//   <ScalableText style={styles.title}>{text}</ScalableText>
// );


// /* ================= STYLES ================== */
// const Heights = { cardHeight: Dimensions.get("window").height * 0.62 };

// const styles = StyleSheet.create({
//   wrapper:{flex:1,alignItems:"center",backgroundColor:"#F5F7FA"},
//   card:{width:"89%",backgroundColor:"#fff",borderRadius:15,elevation:6,padding:40,borderLeftWidth:6,borderLeftColor:"#004C93",marginTop:1},
  
//   heading:{fontSize:22,fontWeight:"bold",color:"#000"},
//   subtext:{fontSize:13,color:"#666",marginBottom:10},

//   input:{
//     height:48,
//     borderWidth:1,
//     borderColor:"#000",
//     borderRadius:10,
//     paddingLeft:10,
//     paddingRight:10,
//     marginBottom:10,
//     width:'120%'
//   },
  
 
//   label:{fontSize:13,fontWeight:"600",marginTop:10, marginBottom:5 ,color:"#000"},
//   error:{color:"red",fontSize:12,marginBottom:6},

//   title:{fontSize:16,fontWeight:"bold",marginTop:15,marginBottom:6},

//   certBtn:{width:"120%",height:44,backgroundColor:"#6d6fff",borderRadius:10,justifyContent:"center",alignItems:"center",marginBottom:15},
//   certTxt:{color:"#fff",fontWeight:"bold"},

//   nextBtn:{width:"80%",height:50,borderRadius:10,backgroundColor:"#004C93",marginTop:12}
// });



// import React, { useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Dimensions,
//   TouchableOpacity,
//   Text,
//   Image,
//   Alert,
// } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { launchImageLibrary } from "react-native-image-picker";

// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import Input from "../../../@ui/input/Input";
// import Button from "../../../@ui/button/Button";
// import { COLORS } from "../../../colors";
// import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";

// export default function EducationDetails() {

//   const route = useRoute();
//   const navigation = useNavigation<THomeStackNavigator>();

//   const { educationType, employeeData, highestQualificationData } =
//     route.params as any;

//   const { control, handleSubmit, formState: { errors } } = useForm({ mode: "onSubmit" });

//   /* =========================== CERTIFICATE IMAGE STATE =========================== */
//   const [certificateUri, setCertificateUri] = useState("");

//   const handleSelectCertificate = () => {
//     launchImageLibrary(
//       {
//         mediaType: "photo",
//         quality: 0.7,
//         maxWidth: 1024,
//         maxHeight: 1024,
//       },
//       (response) => {
//         if (response.assets && response.assets.length > 0) {
//           const asset = response.assets[0];

//           if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
//             Alert.alert("Error", "File size exceeds 5MB limit");
//             return;
//           }
//           setCertificateUri(asset.uri || "");
//         }
//       }
//     );
//   };

//   const handleClearCertificate = () => setCertificateUri("");

//   /* =========================== ON SUBMIT =========================== */
//   const onNext = (data: any) => {
//     navigation.navigate("MonthlySalary", {
//       employeeData,
//       highestQualificationData,
//       educationDetailsData: data,
//       certificateUri,   // <-- CERTIFICATE IMAGE SEND
//     });
//   };

//   return (
//     <SafeView>
//       <AppHeader title="Education Details" showDrawer={false} handleBackClick={() => navigation.goBack()} />

//       <View style={styles.wrapper}>
//         <View style={[styles.card, { height: Heights.cardHeight }]}>
//           <ThemeScrollView contentContainerStyle={{ paddingBottom: 60 }}>

//             <ScalableText style={styles.heading}>Education Details</ScalableText>
//             <ScalableText style={styles.sub}>Step 3 of 5 • Enter Information</ScalableText>

//             {/* ---------------- HIGH SCHOOL ---------------- */}
//             {educationType && (
//               <>
//                 <Title text="High School" />
//                 <Field name="hs_name" label="School Name*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <Field name="hs_percentage" label="Percentage*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <Field name="hs_board" label="Board*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <Field name="hs_address" label="Address*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <CertificateBtn
//                   certificateUri={certificateUri}
//                   onSelect={handleSelectCertificate}
//                   onRemove={handleClearCertificate}
//                 />
//               </>
//             )}

//             {/* ---------------- HIGHER SECONDARY ---------------- */}
//             {(educationType === "Higher Secondary School" || educationType === "Graduation" || educationType === "Post Graduation") && (
//               <>
//                 <Title text="Higher Secondary" />
//                 <Field name="hsc_name" label="School Name*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <Field name="hsc_percentage" label="Percentage*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <Field name="hsc_board" label="Board*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <Field name="hsc_address" label="Address*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <CertificateBtn
//                   certificateUri={certificateUri}
//                   onSelect={handleSelectCertificate}
//                   onRemove={handleClearCertificate}
//                 />
//               </>
//             )}

//             {/* ---------------- GRADUATION ---------------- */}
//             {(educationType === "Graduation" || educationType === "Post Graduation") && (
//               <>
//                 <Title text="Graduation" />
//                 <Field name="grad_name" label="College Name*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <Field name="grad_percentage" label="Percentage*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <Field name="grad_course" label="Course*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <Field name="grad_address" label="Address*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <CertificateBtn
//                   certificateUri={certificateUri}
//                   onSelect={handleSelectCertificate}
//                   onRemove={handleClearCertificate}
//                 />
//               </>
//             )}

//             {/* ---------------- POST GRADUATION ---------------- */}
//             {educationType === "Post Graduation" && (
//               <>
//                 <Title text="Post Graduation" />
//                 <Field name="pg_name" label="College Name*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <Field name="pg_percentage" label="Percentage*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <Field name="pg_course" label="Course*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <Field name="pg_address" label="Address*" rules={{ required: "This is Required" }} control={control} errors={errors} />
//                 <CertificateBtn
//                   certificateUri={certificateUri}
//                   onSelect={handleSelectCertificate}
//                   onRemove={handleClearCertificate}
//                 />
//               </>
//             )}

//           </ThemeScrollView>
//         </View>

//         <Button title="Next" btnStyles={styles.nextBtn} onPress={handleSubmit(onNext)} />
//       </View>
//     </SafeView>
//   );
// }

// /* ================= FIELD ================= */
// const Field = ({ name, label, rules, control, errors }: any) => (
//   <>
//     <Text style={styles.label}>{label}</Text>
//     <Controller
//       control={control}
//       name={name}
//       rules={rules}
//       render={({ field: { value, onChange } }) => (
//         <Input
//           handler={{ control, value, onChangeText: onChange }}
//           name={name}
//           placeholder={label}
//           inputRoot={styles.input}
//           inputStyles={{ height: 44, flex: 1 }}
//           containerStyles={{ width: "100%", flex: 0 }}
//         />
//       )}
//     />
//     {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
//   </>
// );

// /* ================= CERTIFICATE BUTTON ================= */
// const CertificateBtn = ({ certificateUri, onSelect, onRemove }: any) => (
//   <View style={{ marginTop: 10, marginBottom: 15 }}>
//     <TouchableOpacity style={styles.certBtn} onPress={onSelect}>
//       <Text style={styles.certTxt}>
//         {certificateUri ? "Change Certificate" : "＋ CERTIFICATE"}
//       </Text>
//     </TouchableOpacity>

//     {certificateUri ? (
//       <>
//         <Image source={{ uri: certificateUri }} style={styles.certificatePreview} />
//         <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
//           <Text style={styles.removeTxt}>Remove</Text>
//         </TouchableOpacity>
//       </>
//     ) : null}
//   </View>
// );

// /* ================= TITLE ================= */
// const Title = ({ text }: { text: string }) => (
//   <ScalableText style={styles.title}>{text}</ScalableText>
// );

// /* ================= STYLES ================= */
// const Heights = { cardHeight: Dimensions.get("window").height * 0.62 };

// const styles = StyleSheet.create({
//   wrapper: { flex: 1, alignItems: "center", backgroundColor: "#F5F7FA" },

//   card: {
//     width: "89%",
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     padding: 40,
//     borderLeftWidth: 6,
//     borderLeftColor: "#004C93",
//     marginTop: 1,
//   },

//   heading: { fontSize: 22, fontWeight: "bold", color: "#000" },
//   sub: { fontSize: 13, color: "#666", marginBottom: 10 },

//   title: { fontSize: 16, fontWeight: "bold", marginTop: 15, marginBottom: 6 },

//   label: { fontSize: 13, fontWeight: "600", marginTop: 10, marginBottom: 5 },
//   error: { color: "red", fontSize: 12, marginBottom: 6 },

//   input: {
//     height: 48,
//     borderWidth: 1,
//     borderColor: "#000",
//     borderRadius: 10,
//     paddingLeft: 10,
//     paddingRight: 10,
//     marginBottom: 10,
//     width: "120%",
//   },

//   certBtn: {
//     width: "120%",
//     height: 44,
//     backgroundColor: "#6d6fff",
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   certTxt: { color: "#fff", fontWeight: "bold" },

//   certificatePreview: {
//     width: "120%",
//     height: 180,
//     borderRadius: 10,
//     marginTop: 10,
//     marginBottom: 10,
//   },

//   removeBtn: {
//     backgroundColor: "#FF3B30",
//     padding: 10,
//     borderRadius: 8,
//     width: "120%",
//     alignItems: "center",
//   },
//   removeTxt: { color: "#fff", fontWeight: "600" },

//   nextBtn: { width: "80%", height: 50, borderRadius: 10, backgroundColor: "#004C93", marginTop: 12 },
// });


// import React, { useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Dimensions,
//   TouchableOpacity,
//   Text,
//   Image,
//   Alert,
// } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { launchImageLibrary } from "react-native-image-picker";

// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import Input from "../../../@ui/input/Input";
// import Button from "../../../@ui/button/Button";
// import { COLORS } from "../../../colors";
// import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";

// export default function EducationDetails() {
//   const route = useRoute();
//   const navigation = useNavigation<THomeStackNavigator>();

//   const { educationType, employeeData, highestQualificationData } =
//     route.params as any;

//   const { control, handleSubmit, formState: { errors } } = useForm({ mode: "onSubmit" });

//   /* ====== 4 CERTIFICATES STATES ====== */
//   const [hsCertificate, setHsCertificate] = useState("");
//   const [hscCertificate, setHscCertificate] = useState("");
//   const [gradCertificate, setGradCertificate] = useState("");
//   const [pgCertificate, setPgCertificate] = useState("");

//   const pickImage = (setter: any) => {
//     launchImageLibrary(
//       {
//         mediaType: "photo",
//         quality: 0.7,
//         maxWidth: 1500,
//         maxHeight: 1500,
//       },
//       (res) => {
//         if (res.assets && res.assets.length > 0) {
//           const a = res.assets[0];

//           if (a.fileSize && a.fileSize > 5 * 1024 * 1024) {
//             Alert.alert("Error", "File size exceeds 5MB");
//             return;
//           }

//           setter(a.uri || "");
//         }
//       }
//     );
//   };

//   const onNext = (formData: any) => {
//     navigation.navigate("MonthlySalary", {
//       employeeData,
//       highestQualificationData,

//       educationDetailsData: {
//         ...formData,
//         hs_certificate: hsCertificate,
//         hsc_certificate: hscCertificate,
//         grad_certificate: gradCertificate,
//         pg_certificate: pgCertificate,
//       },
//     });
//   };

//   return (
//     <SafeView>
//       <AppHeader
//         title="Education Details"
//         showDrawer={false}
//         handleBackClick={() => navigation.goBack()}
//       />

//       <View style={styles.wrapper}>

//         {/* FIXED HEIGHT CARD */}
//         <View style={styles.card}>

//           <ThemeScrollView contentContainerStyle={{ paddingBottom: 50 }}>

//             <ScalableText style={styles.heading}>Education Details</ScalableText>
//             <ScalableText style={styles.sub}>Step 3 of 5 • Enter Information</ScalableText>

//             {/* ------------ HIGH SCHOOL ------------- */}
//             <Title text="High School" />

//             <Field name="hs_name" label="School Name*" rules={{ required: "Required" }} control={control} errors={errors} />
//             <Field name="hs_percentage" label="Percentage*" rules={{ required: "Required" }} control={control} errors={errors} />
//             <Field name="hs_board" label="Board*" rules={{ required: "Required" }} control={control} errors={errors} />
//             <Field name="hs_address" label="Address*" rules={{ required: "Required" }} control={control} errors={errors} />

//             <CertificateUpload uri={hsCertificate} setUri={setHsCertificate} pick={pickImage} />

//             {/* ------------ HIGHER SECONDARY ------------- */}
//             {(educationType === "Higher Secondary School" ||
//               educationType === "Graduation" ||
//               educationType === "Post Graduation") && (
//               <>
//                 <Title text="Higher Secondary" />

//                 <Field name="hsc_name" label="School Name*" rules={{ required: "Required" }} control={control} errors={errors} />
//                 <Field name="hsc_percentage" label="Percentage*" rules={{ required: "Required" }} control={control} errors={errors} />
//                 <Field name="hsc_board" label="Board*" rules={{ required: "Required" }} control={control} errors={errors} />
//                 <Field name="hsc_address" label="Address*" rules={{ required: "Required" }} control={control} errors={errors} />

//                 <CertificateUpload uri={hscCertificate} setUri={setHscCertificate} pick={pickImage} />
//               </>
//             )}

//             {/* ------------ GRADUATION ------------- */}
//             {(educationType === "Graduation" || educationType === "Post Graduation") && (
//               <>
//                 <Title text="Graduation" />

//                 <Field name="grad_name" label="College Name*" rules={{ required: "Required" }} control={control} errors={errors} />
//                 <Field name="grad_percentage" label="Percentage*" rules={{ required: "Required" }} control={control} errors={errors} />
//                 <Field name="grad_course" label="Course*" rules={{ required: "Required" }} control={control} errors={errors} />
//                 <Field name="grad_address" label="Address*" rules={{ required: "Required" }} control={control} errors={errors} />

//                 <CertificateUpload uri={gradCertificate} setUri={setGradCertificate} pick={pickImage} />
//               </>
//             )}

//             {/* ------------ POST GRADUATION ------------- */}
//             {educationType === "Post Graduation" && (
//               <>
//                 <Title text="Post Graduation" />

//                 <Field name="pg_name" label="College Name*" rules={{ required: "Required" }} control={control} errors={errors} />
//                 <Field name="pg_percentage" label="Percentage*" rules={{ required: "Required" }} control={control} errors={errors} />
//                 <Field name="pg_course" label="Course*" rules={{ required: "Required" }} control={control} errors={errors} />
//                 <Field name="pg_address" label="Address*" rules={{ required: "Required" }} control={control} errors={errors} />

//                 <CertificateUpload uri={pgCertificate} setUri={setPgCertificate} pick={pickImage} />
//               </>
//             )}

//           </ThemeScrollView>

//         </View>

//         {/* NEXT BUTTON FIXED BOTTOM */}
//         <Button
//           title="Next"
//           btnStyles={styles.nextBtn}
//           onPress={handleSubmit(onNext)}
//         />

//       </View>
//     </SafeView>
//   );
// }

// /* ======================================================
//       FIELD
// ====================================================== */
// const Field = ({ name, label, rules, control, errors }: any) => (
//   <>
//     <Text style={styles.label}>{label}</Text>
//     <Controller
//       control={control}
//       name={name}
//       rules={rules}
//       render={({ field: { value, onChange } }) => (
//         <Input
//           handler={{ control, value, onChangeText: onChange }}
//           name={name}
//           placeholder={label}
//           inputRoot={styles.input}
//           inputStyles={{ height: 44 }}
//         />
//       )}
//     />
//     {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
//   </>
// );

// /* ======================================================
//       CERTIFICATE UPLOAD BLOCK
// ====================================================== */
// const CertificateUpload = ({ uri, setUri, pick }: any) => (
//   <View style={{ marginBottom: 15 }}>
//     <TouchableOpacity style={styles.certBtn} onPress={() => pick(setUri)}>
//       <Text style={styles.certTxt}>{uri ? "Change Certificate" : "＋ Upload Certificate"}</Text>
//     </TouchableOpacity>

//     {uri ? (
//       <>
//         <Image source={{ uri }} style={styles.preview} />
//         <TouchableOpacity style={styles.removeBtn} onPress={() => setUri("")}>
//           <Text style={styles.removeTxt}>Remove</Text>
//         </TouchableOpacity>
//       </>
//     ) : null}
//   </View>
// );

// const Title = ({ text }: any) => <ScalableText style={styles.title}>{text}</ScalableText>;

// /* ======================================================
//       STYLES
// ====================================================== */

// const CARD_HEIGHT = Dimensions.get("screen").height * 0.58;

// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1,
//     alignItems: "center",
//     backgroundColor: "#F5F7FA",
//     paddingTop: 5,
//   },

//   card: {
//     width: "89%",
//     height: CARD_HEIGHT,   // ⭐ FIXED HEIGHT
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     padding: 35,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//   },

//   heading: { fontSize: 22, fontWeight: "bold", color: "#000" },
//   sub: { fontSize: 13, color: "#666", marginBottom: 14 },

//   title: { fontSize: 16, fontWeight: "bold", marginTop: 15, marginBottom: 6 },

//   label: { marginTop: 10, marginBottom: 5, fontSize: 13, fontWeight: "600" },
//   error: { color: "red", fontSize: 12, marginBottom: 5 },

//   input: {
//     borderWidth: 1,
//     borderColor: "#000",
//     borderRadius: 10,
//     height: 44,
//     paddingHorizontal: 10,
//   },

//   certBtn: {
//     backgroundColor: "#4B6BFF",
//     padding: 12,
//     borderRadius: 10,
//     marginTop: 10,
//     alignItems: "center",
//     width: "120%",
//   },
//   certTxt: { color: "#fff", fontWeight: "bold" },

//   preview: {
//     width: "120%",
//     height: 150,
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   removeBtn: {
//     width: "120%",
//     backgroundColor: "red",
//     padding: 8,
//     borderRadius: 8,
//     marginTop: 8,
//     alignItems: "center",
//   },
//   removeTxt: { color: "#fff", fontWeight: "bold" },

//   nextBtn: {
//     width: "80%",
//     height: 50,
//     backgroundColor: COLORS.primary,
//     borderRadius: 10,
//     marginTop: 14,
//   },
// });


import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRoute, useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";

import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import Input from "../../../@ui/input/Input";
import Button from "../../../@ui/button/Button";
import { COLORS } from "../../../colors";
import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";

export default function EducationDetails() {
  const route = useRoute();
  const navigation = useNavigation<THomeStackNavigator>();

  const { educationType, employeeData, highestQualificationData } =
    route.params as any;

  const { control, handleSubmit, formState: { errors } } = useForm({ mode: "onSubmit" });

  /* ====== 4 CERTIFICATES STATES ====== */
  const [hsCertificate, setHsCertificate] = useState("");
  const [hscCertificate, setHscCertificate] = useState("");
  const [gradCertificate, setGradCertificate] = useState("");
  const [pgCertificate, setPgCertificate] = useState("");

  const pickImage = (setter: any) => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,   // ⭐ BASE64 ENABLED
        quality: 0.7,
        maxWidth: 1500,
        maxHeight: 1500,
      },
      (res) => {
        if (res.assets && res.assets.length > 0) {
          const a = res.assets[0];
  
          if (a.fileSize && a.fileSize > 5 * 1024 * 1024) {
            Alert.alert("Error", "File size exceeds 5MB");
            return;
          }
  
          // ⭐ STORE BASE64 IN STATE
          const base64Image = `data:${a.type};base64,${a.base64}`;
          setter(base64Image);
        }
      }
    );
  };
  
  const onNext = (formData: any) => {
    navigation.navigate("MonthlySalary", {
      employeeData,
      highestQualificationData,

      educationDetailsData: {
        ...formData,
        hs_certificate: hsCertificate,
        hsc_certificate: hscCertificate,
        grad_certificate: gradCertificate,
        pg_certificate: pgCertificate,
      },
    });
  };

  return (
    <SafeView>
      <AppHeader
        title="Education Details"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />

      <View style={styles.wrapper}>

        {/* FIXED HEIGHT CARD */}
        <View style={styles.card}>

          <ThemeScrollView contentContainerStyle={{ paddingBottom: 50 }}>

            <ScalableText style={styles.heading}>Education Details</ScalableText>
            <ScalableText style={styles.sub}>Step 3 of 5 • Enter Information</ScalableText>

            {/* ------------ HIGH SCHOOL ------------- */}
            <Title text="High School" />

            <Field name="hs_name" label="School Name*" rules={{ required: "Required" }} control={control} errors={errors} />
            <Field name="hs_percentage" label="Percentage*" rules={{ required: "Required" }} control={control} errors={errors} />
            <Field name="hs_board" label="Board*" rules={{ required: "Required" }} control={control} errors={errors} />
            <Field name="hs_address" label="Address*" rules={{ required: "Required" }} control={control} errors={errors} />

            <CertificateUpload uri={hsCertificate} setUri={setHsCertificate} pick={pickImage} />

            {/* ------------ HIGHER SECONDARY ------------- */}
            {(educationType === "Higher Secondary School" ||
              educationType === "Graduation" ||
              educationType === "Post Graduation") && (
              <>
                <Title text="Higher Secondary" />

                <Field name="hsc_name" label="School Name*" rules={{ required: "Required" }} control={control} errors={errors} />
                <Field name="hsc_percentage" label="Percentage*" rules={{ required: "Required" }} control={control} errors={errors} />
                <Field name="hsc_board" label="Board*" rules={{ required: "Required" }} control={control} errors={errors} />
                <Field name="hsc_address" label="Address*" rules={{ required: "Required" }} control={control} errors={errors} />

                <CertificateUpload uri={hscCertificate} setUri={setHscCertificate} pick={pickImage} />
              </>
            )}

            {/* ------------ GRADUATION ------------- */}
            {(educationType === "Graduation" || educationType === "Post Graduation") && (
              <>
                <Title text="Graduation" />

                <Field name="grad_name" label="College Name*" rules={{ required: "Required" }} control={control} errors={errors} />
                <Field name="grad_percentage" label="Percentage*" rules={{ required: "Required" }} control={control} errors={errors} />
                <Field name="grad_course" label="Course*" rules={{ required: "Required" }} control={control} errors={errors} />
                <Field name="grad_address" label="Address*" rules={{ required: "Required" }} control={control} errors={errors} />

                <CertificateUpload uri={gradCertificate} setUri={setGradCertificate} pick={pickImage} />
              </>
            )}

            {/* ------------ POST GRADUATION ------------- */}
            {educationType === "Post Graduation" && (
              <>
                <Title text="Post Graduation" />

                <Field name="pg_name" label="College Name*" rules={{ required: "Required" }} control={control} errors={errors} />
                <Field name="pg_percentage" label="Percentage*" rules={{ required: "Required" }} control={control} errors={errors} />
                <Field name="pg_course" label="Course*" rules={{ required: "Required" }} control={control} errors={errors} />
                <Field name="pg_address" label="Address*" rules={{ required: "Required" }} control={control} errors={errors} />

                <CertificateUpload uri={pgCertificate} setUri={setPgCertificate} pick={pickImage} />
              </>
            )}

          </ThemeScrollView>

        </View>

        {/* NEXT BUTTON FIXED BOTTOM */}
        <Button
          title="Next"
          btnStyles={styles.nextBtn}
          onPress={handleSubmit(onNext)}
        />

      </View>
    </SafeView>
  );
}

/* ======================================================
      FIELD
====================================================== */
const Field = ({ name, label, rules, control, errors }: any) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={label}
          style={[
            styles.input,
            (error || errors?.[name]) && styles.inputError
          ]}
        />
      )}
    />
    {(errors?.[name] || control._formState?.errors?.[name]) && (
      <Text style={styles.error}>
        {errors?.[name]?.message || control._formState?.errors?.[name]?.message || "Required"}
      </Text>
    )}
  </View>
);

/* ======================================================
      CERTIFICATE UPLOAD BLOCK
====================================================== */
const CertificateUpload = ({ uri, setUri, pick }: any) => (
  <View style={{ marginBottom: 15 }}>
    <TouchableOpacity style={styles.certBtn} onPress={() => pick(setUri)}>
      <Text style={styles.certTxt}>{uri ? "Change Certificate" : "＋ Upload Certificate"}</Text>
    </TouchableOpacity>

    {uri ? (
      <>
        <Image source={{ uri }} style={styles.preview} />
        <TouchableOpacity style={styles.removeBtn} onPress={() => setUri("")}>
          <Text style={styles.removeTxt}>Remove</Text>
        </TouchableOpacity>
      </>
    ) : null}
  </View>
);

const Title = ({ text }: any) => <ScalableText style={styles.title}>{text}</ScalableText>;

/* ======================================================
      STYLES
====================================================== */

const CARD_HEIGHT = Dimensions.get("screen").height * 0.58;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    paddingTop: 5,
  },

  card: {
    width: "89%",
    height: CARD_HEIGHT,   // ⭐ FIXED HEIGHT
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 6,
    padding: 35,
    borderLeftWidth: 6,
    borderLeftColor: COLORS.primary,
  },

  heading: { fontSize: 22, fontWeight: "bold", color: "#000" , textAlign: "left"},
  sub: { fontSize: 13, color: "#666", marginBottom: 14, textAlign: "left" },

  title: { fontSize: 16, fontWeight: "bold", marginTop: 15, marginBottom: 6 },

  label: { marginTop: 10, marginBottom: 5, fontSize: 13, fontWeight: "600" ,color: "#000"},
  error: { color: "red", fontSize: 12, marginBottom: 5 },

  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 10,
    width:"115%",
      
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },

  certBtn: {
    backgroundColor: "#4B6BFF",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    width: "115%",
  },
  certTxt: { color: "#fff", fontWeight: "bold" },

  preview: {
    width: "120%",
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  removeBtn: {
    width: "120%",
    backgroundColor: "red",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  removeTxt: { color: "#fff", fontWeight: "bold" },

  nextBtn: {
    width: "80%",
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginTop: 14,
  },
});

