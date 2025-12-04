using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Entities;


namespace Gosei.EmployeeQualificationManagement.IRepositories
{
    public interface IBaseRepository <TEntity, TKey> : IRepository<TEntity, TKey>
        where TEntity : class, IEntity<TKey>
    {
        Task<TEntity?> GetByIdAsync(TKey id, CancellationToken cancellationToken, params Expression<Func<TEntity, object>>[] includeExpressions);
    }
}
