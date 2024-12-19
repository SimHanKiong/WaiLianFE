'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface DataWithId {
  id: string;
}

interface EditableTableProps<TData extends DataWithId, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addRowAction: () => Promise<void>;
  deleteRowsAction: (ids: string[]) => Promise<void>;
}

export function EditableTable<TData extends DataWithId, TValue>({
  columns,
  data,
  addRowAction,
  deleteRowsAction,
}: EditableTableProps<TData, TValue>) {
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  });

  const selectedRows = table.getSelectedRowModel().rows;

  return (
    <div className="rounded-lg border overflow-x-auto overflow-y-hidden">
      <Table className="w-full border border-gray-200 rounded-lg shadow-sm table-fixed">
        <TableHeader className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border"
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
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100`}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-4 py-2 text-sm text-gray-700 border"
                    style={{ width: `${cell.column.getSize()}px` }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
        <TableFooter className="bg-gray-100">
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="px-4 py-2 text-right"
            >
              {selectedRows.length > 0 && (
                <Button
                  variant="default"
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2"
                  onClick={() => {
                    deleteRowsAction(
                      selectedRows.map((row) => row.original.id)
                    );
                    table.resetRowSelection();
                  }}
                >
                  Delete Rows
                </Button>
              )}
              <Button
                variant="default"
                onClick={() => addRowAction()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Add Row
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
