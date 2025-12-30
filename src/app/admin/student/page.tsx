import DialogWrapper from "@/components/DialogWrapper";
import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { LocationType } from "@/lib/constants";
import { readBuses } from "@/lib/services/bus";
import { readLocations } from "@/lib/services/location";
import { readStudents } from "@/lib/services/student";

import AddLocationForm from "../AddLocationForm";
import DeleteLocationForm from "../DeleteLocationForm";
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
  const locations = [...amLocations, ...pmLocations].map((location) => ({
    value: location.id,
    label: location.address + " (" + location.type + ")",
  }));

  return (
    <PageContainer>
      <Header title="Students" />
      <div className="mb-4 flex flex-row justify-end gap-4 pb-2">
        <DialogWrapper
          openText="Add Location"
          title="Add a Location"
          buttonVariant="add"
        >
          <AddLocationForm />
        </DialogWrapper>
        <DialogWrapper
          openText="Delete Location"
          title="Delete a Location"
          buttonVariant="delete"
        >
          <DeleteLocationForm locations={locations} />
        </DialogWrapper>
      </div>
      <StudentTable
        data={students}
        amLocations={amLocationOptions}
        pmLocations={pmLocationOptions}
        buses={busOptions}
      />
    </PageContainer>
  );
}
