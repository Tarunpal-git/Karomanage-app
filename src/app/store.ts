import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducer/auth/auth-reducer";
import organizationSlice from "./reducer/organization/organization-reducer";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    organization: organizationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
