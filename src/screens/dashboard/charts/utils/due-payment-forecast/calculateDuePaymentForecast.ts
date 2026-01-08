export const calculateDuePaymentForecast = (data: TPaymentForecast[]) => {
  let totalDueAmount = 0;

  data.forEach((student) => {
    student.paymentForecast.forEach((forecast) => {
      const { duePayment } = forecast.Details;
      totalDueAmount += duePayment;
    });
  });

  return totalDueAmount;
};
