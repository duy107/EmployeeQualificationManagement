import { Button } from "@/components/ui/button";
import { notification } from "@/lib/utils";
import { deleteEmployee } from "@/service/admin/employee.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteEmployeeProps {
    employeeId: string | undefined,
}

function DeleteEmployee({ employeeId }: DeleteEmployeeProps) {
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: async (employeeId: string) => await deleteEmployee(employeeId),
        onSuccess: (res) => {
            if (res.status === 204) {
                notification("Deleted employee successfully", "success");
                queryClient.invalidateQueries({ queryKey: ['employees'] });
            }else notification("Try again!");
        },
        onError: (error) => {
            notification((error as Error).message);
        }
    }) 
    const handleDelete = async () => {
        if (!confirm("Do you want to delete this employee?"))
            return;
        mutate(employeeId || "");
    }
    return (
        <>
            <Button
                onClick={handleDelete}
                variant="outline"
                className="text-red-500 border-red-300 hover:bg-red-50 hover:text-red-600 hover:border-red-400 text-xs px-3 py-1.5 font-medium transition-all"
            >
                DELETE
            </Button>
        </>
    );
}

export default DeleteEmployee;