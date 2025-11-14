using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities;

namespace Gosei.EmployeeQualificationManagement.Employees
{
    public class Qualification : Entity<Guid>
    {
        public string? Name { get; set; }
        public string? Code { get; set; }

        // EmployeeQualifications
        private readonly List<EmployeeQualification> _employeeQualifications = new();
        public IReadOnlyCollection<EmployeeQualification> EmployeeQualifications => _employeeQualifications.AsReadOnly();
        protected Qualification() { }

        public Qualification(Guid id, string name, string code) : base(id)
        {
            Name = name;
            Code = code;
        }
    }
}
