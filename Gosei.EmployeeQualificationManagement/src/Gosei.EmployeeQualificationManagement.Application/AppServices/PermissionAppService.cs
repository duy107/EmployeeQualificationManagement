using Gosei.EmployeeQualificationManagement.Dtos.Roles.Permission;
using Gosei.EmployeeQualificationManagement.Dtos.Roles.Role;
using Gosei.EmployeeQualificationManagement.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Localization;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.PermissionManagement;

namespace Gosei.EmployeeQualificationManagement.AppServices
{
    [Authorize(Roles = "admin")]
    public class PermissionAppService : ApplicationService
    {
        private readonly IPermissionDefinitionManager _permissionDefinitionManager;
        private readonly IStringLocalizerFactory _stringLocalizerFactory;
        private readonly IPermissionManager _permissionManager;
        public PermissionAppService(IPermissionDefinitionManager permissionDefinitionManager, IStringLocalizerFactory stringLocalizerFactory, IPermissionManager permissionManager)
        {
            _permissionDefinitionManager = permissionDefinitionManager;
            _stringLocalizerFactory = stringLocalizerFactory;
            _permissionManager = permissionManager;
        }

        public async Task<PermissionGroupResponse> GetByGroupAsync()
        {
            var allGroups = await _permissionDefinitionManager.GetGroupsAsync();
            var group = allGroups.FirstOrDefault(g => g.Name == PermissionConstant.GroupName);
            
            PermissionGroupResponse groupResponse = new PermissionGroupResponse
            {
                Name = group.Name,
                DisplayName = GetLocalizedString(group.DisplayName)
            };
            
            groupResponse.Permissions = group.Permissions.Select(MapPermissionToResponse).ToList();
            return groupResponse;
        }
        public async Task UpdateAsync(BulkRoleUpdateRequest request)
        {
            foreach (RoleUpdateRequest role in request.Roles)
            {
                foreach(PermissionUpdateRequest permission in role.Permissions)
                {
                    await _permissionManager.SetForRoleAsync(
                        role.Name,
                        permission.Name,
                        permission.IsGranted
                    );
                }
            }
        }
        private PermissionDefinitionResponse MapPermissionToResponse(PermissionDefinition permission)
        {
            var permissionDefinitionResponse = new PermissionDefinitionResponse
            {
                Name = permission.Name,
                DisplayName = GetLocalizedString(permission.DisplayName),
                Children = permission.Children.Select(MapPermissionToResponse).ToList()
            };
            return permissionDefinitionResponse;
        }
        private string GetLocalizedString(ILocalizableString localizable)
        {
            if (localizable == null)
                return string.Empty;

            var localized = localizable.Localize(_stringLocalizerFactory);
            return localized.Value; 
        }
    }
}
