using Gosei.EmployeeQualificationManagement.Employees;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;

namespace Gosei.EmployeeQualificationManagement.Seeding
{
    public class QualificationDataSeederContributor(IRepository<Qualification, Guid> qualificationRepository, IGuidGenerator guidGenerator) : ITransientDependency
    {
        private readonly IRepository<Qualification, Guid> _qualificationRepository = qualificationRepository;

        public async Task SeedAsync(DataSeedContext context)
        {
            if (await _qualificationRepository.CountAsync() > 0)
                return;
            var qualifications = new List<(string Name, string Code)>
            {
                ("Bachelors Degree", "BD"),
                ("Diploma", "D"),
                ("Qualification 3", "Q3"),
                ("Qualification 4", "Q4"),
                ("Qualification 5", "Q5"),
                ("Qualification 6", "Q6"),
                ("Qualification 7", "Q7"),
                ("Qualification 8", "Q8"),
                ("Qualification 9", "Q9"),
                ("Qualification 10", "Q10"),
                ("Qualification 11", "Q11"),
                ("Qualification 12", "Q12"),
                ("Qualification 13", "Q13"),
                ("Qualification 14", "Q14"),
                ("Qualification 15", "Q15"),
                ("Qualification 16", "Q16"),
                ("Qualification 17", "Q17"),
                ("Qualification 18", "Q18"),
                ("Qualification 19", "Q19"),
                ("Qualification 20", "Q20"),
            };
            List<Qualification> data = new();
            foreach (var item in qualifications)
            {
                data.Add(new Qualification(item.Name, item.Code)); 
            }
            await _qualificationRepository.InsertManyAsync(data, autoSave: true);
        }
    }
}
