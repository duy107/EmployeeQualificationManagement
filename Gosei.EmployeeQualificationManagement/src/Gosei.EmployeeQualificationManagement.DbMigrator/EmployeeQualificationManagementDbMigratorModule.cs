using Gosei.EmployeeQualificationManagement.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace Gosei.EmployeeQualificationManagement.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(EmployeeQualificationManagementEntityFrameworkCoreModule),
    typeof(EmployeeQualificationManagementApplicationContractsModule)
)]
public class EmployeeQualificationManagementDbMigratorModule : AbpModule
{
}
