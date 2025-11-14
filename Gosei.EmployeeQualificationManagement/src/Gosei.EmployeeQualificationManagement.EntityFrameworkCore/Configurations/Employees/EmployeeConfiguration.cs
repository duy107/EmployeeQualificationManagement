using Gosei.EmployeeQualificationManagement.Employees;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Gosei.EmployeeQualificationManagement.Configurations.Employees
{
    public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
    {
        public void Configure(EntityTypeBuilder<Employee> builder)
        {
            builder.ToTable(EmployeeQualificationManagementConsts.DbTablePrefix + "Employees");
            builder.ConfigureByConvention();
            builder.HasKey(x => x.Id);
            builder.Property(e => e.FirstName).IsRequired().HasMaxLength(250);
            builder.Property(e => e.MiddleName).HasMaxLength(250);
            builder.Property(e => e.LastName).IsRequired().HasMaxLength(250);
            builder.Property(e => e.Email).IsRequired().HasMaxLength(100);
            builder.Property(e => e.Gender).HasMaxLength(50);

            builder.HasOne(e => e.User)
                .WithOne()
                .HasForeignKey<Employee>(e => e.Id);
            builder.Ignore(e => e.User);

            builder.HasMany(e => e.EmployeeQualifications)
                .WithOne(eq => eq.Employee)
                .HasForeignKey(eq => eq.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);
           
        }
    }
}
