import React, { useMemo, useState } from "react";
import CustomAlertModel from "./CustomAlertModel";

const defaultValues: GlobalAlertOb = {
  show: () => {},
};

export const CustomAlertContext =
  React.createContext<GlobalAlertOb>(defaultValues);
export const CustomAlertConsumer = CustomAlertContext.Consumer;

type TAlertProps = {
  readonly children?: React.ReactNode;
};

const initials: AlertMessage = {
  title: "",
  message: "",
};

function GlobalAlert(props: TAlertProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertProps, setAlertProps] = useState<AlertMessage>(initials);

  const alert: GlobalAlertOb = useMemo(
    () => ({
      show: (alertData: AlertMessage) => {
        setAlertProps(alertData);
        setShowAlert(true);
      },
    }),
    []
  );
  customAlert = alert;

  return (
    <CustomAlertContext.Provider value={alert}>
      {props.children}
      {showAlert && (
        <CustomAlertModel
          alertData={alertProps}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
        />
      )}
    </CustomAlertContext.Provider>
  );
}

export default GlobalAlert;
