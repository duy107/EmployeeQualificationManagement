using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Gosei.EmployeeQualificationManagement.Dtos.Roles.Role
{
    public class RoleResponse : EntityDto<Guid>
    {
        public string Name { get; set; }
        public bool IsPublic { get; set; }
        public bool IsStatic { get; set; }
        public List<string> GrantedPermissions { get; set; } = new();
    }

}
