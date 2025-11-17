using Gosei.EmployeeQualificationManagement.Permissions;
using System;
using System.Threading.Tasks;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Gosei.EmployeeQualificationManagement.Seeding
{
    public class PermissionDataSeederContributor : ITransientDependency
    {
        private readonly IdentityRoleManager _roleManager;
        private readonly IPermissionManager _permissionManager;

        public PermissionDataSeederContributor(IdentityRoleManager roleManager, IPermissionManager permissionManager)
        {
            _roleManager = roleManager;
            _permissionManager = permissionManager;
        }

        public async Task SeedAsync(DataSeedContext context)
        {
            IdentityRole employeeManagerRole = await _roleManager.FindByNameAsync("employee_manager");
            if (employeeManagerRole != null)
                await GrantPermissionsToRoleAsync(
                    employeeManagerRole.Name,
                    EmployeeQualificationManagementPermissions.Employees.Default,
                    EmployeeQualificationManagementPermissions.Employees.Create,
                    EmployeeQualificationManagementPermissions.Employees.Update,
                    EmployeeQualificationManagementPermissions.Employees.Delete,
                    EmployeeQualificationManagementPermissions.EmployeeQualifications.Default,
                    EmployeeQualificationManagementPermissions.EmployeeQualifications.Create
                );
        }
        private async Task GrantPermissionsToRoleAsync(string roleName, params string[] permissions)
        {
            foreach(string permissionName in permissions)
            {
                await _permissionManager.SetAsync(
                    permissionName,
                    RolePermissionValueProvider.ProviderName,
                    roleName,
                    true
                );
            }
        }
    }
}
