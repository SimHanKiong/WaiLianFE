import DialogWrapper from '@/components/DialogWrapper';
import LocationForm from './LocationForm';
import { readEnquiries } from '@/lib/services/enquiry';
import EnquiryTable from './EnquiryTable';
import { readSchools } from '@/lib/services/school';
import { readLocations } from '@/lib/services/location';

export default async function Page() {
  const enquiries = await readEnquiries();

  const schools = await readSchools();
  const schoolOptions = schools.map((school) => ({
    value: school.id,
    label: school.initial,
  }));

  const amLocations = await readLocations('AM');
  const amLocationOptions = amLocations.map((amLocation) => ({
    value: amLocation.id,
    label: amLocation.address,
  }));

  const pmLocations = await readLocations('PM');
  const pmLocationOptions = pmLocations.map((pmLocation) => ({
    value: pmLocation.id,
    label: pmLocation.address,
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
        schools={schoolOptions}
        amLocations={amLocationOptions}
        pmLocations={pmLocationOptions}
      />
    </div>
  );
}
