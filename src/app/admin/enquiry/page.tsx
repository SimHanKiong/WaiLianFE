import DialogWrapper from "@/components/DialogWrapper";
import { readEnquiries } from "@/lib/services/enquiry";
import EnquiryTable from "./EnquiryTable";
import { readSchools } from "@/lib/services/school";
import { readLocations } from "@/lib/services/location";
import { EnquiryStatus } from "@/lib/constants";
import AddLocationForm from "./AddLocationForm";
import DeleteLocationForm from "./DeleteLocationForm";

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
    object: false,
  }));
  const locations = [...amLocations, ...pmLocations].map((location) => ({
    value: location.id,
    label: location.address + " (" + location.type + ")",
  }));

  return (
    <div className="container mx-auto py-10 px-10 max-w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-2">
        Enquiries
      </h1>
      <div className="flex flex-row gap-4 pb-2 mb-4 justify-end">
        <DialogWrapper
          openText="Add Location"
          title="Add a Location"
          buttonStyle="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md shadow-md"
        >
          <AddLocationForm />
        </DialogWrapper>
        <DialogWrapper
          openText="Delete Location"
          title="Delete a Location"
          buttonVariant="secondary"
        >
          <DeleteLocationForm locations={locations} />
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
