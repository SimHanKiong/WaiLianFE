import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { LocationType, StudentStatusOptions } from "@/lib/constants";
import { readLocations } from "@/lib/services/location";
import { readParent } from "@/lib/services/parent";
import { readSchools } from "@/lib/services/school";

import StudentForm from "../../StudentForm";

export default async function Page({
  params,
}: {
  params: Promise<{ parentId: string }>;
}) {
  const { parentId } = await params;

  const [schools, amLocations, pmLocations, parent] = await Promise.all([
    readSchools(),
    readLocations({ type: LocationType.AM, sortBy: "address" }),
    readLocations({ type: LocationType.PM, sortBy: "address" }),
    readParent(parentId),
  ]);

  const schoolOptions = schools.map((school) => ({
    value: school.id,
    label: school.initial,
  }));
  const amLocationOptions = [
    { value: "", label: "" },
    ...amLocations.map((amLocation) => ({
      value: amLocation.id,
      label: amLocation.address,
    })),
  ];
  const pmLocationOptions = [
    { value: "", label: "" },
    ...pmLocations.map((pmLocation) => ({
      value: pmLocation.id,
      label: pmLocation.address,
    })),
  ];
  const studentStatus = [
    { value: "", label: "" },
    ...StudentStatusOptions.map((status) => ({
      value: status,
      label: status,
    })),
  ];
  return (
    <PageContainer>
      <Header title="Edit Student" />
      <StudentForm
        schools={schoolOptions}
        studentStatus={studentStatus}
        amLocations={amLocationOptions}
        pmLocations={pmLocationOptions}
        parent={parent}
      />
    </PageContainer>
  );
}
