import moment from "moment";

interface IPaymentForecastData {
  studentFirstName: string;
  studentLastName: string;
  rollNo: string;
  studentCourse: string;
  duePayment: string;
  nextpaymentDate: string;
}

interface IGraphData {
  label: number | string; // Day of the month or month name
  value: number; // Amount for that day or month
}

export const formateUpcomingPaymentForecast = (
  data: IPaymentForecastData[],
  year?: number,
  month?: number
) => {
  const monthlyPayments: { [key: string]: number } = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  const dailyPayments: { [key: number]: number } = {};

  let totalPayment = 0;
  let yearTotal = 0;
  let monthlyTotal = 0;
  let maxValue = 0;

  const currentYear = year || moment().year();
  const currentMonth = month ? month : moment().month() + 1;

  const daysInMonth = moment(
    `${currentYear}-${currentMonth}`,
    "YYYY-MM"
  ).daysInMonth();
  for (let day = 1; day <= daysInMonth; day++) {
    dailyPayments[day] = 0;
  }

  data.forEach((student) => {
    const { duePayment, nextpaymentDate } = student;
    const paymentAmount = parseFloat(duePayment.toString());
    const paymentDate = moment(nextpaymentDate, "DD-MM-YYYY");

    if (!isNaN(paymentAmount)) {
      totalPayment += paymentAmount;

      if (paymentDate.year() === currentYear) {
        yearTotal += paymentAmount;

        if (month && paymentDate.month() + 1 === currentMonth) {
          monthlyTotal += paymentAmount;
          const day = paymentDate.date();
          dailyPayments[day] += paymentAmount;
        } else if (!month) {
          const monthName = paymentDate.format("MMM");
          monthlyPayments[monthName] += paymentAmount;
        }
      }
    }
  });

  const graphData: IGraphData[] = month
    ? Object.keys(dailyPayments).map((day) => ({
        label: parseInt(day, 10),
        value: dailyPayments[parseInt(day, 10)],
      }))
    : Object.keys(monthlyPayments).map((monthName) => ({
        label: monthName,
        value: monthlyPayments[monthName],
      }));

  maxValue = Math.max(
    ...Object.values(dailyPayments),
    ...Object.values(monthlyPayments)
  );
  maxValue = Math.ceil(maxValue / 100) * 100;

  return {
    totalPayment,
    yearTotal,
    monthlyTotal,
    graphData,
    maxValue,
  };
};
