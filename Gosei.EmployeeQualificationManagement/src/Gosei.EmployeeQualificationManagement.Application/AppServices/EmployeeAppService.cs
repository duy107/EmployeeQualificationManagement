using Gosei.EmployeeQualificationManagement.Commons;
using Gosei.EmployeeQualificationManagement.Constants.Roles;
using Gosei.EmployeeQualificationManagement.Dtos.Employees.Employee;
using Gosei.EmployeeQualificationManagement.Employees;
using Gosei.EmployeeQualificationManagement.Enums.Filter;
using Gosei.EmployeeQualificationManagement.IRepositories;
using Gosei.EmployeeQualificationManagement.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Caching;
using Volo.Abp.Guids;
using Volo.Abp.Identity;

namespace Gosei.EmployeeQualificationManagement.AppServices
{
    public class EmployeeAppService : BaseAppService<Employee, EmployeeResponse, Guid, EmployeeSearchRequest, EmployeeRequest>
    {
        private readonly IEntityCache<EmployeeResponse, Guid> _employeeCache;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IdentityUserManager _userManagement;
        private readonly IGuidGenerator _guidGenerator;
        private readonly IConfiguration _configuration;

        public EmployeeAppService(IEmployeeRepository employeeRepository, IdentityUserManager userManager, IGuidGenerator guidGenerator, IEntityCache<EmployeeResponse, Guid> employeeCache, IConfiguration configuration) : base(employeeRepository)
        {
            _employeeRepository = employeeRepository;
            _userManagement = userManager;
            _guidGenerator = guidGenerator;
            _employeeCache = employeeCache;
            _configuration = configuration;
            GetListPolicyName = PermissionConstant.Employees.Default;
        }

        protected override async Task<IQueryable<Employee>> CreateFilteredQueryAsync(EmployeeSearchRequest input)
        {
            if (!input.SearchKey.IsNullOrWhiteSpace())
            {
                input.Filters.Add(new ExpressionFilter("FirstName", input.SearchKey, ComparisonEnum.Contains));
                input.Filters.Add(new ExpressionFilter("MiddleName", input.SearchKey, ComparisonEnum.Contains));
                input.Filters.Add(new ExpressionFilter("LastName", input.SearchKey, ComparisonEnum.Contains));
            }
            return await base.CreateFilteredQueryAsync(input);
        }

        [Authorize(PermissionConstant.Employees.Default)]
        public override async Task<EmployeeResponse> GetAsync(Guid id)
        {
            return await _employeeCache.GetAsync(id);
        }

        [Authorize(PermissionConstant.Employees.Create)]
        public override async Task<EmployeeResponse> CreateAsync(EmployeeRequest input)
        {
            var defaultPassword = _configuration["Seeding:DefaultPassword"];

            string userName = await GenerateUserName(input);
            string email = $"{userName}@gosei.com.vn";

            IdentityUser user = new IdentityUser(_guidGenerator.Create(), userName, email);

            (await _userManagement.CreateAsync(user)).CheckErrors();
            (await _userManagement.AddPasswordAsync(user, defaultPassword ?? "1q2w3E*")).CheckErrors();
            (await _userManagement.AddToRoleAsync(user, RoleConstant.Employee)).CheckErrors();

            Employee employee = new Employee(user.Id, input.FirstName, input.MiddleName, input.LastName, input.Gender, input.BirthDate, email, input.Note);

            await _employeeRepository.InsertAsync(employee);
            return ObjectMapper.Map<Employee, EmployeeResponse>(employee);
        }


        [Authorize(PermissionConstant.Employees.Update)]
        public override async Task<EmployeeResponse> UpdateAsync(Guid id, EmployeeRequest input)
        {
            (Employee employee, IdentityUser? user) = await FindEmployeeAndUserAsync(id);

            if (user == null)
                throw new EntityNotFoundException($"User with id={id} not found");

            string userName = await GenerateUserName(input);

            if (user.UserName != userName)
            {
                string newEmail = $"{userName}@gosei.com.vn";
                (await _userManagement.SetUserNameAsync(user, userName)).CheckErrors();
                (await _userManagement.SetEmailAsync(user, newEmail)).CheckErrors();
                employee.Email = newEmail;
            }
            ObjectMapper.Map(input, employee);

            (await _userManagement.UpdateAsync(user)).CheckErrors();
            await _employeeRepository.UpdateAsync(employee);

            return ObjectMapper.Map<Employee, EmployeeResponse>(employee);
        }

        [Authorize(PermissionConstant.Employees.Delete)]
        public override async Task DeleteAsync(Guid id)
        {
            (Employee employee, IdentityUser? user) = await FindEmployeeAndUserAsync(id);

            if (user == null)
                throw new EntityNotFoundException($"User with id={id} not found");

            await _userManagement.DeleteAsync(user);
            await _employeeRepository.DeleteAsync(employee);
        }
        private async Task<(Employee employee, IdentityUser? user)> FindEmployeeAndUserAsync(Guid id)
        {
            var employee = await _employeeRepository.GetAsync(id);
            var user = await _userManagement.FindByIdAsync(id.ToString());
            return (employee, user);
        }

        private async Task<string> GenerateUserName(EmployeeRequest input)
        {
            string baseUserName = $"{input.FirstName}{input.MiddleName}{input.LastName}".Replace(" ", "");
            string userName = await GenerateUniqueUserName(baseUserName);
            return userName;
        }

        private async Task<string> GenerateUniqueUserName(string baseUserName, Guid? currentUserId = null)
        {
            string userName = baseUserName;
            string normalizedUserName = _userManagement.NormalizeName(userName);
            int prefix = 1;
            var existingUser = await _userManagement.FindByNameAsync(normalizedUserName);
            while (existingUser != null && existingUser.Id != currentUserId)
            {
                userName = $"{baseUserName}{prefix++}";
                normalizedUserName = _userManagement.NormalizeName(userName);
                existingUser = await _userManagement.FindByNameAsync(normalizedUserName);
            }
            return userName;
        }
        
    }
}

