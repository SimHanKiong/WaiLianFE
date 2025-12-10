type HeaderProps = { title: string };

export default function Header({ title }: HeaderProps) {
  return (
    <h1 className="mb-6 border-b border-gray-300 pb-2 text-3xl font-bold text-gray-800">
      {title}
    </h1>
  );
}
