type TFollowUp = {
  flag: ReactNode;
  followUpDate: string;
  description: string;
  createDate?: string;
  lastModifiedDate?: string;
  followUpId?: string;
  message?: string;
  description?: string;
  id?: string;
};

type TEnquiryData = {
  id: string;
  visited: boolean;
  followUp: TFollowUp[];
  studentName: string;
  enquiryCourse: string;
  status: string;
  mobileNumber: string;
  email: string;
  parentName: string;
  parentContact: string;
  college: string;
  collegeDepartment: string;
  semester: string;
  collegeCourse: string;
  courseDescription: string;
  firstName: string;
  lastName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leadManager?: any;
  // callLogs: TCallHistory[];
  announcements: TAnnouncementData[];
};
