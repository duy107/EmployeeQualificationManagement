import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { deleteEmployee } from "@/service/admin/employee.service";

interface DeleteEmployeeProps {
    employeeId: string | undefined,
    children: React.ReactNode
}

function DeleteEmployee({ employeeId, children }: DeleteEmployeeProps) {

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (employeeId: string) => await deleteEmployee(employeeId),
        onSuccess: (res) => {
            if (res.status === 204) {
                toast.success("Deleted employee successfully");
                queryClient.invalidateQueries({ queryKey: ['employees'] });
            }
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })

    const handleDelete = async () => mutate(employeeId || "");

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    {children}
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