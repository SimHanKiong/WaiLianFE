"use client";

import Link from "next/link";

import { Bus } from "@/lib/services/bus";

interface BusNavigationProps {
  buses: Bus[];
}

const labelClass = "w-28 py-2 text-center text-white font-bold rounded";
const busLinkClass = "w-14 py-2 text-center font-bold rounded";

export default function BusNavigation({ buses }: BusNavigationProps) {
  return (
    <div className="flex flex-col gap-3 pr-6">
      {buses.map((bus) => (
        <div key={bus.id} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className={`${labelClass} bg-blue-500`}>Pick Up</span>
            <Link
              href={`/admin/location/${bus.id}/AM`}
              className={busLinkClass}
              style={{ backgroundColor: bus.colour }}
            >
              {bus.name}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${labelClass} bg-orange-500`}>Drop Off</span>
            <Link
              href={`/admin/location/${bus.id}/PM`}
              className={busLinkClass}
              style={{ backgroundColor: bus.colour }}
            >
              {bus.name}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
