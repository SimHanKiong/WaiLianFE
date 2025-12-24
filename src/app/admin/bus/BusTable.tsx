"use client";

import ColourPickerCell from "@/components/table/ColourPickerCell";
import EditableTable from "@/components/table/EditableTable";
import NumberInputCell from "@/components/table/NumberInputCell";
import RowSelectCell from "@/components/table/RowSelectCell";
import TextInputCell from "@/components/table/TextInputCell";
import { Bus, createBus, deleteBuses, updateBus } from "@/lib/services/bus";
import { createColumnHelper } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

interface BusTableProps {
  data: Bus[];
}

export default function BusTable({ data }: BusTableProps) {
  const columnHelper = createColumnHelper<Bus>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => <TextInputCell {...info} />,
        size: 500,
      }),
      columnHelper.accessor("amPlateNo", {
        header: "Pick Up Plate No",
        cell: (info) => <TextInputCell {...info} />,
        size: 400,
      }),
      columnHelper.accessor("amCapacity", {
        header: "Pick Up Capacity",
        cell: (info) => <NumberInputCell {...info} />,
        size: 300,
      }),
      columnHelper.accessor("pmPlateNo", {
        header: "Drop Off Plate No",
        cell: (info) => <TextInputCell {...info} />,
        size: 400,
      }),
      columnHelper.accessor("pmCapacity", {
        header: "Drop Off Capacity",
        cell: (info) => <NumberInputCell {...info} />,
        size: 300,
      }),
      columnHelper.display({
        id: "select",
        header: () => <Trash2 className=" size-6" />,
        cell: RowSelectCell,
        size: 50,
      }),
      columnHelper.accessor("colour", {
        header: "Colour",
        cell: (info) => <ColourPickerCell {...info} />,
        size: 500,
      }),
    ],
    [columnHelper]
  );

  const getNewBus = (): Bus => {
    return {
      id: uuidv4(),
      name: "",
      amPlateNo: "",
      amCapacity: 0,
      pmPlateNo: "",
      pmCapacity: 0,
      colour: "#000000",
    };
  };

  return (
    <EditableTable<Bus, any>
      columns={columns}
      data={data}
      updateCellAction={updateBus}
      deleteRowsAction={deleteBuses}
      addRowAction={createBus}
      getNewRowData={getNewBus}
    />
  );
}
