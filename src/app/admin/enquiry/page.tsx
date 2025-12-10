import DialogWrapper from "@/components/DialogWrapper";
import { readEnquiries } from "@/lib/services/enquiry";
import EnquiryTable from "./EnquiryTable";
import { readSchools } from "@/lib/services/school";
import { readLocations } from "@/lib/services/location";
import Header from "@/components/Header";
import { EnquiryStatus } from "@/lib/constants";
import AddLocationForm from "./AddLocationForm";
import DeleteLocationForm from "./DeleteLocationForm";

export default async function Page() {
  const [enquiries, schools, amLocations, pmLocations] = await Promise.all([
    readEnquiries(),
    readSchools(),
    readLocations("AM", "address"),
    readLocations("PM", "address"),
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
    <div className="container mx-auto max-w-full px-10 py-10">
      <Header title="Enquiries" />
      <div className="mb-4 flex flex-row justify-end gap-4 pb-2">
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
