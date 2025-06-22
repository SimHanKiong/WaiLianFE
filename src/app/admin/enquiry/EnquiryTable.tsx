"use client";

import { EditableTable } from "@/components/table/EditableTable";
import { createColumnHelper } from "@tanstack/react-table";
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
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

interface EnquiryTableProps {
  data: Enquiry[];
  schools: { value: string; label: string; object: unknown }[];
  enquiryStatus: { value: string; label: string; object: unknown }[];
  amLocations: { value: string; label: string; object: unknown }[];
  pmLocations: { value: string; label: string; object: unknown }[];
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

  const columnHelper = createColumnHelper<Enquiry>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("createdOn", {
        header: "Date",
        cell: (info) => <DisplayCell {...info} />,
        size: 100,
      }),
      columnHelper.accessor("isFavourite", {
        header: "",
        cell: (info) => <CheckboxCell {...info} />,
        size: 75,
      }),
      columnHelper.accessor("school.id", {
        header: "School",
        cell: (info) => (
          <DropdownCell {...info} options={schools} objectColumnId="school" />
        ),
        size: 100,
      }),
      columnHelper.accessor("year", {
        header: "Year",
        cell: (info) => <DisplayCell {...info} />,
        size: 75,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => <DisplayCell {...info} />,
        size: 200,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor("homePostalCode", {
        header: "Home Postal Code",
        cell: (info) => <DisplayCell {...info} />,
        size: 100,
      }),
      columnHelper.accessor("homeAddress", {
        header: "Home Address",
        cell: (info) => <DisplayCell {...info} />,
        size: 300,
      }),
      columnHelper.accessor("block", {
        header: "Block",
        cell: (info) => <TextInputCell {...info} />,
        size: 170,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor("remark", {
        header: "Remark",
        cell: (info) => <TextInputCell {...info} />,
        size: 250,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor("fare", {
        header: "Bus Fare ($)",
        cell: (info) => <NumberInputCell {...info} />,
        size: 80,
      }),
      columnHelper.accessor("amLocation.id", {
        id: "amLocationId",
        header: () => (
          <span className="flex items-center gap-1">
            <ArrowBigUp className="w-10 h-10 text-orange-500 fill-orange-500" />
            Pick Up Point
          </span>
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
        header: "Pick Up Time",
        cell: (info) => <DisplayCell {...info} />,
        size: 100,
      }),
      columnHelper.accessor("pmLocation.id", {
        id: "pmLocationId",
        header: () => (
          <span className="flex items-center gap-1">
            <ArrowBigDown className="w-10 h-10 text-blue-500 fill-blue-500" />
            Drop Off Point
          </span>
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
        header: "Drop Off Time",
        cell: (info) => <DisplayCell {...info} />,
        size: 100,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <DropdownCell
            {...info}
            options={enquiryStatus}
            objectColumnId="emailSent"
          />
        ),
        size: 170,
      }),
      columnHelper.accessor("isEmailSent", {
        header: "Send Email",
        cell: (info) => <CheckboxCell {...info} />,
        size: 75,
      }),
      columnHelper.accessor("amAddress", {
        header: () => (
          <span className="flex items-center gap-1">
            <ArrowBigUp className="w-10 h-10 text-orange-500 fill-orange-500" />
            Pick Up Address
          </span>
        ),
        cell: (info) => <DisplayCell {...info} />,
        size: 300,
      }),
      columnHelper.accessor("pmAddress", {
        header: () => (
          <span className="flex items-center gap-1">
            <ArrowBigDown className="w-10 h-10 text-blue-500 fill-blue-500" />
            Drop Off Address
          </span>
        ),
        cell: (info) => <DisplayCell {...info} />,
        size: 300,
      }),
      columnHelper.display({
        id: "select",
        cell: RowSelectCell,
        size: 75,
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
    />
  );
}
