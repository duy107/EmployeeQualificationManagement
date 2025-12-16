"use client"

import Link from "next/link";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { UpsertEmployeeType } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button, 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage, 
    Input, 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue } from "@/components/ui";

interface UpsertFormProps {
    isPending: boolean,
    form: UseFormReturn<UpsertEmployeeType>; 
    onSubmit: (data: UpsertEmployeeType) => void
}

function UpsertForm( { isPending, form, onSubmit } : UpsertFormProps) {

    const [openBirthDate, setOpenBirthDate] = useState<boolean>(false);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => {
                            const dateValue = field.value ? format(field.value, "dd/MM/yyyy") : undefined;
                            return <FormItem>
                                <FormLabel>Birth Date</FormLabel>
                                <FormControl>
                                    <Popover open={openBirthDate} onOpenChange={setOpenBirthDate}>
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
                                                    setOpenBirthDate(false)
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
                        control={form.control}
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
                    <Button type='submit' className="bg-teal-500 hover:bg-teal-600 text-white">{isPending ? "Accepting..." : "Accept"}</Button>
                </div>
            </form>
        </Form>
    );
}

export default UpsertForm;