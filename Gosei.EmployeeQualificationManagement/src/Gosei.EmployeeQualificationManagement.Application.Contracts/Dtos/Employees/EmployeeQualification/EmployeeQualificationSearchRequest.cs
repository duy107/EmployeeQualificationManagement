using System;
using Volo.Abp.Application.Dtos;

namespace Gosei.EmployeeQualificationManagement.Dtos.Employees.EmployeeQualification
{
    public class EmployeeQualificationSearchRequest : PagedAndSortedResultRequestDto
    {
        public Guid? EmployeeId { get; set; }
    }
}
