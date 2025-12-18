import Header from "@/components/Header";
import { readStudents } from "@/lib/services/student";
import StudentTable from "./StudentTable";
import { readLocations } from "@/lib/services/location";

export default async function Page() {
  const [students, amLocations, pmLocations] = await Promise.all([
    readStudents(),
    readLocations("AM", "address"),
    readLocations("PM", "address"),
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

  return (
    <div className="container mx-auto max-w-full px-10 py-10">
      <Header title="Students" />
      <StudentTable
        data={students}
        amLocations={amLocationOptions}
        pmLocations={pmLocationOptions}
      />
    </div>
  );
}
