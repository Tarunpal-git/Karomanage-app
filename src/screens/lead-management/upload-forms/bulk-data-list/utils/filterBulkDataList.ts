export const filterBulkDataList = (
  data: TBulkDataEnquiry[],
  filters: {
    search: string;
    status: string;
  }
) => {
  const { search, status } = filters;

  return data.filter((student) => {
    const matchesSearch =
      !search ||
      Object.values(student.formData).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(search.toLowerCase());
        } else if (typeof value === "number") {
          return value.toString().includes(search);
        }
        return false;
      });

    if (status === "active") {
      const matchActiveLeads = student.formStatus === "active";
      return matchesSearch && matchActiveLeads;
    }
    if (status === "inActive") {
      const matchInActiveLeads = student.formStatus === "inActive";
      return matchesSearch && matchInActiveLeads;
    }

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

    return matchesSearch;
  });
};