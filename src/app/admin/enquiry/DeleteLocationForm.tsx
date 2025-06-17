"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DropdownForm from "@/components/form/DropdownForm";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { deleteLocation } from "@/lib/services/location";

interface DeleteLocationFormProps {
  locations: { value: string; label: string }[];
}

const deleteLocationSchema = z.object({
  locationId: z.string().min(1, "Location is required"),
});

type DeleteLocationFormData = z.infer<typeof deleteLocationSchema>;

export default function DeleteLocationForm({
  locations,
}: DeleteLocationFormProps) {
  const form = useForm<DeleteLocationFormData>({
    resolver: zodResolver(deleteLocationSchema),
    defaultValues: {
      locationId: undefined,
    },
  });

  const onSubmit = async (data: DeleteLocationFormData) => {
    await deleteLocation(data.locationId);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 bg-white rounded-lg shadow-lg w-full"
      >
        <DropdownForm
          name="locationId"
          label="Address"
          control={form.control}
          options={locations}
          placeholder="Select a location to delete"
        />
        <div className="text-right">
          <Button
            type="submit"
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md shadow-md"
          >
            Delete
          </Button>
        </div>
      </form>
    </Form>
  );
}
