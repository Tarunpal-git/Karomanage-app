import moment from "moment";

interface PaymentReceivedData {
  paymentReceiveDate: string;
  formatedPaymentReceiveDate: string;
  receivedPayment: string;
}

interface GraphData {
  value: number;
  month: string;
}

interface FormattedPaymentData {
  totalReceived: number;
  graphData: GraphData[];
  maxValue: number;
  yearTotal: number;
}

export const formateReceivedGraphData = (
  data: PaymentReceivedData[],
  year?: number
): FormattedPaymentData => {
  const monthlyExpenses: { [key: string]: number } = {
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

  let totalReceived = 0;
  let yearTotal = 0;

  let maxValue = 0;
  const currentYear = year || moment().year();

  data.forEach((item) => {
    const receivedDate = new Date(item.formatedPaymentReceiveDate);
    const receivedYear = receivedDate.getFullYear();

    const receivedPayment = parseFloat(item.receivedPayment);
    totalReceived += receivedPayment;

    if (receivedYear === currentYear) {
      const month = receivedDate.toLocaleString("default", { month: "short" });

      if (!isNaN(receivedPayment)) {
        monthlyExpenses[month] += receivedPayment;
        yearTotal += receivedPayment;
      }
    }
  });
  maxValue = Math.max(...Object.values(monthlyExpenses));
  maxValue = Math.ceil(maxValue / 100) * 100;
  const graphData: GraphData[] = Object.keys(monthlyExpenses).map((month) => ({
    value: monthlyExpenses[month],
    month,
  }));

  return {
    totalReceived,
    graphData,
    maxValue,
    yearTotal,
  };
};
