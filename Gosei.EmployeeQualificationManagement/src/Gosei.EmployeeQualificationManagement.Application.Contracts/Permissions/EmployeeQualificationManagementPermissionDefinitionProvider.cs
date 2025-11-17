using Gosei.EmployeeQualificationManagement.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace Gosei.EmployeeQualificationManagement.Permissions;

public class EmployeeQualificationManagementPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(EmployeeQualificationManagementPermissions.GroupName);

        /// employee
        var employeesPermission = myGroup.AddPermission(EmployeeQualificationManagementPermissions.Employees.Default, L("Permission:Employees"));
        employeesPermission.AddChild(EmployeeQualificationManagementPermissions.Employees.Create, L("Permission:Employees.Create"));
        employeesPermission.AddChild(EmployeeQualificationManagementPermissions.Employees.Update, L("Permission:Employees.Update"));
        employeesPermission.AddChild(EmployeeQualificationManagementPermissions.Employees.Delete, L("Permission:Employees.Delete"));

        //// qualification
        //var qualificationPermission = myGroup.AddPermission(EmployeeQualificationManagementPermissions.Qualifications.Default, L("Permission:Qualifications"));
        //qualificationPermission.AddChild(EmployeeQualificationManagementPermissions.Qualifications.Create, L("Permission:Qualifications.Create"));
        //qualificationPermission.AddChild(EmployeeQualificationManagementPermissions.Qualifications.Update, L("Permission:Qualifications.Update"));
        //qualificationPermission.AddChild(EmployeeQualificationManagementPermissions.Qualifications.Delete, L("Permission:Qualifications.Delete"));
        
        // employee-qualification
        var employeeQualificationPermission = myGroup.AddPermission(EmployeeQualificationManagementPermissions.EmployeeQualifications.Default, L("Permission:EmployeeQualifications"));
        employeeQualificationPermission.AddChild(EmployeeQualificationManagementPermissions.EmployeeQualifications.Create, L("Permission:EmployeeQualifications.Create"));
        employeeQualificationPermission.AddChild(EmployeeQualificationManagementPermissions.EmployeeQualifications.Update, L("Permission:EmployeeQualifications.Update"));
        employeeQualificationPermission.AddChild(EmployeeQualificationManagementPermissions.EmployeeQualifications.Delete, L("Permission:EmployeeQualifications.Delete"));

    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<EmployeeQualificationManagementResource>(name);
    }
}
