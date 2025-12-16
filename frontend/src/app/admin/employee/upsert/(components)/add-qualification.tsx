'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    Dialog, DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';

import { removeEmptyStrings } from '@/lib/utils';
import { useQualificationStore } from '@/store/useQualificationStore';
import { create } from '@/service/admin/employeeQualification.service';
import {
    createEmployeeQualificationSchema,
    CreateEmployeeQualificationType
} from '@/types';
import QualificationForm from './qualification-form';

interface AddQualificationModalProps {
    employeeId: string;
    children: React.ReactNode;
}

export default function AddQualificationModal({
    employeeId,
    children
}: AddQualificationModalProps) {

    const queryClient = useQueryClient();

    const [open, setOpen] = useState<boolean>(false);
    const { qualifications, fetchQualifications } = useQualificationStore();

    const initForm = useMemo(() => ({
        employeeId,
        qualificationId: qualifications[0]?.id ?? "",
        institution: "",
        city: "",
        validFrom: undefined,
        validTo: undefined,
    }), [employeeId, qualifications]);

    const { mutate } = useMutation({
        mutationFn: async (data: CreateEmployeeQualificationType) => await create(data),
        onSuccess: (data) => {
            if (data.status === 200) {
                reset(initForm)
                setOpen(false);
                queryClient.invalidateQueries({ queryKey: ['employee-qualification'] })
                toast.success("Create qualification successfully");
            } else {
                toast.error("Create qualification successfully");
            };
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const form = useForm<CreateEmployeeQualificationType>({
        resolver: zodResolver(createEmployeeQualificationSchema),
        defaultValues: initForm
    });
    const { reset, clearErrors } = form;

    const handleOpenChagne = (status: boolean) => {
        if (status) {
            if (qualifications.length === 0) {
                fetchQualifications();
            }
        } else {
            clearErrors();
        }
        reset(initForm);
        setOpen(status);
    }


    const onSubmit = async (data: CreateEmployeeQualificationType) => {
        const cleanedData = removeEmptyStrings(data) as CreateEmployeeQualificationType;
        mutate(cleanedData);
    }

    const handleClose = () => {
        clearErrors();
        setOpen(false);
        reset(initForm)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChagne}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-white bg-teal-500 px-4 py-2 rounded-t-lg">
                        Add Qualification
                    </DialogTitle>
                </DialogHeader>
                <QualificationForm
                    form={form}
                    handleClose={handleClose}
                    onSubmit={onSubmit}
                    qualifications={qualifications}
                />
            </DialogContent>
        </Dialog>
    );
}
