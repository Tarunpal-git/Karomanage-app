import React, { FC, memo } from "react";
import ActionIcon from "../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import { useSendMailSalaryMutation } from "../../../../apis/hooks/employee/mutation/useSendMailSalary.mutation";
import { ToastAndroid } from "react-native";

import { getSalaryMailDetails } from "../utils/getSalaryMailData";

interface ISendInvoiceButton {
  employeeDetails: TEmployeeData;
  salaryDetails: TSalaryRecord;
}

const SendInvoiceButton: FC<ISendInvoiceButton> = ({
  employeeDetails,
  salaryDetails,
}) => {
  const { isPending, mutateAsync } = useSendMailSalaryMutation();

  const handleSendMail = async () => {
    const data = getSalaryMailDetails(salaryDetails, employeeDetails);

    const res = await mutateAsync({ employeeSalary: data });
    if (res) {
      ToastAndroid.show(
        "The salary slip has been sent successfully via email",
        ToastAndroid.SHORT
      );
    } else {
      ToastAndroid.show(
        "Something went wrong. email not sended",
        ToastAndroid.SHORT
      );
    }
  };
  return (
    <ActionIcon
      onPress={handleSendMail}
      loading={isPending}
      disabled={isPending}
      styles={{ paddingVertical: 10 }}
    >
      <AutoHeightImage source={IMAGES.mailIconGray} width={16} />
    </ActionIcon>
  );
};

export default memo(SendInvoiceButton);
