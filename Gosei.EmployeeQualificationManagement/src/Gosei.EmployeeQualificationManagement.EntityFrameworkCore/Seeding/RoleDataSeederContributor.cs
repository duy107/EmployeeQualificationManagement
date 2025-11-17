using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.Identity;

namespace Gosei.EmployeeQualificationManagement.Seeding
{
    public class RoleDataSeederContributor : ITransientDependency
    {
        private readonly IdentityRoleManager _roleManagement;
        private readonly IGuidGenerator _guidGenerator;
        public RoleDataSeederContributor(IdentityRoleManager roleManagement, IGuidGenerator guidGenerator)
        {
            _roleManagement = roleManagement; 
            _guidGenerator = guidGenerator;
        }
        public async Task SeedAsync(DataSeedContext context)
        {
            if (await FindRoleByName("employee") == null)
            {
                IdentityRole employee = new IdentityRole(_guidGenerator.Create(), "employee");
                employee.IsPublic = true;
                await _roleManagement.CreateAsync(employee);
            }
            if (await FindRoleByName("employee_manager") == null)
            {
                IdentityRole employeeManager = new IdentityRole(_guidGenerator.Create(), "employee_manager");
                employeeManager.IsPublic = true;
                await _roleManagement.CreateAsync(employeeManager);
            }
        }
        private async Task<IdentityRole?> FindRoleByName(string roleName)
                => await _roleManagement.FindByNameAsync(roleName);
    }
}
