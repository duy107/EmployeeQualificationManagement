using Gosei.EmployeeQualificationManagement.Constants.Roles;
using Gosei.EmployeeQualificationManagement.Employees;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;

namespace Gosei.EmployeeQualificationManagement.Seeding
{
    public class EmployeeDataSeederContributor
        (IRepository<Employee, Guid> employeeRepository,
        IGuidGenerator guidGenerator,
        IdentityUserManager userManager,
        IRepository<Qualification, Guid> qualificationRepository,
        IConfiguration configuration) : ITransientDependency
    {
        private readonly IRepository<Employee, Guid> _employeeRepository = employeeRepository;
        private readonly IRepository<Qualification, Guid> _qualificationRepository = qualificationRepository;
        private readonly IGuidGenerator _guidGenerator = guidGenerator;
        private readonly IdentityUserManager _userManager = userManager;
        private readonly IConfiguration _configuration = configuration;

        public async Task SeedAsync(DataSeedContext context)
        {
            var defaultPassword = _configuration["Seeding:DefaultPassword"]; 
            
            if (await _employeeRepository.CountAsync() > 0)
                return;
            var qMap = new Dictionary<string, Qualification>();
           
            try
            {
                qMap.Add("BD", (await _qualificationRepository.GetAsync(q => q.Code == "BD")));
                qMap.Add("D", (await _qualificationRepository.GetAsync(q => q.Code == "D")));
                qMap.Add("Q3", (await _qualificationRepository.GetAsync(q => q.Code == "Q3")));
                qMap.Add("Q4", (await _qualificationRepository.GetAsync(q => q.Code == "Q4")));
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }

            List<Employee> employees = new();
           
            for(int i = 1; i <= 200; i++)
            {
                string firstName = $"First Name {i}";
                string middleName = $"MI{i}";
                string lastName = $"Last Name {i}";
                string userName = $"{firstName}{middleName}{lastName}".Replace(" ", "");
                string email = $"email{i}@gosei.com.vn";
                string gender = "Male";
                DateTime birthDate = new DateTime(1900, 1, 1);
                string note = $"Test Note {i}";
                
                IdentityUser user = new IdentityUser
                (
                    _guidGenerator.Create(),
                    userName,
                    email,
                    context.TenantId
                );

                // create password for user
                (await _userManager.CreateAsync(user, defaultPassword ?? "1q2w3E*")).CheckErrors();
                
                // create role for user
                string roleName = (i <= 10) ? RoleConstant.Admin : RoleConstant.Employee;
                
                (await _userManager.AddToRoleAsync(user, roleName)).CheckErrors();

                Employee employee = new Employee(user.Id, firstName, middleName, lastName, gender, birthDate, email, note);
                
                if (i == 1) employee.AddQualification(qMap["BD"], "Test Institution 1", new DateTime(2025, 10, 10), new DateTime(2026, 10, 10), null, null);
                else if (i == 2) employee.AddQualification(qMap["D"], "Test Institution 1", new DateTime(2025, 10, 10), new DateTime(2026, 10, 10), null, null);
                else if (i == 3) employee.AddQualification(qMap["Q3"], "Test Institution 1", new DateTime(2025, 10, 10), new DateTime(2026, 10, 10), null, null);
                else if (i == 4) employee.AddQualification(qMap["Q4"], "Test Institution 1", new DateTime(2025, 10, 10), new DateTime(2026, 10, 10), null, null);
                else if (i == 5) employee.AddQualification(qMap["BD"], "Test Institution 1", new DateTime(2025, 10, 10), new DateTime(2026, 10, 10), null, null);
                else if (i == 6) employee.AddQualification(qMap["D"], "Test Institution 1", new DateTime(2025, 10, 10), new DateTime(2026, 10, 10), null, null);
                else if (i == 7) employee.AddQualification(qMap["D"], "Test Institution 1", new DateTime(2025, 10, 10), new DateTime(2026, 10, 10), null, null);
                else if (i == 8) employee.AddQualification(qMap["D"], "Test Institution 1", new DateTime(2025, 10, 10), new DateTime(2026, 10, 10), null, null);
                else if (i == 9) employee.AddQualification(qMap["Q3"], "Test Institution 1", new DateTime(2025, 10, 10), new DateTime(2026, 10, 10), null, null);
                else if (i == 10) employee.AddQualification(qMap["Q4"], "Test Institution 1", new DateTime(2025, 10, 10), new DateTime(2026, 10, 10), null, null);
                
                await _employeeRepository.InsertAsync(employee, autoSave: true);
                employees.Add(employee);
            }
        }
    }
}
