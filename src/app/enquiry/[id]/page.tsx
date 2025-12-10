import { readSchool } from "@/lib/services/school";
import EnquiryForm from "./EnquiryForm";
import Header from "@/components/Header";

export default async function Page({ params }: { params: { id: string } }) {
  const school = await readSchool(params.id);

  return (
    <div className="container mx-auto max-w-full px-10 py-10">
      <Header title={`School Bus Enquiries for ${school.name}`} />
      <EnquiryForm school={school} />
    </div>
  );
}
