using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Gosei.EmployeeQualificationManagement.EntityFrameworkCore;

/* This class is needed for EF Core console commands
 * (like Add-Migration and Update-Database commands) */
public class EmployeeQualificationManagementDbContextFactory : IDesignTimeDbContextFactory<EmployeeQualificationManagementDbContext>
{
    public EmployeeQualificationManagementDbContext CreateDbContext(string[] args)
    {
        var configuration = BuildConfiguration();
        
        EmployeeQualificationManagementEfCoreEntityExtensionMappings.Configure();

        var builder = new DbContextOptionsBuilder<EmployeeQualificationManagementDbContext>()
            .UseSqlServer(configuration.GetConnectionString("Default"));
        
        return new EmployeeQualificationManagementDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Gosei.EmployeeQualificationManagement.DbMigrator/"))
            .AddJsonFile("appsettings.json", optional: false);

        return builder.Build();
    }
}
