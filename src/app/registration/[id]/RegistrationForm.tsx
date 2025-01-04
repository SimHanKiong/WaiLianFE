'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import TextInputForm from '@/components/form/TextInputForm';
import RadioInputForm from '@/components/form/RadioInputForm';
import NumberInputForm from '@/components/form/NumberInputForm';
import { DateInputForm } from '@/components/form/DateInputForm';
import { useEffect, useState } from 'react';
import { getAddress } from '@/lib/services/external';
import { Label } from '@/components/ui/label';

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

const registrationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Full Name is required')
      .transform((name) => name.split(' ').map(capitalise).join(' ')),
    givenName: z
      .string()
      .trim()
      .min(1, 'Given Name is required')
      .transform((name) => name.split(' ').map(capitalise).join(' ')),
    gender: z.enum(['M', 'F'], { required_error: 'Gender is required' }),
    level: z
      .number({ required_error: 'Level is required' })
      .int()
      .min(1, 'Level should be between 1 to 6')
      .max(6, 'Level should be between 1 to 6'),
    class: z
      .string()
      .trim()
      .transform((str) => capitalise(str)),
    underFinancialAssistanceScheme: z.preprocess(
      (val) => (val === undefined ? undefined : val === 'true'),
      z.boolean({
        required_error: 'FAS status is required',
      })
    ),
    transportRequirement: z.enum(['Both', 'AM', 'PM'], {
      required_error: 'Transport Requirement is required',
    }),
    transportStartDate: z.coerce
      .date({
        required_error: 'Transport Start Date is required',
      })
      .min(startOfTomorrow, {
        message: 'Transport Start Date should be after today',
      }),
    homePostalCode: z
      .string()
      .regex(/^\d{6}$/, 'Home Postal Code must be exactly 6 digits'),
    homeUnitNo: z.string().trim(),
    dateOfBirth: z.coerce
      .date({
        required_error: 'Date of Birth is required',
      })
      .max(startOfToday, {
        message: 'Date of Birth should be before today',
      }),
    nric: z
      .string()
      .regex(
        /^[A-Za-z]\d{7}[A-Za-z]$/,
        'Birth Certificate or FIN number is of the wrong format'
      )
      .transform((ic) => {
        const firstLetter = ic[0].toLocaleUpperCase();
        const lastLetter = ic[ic.length - 1].toLocaleUpperCase();
        const middle = ic.slice(1, ic.length - 1);
        return firstLetter + middle + lastLetter;
      }),
    contact1Name: z
      .string()
      .trim()
      .min(1, 'Contact 1 Name is required')
      .transform((name) => name.split(' ').map(capitalise).join(' ')),
    contact1No: z
      .string()
      .regex(/^\d{8}$/, 'Contact 1 Phone Number must be exactly 8 digits'),
    contact1Relationship: z
      .string()
      .trim()
      .min(1, 'Contact 1 Relationship is required')
      .transform((name) => name.split(' ').map(capitalise).join(' ')),
    contact2Name: z
      .string()
      .trim()
      .min(1, 'Contact 2 Name is required')
      .transform((name) => name.split(' ').map(capitalise).join(' ')),
    contact2No: z
      .string()
      .regex(/^\d{8}$/, 'Contact 2 Phone Number must be exactly 8 digits'),
    contact2Relationship: z
      .string()
      .trim()
      .min(1, 'Contact 2 Relationship is required')
      .transform((name) => name.split(' ').map(capitalise).join(' ')),
  })
  .refine((data) => data.fullName.includes(data.givenName), {
    message: 'Given Name must be part of FullName',
    path: ['givenName'],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegistrationForm() {
  const [address, setAddress] = useState('');

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      givenName: '',
      gender: undefined,
      level: 0,
      class: '',
      underFinancialAssistanceScheme: undefined,
      transportRequirement: undefined,
      transportStartDate: startOfToday,
      homePostalCode: '',
      homeUnitNo: '',
      dateOfBirth: startOfTomorrow,
      nric: '',
      contact1Name: '',
      contact1No: '',
      contact1Relationship: '',
      contact2Name: '',
      contact2No: '',
      contact2Relationship: '',
    },
  });

  const homePostalCode = useWatch({
    control: form.control,
    name: 'homePostalCode',
  });

  useEffect(() => {
    const fetchAddress = async () => {
      if (homePostalCode && homePostalCode.length === 6) {
        const addr = await getAddress(homePostalCode);
        setAddress(addr);
      } else {
        setAddress('');
      }
    };
    fetchAddress();
  }, [homePostalCode]);

  const onSubmit = async (data: RegistrationFormData) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log('Validation errors:', errors)
        )}
        className="space-y-6 p-6 bg-white rounded-lg shadow-lg w-full"
      >
        <TextInputForm
          name="fullName"
          label="Full Name"
          control={form.control}
          placeholder="Enter full name"
        />
        <TextInputForm
          name="givenName"
          label="Given Name"
          control={form.control}
          placeholder="Enter given name"
        />
        <RadioInputForm
          name="gender"
          label="Gender"
          control={form.control}
          options={[
            { value: 'M', label: 'M' },
            { value: 'F', label: 'F' },
          ]}
        />
        <NumberInputForm
          name="level"
          label={`Level (For ${getYear()})`}
          control={form.control}
        />
        <TextInputForm
          name="class"
          label={`Class (For ${getYear()})`}
          control={form.control}
          placeholder="Enter class"
        />
        <RadioInputForm
          name="underFinancialAssistanceScheme"
          label="Under Financial Assistance Scheme?"
          control={form.control}
          options={[
            { value: true, label: 'Yes' },
            { value: false, label: 'No' },
          ]}
        />
        <RadioInputForm
          name="transportRequirement"
          label="Transport Requirement"
          control={form.control}
          options={[
            { value: 'Both', label: '2-way' },
            { value: 'AM', label: '1-way to school' },
            { value: 'PM', label: '1-way back home' },
          ]}
        />
        <DateInputForm
          name="transportStartDate"
          label="Transport Start Date"
          control={form.control}
          minDate={startOfTomorrow}
        />
        <TextInputForm
          name="homePostalCode"
          label="Home Postal Code"
          control={form.control}
          placeholder="Enter home postal code"
          maxLength={6}
        />
        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Address</Label>
          <p className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 shadow-sm md:text-sm">
            {address || 'No Address Found'}
          </p>
        </div>
        <TextInputForm
          name="homeUnitNo"
          label="Home Unit Number (Without #)"
          control={form.control}
          placeholder="Enter home unit number"
        />
        <DateInputForm
          name="dateOfBirth"
          label="Date of Birth"
          control={form.control}
          maxDate={startOfToday}
        />
        <TextInputForm
          name="nric"
          label="Birth Certificate or FIN Number"
          control={form.control}
          placeholder="Enter birth certificate or FIN number number"
        />
        <TextInputForm
          name="contact1Name"
          label="Name of Contact 1"
          control={form.control}
          placeholder="Enter name of contact 1"
        />
        <TextInputForm
          name="contact1No"
          label="Contact Number of Contact 1"
          control={form.control}
          placeholder="Enter contact number of contact 1"
          maxLength={8}
        />
        <TextInputForm
          name="contact1Relationship"
          label="Relationship of Contact 1"
          control={form.control}
          placeholder="Enter relationship of contact 1"
        />
        <TextInputForm
          name="contact2Name"
          label="Name of Contact 2"
          control={form.control}
          placeholder="Enter name of contact 2"
        />
        <TextInputForm
          name="contact2No"
          label="Contact Number of Contact 2"
          control={form.control}
          placeholder="Enter contact number of contact 2"
          maxLength={8}
        />
        <TextInputForm
          name="contact2Relationship"
          label="Relationship of Contact 2"
          control={form.control}
          placeholder="Enter relationship of contact 2"
        />
        <div className="text-right">
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md shadow-md"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
