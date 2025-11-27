using Gosei.EmployeeQualificationManagement.Employees;
using Gosei.EmployeeQualificationManagement.EntityFrameworkCore;
using Gosei.EmployeeQualificationManagement.IRepositories;
using System;
using Volo.Abp.EntityFrameworkCore;

namespace Gosei.EmployeeQualificationManagement.Repositories
{
    public class EmployeeRepository(IDbContextProvider<EmployeeQualificationManagementDbContext> provider) : BaseRepository<Employee, Guid>(provider), IEmployeeRepository
    {
    }
}
