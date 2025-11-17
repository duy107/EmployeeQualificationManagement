'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createEmployee,
  getById,
  updateEmployee
} from '@/service/admin/employee.service';
import { EmployeeRequest } from '@/types';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import QualificationForm from './quanlificationTable';
import { notification } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

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
          birthDate: '',
          gender: 'Male',
          note: '',
        };
      }
      const res = await getById(id);
      if (res.status === 200) {
        const emp = res.data as EmployeeRequest;
        const parts = emp.birthDate?.split('/');
        if (parts?.length === 3) {
          emp.birthDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return emp;
      }
      throw new Error("Failed to fetch employee");
    },
    staleTime: 60 * 1000
  });

  const { register, handleSubmit,
    watch, control, reset,
    formState: { errors }
  } = useForm<EmployeeRequest>({ defaultValues: employeeData });

  useEffect(() => {
    if (employeeData) {
        reset(employeeData);
    }
}, [employeeData, reset]);

  const onSubmit = async (data: EmployeeRequest) => {
    if (!data.note?.trim()) delete data.note;
    if (!data.middleName?.trim()) delete data.middleName;
    data.firstName = data.firstName?.trim();
    data.lastName = data.lastName?.trim();
    const res = id
      ? await updateEmployee(id, data)
      : await createEmployee(data);
    if (res.status === 200 || res.status === 201) {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      route.push('/admin/employee');
    } else {
      notification("Error. Try again!")
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-600 text-sm mb-2 block">First Name</Label>
                <Input
                  placeholder="First Name"
                  {...register("firstName", {
                    required: "FirstName is required!",
                    maxLength: {
                      value: 10,
                      message: "FirstName maximum 10 characters"
                    },
                    pattern: {
                      value: /^(?=.*[a-zA-Z])[a-zA-Z ]+$/,
                      message: "First name can only contain letters and space"
                    }
                  })}
                />
                {errors.firstName && <p className="text-red-500 text-[12px] mt-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <Label className="text-gray-600 text-sm mb-2 block">Middle Name</Label>
                <Input
                  placeholder="Middle Name"
                  {...register("middleName", {
                    maxLength: {
                      value: 10,
                      message: "MiddleName maximum 10 characters"
                    },
                  })}
                />
              </div>

              <div>
                <Label className="text-gray-600 text-sm mb-2 block">Last Name</Label>
                <Input
                  placeholder="LastName"
                  {...register("lastName", {
                    required: "LastName is required!",
                    maxLength: {
                      value: 10,
                      message: "LastName maximum 10 characters"
                    },
                    pattern: {
                      value: /^(?=.*[a-zA-Z])[a-zA-Z ]+$/,
                      message: "LastName can only contain letters and space"
                    }
                  })}
                />
                {errors.lastName && <p className="text-red-500 text-[12px] mt-1">{errors.lastName.message}</p>}
              </div>

              <div>
                <Label className="text-gray-600 text-sm mb-2 block">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || "Male"}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label className="text-gray-600 text-sm mb-2 block">Birth Date</Label>
                <Input
                  type="date"
                  {...register("birthDate", {
                    required: "Birth date is required!"
                  })}
                />
                {errors.birthDate && <p className="text-red-500 text-[12px] mt-1">{errors.birthDate.message}</p>}
              </div>
            </div>

            <div>
              <Label className="text-gray-600 text-sm mb-2 block">Note</Label>
              <textarea
                {...register("note")}
                className="w-full h-24 border rounded-md p-2"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link href="/admin/employee">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type='submit' className="bg-teal-500 hover:bg-teal-600 text-white">Accept</Button>
            </div>
          </form>
        </div>

        {id && <QualificationForm employeeId={id} />}
      </div>
    </div>
  );
}
