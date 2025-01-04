'use server';

import { date } from 'zod';

export const getAddress = async (postalCode: string): Promise<string> => {
  const response = await fetch(
    `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalCode}&returnGeom=N&getAddrDetails=Y`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  if (!response.ok) {
    throw new Error('Unable to get Address');
  }

  const data = await response.json();
  const results = data['results'];

  if (results.length === 0) {
    return '';
  }

  const block = results[0]['BLK_NO'];
  const road = results[0]['ROAD_NAME'];
  return block + ' ' + road;
};
