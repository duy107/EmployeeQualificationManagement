using Gosei.EmployeeQualificationManagement.Employees;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Gosei.EmployeeQualificationManagement.Configurations.Employees
{
    public class QualificationConfiguration : IEntityTypeConfiguration<Qualification>
    {
        public void Configure(EntityTypeBuilder<Qualification> builder)
        {
            builder.ToTable(EmployeeQualificationManagementConsts.DbTablePrefix + "Qualifications");
            builder.ConfigureByConvention();
            builder.HasKey(q => q.Id);
            builder.Property(q => q.Name).HasMaxLength(250);
            builder.Property(q => q.Code).HasMaxLength(100);
            builder.HasIndex(q => q.Code).IsUnique();

            builder.HasMany(q => q.EmployeeQualifications)
                .WithOne(eq => eq.Qualification)
                .HasForeignKey(eq => eq.QualificationId);
        }
    }
}
