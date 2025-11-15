'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { create } from '@/service/admin/employeeQualification.service';
import { useQualificationStore } from '@/store/useQualificationStore';
import {
    EmployeeQualificationRequest
} from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

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
        mutationFn: async (data: EmployeeQualificationRequest) => await create(data),
        onSuccess: (data) => {
            if (data.status === 200) {
                reset(initForm)
                onClose();
                queryClient.invalidateQueries({ queryKey: ['employee-qualification']})
            } else alert("Error! Try again");
        }
    });
    const initForm = {
        employeeId,
        qualificationId: qualifications[0]?.id ?? "",
        institution: '',
        city: '',
        validFrom: '',
        validTo: '',
    }
    const { register, handleSubmit, clearErrors, control, reset,
        formState: { errors } } = useForm<EmployeeQualificationRequest>({
            defaultValues: initForm
        });
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

    const onSubmit = async (data: EmployeeQualificationRequest) => {
        if (!data.qualificationId || !data.institution?.trim())
            return alert("Please select a qualification and enter an institution name.");
        if (!data.validFrom?.trim()) delete data.validFrom;
        if (!data.validTo?.trim()) delete data.validTo;
        if (!data.city?.trim()) delete data.city;
        data.institution = data.institution?.trim();
        mutate(data);
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

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-4 py-4 space-y-4">
                        <div>
                            <Label className="text-gray-600 text-sm mb-1 block">Name</Label>
                            <Controller
                                name="qualificationId"
                                control={control}
                                rules={{ required: "Qualification name is required!" }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full border-gray-300">
                                            <SelectValue placeholder="Select qualification" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {qualifications.length > 0 && qualifications.map((q) => (
                                                <SelectItem key={q.id} value={q?.id?.toString() || ""}>
                                                    {q.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {/* Institution */}
                        <div>
                            <Label className="text-gray-600 text-sm mb-1 block">Institution</Label>
                            <Input
                                {...register("institution", {
                                    required: "Institution is required!"
                                })}
                                placeholder="Institution"
                                type="text"
                                className="border-gray-300"
                            />
                            {errors.institution && <p className="text-red-500 text-[12px] mt-1">{errors.institution.message}</p>}
                        </div>

                        {/* City */}
                        <div>
                            <Label className="text-gray-600 text-sm mb-1 block">City</Label>
                            <Input
                                {...register("city")}
                                className="border-gray-300"
                                placeholder="City"
                            />
                        </div>

                        {/* Valid From / To */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-600 text-sm mb-1 block">Valid From</Label>
                                <Input
                                    type="date"
                                    {...register("validFrom")}
                                />
                            </div>
                            <div>
                                <Label className="text-gray-600 text-sm mb-1 block">Valid To</Label>
                                <Input
                                    type="date"
                                    {...register("validTo")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 px-4 py-3 flex justify-end gap-2 rounded-b-lg">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button className="bg-teal-500 hover:bg-teal-600" type="submit">
                            Accept
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
