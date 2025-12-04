using Gosei.EmployeeQualificationManagement.Dtos.Employees.Qualification;
using Gosei.EmployeeQualificationManagement.Employees;
using Gosei.EmployeeQualificationManagement.IRepositories;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Gosei.EmployeeQualificationManagement.AppServices
{
    public class QualificationAppService : CrudAppService<Qualification, QualificationResponse, Guid, PagedAndSortedResultRequestDto, object>
    {
        private readonly IQualificationRepository _qualificationRepository;
        
        public QualificationAppService(IQualificationRepository qualificationRepository) : base(qualificationRepository)
        {
            _qualificationRepository = qualificationRepository;
        }

        [Authorize]
        public override async Task<PagedResultDto<QualificationResponse>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            var query = await CreateFilteredQueryAsync(input);
            var allItems = await AsyncExecuter.ToListAsync(query);
            
            return new PagedResultDto<QualificationResponse>(
                allItems.Count,
                ObjectMapper.Map<List<Qualification>, List<QualificationResponse>>(allItems));
        }
    }
}
