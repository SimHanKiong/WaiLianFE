import Header from "@/components/Header";
import { readEnquiry } from "@/lib/services/enquiry";
import RegistrationForm from "./RegistrationForm";

export default async function Page({ params }: { params: { id: string } }) {
  const enquiry = await readEnquiry(params.id);

  return (
    <div className="container mx-auto max-w-full px-10 py-10">
      <Header title={`Registration Form for ${enquiry.school.name}`} />
      <RegistrationForm enquiry={enquiry} />
    </div>
  );
}
