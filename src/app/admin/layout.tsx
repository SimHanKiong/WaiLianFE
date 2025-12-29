import Link from "next/link";

const navItems = [
  { href: "/admin/school", label: "Schools" },
  { href: "/admin/enquiry", label: "Enquiries" },
  { href: "/admin/student", label: "Students" },
  { href: "/admin/bus", label: "Buses" },
  { href: "/admin/location", label: "Routes" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-xl font-bold text-gray-900">
            WAI LIAN TRADING AND TRANSPORTATION
          </div>
          <div className="flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg flex items-center gap-1 font-bold text-gray-700 hover:text-gray-900 pr-2"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
