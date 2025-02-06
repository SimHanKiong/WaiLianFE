import DialogWrapper from "@/components/DialogWrapper";
import LocationForm from "./LocationForm";
import { readEnquiries } from "@/lib/services/enquiry";
import EnquiryTable from "./EnquiryTable";
import { readSchools } from "@/lib/services/school";
import { readLocations } from "@/lib/services/location";
import { EnquiryStatus } from "@/lib/constants";

export default async function Page() {
  console.time("Data Fetching Time"); // Start measuring overall fetching time

  console.time("Enquiries Fetch Time");
  const enquiries = await readEnquiries();
  console.timeEnd("Enquiries Fetch Time");

  console.time("Schools Fetch Time");
  const schools = await readSchools();
  const schoolOptions = schools.map((school) => ({
    value: school.id,
    label: school.initial,
  }));
  console.timeEnd("Schools Fetch Time");

  console.time("AM Locations Fetch Time");
  const amLocations = await readLocations("AM");
  const amLocationOptions = amLocations.map((amLocation) => ({
    value: amLocation.id,
    label: amLocation.address,
    // object: amLocation,
  }));
  console.timeEnd("AM Locations Fetch Time");

  console.time("PM Locations Fetch Time");
  const pmLocations = await readLocations("PM");
  const pmLocationOptions = pmLocations.map((pmLocation) => ({
    value: pmLocation.id,
    label: pmLocation.address,
    // object: pmLocation,
  }));
  console.timeEnd("PM Locations Fetch Time");

  const enquiryStatus = EnquiryStatus.map((enquiry) => ({
    value: enquiry,
    label: enquiry,
  }));

  console.timeEnd("Data Fetching Time"); // End overall fetching time

  return (
    <div className="container mx-auto py-10 px-10 max-w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-2">
        Enquiries
      </h1>
      <div className="pb-2 mb-4">
        <DialogWrapper openText="Add Location" title="Add a Location">
          <LocationForm />
        </DialogWrapper>
      </div>
      <EnquiryTable
        data={enquiries}
        enquiryStatus={enquiryStatus}
        schools={schoolOptions}
        amLocations={amLocationOptions}
        pmLocations={pmLocationOptions}
      />
    </div>
  );
}
