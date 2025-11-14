using Gosei.EmployeeQualificationManagement.Employees;
using Gosei.EmployeeQualificationManagement.EntityFrameworkCore;
using Gosei.EmployeeQualificationManagement.IRepositories;
using System;
using Volo.Abp.EntityFrameworkCore;

namespace Gosei.EmployeeQualificationManagement.Repositories
{
    public class EmployeeRepository : BaseRepository<Employee, Guid>, IEmployeeRepository
    {
        public EmployeeRepository(IDbContextProvider<EmployeeQualificationManagementDbContext> provider) : base(provider) { }
    }
}
