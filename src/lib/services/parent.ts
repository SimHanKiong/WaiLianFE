"use server";

import { ParentFormData } from "@/app/admin/student/StudentForm";
import { RegistrationFormData } from "@/app/registration/RegistrationForm";

export type Parent = {
  id: string;
  email: string;
  contact1Name: string;
  contact1No: string;
  contact1Relationship: string;
  contact2Name: string;
  contact2No: string;
  contact2Relationship: string;
  homePostalCode: string;
  homeUnitNo: string;
  homeAddress: string;
  amPostalCode: string;
  amAddress: string;
  pmPostalCode: string;
  pmAddress: string;
  underFas: boolean;
  fare: number;
  enquiryId: string | null;
};

export const createParent = async (formData: ParentFormData): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/parent/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...formData,
      children: formData.children.map((child) => ({
        ...child,
        dateOfBirth: child.dateOfBirth.toISOString().split("T")[0],
        transportStartDate: child.transportStartDate
          .toISOString()
          .split("T")[0],
      })),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Unable to create Parent: " + text);
  }
};

export const createParentFromEnquiry = async (
  enquiryId: string,
  formData: RegistrationFormData
): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/parent/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contact1Name: formData.contact1Name,
      contact1No: formData.contact1No,
      contact1Relationship: formData.contact1Relationship,
      contact2Name: formData.contact2Name,
      contact2No: formData.contact2No,
      contact2Relationship: formData.contact2Relationship,
      underFas: formData.underFas,
      enquiryId: enquiryId,
      children: formData.children.map((child) => ({
        fullName: child.fullName,
        givenName: child.givenName,
        gender: child.gender,
        level: child.level,
        className: child.className,
        dateOfBirth: child.dateOfBirth.toISOString().split("T")[0],
        nric: child.nric,
        transportStartDate: child.transportStartDate
          .toISOString()
          .split("T")[0],
        transportRequirement: child.transportRequirement,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to create Parent");
  }
};
