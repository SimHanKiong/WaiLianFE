export const EnquiryStatus = {
  TBC: "To Be Confirmed",
  OPTION: "Option",
  SENT: "Enquiry Sent",
  REGISTRATION: "Registration",
  REJECTED: "Rejected",
} as const;
export type EnquiryStatusType =
  (typeof EnquiryStatus)[keyof typeof EnquiryStatus];
export const EnquiryStatusOptions = Object.values(EnquiryStatus);

export const Gender = {
  MALE: "M",
  FEMALE: "F",
} as const;
export type GenderType = (typeof Gender)[keyof typeof Gender];
export const GenderOptions = Object.values(Gender);

export const TransportRequirement = {
  AM: "AM",
  PM: "PM",
  BOTH: "Both",
} as const;
export type TransportRequirementType =
  (typeof TransportRequirement)[keyof typeof TransportRequirement];
export const TransportRequirementOptions = Object.values(TransportRequirement);

export const LocationType = {
  AM: "AM",
  PM: "PM",
} as const;
export type LocationTypeType = (typeof LocationType)[keyof typeof LocationType];
export const LocationTypeOptions = Object.values(LocationType);
