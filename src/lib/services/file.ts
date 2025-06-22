"use server";

export type UploadedFile = {
  key: string;
  signedUrl: string;
};

export const uploadFile = async (formData: FormData): Promise<UploadedFile> => {
  const response = await fetch(`${process.env.API_URL}/file/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Unable to upload file");
  }

  const data = await response.json();
  return data;
};
