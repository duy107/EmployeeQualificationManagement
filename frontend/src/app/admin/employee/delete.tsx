import { Button } from "@/components/ui/button";
import { notification } from "@/lib/utils";
import { deleteEmployee } from "@/service/admin/employee.service";

interface DeleteEmployeeProps {
    employeeId: string | undefined,
    reload: () => void
}

function DeleteEmployee({ employeeId, reload }: DeleteEmployeeProps) {
    const handleDelete = async () => {
        if (!confirm("Do you want to delete this employee?"))
            return;
        const res = await deleteEmployee(employeeId || "");
        if (res.status === 204) {
            notification("Deleted employee successfully", "success");
            reload();
        } else notification("Try again!");

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