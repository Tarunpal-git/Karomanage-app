import { COLORS } from "../colors";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return COLORS.textSuccess;
    case "inActive":
    case "inactive":
      return COLORS.textError;

    default:
      return COLORS.black;
  }
};
