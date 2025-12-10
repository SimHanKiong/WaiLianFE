"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createLocation } from "@/lib/services/location";
import TextInputForm from "@/components/form/TextInputForm";
import RadioInputForm from "@/components/form/RadioInputForm";

const addLocationSchema = z.object({
  address: z.string().trim().min(1, "Address is required"),
  time: z.string().trim().min(1, "Time is required"),
  type: z.enum(["AM", "PM"], { required_error: "Type is required" }),
});

type AddLocationFormData = z.infer<typeof addLocationSchema>;

export default function AddLocationForm() {
  const form = useForm<AddLocationFormData>({
    resolver: zodResolver(addLocationSchema),
    defaultValues: { address: "", time: "", type: undefined },
  });

  const onSubmit = async (data: AddLocationFormData) => {
    await createLocation(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 rounded-lg bg-white p-6 shadow-lg"
      >
        <TextInputForm
          control={form.control}
          name="address"
          label="Address"
          placeholder="Enter address"
        />
        <TextInputForm
          control={form.control}
          name="time"
          label="Time"
          placeholder="Enter time"
          type="text"
        />
        <RadioInputForm
          control={form.control}
          name="type"
          label="Type"
          options={[
            { value: "AM", label: "AM" },
            { value: "PM", label: "PM" },
          ]}
        />
        <div className="text-right">
          <Button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-md hover:bg-blue-700"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
