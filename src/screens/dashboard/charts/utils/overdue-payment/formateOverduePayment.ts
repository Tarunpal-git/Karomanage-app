import moment from "moment";

interface IOverduePaymentStudents {
  paymentForecast: IStudentPaymentForecast[];
}

interface IStudentPaymentForecast {
  Details: {
    duePayment: string;
    nextpaymentDate: string;
  };
}

interface IGraphData {
  value: number;
  month: string;
}

interface FormattedOverduePayments {
  totalPayment: number;
  graphData: IGraphData[];
  maxValue: number;
  yearTotal: number;
}

export const formatOverduePaymentsGraphData = (
  data: IOverduePaymentStudents[],
  year?: number
): FormattedOverduePayments => {
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

  let totalPayment = 0;
  let yearTotal = 0;
  let maxValue = 0;
  const currentYear = year || moment().year();
  data.forEach((student) => {
    student.paymentForecast.forEach((forecast) => {
      const { duePayment, nextpaymentDate } = forecast.Details;
      const paymentAmount = parseFloat(duePayment);
      const paymentDate = moment(nextpaymentDate, "DD-MM-YYYY");
      totalPayment += paymentAmount;
      
      console.log(`API OVERDUE: Due Date: ${nextpaymentDate}, Amount: ${paymentAmount}, Is Past Due: ${paymentDate.isBefore(moment())}`);

      if (paymentDate.year() === currentYear) {
        const month = paymentDate.format("MMM");
        if (!isNaN(paymentAmount)) {
          monthlyPayments[month] += paymentAmount;
          yearTotal += paymentAmount;
        }
      }
    });
  });

  maxValue = Math.max(...Object.values(monthlyPayments), 0);
  maxValue = Math.ceil(maxValue / 100) * 100;

  const graphData: IGraphData[] = Object.keys(monthlyPayments).map((month) => ({
    value: monthlyPayments[month],
    month,
  }));

  return {
    totalPayment,
    graphData,
    maxValue,
    yearTotal,
  };
};
