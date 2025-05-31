"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData = RowData> {
    updateData: (rowId: string, columnId: string, value: unknown) => void;
  }
}

interface DataWithId {
  id: string;
}

interface EditableTableProps<TData extends DataWithId, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addRowAction?: (dataCreate: TData) => Promise<void>;
  getNewRowData?: () => TData;
  updateCellAction: (id: string, dataUpdate: Partial<TData>) => Promise<void>;
  deleteRowsAction: (ids: string[]) => Promise<void>;
  getRowColour?: (row: TData) => string;
  enableSearching: boolean;
}

export function EditableTable<TData extends DataWithId, TValue>({
  columns,
  data,
  addRowAction,
  getNewRowData,
  updateCellAction,
  deleteRowsAction,
  getRowColour,
  enableSearching,
}: EditableTableProps<TData, TValue>) {
  const [tableData, setTableData] = useState(data);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    meta: {
      updateData: (
        rowId: string,
        columnId: string,
        value: unknown,
        updateServer: boolean = true
      ) => {
        setTableData((prev) =>
          prev.map((row) =>
            row.id === rowId ? { ...row, [columnId]: value } : row
          )
        );
        if (updateServer) {
          updateCellAction(rowId, { [columnId]: value } as Partial<TData>);
        }
      },
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;

  return (
    <div className="rounded-lg border">
      {enableSearching && (
        <div className="p-4">
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
          />
        </div>
      )}
      <div className="overflow-auto relative max-h-[70vh]">
        <Table className="w-full border border-gray-200 rounded-lg shadow-sm table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-3 py-2
                   text-left text-sm font-semibold text-gray-600 border sticky top-0 z-10 bg-gray-100"
                    style={{ width: `${header.getSize()}px` }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`${
                    getRowColour?.(row.original) ||
                    (index % 2 === 0 ? "" : "bg-gray-50")
                  } hover:bg-gray-100`}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-0 py-2 text-sm text-gray-700 border"
                      style={{ width: `${cell.column.getSize()}px` }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-4 py-2 text-center text-gray-500"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="w-full p-4 border border-gray-100 rounded-md shadow-sm text-right">
        <Button
          variant="default"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2"
          onClick={() => {
            const idsToDelete = selectedRows.map((row) => row.original.id);
            setTableData((prev) =>
              prev.filter((row) => !idsToDelete.includes(row.id))
            );
            deleteRowsAction(idsToDelete);
            table.resetRowSelection();
          }}
        >
          Delete Rows
        </Button>
        {addRowAction && getNewRowData ? (
          <Button
            variant="default"
            onClick={() => {
              const addRowData = getNewRowData();
              setTableData((prev) => [...prev, addRowData]);
              addRowAction(addRowData);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add Row
          </Button>
        ) : null}
      </div>

      <pre>{JSON.stringify(tableData, null, 2)}</pre>
    </div>
  );
}
