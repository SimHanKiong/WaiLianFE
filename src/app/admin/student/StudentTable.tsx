"use client";

import { Row, SortingState, createColumnHelper } from "@tanstack/react-table";
import {
  ArrowBigDown,
  ArrowBigDownDash,
  ArrowBigUp,
  ArrowBigUpDash,
  CircleDollarSign,
  ClockArrowDown,
  ClockArrowUp,
  Mail,
  MessageCircleMore,
  MessageSquareShare,
  MoveHorizontal,
  School,
  SquarePen,
  Trash2,
} from "lucide-react";

import { useCallback, useMemo } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import CheckboxCell from "@/components/table/CheckboxCell";
import DisplayCell from "@/components/table/DisplayCell";
import DropdownCell from "@/components/table/DropdownCell";
import EditableTable from "@/components/table/EditableTable";
import IconHeader from "@/components/table/IconHeader";
import RowSelectCell from "@/components/table/RowSelectCell";
import TextInputCell from "@/components/table/TextInputCell";
import { Gender } from "@/lib/constants";
import { Bus } from "@/lib/services/bus";
import { Location, updateLocation } from "@/lib/services/location";
import { Student, deleteStudents, updateStudent } from "@/lib/services/student";

interface StudentTableProps {
  data: Student[];
  amLocations: { value: string; label: string; object: Location }[];
  pmLocations: { value: string; label: string; object: Location }[];
  buses: { value: string; label: string; object: Bus | null }[];
}

export default function StudentTable({
  data,
  amLocations,
  pmLocations,
  buses,
}: StudentTableProps) {
  const router = useRouter();

  const getRowColour = (row: Student): string => {
    return row.isFavourite ? "bg-yellow-100" : "";
  };

  const getWhatsappLink = (phoneNumber: string) => {
    return `https://wa.me/65${phoneNumber}`;
  };
  const getStudentName = (student: Student) => {
    return `${student.gender == Gender.MALE ? "🚹" : "🚺"} ${student.fullName} (${student.givenName})`;
  };
  const getClass = (student: Student) => {
    return `${student.level} ${student.className}`;
  };
  const getContactUse = (student: Student) => {
    return `${student.block}${student.gender == Gender.MALE ? "🚹" : "🚺"}${student.givenName}`;
  };

  const updateLocationAction = useCallback(
    async (id: string, dataUpdate: Record<string, unknown>) => {
      await updateLocation(id, dataUpdate);
      router.refresh();
    },
    [router]
  );

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
        header: () => <School className="size-6 text-amber-800" />,
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 70,
      }),
      columnHelper.accessor("parent.email", {
        header: "Mail",
        cell: (info) => (
          <div className="flex justify-center">
            <a href={`mailto:${info.getValue()}`}>
              <Mail className="size-5 stroke-1" />
            </a>
          </div>
        ),
        size: 60,
      }),
      columnHelper.accessor("parent.contact1No", {
        header: () => <MessageSquareShare className="size-6 text-green-500" />,
        cell: (info) => (
          <div className="flex justify-center">
            <a
              href={getWhatsappLink(info.getValue())}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircleMore className="size-5 stroke-1 text-green-500" />
            </a>
          </div>
        ),
        size: 50,
      }),
      columnHelper.accessor("id", {
        header: "Edit",
        cell: (info) => (
          <div className="flex justify-center">
            <Link
              href={`/admin/student/edit/${info.getValue()}`}
              target="_self"
            >
              <SquarePen className="size-5 stroke-1 text-rose-600" />
            </Link>
          </div>
        ),
        size: 60,
      }),
      columnHelper.accessor("isFavourite", {
        header: () => (
          <MoveHorizontal className="size-6 text-yellow-500 stroke-3" />
        ),
        cell: (info) => <CheckboxCell {...info} />,
        size: 50,
      }),
      columnHelper.display({
        id: "#",
        header: "S/No.",
        cell: ({ row }) => <DisplayCell value={row.index + 1} />,
        size: 60,
      }),
      columnHelper.accessor("amLocation.bus.id", {
        header: () => <ArrowBigUpDash className="size-6 text-blue-700" />,
        cell: (info) => (
          <DropdownCell
            {...info}
            options={buses}
            objectColumnId="amLocation.bus"
            backgroundColour={info.row.original.amLocation?.bus?.colour}
            buttonClassName="font-bold"
            serverUpdate={{
              id: info.row.original.amLocation?.id ?? "",
              field: "busId",
              action: updateLocationAction,
            }}
          />
        ),
        size: 60,
      }),
      columnHelper.accessor("pmLocation.bus.id", {
        id: "pmLocationBusId",
        header: () => <ArrowBigDownDash className="size-6 text-orange-600" />,
        cell: (info) => (
          <DropdownCell
            {...info}
            options={buses}
            objectColumnId="pmLocation.bus"
            backgroundColour={info.row.original.pmLocation?.bus?.colour}
            buttonClassName="font-bold"
            serverUpdate={{
              id: info.row.original.pmLocation?.id ?? "",
              field: "busId",
              action: updateLocationAction,
            }}
          />
        ),
        size: 60,
      }),
      columnHelper.accessor("block", {
        header: "Block",
        cell: (info) => <TextInputCell {...info} className="font-bold" />,
        size: 170,
        sortingFn: blockSortFn,
      }),
      columnHelper.accessor("fullName", {
        header: "Student Name",
        cell: ({ row }) => <DisplayCell value={getStudentName(row.original)} />,
        size: 400,
      }),
      columnHelper.display({
        id: "levelClass",
        header: "Class",
        cell: ({ row }) => <DisplayCell value={getClass(row.original)} />,
        size: 120,
      }),
      columnHelper.accessor("parent.fare", {
        header: () => <CircleDollarSign className="size-6 text-amber-500" />,
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 50,
      }),
      columnHelper.accessor("parent.underFas", {
        header: "FAS",
        cell: ({ row }) => (
          <DisplayCell value={row.original.parent.underFas ? "Yes" : "No"} />
        ),
        size: 100,
      }),

      columnHelper.accessor("amIcon", {
        header: "",
        cell: (info) => <TextInputCell {...info} className="text-blue-700" />,
        size: 40,
      }),
      columnHelper.accessor("amLocation.id", {
        id: "amLocationId",
        header: () => (
          <IconHeader
            icon={<ArrowBigUp className="size-6 fill-blue-700 text-blue-700" />}
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
      columnHelper.accessor("amLocation.timeReach", {
        header: () => <ClockArrowUp className="size-6 text-blue-700" />,
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 80,
      }),
      columnHelper.accessor("pmIcon", {
        header: "",
        cell: (info) => <TextInputCell {...info} className="text-orange-600" />,
        size: 40,
      }),
      columnHelper.accessor("pmLocation.id", {
        id: "pmLocationId",
        header: () => (
          <IconHeader
            icon={
              <ArrowBigDown className="size-6 fill-orange-600 text-orange-600" />
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
      columnHelper.accessor("pmLocation.timeReach", {
        header: () => <ClockArrowDown className="size-6 text-orange-600" />,
        cell: (info) => <DisplayCell value={info.getValue()} />,
        size: 80,
      }),
      columnHelper.display({
        id: "Select",
        header: () => <Trash2 className="size-6" />,
        cell: RowSelectCell,
        size: 50,
      }),
      columnHelper.display({
        id: "Contact Use",
        header: "Contact Use",
        cell: ({ row }) => <DisplayCell value={getContactUse(row.original)} />,
        size: 200,
      }),
      columnHelper.accessor("remark", {
        header: "Remark",
        cell: (info) => <TextInputCell {...info} className="text-red-600" />,
        size: 250,
      }),
    ],
    [columnHelper, amLocations, pmLocations, buses, updateLocationAction]
  );
  return (
    <EditableTable<Student, any>
      columns={columns}
      data={data}
      updateCellAction={updateStudent}
      deleteRowsAction={deleteStudents}
      sortByColumns={sortByColumns}
      getRowColour={getRowColour}
    />
  );
}
