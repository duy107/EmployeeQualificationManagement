using Gosei.EmployeeQualificationManagement.EntityFrameworkCore;
using Gosei.EmployeeQualificationManagement.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Gosei.EmployeeQualificationManagement.Repositories
{
    public class BaseRepository<TEntity, TKey> : EfCoreRepository<EmployeeQualificationManagementDbContext, TEntity, TKey>, IBaseRepository<TEntity, TKey>
        where TEntity : class, IEntity<TKey>
    {
        public BaseRepository(IDbContextProvider<EmployeeQualificationManagementDbContext> contextProvider) : base(contextProvider) { }
        public async Task<TEntity?> GetByIdAsync(TKey id, CancellationToken cancellationToken, params Expression<Func<TEntity, object>>[] includeExpressions)
        {
            var query = await GetQueryableAsync();
            if(includeExpressions.Count() > 0 && includeExpressions.Any())
                query = includeExpressions.Aggregate(query, (current, item) => current.Include(item));
            return await query.FirstOrDefaultAsync(item => item.Id.Equals(id), cancellationToken);
        }

        public IQueryable<TEntity> WithDetails(IQueryable<TEntity> query, List<Expression<Func<TEntity, object>>> includeExpressions)
        {
            if (includeExpressions.Count() > 0 && includeExpressions.Any())
                query = includeExpressions.Aggregate(query, (current, item) => current.Include(item));
            return query;
        }
    }
}
