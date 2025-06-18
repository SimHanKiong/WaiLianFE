"use server";

import { revalidateTag } from "next/cache";

export type Location = {
  id: string;
  address: string;
  time: string;
  type: "AM" | "PM";
  timeReached: string | null;
  position: number | null;
};

export const readLocations = async (
  type?: "AM" | "PM",
  sortBy?: string
): Promise<Location[]> => {
  const params = new URLSearchParams();
  if (type) {
    params.append("type", type);
  }
  if (sortBy) {
    params.append("sort_by", sortBy);
  }
  const queryString = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(
    `${process.env.API_URL}/location/${queryString}`,
    {
      method: "GET",
      next: {
        tags: ["location", type].filter(Boolean) as string[],
      },
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

  revalidateTag("location");
};

export const deleteLocation = async (id: string): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/location/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to delete Location");
  }

  revalidateTag("location");
};
