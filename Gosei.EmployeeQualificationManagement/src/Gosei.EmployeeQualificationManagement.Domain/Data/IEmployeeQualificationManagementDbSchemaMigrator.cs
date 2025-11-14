using System.Threading.Tasks;

namespace Gosei.EmployeeQualificationManagement.Data;

public interface IEmployeeQualificationManagementDbSchemaMigrator
{
    Task MigrateAsync();
}
