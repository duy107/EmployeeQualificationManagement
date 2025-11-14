using Gosei.EmployeeQualificationManagement.Employees;
using Gosei.EmployeeQualificationManagement.EntityFrameworkCore;
using Gosei.EmployeeQualificationManagement.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.EntityFrameworkCore;

namespace Gosei.EmployeeQualificationManagement.Repositories
{
    public class QualificationRepository : BaseRepository<Qualification, Guid>, IQualificationRepository
    {
        public QualificationRepository(IDbContextProvider<EmployeeQualificationManagementDbContext> provider) : base(provider) { }
    }
}
