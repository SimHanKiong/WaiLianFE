import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { readBuses } from "@/lib/services/bus";
import { readLocations } from "@/lib/services/location";
import { readStudents } from "@/lib/services/student";

import StudentTable from "./StudentTable";

export default async function Page() {
  const [students, amLocations, pmLocations, buses] = await Promise.all([
    readStudents(),
    readLocations("AM", "address"),
    readLocations("PM", "address"),
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
  const busOptions = buses.map((bus) => ({
    value: bus.id,
    label: bus.name,
    object: bus,
  }));

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
