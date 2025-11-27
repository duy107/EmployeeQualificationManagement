using Gosei.EmployeeQualificationManagement.Dtos.Roles.Role;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Gosei.EmployeeQualificationManagement.AppServices
{
    [Authorize(Roles = "admin")]
    public class RoleAppService : ApplicationService
    {
        private readonly IIdentityRoleRepository _roleRepository;
        private readonly IPermissionGrantRepository _permissionGrantRepository;

        public RoleAppService(IIdentityRoleRepository roleRepository, IPermissionGrantRepository permissionGrantRepository)
        {
            _roleRepository = roleRepository;
            _permissionGrantRepository = permissionGrantRepository;
        }
        public async Task<List<RoleResponse>> GetWithPermissionsAsync()
        {
            var roles = await _roleRepository.GetListAsync();
            var targetRoles = roles.Where(role => role.Name != "admin").ToList();
            
            if (!targetRoles.Any())
                return new();
            
            var rolesName = targetRoles.Select(role => role.Name).ToList();
            var grants = await _permissionGrantRepository.GetListAsync();
            var result = targetRoles.Select(r => new RoleResponse
            {
                Id = r.Id,
                Name = r.Name,
                IsPublic = r.IsPublic,
                IsStatic = r.IsStatic,
                GrantedPermissions = grants.Where(grant => grant.ProviderKey == r.Name)
                                           .Select(grant => grant.Name).ToList()
            }).ToList();

            return result;
        }
    }
}
