import { Linking, Platform } from "react-native";
import React, { useEffect } from "react";
import { WebViewNavigationEvent } from "react-native-webview/lib/WebViewTypes";
import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { TAuthNavigator } from "../../../navigators/auth-navigator/AuthNavigator";
import Config from "react-native-config";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";

const MsalAuthWebView = () => {
  const navigation = useNavigation<TAuthNavigator>();
  useEffect(() => {
    Linking.addEventListener("url", (url) => {
      const id_token = url.url.split("#id_token=")[1];

      if (id_token) {
        navigation.navigate("SignUpScreen", {
          authenticated: true,
          id_token: id_token,
        });
      }
    });
  }, []);

  const onLoadComplete = async (event: WebViewNavigationEvent) => {
    const url = event.nativeEvent.url;

    const id_token = url.split("#id_token=")[1];

    if (id_token !== undefined) {
      navigation.navigate("SignUpScreen", {
        authenticated: true,
        id_token: id_token,
      });
    }
  };

  if (Platform.OS === "android") {
    return (
      <ThemeScrollView>
      <WebView
        source={{
          uri: `${Config.REACT_APP_MSAL_URL}`,
        }}
        style={{ flex: 1 }}
        onLoad={onLoadComplete}
      />
      </ThemeScrollView>
    );
  } else {
    return (
      <ThemeScrollView>
      <WebView
        source={{
          uri: `${Config.REACT_APP_MSAL_URL}`,
        }}
        style={{ flex: 1 }}
      />
      </ThemeScrollView>
    );
  }
};

export default MsalAuthWebView;
