using System.Collections.Generic;

namespace Gosei.EmployeeQualificationManagement.Dtos.Roles.Permission
{
    public class PermissionGroupResponse
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public List<PermissionDefinitionResponse> Permissions { get; set; } = new();
    }
}
