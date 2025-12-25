import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { readBuses } from "@/lib/services/bus";

import BusTable from "./BusTable";

export default async function Page() {
  const buses = await readBuses();

  return (
    <PageContainer>
      <Header title="Buses" />
      <BusTable data={buses} />
    </PageContainer>
  );
}
