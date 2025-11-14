using Gosei.EmployeeQualificationManagement.Employees;
using Gosei.EmployeeQualificationManagement.EntityFrameworkCore;
using Gosei.EmployeeQualificationManagement.IRepositories;
using System;
using Volo.Abp.EntityFrameworkCore;

namespace Gosei.EmployeeQualificationManagement.Repositories
{
    public class EmployeeQualificationRepository : BaseRepository<EmployeeQualification, Guid>, IEmployeeQualificationRepository
    {
        public EmployeeQualificationRepository(IDbContextProvider<EmployeeQualificationManagementDbContext> provider) : base(provider) { }
    }
}
