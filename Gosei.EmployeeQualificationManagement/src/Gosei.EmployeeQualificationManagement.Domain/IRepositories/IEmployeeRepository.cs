using Gosei.EmployeeQualificationManagement.Employees;
using System;

namespace Gosei.EmployeeQualificationManagement.IRepositories
{
    public interface IEmployeeRepository : IBaseRepository<Employee, Guid>
    {
    }
}
