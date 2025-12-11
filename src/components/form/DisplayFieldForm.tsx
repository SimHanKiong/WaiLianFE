import { Label } from "../ui/label";

interface DisplayFieldFormProps {
  label: string;
  value: string;
  fallback?: string;
}

export default function DisplayFieldForm({
  label,
  value,
  fallback,
}: DisplayFieldFormProps) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold text-gray-700">{label}</Label>
      <p className="rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm md:text-sm">
        {value || fallback || "NA"}
      </p>
    </div>
  );
}
