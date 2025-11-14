using Gosei.EmployeeQualificationManagement.Dtos.Filters;

namespace Gosei.EmployeeQualificationManagement.Dtos.Employees.Employee
{
    public class EmployeeSearchRequest : FilterRequest
    {
        public string? SearchKey { get; set; }
    }
}
