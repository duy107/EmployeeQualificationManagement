'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { notification, removeEmptyStrings } from '@/lib/utils';
import {
  createEmployee,
  getById,
  updateEmployee
} from '@/service/admin/employee.service';
import { EmployeeResponse, upsertEmployeeSchema, UpsertEmployeeType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, setHours } from "date-fns";
import { ChevronDownIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import QualificationForm from './quanlificationTable';

export default function UpsetEmployee() {
  const route = useRouter();
  const params = useParams();
  const id = params?.id?.[0];
  const queryClient = useQueryClient();
  const { data: employeeData, isLoading: isQueryLoading } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      if (!id) {
        return {
          firstName: '',
          middleName: '',
          lastName: '',
          birthDate: new Date(1990, 1, 1),
          gender: 'Male',
          note: '',
        } as EmployeeResponse;
      }
      const res = await getById(id);
      if (res.status === 200) {
        const emp = res.data as EmployeeResponse;
        const cleanedDate = {
          ...emp,
          birthDate: emp.birthDate ? new Date(emp.birthDate) : new Date(1990, 1, 1)
        } as EmployeeResponse;
        return cleanedDate;
      }
      throw new Error("Failed to fetch employee");
    },
    staleTime: 60 * 1000
  });
  const form = useForm<UpsertEmployeeType>({
    resolver: zodResolver(upsertEmployeeSchema),
    defaultValues: employeeData
  })
  const { handleSubmit, reset, watch, control, formState: { isSubmitting } } = form;

  useEffect(() => {
    if (employeeData) {
      reset(employeeData);
    }
  }, [employeeData, reset]);

  const onSubmit = async (data: UpsertEmployeeType) => {
    const cleanedData = removeEmptyStrings({ ...data, birthDate: setHours(data.birthDate, 12)});
    try {
      const res = id
        ? await updateEmployee(id, cleanedData)
        : await createEmployee(cleanedData);
      if (res.status === 200 || res.status === 201) {
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        id && queryClient.invalidateQueries({ queryKey: ['employee', id] });
        route.push('/admin/employee');
      } else {
        notification("Error. Try again!")
      }
    } catch (e) {
    }
  }

  if (isQueryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-4 h-4 animate-spin" />  Đang tải...
      </div>
    );
  }
  const [firstName, middleName, lastName] = watch(["firstName", "middleName", "lastName"]);
  const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').trim();

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      <div
        className={`w-full ${id ? 'max-w-6xl grid grid-cols-2' : 'max-w-4xl'
          } bg-white rounded-xl shadow-lg`}
      >
        <div
          className={`h-12 bg-teal-400 text-white flex items-center px-6 rounded-t-xl ${id ? 'col-span-2' : ''
            }`}
        >
          <h2 className="text-lg font-semibold">{id ? fullName || '' : 'Add Employee'}</h2>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder='firstname...' {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='middleName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder='middlename...' {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder='lastname...' {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "Male"} >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="birthDate"
                  render={({ field }) => {
                    const [open, setOpen] = useState(false);
                    const dateValue = field.value ? format(field.value, "dd/MM/yyyy") : undefined;
                    return <FormItem>
                      <FormLabel>Birth Date</FormLabel>
                      <FormControl>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date"
                              className="w-full justify-between font-normal"
                            >
                              {dateValue ? dateValue : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[250px] overflow-hidden p-0 " align="start">       
                              <Calendar
                                mode="single"
                                className="w-full"
                                selected={field.value}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                  field.onChange(date)
                                  setOpen(false)
                                }}
                              />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  }}
                />
                <FormField
                  name='note'
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Input placeholder='Note...' {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Link href="/admin/employee">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type='submit' className="bg-teal-500 hover:bg-teal-600 text-white">{isSubmitting ? "Accepting..." : "Accept"}</Button>
              </div>
            </form>
          </Form>
        </div>

        {id && <QualificationForm employeeId={id} />}
      </div>
    </div>
  );
}
