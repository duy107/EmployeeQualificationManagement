import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { HttpError } from "@/lib/api.lib";
import { notification } from "@/lib/utils";
import { deleteEmployee } from "@/service/admin/employee.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface DeleteEmployeeProps {
    employeeId: string | undefined,
}

function DeleteEmployee({ employeeId }: DeleteEmployeeProps) {
    const queryClient = useQueryClient();
    const [openAlert, setOpenAlert] = useState(false);
    const { mutate, isPending } = useMutation({
        mutationFn: async (employeeId: string) => await deleteEmployee(employeeId),
        onSuccess: (res) => {
            if (res.status === 204) {
                notification("Deleted employee successfully", "success");
                queryClient.invalidateQueries({ queryKey: ['employees'] });
            }
        },
        onError: (error) => {
            if (error instanceof HttpError) return;
            notification(error.message);
        }
    })
    const handleDelete = async () => mutate(employeeId || "");
    return (
        <>
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogTrigger asChild>
                    <Button
                        disabled={isPending}
                        variant="outline"
                        className="hover:cursor-pointer text-red-500 border-red-300 hover:bg-red-50 hover:text-red-600 hover:border-red-400 text-xs px-3 py-1.5 font-medium transition-all"
                    >
                        DELETE
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Are you sure you want to delete this employee?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="transition-colors hover:bg-gray-100 hover:cursor-pointer"
                            disabled={isPending}>Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isPending}
                            onClick={handleDelete}
                            className="bg-red-500 text-white hover:bg-red-600 transition-colors hover:cursor-pointer"
                        >{isPending ? "DELETING...." : "DELETE"}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
export default DeleteEmployee;