export const EnquiryStatus = [
  "To Be Confirmed",
  "Option",
  "Enquiry Sent",
  "Registration",
  "Rejected",
] as const;

export type EnquiryStatusType = (typeof EnquiryStatus)[number];
