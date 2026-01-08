type GlobalAlertOb = {
  show: (alertMessage: AlertMessage) => void;
};
type AlertMessage = {
  title?: string;
  message: string;
  okTitle?: string;
  cancelTitle?: string;
  okCallBack?: () => void;
  cancelCallback?: () => void;
  disabled?: boolean;
  showButtons?: boolean;
  preventClose?: boolean;
  loading?: boolean;
  icon?: string;
};

type AlertModalProps = {
  alertData: AlertMessage;
  showAlert: boolean;
  setShowAlert: (data: boolean) => void;
};

declare let customAlert: GlobalAlertOb;
