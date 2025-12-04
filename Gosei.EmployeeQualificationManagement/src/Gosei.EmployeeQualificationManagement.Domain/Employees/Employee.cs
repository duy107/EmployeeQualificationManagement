using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Identity;

namespace Gosei.EmployeeQualificationManagement.Employees
{
    public class Employee : Entity<Guid>
    {
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public string? Gender { get; set; }
        public DateTime BirthDate { get; set; }
        public string Email { get; set; }
        public string? Note { get; set; }

        public virtual IdentityUser User { get; set; }

        private readonly List<EmployeeQualification> _employeeQualifications = new();
        public IReadOnlyCollection<EmployeeQualification> EmployeeQualifications => _employeeQualifications.AsReadOnly();
        protected Employee() { }

        public Employee (Guid id, string firstName, string? middleName, string lastName, string? gender, DateTime birthDate, string email, string? note) : base (id)
        {
            FirstName = firstName;
            MiddleName = middleName;
            LastName = lastName;
            Gender = gender;
            BirthDate = birthDate;
            Email = email;
            Note = note;
        }

        public void AddQualification(Qualification qualification, string institution, DateTime? validFrom, DateTime? validTo, string? city, string? note)
        {
            EmployeeQualification employeeQualification = new EmployeeQualification(qualification, institution, validFrom, validTo, city, note);
            _employeeQualifications.Add(employeeQualification);
        }
    }
}
