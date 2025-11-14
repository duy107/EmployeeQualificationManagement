using System;
using Volo.Abp.Application.Dtos;

namespace Gosei.EmployeeQualificationManagement.Dtos.Employees.EmployeeQualification
{
    public class EmployeeQualificationResponse : EntityDto<Guid>
    {
        public string Institution { get; set; }
        public string City { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }

        // qualification
        public string QualificationName { get; set; }
    }
}
