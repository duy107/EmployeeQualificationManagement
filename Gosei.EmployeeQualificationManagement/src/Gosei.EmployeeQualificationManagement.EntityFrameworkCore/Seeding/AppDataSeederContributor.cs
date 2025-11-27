using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;

namespace Gosei.EmployeeQualificationManagement.Seeding
{
    public class AppDataSeederContributor(
        QualificationDataSeederContributor qualificationSeeder,
        EmployeeDataSeederContributor employeeSeeder,
        RoleDataSeederContributor roleSeeder,
        PermissionDataSeederContributor permissionSeeder) : IDataSeedContributor, ITransientDependency
    {
        private readonly QualificationDataSeederContributor _qualificationSeeder = qualificationSeeder;
        private readonly EmployeeDataSeederContributor _employeeSeeder = employeeSeeder;
        private readonly RoleDataSeederContributor _roleSeeder = roleSeeder;
        private readonly PermissionDataSeederContributor _permissionSeeder = permissionSeeder;

        public async Task SeedAsync(DataSeedContext context)
        {
            await _roleSeeder.SeedAsync(context);
            await _permissionSeeder.SeedAsync(context);
            await _qualificationSeeder.SeedAsync(context);
            await _employeeSeeder.SeedAsync(context);
        }
    }
}
