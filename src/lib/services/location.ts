"use server";

import { LocationTypeType } from "../constants";
import { Bus } from "./bus";
import { Student } from "./student";

export type Location = {
  id: string;
  address: string;
  timeReach: string;
  type: LocationTypeType;
  busId: string | null;
  bus: Bus | null;
  students: Student[];
};

export const readLocations = async (options?: {
  type?: LocationTypeType;
  busId?: string;
  sortBy?: string;
}): Promise<Location[]> => {
  const params = new URLSearchParams();
  if (options?.type) {
    params.append("type", options.type);
  }
  if (options?.busId) {
    params.append("busId", options.busId);
  }
  if (options?.sortBy) {
    params.append("sortBy", options.sortBy);
  }
  const queryString = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(
    `${process.env.API_URL}/location/${queryString}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error("Unable to get Locations");
  }

  const data = await response.json();
  return data;
};

export const createLocation = async (locationCreate: Partial<Location>) => {
  const response = await fetch(`${process.env.API_URL}/location/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(locationCreate),
  });

  if (!response.ok) {
    throw new Error("Unable to create Location");
  }
};

export const updateLocation = async (
  id: string,
  locationUpdate: Partial<Location>
): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/location/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(locationUpdate),
  });

  if (!response.ok) {
    throw new Error("Unable to update Location");
  }
};

export const deleteLocation = async (id: string): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/location/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to delete Location");
  }
};

export const deleteLocations = async (ids: string[]): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/location/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ids),
  });

  if (!response.ok) {
    throw new Error("Unable to delete Locations");
  }
};
