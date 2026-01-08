export const filteredPaymentOverviewBatchDetails = (
  students: TStudentList[],
  courses: string[]
) => {
  const activeStudents = students.filter((s) => s?.studentStatus === "active").length;
  const inactiveStudents = students.filter((s) => 
    s?.studentStatus === "inActive" || s?.studentStatus === "inactive"
  ).length;

  let forecastPayment = 0;
  let receivedPayment = 0;
  let duePayment = 0;
  let refundAmount = 0;
  let defaulterStudents = 0;

  students.forEach((student) => {
    if (student?.studentStatus !== "delete") {
      // Filter only relevant courses for payment calculations
      const studentCourses = student?.courses?.filter((course) => courses.includes(course.courseId)) || [];

      // Calculate received payment for relevant courses
      receivedPayment += studentCourses.reduce(
        (sum, course) => sum + (course.paymentDetails?.totalReceivedPayment ?? 0),
        0
      );

      // Calculate refund amount only for the current batch's courses
      const batchRefunds = student?.refundList?.filter(refund => 
        // Check if the refund's courseId matches any of the current batch's courses
        studentCourses.some(course => course.courseId === refund.courseId)
      ) || [];

      refundAmount += batchRefunds.reduce(
        (total, refund) => total + (refund.refundAmount ?? 0),
        0
      );

      studentCourses.forEach((course) => {
        course.paymentDetails?.installmentDetails?.forEach((installment) => {
          const currentDate = new Date();
          const nextPaymentDate = new Date(installment.formatedNextpaymentDate ?? "");
          
          // Normalize dates to compare only the date part (without time)
          const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
          const nextPaymentDateOnly = new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth(), nextPaymentDate.getDate());

          // Due payment (if overdue - only past due, not today's due)
          if (installment.paymentStatus === "due" && nextPaymentDateOnly < currentDateOnly) {
            duePayment += installment.duePayment ?? 0;
            console.log(`CLIENT-SIDE OVERDUE: Student ${student.studentFirstName}, Due Date: ${installment.formatedNextpaymentDate}, Amount: ${installment.duePayment}`);
          }

          // Forecast payment (if future installment and student is not inactive/deleted)
          if (student?.studentStatus !== "delete" && 
              student?.studentStatus !== "inActive" && 
              student?.studentStatus !== "inactive") {
            if (nextPaymentDateOnly > currentDateOnly) {
              forecastPayment += installment.duePayment ?? 0;
            }
          }
        });
      });

    // Check if student is a defaulter (based on studentStatus from API)
    if (student?.studentStatus === "defaulter") {
      defaulterStudents++;
    }
    }
  });

  return {
    activeStudents,
    inactiveStudents,
    forecastPayment,
    receivedPayment,
    duePayment,
    refundAmount,
    defaulterStudents,
  };
};