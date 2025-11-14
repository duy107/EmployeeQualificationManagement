using Gosei.EmployeeQualificationManagement.Commons;
using Gosei.EmployeeQualificationManagement.Dtos.Filters;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;

namespace Gosei.EmployeeQualificationManagement.AppServices
{
    public abstract class BaseAppService<TEntity, TResponse, TKey, TGetListInput, TRequest>
        : CrudAppService<TEntity, TResponse, TKey, TGetListInput, TRequest>
        where TEntity : class, IEntity<TKey>
        where TGetListInput : FilterRequest
        where TResponse : IEntityDto<TKey>
    {
        public BaseAppService(IRepository<TEntity, TKey> repository) : base(repository) { }

        protected override async Task<IQueryable<TEntity>> CreateFilteredQueryAsync(TGetListInput input)
        {
            var query = await base.CreateFilteredQueryAsync(input);
            if(input.Filters.Count() > 0 && input.Filters.Any())
            {
                var expressionTree = ExpressionBuilder.ConstructAndExpressionTree<TEntity>(input.Filters);
                query = query.Where(expressionTree);
            }
            return query;
        }
    }
}
