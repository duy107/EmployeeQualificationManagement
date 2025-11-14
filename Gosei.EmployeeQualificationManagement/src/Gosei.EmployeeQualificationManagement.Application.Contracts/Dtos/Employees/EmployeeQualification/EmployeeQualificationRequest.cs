using System;

namespace Gosei.EmployeeQualificationManagement.Dtos.Employees.Qualification
{
    public class EmployeeQualificationRequest
    {
        public Guid? EmployeeId { get; set; }
        public Guid QualificationId { get; set; }
        public string Institution { get; set; }
        public string? City { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
    }
}
