"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { CSSProperties, useEffect, useState } from "react";

import Link from "next/link";

import { cn } from "@/lib/utils";

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

const adjustTimeField = (time: string, minutes: number) => {
  const [h, m, s] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m + minutes, s);
  return date.toTimeString().slice(0, 8);
};

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
  timeField?: keyof TData;
  invisibleColumns?: string[];
  toggleColumns?: string[];
  getMergeRowsColumnId?: (row: TData) => string | null;
  linkButton?: {
    label: string;
    href: string;
  };
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
  timeField,
  invisibleColumns = [],
  toggleColumns,
  getMergeRowsColumnId,
  linkButton,
}: EditableTableProps<TData, TValue>) {
  const [tableData, setTableData] = useState(data);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>(sortByColumns ?? []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialColumnFilters ?? []
  );
  const [showDetails, setShowDetails] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const hidden = [...invisibleColumns, ...(toggleColumns ?? [])];
      return hidden.reduce((acc, column) => ({ ...acc, [column]: false }), {});
    }
  );

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    if (toggleColumns) {
      setColumnVisibility((prev) => {
        const updated = { ...prev };
        toggleColumns.forEach((col) => {
          updated[col] = showDetails;
        });
        return updated;
      });
    }
  }, [showDetails, toggleColumns]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { globalFilter, sorting, columnFilters, columnVisibility },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
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

  const handleTimeFieldChange = (minutes: number) => {
    if (!timeField) return;
    selectedRows.forEach((row) => {
      const currentTime = row.original[timeField] as string;
      if (currentTime) {
        const newTime = adjustTimeField(currentTime, minutes);
        setTableData((prev) =>
          prev.map((r) =>
            r.id === row.original.id ? { ...r, [timeField]: newTime } : r
          )
        );
        updateCellAction(row.original.id, {
          [timeField]: newTime,
        } as Partial<TData>);
      }
    });
  };

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
              table.getRowModel().rows.map((row, index) => {
                const rows = table.getRowModel().rows;

                let isPrevSibling = false;
                let isNextSibling = false;

                if (getMergeRowsColumnId) {
                  const currentId = getMergeRowsColumnId(row.original);
                  const prevId =
                    index > 0
                      ? getMergeRowsColumnId(rows[index - 1].original)
                      : null;
                  const nextId =
                    index < rows.length - 1
                      ? getMergeRowsColumnId(rows[index + 1].original)
                      : null;
                  isPrevSibling =
                    currentId !== null &&
                    currentId !== undefined &&
                    currentId === prevId;
                  isNextSibling =
                    currentId !== null &&
                    currentId !== undefined &&
                    currentId === nextId;
                }

                return (
                  <TableRow
                    key={row.id}
                    className={cn(
                      getRowColour?.(row.original),
                      isNextSibling && "border-b-0"
                    )}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "p-0 text-sm text-gray-900",
                          isPrevSibling
                            ? "border-l border-r border-b border-gray-400"
                            : "border border-gray-400",
                          isNextSibling && "border-b-0"
                        )}
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
                );
              })
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
        {linkButton && (
          <Button variant="link" className="mr-2">
            <Link href={linkButton.href}>{linkButton.label}</Link>
          </Button>
        )}
        {toggleColumns && toggleColumns.length > 0 && (
          <Button
            variant="default"
            className="mr-2"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
        )}
        {timeField && (
          <>
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => handleTimeFieldChange(-1)}
            >
              -1
            </Button>
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => handleTimeFieldChange(1)}
            >
              +1
            </Button>
          </>
        )}
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

      {/* <pre>{JSON.stringify(tableData, null, 2)}</pre> */}
    </div>
  );
}
