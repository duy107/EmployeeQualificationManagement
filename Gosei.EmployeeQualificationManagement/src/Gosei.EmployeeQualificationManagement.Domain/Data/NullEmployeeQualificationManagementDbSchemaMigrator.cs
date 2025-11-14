using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Gosei.EmployeeQualificationManagement.Data;

/* This is used if database provider does't define
 * IEmployeeQualificationManagementDbSchemaMigrator implementation.
 */
public class NullEmployeeQualificationManagementDbSchemaMigrator : IEmployeeQualificationManagementDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
