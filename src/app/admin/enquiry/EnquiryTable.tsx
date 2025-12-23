"use client";

import EditableTable from "@/components/table/EditableTable";
import { createColumnHelper, Row, SortingState } from "@tanstack/react-table";
import DropdownCell from "@/components/table/DropdownCell";
import NumberInputCell from "@/components/table/NumberInputCell";
import RowSelectCell from "@/components/table/RowSelectCell";
import TextInputCell from "@/components/table/TextInputCell";
import {
  Enquiry,
  updateEnquiry,
  deleteEnquiries,
} from "@/lib/services/enquiry";
import DisplayCell from "@/components/table/DisplayCell";
import { useMemo } from "react";
import CheckboxCell from "@/components/table/CheckboxCell";
import {
  ArrowBigDown,
  ArrowBigUp,
  CircleDollarSign,
  ClockArrowDown,
  ClockArrowUp,
  MoveHorizontal,
  SchoolIcon,
  Trash2,
} from "lucide-react";
import { School } from "@/lib/services/school";
import { Location } from "@/lib/services/location";
import IconHeader from "@/components/table/IconHeader";

interface EnquiryTableProps {
  data: Enquiry[];
  schools: { value: string; label: string; object: School }[];
  enquiryStatus: { value: string; label: string; object: boolean }[];
  amLocations: { value: string; label: string; object: Location }[];
  pmLocations: { value: string; label: string; object: Location }[];
}

export default function EnquiryTable({
  data,
  schools,
  enquiryStatus,
  amLocations,
  pmLocations,
}: EnquiryTableProps) {
  const getStatusRowColour = (row: Enquiry): string => {
    if (row.isFavourite) {
      return "bg-yellow-100";
    }

    switch (row.status) {
      case "Registration":
        return "bg-green-100";
      case "To Be Confirmed":
        return "bg-red-100";
      case "Enquiry Sent":
        return "bg-blue-100";
      default:
        return "";
    }
  };

  const sortByColumns: SortingState = [
    { id: "status", desc: true },
    { id: "createdOn", desc: false },
  ];

  const statusSortFn = (rowA: Row<Enquiry>, rowB: Row<Enquiry>) => {
    const statusA = rowA.original.status;
    const statusB = rowB.original.status;

    if (statusA && !statusB) {
      return -1;
    } else if (!statusA && statusB) {
      return 1;
    } else {
      return 0;
    }
  };

  const columnHelper = createColumnHelper<Enquiry>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("createdOn", {
        header: "Date",
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 100,
      }),
      columnHelper.accessor("school.id", {
        header: () => <SchoolIcon className="size-8 text-amber-800" />,
        cell: (info) => (
          <DropdownCell {...info} options={schools} objectColumnId="school" />
        ),
        size: 80,
      }),
      columnHelper.accessor("year", {
        header: "Year",
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 75,
      }),
      columnHelper.accessor("isFavourite", {
        header: () => <MoveHorizontal className="size-8 text-yellow-500" />,
        cell: (info) => <CheckboxCell {...info} />,
        size: 60,
      }),
      columnHelper.accessor("email", {
        header: "Email*",
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 200,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor("homeAddress", {
        header: "Home Address",
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 300,
      }),
      columnHelper.accessor("amAddress", {
        header: () => (
          <IconHeader
            icon={<ArrowBigUp className="size-8 fill-blue-700 text-blue-700" />}
            label="Pick Up Address"
          />
        ),
        cell: (info) => (
          <DisplayCell
            value={info.getValue()}
            icon={<ArrowBigUp className="size-8 fill-blue-700 text-blue-700" />}
          />
        ),
        size: 300,
      }),
      columnHelper.accessor("pmAddress", {
        header: () => (
          <IconHeader
            icon={
              <ArrowBigDown className="size-8 fill-orange-600 text-orange-600" />
            }
            label="Drop Off Address"
          />
        ),
        cell: (info) => (
          <DisplayCell
            value={info.getValue()}
            icon={
              <ArrowBigDown className="size-8 fill-orange-600 text-orange-600" />
            }
          />
        ),
        size: 300,
      }),
      columnHelper.accessor("remark", {
        header: "Remark*",
        cell: (info) => <TextInputCell {...info} textColour="text-red-600" />,
        size: 250,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor("block", {
        header: "Block*",
        cell: (info) => <TextInputCell {...info} />,
        size: 170,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor("fare", {
        header: () => <CircleDollarSign className="size-8 text-amber-500" />,
        cell: (info) => <NumberInputCell {...info} />,
        size: 80,
      }),
      columnHelper.accessor("amIcon", {
        header: "",
        cell: (info) => <TextInputCell {...info} textColour="text-blue-700" />,
        size: 40,
      }),
      columnHelper.accessor("amLocation.id", {
        id: "amLocationId",
        header: () => (
          <IconHeader
            icon={<ArrowBigUp className="size-8 fill-blue-700 text-blue-700" />}
            label="Pick Up Point"
          />
        ),
        cell: (info) => (
          <DropdownCell
            {...info}
            options={amLocations}
            objectColumnId="amLocation"
          />
        ),
        size: 400,
      }),
      columnHelper.accessor("amLocation.time", {
        header: () => <ClockArrowUp className="size-8 text-blue-700" />,
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 100,
      }),
      columnHelper.accessor("pmIcon", {
        header: "",
        cell: (info) => (
          <TextInputCell {...info} textColour="text-orange-600" />
        ),
        size: 40,
      }),
      columnHelper.accessor("pmLocation.id", {
        id: "pmLocationId",
        header: () => (
          <IconHeader
            icon={
              <ArrowBigDown className="size-8 fill-orange-600 text-orange-600" />
            }
            label="Drop Off Point"
          />
        ),
        cell: (info) => (
          <DropdownCell
            {...info}
            options={pmLocations}
            objectColumnId="pmLocation"
          />
        ),
        size: 400,
      }),
      columnHelper.accessor("pmLocation.time", {
        header: () => <ClockArrowDown className="size-8 text-orange-600" />,
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 100,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <DropdownCell
            {...info}
            options={enquiryStatus}
            objectColumnId="isEmailSent"
          />
        ),
        sortingFn: statusSortFn,
        size: 170,
      }),
      columnHelper.accessor("isEmailSent", {
        header: "Send Email",
        cell: (info) => <CheckboxCell {...info} />,
        size: 75,
      }),

      columnHelper.display({
        id: "select",
        header: () => <Trash2 className="size-8" />,
        cell: RowSelectCell,
        size: 60,
      }),
    ],
    [columnHelper, schools, enquiryStatus, amLocations, pmLocations]
  );
  return (
    <EditableTable<Enquiry, any>
      columns={columns}
      data={data}
      updateCellAction={updateEnquiry}
      deleteRowsAction={deleteEnquiries}
      getRowColour={(row) => getStatusRowColour(row)}
      enableSearching={true}
      sortByColumns={sortByColumns}
    />
  );
}
