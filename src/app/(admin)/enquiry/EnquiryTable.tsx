'use client';
import { EditableTable } from '@/components/EditableTable';
import { createColumnHelper } from '@tanstack/react-table';
import DropdownCell from '@/components/DropdownCell';
import NumberInputCell from '@/components/NumberInputCell';
import SelectCell from '@/components/SelectCell';
import TextInputCell from '@/components/TextInputCell';
import {
  Enquiry,
  updateEnquiry,
  createEnquiry,
  deleteEnquiries,
} from '@/lib/services/enquiry';
import DisplayCell from '@/components/DisplayCell';
import { CopyIcon } from 'lucide-react';
import DialogWrapper from '@/components/DialogWrapper';

interface EnquiryTableProps {
  data: Enquiry[];
  schools: { value: string; label: string }[];
  amLocations: { value: string; label: string }[];
  pmLocations: { value: string; label: string }[];
}

export default function EnquiryTable({
  data,
  schools,
  amLocations,
  pmLocations,
}: EnquiryTableProps) {
  const locationStatus = [
    { value: 'To Be Confirmed', label: 'To Be Confirmed' },
    { value: 'Enquiry Sent', label: 'Enquiry Sent' },
    { value: 'Registration Received', label: 'Registration Received' },
  ];

  const getStatusRowColour = (status?: string | null): string => {
    if (!status) {
      return '';
    }

    switch (status) {
      case 'Registration Received':
        return 'bg-green-100';
      case 'To Be Confirmed':
        return 'bg-red-100';
      case 'Enquiry Sent':
        return 'bg-blue-100';
      default:
        return '';
    }
  };

  const getDetails = (row: Enquiry) => `
*School Bus Enquiries*

${row.phoneNo}

Pick Up Point:
*${row.amLocation?.address || 'N/A'}*

Pick Up Time:
*around ${row.amLocation?.time || 'N/A'}*
(School bus has to reach school at 7am)

Drop Off Point:
*${row.pmLocation?.address || 'N/A'}*

Drop Off Time:
*around ${row.pmLocation?.time || 'N/A'}*
(School bus will depart the school at 1:45pm)

Monthly Bus Fare per Student:
*S$${row.fare || 'N/A'}*

If you agree with the details above, we will proceed with the registration.

*IMPORTANT*
Please take note that the details may be further altered.
Upon agreement of the details, please use the link below for registration.

${process.env.NEXT_PUBLIC_FE_URL}/registration/${row.id}
`;

  const columnHelper = createColumnHelper<Enquiry>();

  const columns = [
    columnHelper.accessor('school.id', {
      header: 'School',
      cell: (info) => (
        <DropdownCell
          {...info}
          updateCellAction={updateEnquiry}
          options={schools}
          width={130}
        />
      ),
      size: 150,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: (info) => (
        <TextInputCell {...info} updateCellAction={updateEnquiry} />
      ),
      size: 150,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('phoneNo', {
      header: 'Phone',
      cell: (info) => (
        <TextInputCell {...info} updateCellAction={updateEnquiry} />
      ),
      size: 150,
      enableGlobalFilter: true,
    }),
    columnHelper.accessor('block', {
      header: 'Block',
      cell: (info) => (
        <TextInputCell {...info} updateCellAction={updateEnquiry} />
      ),
      size: 100,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('remark', {
      header: 'Remark',
      cell: (info) => (
        <TextInputCell {...info} updateCellAction={updateEnquiry} />
      ),
      size: 250,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('fare', {
      header: 'Bus Fare',
      cell: (info) => (
        <NumberInputCell {...info} updateCellAction={updateEnquiry} />
      ),
      size: 100,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('amLocation.id', {
      id: 'amLocationId',
      header: 'Pick Up Point',
      cell: (info) => (
        <DropdownCell
          {...info}
          updateCellAction={updateEnquiry}
          options={amLocations}
          width={380}
        />
      ),
      size: 400,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('amLocation.time', {
      header: 'Pick Up Time',
      cell: (info) => <DisplayCell {...info} />,
      size: 100,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('pmLocation.id', {
      id: 'pmLocationId',
      header: 'Drop Off Point',
      cell: (info) => (
        <DropdownCell
          {...info}
          updateCellAction={updateEnquiry}
          options={pmLocations}
          width={380}
        />
      ),
      size: 400,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('pmLocation.time', {
      header: 'Drop Off Time',
      cell: (info) => <DisplayCell {...info} />,
      size: 100,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('id', {
      header: 'Details',
      cell: ({ row }) => (
        <DialogWrapper
          openText={<CopyIcon />}
          title="School Bus Enquiry Details"
        >
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
            {getDetails(row.original)}
          </pre>
        </DialogWrapper>
      ),
      size: 80,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <DropdownCell
          {...info}
          updateCellAction={updateEnquiry}
          options={locationStatus}
          width={230}
        />
      ),
      size: 250,
      enableGlobalFilter: false,
    }),
    columnHelper.display({
      id: 'select',
      cell: SelectCell,
      size: 50,
      enableGlobalFilter: false,
    }),
  ];

  return (
    <EditableTable<Enquiry, any>
      columns={columns}
      data={data}
      addRowAction={createEnquiry}
      deleteRowsAction={deleteEnquiries}
      getRowColour={(row) => getStatusRowColour(row.status)}
      enableSearching={true}
    />
  );
}
