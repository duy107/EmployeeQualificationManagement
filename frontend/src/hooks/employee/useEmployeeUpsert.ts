"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setHours } from "date-fns";

import { removeEmptyStrings } from "@/lib/utils";
import { createEmployee, getById, updateEmployee } from "@/service/admin/employee.service";
import { EmployeeResponse, upsertEmployeeSchema, UpsertEmployeeType } from "@/types";

export const useEmployeeUpsert = () => {

    const route = useRouter();

    const params = useParams();
    const id = params?.id?.[0];

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: UpsertEmployeeType) => id
            ? await updateEmployee(id, data)
            : await createEmployee(data),
        onSuccess: (res) => {
            if (res.status === 200 || res.status === 201) {

                queryClient.invalidateQueries({ queryKey: ['employees'] });

                if (id) {
                    queryClient.invalidateQueries({ queryKey: ['employee', id] });
                }

                route.push('/admin/employee')
            }
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

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
    const { reset } = form;

    useEffect(() => {
        if (employeeData) {
            reset(employeeData);
        }
    }, [employeeData, reset]);

    const onSubmit = async (data: UpsertEmployeeType) => {
        const cleanedData = removeEmptyStrings({ ...data, birthDate: setHours(data.birthDate, 12) }) as UpsertEmployeeType;
        mutate(cleanedData);
    }

    return {
        form,
        isQueryLoading,
        isPending,
        employeeId: id,
        onSubmit
    }
}