using System;

namespace Gosei.EmployeeQualificationManagement.Dtos.Employees.Employee
{
    public class EmployeeRequest
    {
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public string? Gender { get; set; }
        public string? Note { get; set; }
    }
}
