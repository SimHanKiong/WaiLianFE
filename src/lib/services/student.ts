"use server";

import {
  GenderType,
  StudentStatusType,
  TransportRequirementType,
} from "../constants";
import { Location } from "./location";
import { Parent } from "./parent";
import { School } from "./school";

export type Student = {
  id: string;
  fullName: string;
  givenName: string;
  gender: GenderType;
  level: number;
  order: number;
  className: string;
  dateOfBirth: string;
  nric: string;
  transportStartDate: string;
  transportRequirement: TransportRequirementType;
  block: string;
  status: StudentStatusType | null;
  amIcon: string;
  pmIcon: string;
  isFavourite: boolean;
  remark: string;
  icon: string;
  schoolId: string;
  school: School;
  amLocationId: string | null;
  amLocation: Location | null;
  pmLocationId: string | null;
  pmLocation: Location | null;
  parentId: string;
  parent: Parent;
};

export const readStudents = async (): Promise<Student[]> => {
  const response = await fetch(`${process.env.API_URL}/student/`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to get Students");
  }

  const data = await response.json();
  return data;
};

export const updateStudent = async (
  id: string,
  studentUpdate: Partial<Student>
): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/student/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentUpdate),
  });

  if (!response.ok) {
    throw new Error("Unable to update Student");
  }
};

export const deleteStudents = async (ids: string[]): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/student/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ids),
  });

  if (!response.ok) {
    throw new Error("Unable to delete Students");
  }
};
