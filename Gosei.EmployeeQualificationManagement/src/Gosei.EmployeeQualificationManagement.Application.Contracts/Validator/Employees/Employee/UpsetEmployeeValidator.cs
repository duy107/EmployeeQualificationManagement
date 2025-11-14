using FluentValidation;
using Gosei.EmployeeQualificationManagement.Dtos.Employees.Employee;
using Volo.Abp.Data;

namespace Gosei.EmployeeQualificationManagement.Validator.Employees.Employee
{
    public class UpsetEmployeeValidator : AbstractValidator<EmployeeRequest>
    {
        public UpsetEmployeeValidator()
        {
            RuleFor(e => e.FirstName).NotEmpty().MaximumLength(50);
            RuleFor(e => e.MiddleName)
                .MaximumLength(50)
                .Must(midName => midName == null || !string.IsNullOrWhiteSpace(midName));
            RuleFor(e => e.LastName).NotEmpty().MaximumLength(50);
            RuleFor(e => e.BirthDate).NotEmpty();
            RuleFor(e => e.Note)
               .MaximumLength(50)
               .Must(note => note == null || !string.IsNullOrWhiteSpace(note));
        }
    }
}
