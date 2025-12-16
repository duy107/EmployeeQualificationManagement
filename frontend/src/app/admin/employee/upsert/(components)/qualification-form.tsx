import { format } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';
import { ChevronDownIcon } from 'lucide-react';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { CreateEmployeeQualificationType, QualificationResponse } from '@/types';
import { useState } from 'react';

interface QualificationFormProps {
    form: UseFormReturn<CreateEmployeeQualificationType>,
    qualifications: QualificationResponse[],
    handleClose: () => void,
    onSubmit: (data: CreateEmployeeQualificationType) => void,
}

function QualificationForm({ form, onSubmit, qualifications, handleClose }: QualificationFormProps) {

    const [openValidFrom, setOpenValidForm] = useState<boolean>(false);
    const [openValidTo, setOpenValidTo] = useState<boolean>(false);

    const { control, handleSubmit } = form;

    return (
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
                                const dateValue = field.value ? format(field.value, "dd/MM/yyyy") : undefined;
                                return <FormItem>
                                    <FormLabel>ValidFrom</FormLabel>
                                    <FormControl>
                                        <Popover open={openValidFrom} onOpenChange={setOpenValidForm}>
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
                                                        setOpenValidForm(false)
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
                                return <FormItem>
                                    <FormLabel>ValidFrom</FormLabel>
                                    <FormControl>
                                        <Popover open={openValidTo} onOpenChange={setOpenValidTo}>
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
                                                        setOpenValidTo(false)
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
                <div className="flex justify-end items-center mt-2 gap-x-4">
                    <Button
                        className="bg-gray-200 text-gray-700 hover:bg-gray-300 hover:cursor-pointer"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-green-100 text-green-500 hover:bg-green-200 hover:cursor-pointer"
                        type="submit"
                    >
                        Accept
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default QualificationForm;