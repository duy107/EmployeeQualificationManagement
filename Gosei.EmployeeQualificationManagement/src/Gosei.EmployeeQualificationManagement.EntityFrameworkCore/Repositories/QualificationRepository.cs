using Gosei.EmployeeQualificationManagement.Employees;
using Gosei.EmployeeQualificationManagement.EntityFrameworkCore;
using Gosei.EmployeeQualificationManagement.IRepositories;
using System;
using Volo.Abp.EntityFrameworkCore;

namespace Gosei.EmployeeQualificationManagement.Repositories
{
    public class QualificationRepository(IDbContextProvider<EmployeeQualificationManagementDbContext> provider) : BaseRepository<Qualification, Guid>(provider), IQualificationRepository
    {
    }
}
