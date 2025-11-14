using Gosei.EmployeeQualificationManagement.Employees;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Gosei.EmployeeQualificationManagement.Configurations.Employees
{
    public class EmployeeQualificationConfiguration : IEntityTypeConfiguration<EmployeeQualification>
    {
        public void Configure(EntityTypeBuilder<EmployeeQualification> builder)
        {
            builder.ToTable(EmployeeQualificationManagementConsts.DbTablePrefix + "EmployeeQualifications");
            builder.ConfigureByConvention();
            builder.HasKey(eq => eq.Id);
            builder.Property(eq => eq.Institution).IsRequired().HasMaxLength(250);
            builder.Property(eq => eq.City).HasMaxLength(250);
        }
    }
}
