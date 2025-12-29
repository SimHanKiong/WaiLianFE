import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import { LocationType, LocationTypeType } from "@/lib/constants";
import { readBuses } from "@/lib/services/bus";
import { readLocations } from "@/lib/services/location";

import BusNavigation from "../../BusNavigation";
import LocationTable from "../../LocationTable";

export default async function Page({
  params,
}: {
  params: Promise<{ busId: string; locationType: LocationTypeType }>;
}) {
  const { busId, locationType } = await params;

  const [buses, locations] = await Promise.all([
    readBuses(),
    readLocations({ busId: busId, type: locationType }),
  ]);
  const busOptions = [
    { value: "", label: "", object: null },
    ...buses.map((bus) => ({
      value: bus.id,
      label: bus.name,
      object: bus,
    })),
  ];

  const bus = buses.find((bus) => bus.id === busId);
  const vehicle =
    locationType === LocationType.AM
      ? `${bus?.amPlateNo} (${bus?.amCapacity}-seater)`
      : `${bus?.pmPlateNo} (${bus?.pmCapacity}-seater)`;

  return (
    <PageContainer>
      <Header title="Route" />
      <div className="flex gap-2">
        <BusNavigation buses={buses} />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2 text-xl font-bold">
            <span>{locationType === LocationType.AM ? "AM" : "PM"}</span>
            <span>Vehicle: {vehicle}</span>
            <span></span>
          </div>
          <LocationTable
            data={locations}
            buses={busOptions}
            busId={busId}
            type={locationType}
          />
        </div>
      </div>
    </PageContainer>
  );
}
