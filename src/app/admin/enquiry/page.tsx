import DialogWrapper from "@/components/DialogWrapper";
import LocationForm from "./LocationForm";
import { readEnquiries } from "@/lib/services/enquiry";
import EnquiryTable from "./EnquiryTable";
import { readSchools } from "@/lib/services/school";
import { readLocations } from "@/lib/services/location";
import { EnquiryStatus } from "@/lib/constants";

export default async function Page() {
  const [enquiries, schools, amLocations, pmLocations] = await Promise.all([
    readEnquiries(),
    readSchools(),
    readLocations("AM"),
    readLocations("PM"),
  ]);

  const schoolOptions = schools.map((school) => ({
    value: school.id,
    label: school.initial,
    object: school,
  }));
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
  const enquiryStatus = EnquiryStatus.map((enquiry) => ({
    value: enquiry,
    label: enquiry,
  }));

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
