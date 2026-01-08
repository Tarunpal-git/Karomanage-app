type TStatus = "info" | "success" | "error";

export const getStatusChipPallet = (status: TStatus) => {
  switch (status) {
    case "info":
      return {
        background: "#DEF0FF",
        textColor: "#00467E",
      };
    case "error":
      return {
        background: "#FFE7E7",
        textColor: "#FF7878",
      };
    case "success":
      return {
        background: "#D9FFE1",
        textColor: "#0DA800",
      };

    default:
      return {
        background: "#fff",
        textColor: "#000",
      };
  }
};
