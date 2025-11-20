using Gosei.EmployeeQualificationManagement.Dtos.Roles.Permission;
using System.Collections.Generic;

namespace Gosei.EmployeeQualificationManagement.Dtos.Roles.Role
{
    public class BulkRoleUpdateRequest
    {
        public List<RoleUpdateRequest> Roles { get; set; }
    }
    public class RoleUpdateRequest
    {
        public string Name { get; set; }
        public List<PermissionUpdateRequest> Permissions { get; set; } = new();
    }
}
