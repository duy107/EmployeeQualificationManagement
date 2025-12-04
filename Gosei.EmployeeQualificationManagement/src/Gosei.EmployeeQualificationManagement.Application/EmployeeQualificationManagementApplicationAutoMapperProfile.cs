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
        CreateMap<EmployeeQualificationRequest, EmployeeQualification>();

        // employee
        CreateMap<Employee, EmployeeResponse>();
        CreateMap<EmployeeRequest, Employee>();
    }
}
