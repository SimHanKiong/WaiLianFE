'use server';

import { revalidateTag } from 'next/cache';
import { Location } from './location';
import { School } from './school';

export type Enquiry = {
  id: string;
  date: string;
  phoneNo: string;
  block: string;
  remark: string;
  fare: number;
  schoolId: string | null;
  school: School | null;
  amLocationId: string | null;
  amLocation: Location | null;
  pmLocationId: string | null;
  pmLocation: Location | null;
  status: 'To Be Confirmed' | 'Enquiry Sent' | 'Registration Received' | null;
};

export const readEnquiries = async (): Promise<Enquiry[]> => {
  const response = await fetch(`${process.env.API_URL}/enquiry`, {
    method: 'GET',
    next: {
      tags: ['enquiry'],
    },
  });

  if (!response.ok) {
    throw new Error('Unable to get Enquiries');
  }

  const data = await response.json();
  return data;
};

export const createEnquiry = async (): Promise<void> => {
  const enquiryCreate: Partial<Enquiry> = {
    date: '',
    phoneNo: '',
    block: '',
    remark: '',
    fare: 0,
    status: null,
    schoolId: null,
    amLocationId: null,
    pmLocationId: null,
  };
  const response = await fetch(`${process.env.API_URL}/enquiry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(enquiryCreate),
  });

  if (!response.ok) {
    throw new Error('Unable to create Enquiry');
  }

  revalidateTag('enquiry');
};

export const updateEnquiry = async (
  id: string,
  enquiryUpdate: Partial<Enquiry>
): Promise<void> => {
  console.log(id);
  console.log(enquiryUpdate);
  const response = await fetch(`${process.env.API_URL}/enquiry/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(enquiryUpdate),
  });

  if (!response.ok) {
    throw new Error('Unable to update Enquiry');
  }

  revalidateTag('enquiry');
};

export const deleteEnquiries = async (ids: string[]): Promise<void> => {
  for (const id of ids) {
    const response = await fetch(`${process.env.API_URL}/enquiry/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Unable to delete Enquiry');
    }
  }

  revalidateTag('enquiry');
};
