using FluentValidation;
using Gosei.EmployeeQualificationManagement.Dtos.Employees.Qualification;

namespace Gosei.EmployeeQualificationManagement.Validator.Employees.EmployeeQualification
{
    public class CreateEmployeeQualificationValidator : AbstractValidator<EmployeeQualificationRequest>
    {
        public CreateEmployeeQualificationValidator()
        {
            RuleFor(eq => eq.EmployeeId).Must(item => item == null || !string.IsNullOrWhiteSpace(item.ToString()));
            RuleFor(eq => eq.QualificationId).NotEmpty();
            RuleFor(eq => eq.Institution).NotEmpty().MaximumLength(250);
            RuleFor(eq => eq.City).MaximumLength(250)
                .Must(item => item == null || !string.IsNullOrWhiteSpace(item));
        }
    }
}
