import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { LocationType } from "@/lib/constants";
import { readBuses } from "@/lib/services/bus";
import { readLocations } from "@/lib/services/location";
import { readStudents } from "@/lib/services/student";

import StudentTable from "./StudentTable";

export default async function Page() {
  const [students, amLocations, pmLocations, buses] = await Promise.all([
    readStudents(),
    readLocations({ type: LocationType.AM, sortBy: "address" }),
    readLocations({ type: LocationType.PM, sortBy: "address" }),
    readBuses(),
  ]);

  const amLocationOptions = amLocations.map((amLocation) => ({
    value: amLocation.id,
    label: amLocation.address,
    object: amLocation,
  }));
  const pmLocationOptions = pmLocations.map((pmLocation) => ({
    value: pmLocation.id,
    label: pmLocation.address,
    object: pmLocation,
  }));
  const busOptions = [
    { value: "", label: "", object: null },
    ...buses.map((bus) => ({
      value: bus.id,
      label: bus.name,
      object: bus,
    })),
  ];

  return (
    <PageContainer>
      <Header title="Students" />
      <StudentTable
        data={students}
        amLocations={amLocationOptions}
        pmLocations={pmLocationOptions}
        buses={busOptions}
      />
    </PageContainer>
  );
}
