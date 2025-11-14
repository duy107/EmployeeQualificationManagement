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
        private IGuidGenerator _guidGenerator;
        public RoleDataSeederContributor(IdentityRoleManager roleManagement, IGuidGenerator guidGenerator)
        {
            _roleManagement = roleManagement; 
            _guidGenerator = guidGenerator;
        }
        public async Task SeedAsync(DataSeedContext context)
        {
            const string roleName = "employee";
            if (await _roleManagement.FindByNameAsync(roleName) != null)
                return;
            await _roleManagement.CreateAsync(new IdentityRole(_guidGenerator.Create(), roleName));
        }
    }
}
