using Volo.Abp.Application.Dtos;

namespace Gosei.EmployeeQualificationManagement.Dtos.Employees.Employee
{
    public class EmployeeSearchRequest : PagedAndSortedResultRequestDto
    {
        public string? SearchKey { get; set; }
    }
}
