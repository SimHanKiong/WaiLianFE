"use client";

import { SortingState, createColumnHelper } from "@tanstack/react-table";

import { useMemo } from "react";

import CheckboxLinkCell from "@/components/table/CheckboxLinkCell";
import DisplayCell from "@/components/table/DisplayCell";
import DropdownCell from "@/components/table/DropdownCell";
import EditableTable from "@/components/table/EditableTable";
import RowSelectCell from "@/components/table/RowSelectCell";
import TextInputCell from "@/components/table/TextInputCell";
import { Gender, LocationType, LocationTypeType } from "@/lib/constants";
import { Bus } from "@/lib/services/bus";
import {
  Location,
  deleteLocations,
  updateLocation,
} from "@/lib/services/location";
import { Student } from "@/lib/services/student";

interface LocationTableProps {
  data: Location[];
  busId: string;
  type: LocationTypeType;
  buses: { value: string; label: string; object: Bus | null }[];
}

export default function LocationTable({
  data,
  busId,
  buses,
  type,
}: LocationTableProps) {
  const getStudentNameAndClass = (student: Student) => {
    const siblingSuffix = student.order == 0 ? "" : `-${student.order}`;
    return `${student.block}${student.gender == Gender.MALE ? "🚹" : "🚺"}${student.givenName}(${student.level} ${student.className}) ${siblingSuffix}`;
  };
  const getWhatsappLink = (phoneNumber: string) => {
    return `https://wa.me/65${phoneNumber}`;
  };

  const sortByColumns: SortingState = [{ id: "timeReach", desc: false }];

  const columnHelper = createColumnHelper<Location>();

  const columns = useMemo(() => {
    const amColumns = [
      columnHelper.accessor("busId", {
        header: "AM",
        cell: (info) => (
          <div className="py-1">
            <DropdownCell
              {...info}
              options={buses}
              objectColumnId="bus"
              buttonClassName="font-bold"
              textColour={info.row.original.bus?.colour}
            />
          </div>
        ),
        size: 50,
        meta: { cellStyle: { verticalAlign: "top" } },
        filterFn: (row, columnId, filterValue) => {
          return row.getValue(columnId) === filterValue;
        },
      }),
      columnHelper.display({
        id: "PM",
        header: "PM",
        cell: ({ row }) => (
          <div className="py-1 px-2 space-y-1">
            {row.original.students.map((student) => (
              <DisplayCell
                key={student.id}
                value={student.pmLocation?.bus?.name}
                className="font-bold"
                textColour={student.pmLocation?.bus?.colour}
              />
            ))}
          </div>
        ),
        size: 50,
      }),
    ];
    const pmColumns = [
      columnHelper.display({
        id: "AM",
        header: "AM",
        cell: ({ row }) => (
          <div className="py-1 px-2 space-y-1">
            {row.original.students.map((student) => (
              <DisplayCell
                key={student.id}
                value={student.amLocation?.bus?.name}
                className="font-bold"
                textColour={student.amLocation?.bus?.colour}
              />
            ))}
          </div>
        ),
        size: 50,
      }),
      columnHelper.accessor("busId", {
        header: "PM",
        cell: (info) => (
          <div className="py-1">
            <DropdownCell
              {...info}
              options={buses}
              objectColumnId="bus"
              buttonClassName="font-bold"
              textColour={info.row.original.bus?.colour}
            />
          </div>
        ),
        size: 50,
        meta: { cellStyle: { verticalAlign: "top" } },
        filterFn: (row, columnId, filterValue) => {
          return row.getValue(columnId) === filterValue;
        },
      }),
    ];

    return [
      ...(type === LocationType.AM ? amColumns : pmColumns),
      columnHelper.display({
        id: "Block",
        header: "Block",
        cell: ({ row }) => (
          <div className="py-1 px-2 space-y-1">
            {row.original.students.map((student) => (
              <DisplayCell
                key={student.id}
                value={student.block}
                className="font-bold"
              />
            ))}
          </div>
        ),
        size: 170,
      }),
      columnHelper.display({
        id: "#",
        header: "No.",
        cell: ({ row, table }) => {
          const sortedRows = table.getRowModel().rows;
          const sortedIndex = sortedRows.findIndex((r) => r.id === row.id);
          return <DisplayCell value={sortedIndex + 1} className="my-1" />;
        },
        size: 50,
        meta: { cellStyle: { verticalAlign: "top" } },
      }),
      columnHelper.accessor("address", {
        header: "Location",
        cell: (info) => (
          <div className="py-1">
            <TextInputCell {...info} />
          </div>
        ),
        size: 400,
        meta: { cellStyle: { verticalAlign: "top" } },
      }),
      columnHelper.accessor("timeReach", {
        header: "Time",
        cell: (info) => (
          <div className="py-1">
            <TextInputCell {...info} type="time" />
          </div>
        ),
        size: 120,
        meta: { cellStyle: { verticalAlign: "top" } },
      }),
      columnHelper.display({
        id: "Select",
        header: "+ / -",
        cell: (info) => (
          <div className="py-1">
            <RowSelectCell {...info} />
          </div>
        ),
        size: 50,
        meta: { cellStyle: { verticalAlign: "top" } },
      }),
      columnHelper.accessor("students", {
        header: ({ table }) => {
          const filteredRows = table.getFilteredRowModel().rows;
          const total = filteredRows.reduce(
            (sum, row) => sum + (row.original.students?.length || 0),
            0
          );
          return total;
        },
        cell: (info) => (
          <DisplayCell
            value={String(info.getValue().length)}
            className="my-1"
          />
        ),
        size: 40,
        meta: { cellStyle: { verticalAlign: "top" } },
      }),
      columnHelper.display({
        header: "Student Name & Class",
        cell: ({ row }) => (
          <div className="py-1 px-2 space-y-1">
            {row.original.students.map((student) => (
              <div key={student.id} className="text-sm">
                <DisplayCell value={getStudentNameAndClass(student)} />
              </div>
            ))}
          </div>
        ),
        size: 250,
      }),
      columnHelper.display({
        id: "Contact 1",
        cell: ({ row }) => (
          <div className="py-1 px-2 space-y-1">
            {row.original.students.map((student) => (
              <div key={student.id} className="text-sm">
                <CheckboxLinkCell
                  link={getWhatsappLink(student.parent.contact1No)}
                />
              </div>
            ))}
          </div>
        ),
        size: 50,
      }),
      columnHelper.display({
        id: "Contact 2",
        cell: ({ row }) => (
          <div className="py-1 px-2 space-y-1">
            {row.original.students.map((student) => (
              <div key={student.id} className="text-sm">
                <CheckboxLinkCell
                  link={getWhatsappLink(student.parent.contact2No)}
                />
              </div>
            ))}
          </div>
        ),
        size: 50,
      }),
    ];
  }, [columnHelper, buses, type]);
  return (
    <EditableTable<Location, any>
      columns={columns}
      data={data}
      updateCellAction={updateLocation}
      deleteRowsAction={deleteLocations}
      initialColumnFilters={[{ id: "busId", value: busId }]}
      sortByColumns={sortByColumns}
      timeField="timeReach"
    />
  );
}
