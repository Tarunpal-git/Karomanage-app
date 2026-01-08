// import React from "react";
// import { StyleSheet } from "react-native";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import { COLORS } from "../../../colors";
// import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
// import { IMAGES } from "../../../images";

// const CreateOrganization = ({ navigation }: any) => {
//   return (
//     <SafeView>
//       <AppHeader
//         title="Create Organization"
//         showDrawer={false}
//         handleBackClick={() => navigation.goBack()}
//       />

//       <ThemeScrollView paddingHorizontal={16}>
//         <ScalableText
//           fontFamily="SemiBold"
//           style={styles.title}
//         >
//           Create New Organization
//         </ScalableText>

//         {/* 👉 Yaha form aayega (inputs, submit button) */}
//       </ThemeScrollView>
//     </SafeView>
//   );
// };

// export default CreateOrganization;

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 18,
//     marginBottom: 20,
//     color: COLORS.primary,
//   },
// });



// import React from "react";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import Flex from "../../../@ui/flex/Flex";
// import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
// import { IMAGES } from "../../../images";

// const CreateOrganization = ({ navigation }: any) => {
//   return (
//     <SafeView>
//       <AppHeader
//         title="Create Organization"
//         showDrawer={false}
//         handleBackClick={() => navigation.goBack()}
//       />
//        <Flex justify="center">
//           <AutoHeightImage source={IMAGES.approveImage} width={150} />
//         </Flex>
//     </SafeView>

//   );
// };

// export default CreateOrganization;

// import React from "react";
// import { StyleSheet, View, Text } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import Flex from "../../../@ui/flex/Flex";
// import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
// import Input from "../../../@ui/input/Input";
// import { IMAGES } from "../../../images";
// import { COLORS } from "../../../colors";

// type TCreateOrgForm = {
//   organizationName: string;
//   website: string;
//   logo: string;
//   email: string;
//   phone: string;
//   address: string;
//   state: string;
//   country: string;
//   pincode: string;
//   about: string;
// };

// const Label = ({ text }: { text: string }) => (
//   <Text style={styles.label}>{text}</Text>
// );

// const CreateOrganization = ({ navigation }: any) => {
//   const { control } = useForm<TCreateOrgForm>();

//   return (
//     <SafeView>
//       <AppHeader
//         title="Create Organization"
//         showDrawer={false}
//         handleBackClick={() => navigation.goBack()}
//       />

//       <Flex justify="center" mt={20}>
//         <AutoHeightImage source={IMAGES.approveImage} width={150} />
//       </Flex>

//       <View style={styles.form}>

//         {/* Organization Name */}
//         <Label text="Organization Name*" />
//         <Controller
//           control={control}
//           name="organizationName"
//           rules={{ required: "Required" }}
//           render={({ field }) => (
//             <Input
//               name="organizationName"
//               handler={{ control }}
//               placeholder="Enter organization name"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         {/* Website */}
//         <Label text="Organization Website URL" />
//         <Controller
//           control={control}
//           name="website"
//           render={({ field }) => (
//             <Input
//               name="website"
//               handler={{ control }}
//               placeholder="https://example.com"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         {/* Logo */}
//         <Label text="Organization Logo URL" />
//         <Controller
//           control={control}
//           name="logo"
//           render={({ field }) => (
//             <Input
//               name="logo"
//               handler={{ control }}
//               placeholder="Paste logo URL"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         {/* Email */}
//         <Label text="Organization Email*" />
//         <Controller
//           control={control}
//           name="email"
//           rules={{ required: "Required" }}
//           render={({ field }) => (
//             <Input
//               name="email"
//               handler={{ control }}
//               placeholder="example@company.com"
//               keyboardType="email-address"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         {/* Phone */}
//         <Label text="Organization Phone Number*" />
//         <Controller
//           control={control}
//           name="phone"
//           rules={{ required: "Required" }}
//           render={({ field }) => (
//             <Input
//               name="phone"
//               handler={{ control }}
//               placeholder="Enter phone number"
//               keyboardType="phone-pad"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         {/* Address */}
//         <Label text="Organization Address" />
//         <Controller
//           control={control}
//           name="address"
//           render={({ field }) => (
//             <Input
//               name="address"
//               handler={{ control }}
//               placeholder="Enter address"
//               multiline
//               numberOfLines={3}
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         {/* State */}
//         <Label text="State" />
//         <Controller
//           control={control}
//           name="state"
//           render={({ field }) => (
//             <Input
//               name="state"
//               handler={{ control }}
//               placeholder="Enter state"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         {/* Country */}
//         <Label text="Country" />
//         <Controller
//           control={control}
//           name="country"
//           render={({ field }) => (
//             <Input
//               name="country"
//               handler={{ control }}
//               placeholder="Enter country"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         {/* Pincode */}
//         <Label text="Pincode" />
//         <Controller
//           control={control}
//           name="pincode"
//           render={({ field }) => (
//             <Input
//               name="pincode"
//               handler={{ control }}
//               placeholder="Enter pincode"
//               keyboardType="numeric"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         {/* About */}
//         <Label text="About Organization" />
//         <Controller
//           control={control}
//           name="about"
//           render={({ field }) => (
//             <Input
//               name="about"
//               handler={{ control }}
//               placeholder="Write something about organization"
//               multiline
//               numberOfLines={4}
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//       </View>
//     </SafeView>
//   );
// };

// export default CreateOrganization;

// const styles = StyleSheet.create({
//   form: {
//     paddingHorizontal: 16,
//     paddingTop: 20,
//     paddingBottom: 40,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginBottom: 6,
//     marginTop: 10,
//     color: "#000",
//   },
//   input: {
//     marginBottom:50,
//   },
// });

// import React from "react";
// import { StyleSheet, Text } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import Flex from "../../../@ui/flex/Flex";
// import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import Input from "../../../@ui/input/Input";
// import { IMAGES } from "../../../images";
// import { COLORS } from "../../../colors";

// type TCreateOrgForm = {
//   organizationName: string;
//   website: string;
//   logo: string;
//   email: string;
//   phone: string;
//   address: string;
//   state: string;
//   country: string;
//   pincode: string;
//   about: string;
// };

// const Label = ({ text }: { text: string }) => (
//   <Text style={styles.label}>{text}</Text>
// );

// const CreateOrganization = ({ navigation }: any) => {
//   const { control } = useForm<TCreateOrgForm>();

//   return (
//     <SafeView>
//       <AppHeader
//         title="Create Organization"
//         showDrawer={false}
//         handleBackClick={() => navigation.goBack()}
//       />

//       {/* Top Image */}
//       <Flex justify="center" mt={20}>
//         <AutoHeightImage source={IMAGES.approveImage} width={150} />
//       </Flex>

//       {/* 🔽 SCROLL STARTS HERE */}
//       <ThemeScrollView contentContainerStyle={styles.scrollContent}>
        
//         <Label text="Organization Name*" />
//         <Controller
//           control={control}
//           name="organizationName"
//           rules={{ required: "Required" }}
//           render={({ field }) => (
//             <Input
//               name="organizationName"
//               handler={{ control }}
//               placeholder="Enter organization name"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Website URL" />
//         <Controller
//           control={control}
//           name="website"
//           render={({ field }) => (
//             <Input
//               name="website"
//               handler={{ control }}
//               placeholder="https://example.com"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Logo URL" />
//         <Controller
//           control={control}
//           name="logo"
//           render={({ field }) => (
//             <Input
//               name="logo"
//               handler={{ control }}
//               placeholder="Paste logo URL"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Email*" />
//         <Controller
//           control={control}
//           name="email"
//           rules={{ required: "Required" }}
//           render={({ field }) => (
//             <Input
//               name="email"
//               handler={{ control }}
//               placeholder="example@company.com"
//               keyboardType="email-address"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Phone Number*" />
//         <Controller
//           control={control}
//           name="phone"
//           rules={{ required: "Required" }}
//           render={({ field }) => (
//             <Input
//               name="phone"
//               handler={{ control }}
//               placeholder="Enter phone number"
//               keyboardType="phone-pad"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Address" />
//         <Controller
//           control={control}
//           name="address"
//           render={({ field }) => (
//             <Input
//               name="address"
//               handler={{ control }}
//               placeholder="Enter address"
//               multiline
//               numberOfLines={3}
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="State" />
//         <Controller
//           control={control}
//           name="state"
//           render={({ field }) => (
//             <Input
//               name="state"
//               handler={{ control }}
//               placeholder="Enter state"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Country" />
//         <Controller
//           control={control}
//           name="country"
//           render={({ field }) => (
//             <Input
//               name="country"
//               handler={{ control }}
//               placeholder="Enter country"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Pincode" />
//         <Controller
//           control={control}
//           name="pincode"
//           render={({ field }) => (
//             <Input
//               name="pincode"
//               handler={{ control }}
//               placeholder="Enter pincode"
//               keyboardType="numeric"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="About Organization" />
//         <Controller
//           control={control}
//           name="about"
//           render={({ field }) => (
//             <Input
//               name="about"
//               handler={{ control }}
//               placeholder="Write something about organization"
//               multiline
//               numberOfLines={4}
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//       </ThemeScrollView>
//       {/* 🔼 SCROLL ENDS HERE */}

//     </SafeView>
//   );
// };

// export default CreateOrganization;

// const styles = StyleSheet.create({
//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 40,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginBottom: 6,
//     marginTop: 10,
//     color: "#000",
//   },
//   input: {
//     marginBottom: 8,
//   },
// });

// import React from "react";
// import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import Flex from "../../../@ui/flex/Flex";
// import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import Input from "../../../@ui/input/Input";
// import Button from "../../../@ui/button/Button";
// import { IMAGES } from "../../../images";
// import { COLORS } from "../../../colors";

// type TCreateOrgForm = {
//   organizationName: string;
//   website: string;
//   logo: string;
//   email: string;
//   phone: string;
//   address: string;
//   state: string;
//   country: string;
//   pincode: string;
//   about: string;
//   enableGst: "YES" | "NO";
//   acceptTerms: boolean;
// };

// const Label = ({ text }: { text: string }) => (
//   <Text style={styles.label}>{text}</Text>
// );

// const CreateOrganization = ({ navigation }: any) => {
//   const { control, handleSubmit } = useForm<TCreateOrgForm>({
//     defaultValues: {
//       enableGst: "NO",
//       acceptTerms: false,
//     },
//   });

//   const onSubmit = (data: TCreateOrgForm) => {
//     console.log("CREATE ORGANIZATION PAYLOAD 👉", data);
//     // 🔜 yaha API call lagegi
//   };

//   return (
//     <SafeView>
//       <AppHeader
//         title="Create Organization"
//         showDrawer={false}
//         handleBackClick={() => navigation.goBack()}
//       />

//       {/* Top Image */}
//       <Flex justify="center" mt={20}>
//         <AutoHeightImage source={IMAGES.approveImage} width={150} />
//       </Flex>

//       {/* SCROLLABLE FORM */}
//       <ThemeScrollView contentContainerStyle={styles.scrollContent}>

//         <Label text="Organization Name*" />
//         <Controller
//           control={control}
//           name="organizationName"
//           rules={{ required: "Required" }}
//           render={({ field }) => (
//             <Input
//               name="organizationName"
//               handler={{ control }}
//               placeholder="Enter organization name"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Website URL" />
//         <Controller
//           control={control}
//           name="website"
//           render={({ field }) => (
//             <Input
//               name="website"
//               handler={{ control }}
//               placeholder="https://example.com"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Logo URL" />
//         <Controller
//           control={control}
//           name="logo"
//           render={({ field }) => (
//             <Input
//               name="logo"
//               handler={{ control }}
//               placeholder="Paste logo URL"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Email*" />
//         <Controller
//           control={control}
//           name="email"
//           rules={{ required: "Required" }}
//           render={({ field }) => (
//             <Input
//               name="email"
//               handler={{ control }}
//               placeholder="example@company.com"
//               keyboardType="email-address"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Phone Number*" />
//         <Controller
//           control={control}
//           name="phone"
//           rules={{ required: "Required" }}
//           render={({ field }) => (
//             <Input
//               name="phone"
//               handler={{ control }}
//               placeholder="Enter phone number"
//               keyboardType="phone-pad"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Address" />
//         <Controller
//           control={control}
//           name="address"
//           render={({ field }) => (
//             <Input
//               name="address"
//               handler={{ control }}
//               placeholder="Enter address"
//               multiline
//               numberOfLines={3}
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="State" />
//         <Controller
//           control={control}
//           name="state"
//           render={({ field }) => (
//             <Input
//               name="state"
//               handler={{ control }}
//               placeholder="Enter state"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Country" />
//         <Controller
//           control={control}
//           name="country"
//           render={({ field }) => (
//             <Input
//               name="country"
//               handler={{ control }}
//               placeholder="Enter country"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Pincode" />
//         <Controller
//           control={control}
//           name="pincode"
//           render={({ field }) => (
//             <Input
//               name="pincode"
//               handler={{ control }}
//               placeholder="Enter pincode"
//               keyboardType="numeric"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="About Organization" />
//         <Controller
//           control={control}
//           name="about"
//           render={({ field }) => (
//             <Input
//               name="about"
//               handler={{ control }}
//               placeholder="Write something about organization"
//               multiline
//               numberOfLines={4}
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         {/* ENABLE GST */}
//         <Label text="Enable GST?" />
//         <Controller
//           control={control}
//           name="enableGst"
//           render={({ field }) => (
//             <Flex direction="row" mt={8} gap={20}>
//               {["YES", "NO"].map(option => (
//                 <TouchableOpacity
//                   key={option}
//                   style={styles.radioRow}
//                   onPress={() => field.onChange(option)}
//                 >
//                   <View
//                     style={[
//                       styles.radioCircle,
//                       field.value === option && styles.radioSelected,
//                     ]}
//                   />
//                   <Text style={styles.radioText}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </Flex>
//           )}
//         />

//         {/* TERMS */}
//         <Controller
//           control={control}
//           name="acceptTerms"
//           rules={{ required: true }}
//           render={({ field }) => (
//             <TouchableOpacity
//               style={styles.termsRow}
//               onPress={() => field.onChange(!field.value)}
//             >
//               <View
//                 style={[
//                   styles.checkbox,
//                   field.value && styles.checkboxChecked,
//                 ]}
//               />
//               <Text style={styles.termsText}>
//                 Accept{" "}
//                 <Text style={styles.termsLink}>Terms and Conditions</Text>
//               </Text>
//             </TouchableOpacity>
//           )}
//         />

//         {/* SUBMIT */}
//         <Button
//           title="CREATE ORGANIZATION"
//           btnStyles={styles.createBtn}
//           btnTxtStyles={{ color: "#fff", fontSize: 16 }}
//           onPress={handleSubmit(onSubmit)}
//         />

//       </ThemeScrollView>
//     </SafeView>
//   );
// };

// export default CreateOrganization;

// const styles = StyleSheet.create({
//   scrollContent: {
//   paddingHorizontal: 16,paddingBottom: 40,},
//   label: {fontSize: 14,fontWeight: "600", marginBottom: 6, marginTop: 12,color: "#000", },
//   input: {marginBottom: 6,},
//   radioRow: {flexDirection: "row",alignItems: "center",gap: 6,},
//   radioCircle: {width: 18,height: 18,borderRadius: 9,borderWidth: 2,borderColor: COLORS.primary,},
//   radioSelected: {backgroundColor: COLORS.primary,},
//   radioText: {fontSize: 14,color: "#000",},
//   termsRow: {flexDirection: "row",alignItems: "center",marginTop: 18,},
//   checkbox: {width: 18,height: 18,borderWidth: 2,borderColor: COLORS.primary,marginRight: 8,},
//   checkboxChecked: {backgroundColor: COLORS.primary,},
//   termsText: {fontSize: 13,color: "#000",},
//   termsLink: {color: COLORS.primary,textDecorationLine: "underline",},
//   createBtn: {marginTop: 25,height: 50,borderRadius: 10,backgroundColor: "#6C63FF",},
// });


// import React, { useState } from "react";
// import {StyleSheet,Text,View,TouchableOpacity,Modal,Switch,TextInput,
// } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import Flex from "../../../@ui/flex/Flex";
// import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import Input from "../../../@ui/input/Input";
// import Button from "../../../@ui/button/Button";
// import { IMAGES } from "../../../images";
// import { COLORS } from "../../../colors";

// /* ================= TYPES ================= */

// type TCreateOrgForm = {
//   organizationName: string;
//   website: string;
//   logo: string;
//   email: string;
//   phone: string;
//   address: string;
//   state: string;
//   country: string;
//   pincode: string;
//   about: string;
//   enableGst: "YES" | "NO";
//   acceptTerms: boolean;
// };

// /* ================= LABEL ================= */

// const Label = ({ text }: { text: string }) => (
//   <Text style={styles.label}>{text}</Text>
// );

// /* ================= GST MODAL ================= */

// const GSTModal = ({ visible, onClose }: any) => {
//   const [cgstOn, setCgstOn] = useState(false);
//   const [sgstOn, setSgstOn] = useState(false);

//   const [cgst, setCgst] = useState(9);
//   const [sgst, setSgst] = useState(9);

//   const total = (cgstOn ? cgst : 0) + (sgstOn ? sgst : 0);

//   return (
//     <Modal visible={visible} transparent animationType="fade">
//       <View style={styles.overlay}>
//         <View style={styles.modalCard}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Payment Rules</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Text style={{ fontSize: 18 }}>✕</Text>
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.sectionTitle}>GST Settings</Text>
//           <Text style={styles.subText}>
//             Configure your Goods and Services Tax (GST) calculation rules.
//           </Text>

//           <Text style={styles.label}>GSTIN Number *</Text>
//           <TextInput
//             placeholder="Enter GSTIN number"
//             style={styles.gstinInput}
//           />

//           {/* CGST */}
//           <View style={styles.row}>
//             <Text>Enable CGST</Text>
//             <View style={styles.rightRow}>
//               <Text>{cgstOn ? `${cgst}%` : "0%"}</Text>
//               <Switch value={cgstOn} onValueChange={setCgstOn} />
//             </View>
//           </View>

//           {/* SGST */}
//           <View style={styles.row}>
//             <Text>Enable SGST</Text>
//             <View style={styles.rightRow}>
//               <Text>{sgstOn ? `${sgst}%` : "0%"}</Text>
//               <Switch value={sgstOn} onValueChange={setSgstOn} />
//             </View>
//           </View>

//           <Text style={styles.totalText}>Total Applicable GST</Text>
//           <Text style={styles.totalValue}>{total}%</Text>

//           <Button
//             title="SAVE GST SETTINGS"
//             btnStyles={styles.saveBtn}
//             btnTxtStyles={{ color: "#fff" }}
//             onPress={onClose}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// /* ================= MAIN ================= */

// const CreateOrganization = ({ navigation }: any) => {
//   const [showGST, setShowGST] = useState(false);

//   const { control, handleSubmit } = useForm<TCreateOrgForm>({
//     defaultValues: {
//       enableGst: "NO",
//       acceptTerms: false,
//     },
//   });

//   const onSubmit = (data: TCreateOrgForm) => {
//     console.log("CREATE ORGANIZATION PAYLOAD 👉", data);
//   };

//   return (
//     <SafeView>
//       <AppHeader
//         title="Create Organization"
//         showDrawer={false}
//         handleBackClick={() => navigation.goBack()}
//       />

//       <Flex justify="center" mt={20}>
//         <AutoHeightImage source={IMAGES.approveImage} width={150} />
//       </Flex>

//       <ThemeScrollView contentContainerStyle={styles.scrollContent}>

//         {/* --------- FORM SAME AS TUMHARA --------- */}

//         <Label text="Enable GST?" />
//         <Controller
//           control={control}
//           name="enableGst"
//           render={({ field }) => (
//             <Flex direction="row" mt={8} gap={20}>
//               {["YES", "NO"].map(option => (
//                 <TouchableOpacity
//                   key={option}
//                   style={styles.radioRow}
//                   onPress={() => {
//                     field.onChange(option);
//                     if (option === "YES") setShowGST(true);
//                   }}
//                 >
//                   <View
//                     style={[
//                       styles.radioCircle,
//                       field.value === option && styles.radioSelected,
//                     ]}
//                   />
//                   <Text style={styles.radioText}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </Flex>
//           )}
//         />

//         <Controller
//           control={control}
//           name="acceptTerms"
//           rules={{ required: true }}
//           render={({ field }) => (
//             <TouchableOpacity
//               style={styles.termsRow}
//               onPress={() => field.onChange(!field.value)}
//             >
//               <View
//                 style={[
//                   styles.checkbox,
//                   field.value && styles.checkboxChecked,
//                 ]}
//               />
//               <Text style={styles.termsText}>
//                 Accept{" "}
//                 <Text style={styles.termsLink}>Terms and Conditions</Text>
//               </Text>
//             </TouchableOpacity>
//           )}
//         />

//         <Button
//           title="CREATE ORGANIZATION"
//           btnStyles={styles.createBtn}
//           btnTxtStyles={{ color: "#fff", fontSize: 16 }}
//           onPress={handleSubmit(onSubmit)}
//         />
//       </ThemeScrollView>

//       {/* GST POPUP */}
//       <GSTModal visible={showGST} onClose={() => setShowGST(false)} />
//     </SafeView>
//   );
// };

// export default CreateOrganization;

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
//   label: { fontSize: 14, fontWeight: "600", marginTop: 12 },
//   radioRow: { flexDirection: "row", alignItems: "center", gap: 6 },
//   radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: COLORS.primary },
//   radioSelected: { backgroundColor: COLORS.primary },
//   radioText: { fontSize: 14 },
//   termsRow: { flexDirection: "row", alignItems: "center", marginTop: 18 },
//   checkbox: { width: 18, height: 18, borderWidth: 2, borderColor: COLORS.primary, marginRight: 8 },
//   checkboxChecked: { backgroundColor: COLORS.primary },
//   termsText: { fontSize: 13 },
//   termsLink: { color: COLORS.primary, textDecorationLine: "underline" },
//   createBtn: { marginTop: 25, height: 50, borderRadius: 10, backgroundColor: "#6C63FF" },

//   overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
//   modalCard: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
//   modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   modalTitle: { fontSize: 18, fontWeight: "bold" },
//   sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 10 },
//   subText: { fontSize: 12, color: "#777" },
//   gstinInput: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginTop: 6 },
//   row: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
//   rightRow: { flexDirection: "row", alignItems: "center", gap: 8 },
//   totalText: { marginTop: 20, fontWeight: "600" },
//   totalValue: { fontSize: 26, color: COLORS.primary },
//   saveBtn: { marginTop: 20, height: 48, borderRadius: 8, backgroundColor: "#6C63FF" },
// });

// ye isme editable nahi he 
// import React, { useState } from "react";
// import {StyleSheet,Text,View,TouchableOpacity,Modal,Switch,TextInput,
// } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import Flex from "../../../@ui/flex/Flex";
// import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import Input from "../../../@ui/input/Input";
// import Button from "../../../@ui/button/Button";
// import { IMAGES } from "../../../images";
// import { COLORS } from "../../../colors";

// type TCreateOrgForm = {
//   organizationName: string;
//   website: string;
//   logo: string;
//   email: string;
//   phone: string;
//   address: string;
//   state: string;
//   country: string;
//   pincode: string;
//   about: string;
//   enableGst: "YES" | "NO";
//   acceptTerms: boolean;
// };

// const Label = ({ text }: { text: string }) => (
//   <Text style={styles.label}>{text}</Text>
// );

// const CreateOrganization = ({ navigation }: any) => {
//   const [showGSTModal, setShowGSTModal] = useState(false);
//   const [cgstOn, setCgstOn] = useState(false);
//   const [sgstOn, setSgstOn] = useState(false);

//   const totalGST =
//     (cgstOn ? 9 : 0) +
//     (sgstOn ? 9 : 0);

//   const { control, handleSubmit } = useForm<TCreateOrgForm>({
//     defaultValues: {
//       enableGst: "NO",
//       acceptTerms: false,
//     },
//   });

//   const onSubmit = (data: TCreateOrgForm) => {
//     console.log("CREATE ORGANIZATION PAYLOAD 👉", {
//       ...data,
//       gst: {
//         cgst: cgstOn ? 9 : 0,
//         sgst: sgstOn ? 9 : 0,
//         total: totalGST,
//       },
//     });
//   };

//   return (
//     <SafeView>
//       <AppHeader
//         title="Create Organization"
//         showDrawer={false}
//         handleBackClick={() => navigation.goBack()}
//       />

//       <Flex justify="center" mt={20}>
//         <AutoHeightImage source={IMAGES.approveImage} width={150} />
//       </Flex>

//       <ThemeScrollView contentContainerStyle={styles.scrollContent}>

//         {/* ---- पूरा तुम्हारा existing form SAME ---- */}

//         <Label text="Organization Name*" />
//         <Controller
//           control={control}
//           name="organizationName"
//           rules={{ required: "Required" }}
//           render={({ field }) => (
//             <Input
//               name="organizationName"
//               handler={{ control }}
//               placeholder="Enter organization name"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Website URL" />
//         <Controller
//           control={control}
//           name="website"
//           render={({ field }) => (
//             <Input
//               name="website"
//               handler={{ control }}
//               placeholder="https://example.com"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Logo URL" />
//         <Controller
//           control={control}
//           name="logo"
//           render={({ field }) => (
//             <Input
//               name="logo"
//               handler={{ control }}
//               placeholder="Paste logo URL"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Email*" />
//         <Controller
//           control={control}
//           name="email"
//           rules={{ required: "Required" }}
//           render={({ field }) => (
//             <Input
//               name="email"
//               handler={{ control }}
//               placeholder="example@company.com"
//               keyboardType="email-address"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Phone Number*" />
//         <Controller
//           control={control}
//           name="phone"
//           rules={{ required: "Required" }}
//           render={({ field }) => (
//             <Input
//               name="phone"
//               handler={{ control }}
//               placeholder="Enter phone number"
//               keyboardType="phone-pad"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Organization Address" />
//         <Controller
//           control={control}
//           name="address"
//           render={({ field }) => (
//             <Input
//               name="address"
//               handler={{ control }}
//               placeholder="Enter address"
//               multiline
//               numberOfLines={3}
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="State" />
//         <Controller
//           control={control}
//           name="state"
//           render={({ field }) => (
//             <Input
//               name="state"
//               handler={{ control }}
//               placeholder="Enter state"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Country" />
//         <Controller
//           control={control}
//           name="country"
//           render={({ field }) => (
//             <Input
//               name="country"
//               handler={{ control }}
//               placeholder="Enter country"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="Pincode" />
//         <Controller
//           control={control}
//           name="pincode"
//           render={({ field }) => (
//             <Input
//               name="pincode"
//               handler={{ control }}
//               placeholder="Enter pincode"
//               keyboardType="numeric"
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         <Label text="About Organization" />
//         <Controller
//           control={control}
//           name="about"
//           render={({ field }) => (
//             <Input
//               name="about"
//               handler={{ control }}
//               placeholder="Write something about organization"
//               multiline
//               numberOfLines={4}
//               value={field.value}
//               onChangeText={field.onChange}
//               containerStyles={styles.input}
//             />
//           )}
//         />

//         {/* ENABLE GST */}
//         <Label text="Enable GST?" />
//         <Controller
//           control={control}
//           name="enableGst"
//           render={({ field }) => (
//             <Flex direction="row" mt={8} gap={20}>
//               {["YES", "NO"].map(option => (
//                 <TouchableOpacity
//                   key={option}
//                   style={styles.radioRow}
//                   onPress={() => {
//                     field.onChange(option);
//                     if (option === "YES") setShowGSTModal(true);
//                   }}
//                 >
//                   <View
//                     style={[
//                       styles.radioCircle,
//                       field.value === option && styles.radioSelected,
//                     ]}
//                   />
//                   <Text style={styles.radioText}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </Flex>
//           )}
//         />

//         {/* TERMS */}
//         <Controller
//           control={control}
//           name="acceptTerms"
//           rules={{ required: true }}
//           render={({ field }) => (
//             <TouchableOpacity
//               style={styles.termsRow}
//               onPress={() => field.onChange(!field.value)}
//             >
//               <View
//                 style={[
//                   styles.checkbox,
//                   field.value && styles.checkboxChecked,
//                 ]}
//               />
//               <Text style={styles.termsText}>
//                 Accept{" "}
//                 <Text style={styles.termsLink}>Terms and Conditions</Text>
//               </Text>
//             </TouchableOpacity>
//           )}
//         />

//         <Button
//           title="CREATE ORGANIZATION"
//           btnStyles={styles.createBtn}
//           btnTxtStyles={{ color: "#fff", fontSize: 16 }}
//           onPress={handleSubmit(onSubmit)}
//         />

//       </ThemeScrollView>

//       {/* ========== GST MODAL ========== */}
//       <Modal visible={showGSTModal} transparent animationType="fade">
//         <View style={styles.gstOverlay}>
//           <View style={styles.gstCard}>

//             <View style={styles.gstHeader}>
//               <Text style={styles.gstTitle}>GST Settings</Text>
//               <TouchableOpacity onPress={() => setShowGSTModal(false)}>
//                 <Text style={{ fontSize: 18 }}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <Label text="GSTIN Number*" />
//             <TextInput
//               placeholder="Enter GSTIN number"
//               style={styles.gstinInput}
//             />

//             <View style={styles.gstRow}>
//               <Text>CGST (9%)</Text>
//               <Switch value={cgstOn} onValueChange={setCgstOn} />
//             </View>

//             <View style={styles.gstRow}>
//               <Text>SGST (9%)</Text>
//               <Switch value={sgstOn} onValueChange={setSgstOn} />
//             </View>

//             <Text style={styles.gstTotalLabel}>Total Applicable GST</Text>
//             <Text style={styles.gstTotal}>{totalGST}%</Text>

//             <Button
//               title="SAVE GST SETTINGS"
//               btnStyles={styles.gstSaveBtn}
//               btnTxtStyles={{ color: "#fff" }}
//               onPress={() => setShowGSTModal(false)}
//             />
//           </View>
//         </View>
//       </Modal>

//     </SafeView>
//   );
// };

// export default CreateOrganization;

// const styles = StyleSheet.create({
//   scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
//   label: { fontSize: 14, fontWeight: "600", marginBottom: 6, marginTop: 12, color: "#000" },
//   input: { marginBottom: 6 },
//   radioRow: { flexDirection: "row", alignItems: "center", gap: 6 },
//   radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: COLORS.primary },
//   radioSelected: { backgroundColor: COLORS.primary },
//   radioText: { fontSize: 14, color: "#000" },
//   termsRow: { flexDirection: "row", alignItems: "center", marginTop: 18 },
//   checkbox: { width: 18, height: 18, borderWidth: 2, borderColor: COLORS.primary, marginRight: 8 },
//   checkboxChecked: { backgroundColor: COLORS.primary },
//   termsText: { fontSize: 13, color: "#000" },
//   termsLink: { color: COLORS.primary, textDecorationLine: "underline" },
//   createBtn: { marginTop: 25, height: 50, borderRadius: 10, backgroundColor: "#6C63FF" },

//   gstOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
//   gstCard: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
//   gstHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   gstTitle: { fontSize: 18, fontWeight: "600" },
//   gstRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
//   gstTotalLabel: { marginTop: 20, fontWeight: "600" },
//   gstTotal: { fontSize: 26, color: COLORS.primary },
//   gstinInput: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginTop: 6 },
//   gstSaveBtn: { marginTop: 20, height: 48, borderRadius: 8, backgroundColor: "#6C63FF" },
// });






// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Modal,
//   Switch,
//   TextInput,
// } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import Flex from "../../../@ui/flex/Flex";
// import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import Input from "../../../@ui/input/Input";
// import Button from "../../../@ui/button/Button";
// import { IMAGES } from "../../../images";
// import { COLORS } from "../../../colors";

// /* ================= TYPES ================= */

// type TCreateOrgForm = {
//   organizationName: string;
//   website: string;
//   logo: string;
//   email: string;
//   phone: string;
//   address: string;
//   state: string;
//   country: string;
//   pincode: string;
//   about: string;
//   enableGst: "YES" | "NO";
//   acceptTerms: boolean;
// };

// const Label = ({ text }: { text: string }) => (
//   <Text style={styles.label}>{text}</Text>
// );

// /* ================= GST MODAL ================= */

// const GSTModal = ({ visible, onClose }: any) => {
//   const [cgstOn, setCgstOn] = useState(false);
//   const [sgstOn, setSgstOn] = useState(false);

//   const [cgst, setCgst] = useState(9);
//   const [sgst, setSgst] = useState(9);

//   const [editCgst, setEditCgst] = useState(false);
//   const [editSgst, setEditSgst] = useState(false);

//   const total = (cgstOn ? cgst : 0) + (sgstOn ? sgst : 0);

//   return (
//     <Modal visible={visible} transparent animationType="fade">
//       <View style={styles.overlay}>
//         <View style={styles.modalCard}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Payment Rules</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Text style={{ fontSize: 18 }}>✕</Text>
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.sectionTitle}>GST Settings</Text>
//           <Text style={styles.subText}>
//             Configure your Goods and Services Tax (GST) calculation rules.
//           </Text>

//           <Text style={styles.label}>GSTIN Number *</Text>
//           <TextInput
//             placeholder="Enter GSTIN number"
//             style={styles.gstinInput}
//           />

//           {/* CGST */}
//           <View style={styles.row}>
//             <Text>Enable CGST (Central GST)</Text>
//             <View style={styles.rightRow}>
//               {editCgst ? (
//                 <TextInput
//                   value={String(cgst)}
//                   onChangeText={(v) => setCgst(Number(v) || 0)}
//                   keyboardType="numeric"
//                   style={styles.percentInput}
//                 />
//               ) : (
//                 <Text>{cgstOn ? `${cgst}%` : "0%"}</Text>
//               )}

//               <TouchableOpacity onPress={() => setEditCgst(!editCgst)}>
//                 <Text style={styles.editIcon}>✏️</Text>
//               </TouchableOpacity>

//               <Switch value={cgstOn} onValueChange={setCgstOn} />
//             </View>
//           </View>
//           <Text style={styles.helperText}>Toggle to apply CGST.</Text>

//           {/* SGST */}
//           <View style={styles.row}>
//             <Text>Enable SGST (State GST)</Text>
//             <View style={styles.rightRow}>
//               {editSgst ? (
//                 <TextInput
//                   value={String(sgst)}
//                   onChangeText={(v) => setSgst(Number(v) || 0)}
//                   keyboardType="numeric"
//                   style={styles.percentInput}
//                 />
//               ) : (
//                 <Text>{sgstOn ? `${sgst}%` : "0%"}</Text>
//               )}

//               <TouchableOpacity onPress={() => setEditSgst(!editSgst)}>
//                 <Text style={styles.editIcon}>✏️</Text>
//               </TouchableOpacity>

//               <Switch value={sgstOn} onValueChange={setSgstOn} />
//             </View>
//           </View>
//           <Text style={styles.helperText}>Toggle to apply SGST.</Text>

//           {/* TOTAL */}
//           <Text style={styles.totalText}>Total Applicable GST Percentage</Text>
//           <Text style={styles.totalValue}>{total}%</Text>

//           <Text style={styles.helperText}>
//             {total === 0
//               ? "No GST will be applied as GST is disabled."
//               : "This is the sum of enabled CGST and SGST percentages."}
//           </Text>

//           <Button
//             title="SAVE GST SETTINGS"
//             btnStyles={styles.saveBtn}
//             btnTxtStyles={{ color: "#fff" }}
//             onPress={onClose}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// /* ================= MAIN ================= */

// const CreateOrganization = ({ navigation }: any) => {
//   const [showGST, setShowGST] = useState(false);

//   const { control, handleSubmit } = useForm<TCreateOrgForm>({
//     defaultValues: {
//       enableGst: "NO",
//       acceptTerms: false,
//     },
//   });

//   const onSubmit = (data: TCreateOrgForm) => {
//     console.log("CREATE ORGANIZATION PAYLOAD 👉", data);
//   };

//   return (
//     <SafeView>
//       <AppHeader
//         title="Create Organization"
//         showDrawer={false}
//         handleBackClick={() => navigation.goBack()}
//       />

//       <Flex justify="center" mt={20}>
//         <AutoHeightImage source={IMAGES.approveImage} width={150} />
//       </Flex>

//       <ThemeScrollView contentContainerStyle={styles.scrollContent}>
//         <Label text="Enable GST?" />
//         <Controller
//           control={control}
//           name="enableGst"
//           render={({ field }) => (
//             <Flex direction="row" mt={8} gap={20}>
//               {["YES", "NO"].map(option => (
//                 <TouchableOpacity
//                   key={option}
//                   style={styles.radioRow}
//                   onPress={() => {
//                     field.onChange(option);
//                     if (option === "YES") setShowGST(true);
//                   }}
//                 >
//                   <View
//                     style={[
//                       styles.radioCircle,
//                       field.value === option && styles.radioSelected,
//                     ]}
//                   />
//                   <Text style={styles.radioText}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </Flex>
//           )}
//         />

//         <Controller
//           control={control}
//           name="acceptTerms"
//           rules={{ required: true }}
//           render={({ field }) => (
//             <TouchableOpacity
//               style={styles.termsRow}
//               onPress={() => field.onChange(!field.value)}
//             >
//               <View
//                 style={[
//                   styles.checkbox,
//                   field.value && styles.checkboxChecked,
//                 ]}
//               />
//               <Text style={styles.termsText}>
//                 Accept{" "}
//                 <Text style={styles.termsLink}>Terms and Conditions</Text>
//               </Text>
//             </TouchableOpacity>
//           )}
//         />

//         <Button
//           title="CREATE ORGANIZATION"
//           btnStyles={styles.createBtn}
//           btnTxtStyles={{ color: "#fff", fontSize: 16 }}
//           onPress={handleSubmit(onSubmit)}
//         />
//       </ThemeScrollView>

//       <GSTModal visible={showGST} onClose={() => setShowGST(false)} />
//     </SafeView>
//   );
// };

// export default CreateOrganization;

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },

//   label: { fontSize: 14, fontWeight: "600", marginTop: 12 },

//   radioRow: { flexDirection: "row", alignItems: "center", gap: 6 },
//   radioCircle: {
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//   },
//   radioSelected: { backgroundColor: COLORS.primary },
//   radioText: { fontSize: 14 },

//   termsRow: { flexDirection: "row", alignItems: "center", marginTop: 18 },
//   checkbox: {
//     width: 18,
//     height: 18,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     marginRight: 8,
//   },
//   checkboxChecked: { backgroundColor: COLORS.primary },
//   termsText: { fontSize: 13 },
//   termsLink: {
//     color: COLORS.primary,
//     textDecorationLine: "underline",
//   },

//   createBtn: {
//     marginTop: 25,
//     height: 50,
//     borderRadius: 10,
//     backgroundColor: "#6C63FF",
//   },

//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalCard: {
//     width: "90%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   modalTitle: { fontSize: 18, fontWeight: "bold" },
//   sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 10 },
//   subText: { fontSize: 12, color: "#777" },

//   gstinInput: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 10,
//     marginTop: 6,
//   },

//   row: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
//   rightRow: { flexDirection: "row", alignItems: "center", gap: 8 },

//   editIcon: { fontSize: 16 },
//   percentInput: {
//     width: 40,
//     borderBottomWidth: 1,
//     textAlign: "center",
//   },

//   totalText: { marginTop: 20, fontWeight: "600" },
//   totalValue: { fontSize: 26, color: COLORS.primary },

//   helperText: {
//     fontSize: 12,
//     color: "#777",
//     marginTop: 4,
//   },

//   saveBtn: {
//     marginTop: 20,
//     height: 48,
//     borderRadius: 8,
//     backgroundColor: "#6C63FF",
//   },
// });

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Switch,
  TextInput,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import Flex from "../../../@ui/flex/Flex";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import Input from "../../../@ui/input/Input";
import Button from "../../../@ui/button/Button";
import { IMAGES } from "../../../images";
import { COLORS } from "../../../colors";

/* ================= TYPES ================= */

type TCreateOrgForm = {
  enableGst: "YES" | "NO";
  acceptTerms: boolean;
};

const Label = ({ text }: { text: string }) => (
  <Text style={styles.label}>{text}</Text>
);

/* ================= GST MODAL ================= */

const GSTModal = ({ visible, onClose }: any) => {
  const [cgstOn, setCgstOn] = useState(false);
  const [sgstOn, setSgstOn] = useState(false);

  const [cgst, setCgst] = useState(9);
  const [sgst, setSgst] = useState(9);

  const [editCgst, setEditCgst] = useState(false);
  const [editSgst, setEditSgst] = useState(false);

  const [showGstTypeInfo, setShowGstTypeInfo] = useState(false);
  const [showGstinInfo, setShowGstinInfo] = useState(false);

  const total = (cgstOn ? cgst : 0) + (sgstOn ? sgst : 0);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Payment Rules</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>GST Settings</Text>
          <Text style={styles.subText}>
            Configure your Goods and Services Tax (GST) calculation rules.
          </Text>

          {/* GST TYPE */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>GST Type *</Text>
            <TouchableOpacity onPress={() => setShowGstTypeInfo(!showGstTypeInfo)}>
              <Text style={styles.infoIcon}>ℹ️</Text>
            </TouchableOpacity>
          </View>

          {showGstTypeInfo && (
            <Text style={styles.infoText}>
              Choose whether to enable GST or apply no GST.
            </Text>
          )}

          <View style={styles.gstTypeBox}>
            <View style={styles.radioCircleFilled} />
            <Text style={styles.gstTypeText}>GST Enable</Text>
          </View>

          {/* GSTIN */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>GSTIN Number *</Text>
            <TouchableOpacity onPress={() => setShowGstinInfo(!showGstinInfo)}>
              <Text style={styles.infoIcon}>ℹ️</Text>
            </TouchableOpacity>
          </View>

          {showGstinInfo && (
            <Text style={styles.infoText}>
              Goods and Services Tax Identification Number
            </Text>
          )}

          <TextInput
            placeholder="Enter GSTIN number"
            style={styles.gstinInput}
          />

          {/* CGST */}
          <View style={styles.row}>
            <Text>Enable CGST (Central GST)</Text>
            <View style={styles.rightRow}>
              {editCgst ? (
                <TextInput
                  value={String(cgst)}
                  onChangeText={(v) => setCgst(Number(v) || 0)}
                  keyboardType="numeric"
                  style={styles.percentInput}
                />
              ) : (
                <Text>{cgstOn ? `${cgst}%` : "0%"}</Text>
              )}

              <TouchableOpacity onPress={() => setEditCgst(!editCgst)}>
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>

              <Switch value={cgstOn} onValueChange={setCgstOn} />
            </View>
          </View>
          <Text style={styles.helperText}>Toggle to apply CGST.</Text>

          {/* SGST */}
          <View style={styles.row}>
            <Text>Enable SGST (State GST)</Text>
            <View style={styles.rightRow}>
              {editSgst ? (
                <TextInput
                  value={String(sgst)}
                  onChangeText={(v) => setSgst(Number(v) || 0)}
                  keyboardType="numeric"
                  style={styles.percentInput}
                />
              ) : (
                <Text>{sgstOn ? `${sgst}%` : "0%"}</Text>
              )}

              <TouchableOpacity onPress={() => setEditSgst(!editSgst)}>
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>

              <Switch value={sgstOn} onValueChange={setSgstOn} />
            </View>
          </View>
          <Text style={styles.helperText}>Toggle to apply SGST.</Text>

          {/* TOTAL */}
          <Text style={styles.totalText}>Total Applicable GST Percentage</Text>
          <Text style={styles.totalValue}>{total}%</Text>

          <Text style={styles.helperText}>
            {total === 0
              ? "No GST will be applied as GST is disabled."
              : "This is the sum of enabled CGST and SGST percentages."}
          </Text>

          <Button
            title="SAVE GST SETTINGS"
            btnStyles={styles.saveBtn}
            btnTxtStyles={{ color: "#fff" }}
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};

/* ================= MAIN ================= */

const CreateOrganization = ({ navigation }: any) => {
  const [showGST, setShowGST] = useState(false);

  const { control, handleSubmit } = useForm<TCreateOrgForm>({
    defaultValues: {
      enableGst: "NO",
      acceptTerms: false,
    },
  });

  return (
    <SafeView>
      <AppHeader
        title="Create Organization"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />

      <Flex justify="center" mt={20}>
        <AutoHeightImage source={IMAGES.approveImage} width={150} />
      </Flex>

      <ThemeScrollView contentContainerStyle={styles.scrollContent}>
        <Label text="Enable GST?" />
        <Controller
          control={control}
          name="enableGst"
          render={({ field }) => (
            <Flex direction="row" mt={8} gap={20}>
              {["YES", "NO"].map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioRow}
                  onPress={() => {
                    field.onChange(option);
                    if (option === "YES") setShowGST(true);
                  }}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      field.value === option && styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.radioText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </Flex>
          )}
        />

        <Button
          title="CREATE ORGANIZATION"
          btnStyles={styles.createBtn}
          btnTxtStyles={{ color: "#fff", fontSize: 16 }}
          onPress={handleSubmit(() => {})}
        />
      </ThemeScrollView>

      <GSTModal visible={showGST} onClose={() => setShowGST(false)} />
    </SafeView>
  );
};

export default CreateOrganization;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },

  label: { fontSize: 14, fontWeight: "600", marginTop: 12 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6 },

  infoIcon: { fontSize: 14 },
  infoText: { fontSize: 12, color: "#777", marginBottom: 6 },

  gstTypeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F3FF",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    marginTop: 6,
  },
  radioCircleFilled: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  gstTypeText: { fontSize: 14, fontWeight: "500" },

  radioRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  radioSelected: { backgroundColor: COLORS.primary },
  radioText: { fontSize: 14 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  subText: { fontSize: 12, color: "#777" },

  gstinInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },

  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  rightRow: { flexDirection: "row", alignItems: "center", gap: 8 },

  editIcon: { fontSize: 16 },
  percentInput: { width: 40, borderBottomWidth: 1, textAlign: "center" },

  helperText: { fontSize: 12, color: "#777", marginTop: 4 },

  totalText: { marginTop: 20, fontWeight: "600" },
  totalValue: { fontSize: 26, color: COLORS.primary },

  createBtn: {
    marginTop: 25,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#6C63FF",
  },
  saveBtn: {
    marginTop: 20,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#6C63FF",
  },
});
