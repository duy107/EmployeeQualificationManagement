'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { HttpError } from '@/lib/api.lib';
import { notification, removeEmptyStrings } from '@/lib/utils';
import { create } from '@/service/admin/employeeQualification.service';
import { useQualificationStore } from '@/store/useQualificationStore';
import {
    createEmployeeQualificationSchema,
    CreateEmployeeQualificationType
} from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface AddQualificationModalProps {
    employeeId: string;
    open: boolean;
    onClose: () => void;
}

export default function AddQualificationModal({
    employeeId,
    open,
    onClose
}: AddQualificationModalProps) {
    const { qualifications, fetchQualifications } = useQualificationStore();
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: async (data: CreateEmployeeQualificationType) => await create(data),
        onSuccess: (data) => {
            if (data.status === 200) {
                reset(initForm)
                onClose();
                queryClient.invalidateQueries({ queryKey: ['employee-qualification'] })
                notification("Create qualification successfully", "success");
            } else {
                notification("Create qualification successfully");
            };
        },
        onError: (error) => {
            if (error instanceof HttpError) return;
            notification(error.message);
        }
    });
    const initForm = {
        employeeId,
        qualificationId: qualifications[0]?.id ?? "",
        institution: '',
        city: undefined,
        validFrom: undefined,
        validTo: undefined,
    };
    
    const form = useForm<CreateEmployeeQualificationType>({
        resolver: zodResolver(createEmployeeQualificationSchema),
        defaultValues: initForm
    });
    const { control, handleSubmit, reset, clearErrors } = form;
    useEffect(() => {
        if (open && qualifications.length === 0) {
            fetchQualifications();
        }
    }, [open, qualifications.length, fetchQualifications]);

    useEffect(() => {
        if (open) {
            reset(initForm);
        }
    }, [open, qualifications, employeeId, reset]);

    const onSubmit = async (data: CreateEmployeeQualificationType) => {
        const cleanedData = removeEmptyStrings(data);
        mutate(cleanedData);
    }

    const handleClose = () => {
        clearErrors();
        onClose();
        reset(initForm)
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-white bg-teal-500 px-4 py-2 rounded-t-lg">
                        Add Qualification
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-2">
                            <FormField
                                name="qualificationId"
                                control={control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl className="w-full" onVolumeChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Qualification" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {qualifications.length > 0 && qualifications.map(q => (
                                                    <SelectItem key={q.id} value={q?.id?.toString() || ""}>
                                                        {q.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="institution"
                                control={control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Institution</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Institution" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* City */}
                            <FormField
                                name="city"
                                control={control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="City" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Valid From / To */}
                            <div className="flex gap-3 w-full">
                                <FormField
                                    control={control}
                                    name="validFrom"
                                    render={({ field }) => {
                                        const [open, setOpen] = useState(false);
                                        const dateValue = field.value ? format(field.value, "dd/MM/yyyy") : undefined;
                                        return <FormItem>
                                            <FormLabel>ValidFrom</FormLabel>
                                            <FormControl>
                                                <Popover open={open} onOpenChange={setOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            id="date"
                                                            className="w-48 justify-between font-normal"
                                                        >
                                                            {dateValue ? dateValue : "Select date"}
                                                            <ChevronDownIcon />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[250px] overflow-hidden p-0 " align="start">
                                                        <Calendar
                                                            mode="single"
                                                            className="w-full"
                                                            selected={field.value || undefined}
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
                                    control={control}
                                    name="validTo"
                                    render={({ field }) => {
                                        const dateValue = field.value ? format(field.value, "dd/MM/yyyy") : undefined;
                                        const [open, setOpen] = useState(false);
                                        return <FormItem>
                                            <FormLabel>ValidFrom</FormLabel>
                                            <FormControl>
                                                <Popover open={open} onOpenChange={setOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            id="date"
                                                            className="w-48 justify-between font-normal"
                                                        >
                                                            {dateValue ? dateValue : "Select date"}
                                                            <ChevronDownIcon />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[250px] overflow-hidden p-0 " align="start">
                                                        <Calendar
                                                            mode="single"
                                                            className="w-full"
                                                            selected={field.value || undefined}
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
                            </div>
                        </div>

                        <div className="px-4 py-3 flex justify-end gap-2 rounded-b-lg">
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button className="bg-teal-500 hover:bg-teal-600" type="submit">
                                Accept
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
