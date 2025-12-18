"use client";

import DisplayCell from "@/components/table/DisplayCell";
import DropdownCell from "@/components/table/DropdownCell";
import EditableTable from "@/components/table/EditableTable";
import RowSelectCell from "@/components/table/RowSelectCell";
import TextInputCell from "@/components/table/TextInputCell";
import { Gender } from "@/lib/constants";
import { deleteStudents, Student, updateStudent } from "@/lib/services/student";
import { createColumnHelper, Row, SortingState } from "@tanstack/react-table";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useMemo } from "react";
import { Location } from "@/lib/services/location";

interface StudentTableProps {
  data: Student[];
  amLocations: { value: string; label: string; object: Location }[];
  pmLocations: { value: string; label: string; object: Location }[];
}

export default function StudentTable({
  data,
  amLocations,
  pmLocations,
}: StudentTableProps) {
  const sortByColumns: SortingState = [{ id: "block", desc: false }];

  const blockSortFn = (rowA: Row<Student>, rowB: Row<Student>) => {
    const blockA = rowA.original.block;
    const blockB = rowB.original.block;

    if (!blockA && !blockB) {
      return 0;
    } else if (!blockA) {
      return 1;
    } else if (!blockB) {
      return -1;
    }

    const matchA = blockA.match(/^(\d+)(.*)$/);
    const matchB = blockB.match(/^(\d+)(.*)$/);
    const numA = matchA ? parseInt(matchA[1]) : 0;
    const numB = matchB ? parseInt(matchB[1]) : 0;
    const textA = matchA ? matchA[2] : blockA;
    const textB = matchB ? matchB[2] : blockB;

    return numA === numB ? textA.localeCompare(textB) : numA - numB;
  };

  const columnHelper = createColumnHelper<Student>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("block", {
        header: "Block",
        cell: (info) => <TextInputCell {...info} />,
        size: 200,
        sortingFn: blockSortFn,
      }),
      columnHelper.accessor("fullName", {
        header: "Name",
        cell: ({ row }) => (
          <DisplayCell
            value={`${row.original.gender == Gender.MALE ? "🚹" : "🚺"} ${row.original.fullName}`}
          />
        ),
        size: 400,
      }),
      columnHelper.display({
        id: "levelClass",
        header: "Class",
        cell: ({ row }) => (
          <DisplayCell
            value={`${row.original.level} ${row.original.className}`}
          />
        ),
        size: 200,
      }),
      columnHelper.accessor("transportStartDate", {
        header: "Transport Start Date",
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 100,
      }),
      columnHelper.accessor("parent.underFas", {
        header: "Under FAS",
        cell: ({ row }) => (
          <DisplayCell value={row.original.parent.underFas ? "Yes" : "No"} />
        ),
        size: 100,
      }),
      columnHelper.accessor("amLocation.id", {
        id: "amLocationId",
        header: () => (
          <span className="flex items-center gap-1">
            <ArrowBigUp className="h-10 w-10 fill-orange-500 text-orange-500" />
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
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 100,
      }),
      columnHelper.accessor("pmLocation.id", {
        id: "pmLocationId",
        header: () => (
          <span className="flex items-center gap-1">
            <ArrowBigDown className="h-10 w-10 fill-blue-500 text-blue-500" />
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
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 100,
      }),
      columnHelper.display({
        id: "select",
        header: "Delete",
        cell: RowSelectCell,
        size: 75,
      }),
    ],
    [columnHelper, amLocations, pmLocations]
  );
  return (
    <EditableTable<Student, any>
      columns={columns}
      data={data}
      updateCellAction={updateStudent}
      deleteRowsAction={deleteStudents}
      sortByColumns={sortByColumns}
    />
  );
}
