"use client";

import DisplayCell from "@/components/table/DisplayCell";
import DropdownCell from "@/components/table/DropdownCell";
import EditableTable from "@/components/table/EditableTable";
import RowSelectCell from "@/components/table/RowSelectCell";
import { Gender } from "@/lib/constants";
import { deleteStudents, Student, updateStudent } from "@/lib/services/student";
import { createColumnHelper, Row, SortingState } from "@tanstack/react-table";
import {
  ArrowBigDown,
  ArrowBigUp,
  School,
  HousePlus,
  FileUser,
  CircleDollarSign,
  CirclePercent,
  ClockArrowUp,
  ClockArrowDown,
} from "lucide-react";
import { useMemo } from "react";
import { Location } from "@/lib/services/location";
import IconHeader from "@/components/table/IconHeader";

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
      columnHelper.accessor("school.initial", {
        header: () => <IconHeader icon={School} label="School" />,
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 200,
      }),
      columnHelper.accessor("block", {
        header: () => <IconHeader icon={HousePlus} label="Block" />,
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 200,
        sortingFn: blockSortFn,
      }),
      columnHelper.accessor("fullName", {
        header: () => <IconHeader icon={FileUser} label="Student Name" />,
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
      columnHelper.accessor("parent.fare", {
        header: () => <IconHeader icon={CircleDollarSign} label="Bus Fare $" />,
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 120,
      }),
      columnHelper.accessor("parent.underFas", {
        header: () => <IconHeader icon={CirclePercent} label="FAS" />,
        cell: ({ row }) => (
          <DisplayCell value={row.original.parent.underFas ? "Yes" : "No"} />
        ),
        size: 100,
      }),
      columnHelper.accessor("amLocation.id", {
        id: "amLocationId",
        header: () => <IconHeader icon={ArrowBigUp} label="Pick Up Point" />,
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
        header: () => <IconHeader icon={ClockArrowUp} label="Pick Up Time" />,
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 100,
      }),
      columnHelper.accessor("pmLocation.id", {
        id: "pmLocationId",
        header: () => <IconHeader icon={ArrowBigDown} label="Drop Off Point" />,
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
        header: () => <IconHeader icon={ClockArrowDown} label="Drop Off Time" />,
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
