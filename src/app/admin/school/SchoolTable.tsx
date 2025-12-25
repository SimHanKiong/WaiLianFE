"use client";

import { createColumnHelper } from "@tanstack/react-table";
import {
  ClockArrowDown,
  ClockArrowUp,
  MoveHorizontal,
  SchoolIcon,
  Trash2,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { useMemo } from "react";

import CheckboxCell from "@/components/table/CheckboxCell";
import ClipboardCell from "@/components/table/CopyCell";
import EditableTable from "@/components/table/EditableTable";
import EmailInputCell from "@/components/table/EmailInputCell";
import ImageDisplayCell from "@/components/table/ImageDisplayCell";
import ImageInputCell from "@/components/table/ImageInputCell";
import RowSelectCell from "@/components/table/RowSelectCell";
import TextInputCell from "@/components/table/TextInputCell";
import {
  School,
  createSchool,
  deleteSchools,
  updateSchool,
} from "@/lib/services/school";

interface SchoolTableProps {
  data: School[];
}

export default function SchoolTable({ data }: SchoolTableProps) {
  const getLink = (row: School) =>
    `${process.env.NEXT_PUBLIC_FE_URL}/enquiry/${row.id}`;

  const getRowColour = (row: School): string => {
    return row.isFavourite ? "bg-yellow-100" : "";
  };

  const columnHelper = createColumnHelper<School>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("isFavourite", {
        header: () => <MoveHorizontal className="size-6 text-yellow-500" />,
        cell: (info) => <CheckboxCell {...info} />,
        size: 50,
      }),
      columnHelper.accessor("name", {
        header: "School Name",
        cell: (info) => <TextInputCell {...info} />,
        size: 400,
      }),
      columnHelper.accessor("initial", {
        header: () => <SchoolIcon className="size-6 text-amber-800" />,
        cell: (info) => <TextInputCell {...info} />,
        size: 80,
      }),
      columnHelper.accessor("arrivalTime", {
        header: () => <ClockArrowUp className="size-6 text-blue-700" />,
        cell: (info) => <TextInputCell {...info} />,
        size: 80,
      }),
      columnHelper.accessor("departureTime", {
        header: () => <ClockArrowDown className="size-6 text-orange-600" />,
        cell: (info) => <TextInputCell {...info} />,
        size: 100,
      }),
      columnHelper.accessor("priceListKey", {
        header: "Price List Upload",
        cell: (info) => <ImageInputCell {...info} />,
        size: 300,
      }),
      columnHelper.accessor("priceListSignedUrl", {
        header: "View Price List",
        cell: (info) => <ImageDisplayCell {...info} />,
        size: 200,
      }),
      columnHelper.accessor("rulesKey", {
        header: "Rules and Regulations Upload",
        cell: (info) => <ImageInputCell {...info} />,
        size: 300,
      }),
      columnHelper.accessor("rulesSignedUrl", {
        header: "View Rules and Regulations",
        cell: (info) => <ImageDisplayCell {...info} />,
        size: 200,
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

      columnHelper.display({
        id: "link",
        header: "Copy Link",
        cell: ({ row }) => <ClipboardCell content={getLink(row.original)} />,
        size: 100,
      }),
      columnHelper.accessor("isFinalYear", {
        header: "Final Year",
        cell: (info) => <CheckboxCell {...info} />,
        size: 80,
      }),
      columnHelper.display({
        id: "select",
        header: () => <Trash2 className="size-6" />,
        cell: RowSelectCell,
        size: 50,
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
      isFavourite: false,
      priceListKey: null,
      rulesKey: null,
      priceListSignedUrl: null,
      rulesSignedUrl: null,
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
      getRowColour={getRowColour}
    />
  );
}
