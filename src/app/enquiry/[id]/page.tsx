import { readSchool } from "@/lib/services/school";
import EnquiryForm from "./EnquiryForm";

export default async function Page({ params }: { params: { id: string } }) {
  const school = await readSchool(params.id);

  return (
    <div className="container mx-auto py-10 px-10 max-w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-2">
        School Bus Enquiries for {school.name}
      </h1>
      <EnquiryForm school={school} />
    </div>
  );
}
