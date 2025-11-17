
using Gosei.EmployeeQualificationManagement.Employees;
using Microsoft.AspNetCore.Identity;
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
    public class EmployeeDataSeederContributor : ITransientDependency
    {
        private readonly IRepository<Employee, Guid> _employeeRepository;
        private readonly IRepository<Qualification, Guid> _qualificationRepository;
        private readonly IGuidGenerator _guidGenerator;
        private readonly IdentityUserManager _userManager;
        private const string Password = "1q2w3E*";

        public EmployeeDataSeederContributor(IRepository<Employee, Guid> employeeRepository, IGuidGenerator guidGenerator, IdentityUserManager userManager, IRepository<Qualification, Guid> qualificationRepository)
        {
            _employeeRepository = employeeRepository;
            _qualificationRepository = qualificationRepository;
            _guidGenerator = guidGenerator;
            _userManager = userManager;
        }

        public async Task SeedAsync(DataSeedContext context)
        {
            if (await _employeeRepository.CountAsync() > 0)
                return;
            var qMap = new Dictionary<string, Guid>();
            try
            {
                qMap.Add("BD", (await _qualificationRepository.GetAsync(q => q.Code == "BD")).Id);
                qMap.Add("D", (await _qualificationRepository.GetAsync(q => q.Code == "D")).Id);
                qMap.Add("Q3", (await _qualificationRepository.GetAsync(q => q.Code == "Q3")).Id);
                qMap.Add("Q4", (await _qualificationRepository.GetAsync(q => q.Code == "Q4")).Id);
            }
            catch(Exception ex)
            {
                throw new Exception("Error: Qualification not found");
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
                (await _userManager.CreateAsync(user, Password)).CheckErrors();
                // create role for user
                string roleName = (i <= 10) ? "admin" : ((i <= 20) ? "employee_manager" : "employee");
                (await _userManager.AddToRoleAsync(user, roleName)).CheckErrors();

                Employee employee = new Employee(user.Id, firstName, middleName, lastName, gender, birthDate, email, note);
                if (i == 1) employee.AddQualification(CreateQualLink(qMap["BD"], "Test Institution 1", "Hanoi"));
                else if (i == 2) employee.AddQualification(CreateQualLink(qMap["D"], "Test Institution 2", "Hanoi"));
                else if (i == 3) employee.AddQualification(CreateQualLink(qMap["Q3"], "Test Institution 3", "Hanoi"));
                else if (i == 4) employee.AddQualification(CreateQualLink(qMap["Q4"], "Test Institution 4", "Hanoi"));
                else if (i == 5) employee.AddQualification(CreateQualLink(qMap["BD"], "Test Institution 5", "HCM City"));
                else if (i == 6) employee.AddQualification(CreateQualLink(qMap["D"], "Test Institution 6", "HCM City"));
                else if (i == 7) employee.AddQualification(CreateQualLink(qMap["Q3"], "Test Institution 7", "HCM City"));
                else if (i == 8) employee.AddQualification(CreateQualLink(qMap["Q4"], "Test Institution 8", "HCM City"));
                else if (i == 9) employee.AddQualification(CreateQualLink(qMap["BD"], "Test Institution 9", "HCM City"));
                else if (i == 10) employee.AddQualification(CreateQualLink(qMap["D"], "Test Institution 10", "HCM City"));
                employees.Add(employee);
            }
            await _employeeRepository.InsertManyAsync(employees, autoSave: true);
        }

        private EmployeeQualification CreateQualLink(Guid qualId, string institution, string city)
        {
            return new EmployeeQualification(_guidGenerator.Create())
            {
                QualificationId = qualId,
                Institution = institution,
                City = city,
                ValidFrom = new DateTime(2012, 6, 30),
                ValidTo = new DateTime(2020, 6, 30),
                Note = "Test Note"
            };
        }
    }
}
