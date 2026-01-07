"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { useRouter } from "next/navigation";

import DateInputForm from "@/components/form/DateInputForm";
import DisplayFieldForm from "@/components/form/DisplayFieldForm";
import DropdownForm from "@/components/form/DropdownForm";
import NumberInputForm from "@/components/form/NumberInputForm";
import RadioInputForm from "@/components/form/RadioInputForm";
import TextInputForm from "@/components/form/TextInputForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Gender,
  GenderType,
  StudentStatus,
  StudentStatusType,
  TransportRequirement,
  TransportRequirementType,
} from "@/lib/constants";
import { getAddress } from "@/lib/services/external";
import { createParent } from "@/lib/services/parent";
import { capitalise, startOfToday, startOfTomorrow } from "@/lib/utils";

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
    gender: z.enum([Gender.MALE, Gender.FEMALE], {
      required_error: "Gender is required",
    }),
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
    transportRequirement: z.enum(
      [
        TransportRequirement.AM,
        TransportRequirement.PM,
        TransportRequirement.BOTH,
      ],
      {
        required_error: "Transport Requirement is required",
      }
    ),
    transportStartDate: z.coerce
      .date({ required_error: "Transport Start Date is required" })
      .min(startOfTomorrow, {
        message: "Transport Start Date should be after today",
      }),
    block: z.string().trim().min(1, "Block is required"),
    amLocationId: z.string().min(1, "Pick Up Location is required"),
    pmLocationId: z.string().min(1, "Drop Off Location is required"),
    schoolId: z.string().min(1, "School is required"),
    status: z
      .enum([StudentStatus.PENDING, StudentStatus.NEW, ""])
      .transform((val) => (val === "" ? null : val)),
  })
  .refine((data) => data.fullName.includes(data.givenName), {
    message: "Given Name must be part of Full Name",
    path: ["givenName"],
  });

const parentSchema = z.object({
  email: z.string().trim().email("Email is invalid"),
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
    .transform((name) => name.split(" ").map(capitalise).join(" ")),
  contact2No: z.string().refine((val) => !val || /^\d{8}$/.test(val), {
    message: "Contact Number 2 must be exactly 8 digits if provided",
  }),
  contact2Relationship: z
    .string()
    .trim()
    .transform((name) => name.split(" ").map(capitalise).join(" ")),
  homePostalCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Home Postal Code must be exactly 6 digits"),
  homeUnitNo: z.string().trim(),
  amPostalCode: z.string().trim(),
  pmPostalCode: z.string().trim(),
  underFas: z.preprocess(
    (val) => (val === undefined ? undefined : val === "true"),
    z.boolean({ required_error: "FAS status is required" })
  ),
  fare: z.number().min(0, "Fare must be greater than 0"),
  children: z.array(studentSchema).min(1),
});

export type ParentFormData = z.infer<typeof parentSchema>;

interface StudentFormProps {
  schools: { value: string; label: string }[];
  amLocations: { value: string; label: string }[];
  pmLocations: { value: string; label: string }[];
  studentStatus: { value: string; label: string }[];
}

export default function StudentForm({
  schools,
  amLocations,
  pmLocations,
  studentStatus,
}: StudentFormProps) {
  const router = useRouter();

  const [homeAddress, setHomeAddress] = useState("");
  const [amAddress, setAmAddress] = useState("");
  const [pmAddress, setPmAddress] = useState("");

  const form = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      email: "",
      contact1Name: "",
      contact1No: "",
      contact1Relationship: "",
      contact2Name: "",
      contact2No: "",
      contact2Relationship: "",
      homePostalCode: "",
      homeUnitNo: "",
      amPostalCode: "",
      pmPostalCode: "",
      underFas: undefined,
      fare: 0,
      children: [
        {
          fullName: "",
          givenName: "",
          gender: undefined,
          level: 0,
          className: "",
          dateOfBirth: startOfTomorrow,
          nric: "",
          transportRequirement: undefined,
          transportStartDate: startOfToday,
          block: "",
          amLocationId: "",
          pmLocationId: "",
          schoolId: "",
          status: "" as unknown as StudentStatusType,
        },
      ],
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children",
  });

  const onSubmit = async (data: ParentFormData) => {
    try {
      await createParent(data);
      router.push("/admin/student");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 rounded-lg bg-white p-6 shadow-lg"
      >
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
                { value: Gender.MALE, label: "M" },
                { value: Gender.FEMALE, label: "F" },
              ]}
            />
            <NumberInputForm
              name={`children.${index}.level`}
              label="Level"
              control={form.control}
            />
            <TextInputForm
              name={`children.${index}.className`}
              label="Class"
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
                { value: TransportRequirement.BOTH, label: "2-way" },
                { value: TransportRequirement.AM, label: "1-way to school" },
                { value: TransportRequirement.PM, label: "1-way back home" },
              ]}
            />
            <DateInputForm
              name={`children.${index}.transportStartDate`}
              label="Transport Start Date"
              control={form.control}
              minDate={startOfTomorrow}
            />
            <TextInputForm
              name={`children.${index}.block`}
              label="Block"
              control={form.control}
              placeholder="Enter block"
            />
            <DropdownForm
              name={`children.${index}.amLocationId`}
              label="Pick Up Location"
              control={form.control}
              options={amLocations}
            />
            <DropdownForm
              name={`children.${index}.pmLocationId`}
              label="Drop Off Location"
              control={form.control}
              options={pmLocations}
            />
            <DropdownForm
              name={`children.${index}.schoolId`}
              label="School"
              control={form.control}
              options={schools}
            />
            <DropdownForm
              name={`children.${index}.status`}
              label="Status"
              control={form.control}
              options={studentStatus}
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
              gender: undefined as unknown as GenderType,
              level: 0,
              className: "",
              dateOfBirth: startOfTomorrow,
              nric: "",
              transportRequirement:
                undefined as unknown as TransportRequirementType,
              transportStartDate: startOfToday,
              block: "",
              amLocationId: "",
              pmLocationId: "",
              schoolId: "",
              status: "" as unknown as StudentStatusType,
            })
          }
        >
          Add Another Child
        </Button>

        <TextInputForm
          name="email"
          label="Email"
          control={form.control}
          placeholder="Enter email"
          type="email"
        />
        <TextInputForm
          name="contact1No"
          label="Contact Number 1"
          control={form.control}
          placeholder="XXXXXXXX"
          maxLength={8}
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
        <RadioInputForm
          name="underFas"
          label="Under Financial Assistance Scheme?"
          control={form.control}
          options={[
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ]}
        />
        <NumberInputForm name="fare" label="Fare" control={form.control} />
        <div className="text-right">
          <Button type="submit" variant="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
