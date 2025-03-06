"use server";

import { revalidateTag } from "next/cache";
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
  homeAddress: string;
  amAddress: string;
  pmAddress: string;
  created_at: Date;
};

export const readEnquiries = async (): Promise<Enquiry[]> => {
  const response = await fetch(`${process.env.API_URL}/enquiry/`, {
    method: "GET",
    next: {
      tags: ["enquiry"],
    },
  });

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

  revalidateTag("enquiry");
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

  revalidateTag("enquiry");
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

  revalidateTag("enquiry");
};
