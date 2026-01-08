



import React, { useState } from "react";
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from "react-native";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import Button from "../../../@ui/button/Button";
import { COLORS } from "../../../colors";
import { useNavigation } from "@react-navigation/native";
import { THomeStackNavigator } from "../../../navigators/tab-navigator/sub-stack-navigator/HomeStackNavigator";
import { useRoute } from "@react-navigation/native";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage.tsx";
import { IMAGES } from "../../../images";

export default function HighestQualification() {

  // const navigation = useNavigation();
  const navigation = useNavigation<THomeStackNavigator>();
  const route = useRoute();
  const [education, setEducation] = useState("");
  const [openEdu, setOpenEdu] = useState(false);
  const [educationError, setEducationError] = useState("");

  // const onNext = ()=>{
  //   console.log("Selected Education =>", education);
    const onNext = ()=>{
    // Error reset karo
  setEducationError("");
  
  // Validation check
  if(!education || !education.trim()){
    setEducationError("This field is required");
    return; // Agar empty hai to return kar do, navigate mat karo
  }
  
    console.log("Selected Education =>", education);
    
    // Previous screen ka data get karo (agar chahiye)
    const employeeData = (route.params as any)?.employeeData;
    
    // Education Details screen pe navigate karo
    navigation.navigate("EducationDetails", {
      employeeData: employeeData,
      educationType: education,
      highestQualificationData: {
        education: education
      }
    } as any);
  };

  const onSkip = () => {
    // Previous screen ka data get karo
    const employeeData = (route.params as any)?.employeeData;
    
    // Directly MonthlySalary screen pe navigate karo
    navigation.navigate("MonthlySalary", {
      employeeData: employeeData
    } as any);
  };

  return (
    <SafeView>
      <AppHeader title="Highest Qualification" showDrawer={false} handleBackClick={()=>navigation.goBack()}/>

      <View style={styles.wrapper}>

        {/* CARD */}
        <View style={[styles.card,{height:Heights.cardHeight}]}>
          
          <ThemeScrollView>

            <ScalableText style={styles.heading} fontFamily="Medium">Highest Qualification</ScalableText>
            <ScalableText style={styles.sub} fontFamily="Regular">Step 2 of 5 • Enter Information</ScalableText>

            {/* ================= EDUCATION DROPDOWN START ================= */}
            <Text style={styles.label}>Education Details</Text>

            {/* <TouchableOpacity style={styles.drop} onPress={()=>setOpenEdu(!openEdu)}>
              <Text>{education || "Select Education"}</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
             style={[
             styles.drop,
             educationError ? { borderColor: "red", borderWidth: 2 } : {},
               {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingRight: 10
                  }
                  ]}
                onPress={() => setOpenEdu(!openEdu)}
                                                 >
                 <Text>{education || "Select Education"}</Text>

                   {/* ▼ DROPDOWN RIGHT ICON */}
                  <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
                    </TouchableOpacity>
                    {educationError ? (
  <Text style={styles.errorMsg}>{educationError}</Text>
) : null}

            {openEdu && (
              <View style={styles.listBox}>
                {["High School","Higher Secondary School","Graduation","Post Graduation"].map(item=>(
                  <TouchableOpacity key={item} style={styles.option}
                    onPress={()=>{ 
                      setEducation(item); 
                      setOpenEdu(false);
                      setEducationError(""); // Error clear karne ke liye
                    }}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {/* ================= EDUCATION DROPDOWN END ================= */}

          </ThemeScrollView>
        </View>

        {/* Footer Buttons */}
        <View style={styles.bottomRow}>
          <Button title="Back" btnStyles={styles.back} onPress={()=>navigation.goBack()}/>
          <Button title="Skip" btnStyles={styles.next} onPress={onSkip}/>
          <Button title="Next" btnStyles={styles.next} onPress={onNext}/>
        </View>

      </View>
    </SafeView>
  );
}

const Heights = { cardHeight: Dimensions.get("window").height * 0.62 };

const styles = StyleSheet.create({
  wrapper:{flex:1,alignItems:"center",backgroundColor:COLORS.whiteSmoke},

  card:{
    width:"89%",backgroundColor:"#fff",borderRadius:15,elevation:6,paddingTop:18,paddingHorizontal:25,
    borderLeftWidth:6,borderLeftColor:COLORS.primary,marginTop:5
  },

  heading:{fontSize:21,fontWeight:"bold",color:"#000",marginBottom:6},
  sub:{fontSize:13,color:"#666",marginBottom:15},

  label:{fontSize:14,fontWeight:"600",marginBottom:6,color:"#000"},
  // drop:{borderWidth:1,borderColor:"#AEB3B8",borderRadius:10,padding:12,marginBottom:8},
  // listBox:{borderWidth:1,bo0rderColor:"#AEB3B8",borderRadius:12,backgroundColor:"#fff",marginBottom:14},
  drop:{height:48,borderWidth:1,borderColor:"#000" ,borderRadius:10,justifyContent:"center",paddingLeft:12,marginBottom:10,width:"107%"},
  listBox:{backgroundColor:"#fff",borderWidth:1,borderColor:"#BFC4CA",borderRadius:10,marginBottom:14,overflow:"hidden",width:"107%"},
  option:{padding:12,borderBottomWidth:1,borderBottomColor:"#EEE"},

  bottomRow:{flexDirection:"row",width:"90%",marginTop:25,marginBottom:18,justifyContent:"space-between"},

  back:{flex:1,height:50,backgroundColor:"#E5E5E5",marginRight:8,borderRadius:10},
  next:{flex:1,height:50,backgroundColor:"#003B73",marginLeft:8,borderRadius:10},
  
  errorMsg:{color:"red",fontSize:12,marginTop:4,marginLeft:4}
});
