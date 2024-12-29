'use client';

import SelectCell from '@/components/SelectCell';
import TextInputCell from '@/components/TextInputCell';
import { School, updateSchool } from '@/lib/services/school';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<School>();

export const schoolTableColumns = [
  columnHelper.accessor('name', {
    header: 'School Name',
    cell: (info) => <TextInputCell {...info} updateCellAction={updateSchool} />,
    size: 900,
  }),
  columnHelper.accessor('initial', {
    header: 'School Initials',
    cell: (info) => <TextInputCell {...info} updateCellAction={updateSchool} />,
    size: 300,
  }),
  columnHelper.accessor('arrivalTime', {
    header: 'Arrival Time',
    cell: (info) => <TextInputCell {...info} updateCellAction={updateSchool} />,
    size: 300,
  }),
  columnHelper.accessor('departureTime', {
    header: 'Departure Time',
    cell: (info) => <TextInputCell {...info} updateCellAction={updateSchool} />,
    size: 300,
  }),
  columnHelper.display({
    id: 'select',
    cell: SelectCell,
    size: 50,
  }),
];
