"use server";

export type School = {
  id: string;
  name: string;
  initial: string;
  arrivalTime: string;
  departureTime: string;
  email: string | null;
  password: string;
  isFinalYear: boolean;
  emailAttachmentKey: string | null;
  emailAttachmentSignedUrl?: string | null;
};

export const readSchools = async (): Promise<School[]> => {
  const response = await fetch(`${process.env.API_URL}/school/`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to get Schools");
  }

  const data = await response.json();
  return data;
};

export const readSchool = async (id: string): Promise<School> => {
  const response = await fetch(`${process.env.API_URL}/school/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to get School");
  }

  const data = await response.json();
  return data;
};

export const createSchool = async (schoolCreate: School): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/school/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(schoolCreate),
  });

  if (!response.ok) {
    throw new Error("Unable to create School");
  }
  await response.json();
};

export const updateSchool = async (
  id: string,
  schoolUpdate: Partial<School>
): Promise<void> => {
  const response = await fetch(`${process.env.API_URL}/school/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(schoolUpdate),
  });

  if (!response.ok) {
    throw new Error("Unable to update School");
  }
};

export const deleteSchools = async (ids: string[]): Promise<void> => {
  for (const id of ids) {
    const response = await fetch(`${process.env.API_URL}/school/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Unable to delete School");
    }
  }
};
