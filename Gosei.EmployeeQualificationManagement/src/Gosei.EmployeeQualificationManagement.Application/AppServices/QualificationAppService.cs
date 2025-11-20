using Gosei.EmployeeQualificationManagement.Dtos.Employees.Qualification;
using Gosei.EmployeeQualificationManagement.Dtos.Filters;
using Gosei.EmployeeQualificationManagement.Employees;
using Gosei.EmployeeQualificationManagement.IRepositories;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace Gosei.EmployeeQualificationManagement.AppServices
{
    public class QualificationAppService : BaseAppService<Qualification, QualificationResponse, Guid, FilterRequest, object>
    {
        private readonly IQualificationRepository _qualificationRepository;
        public QualificationAppService(IQualificationRepository qualificationRepository) : base(qualificationRepository)
        {
            _qualificationRepository = qualificationRepository;
        }

        [AllowAnonymous]
        public override async Task<PagedResultDto<QualificationResponse>> GetListAsync(FilterRequest input)
        {
            var query = await CreateFilteredQueryAsync(input);
            var allItems = await AsyncExecuter.ToListAsync(query);
            return new PagedResultDto<QualificationResponse>(
                allItems.Count,
                ObjectMapper.Map<List<Qualification>, List<QualificationResponse>>(allItems));
        }
    }
}
