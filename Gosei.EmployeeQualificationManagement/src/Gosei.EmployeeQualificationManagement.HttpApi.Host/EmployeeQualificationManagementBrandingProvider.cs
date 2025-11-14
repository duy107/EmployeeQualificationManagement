using Microsoft.Extensions.Localization;
using Gosei.EmployeeQualificationManagement.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace Gosei.EmployeeQualificationManagement;

[Dependency(ReplaceServices = true)]
public class EmployeeQualificationManagementBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<EmployeeQualificationManagementResource> _localizer;

    public EmployeeQualificationManagementBrandingProvider(IStringLocalizer<EmployeeQualificationManagementResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
