import React, { useEffect } from "react";
import SafeView from "./@ui/safe-view/SafeView";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigators/app-navigator/AppNavigator";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalAlert from "./@ui/alert/GlobalAlert";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import messaging from "@react-native-firebase/messaging"; // Firebase messaging
import { Alert, StatusBar } from "react-native";
import { createNavigationContainerRef } from "@react-navigation/native";
export const navigationRef = createNavigationContainerRef();

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Request notification permissions
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("Notification permissions granted!");
        getFCMToken(); // Get FCM Token after permission is granted
      } else {
        Alert.alert(
          "Permission Required",
          "Please enable notifications to receive alerts."
        );
      }
    };

    requestPermission();

    // Foreground notification handling
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground notification received:", remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || "Notification",
        remoteMessage.notification?.body || "You have a new message."
      );
    });

    // Background notification handling
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification opened from background:", remoteMessage);
      handleNotificationNavigation(remoteMessage);
    });

    // Terminated notification handling (when the app is closed)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("Notification caused app to open:", remoteMessage);
          handleNotificationNavigation(remoteMessage);
        }
      });

    return unsubscribeForeground; // Cleanup foreground listener
  }, []);

  // Function to get FCM Registration Token
  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log("FCM Registration Token:", token);
      // Store the token on your backend to send push notifications to this device
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  };

  // Function to handle navigation based on notification payload
  const handleNotificationNavigation = (remoteMessage) => {
    const { params } = remoteMessage.data || {};
  
    if (params) {
      navigationRef.current?.navigate("AttendanceStack", JSON.parse(params));
    } else {
      navigationRef.current?.navigate("AttendanceStack"); // Navigate without params if none are provided
    }
  };
  
  

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      <GestureHandlerRootView>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <GlobalAlert>
              <SafeView>
                <NavigationContainer ref={navigationRef}>
                  <AppNavigator />
                </NavigationContainer>
              </SafeView>
            </GlobalAlert>
          </QueryClientProvider>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;



// import React from "react";
// import SafeView from "./@ui/safe-view/SafeView";
// import { NavigationContainer } from "@react-navigation/native";
// import AppNavigator from "./navigators/app-navigator/AppNavigator";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import GlobalAlert from "./@ui/alert/GlobalAlert";
// import { Provider } from "react-redux";
// import { store } from "./app/store";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// const queryClient = new QueryClient();

// const App = () => {
//   return (
//     <GestureHandlerRootView>
//       <Provider store={store}>
//         <QueryClientProvider client={queryClient}>
//           <GlobalAlert>
//             <SafeView>
//               <NavigationContainer>
//                 <AppNavigator />
//               </NavigationContainer>
//             </SafeView>
//           </GlobalAlert>
//         </QueryClientProvider>
//       </Provider>
//     </GestureHandlerRootView>
//   );
// };

// export default App;

