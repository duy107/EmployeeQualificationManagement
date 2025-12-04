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
        public Guid? EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        public Guid QualificationId { get; set; }
        public Qualification Qualification { get; set; }

        protected EmployeeQualification() { }

        public EmployeeQualification(Qualification qualification, string institution, DateTime? validFrom, DateTime? validTo, string? city, string? note)
        {
            Qualification = qualification;
            Institution = institution;
            ValidFrom = validFrom;
            ValidTo = validTo;
            City = city;
            Note = note;
        }
    }
}
