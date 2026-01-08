import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../app/store";
import {
  login,
  logout,
  setOrganization,
} from "../app/reducer/auth/auth-reducer";

export const checkAuthentication = () => {
  AsyncStorage.getItem("authUser")
    .then((authUser) => {
      const payload = JSON.parse(authUser ?? "");
      AsyncStorage.getItem("organization").then((organization) => {
        if (organization) {
          store.dispatch(login(payload));
          store.dispatch(setOrganization(JSON.parse(organization ?? "")));
        } else {
          store.dispatch(login(payload));
        }
      });
    })
    .catch((error) => {
      store.dispatch(logout());
    });
};
