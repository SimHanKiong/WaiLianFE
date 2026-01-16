"use server";

import { ParentFormData } from "@/app/admin/student/StudentForm";
import { RegistrationFormData } from "@/app/registration/RegistrationForm";

import { Student } from "./student";

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
  children: Student[];
};

export const readParent = async (id: string): Promise<Parent> => {
  const response = await fetch(`${process.env.API_URL}/parent/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to get Parent");
  }

  const data = await response.json();
  return data;
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
      ...formData,
      enquiryId: enquiryId,
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
    throw new Error("Unable to create Parent");
  }
};

export const updateParent = async (
  id: string,
  formData: ParentFormData
): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/parent/${id}`, {
    method: "PATCH",
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
    console.log(text);
    throw new Error("Unable to update Parent");
  }
};
