using Gosei.EmployeeQualificationManagement.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace Gosei.EmployeeQualificationManagement.Permissions;

public class EmployeeQualificationManagementPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(PermissionConstant.GroupName);

        /// employee
        var employeesPermission = myGroup.AddPermission(PermissionConstant.Employees.Default, L("Permission:Employees"));
        employeesPermission.AddChild(PermissionConstant.Employees.Create, L("Permission:Employees.Create"));
        employeesPermission.AddChild(PermissionConstant.Employees.Update, L("Permission:Employees.Update"));
        employeesPermission.AddChild(PermissionConstant.Employees.Delete, L("Permission:Employees.Delete"));
        
        // employee-qualification
        var employeeQualificationPermission = myGroup.AddPermission(PermissionConstant.EmployeeQualifications.Default, L("Permission:EmployeeQualifications"));
        employeeQualificationPermission.AddChild(PermissionConstant.EmployeeQualifications.Create, L("Permission:EmployeeQualifications.Create"));
        employeeQualificationPermission.AddChild(PermissionConstant.EmployeeQualifications.Update, L("Permission:EmployeeQualifications.Update"));
        employeeQualificationPermission.AddChild(PermissionConstant.EmployeeQualifications.Delete, L("Permission:EmployeeQualifications.Delete"));

    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<EmployeeQualificationManagementResource>(name);
    }
}
