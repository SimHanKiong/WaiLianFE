import Header from "@/components/Header";
import { readBuses } from "@/lib/services/bus";
import BusTable from "./BusTable";

export default async function Page() {
  const buses = await readBuses();

  return (
    <div className="container mx-auto max-w-full px-10 py-10">
      <Header title="Buses" />
      <BusTable data={buses} />
    </div>
  );
}
