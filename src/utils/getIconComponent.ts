import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome5Pro from "react-native-vector-icons/FontAwesome5Pro";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome6Pro from "react-native-vector-icons/FontAwesome6Pro";
import Fontisto from "react-native-vector-icons/Fontisto";
import Foundation from "react-native-vector-icons/Foundation";
import { IconProps } from "react-native-vector-icons/Icon";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Zocial from "react-native-vector-icons/Zocial";

type IconSet = {
  [key: string]: React.ComponentType<IconProps>;
};

const iconSets: IconSet = {
  Feather,
  FontAwesome,
  Entypo,
  AntDesign,
  EvilIcons,
  FontAwesome5,
  FontAwesome5Pro,
  FontAwesome6,
  FontAwesome6Pro,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};

export const getIconComponent = (
  iconSetName: string
): React.ComponentType<IconProps> => {
  return iconSets[iconSetName] || Feather; // Default to Feather if not found
};
