"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import TextInputForm from "@/components/form/TextInputForm";
import RadioInputForm from "@/components/form/RadioInputForm";
import { useEffect, useState } from "react";
import { getAddress } from "@/lib/services/external";
import { createEnquiry } from "@/lib/services/enquiry";
import { School } from "@/lib/services/school";
import { useToast } from "@/hooks/use-toast";
import DisplayFieldForm from "@/components/form/DisplayFieldForm";

const year = new Date().getFullYear();

const enquirySchema = z
  .object({
    email: z.string().trim().email("Email is invalid"),
    year: z
      .number({ required_error: "Transport Start Year is required" })
      .min(year)
      .max(year + 1),
    homePostalCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Home Postal Code must be exactly 6 digits"),
    homeUnitNo: z.string().trim(),
    transportRequirement: z.enum(["Both", "AM", "PM"], {
      required_error: "Transport Requirement is required",
    }),
    amPostalCode: z.string().trim(),
    pmPostalCode: z.string().trim(),
  })
  .refine(
    (data) => {
      if (
        data.transportRequirement === "Both" ||
        data.transportRequirement === "AM"
      ) {
        return /^\d{6}$/.test(data.amPostalCode);
      }
      return true;
    },
    {
      message: "Pick Up Postal Code must be exactly 6 digits",
      path: ["amPostalCode"],
    }
  )
  .refine(
    (data) => {
      if (
        data.transportRequirement === "Both" ||
        data.transportRequirement === "PM"
      ) {
        return /^\d{6}$/.test(data.pmPostalCode);
      }
      return true;
    },
    {
      message: "Drop Off Postal Code must be exactly 6 digits",
      path: ["pmPostalCode"],
    }
  )
  .transform((data) => {
    if (data.transportRequirement === "AM") {
      return { ...data, pmPostalCode: "" };
    }
    if (data.transportRequirement === "PM") {
      return { ...data, amPostalCode: "" };
    }
    return data;
  });

export type EnquiryFormData = z.infer<typeof enquirySchema>;

interface EnquiryFormProps {
  school: School;
}

export default function EnquiryForm({ school }: EnquiryFormProps) {
  const [homeAddress, setHomeAddress] = useState("");
  const [amAddress, setAmAddress] = useState("");
  const [pmAddress, setPmAddress] = useState("");
  const { toast } = useToast();

  const form = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      email: "",
      year: undefined,
      homePostalCode: "",
      homeUnitNo: "",
      transportRequirement: undefined,
      amPostalCode: "",
      pmPostalCode: "",
    },
  });

  const homePostalCode = useWatch({
    control: form.control,
    name: "homePostalCode",
  });

  const amPostalCode = useWatch({
    control: form.control,
    name: "amPostalCode",
  });

  const pmPostalCode = useWatch({
    control: form.control,
    name: "pmPostalCode",
  });

  const transportRequirement = useWatch({
    control: form.control,
    name: "transportRequirement",
  });

  useEffect(() => {
    const fetchAddress = async () => {
      if (homePostalCode && homePostalCode.length === 6) {
        const addr = await getAddress(homePostalCode);
        setHomeAddress(addr);
      } else {
        setHomeAddress("");
      }
    };
    fetchAddress();
  }, [homePostalCode]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (amPostalCode && amPostalCode.length === 6) {
        const addr = await getAddress(amPostalCode);
        setAmAddress(addr);
      } else {
        setAmAddress("");
      }
    };
    fetchAddress();
  }, [amPostalCode]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (pmPostalCode && pmPostalCode.length === 6) {
        const addr = await getAddress(pmPostalCode);
        setPmAddress(addr);
      } else {
        setPmAddress("");
      }
    };
    fetchAddress();
  }, [pmPostalCode]);

  const onSubmit = async (data: EnquiryFormData) => {
    try {
      await createEnquiry(school.id, data);
      toast({
        variant: "success",
        title: "Submission Successful",
        description: "Please check your email for more details.",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description:
          "Form could not be submitted. Please contact us via email.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 rounded-lg bg-white p-6 shadow-lg"
      >
        <TextInputForm
          name="email"
          label="Email"
          control={form.control}
          placeholder="Enter email"
          type="email"
        />
        <RadioInputForm
          name="year"
          label="Transport Start Year"
          control={form.control}
          options={
            school.isFinalYear
              ? [{ value: year, label: String(year) }]
              : [
                  { value: year, label: String(year) },
                  { value: year + 1, label: String(year + 1) },
                ]
          }
        />
        <TextInputForm
          name="homePostalCode"
          label="Home Postal Code"
          control={form.control}
          placeholder="Enter home postal code"
          maxLength={6}
        />
        <DisplayFieldForm
          label="Home Address"
          value={homeAddress}
          fallback="No Home Address Found"
        />
        <TextInputForm
          name="homeUnitNo"
          label="Home Unit Number (Without #)"
          control={form.control}
          placeholder="Enter home unit number"
        />
        <RadioInputForm
          name="transportRequirement"
          label="Transport Requirement"
          control={form.control}
          options={[
            { value: "Both", label: "2-way" },
            { value: "AM", label: "1-way to school" },
            { value: "PM", label: "1-way back home" },
          ]}
        />
        {(transportRequirement === "Both" || transportRequirement === "AM") && (
          <>
            <TextInputForm
              name="amPostalCode"
              label="Pick Up Postal Code"
              control={form.control}
              placeholder="Enter pick up postal code"
              maxLength={6}
            />
            <DisplayFieldForm
              label="Pick Up Address"
              value={amAddress}
              fallback="No Pick Up Address Found"
            />
          </>
        )}
        {(transportRequirement === "Both" || transportRequirement == "PM") && (
          <>
            <TextInputForm
              name="pmPostalCode"
              label="Drop Off Postal Code"
              control={form.control}
              placeholder="Enter drop off postal code"
              maxLength={6}
            />
            <DisplayFieldForm
              label="Drop Off Address"
              value={pmAddress}
              fallback="No Drop Off Address Found"
            />
          </>
        )}
        <div className="text-right">
          <Button type="submit" variant="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
