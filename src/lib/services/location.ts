'use server';

import { revalidateTag } from 'next/cache';

export type Location = {
  id: string;
  address: string;
  time: string;
  type: 'AM' | 'PM';
  timeReached: string | null;
  position: number | null;
};

export const readLocations = async (
  type?: 'AM' | 'PM'
): Promise<Location[]> => {
  let response;
  if (type) {
    response = await fetch(`${process.env.API_URL}/location/?type=${type}`, {
      method: 'GET',
      next: {
        tags: ['location', type],
      },
    });
  } else {
    response = await fetch(`${process.env.API_URL}/location`, {
      method: 'GET',
      next: {
        tags: ['location'],
      },
    });
  }
  if (!response.ok) {
    throw new Error('Unable to get Locations');
  }

  const data = await response.json();
  return data;
};

export const createLocation = async (locationCreate: Partial<Location>) => {
  const response = await fetch(`${process.env.API_URL}/location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(locationCreate),
  });

  if (!response.ok) {
    throw new Error('Unable to create Location');
  }

  revalidateTag('location');
};
