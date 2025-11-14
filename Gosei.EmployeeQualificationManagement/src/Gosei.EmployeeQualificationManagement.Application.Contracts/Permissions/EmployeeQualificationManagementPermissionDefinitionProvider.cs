using Gosei.EmployeeQualificationManagement.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace Gosei.EmployeeQualificationManagement.Permissions;

public class EmployeeQualificationManagementPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(EmployeeQualificationManagementPermissions.GroupName);

        //Define your own permissions here. Example:
        //myGroup.AddPermission(EmployeeQualificationManagementPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<EmployeeQualificationManagementResource>(name);
    }
}
