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
import { EnquiryStatusType } from "@/lib/constants";
import { useMemo } from "react";

interface EnquiryTableProps {
  data: Enquiry[];
  schools: { value: string; label: string }[];
  enquiryStatus: { value: string; label: string }[];
  // amLocations: { value: string; label: string; object: unknown }[];
  // pmLocations: { value: string; label: string; object: unknown }[];
  amLocations: { value: string; label: string }[];
  pmLocations: { value: string; label: string }[];
}

export default function EnquiryTable({
  data,
  schools,
  enquiryStatus,
  amLocations,
  pmLocations,
}: EnquiryTableProps) {
  const getStatusRowColour = (status?: EnquiryStatusType | null): string => {
    if (!status) {
      return "";
    }

    switch (status) {
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
      columnHelper.accessor("school.id", {
        header: "School",
        cell: (info) => (
          <DropdownCell
            {...info}
            updateCellAction={updateEnquiry}
            options={schools}
          />
        ),
        size: 150,
      }),
      columnHelper.accessor("year", {
        header: "Year",
        cell: (info) => <DisplayCell {...info} />,
        size: 100,
      }),
      // columnHelper.accessor("date", {
      //   header: "Date",
      //   cell: (info) => (
      //     <TextInputCell {...info} updateCellAction={updateEnquiry} />
      //   ),
      //   size: 150,
      //   enableGlobalFilter: false,
      // }),
      columnHelper.accessor("block", {
        header: "Block",
        cell: (info) => <TextInputCell {...info} />,
        size: 100,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor("remark", {
        header: "Remark",
        cell: (info) => <TextInputCell {...info} />,
        size: 250,
      }),
      columnHelper.accessor("fare", {
        header: "Bus Fare",
        cell: (info) => (
          <NumberInputCell {...info} updateCellAction={updateEnquiry} />
        ),
        size: 100,
      }),
      columnHelper.accessor("amLocation.id", {
        id: "amLocationId",
        header: "Pick Up Point",
        cell: (info) => (
          <DropdownCell
            {...info}
            updateCellAction={updateEnquiry}
            options={amLocations}
            // objectColumnId="amLocation"
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
        header: "Drop Off Point",
        cell: (info) => (
          <DropdownCell
            {...info}
            updateCellAction={updateEnquiry}
            options={pmLocations}
            // objectColumnId="pmLocation"
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
            updateCellAction={updateEnquiry}
            options={enquiryStatus}
          />
        ),
        size: 250,
      }),
      columnHelper.display({
        id: "action",
        header: "Send Email",
        cell: RowSelectCell,
        size: 75,
      }),
      columnHelper.accessor("homeAddress", {
        header: "Home Address",
        cell: (info) => <DisplayCell {...info} />,
        size: 300,
      }),
      columnHelper.accessor("amAddress", {
        header: "Pick Up Address",
        cell: (info) => <DisplayCell {...info} />,
        size: 300,
      }),
      columnHelper.accessor("pmAddress", {
        header: "Drop Off Address",
        cell: (info) => <DisplayCell {...info} />,
        size: 300,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => <DisplayCell {...info} />,
        size: 200,
        enableGlobalFilter: true,
      }),
      columnHelper.display({
        id: "select",
        cell: RowSelectCell,
        size: 50,
      }),
    ],
    [columnHelper]
  );
  return (
    <EditableTable<Enquiry, any>
      columns={columns}
      data={data}
      updateCellAction={updateEnquiry}
      deleteRowsAction={deleteEnquiries}
      getRowColour={(row) => getStatusRowColour(row.status)}
      enableSearching={true}
    />
  );
}
