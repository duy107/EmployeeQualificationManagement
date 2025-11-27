using Gosei.EmployeeQualificationManagement.Constants.Roles;
using Gosei.EmployeeQualificationManagement.Permissions;
using System.Threading.Tasks;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Gosei.EmployeeQualificationManagement.Seeding
{
    public class PermissionDataSeederContributor(IdentityRoleManager roleManager, IPermissionManager permissionManager) : ITransientDependency
    {
        private readonly IdentityRoleManager _roleManager = roleManager;
        private readonly IPermissionManager _permissionManager = permissionManager;

        public async Task SeedAsync(DataSeedContext context)
        {
            IdentityRole? employeeManagerRole = await _roleManager.FindByNameAsync(RoleConstant.Employee);
            if (employeeManagerRole != null)
                await GrantPermissionsToRoleAsync(
                    employeeManagerRole.Name,
                    PermissionConstant.Employees.Default,
                    PermissionConstant.Employees.Create,
                    PermissionConstant.Employees.Update,
                    PermissionConstant.Employees.Delete,
                    PermissionConstant.EmployeeQualifications.Default,
                    PermissionConstant.EmployeeQualifications.Create
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
