using Gosei.EmployeeQualificationManagement.Dtos.Employees.EmployeeQualification;
using Gosei.EmployeeQualificationManagement.Dtos.Employees.Qualification;
using Gosei.EmployeeQualificationManagement.Employees;
using Gosei.EmployeeQualificationManagement.IRepositories;
using Gosei.EmployeeQualificationManagement.Permissions;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Gosei.EmployeeQualificationManagement.AppServices
{
    public class EmployeeQualificationAppService : BaseAppService<EmployeeQualification, EmployeeQualificationResponse, Guid, EmployeeQualificationSearchRequest, EmployeeQualificationRequest>
    {
        private readonly IEmployeeQualificationRepository _employeeQualificationRepository;
        private readonly IEmployeeRepository _employeesRepository;
        private readonly IQualificationRepository _qualificationRepository;
        public EmployeeQualificationAppService(IEmployeeQualificationRepository employeeQualificationRepository, IEmployeeRepository employeesRepository, IQualificationRepository qualificationRepository) : base(employeeQualificationRepository)
        {
            _employeeQualificationRepository = employeeQualificationRepository;
            _employeesRepository = employeesRepository;
            _qualificationRepository = qualificationRepository;
            GetListPolicyName = PermissionConstant.EmployeeQualifications.Default;
        }
        protected override async Task<IQueryable<EmployeeQualification>> CreateFilteredQueryAsync(EmployeeQualificationSearchRequest input)
        {
            var query = await base.CreateFilteredQueryAsync(input);
            
            if (input.EmployeeId.HasValue)
                query = query.Where(eq => eq.EmployeeId.HasValue && eq.EmployeeId.Value == input.EmployeeId.Value);
            
            if(input.IncludeQualification == true)
            {
                List<Expression<Func<EmployeeQualification, object>>> includeExpressions = new()
                {
                    eq => eq.Qualification
                };
                query = _employeeQualificationRepository.WithDetails(query, includeExpressions);
            }
            return query;
        }

        [Authorize(PermissionConstant.EmployeeQualifications.Create)]
        public override async Task<EmployeeQualificationResponse> CreateAsync(EmployeeQualificationRequest input)
        {
            Employee employee = await _employeesRepository.GetAsync(x => x.Id == input.EmployeeId);
            Qualification qualification = await _qualificationRepository.GetAsync(q => q.Id == input.QualificationId);
            EmployeeQualification employeeQualification = ObjectMapper.Map<EmployeeQualificationRequest, EmployeeQualification>(input);
            
            employee.AddQualification(employeeQualification);

            await _employeesRepository.UpdateAsync(employee);

            return ObjectMapper.Map<EmployeeQualification, EmployeeQualificationResponse>(employeeQualification);
        }
    }
}
