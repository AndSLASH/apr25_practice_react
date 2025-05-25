import cn from 'classnames';

export const FiltersPanel = ({
  users,
  selectedUserId,
  onUserSelect,
  categories,
  selectedCategoryIds,
  onToggleCategory,
  onClearCategories,
  query,
  onQueryChange,
  onResetAll,
}) => {
  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <div className="panel-tabs has-text-weight-bold">
        <a
          href="#/"
          data-cy="FilterAllUsers"
          className={cn({ 'is-active': selectedUserId === null })}
          onClick={event => {
            event.preventDefault();
            onUserSelect(null);
          }}
        >
          All
        </a>
        {users.map(user => (
          <a
            key={user.id}
            href="#/"
            data-cy="FilterUser"
            className={cn({ 'is-active': selectedUserId === user.id })}
            onClick={event => {
              event.preventDefault();
              onUserSelect(user.id);
            }}
          >
            {user.name}
          </a>
        ))}
      </div>

      <div className="panel-block">
        <p
          className="control has-icons-left has-icons-right"
          style={{ width: '100%' }}
        >
          <input
            data-cy="SearchField"
            type="text"
            className="input"
            placeholder="Search by product name"
            value={query}
            onChange={event => onQueryChange(event.target.value.trimStart())}
          />
          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>
          {query && (
            <span className="icon is-right" style={{ cursor: 'pointer' }}>
              <button
                data-cy="ClearButton"
                type="button"
                className="delete"
                onClick={() => onQueryChange('')}
                aria-label="Clear search"
              />
            </span>
          )}
        </p>
      </div>

      <div className="panel-block is-flex-wrap-wrap">
        <button
          type="button"
          data-cy="AllCategories"
          className={cn('button', 'is-success', 'mr-6', {
            'is-success': selectedCategoryIds.length === 0,
            'is-outlined': selectedCategoryIds.length > 0,
          })}
          onClick={onClearCategories}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            type="button"
            key={cat.id}
            data-cy="Category"
            className={cn('button', 'mr-2', 'my-1', {
              'is-info': selectedCategoryIds.includes(cat.id),
            })}
            onClick={() => onToggleCategory(cat.id)}
          >
            {cat.title}
          </button>
        ))}
      </div>

      <div className="panel-block">
        <button
          type="button"
          data-cy="ResetAllButton"
          className={cn('button', 'is-link', 'is-fullwidth', {
            'is-outlined':
              selectedUserId ||
              selectedCategoryIds.length > 0 ||
              query.trim() !== '',
          })}
          onClick={onResetAll}
        >
          Reset all filters
        </button>
      </div>
    </nav>
  );
};
