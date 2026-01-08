 

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import Input from "../../../@ui/input/Input";
import Button from "../../../@ui/button/Button";
import { COLORS } from "../../../colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
import ReviewPage from "./review-page";
export default function BankDetails() {

  const navigation = useNavigation<THomeStackNavigator>();
  const route = useRoute();
  const [ifscCode, setIfscCode] = useState("");
const [ifscError, setIfscError] = useState<string>("");

  const { control, handleSubmit, watch, setValue } = useForm({mode:"onSubmit"});
  const accNumber = watch("accountNo");
  

// ⬇️ YEH ADD KARO (onNext se pehle)
// IFSC API call function - validate IFSC code
const validateIFSC = async (ifsc: string) => {
  try {
    const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
    if (response.data && response.data.BANK) {
      // Auto-fill bank name if valid
      setValue("bankName", response.data.BANK);
      setIfscError("");
      return true;
    }
    return false;
  } catch (error: any) {
    setIfscError("Invalid IFSC code");
    return false;
  }
};

const onNext = async (data:any)=>{
    // Validate IFSC code before proceeding
    if (data.ifsc && data.ifsc.length === 11) {
      const isValid = await validateIFSC(data.ifsc);
      if (!isValid) {
        // Error already set in validateIFSC
        return;
      }
    }

    console.log("Bank Details =>", data);
    
    // Debug: Check what monthly salary data we're receiving
    const params = route.params as any;
    console.log("🔍 BankDetails - Employee Type:", params?.employeeType);
    console.log("🔍 BankDetails - Salary Type:", params?.salaryType);
    console.log("🔍 BankDetails - Fixed Salary:", params?.fixedSalary);
    console.log("🔍 BankDetails - Designation:", params?.designation);
    console.log("🔍 BankDetails - All Route Params:", params);

    navigation.navigate("ReviewPage",{
      employeeData: params?.employeeData,
      highestQualificationData: params?.highestQualificationData,
      educationDetailsData: params?.educationDetailsData,
      bankDetailsData: data,
      employeeType: params?.employeeType,
      salaryType: params?.salaryType,
      fixedSalary: params?.fixedSalary,
      designation: params?.designation,
      salaryAmount: params?.salaryAmount
    });
  };

  return (
    <SafeView>
      <AppHeader 
        showDrawer={false}
        title="Bank Details"
        handleBackClick={()=> navigation.goBack()}
      />

      <View style={styles.wrapper}>

        <View style={styles.card}>

          <ThemeScrollView contentContainerStyle={{paddingBottom:60}}>

            <ScalableText style={styles.heading}>      Bank Details</ScalableText>
            <ScalableText style={styles.subtext}>     Step 5 of 5 - Enter Information</ScalableText>

            {/* 🏦 BANK NAME */}
            <Label text="Bank Name*"/>
            <Controller
              control={control}
              name="bankName"
              rules={{
                required:"This field is required",
                pattern:{value:/^[A-Za-z ]+$/,message:"Alphabets only"}
              }}
              render={({field:{value,onChange}})=>(
                <Input name="bankName" handler={{control}} placeholder="Enter bank name"
                containerStyles={styles.input} 
                inputStyles={{fontFamily: undefined,paddingLeft:-6}}
                value={value} onChangeText={onChange}
                />
              )}
            />

            {/* 🔢 ACCOUNT NUMBER */}
            <Label text="Account Number*"/>
            <Controller
              control={control}
              name="accountNo"
              rules={{
                required:"This field is required",
                pattern:{value:/^[0-9]+$/,message:"Numbers only"}
              }}
              render={({field:{value,onChange}})=>(
                <Input name="accountNo" handler={{control}} placeholder="Enter account number"
  keyboardType="number-pad" containerStyles={styles.input}
  inputStyles={{fontFamily: undefined,paddingLeft:-6}}
  value={value} onChangeText={onChange}/>
              )}
            />

            {/* Confirm Account */}
            <Label text="Confirm Account Number*"/>
            <Controller
              control={control}
              name="confirmAccNo"
              rules={{
                required:"This field is required",
                validate:(v)=> v===accNumber || "Account numbers do not match"
              }}
              render={({field:{value,onChange}})=>(
                <Input name="confirmAccNo" handler={{control}} placeholder="Confirm account number"
  keyboardType="number-pad" containerStyles={styles.input}
  inputStyles={{fontFamily: undefined,paddingLeft:-6}}
  value={value} onChangeText={onChange}/>
              )}
            />

            {/* IFSC */}
            <Label text="IFSC Code*"/>
            <Controller
              control={control}
              name="ifsc"
              rules={{
                required:"This field is required",
                pattern:{value:/^[A-Za-z0-9]{11}$/,message:"Must be 11 characters"}
              }}
              render={({field:{value,onChange}})=>(
                <View>
                 <Input 
  name="ifsc" 
  handler={{control}} 
  placeholder="Enter IFSC code"
  containerStyles={styles.input}
  inputStyles={{fontFamily: undefined,paddingLeft:-6}}
  value={value} 
  onChangeText={(text) => {
    const upperText = text.toUpperCase();
    onChange(upperText);
    setIfscCode(upperText);
    setIfscError(""); // Reset error when user types
  }}
/>
                  {/* Error state - show when Next button is clicked and IFSC is invalid */}
                  {ifscError && (
                    <Text style={styles.errorText}>{ifscError}</Text>
                  )}
                </View>
              )}
            />
            
          </ThemeScrollView>
        </View>

        {/* ========== BOTTOM THREE BUTTONS ========== */}
        <View style={styles.bottomRow}>

          <Button 
            title="Back"
            btnStyles={styles.backBtn}
            btnTxtStyles={{color:"#000",fontSize:16}}
            onPress={()=> navigation.goBack()}
          />

          <Button 
            title="Skip"
            btnStyles={styles.skipBtn}
            btnTxtStyles={{color:"#fff",fontSize:16}}
            onPress={() => {
              // Same data pass karo jo onNext me pass kar rahe ho
              const params = route.params as any;
              navigation.navigate("ReviewPage", {
                employeeData: params?.employeeData,
                highestQualificationData: params?.highestQualificationData,
                educationDetailsData: params?.educationDetailsData,
                bankDetailsData: {}, // Empty kyunki skip kar rahe hain
                employeeType: params?.employeeType,
                salaryType: params?.salaryType,
                fixedSalary: params?.fixedSalary,
                designation: params?.designation,
                salaryAmount: params?.salaryAmount
              });
            }}
          />

          <Button 
            title="Next"
            btnStyles={styles.nextBtn}
            btnTxtStyles={{color:"#fff",fontSize:16}}
            onPress={handleSubmit(onNext)}
          
          />

        </View>

      </View>
    </SafeView>
  );
}

/* Small Label Component */
const Label = ({text}:{text:string}) => <Text style={styles.label}>{text}</Text>;

const Heights = { cardHeight:Dimensions.get("window").height *0.55 };

const styles = StyleSheet.create({
  wrapper:{flex:1,alignItems:"center",backgroundColor:COLORS.whiteSmoke},

  card:{
    width:"89%",height:Heights.cardHeight,backgroundColor:"#fff",
    borderRadius:15,elevation:6,paddingHorizontal:25,paddingVertical:22,
    borderLeftWidth:6,borderLeftColor:COLORS.primary,marginTop:5
  },

  heading:{fontSize:22,fontWeight:"bold",color:"#000",marginBottom:5},
  subtext:{fontSize:13,color:"#666",marginBottom:18},

  input:{marginBottom:10,height:48,paddingVertical:-1,width:"104%",
  },
  
  label:{fontSize:14,fontWeight:"600",marginBottom:6,marginTop:10,color:"#000"},
  error:{color:"red",fontSize:12,marginBottom:8},

  bottomRow:{flexDirection:"row",width:"90%",justifyContent:"space-between",marginTop:25,marginBottom:18},
  backBtn:{flex:1,height:50,backgroundColor:"#E6E6E6",borderRadius:10,marginRight:8},
  skipBtn:{flex:1,height:50,backgroundColor:"#003B73",borderRadius:10,marginRight:8},
  nextBtn:{flex:1,height:50,backgroundColor:"#003B73",borderRadius:10},

  loadingText: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
    marginLeft: 2
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2
  },
  bankInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0e8ff"
  },
  bankNameText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4
  },
  branchText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2
  },
  addressText: {
    fontSize: 11,
    color: "#999"
  }
});

