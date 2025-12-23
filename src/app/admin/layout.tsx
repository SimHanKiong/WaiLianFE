import Link from "next/link";

const navItems = [
  { href: "/admin/school", label: "Schools" },
  { href: "/admin/enquiry", label: "Enquiries" },
  { href: "/admin/student", label: "Students" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <nav className="bg-slate-900 text-white">
        <div className="flex items-center gap-8 px-6 py-6">
          <div className="flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-xl font-medium hover:text-gray-300"
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
