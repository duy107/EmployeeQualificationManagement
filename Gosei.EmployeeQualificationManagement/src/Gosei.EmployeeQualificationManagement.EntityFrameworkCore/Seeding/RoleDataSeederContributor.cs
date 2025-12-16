using Gosei.EmployeeQualificationManagement.Constants.Roles;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.Identity;

namespace Gosei.EmployeeQualificationManagement.Seeding
{
    public class RoleDataSeederContributor(IdentityRoleManager roleManagement, IGuidGenerator guidGenerator) : ITransientDependency
    {
        private readonly IdentityRoleManager _roleManagement = roleManagement;
        private readonly IGuidGenerator _guidGenerator = guidGenerator;

        public async Task SeedAsync(DataSeedContext context)
        {
            if (await FindRoleByName(RoleConstant.Employee) == null)
            {
                IdentityRole employee = new IdentityRole(_guidGenerator.Create(), RoleConstant.Employee);
                employee.IsPublic = true;
                await _roleManagement.CreateAsync(employee);
            }
        }

        private async Task<IdentityRole?> FindRoleByName(string roleName)
                => await _roleManagement.FindByNameAsync(roleName);
    }
}
