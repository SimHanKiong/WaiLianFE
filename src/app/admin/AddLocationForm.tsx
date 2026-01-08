"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import RadioInputForm from "@/components/form/RadioInputForm";
import TextInputForm from "@/components/form/TextInputForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createLocation } from "@/lib/services/location";

const addLocationSchema = z.object({
  address: z.string().trim().min(1, "Address is required"),
  timeReach: z.string().trim().min(1, "Time is required"),
  type: z.enum(["AM", "PM"], { required_error: "Type is required" }),
});

type AddLocationFormData = z.infer<typeof addLocationSchema>;

export default function AddLocationForm() {
  const router = useRouter();

  const form = useForm<AddLocationFormData>({
    resolver: zodResolver(addLocationSchema),
    defaultValues: { address: "", timeReach: "12:00", type: undefined },
  });

  const onSubmit = async (data: AddLocationFormData) => {
    await createLocation(data);
    form.reset();
    router.refresh();
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
          type="time"
          control={form.control}
          name="timeReach"
          label="Time"
          placeholder="Enter time"
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
          <Button type="submit" variant="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
