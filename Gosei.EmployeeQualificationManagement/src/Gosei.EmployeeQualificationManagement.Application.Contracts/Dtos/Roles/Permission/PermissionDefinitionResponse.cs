using System.Collections.Generic;

namespace Gosei.EmployeeQualificationManagement.Dtos.Roles.Permission
{
    public class PermissionDefinitionResponse
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public List<PermissionDefinitionResponse> Children { get; set; } = new();
    }
}
