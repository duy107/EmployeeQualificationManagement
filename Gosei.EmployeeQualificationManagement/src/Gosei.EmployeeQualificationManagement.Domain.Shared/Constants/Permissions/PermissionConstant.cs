namespace Gosei.EmployeeQualificationManagement.Permissions
{
    public static class PermissionConstant
    {
        public const string GroupName = "EmployeeQualificationManagement";

        public static class Employees
        {
            public const string Default = GroupName + ".Employees";
            public const string Create = Default + ".Create";
            public const string Update = Default + ".Update";
            public const string Delete = Default + ".Delete";
        }

        public static class EmployeeQualifications
        {
            public const string Default = GroupName + ".EmployeeQualifications";
            public const string Create = Default + ".Create";
            public const string Update = Default + ".Update";
            public const string Delete = Default + ".Delete";
        }
    }
}
