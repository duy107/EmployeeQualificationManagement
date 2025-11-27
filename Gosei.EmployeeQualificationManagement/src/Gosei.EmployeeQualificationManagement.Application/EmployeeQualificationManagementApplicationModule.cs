using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.Account;
using Volo.Abp.Identity;
using Volo.Abp.AutoMapper;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Modularity;
using Volo.Abp.TenantManagement;
using Volo.Abp.FluentValidation;
using Volo.Abp.Domain.Entities.Caching;
using Gosei.EmployeeQualificationManagement.Employees;
using Gosei.EmployeeQualificationManagement.Dtos.Employees.Employee;
using System;
using Volo.Abp.Caching;

namespace Gosei.EmployeeQualificationManagement;

[DependsOn(
    typeof(EmployeeQualificationManagementDomainModule),
    typeof(EmployeeQualificationManagementApplicationContractsModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpAccountApplicationModule),
    typeof(AbpTenantManagementApplicationModule),
    typeof(AbpSettingManagementApplicationModule),
    typeof(AbpFluentValidationModule)
    )]
public class EmployeeQualificationManagementApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {

        // cache DTO
        context.Services.AddEntityCache<Employee, EmployeeResponse, Guid>();
        
        Configure<AbpAutoMapperOptions>(options =>
        {
            options.AddMaps<EmployeeQualificationManagementApplicationModule>();
        });

        // cache expiration time
        Configure<AbpDistributedCacheOptions>(options =>
        {
            options.GlobalCacheEntryOptions.SlidingExpiration = TimeSpan.FromMinutes(5);
            options.GlobalCacheEntryOptions.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
        });
    }
}
