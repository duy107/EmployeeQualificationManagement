using AutoMapper;
using Gosei.EmployeeQualificationManagement.Dtos.Employees.Employee;
using Gosei.EmployeeQualificationManagement.Dtos.Employees.EmployeeQualification;
using Gosei.EmployeeQualificationManagement.Dtos.Employees.Qualification;
using Gosei.EmployeeQualificationManagement.Employees;

namespace Gosei.EmployeeQualificationManagement;

public class EmployeeQualificationManagementApplicationAutoMapperProfile : Profile
{
    public EmployeeQualificationManagementApplicationAutoMapperProfile()
    {

        // qualification
        CreateMap<Qualification, QualificationResponse>();

        // employeeQualification
        CreateMap<EmployeeQualification, EmployeeQualificationResponse>()
            .ForMember(dest => dest.QualificationName,
                        otp => otp.MapFrom(src => src.Qualification.Name));
            //.ForMember(dest => dest.ValidFrom,
            //        opt => opt.MapFrom(src => src.ValidFrom.HasValue
            //            ? src.ValidFrom.Value.ToString("dd/MM/yyyy")
            //            : "-"))
            //.ForMember(dest => dest.ValidTo,
            //        opt => opt.MapFrom(src => src.ValidTo.HasValue
            //            ? src.ValidTo.Value.ToString("dd/MM/yyyy")
            //            : "-"));
        CreateMap<EmployeeQualificationRequest, EmployeeQualification>();

        // employee
        CreateMap<Employee, EmployeeResponse>();
             //.ForMember(dest => dest.BirthDate,
             //        opt => opt.MapFrom(src => src.BirthDate.ToString("dd/MM/yyyy")));
        CreateMap<EmployeeRequest, Employee>();
    }
}
