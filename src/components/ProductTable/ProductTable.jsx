import cn from 'classnames';

const TABLE_TITLES = ['ID', 'Product', 'Category', 'User'];

export const ProductTable = ({
  products,
  sortBy,
  sortDirection,
  onSortClick,
}) => {
  return (
    <div className="box table-container">
      {products.length === 0 ? (
        <p data-cy="NoMatchingMessage">
          No products matching selected criteria
        </p>
      ) : (
        <table
          data-cy="ProductTable"
          className="table is-striped is-narrow is-fullwidth"
        >
          <thead>
            <tr>
              {TABLE_TITLES.map(title => (
                <th key={title}>
                  <span className="is-flex is-flex-wrap-nowrap">
                    {title}
                    <a
                      href="#/"
                      onClick={event => {
                        event.preventDefault();
                        onSortClick(title);
                      }}
                    >
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={
                            sortBy === title
                              ? `fas ${sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'}`
                              : 'fas fa-sort'
                          }
                        />
                      </span>
                    </a>
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {products.map(product => (
              <tr data-cy="Product" key={product.id}>
                <td className="has-text-weight-bold" data-cy="ProductId">
                  {product.id}
                </td>
                <td data-cy="ProductName">{product.name}</td>
                <td data-cy="ProductCategory">
                  {product.category?.icon} - {product.category?.title}
                </td>
                <td
                  data-cy="ProductUser"
                  className={cn({
                    'has-text-link': product.user.sex === 'm',
                    'has-text-danger': product.user.sex === 'f',
                  })}
                >
                  {product.user?.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
