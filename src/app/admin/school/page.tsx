import { readSchools } from "@/lib/services/school";
import SchoolTable from "./SchoolTable";
import Header from "@/components/Header";

export default async function Page() {
  const schools = await readSchools();

  return (
    <div className="container mx-auto max-w-full px-10 py-10">
      <Header title="Schools" />
      <SchoolTable data={schools} />
    </div>
  );
}
