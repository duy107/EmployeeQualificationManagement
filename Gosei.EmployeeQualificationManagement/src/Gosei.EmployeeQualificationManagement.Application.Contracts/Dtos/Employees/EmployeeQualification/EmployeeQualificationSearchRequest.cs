using Gosei.EmployeeQualificationManagement.Dtos.Filters;
using System;

namespace Gosei.EmployeeQualificationManagement.Dtos.Employees.EmployeeQualification
{
    public class EmployeeQualificationSearchRequest : FilterRequest
    {
        public Guid? EmployeeId { get; set; }
        public bool? IncludeQualification { get; set; }
    }
}
