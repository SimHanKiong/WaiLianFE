import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { readSchool } from "@/lib/services/school";

import EnquiryForm from "./EnquiryForm";

export default async function Page({ params }: { params: { id: string } }) {
  const school = await readSchool(params.id);

  return (
    <PageContainer>
      <Header title={`School Bus Enquiries for ${school.name}`} />
      <EnquiryForm school={school} />
    </PageContainer>
  );
}
