import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { readSchool } from "@/lib/services/school";

import EnquiryForm from "../EnquiryForm";

export default async function Page({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;

  const school = await readSchool(schoolId);

  return (
    <PageContainer>
      <Header title={`School Bus Enquiries for ${school.name}`} />
      <EnquiryForm school={school} />
    </PageContainer>
  );
}
