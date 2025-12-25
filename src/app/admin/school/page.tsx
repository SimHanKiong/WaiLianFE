import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { readSchools } from "@/lib/services/school";

import SchoolTable from "./SchoolTable";

export default async function Page() {
  const schools = await readSchools();

  return (
    <PageContainer>
      <Header title="Schools" />
      <SchoolTable data={schools} />
    </PageContainer>
  );
}
