// import { StyleSheet, TouchableOpacity, Modal } from "react-native";
// import React, { useMemo, useState } from "react";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import Flex from "../../../@ui/flex/Flex";
// import AppLogo from "../../../@ui/app-logo/AppLogo";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
// import { IMAGES } from "../../../images";

// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import { COLORS } from "../../../colors";
// import OrganizationCard from "../../../@ui/organization-card/OrganizationCard";

// import { useNavigation } from "@react-navigation/native";
// import { TOrganizationNavigator } from "../../../navigators/organization-navigator/OrganizationNavigator";
// import { handleSwitchOrganization } from "../../../utils/switchOrganization";
// import { useOrganizationsListQuery } from "../../../apis/hooks/organization/query/useOrganizationsList.query";
// import { useCustomerDetailsQuery } from "../../../apis/hooks/organization/query/useCustomerDetails.query";
// import EmptyOrganization from "../empty-orgnization";
// import { useAppDispatch } from "../../../app/hooks";
// import { logout } from "../../../app/reducer/auth/auth-reducer";
// import AppHeader from "../../../@ui/app-header/AppHeader";

// const SelectOrganization = () => {
//   const dispatch = useAppDispatch();
//   const { data, isLoading, refetch } = useOrganizationsListQuery();
//   const { data: customerDetails, isLoading: isCustomerDetailsLoading } = useCustomerDetailsQuery();
//   const navigation = useNavigation<TOrganizationNavigator>();
//   const [selected, setSelected] =
//     useState<
//       Pick<
//         TOrganizationName,
//         "customerId" | "organizationName" | "organizationId" | "role" | "lastUpdatedDate"
//       >
//     >();
//   const [visibleOrganizations, setVisibleOrganizations] = useState(2);
//   const [showCreateOrg, setShowCreateOrg] = useState(false);

//   const organizationNames: TOrganizationName[] = useMemo(() => {
//     // Use customerDetails API response if available, otherwise fallback to organizationsList
//     if (!isCustomerDetailsLoading && customerDetails?.data) {
//       return customerDetails.data.organizations?.organizationNames ?? [];
//     } else if (!isLoading && data?.data) {
//       return data.data.organizations?.organizationNames ?? [];
//     } else {
//       return [];
//     }
//   }, [isLoading, data, isCustomerDetailsLoading, customerDetails]);

//   if (organizationNames.length === 0) {
//     return <EmptyOrganization/>;
//   }
//   console.log("sadqdwqdfff", selected);

//   return (
//     <SafeView>
//         <ThemeScrollView loading={isLoading || isCustomerDetailsLoading} reloadData={refetch}>
//         <Flex justify="center" mt={70}>
//           <AppLogo size="small"/>
//         </Flex>
//         <Flex justify="center">
//           <AutoHeightImage source={IMAGES.organizationHero} width={353}/>
//         </Flex>

//         {organizationNames.slice(0, visibleOrganizations).map((organization) => (
//           <OrganizationCard
//             onClick={(e) =>
//               setSelected((previous) => {
//                 if (!previous) {
//                   return e;
//                 } else if (previous.organizationId === e.organizationId) {
//                   return undefined;
//                 } else {
//                   return e;
//                 }
//               })
//             }
//             key={organization.organizationId}
//             data={{
//               customerId: organization.customerId,
//               organizationId: organization.organizationId,
//               organizationName: organization.organizationName,
//               subscription: organization?.organizationSubscriptions || [],
//               role: organization?.role || []
//             }}
//             checked={selected?.organizationId === organization.organizationId}
//           />
//         ))}

//         {/* Load More Button */}
//         {organizationNames.length > visibleOrganizations && (
//           <TouchableOpacity
//             style={styles.loadMoreBtn}
//             onPress={() => setVisibleOrganizations(organizationNames.length)}
//           >
//             <ScalableText
//               fontFamily="SemiBold"
//               style={{
//                 ...styles.text,
//                 fontSize: 14,
//                 color: COLORS.primary,
//               }}
//             >
//               Load All Organizations
//             </ScalableText>
//           </TouchableOpacity>
//         )}

//         {/* Create Organization Button for Admin Users */}
//         {customerDetails?.data?.userType === 'admin' && (
//           <TouchableOpacity
//             style={styles.createOrgBtn}
//             onPress={() => setShowCreateOrg(true)}
//           >
//             <Flex justify="center" align="center">
//               <AutoHeightImage source={IMAGES["createIcon"]} width={20} />
//               <ScalableText
//                 fontFamily="SemiBold"
//                 style={{
//                   ...styles.text,
//                   fontSize: 14,
//                   color: COLORS.primary,
//                   marginLeft: 8,
//                 }}
//               >
//                 Create Organization
//               </ScalableText>
//             </Flex>
//           </TouchableOpacity>
//         )}
//       </ThemeScrollView>

//       {/* //updating */}
//       {/* Log out button in top-right corner */}
//       <TouchableOpacity
//         style={styles.logoutBtn}
//         onPress={() => {
//           customAlert.show({
//             message: "Are you sure you want to Logout?",
//             icon: "logoutPerson",
//             okCallBack: () => dispatch(logout()), // trigger logout
//             okTitle: "Yes",
//             cancelTitle: "No",
//           });
//         }}
//       >
//         <AutoHeightImage source={IMAGES["logOut"]} width={32} />
//       </TouchableOpacity>

//       <Flex justify="space-between" styles={styles.bottomSection}>
//         {organizationNames.length > 2 && (
//           <TouchableOpacity
//             style={styles.viewMoreBtn}
//             onPress={() => navigation.push("OrganizationLists")}
//           >
//             <Flex justify="flex-end">
//               <ScalableText
//                 fontFamily="SemiBold"
//                 style={{
//                   ...styles.text,
//                   fontSize: 14,
//                   marginRight: 5,
//                   marginTop: 2,
//                 }}
//               >
//                 {"View more"}
//               </ScalableText>
//               <AutoHeightImage source={IMAGES.chevronRightIcon} width={10}/>
//             </Flex>
//           </TouchableOpacity>
//         )}
//         <TouchableOpacity
//           style={[
//             styles.continueBtn,
//             !selected && styles.continueBtnDisabled
//           ]}
//           disabled={!selected}
//           onPress={async () => await handleSwitchOrganization(selected)}
//         >
//           <ScalableText
//             fontFamily="SemiBold"
//             style={{
//               ...styles.text,
//               fontSize: 16,
//               color: selected ? COLORS.primary : "#9A9A9A",
//             }}
//           >
//             {"Continue"}
//           </ScalableText>
//         </TouchableOpacity>
//       </Flex>

//       {/* Create Organization Modal */}
//       {showCreateOrg && (
//         <Modal
//           visible={showCreateOrg}
//           animationType="slide"
//           presentationStyle="pageSheet"
//         >
//           <SafeView>
//             <AppHeader
//               title="Create Organization"
//               showDrawer={false}
//               handleBackClick={() => setShowCreateOrg(false)}
//             />
//             <ThemeScrollView paddingHorizontal={16}>
//               <ScalableText fontFamily="SemiBold" style={{ fontSize: 18, marginBottom: 20 }}>
//                 Organization Creation Coming Soon!
//               </ScalableText>
//               <ScalableText fontFamily="Regular" style={{ fontSize: 14, color: COLORS.textSecondary }}>
//                 This feature will be available in the next update.
//               </ScalableText>
//             </ThemeScrollView>
//           </SafeView>
//         </Modal>
//       )}
//         </SafeView>
//   );
// };

// export default SelectOrganization;

// const styles = StyleSheet.create({
//   text: {
//     color: COLORS.primary,
//     fontSize: 18,
//   },
//   continueBtn: {
//     backgroundColor: COLORS.white,
//     paddingHorizontal: 35,
//     marginVertical: 25,

//   },
//   continueBtnDisabled: {
//     backgroundColor: "#F5F5F5",
//     elevation: 0,
//     shadowOpacity: 0,
//   },
//   viewMoreBtn: {
//     paddingHorizontal: 35,
//   },
//   bottomSection: {
//     marginTop: 20,
//     marginBottom: '15%',
//     paddingHorizontal: 20,
//   },
//   logoutBtn: {
//     position: "absolute",
//     top: '4%',
//     right: '5%',
//     padding: 10,
//     // backgroundColor: "rgba(0, 0, 0, 0.1)", // Optional, for a slight background
//     borderRadius: 20,
//   },
//   loadMoreBtn: {
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginVertical: 10,
//     alignItems: "center",
//   },
//   createOrgBtn: {
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginVertical: 10,
//     alignItems: "center",
//   },
// });

// import { StyleSheet, TouchableOpacity, Modal } from "react-native";
// import React, { useMemo, useState } from "react";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import Flex from "../../../@ui/flex/Flex";
// import AppLogo from "../../../@ui/app-logo/AppLogo";
// import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
// import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
// import { IMAGES } from "../../../images";

// import ScalableText from "../../../@ui/scalable-text/ScalableText";
// import { COLORS } from "../../../colors";
// import OrganizationCard from "../../../@ui/organization-card/OrganizationCard";

// import { useNavigation } from "@react-navigation/native";
// import { TOrganizationNavigator } from "../../../navigators/organization-navigator/OrganizationNavigator";
// import { handleSwitchOrganization } from "../../../utils/switchOrganization";
// import { useOrganizationsListQuery } from "../../../apis/hooks/organization/query/useOrganizationsList.query";
// import { useCustomerDetailsQuery } from "../../../apis/hooks/organization/query/useCustomerDetails.query";
// import EmptyOrganization from "../empty-orgnization";
// import { useAppDispatch } from "../../../app/hooks";
// import { logout } from "../../../app/reducer/auth/auth-reducer";
// import AppHeader from "../../../@ui/app-header/AppHeader";

// const SelectOrganization = () => {
//   const dispatch = useAppDispatch();
//   const { data, isLoading, refetch } = useOrganizationsListQuery();
//   const { data: customerDetails, isLoading: isCustomerDetailsLoading } = useCustomerDetailsQuery();
//   const navigation = useNavigation<TOrganizationNavigator>();
//   const [selected, setSelected] =
//     useState<
//       Pick<
//         TOrganizationName,
//         "customerId" | "organizationName" | "organizationId" | "role" | "lastUpdatedDate"
//       >
//     >();
//   const [visibleOrganizations, setVisibleOrganizations] = useState(2);
//   const [showCreateOrg, setShowCreateOrg] = useState(false);

//   const organizationNames: TOrganizationName[] = useMemo(() => {
//     // Use customerDetails API response if available, otherwise fallback to organizationsList
//     if (!isCustomerDetailsLoading && customerDetails?.data) {
//       return customerDetails.data.organizations?.organizationNames ?? [];
//     } else if (!isLoading && data?.data) {
//       return data.data.organizations?.organizationNames ?? [];
//     } else {
//       return [];
//     }
//   }, [isLoading, data, isCustomerDetailsLoading, customerDetails]);

//   if (organizationNames.length === 0) {
//     return <EmptyOrganization/>;
//   }
//   console.log("sadqdwqdfff", selected);

//   return (
//     <SafeView>
//         <ThemeScrollView loading={isLoading || isCustomerDetailsLoading} reloadData={refetch}>
//         <Flex justify="center" mt={70}>
//           <AppLogo size="small"/>
//         </Flex>
//         <Flex justify="center">
//           <AutoHeightImage source={IMAGES.organizationHero} width={353}/>
//         </Flex>

//         {organizationNames.slice(0, visibleOrganizations).map((organization) => (
//           <OrganizationCard
//             onClick={(e) =>
//               setSelected((previous) => {
//                 if (!previous) {
//                   return e;
//                 } else if (previous.organizationId === e.organizationId) {
//                   return undefined;
//                 } else {
//                   return e;
//                 }
//               })
//             }
//             key={organization.organizationId}
//             data={{
//               customerId: organization.customerId,
//               organizationId: organization.organizationId,
//               organizationName: organization.organizationName,
//               subscription: organization?.organizationSubscriptions || [],
//               role: organization?.role || []
//             }}
//             checked={selected?.organizationId === organization.organizationId}
//           />
//         ))}

//         {/* Load More Button */}
//         {organizationNames.length > visibleOrganizations && (
//           <TouchableOpacity
//             style={styles.loadMoreBtn}
//             onPress={() => setVisibleOrganizations(organizationNames.length)}
//           >
//             <ScalableText
//               fontFamily="SemiBold"
//               style={{
//                 ...styles.text,
//                 fontSize: 14,
//                 color: COLORS.primary,
//               }}
//             >
//               Load All Organizations
//             </ScalableText>
//           </TouchableOpacity>
//         )}

//         {/* Create Organization Button for Admin Users */}
//         {customerDetails?.data?.userType === 'admin' && (
//           <TouchableOpacity
//             style={styles.createOrgBtn}
//             onPress={() => setShowCreateOrg(true)}
//           >
//             <Flex justify="center" align="center">
//               <AutoHeightImage source={IMAGES["createIcon"]} width={20} />
//               <ScalableText
//                 fontFamily="SemiBold"
//                 style={{
//                   ...styles.text,
//                   fontSize: 14,
//                   color: COLORS.primary,
//                   marginLeft: 8,
//                 }}
//               >
//                 Create Organization
//               </ScalableText>
//             </Flex>
//           </TouchableOpacity>
//         )}
//       </ThemeScrollView>

//       {/* //updating */}
//       {/* Log out button in top-right corner */}
//       <TouchableOpacity
//         style={styles.logoutBtn}
//         onPress={() => {
//           customAlert.show({
//             message: "Are you sure you want to Logout?",
//             icon: "logoutPerson",
//             okCallBack: () => dispatch(logout()), // trigger logout
//             okTitle: "Yes",
//             cancelTitle: "No",
//           });
//         }}
//       >
//         <AutoHeightImage source={IMAGES["logOut"]} width={32} />
//       </TouchableOpacity>

//       <Flex justify="space-between" styles={styles.bottomSection}>
//         {organizationNames.length > 2 && (
//           <TouchableOpacity
//             style={styles.viewMoreBtn}
//             onPress={() => navigation.push("OrganizationLists")}
//           >
//             <Flex justify="flex-end">
//               <ScalableText
//                 fontFamily="SemiBold"
//                 style={{
//                   ...styles.text,
//                   fontSize: 14,
//                   marginRight: 5,
//                   marginTop: 2,
//                 }}
//               >
//                 {"View more"}
//               </ScalableText>
//               <AutoHeightImage source={IMAGES.chevronRightIcon} width={10}/>
//             </Flex>
//           </TouchableOpacity>
//         )}
//         <TouchableOpacity
//           style={[
//             styles.continueBtn,
//             !selected && styles.continueBtnDisabled
//           ]}
//           disabled={!selected}
//           onPress={async () => await handleSwitchOrganization(selected)}
//         >
//           <ScalableText
//             fontFamily="SemiBold"
//             style={{
//               ...styles.text,
//               fontSize: 16,
//               color: selected ? COLORS.primary : "#9A9A9A",
//             }}
//           >
//             {"Continue"}
//           </ScalableText>
//         </TouchableOpacity>
//       </Flex>

//       {/* Create Organization Modal */}
//       {showCreateOrg && (
//         <Modal
//           visible={showCreateOrg}
//           animationType="slide"
//           presentationStyle="pageSheet"
//         >
//           <SafeView>
//             <AppHeader
//               title="Create Organization"
//               showDrawer={false}
//               handleBackClick={() => setShowCreateOrg(false)}
//             />
//             <ThemeScrollView paddingHorizontal={16}>
//               <ScalableText fontFamily="SemiBold" style={{ fontSize: 18, marginBottom: 20 }}>
//                 Organization Creation Coming Soon!
//               </ScalableText>
//               <ScalableText fontFamily="Regular" style={{ fontSize: 14, color: COLORS.textSecondary }}>
//                 This feature will be available in the next update.
//               </ScalableText>
//             </ThemeScrollView>
//           </SafeView>
//         </Modal>
//       )}
//         </SafeView>
//   );
// };

// export default SelectOrganization;

// const styles = StyleSheet.create({
//   text: {
//     color: COLORS.primary,
//     fontSize: 18,
//   },
//   continueBtn: {
//     backgroundColor: COLORS.white,
//     paddingHorizontal: 35,
//     marginVertical: 25,

//   },
//   continueBtnDisabled: {
//     backgroundColor: "#F5F5F5",
//     elevation: 0,
//     shadowOpacity: 0,
//   },
//   viewMoreBtn: {
//     paddingHorizontal: 35,
//   },
//   bottomSection: {
//     marginTop: 20,
//     marginBottom: '15%',
//     paddingHorizontal: 20,
//   },
//   logoutBtn: {
//     position: "absolute",
//     top: '4%',
//     right: '5%',
//     padding: 10,
//     // backgroundColor: "rgba(0, 0, 0, 0.1)", // Optional, for a slight background
//     borderRadius: 20,
//   },
//   loadMoreBtn: {
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginVertical: 10,
//     alignItems: "center",
//   },
//   createOrgBtn: {
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginVertical: 10,
//     alignItems: "center",
//   },
// });

import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import Flex from "../../../@ui/flex/Flex";
import AppLogo from "../../../@ui/app-logo/AppLogo";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import OrganizationCard from "../../../@ui/organization-card/OrganizationCard";
import { useNavigation } from "@react-navigation/native";
import { TOrganizationNavigator } from "../../../navigators/organization-navigator/OrganizationNavigator";
import { handleSwitchOrganization } from "../../../utils/switchOrganization";
import { useOrganizationsListQuery } from "../../../apis/hooks/organization/query/useOrganizationsList.query";
import { useCustomerDetailsQuery } from "../../../apis/hooks/organization/query/useCustomerDetails.query";
import EmptyOrganization from "../empty-orgnization";
import { useAppDispatch } from "../../../app/hooks";
import { logout } from "../../../app/reducer/auth/auth-reducer";

const SelectOrganization = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<TOrganizationNavigator>();

  const { data, isLoading, refetch } = useOrganizationsListQuery();
  const { data: customerDetails, isLoading: isCustomerDetailsLoading } =
    useCustomerDetailsQuery();

  const [selected, setSelected] =
    useState<
      Pick<
        TOrganizationName,
        "customerId" | "organizationName" | "organizationId" | "role" | "lastUpdatedDate"
      >
    >();

  const [visibleOrganizations, setVisibleOrganizations] = useState(2);

  const organizationNames: TOrganizationName[] = useMemo(() => {
    if (!isCustomerDetailsLoading && customerDetails?.data) {
      return customerDetails.data.organizations?.organizationNames ?? [];
    } else if (!isLoading && data?.data) {
      return data.data.organizations?.organizationNames ?? [];
    }
    return [];
  }, [isLoading, data, isCustomerDetailsLoading, customerDetails]);

  if (organizationNames.length === 0) {
    return <EmptyOrganization />;
  }

  return (
    <SafeView>
      <ThemeScrollView loading={isLoading || isCustomerDetailsLoading} reloadData={refetch}>
        <Flex justify="center" mt={70}>
          <AppLogo size="small" />
        </Flex>

        <Flex justify="center">
          <AutoHeightImage source={IMAGES.organizationHero} width={353} />
        </Flex>

        {organizationNames.slice(0, visibleOrganizations).map((organization) => (
          <OrganizationCard
            key={`${organization.customerId}-${organization.organizationId}`}
            onClick={(e) =>
              setSelected((prev) =>
                prev?.organizationId === e.organizationId ? undefined : e
              )
            }
            data={{
              customerId: organization.customerId,
              organizationId: organization.organizationId,
              organizationName: organization.organizationName,
              subscription: organization?.organizationSubscriptions || [],
              role: organization?.role || [],
            }}
            checked={selected?.organizationId === organization.organizationId}
          />
        ))}

        {organizationNames.length > visibleOrganizations && (
          <TouchableOpacity
            style={styles.loadMoreBtn}
            onPress={() => setVisibleOrganizations(organizationNames.length)}
          >
            <ScalableText fontFamily="SemiBold" style={styles.loadMoreText}>
              Load All Organizations
            </ScalableText>
          </TouchableOpacity>
        )}

        {customerDetails?.data?.userType === "admin" && (
          <TouchableOpacity
            style={styles.createOrgBtn}
            onPress={() => navigation.navigate("CreateOrganization")}
          >
            <Flex justify="center" align="center">
              <AutoHeightImage source={IMAGES.createIcon} width={20} />
              <ScalableText fontFamily="SemiBold" style={styles.createOrgText}>
                Create Organization
              </ScalableText>
            </Flex>
          </TouchableOpacity>
        )}
      </ThemeScrollView>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() =>
          customAlert.show({
            message: "Are you sure you want to Logout?",
            icon: "logoutPerson",
            okCallBack: () => dispatch(logout()),
            okTitle: "Yes",
            cancelTitle: "No",
          })
        }
      >
        <AutoHeightImage source={IMAGES.logOut} width={32} />
      </TouchableOpacity>

      <Flex justify="space-between" styles={styles.bottomSection}>
        {organizationNames.length > 2 && (
          <TouchableOpacity
            style={styles.viewMoreBtn}
            onPress={() => navigation.push("OrganizationLists")}
          >
            <Flex justify="flex-end">
              <ScalableText fontFamily="SemiBold" style={styles.viewMoreText}>
                View more
              </ScalableText>
              <AutoHeightImage source={IMAGES.chevronRightIcon} width={10} />
            </Flex>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.continueBtn, !selected && styles.continueBtnDisabled]}
          disabled={!selected}
          onPress={async () => await handleSwitchOrganization(selected)}
        >
          <ScalableText
            fontFamily="SemiBold"
            style={[
              styles.continueText,
              { color: selected ? COLORS.primary : "#9A9A9A" },
            ]}
          >
            Continue
          </ScalableText>
        </TouchableOpacity>
      </Flex>
    </SafeView>
  );
};

export default SelectOrganization;

const styles = StyleSheet.create({
  loadMoreBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 10,
    alignItems: "center",
  },
  loadMoreText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  createOrgBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 10,
    alignItems: "center",
  },
  createOrgText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 8,
  },
  logoutBtn: {
    position: "absolute",
    top: "4%",
    right: "5%",
    padding: 10,
    borderRadius: 20,
  },
  bottomSection: {
    marginTop: 20,
    marginBottom: "15%",
    paddingHorizontal: 20,
  },
  viewMoreBtn: {
    paddingHorizontal: 35,
  },
  viewMoreText: {
    fontSize: 14,
    marginRight: 5,
    marginTop: 2,
  },
  continueBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 35,
    marginVertical: 25,
  },
  continueBtnDisabled: {
    backgroundColor: "#F5F5F5",
  },
  continueText: {
    fontSize: 16,
  },
});
