// "use client";

// import { createColumnHelper } from "@tanstack/react-table";

// import { useMemo } from "react";

// import DisplayCell from "@/components/table/DisplayCell";
// import DropdownCell from "@/components/table/DropdownCell";
// import EditableTable from "@/components/table/EditableTable";
// import NumberInputCell from "@/components/table/NumberInputCell";
// import TextInputCell from "@/components/table/TextInputCell";
// import { Bus } from "@/lib/services/bus";
// import { Location } from "@/lib/services/location";

// interface LocationTableProps {
//   data: Location[];
//   buses: { value: string; label: string; object: Bus }[];
// }

// export default function LocationTable({ data, buses }: LocationTableProps) {
//   const columnHelper = createColumnHelper<Location>();

//   const columns = useMemo(
//     () => [
//       columnHelper.accessor("busId", {
//         header: "Bus",
//         cell: (info) => (
//           <DropdownCell {...info} options={buses} objectColumnId="bus" />
//         ),
//         size: 80,
//       }),
//       columnHelper.accessor("students", {
//         header: "Block",
//         cell: (info) => (
//           <div className="p-2 space-y-1">
//             {info.getValue().map((student) => (
//               <div key={student.id} className="text-sm">
//                 <span className="font-medium">{student.block}</span>
//               </div>
//             ))}
//           </div>
//         ),
//         size: 100,
//       }),
//       columnHelper.accessor("address", {
//         header: "Address",
//         cell: (info) => <TextInputCell {...info} />,
//         size: 300,
//       }),
//       columnHelper.accessor("time", {
//         header: "Time",
//         cell: (info) => <TextInputCell {...info} />,
//         size: 100,
//       }),
//       columnHelper.accessor("position", {
//         header: "Position",
//         cell: (info) => <NumberInputCell {...info} />,
//         size: 50,
//       }),
//       columnHelper.accessor("students", {
//         header: "Students",
//         cell: (info) => (
//           <div className="p-2 space-y-1">
//             {info.getValue().map((student) => (
//               <div key={student.id} className="text-sm">
//                 <DisplayCell value={student.fullName} />
//               </div>
//             ))}
//           </div>
//         ),
//         size: 200,
//       }),
//     ],
//     []
//   );
//   return (
//     <EditableTable<Location, any>
//       columns={columns}
//       data={data}
//       updateCellAction={async (id, dataUpdate) => {}}
//       deleteRowsAction={async (ids) => {}}
//     />
//   );
// }
