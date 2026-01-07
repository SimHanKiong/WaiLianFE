import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { LocationType, StudentStatusOptions } from "@/lib/constants";
import { readLocations } from "@/lib/services/location";
import { readSchools } from "@/lib/services/school";

import StudentForm from "../StudentForm";

export default async function Page() {
  const [schools, amLocations, pmLocations] = await Promise.all([
    readSchools(),
    readLocations({ type: LocationType.AM, sortBy: "address" }),
    readLocations({ type: LocationType.PM, sortBy: "address" }),
  ]);

  const amLocationOptions = amLocations.map((amLocation) => ({
    value: amLocation.id,
    label: amLocation.address,
  }));
  const pmLocationOptions = pmLocations.map((pmLocation) => ({
    value: pmLocation.id,
    label: pmLocation.address,
  }));
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
      <StudentForm
        schools={schoolOptions}
        amLocations={amLocationOptions}
        pmLocations={pmLocationOptions}
        studentStatus={studentStatus}
      />
    </PageContainer>
  );
}
