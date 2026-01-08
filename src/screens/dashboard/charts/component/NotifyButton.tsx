import { StyleSheet, ToastAndroid, TouchableOpacity } from "react-native";
import React, { FC, memo, useMemo, useState } from "react";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../colors";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import {
  TNotifyUpcomingFeeNotificationData,
  useNotifyUpcomingFeeMutation,
} from "../../../../apis/hooks/dashboard/mutation/useNotifyUpcomingFee.mutation";
import { useAppSelector } from "../../../../app/hooks";

interface INotifyButton {
  forecastPayments: TPaymentForecast[];
}

const NotifyButton: FC<INotifyButton> = ({ forecastPayments }) => {
  const [isSent, setIsSent] = useState(false);
  const organization = useAppSelector(
    (state) => state.organization.organization
  );
  const authUser = useAppSelector((state) => state.auth.authUser);
  const { isPending, mutateAsync } = useNotifyUpcomingFeeMutation();

  const formattedData: TNotifyUpcomingFeeNotificationData[] = useMemo(() => {
    return forecastPayments.map((student) => ({
      accountId: "",
      courseName: student.studentCourse,
      customerId: `${authUser?.customerId}`,
      installmentsArray: student.paymentForecast.map((payment) => ({
        overDueDate: payment.Details.nextpaymentDate,
        courseId: payment.Details.courseId,
        overDueAmount: payment.Details.duePayment,
        index: payment.Details.installmentId,
      })),
      organizationEmail: organization.organizationEmail,
      organizationId: organization.organizationId,
      organizationLogo: organization.organizationLogo,
      organizationName: organization.organizationName,
      organizationPhoneNumber: organization.organizationPhoneNumber,
      studentEmail: student.studentEmail,
      studentId: student.rollNo,
      studentName: `${student.studentFirstName} ${student?.studentLastName}`,
    }));
  }, [forecastPayments]);

  const handleNotifyClick = async () => {
    await Promise.all(
      formattedData.map(async (data) => {
        // Call mutateAsync for each item in formatedData
        return await mutateAsync(data);
      })
    );

    setIsSent(true);

    ToastAndroid.show("Mail sent Successfully!", ToastAndroid.SHORT);
  };

  return (
    <TouchableOpacity
      onPress={handleNotifyClick}
      style={{
        ...styles.notifyBtn,
        backgroundColor: isSent ? "#00000050" : "#696CFF",
      }}
      disabled={isPending || isSent}
    >
      <ScalableText
        fontFamily="Medium"
        style={{
          color: COLORS.white,
          fontSize: 8,
          marginTop: 2,
          marginRight: 6,
        }}
      >
        NOTIFY
      </ScalableText>
      <AutoHeightImage source={IMAGES.mailIconWhite} width={10} />
    </TouchableOpacity>
  );
};

export default memo(NotifyButton);

const styles = StyleSheet.create({
  notifyBtn: {
    backgroundColor: "#696CFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 3,
  },
});
