using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;

namespace Gosei.EmployeeQualificationManagement.Seeding
{
    public class AppDataSeederContributor : IDataSeedContributor, ITransientDependency
    {
        private readonly QualificationDataSeederContributor _qualificationSeeder;
        private readonly EmployeeDataSeederContributor _employeeSeeder;
        private readonly RoleDataSeederContributor _roleSeeder;

        public AppDataSeederContributor(
            QualificationDataSeederContributor qualificationSeeder,
            EmployeeDataSeederContributor employeeSeeder,
            RoleDataSeederContributor roleSeeder)
        {
            _qualificationSeeder = qualificationSeeder;
            _employeeSeeder = employeeSeeder;
            _roleSeeder = roleSeeder;
        }

        public async Task SeedAsync(DataSeedContext context)
        {
            await _roleSeeder.SeedAsync(context);
            await _qualificationSeeder.SeedAsync(context);
            await _employeeSeeder.SeedAsync(context);
        }
    }
}
