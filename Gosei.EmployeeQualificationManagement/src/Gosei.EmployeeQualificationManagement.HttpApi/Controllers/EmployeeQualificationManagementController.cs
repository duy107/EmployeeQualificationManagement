using Gosei.EmployeeQualificationManagement.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace Gosei.EmployeeQualificationManagement.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class EmployeeQualificationManagementController : AbpControllerBase
{
    protected EmployeeQualificationManagementController()
    {
        LocalizationResource = typeof(EmployeeQualificationManagementResource);
    }
}
