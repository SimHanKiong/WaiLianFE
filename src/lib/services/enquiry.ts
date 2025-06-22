"use server";

import { Location } from "./location";
import { School } from "./school";
import { EnquiryFormData } from "@/app/enquiry/[id]/EnquiryForm";
import { EnquiryStatusType } from "../constants";

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
  schoolId: string | null;
  school: School | null;
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
};

export const readEnquiries = async (sortBy?: string[]): Promise<Enquiry[]> => {
  const params = new URLSearchParams();
  if (sortBy) {
    sortBy.forEach((sort) => params.append("sort_by", sort));
  }
  const queryString = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(
    `${process.env.API_URL}/enquiry/${queryString}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to get Enquiries");
  }

  const data = await response.json();
  return data;
};

export const createEnquiry = async (
  schoolId: string,
  formData: EnquiryFormData
): Promise<void> => {
  const enquiryCreate: Partial<Enquiry> = {
    email: formData.email,
    block: "",
    remark: "",
    fare: 0,
    homePostalCode: formData.homePostalCode,
    homeUnitNo: formData.homeUnitNo,
    amPostalCode: formData.amPostalCode,
    pmPostalCode: formData.pmPostalCode,
    schoolId: schoolId,
    amLocationId: null,
    pmLocationId: null,
    status: null,
    isEmailSent: false,
    isFavourite: false,
    year: formData.year,
  };

  const response = await fetch(`${process.env.API_URL}/enquiry/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enquiryCreate),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
};

export const updateEnquiry = async (
  id: string,
  enquiryUpdate: Partial<Enquiry>
): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/enquiry/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enquiryUpdate),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
};

export const deleteEnquiries = async (ids: string[]): Promise<void> => {
  for (const id of ids) {
    const response = await fetch(`${process.env.API_URL}/enquiry/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Unable to delete Enquiry");
    }
  }
};
