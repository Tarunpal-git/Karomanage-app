import { TextStyle, ViewStyle } from "react-native";

type TTableColumns<T> = {
  field: any;
  label: string;
  key: string;
  renderCell?: (value: T) => React.ReactNode;
  minWidth: number;
  clickable?: boolean;
  handleColumnClick?: boolean;
  headerCellStyle?: ViewStyle;
  dataCellStyle?: ViewStyle;
  hidden?: boolean;
  renderHeader?: (value: T) => React.ReactNode;
  headerTextStyles?: TextStyle;
};
