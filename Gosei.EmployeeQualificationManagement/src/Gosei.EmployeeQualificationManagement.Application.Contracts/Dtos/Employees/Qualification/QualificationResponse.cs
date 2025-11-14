        using System;
using Volo.Abp.Application.Dtos;

namespace Gosei.EmployeeQualificationManagement.Dtos.Employees.Qualification
{
    public class QualificationResponse : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Code { get; set; }
    }
}
