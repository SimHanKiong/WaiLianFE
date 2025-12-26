import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { readEnquiry } from "@/lib/services/enquiry";

import RegistrationForm from "../RegistrationForm";

export default async function Page({
  params,
}: {
  params: { enquiryId: string };
}) {
  const enquiry = await readEnquiry(params.enquiryId);

  return (
    <PageContainer>
      <Header title={`Registration Form for ${enquiry.school.name}`} />
      <RegistrationForm enquiry={enquiry} />
    </PageContainer>
  );
}
