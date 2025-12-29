import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { readBuses } from "@/lib/services/bus";

import BusNavigation from "./BusNavigation";

export default async function Page() {
  const buses = await readBuses();

  return (
    <PageContainer>
      <Header title="Route" />
      <BusNavigation buses={buses} />
    </PageContainer>
  );
}
