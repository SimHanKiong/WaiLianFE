import { EditableTable } from '@/components/table/EditableTable';
import { schoolTableColumns } from './SchoolTableColumns';
import {
  createSchool,
  deleteSchools,
  readSchools,
  School,
} from '@/lib/services/school';

export default async function Page() {
  const schools = await readSchools();

  return (
    <div className="container mx-auto py-10 px-10 max-w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-2">
        Schools
      </h1>
      <EditableTable<School, any>
        columns={schoolTableColumns}
        data={schools}
        addRowAction={createSchool}
        deleteRowsAction={deleteSchools}
        enableSearching={false}
      />
    </div>
  );
}
