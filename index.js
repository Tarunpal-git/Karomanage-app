/**
 * @format
 */
import { AppRegistry } from "react-native";
import 'whatwg-fetch';
import { name as appName } from "./app.json";
import App from "./src/App";
import "react-native-gesture-handler";

AppRegistry.registerComponent(appName, () => App);
