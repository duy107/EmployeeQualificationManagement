using System;
using Volo.Abp.Application.Dtos;

namespace Gosei.EmployeeQualificationManagement.Dtos.Employees.EmployeeQualification
{
    public class EmployeeQualificationResponse : EntityDto<Guid>
    {
        public string Institution { get; set; }
        public string City { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }

        // qualification
        public string QualificationName { get; set; }
    }
}
