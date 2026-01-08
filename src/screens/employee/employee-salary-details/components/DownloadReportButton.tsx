import React, { FC, memo } from "react";
import ActionIcon from "../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import { useDownloadSalarySlipMutation } from "../../../../apis/hooks/employee/mutation/useDownloadSalarySlip.mutation";
import RNFS from "react-native-fs";
import { ToastAndroid } from "react-native";

import FileViewer from "react-native-file-viewer";
import { COLORS } from "../../../../colors";
interface IDownloadReportButton {
  employee: {
    employeId: string;
    month: string;
    salaryId: string;
    year: string;
  };
}

const DownloadReportButton: FC<IDownloadReportButton> = ({ employee }) => {
  const { isPending, mutateAsync } = useDownloadSalarySlipMutation();

  const handleDownloadReport = async () => {
    const res = await mutateAsync({ employee });

    if (res.statusCode === 200) {
      const filePath = `${RNFS.DocumentDirectoryPath}/report_${employee.month}_${employee.year}.pdf`;

      await RNFS.writeFile(filePath, res.data, "base64");
      ToastAndroid.show("Report downloaded in the device", ToastAndroid.SHORT);

      FileViewer.open(filePath)
        .then(() => {
          // success
        })
        .catch((error) => {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
        });
    } else {
      customAlert.show({
        message:
          "To download the salary slip, please ensure that you have sent the invoice first",
      });
    }
  };

  return (
    <ActionIcon
      loaderColor={COLORS.primary}
      onPress={handleDownloadReport}
      loading={isPending}
      disabled={isPending}
      styles={{ paddingVertical: 10 }}
    >
      <AutoHeightImage source={IMAGES.downloadIconGray} width={16} />
    </ActionIcon>
  );
};

export default memo(DownloadReportButton);
