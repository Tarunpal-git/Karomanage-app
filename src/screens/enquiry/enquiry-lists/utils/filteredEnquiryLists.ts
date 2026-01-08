export const filteredEnquiryLists = (
  data: TEnquiryData[],
  filters: {
    search: string;
    status: string;
  }
) => {
  const { search, status } = filters;

  return data.filter((student) => {
    const matchesSearch =
      !search ||
      student.studentName.toLowerCase().includes(search.toLowerCase()) ||
      student?.email?.toLowerCase().includes(search.toLowerCase()) ||
      student.mobileNumber.includes(search);

    const matchesActiveStatus =
      !status ||
      (status === "active" && student.status === "active") ||
      (status !== "active" && (student.status || "") === status);

    if (status === "inActive") {
      const matchInActiveStatus = student.status === "inActive";
      return matchesSearch && matchInActiveStatus;
    }
    // Check if 'Interested' status and filter the followUp array

    if (status === "Success Leads") {
      const matchSuccessLeads = student.status === "student";
      return matchesSearch && matchSuccessLeads;
    }

    if (status === "new") {
      const matchNewEnquiry = student.visited === false;
      return matchesSearch && matchNewEnquiry;
    }

    if (status === "Interested") {
      const interestedFollowUps =
        student.followUp.length > 0 &&
        student.followUp[student.followUp.length - 1]?.description ===
          "Interested";
      return matchesSearch && interestedFollowUps;
    }

    if (status === "Not Interested") {
      const notInterestedFollowUps =
        student.followUp.length > 0 &&
        student.followUp[student.followUp.length - 1]?.description ===
          "Not Interested";
      return matchesSearch && notInterestedFollowUps;
    }

    if (status === "Call later") {
      const callLaterFollowUps =
        student.followUp.length > 0 &&
        student.followUp[student.followUp.length - 1]?.description ===
          "Call later";
      return matchesSearch && callLaterFollowUps;
    }

    if (status === "Call Not Picked") {
      const notPickedUpFollowUps =
        student.followUp.length > 0 &&
        student.followUp[student.followUp.length - 1]?.description ===
          "Call not picked";
      return matchesSearch && notPickedUpFollowUps;
    }

    if (status === "Attend Demo") {
      const attendDemoFollowUps =
        student.followUp.length > 0 &&
        student.followUp[student.followUp.length - 1]?.description ===
          "Attend Demo";
      return matchesSearch && attendDemoFollowUps;
    }

    if (status === "visited") {
      const matchAttendDemo = student.visited;
      return matchesSearch && matchAttendDemo;
    }

    return matchesSearch && matchesActiveStatus;
  });
};
