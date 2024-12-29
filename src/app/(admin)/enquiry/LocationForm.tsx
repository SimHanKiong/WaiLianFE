'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { createLocation } from '@/lib/services/location';

const locationSchema = z.object({
  address: z.string().trim().min(1, 'Address is required'),
  time: z.string().trim().min(1, 'Time is required'),
  type: z.enum(['AM', 'PM'], { required_error: 'Type is required' }),
});

type LocationFormData = z.infer<typeof locationSchema>;

export default function LocationForm() {
  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      address: '',
      time: '',
      type: undefined,
    },
  });

  const onSubmit = async (data: LocationFormData) => {
    await createLocation(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 bg-white rounded-lg shadow-lg w-full"
      >
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-semibold">
                Address
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 shadow-sm"
                  placeholder="Enter address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-semibold">
                Time
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 shadow-sm"
                  placeholder="Enter time"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-semibold">
                Type
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || ''}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="AM"
                      id="type-am"
                      className="w-5 h-5 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <Label
                      htmlFor="type-am"
                      className="text-gray-700 font-medium"
                    >
                      AM
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="PM"
                      id="type-pm"
                      className="w-5 h-5 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <Label
                      htmlFor="type-pm"
                      className="text-gray-700 font-medium"
                    >
                      PM
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
