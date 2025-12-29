"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { CSSProperties, useEffect, useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData = RowData> {
    updateData: (rowId: string, columnId: string, value: unknown) => void;
    updateNestedData: (
      columnId: string,
      matchId: string,
      newObject: unknown,
      value: unknown,
      serverAction?: (
        id: string,
        dataUpdate: Record<string, unknown>
      ) => Promise<void>
    ) => void;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData = RowData, TValue = unknown> {
    cellStyle?: CSSProperties;
  }
}

export interface DataWithId {
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
  enableSearching?: boolean;
  sortByColumns?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
}

export default function EditableTable<TData extends DataWithId, TValue>({
  columns,
  data,
  addRowAction,
  getNewRowData,
  updateCellAction,
  deleteRowsAction,
  getRowColour,
  enableSearching = false,
  sortByColumns,
  initialColumnFilters,
}: EditableTableProps<TData, TValue>) {
  const [tableData, setTableData] = useState(data);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>(sortByColumns ?? []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialColumnFilters ?? []
  );

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
    state: { globalFilter, sorting, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    defaultColumn: {
      enableGlobalFilter: false,
    },
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
      updateNestedData: (
        columnId: string,
        matchId: string,
        newObject: unknown,
        value: unknown,
        serverAction?: (
          id: string,
          dataUpdate: Record<string, unknown>
        ) => Promise<void>
      ) => {
        setTableData((prev) =>
          prev.map((row) => {
            const obj = (row as any)[columnId];
            if (!obj || obj.id !== matchId) {
              return row;
            }
            return { ...row, [columnId]: newObject };
          })
        );
        if (serverAction) {
          serverAction(matchId, value as Record<string, unknown>);
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
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm"
          />
        </div>
      )}
      <div className="relative max-h-[70vh] overflow-auto">
        <Table className="w-full table-fixed rounded-lg border border-gray-400 shadow-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="sticky top-0 z-10 border border-gray-400 bg-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-900"
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={getRowColour?.(row.original)}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border border-gray-400 p-0 text-sm text-gray-900"
                      style={{
                        width: `${cell.column.getSize()}px`,
                        ...cell.column.columnDef.meta?.cellStyle,
                      }}
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
      <div className="w-full rounded-md border border-gray-100 p-4 text-right shadow-sm">
        {addRowAction && getNewRowData ? (
          <Button
            variant="add"
            className="mr-2"
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
          variant="delete"
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
