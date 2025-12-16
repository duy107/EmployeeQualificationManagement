using Gosei.EmployeeQualificationManagement.Constants.Cache;
using Gosei.EmployeeQualificationManagement.Constants.Roles;
using Gosei.EmployeeQualificationManagement.Dtos.Roles.Role;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Caching;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Gosei.EmployeeQualificationManagement.AppServices
{
    public class RoleAppService: ApplicationService
    {

        private readonly IIdentityRoleRepository _roleRepository;
        private readonly IPermissionGrantRepository _permissionGrantRepository;
        private readonly IDistributedCache<List<RoleResponse>, string> _rolesCache;

        public RoleAppService(IIdentityRoleRepository roleRepository, IPermissionGrantRepository permissionGrantRepository, IDistributedCache<List<RoleResponse>, string> rolesCache)
        {
            _permissionGrantRepository = permissionGrantRepository;
            _roleRepository = roleRepository;
            _rolesCache = rolesCache;
        }

        [Authorize]
        public async Task<List<RoleResponse>> GetWithPermissionsAsync()
        {
            var res = await _rolesCache.GetOrAddAsync(
                CacheKey.Roles.AllWithMappedPermissions,
                async () => await GetWithPermissionsFromDbAsync(),
                () => new DistributedCacheEntryOptions
                {
                    AbsoluteExpiration = DateTimeOffset.Now.AddHours(1)
                }
            );

            return res ?? new();
        }

        private async Task<List<RoleResponse>> GetWithPermissionsFromDbAsync()
        {
            var roles = await _roleRepository.GetListAsync();
            var targetRoles = roles.Where(role => role.Name != RoleConstant.Admin).ToList();

            if (!targetRoles.Any())
            {
                return new();
            }

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
