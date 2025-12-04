using Gosei.EmployeeQualificationManagement.Dtos.Employees.EmployeeQualification;
using Gosei.EmployeeQualificationManagement.Dtos.Employees.Qualification;
using Gosei.EmployeeQualificationManagement.Employees;
using Gosei.EmployeeQualificationManagement.IRepositories;
using Gosei.EmployeeQualificationManagement.Permissions;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Gosei.EmployeeQualificationManagement.AppServices
{
    public class EmployeeQualificationAppService:
        CrudAppService<EmployeeQualification, EmployeeQualificationResponse, Guid, EmployeeQualificationSearchRequest, EmployeeQualificationRequest>
    {
        private readonly IEmployeeRepository _employeesRepository;
        private readonly IQualificationRepository _qualificationRepository;
        private readonly IEmployeeQualificationRepository _employeeQualificationRepository;

        public EmployeeQualificationAppService(IEmployeeRepository employeesRepository, IQualificationRepository qualificationRepository, IEmployeeQualificationRepository employeeQualificationRepository) : base(employeeQualificationRepository)
        {
            _employeesRepository = employeesRepository;
            _qualificationRepository = qualificationRepository;
            _employeeQualificationRepository = employeeQualificationRepository;
            GetListPolicyName = PermissionConstant.EmployeeQualifications.Default;
        }

        protected override async Task<IQueryable<EmployeeQualification>> CreateFilteredQueryAsync(EmployeeQualificationSearchRequest input)
        {
            var query = await Repository.WithDetailsAsync(eq => eq.Qualification);

            if (input.EmployeeId.HasValue)
            {
                query = query.Where(eq => eq.EmployeeId == input.EmployeeId);
            }

            return query;
        }

        [Authorize(PermissionConstant.EmployeeQualifications.Create)]
        public override async Task<EmployeeQualificationResponse> CreateAsync(EmployeeQualificationRequest request)
        {
            Employee employee = await _employeesRepository.GetAsync(x => x.Id == request.EmployeeId);
            Qualification qualification = await _qualificationRepository.GetAsync(q => q.Id == request.QualificationId);
            
            employee.AddQualification(qualification, request.Institution, request.ValidFrom, request.ValidTo, request.City, null);

            await _employeesRepository.UpdateAsync(employee);

            return ObjectMapper.Map<EmployeeQualification, EmployeeQualificationResponse>(employee.EmployeeQualifications.Last());
        }
    }
}
