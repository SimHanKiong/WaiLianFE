"use server";

export type Bus = {
  id: string;
  name: string;
  amPlateNo: string;
  amCapacity: number;
  pmPlateNo: string;
  pmCapacity: number;
  colour: string;
};

export const readBuses = async (): Promise<Bus[]> => {
  const response = await fetch(`${process.env.API_URL}/bus/`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to get Buses");
  }

  const data = await response.json();
  return data;
};

export const createBus = async (busCreate: Bus): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/bus/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(busCreate),
  });

  if (!response.ok) {
    throw new Error("Unable to create Bus");
  }
};

export const updateBus = async (
  id: string,
  busUpdate: Partial<Bus>
): Promise<void> => {
  console.log(busUpdate);
  const response = await fetch(`${process.env.API_URL}/bus/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(busUpdate),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Unable to update Bus");
  }
};

export const deleteBuses = async (ids: string[]): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/bus/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ids),
  });

  if (!response.ok) {
    throw new Error("Unable to delete Buses");
  }
};
