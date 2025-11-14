using Gosei.EmployeeQualificationManagement.Enums.Filter;

namespace Gosei.EmployeeQualificationManagement.Commons
{
    public class ExpressionFilter
    {
        public string? PropertyName { get; set; }
        public object? Value { get; set; }
        public ComparisonEnum Comparison { get; set; }

        public ExpressionFilter(string propertyName, object value, ComparisonEnum comparison)
        {
            PropertyName = propertyName;
            Value = value;
            Comparison = comparison;
        }
    }
}
