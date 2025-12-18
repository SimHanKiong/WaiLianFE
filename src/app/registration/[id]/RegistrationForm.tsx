"use client";

import { Enquiry } from "@/lib/services/enquiry";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import TextInputForm from "@/components/form/TextInputForm";
import RadioInputForm from "@/components/form/RadioInputForm";
import NumberInputForm from "@/components/form/NumberInputForm";
import DateInputForm from "@/components/form/DateInputForm";
import DisplayFieldForm from "@/components/form/DisplayFieldForm";
import { createParent } from "@/lib/services/parent";
import { useToast } from "@/hooks/use-toast";

const capitalise = (word: string) => {
  return word.charAt(0).toLocaleUpperCase() + word.slice(1).toLowerCase();
};

const getYear = () => {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  return month >= 11 ? year + 1 : year;
};

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const startOfTomorrow = new Date();
startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
startOfTomorrow.setHours(0, 0, 0, 0);

const studentSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full Name is required")
      .transform((name) => name.split(" ").map(capitalise).join(" ")),
    givenName: z
      .string()
      .trim()
      .min(1, "Given Name is required")
      .transform((name) => name.split(" ").map(capitalise).join(" ")),
    gender: z.enum(["M", "F"], { required_error: "Gender is required" }),
    level: z
      .number({ required_error: "Level is required" })
      .int()
      .min(1, "Level should be between 1 and 6")
      .max(6, "Level should be between 1 and 6"),
    className: z
      .string()
      .trim()
      .transform((str) => capitalise(str)),
    dateOfBirth: z.coerce
      .date({ required_error: "Date of Birth is required" })
      .max(startOfToday, { message: "Date of Birth should be before today" }),
    nric: z
      .string()
      .regex(
        /^[A-Za-z]\d{7}[A-Za-z]$/,
        "Birth Certificate or FIN number is of the wrong format"
      )
      .transform((ic) => {
        const firstLetter = ic[0].toUpperCase();
        const lastLetter = ic[ic.length - 1].toUpperCase();
        const middle = ic.slice(1, ic.length - 1);
        return firstLetter + middle + lastLetter;
      }),
    transportRequirement: z.enum(["AM", "PM", "Both"], {
      required_error: "Transport Requirement is required",
    }),
    transportStartDate: z.coerce
      .date({ required_error: "Transport Start Date is required" })
      .min(startOfTomorrow, {
        message: "Transport Start Date should be after today",
      }),
  })
  .refine((data) => data.fullName.includes(data.givenName), {
    message: "Given Name must be part of Full Name",
    path: ["givenName"],
  });

const registrationSchema = z.object({
  contact1Name: z
    .string()
    .trim()
    .min(1, "Full Name of Contact 1 is required")
    .transform((name) => name.split(" ").map(capitalise).join(" ")),
  contact1No: z
    .string()
    .regex(/^\d{8}$/, "Contact Number 1 must be exactly 8 digits"),
  contact1Relationship: z
    .string()
    .trim()
    .min(1, "Relationship of Contact 1 is required")
    .transform((name) => name.split(" ").map(capitalise).join(" ")),
  contact2Name: z
    .string()
    .trim()
    .min(1, "Full Name of Contact 2 is required")
    .transform((name) => name.split(" ").map(capitalise).join(" ")),
  contact2No: z
    .string()
    .regex(/^\d{8}$/, "Contact Number 2 must be exactly 8 digits"),
  contact2Relationship: z
    .string()
    .trim()
    .min(1, "Relationship of Contact 2 is required")
    .transform((name) => name.split(" ").map(capitalise).join(" ")),
  underFas: z.preprocess(
    (val) => (val === undefined ? undefined : val === "true"),
    z.boolean({ required_error: "FAS status is required" })
  ),
  children: z.array(studentSchema).min(1),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  enquiry: Enquiry;
}

export default function RegistrationForm({ enquiry }: RegistrationFormProps) {
  const { toast } = useToast();

  const enquiryTransportRequirement =
    enquiry.amPostalCode && enquiry.pmPostalCode
      ? "Both"
      : enquiry.amPostalCode
        ? "AM"
        : "PM";

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      contact1Name: "",
      contact1No: "",
      contact1Relationship: "",
      contact2Name: "",
      contact2No: "",
      contact2Relationship: "",
      underFas: undefined,
      children: [
        {
          fullName: "",
          givenName: "",
          gender: undefined,
          level: 0,
          className: "",
          dateOfBirth: startOfTomorrow,
          nric: "",
          transportRequirement: enquiryTransportRequirement,
          transportStartDate: startOfToday,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children",
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      await createParent(enquiry.id, data);
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
        <DisplayFieldForm label="School Name" value={enquiry.school.name} />
        <DisplayFieldForm label="Email" value={enquiry.email} />
        <TextInputForm
          name="contact1No"
          label="Contact Number 1"
          control={form.control}
          placeholder="XXXXXXXX"
          maxLength={8}
          description="All notifications will be sent to this number."
        />
        <TextInputForm
          name="contact1Name"
          label="Full Name of Contact 1"
          control={form.control}
          placeholder="Enter name of contact 1"
        />
        <TextInputForm
          name="contact1Relationship"
          label="Relationship of Contact 1"
          control={form.control}
          placeholder="Enter relationship of contact 1"
        />
        <TextInputForm
          name="contact2No"
          label="Contact Number 2"
          control={form.control}
          placeholder="XXXXXXXX"
          maxLength={8}
        />
        <TextInputForm
          name="contact2Name"
          label="Full Name of Contact 2"
          control={form.control}
          placeholder="Enter name of contact 2"
        />
        <TextInputForm
          name="contact2Relationship"
          label="Relationship of Contact 2"
          control={form.control}
          placeholder="Enter relationship of contact 2"
        />
        <DisplayFieldForm
          label="Home Postal Code"
          value={enquiry.homePostalCode}
        />
        <DisplayFieldForm label="Home Address" value={enquiry.homeAddress} />
        <DisplayFieldForm label="Home Unit Number" value={enquiry.homeUnitNo} />
        <RadioInputForm
          name="underFas"
          label="Under Financial Assistance Scheme?"
          control={form.control}
          options={[
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ]}
        />

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 rounded-lg border border-gray-400 p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">Child {index + 1}</h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="delete"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              )}
            </div>
            <TextInputForm
              name={`children.${index}.fullName`}
              label="Full Name"
              control={form.control}
              placeholder="Enter full name"
            />
            <TextInputForm
              name={`children.${index}.givenName`}
              label="Given Name"
              control={form.control}
              placeholder="Enter given name"
            />
            <RadioInputForm
              name={`children.${index}.gender`}
              label="Gender"
              control={form.control}
              options={[
                { value: "M", label: "M" },
                { value: "F", label: "F" },
              ]}
            />
            <NumberInputForm
              name={`children.${index}.level`}
              label={`Level (For ${getYear()})`}
              control={form.control}
            />
            <TextInputForm
              name={`children.${index}.className`}
              label={`Class (For ${getYear()})`}
              control={form.control}
              placeholder="Enter class"
            />
            <DateInputForm
              name={`children.${index}.dateOfBirth`}
              label="Date of Birth"
              control={form.control}
              maxDate={startOfToday}
            />
            <TextInputForm
              name={`children.${index}.nric`}
              label="Birth Certificate or FIN Number"
              control={form.control}
              placeholder="Enter birth certificate or FIN number"
            />
            <RadioInputForm
              name={`children.${index}.transportRequirement`}
              label="Transport Requirement"
              control={form.control}
              options={[
                { value: "Both", label: "2-way" },
                { value: "AM", label: "1-way to school" },
                { value: "PM", label: "1-way back home" },
              ]}
            />
            <DateInputForm
              name={`children.${index}.transportStartDate`}
              label="Transport Start Date"
              control={form.control}
              minDate={startOfTomorrow}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="add"
          onClick={() =>
            append({
              fullName: "",
              givenName: "",
              gender: undefined as unknown as "M" | "F",
              level: 0,
              className: "",
              dateOfBirth: startOfTomorrow,
              nric: "",
              transportRequirement: enquiryTransportRequirement,
              transportStartDate: startOfToday,
            })
          }
        >
          Add Another Child
        </Button>

        <div className="rounded-lg border border-gray-400 bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-700">
            By submitting this form, I acknowledge that:
          </p>
          <ul className="ml-4 mt-2 list-disc space-y-1">
            <li>
              I have read and understood the School Bus Regulations sent via
              WhatsApp.
            </li>
            <li>
              The bus company will not disclose information to unregistered
              contact numbers.
            </li>
            <li>All information given is true and accurate.</li>
          </ul>
        </div>

        <div className="text-right">
          <Button type="submit" variant="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
