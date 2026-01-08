import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { StudentStatusOptions } from "@/lib/constants";
import { readSchools } from "@/lib/services/school";

import StudentForm from "../StudentForm";

export default async function Page() {
  const schools = await readSchools();

  const schoolOptions = schools.map((school) => ({
    value: school.id,
    label: school.initial,
  }));
  const studentStatus = [
    { value: "", label: "" },
    ...StudentStatusOptions.map((status) => ({
      value: status,
      label: status,
    })),
  ];
  return (
    <PageContainer>
      <Header title="Add Student" />
      <StudentForm schools={schoolOptions} studentStatus={studentStatus} />
    </PageContainer>
  );
}
