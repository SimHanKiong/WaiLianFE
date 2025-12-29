import DialogWrapper from "@/components/DialogWrapper";
import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { EnquiryStatusOptions, LocationType } from "@/lib/constants";
import { readEnquiries } from "@/lib/services/enquiry";
import { readLocations } from "@/lib/services/location";
import { readSchools } from "@/lib/services/school";

import AddLocationForm from "./AddLocationForm";
import DeleteLocationForm from "./DeleteLocationForm";
import EnquiryTable from "./EnquiryTable";

export default async function Page() {
  const [enquiries, schools, amLocations, pmLocations] = await Promise.all([
    readEnquiries(),
    readSchools(),
    readLocations({ type: LocationType.AM, sortBy: "address" }),
    readLocations({ type: LocationType.PM, sortBy: "address" }),
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
  const enquiryStatus = [
    { value: "", label: "", object: false },
    ...EnquiryStatusOptions.map((status) => ({
      value: status,
      label: status,
      object: false,
    })),
  ];
  const locations = [...amLocations, ...pmLocations].map((location) => ({
    value: location.id,
    label: location.address + " (" + location.type + ")",
  }));

  return (
    <PageContainer>
      <Header title="Enquiries" />
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
      <EnquiryTable
        data={enquiries}
        enquiryStatus={enquiryStatus}
        schools={schoolOptions}
        amLocations={amLocationOptions}
        pmLocations={pmLocationOptions}
      />
    </PageContainer>
  );
}
