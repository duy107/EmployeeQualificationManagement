using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Gosei.EmployeeQualificationManagement.Data;
using Volo.Abp.DependencyInjection;

namespace Gosei.EmployeeQualificationManagement.EntityFrameworkCore;

public class EntityFrameworkCoreEmployeeQualificationManagementDbSchemaMigrator
    : IEmployeeQualificationManagementDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCoreEmployeeQualificationManagementDbSchemaMigrator(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolving the EmployeeQualificationManagementDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<EmployeeQualificationManagementDbContext>()
            .Database
            .MigrateAsync();
    }
}
