import { readSchools } from '@/lib/services/school';
import SchoolTable from './SchoolTable';

export default async function Page() {
  const schools = await readSchools();

  return (
    <div className="container mx-auto py-10 px-10 max-w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-2">
        Schools
      </h1>
      <SchoolTable data={schools} />
    </div>
  );
}
