"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowData,
  SortingState,
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
  sortByColumns?: SortingState;
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
  sortByColumns,
}: EditableTableProps<TData, TValue>) {
  const [tableData, setTableData] = useState(data);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>(sortByColumns ?? []);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
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
        <Table className="w-full border border-gray-400 rounded-lg shadow-sm table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-3 py-2
                   text-left text-sm font-semibold text-gray-900 border sticky top-0 z-10 bg-gray-200 border-gray-400"
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
                    (index % 2 === 0 ? "" : "bg-gray-100")
                  } `}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-0 py-2 text-sm text-gray-900 border border-gray-400"
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
                  className="px-4 py-2 text-center text-gray-900"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="w-full p-4 border border-gray-100 rounded-md shadow-sm text-right">
        {addRowAction && getNewRowData ? (
          <Button
            variant="default"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
            onClick={() => {
              const addRowData = getNewRowData();
              setTableData((prev) => [...prev, addRowData]);
              addRowAction(addRowData);
            }}
          >
            Add Row
          </Button>
        ) : null}
        <Button
          variant="default"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
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
      </div>

      <pre>{JSON.stringify(tableData, null, 2)}</pre>
    </div>
  );
}
