using Gosei.EmployeeQualificationManagement.Commons;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Gosei.EmployeeQualificationManagement.Dtos.Filters
{
    public class FilterRequest : PagedAndSortedResultRequestDto
    {
        public List<ExpressionFilter> Filters { get; set; } = new();
    }
}
