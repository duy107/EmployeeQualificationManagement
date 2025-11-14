using System;
using Volo.Abp.Domain.Entities;

namespace Gosei.EmployeeQualificationManagement.Employees
{
    public class EmployeeQualification : Entity<Guid>
    {
        public string Institution { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public string? City { get; set; }
        public string? Note { get; set; }
        // employee
        public Guid? EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        // qualification
        public Guid QualificationId { get; set; }
        public Qualification Qualification { get; set; }

        public EmployeeQualification(Guid id) : base(id) { }
        protected EmployeeQualification() { }
    }
}
