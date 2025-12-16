using Gosei.EmployeeQualificationManagement.Constants.Roles;
using Gosei.EmployeeQualificationManagement.Dtos.Employees.Employee;
using Gosei.EmployeeQualificationManagement.Employees;
using Gosei.EmployeeQualificationManagement.IRepositories;
using Gosei.EmployeeQualificationManagement.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Caching;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;

namespace Gosei.EmployeeQualificationManagement.AppServices
{
    public class EmployeeAppService : CrudAppService<Employee, EmployeeResponse, Guid, EmployeeSearchRequest, EmployeeRequest>
    {
        private readonly IEntityCache<EmployeeResponse, Guid> _employeeCache;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IdentityUserManager _userManagement;
        private readonly IGuidGenerator _guidGenerator;
        private readonly IConfiguration _configuration;
        private readonly IRepository<IdentityUser, Guid> _userRepository;

        public EmployeeAppService(IEmployeeRepository employeeRepository,
            IdentityUserManager userManager,
            IGuidGenerator guidGenerator,
            IEntityCache<EmployeeResponse, Guid> employeeCache,
            IRepository<IdentityUser, Guid> userRepository,
            IConfiguration configuration) : base(employeeRepository)
        {
            _employeeRepository = employeeRepository;
            _userManagement = userManager;
            _guidGenerator = guidGenerator;
            _employeeCache = employeeCache;
            _configuration = configuration;
            _userRepository = userRepository;
            GetListPolicyName = PermissionConstant.Employees.Default;
        }

        protected override async Task<IQueryable<Employee>> CreateFilteredQueryAsync(EmployeeSearchRequest input)
        {
            var query = await Repository.GetQueryableAsync();
            if (!string.IsNullOrWhiteSpace(input.SearchKey))
            {
                query = query.Where(e =>
                    e.FirstName.Contains(input.SearchKey) ||
                    e.LastName.Contains(input.SearchKey));
            }
            return query;
        }

        [Authorize(PermissionConstant.Employees.Default)]
        public override async Task<EmployeeResponse> GetAsync(Guid id)
        {
            return await _employeeCache.GetAsync(id);
        }

        [Authorize(PermissionConstant.Employees.Create)]
        public override async Task<EmployeeResponse> CreateAsync(EmployeeRequest input)
        {
            return await ExecuteWithRetryAsync(async () =>
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
            });
        }

        [Authorize(PermissionConstant.Employees.Update)]
        public override async Task<EmployeeResponse> UpdateAsync(Guid id, EmployeeRequest input)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                (Employee employee, IdentityUser? user) = await FindEmployeeAndUserAsync(id);

                if (user == null)
                    throw new EntityNotFoundException($"User with id={id} not found");

                string userName = await GenerateUserName(input, id);

                if (user.UserName != userName)
                {
                    string newEmail = $"{userName}@gosei.com.vn";
                    (await _userManagement.SetUserNameAsync(user, userName)).CheckErrors();
                    (await _userManagement.SetEmailAsync(user, newEmail)).CheckErrors();
                    employee.Email = newEmail;
                }

                employee.ConcurrencyStamp = input.ConcurrencyStamp;

                ObjectMapper.Map(input, employee);

                (await _userManagement.UpdateAsync(user)).CheckErrors();

                await _employeeRepository.UpdateAsync(employee);

                return ObjectMapper.Map<Employee, EmployeeResponse>(employee);
            });
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

        private async Task<string> GenerateUserName(EmployeeRequest input, Guid? currentUserId = null)
        {
            string baseUserName = $"{input.FirstName}{input.MiddleName}{input.LastName}".Replace(" ", "");
            string userName = await GenerateUniqueUserName(baseUserName, currentUserId);
            return userName;
        }

        private async Task<string> GenerateUniqueUserName(string baseUserName, Guid? currentUserId = null)
        {
            string userName = baseUserName;
            string normalizedUserName = _userManagement.NormalizeName(userName);

            var queryable = await _userRepository.GetQueryableAsync();

            var userNames = queryable
                .Where(u => u.UserName.StartsWith(normalizedUserName))
                .ToList();

            int prefix = 1;

            var existingUser = userNames.FirstOrDefault(u => u.NormalizedUserName == normalizedUserName);

            while (existingUser != null && existingUser.Id != currentUserId)
            {
                userName = $"{baseUserName}{prefix++}";
                normalizedUserName = _userManagement.NormalizeName(userName);
                existingUser = userNames.FirstOrDefault(u => u.NormalizedUserName == normalizedUserName);
            }

            return userName;
        }

        private async Task<TResult> ExecuteWithRetryAsync<TResult>(Func<Task<TResult>> func, int maxRetries = 3)
        {
            int count = 0;
            try
            {
                return await func();
            }
            catch (AbpDbConcurrencyException ex)
            {
                count++;    
                if (count >= maxRetries)
                {
                    throw new UserFriendlyException(ex.Message);
                }
            }
            throw new UserFriendlyException($"Execution failed after {maxRetries} retries.");
        }
    }
}

