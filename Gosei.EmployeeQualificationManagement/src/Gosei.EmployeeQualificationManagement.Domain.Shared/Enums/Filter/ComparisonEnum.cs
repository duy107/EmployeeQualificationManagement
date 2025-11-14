using System.ComponentModel.DataAnnotations;

namespace Gosei.EmployeeQualificationManagement.Enums.Filter
{
    public enum ComparisonEnum
    {
        [Display(Name = "==")]
        Equal,
        [Display(Name = "<")]
        LessThan,
        [Display(Name = ">")]
        GreaterThan,
        [Display(Name = "<=")]
        LessThanOrEqual,
        [Display(Name = ">=")]
        GreaterThanOrEqual,
        [Display(Name = "!=")]
        NotEqual,
        [Display(Name = "Contains")]
        Contains,
        [Display(Name = "StartsWith")]
        StartsWith,
        [Display(Name = "EndsWith")]
        EndsWith,
    }
}
