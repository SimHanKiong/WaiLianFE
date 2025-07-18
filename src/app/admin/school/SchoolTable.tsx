"use client";

import CheckboxCell from "@/components/table/CheckboxCell";
import ClipboardCell from "@/components/table/CopyCell";
import { EditableTable } from "@/components/table/EditableTable";
import EmailInputCell from "@/components/table/EmailInputCell";
import RowSelectCell from "@/components/table/RowSelectCell";
import TextInputCell from "@/components/table/TextInputCell";
import {
  createSchool,
  deleteSchools,
  School,
  updateSchool,
} from "@/lib/services/school";
import { createColumnHelper } from "@tanstack/react-table";
import { v4 as uuidv4 } from "uuid";
import { useMemo } from "react";
import ImageInputCell from "@/components/table/ImageInputCell";
import ImageDisplayCell from "@/components/table/ImageDisplayCell";

interface SchoolTableProps {
  data: School[];
}

export default function SchoolTable({ data }: SchoolTableProps) {
  const getLink = (row: School) =>
    `${process.env.NEXT_PUBLIC_FE_URL}/enquiry/${row.id}`;

  const columnHelper = createColumnHelper<School>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "School Name",
        cell: (info) => <TextInputCell {...info} />,
        size: 400,
      }),
      columnHelper.accessor("initial", {
        header: "School Initials",
        cell: (info) => <TextInputCell {...info} />,
        size: 100,
      }),
      columnHelper.accessor("arrivalTime", {
        header: "Arrival Time",
        cell: (info) => <TextInputCell {...info} />,
        size: 100,
      }),
      columnHelper.accessor("departureTime", {
        header: "Departure Time",
        cell: (info) => <TextInputCell {...info} />,
        size: 100,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => <EmailInputCell {...info} />,
        size: 300,
      }),
      columnHelper.accessor("password", {
        header: "Password",
        cell: (info) => <TextInputCell {...info} />,
        size: 200,
      }),
      columnHelper.accessor("emailAttachmentKey", {
        header: "Email Upload",
        cell: (info) => <ImageInputCell {...info} />,
        size: 400,
      }),
      columnHelper.accessor("emailAttachmentSignedUrl", {
        header: "Email Attachment",
        cell: (info) => <ImageDisplayCell {...info} />,
        size: 200,
      }),
      columnHelper.display({
        id: "link",
        header: "Link",
        cell: ({ row }) => <ClipboardCell content={getLink(row.original)} />,
        size: 80,
      }),
      columnHelper.accessor("isFinalYear", {
        header: "Final Year",
        cell: (info) => <CheckboxCell {...info} />,
        size: 100,
      }),
      columnHelper.display({
        id: "select",
        cell: RowSelectCell,
        size: 80,
      }),
    ],
    [columnHelper]
  );

  const getNewSchool = (): School => {
    return {
      id: uuidv4(),
      name: "",
      initial: "",
      arrivalTime: "",
      departureTime: "",
      email: null,
      password: "",
      isFinalYear: false,
      emailAttachmentKey: null,
    };
  };

  return (
    <EditableTable<School, any>
      columns={columns}
      data={data}
      addRowAction={createSchool}
      getNewRowData={getNewSchool}
      updateCellAction={updateSchool}
      deleteRowsAction={deleteSchools}
      enableSearching={false}
    />
  );
}
