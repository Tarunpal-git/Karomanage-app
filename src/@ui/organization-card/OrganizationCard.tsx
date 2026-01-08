// import React, { FC, memo, useState } from "react";
// import {
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   View,
//   Text,
//   Button,
//   ImageBackground,
//   Linking,
// } from "react-native";
// import CheckBox from "../check-box/CheckBox";
// import ScalableText from "../scalable-text/ScalableText";
// import Flex from "../flex/Flex";
// import { COLORS } from "../../colors";

// interface IOrganizationCard {
//   data: {
//     customerId: string;
//     organizationId: string;
//     organizationName: string;
//     subscription: Array<
//       | {
//           createdAt: number;
//           trialEndsAt: number;
//           plan: string;
//         }
//       | {
//           planExpiryDate: number;
//           paymentStatus: string;
          
//           plan: string;
//         }
//     >;
//   };
//   onClick?: (data: any) => void;
//   checked?: boolean;
// }

// const OrganizationCard: FC<IOrganizationCard> = ({
//   data,
//   checked = false,
//   onClick,
// }) => {

//   console.log("data", data);


//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalMessage, setModalMessage] = useState<string | null>(null);

 
//   const { organizationName, subscription = [] } = data; 


//   const trialSubscription = subscription.find((sub) => "trialEndsAt" in sub);
//   const paidSubscription = subscription.find((sub) => "planExpiryDate" in sub);
  

//   const planPricing = paidSubscription?.planPricing || "N/A"; 
//   const formattedPlanExpiryDate = paidSubscription
//     ? new Date(paidSubscription.planExpiryDate).toLocaleDateString()
//     : "N/A";

//   const currentDate = Date.now();
//   const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;

//   const trialExpired =
//     trialSubscription &&
//     new Date(trialSubscription.trialEndsAt).getTime() < currentDate;

//   const trialExpiringSoon =
//     trialSubscription &&
//     !trialExpired &&
//     new Date(trialSubscription.trialEndsAt).getTime() - currentDate <=
//       fiveDaysInMs;

//   const paidExpired =
//     paidSubscription &&
//     new Date(paidSubscription.planExpiryDate).getTime() < currentDate;

//   const paidExpiringSoon =
//     paidSubscription &&
//     !paidExpired &&
//     new Date(paidSubscription.planExpiryDate).getTime() - currentDate <=
//       fiveDaysInMs;

//   const paymentDue = paidSubscription?.paymentStatus === "due" && !paidExpired;

//   const handleCall = () => {
//     Linking.openURL("tel:+917987265628");
//   };

//   const handleEmail = () => {
//     Linking.openURL("mailto:contact@karomanage.com");
//   };
//   // Determine modal message with proper priority
//   const alertMessage = paidExpired
//     ? "Your paid plan has expired. Please renew."
//     : paymentDue
//     ? "Your payment is due. Please complete the payment."
//     : paidExpiringSoon
//     ? "Your paid plan is expiring soon. Please renew."
//     : trialExpired
//     ? "Your trial plan has expired. Please upgrade."
//     : trialExpiringSoon
//     ? "Your trial plan is expiring soon. Please upgrade."
//     : null;

//   const handlePress = () => {
//     if (alertMessage) {
//       setModalMessage(alertMessage);
//       setModalVisible(true);
//     } else {
//       onClick?.(data);
//     }
//   };
//   const handlePay = () => {
//     // Handle payment action here
//     // alert("Payment initiated!");
//     setModalVisible(false);
//   };

//   return (
//     <>
//       <TouchableOpacity
//         style={[styles.root]}
//         activeOpacity={0.5}
//         onPress={handlePress}
//       >
//         <CheckBox checked={checked} />
//         <Flex justify="center" flex={1}>
//           <ScalableText
//             fontFamily="Regular"
//             style={styles.cardTitle}
//             numberOfLines={1}
//           >
//             {data.organizationName}
//           </ScalableText>
//         </Flex>
//       </TouchableOpacity>

//       {/* Modal */}
//       <Modal
//         transparent={true}
//         animationType="slide"
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           {/* <View style={styles.modalContent}> */}
//             {/* {!(trialExpired || paidExpired) && (
             
//             )} */}
//             {paidExpired ? (
//               <>
//                 <View style={styles.alertBoxx}>
//                   <Text style={styles.modalTitle}>
//                     Your invoice payment is due!
//                   </Text>
//                   <Text style={styles.modalText}>
//                     Please pay to continue further
//                   </Text>

//                   <View style={styles.paymentDetails}>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Due Date:</Text>
//                       <Text style={styles.detailLabel}>Pricing:</Text>
//                       <Text style={styles.detailLabel}>Action:</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailValue}>
//                         {formattedPlanExpiryDate}
//                       </Text>
//                       <Text style={styles.value}>{planPricing}</Text>
//                       <TouchableOpacity
//                         style={styles.payButton}
//                         onPress={handlePay}
//                       >
//                         <Text style={styles.payButtonText}>PAY</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               </>
//             ) : paidExpiringSoon ? (
//               <>
//                 <View style={styles.alertBox}>
//                 <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.closeButtonText}>x</Text>
//               </TouchableOpacity>
//                   <ImageBackground
//                     style={styles.imageContainer}
//                     source={require("../../images/planExpired.png")}
//                   />
//                   <Text style={styles.title}>
//                     Your trial period is expiring soon
//                   </Text>
//                   <Text style={styles.message}>
//                     Upgrade now to avoid any interruptions.
//                   </Text>
//                   <View style={styles.buttonsContainer}>
//                     <TouchableOpacity
//                       style={styles.button}
//                       onPress={handleCall}
//                     >
//                       <Text style={styles.buttonText}>+917987265628</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={styles.button}
//                       onPress={handleEmail}
//                     >
//                       <Text style={styles.buttonText}>
//                         contact@karomanage.com
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </>
//             ) : paymentDue ? (
//               <>
//                 <View style={styles.alertBoxx}>
//                   <Text style={styles.modalTitle}>
//                     Your invoice payment is due!
//                   </Text>
//                   <Text style={styles.modalText}>
//                     Please pay to continue further
//                   </Text>

//                   <View style={styles.paymentDetails}>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Due Date:</Text>
//                       <Text style={styles.detailLabel}>Pricing:</Text>
//                       <Text style={styles.detailLabel}>Action:</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailValue}>
//                         {formattedPlanExpiryDate}
//                       </Text>
//                       <Text style={styles.value}>{planPricing}</Text>
//                       <TouchableOpacity
//                         style={styles.payButton}
//                         onPress={handlePay}
//                       >
//                         <Text style={styles.payButtonText}>PAY</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               </>
//             ) : trialExpired ? (
//               <>
//                 <View style={styles.alertBoxx}>
//                   <ImageBackground
//                     style={styles.imageContainer}
//                     source={require("../../images/planExpired.png")}
//                   />
//                   <Text style={styles.title}>
//                     Your trial period has expired
//                   </Text>
//                   <Text style={styles.message}>
//                     To renew your plan, please get in touch with our team
//                   </Text>
//                   <View style={styles.buttonsContainer}>
//                     <TouchableOpacity
//                       style={styles.button}
//                       onPress={handleCall}
//                     >
//                       <Text style={styles.buttonText}>+917987265628</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={styles.button}
//                       onPress={handleEmail}
//                     >
//                       <Text style={styles.buttonText}>
//                         contact@karomanage.com
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </>
//             ) : trialExpiringSoon ? (
//               <>
//                 <View style={styles.alertBox}>
//                 <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.closeButtonText}>x</Text>
//               </TouchableOpacity>
//                   <ImageBackground
//                     style={styles.imageContainer}
//                     source={require("../../images/planExpired.png")}
//                   />
//                   <Text style={styles.title}>
//                     Your trial period is expiring soon
//                   </Text>
//                   <Text style={styles.message}>
//                     Upgrade now to avoid any interruptions.
//                   </Text>
//                   <View style={styles.buttonsContainer}>
//                     <TouchableOpacity
//                       style={styles.button}
//                       onPress={handleCall}
//                     >
//                       <Text style={styles.buttonText}>+917987265628</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={styles.button}
//                       onPress={handleEmail}
//                     >
//                       <Text style={styles.buttonText}>
//                         contact@karomanage.com
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </>
//             ) : (
//               <>
//                 <Text style={styles.modalTitle}>{modalMessage}</Text>
//               </>
//             )}
//           {/* </View> */}
//         </View>
//       </Modal>
//     </>
//   );
// };

// export default memo(OrganizationCard);

// const styles = StyleSheet.create({
//   root: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: COLORS.lighterBlue,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginBottom: 20,
//     shadowColor: "#000000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 2,
//     height: 54,
//   },

//   cardTitle: {
//     color: COLORS.black,
//     fontSize: 15,
//     textTransform: "capitalize",
//     marginTop: 0,
//     marginRight: 15,
//   },

 
//   modalOverlay: {
//     flex: 1,
  
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

 
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: COLORS.black,
//     marginBottom: 10,
//     textAlign: "center",
//   },

//   paymentDetails: {
//     width: "100%",
//   },

 
//   value: {
//     fontSize: 14,

//     color: COLORS.black,
//   },
//   payButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     borderRadius: 6,
//     alignItems: "center",
//     marginTop: 10,
//   },

//   modalText: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 20,
//     marginTop: 10,
//     textAlign: "center",
//   },
//   detailRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginVertical: 15,
//     alignItems: "center",
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: "#333",
//   },
//   detailValue: {
//     fontSize: 14,
//     color: "#333",
//   },
//   payButtonText: {
//     color: COLORS.white,
//     fontWeight: "bold",
//   },

//   closeButton: {
//     alignSelf: "flex-end",
//   paddingTop:'5%'
   
//   },
//   closeButtonText: {
//     color: COLORS.black,
//     fontSize: 25,
//     width: 40,
   
//   },
//   buttonsContainer: {
//     flexDirection: "row",

//     width: "90%",
//     height: "11%",
//   },
//   button: {
//     flex: 1,
//     marginHorizontal: 4,
//     padding: 10,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: COLORS.grey,
//     backgroundColor: COLORS.white,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#555",
//     fontWeight: "600",
//     fontSize: 9,
//   },

//   alertBox: {
//     width: "85%",
//     height:'35%',
//     backgroundColor: "white",
//     borderRadius: 12,
   
//     alignItems: "center",
//   },
//   alertBoxx: {
//     width: "85%",
//     height:'37%',
//     backgroundColor: "white",
//     borderRadius: 12,
//    justifyContent:'center',
//     alignItems: "center",
//   },
//   imageContainer: {
//     width: 140,
//     height: 100,
//     marginBottom: 15,
//   },

//   title: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#333",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   message: {
//     fontSize: 12,
//     color: "#555",
//     textAlign: "center",
//     marginBottom: 20,
//     width: "120%",
//   },
// });

import React, { FC, memo, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
  Text,
  Linking,
  ImageBackground,
} from "react-native";
import CheckBox from "../check-box/CheckBox";
import ScalableText from "../scalable-text/ScalableText";
import Flex from "../flex/Flex";
import { COLORS } from "../../colors";

type SubscriptionStatus =
  | "paidExpired"
  | "paymentDue"
  | "paidExpiringSoon"
  | "trialExpired"
  | "trialExpiringSoon"
  | null;

interface IOrganizationCard {
  data: {
    customerId: string;
    organizationId: string;
    organizationName: string;
    role: {};
    subscription: Array<{
      createdAt: number;
      trialEndsAt?: number;
      plan: string;
      planExpiryDate?: number;
      paymentStatus?: string;
      planPricing?: number;
      planType?: string;
    }>;
  };
  onClick?: (data: any) => void;
  checked?: boolean;
}

const OrganizationCard: FC<IOrganizationCard> = ({
  data,
  checked = false,
  onClick,
}) => {
  console.log("data", data);

  const [modalVisible, setModalVisible] = useState(false);

  const { organizationName, subscription = [] } = data;

  const now = Date.now();
  const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;

  const getEndTimestamp = (sub: {
    trialEndsAt?: number;
    planExpiryDate?: number;
  }) => sub.planExpiryDate ?? sub.trialEndsAt ?? 0;

  let referenceSubscription: IOrganizationCard["data"]["subscription"][number] | undefined;

  if (subscription.length > 0) {
    const activeSubs = subscription.filter((sub) => {
      const end = sub.planExpiryDate ?? sub.trialEndsAt;
      return !!end && end >= now;
    });

    if (activeSubs.length > 0) {
      referenceSubscription = activeSubs.reduce((latest, current) =>
        getEndTimestamp(current) > getEndTimestamp(latest) ? current : latest
      );
    } else {
      // fallback: use the one with the latest end date / createdAt
      referenceSubscription = subscription.reduce((latest, current) =>
        getEndTimestamp(current) > getEndTimestamp(latest) ? current : latest
      );
    }
  }

  let status: SubscriptionStatus = null;

  if (referenceSubscription) {
    const isPaid = !!referenceSubscription.planExpiryDate;
    const isTrial = !isPaid && !!referenceSubscription.trialEndsAt;
    const isInstallment = referenceSubscription.planType === "installment";

    const endDate = (isPaid
      ? referenceSubscription.planExpiryDate
      : referenceSubscription.trialEndsAt) as number | undefined;

    const expired = !!endDate && endDate < now;
    const expiringSoon =
      !!endDate && !expired && endDate - now <= fiveDaysInMs;
    const paymentDue =
      isPaid &&
      !isInstallment && // installment plans should not be treated as "plan due" blocking
      referenceSubscription.paymentStatus === "due" &&
      !!endDate &&
      endDate > now;

    if (paymentDue) {
      status = "paymentDue";
    } else if (isPaid && expired) {
      status = "paidExpired";
    } else if (isPaid && expiringSoon) {
      status = "paidExpiringSoon";
    } else if (isTrial && expired) {
      status = "trialExpired";
    } else if (isTrial && expiringSoon) {
      status = "trialExpiringSoon";
    }
  }

  const isBlocking = status === "paidExpired" || status === "paymentDue";

  const handleCall = () => {
    Linking.openURL("tel:+917987265628");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:contact@karomanage.com");
  };

  const handlePress = () => {
    if (status) {
      // Blocking cases: don't allow navigation until user handles payment/expiry
      if (isBlocking) {
        setModalVisible(true);
        return;
      }

      // Warning cases: show info, but still allow navigation
      setModalVisible(true);
      onClick?.(data);
      return;
    }

    onClick?.(data);
  };

  const handlePay = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.root]}
        activeOpacity={0.5}
        onPress={handlePress}
      >
        <CheckBox checked={checked} />
        <Flex justify="center" flex={1}>
          <ScalableText
            fontFamily="Regular"
            style={styles.cardTitle}
            numberOfLines={1}
          >
            {organizationName}
          </ScalableText>
        </Flex>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {status === "paidExpired" ? (
            <View style={styles.alertBox}>
              <Text style={styles.modalTitle}>Your paid plan has expired!</Text>
              <Text style={styles.modalText}>Please renew to continue.</Text>
              <View style={styles.paymentDetails}>
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={handlePay}
                >
                  <Text style={styles.payButtonText}>PAY</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : status === "paidExpiringSoon" ? (
            <View style={styles.alertBox}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>x</Text>
              </TouchableOpacity>
              <ImageBackground
                style={styles.imageContainer}
                source={require("../../images/planExpired.png")}
              />
              <Text style={styles.title}>Your paid plan is expiring soon</Text>
              <Text style={styles.message}>
                Renew now to avoid interruptions.
              </Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleCall}>
                  <Text style={styles.buttonText}>+917987265628</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleEmail}>
                  <Text style={styles.buttonText}>
                    contact@karomanage.com
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : status === "paymentDue" ? (
            <View style={styles.alertBox}>
              <Text style={styles.modalTitle}>Your invoice payment is due!</Text>
              <Text style={styles.modalText}>Please pay to continue.</Text>
              <View style={styles.paymentDetails}>
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={handlePay}
                >
                  <Text style={styles.payButtonText}>PAY</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : status === "trialExpired" ? (
            <View style={styles.alertBox}>
              <ImageBackground
                style={styles.imageContainer}
                source={require("../../images/planExpired.png")}
              />
              <Text style={styles.title}>Your trial plan has expired</Text>
              <Text style={styles.message}>
                To continue, please upgrade your plan.
              </Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleCall}>
                  <Text style={styles.buttonText}>+917987265628</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleEmail}>
                  <Text style={styles.buttonText}>
                    contact@karomanage.com
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : status === "trialExpiringSoon" ? (
            <View style={styles.alertBox}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>x</Text>
              </TouchableOpacity>
              <ImageBackground
                style={styles.imageContainer}
                source={require("../../images/planExpired.png")}
              />
              <Text style={styles.title}>Your trial plan is expiring soon</Text>
              <Text style={styles.message}>
                Upgrade now to avoid interruptions.
              </Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleCall}>
                  <Text style={styles.buttonText}>+917987265628</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleEmail}>
                  <Text style={styles.buttonText}>
                    contact@karomanage.com
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
    </>
  );
};

export default memo(OrganizationCard);

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.lighterBlue,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    height: 54,
  },
  cardTitle: {
    color: COLORS.black,
    fontSize: 15,
    textTransform: "capitalize",
    marginTop: 0,
    marginRight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 10,
    textAlign: "center",
  },
  paymentDetails: {
    width: "100%",
  },
  value: {
    fontSize: 14,
    color: COLORS.black,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  modalText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    marginTop: 10,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#333",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
  },
  payButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  closeButton: {
    alignSelf: "flex-end",
    paddingTop: '5%',
  },
  closeButtonText: {
    color: COLORS.black,
    fontSize: 25,
    width: 40,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "90%",
    height: "11%",
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  buttonText: {
    color: "#555",
    fontWeight: "600",
    fontSize: 9,
  },
  alertBox: {
    width: "85%",
    height: '35%',
    backgroundColor: "white",
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: "center",
  },
  imageContainer: {
    width: 140,
    height: 100,
    marginBottom: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    width: "120%",
  },
});

