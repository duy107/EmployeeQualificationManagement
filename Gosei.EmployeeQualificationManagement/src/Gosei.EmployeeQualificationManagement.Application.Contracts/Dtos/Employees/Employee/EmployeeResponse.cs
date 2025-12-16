using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;

namespace Gosei.EmployeeQualificationManagement.Dtos.Employees.Employee
{
    public class EmployeeResponse : EntityDto<Guid>, IHasConcurrencyStamp
    {
        public string FirstName { get; set; } 
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public DateTime BirthDate { get; set; }
        public string Email { get; set; }
        public string Note { get; set; }
        public string ConcurrencyStamp { get; set; }
    }
}
