"use server";

import { EnquiryFormData } from "@/app/enquiry/EnquiryForm";

import { EnquiryStatusType } from "../constants";
import { Location } from "./location";
import { School } from "./school";

export type Enquiry = {
  id: string;
  email: string;
  block: string;
  remark: string;
  fare: number;
  homePostalCode: string;
  homeUnitNo: string;
  amPostalCode: string;
  pmPostalCode: string;
  schoolId: string;
  school: School;
  amLocationId: string | null;
  amLocation: Location | null;
  pmLocationId: string | null;
  pmLocation: Location | null;
  year: number;
  status: EnquiryStatusType | null;
  isEmailSent: boolean;
  isFavourite: boolean;
  homeAddress: string;
  amAddress: string;
  pmAddress: string;
  createdOn: string;
  amIcon: string;
  pmIcon: string;
};

export const readEnquiries = async (): Promise<Enquiry[]> => {
  const response = await fetch(`${process.env.API_URL}/enquiry/`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to get Enquiries");
  }

  const data = await response.json();
  return data;
};

export const readEnquiry = async (id: string): Promise<Enquiry> => {
  const response = await fetch(`${process.env.API_URL}/enquiry/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to get Enquiry");
  }

  const data = await response.json();
  return data;
};

export const createEnquiry = async (
  schoolId: string,
  formData: EnquiryFormData
): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/enquiry/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: formData.email,
      homePostalCode: formData.homePostalCode,
      homeUnitNo: formData.homeUnitNo,
      amPostalCode: formData.amPostalCode,
      pmPostalCode: formData.pmPostalCode,
      schoolId: schoolId,
      year: formData.year,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to create Enquiry");
  }
};

export const updateEnquiry = async (
  id: string,
  enquiryUpdate: Partial<Enquiry>
): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/enquiry/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enquiryUpdate),
  });

  if (!response.ok) {
    throw new Error("Unable to update Enquiry");
  }
};

export const deleteEnquiries = async (ids: string[]): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/enquiry/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ids),
  });

  if (!response.ok) {
    throw new Error("Unable to delete Enquiries");
  }
};
