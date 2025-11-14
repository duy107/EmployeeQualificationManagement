using Gosei.EmployeeQualificationManagement.Localization;
using Volo.Abp.Application.Services;

namespace Gosei.EmployeeQualificationManagement;

/* Inherit your application services from this class.
 */
public abstract class EmployeeQualificationManagementAppService : ApplicationService
{
    protected EmployeeQualificationManagementAppService()
    {
        LocalizationResource = typeof(EmployeeQualificationManagementResource);
    }
}
