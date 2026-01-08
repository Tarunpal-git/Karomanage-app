export const formEnquiriesFilteredData = (
  data: TFormEnquiry[],
  filters: {
    search: string;
    status: string;
  }
) => {
  const { search, status } = filters;

  return data.filter((student) => {
    const matchesSearch =
      !search ||
      student.formData.name.toLowerCase().includes(search.toLowerCase()) ||
      student.formData.email.toLowerCase().includes(search.toLowerCase()) ||
      student.formData.mobileNumber?.includes(search);

    const matchesActiveStatus =
      !status ||
      (status === "active" && student.formStatus === "active") ||
      (status !== "active" && (student.formStatus || "") === status);

    if (status === "new") {
      const matchNewEnquiry = student.visited === false;
      return matchesSearch && matchNewEnquiry;
    }

    if (status === "Success Leads") {
      const matchSuccessLeads = student.formStatus === "student";
      return matchesSearch && matchSuccessLeads;
    }

    if (status === "Interested") {
      const interestedFollowUps =
        student.formData.followUp.length > 0 &&
        student.formData.followUp[student.formData.followUp.length - 1].flag ===
          "Interested";
      return matchesSearch && interestedFollowUps;
    }

    if (status === "Not Interested") {
      const notInterestedFollowUps =
        student.formData.followUp.length > 0 &&
        student.formData.followUp[student.formData.followUp.length - 1].flag ===
          "Not Interested";
      return matchesSearch && notInterestedFollowUps;
    }

    if (status === "Call Not Picked") {
      const notPickedUpFollowUps =
        student.formData.followUp.length > 0 &&
        student.formData.followUp[student.formData.followUp.length - 1].flag ===
          "Call not picked";
      return matchesSearch && notPickedUpFollowUps;
    }

    if (status === "Attend Demo") {
      const attendDemoFollowUps =
        student.formData.followUp.length > 0 &&
        student.formData.followUp[student.formData.followUp.length - 1].flag ===
          "Attend Demo";
      return matchesSearch && attendDemoFollowUps;
    }

    if (status === "Call later") {
      const callLaterFollowUps =
        student.formData.followUp.length > 0 &&
        student.formData.followUp[student.formData.followUp.length - 1].flag ===
          "Call later";
      return matchesSearch && callLaterFollowUps;
    }

    if (status === "visited") {
      const matchAttendDemo = student.visited;
      return matchesSearch && matchAttendDemo;
    }

    return matchesSearch && matchesActiveStatus;
  });
};
