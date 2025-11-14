using Gosei.EmployeeQualificationManagement.Enums.Filter;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;

namespace Gosei.EmployeeQualificationManagement.Commons
{
    public class ExpressionBuilder
    {
        public static Expression<Func<T, bool>> ConstructAndExpressionTree<T>(List<ExpressionFilter> filters)
        {
            if (filters.Count == 0)
                return null;

            ParameterExpression param = Expression.Parameter(typeof(T), "t");

            Expression exp = GetExpression<T>(filters[0], param);
            for (int i = 1; i < filters.Count; i++)
            {
                exp = Expression.Or(exp, GetExpression<T>(filters[i], param));
            }

            return Expression.Lambda<Func<T, bool>>(exp, param);
        }
        public static Expression GetExpression<T>(ExpressionFilter filter, ParameterExpression param)
        {
            MethodInfo containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
            MethodInfo startsWithMethod = typeof(string).GetMethod("StartsWith", new[] { typeof(string) });
            MethodInfo endsWithMethod = typeof(string).GetMethod("EndsWith", new[] { typeof(string) });

            MemberExpression member = Expression.Property(param, filter.PropertyName); // => t.Name 
            ConstantExpression constant = Expression.Constant(filter.Value);

            switch (filter.Comparison)
            {
                case ComparisonEnum.Equal:
                    return Expression.Equal(member, constant);
                case ComparisonEnum.GreaterThan:
                    return Expression.GreaterThan(member, constant);
                case ComparisonEnum.GreaterThanOrEqual:
                    return Expression.GreaterThanOrEqual(member, constant);
                case ComparisonEnum.LessThan:
                    return Expression.LessThan(member, constant);
                case ComparisonEnum.LessThanOrEqual:
                    return Expression.LessThanOrEqual(member, constant);
                case ComparisonEnum.NotEqual:
                    return Expression.NotEqual(member, constant);
                case ComparisonEnum.Contains:
                    return Expression.Call(member, containsMethod, constant);
                case ComparisonEnum.StartsWith:
                    return Expression.Call(member, startsWithMethod, constant);
                case ComparisonEnum.EndsWith:
                    return Expression.Call(member, endsWithMethod, constant);
                default:
                    return null;

            }
        }
    }
}
