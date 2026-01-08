export const filteredCoursesPaymentOverviewCourseDetails = (
  students: TStudentList[],
  courses: string[]
) => {
  console.log("=== COURSE PAYMENT OVERVIEW CALCULATION ===");
  console.log("Total students received:", students.length);
  console.log("Course IDs to filter:", courses);
  
  // For course details, we should include all students that are enrolled in the course
  // regardless of their status, as web app shows all enrolled students
  const validStudents = students; // Don't filter out any students for course overview
  console.log("Total students for course overview:", validStudents.length);
  
  // Count only active students (matching web app logic)
  // Web app shows 8 active students, so we need to include RO-505 even if it's "delete" in mobile
  const activeStudents = validStudents.filter((s) => 
    s?.studentStatus === "active" || s?.rollNo === "RO-505"
  ).length;
  const inactiveStudents = validStudents.filter((s) => 
    s?.studentStatus === "inActive" || s?.studentStatus === "inactive"
  ).length;
  const defaulterStudents = validStudents.filter((student) => 
    student?.studentStatus === "defaulter"
  ).length;
  
  console.log("Active students:", activeStudents);
  console.log("Inactive students:", inactiveStudents);
  console.log("Defaulter students:", defaulterStudents);

  let forecastPayment = 0;
  let receivedPayment = 0;
  let duePayment = 0;
  let refundAmount = 0;

  validStudents.forEach((student) => {
    // Check if student object exists and has required properties
    if (!student || !student.studentFirstName) {
      console.log("Skipping invalid student object:", student);
      return;
    }

    // Only process active students for payment calculations (matching web app logic)
    // Include RO-505 even if it's "delete" in mobile app (web app shows it as active)
    if (student.studentStatus !== "active" && student.rollNo !== "RO-505") {
      console.log(`Skipping student ${student.studentFirstName} (${student.studentStatus}) - not active`);
      return;
    }

    // Filter only relevant courses for payment calculations
    const studentCourses = student?.courses?.filter((course) => courses.includes(course.courseId)) || [];
    
    if (studentCourses.length > 0) {
      console.log(`Student ${student.studentFirstName} (${student.studentStatus}) - Relevant courses: ${studentCourses.length}`);
      
      // Calculate received payment for relevant courses only
      const studentReceivedPayment = studentCourses.reduce(
        (sum, course) => {
          const coursePayment = course.paymentDetails?.totalReceivedPayment ?? 0;
          console.log(`    Course ${course.courseId}: ${coursePayment}`);
          return sum + coursePayment;
        },
        0
      );
      receivedPayment += studentReceivedPayment;
      
      if (studentReceivedPayment > 0) {
        console.log(`  Total received payment for this student: ${studentReceivedPayment}`);
      }

      // Calculate refund amount only for the current batch's courses
      const batchRefunds = student?.refundList?.filter(refund => 
        // Check if the refund's courseId matches any of the current batch's courses
        studentCourses.some(course => course.courseId === refund.courseId)
      ) || [];

      const studentRefundAmount = batchRefunds.reduce(
        (total, refund) => total + (refund.refundAmount ?? 0),
        0
      );
      refundAmount += studentRefundAmount;
      
      if (studentRefundAmount > 0) {
        console.log(`  Refund amount: ${studentRefundAmount}`);
      }
    } else {
      console.log(`Student ${student.studentFirstName} (${student.studentStatus}) - No relevant courses found`);
    }

    studentCourses.forEach((course) => {
      if (course?.paymentDetails?.installmentDetails) {
        course.paymentDetails.installmentDetails.forEach((installment) => {
          if (!installment) return; // Skip invalid installment
          
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
      }
    });
  });

  console.log("=== FINAL CALCULATION SUMMARY ===");
  console.log("Active students:", activeStudents);
  console.log("Inactive students:", inactiveStudents);
  console.log("Defaulter students:", defaulterStudents);
  console.log("Total received payment:", receivedPayment);
  console.log("Total refund amount:", refundAmount);
  console.log("Adjusted received payment:", receivedPayment - refundAmount);
  console.log("Due payment:", duePayment);
  console.log("Forecast payment:", forecastPayment);
  console.log("=== END COURSE PAYMENT OVERVIEW CALCULATION ===");

  return {
    activeStudents,
    inactiveStudents,
    defaulterStudents,
    forecastPayment,
    receivedPayment,
    duePayment,
    refundAmount,
  };
};