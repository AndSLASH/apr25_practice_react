/* eslint-disable jsx-a11y/accessible-emoji */
import './App.scss';
import 'bulma/css/bulma.css';
import cn from 'classnames';
import { useState } from 'react';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    cat => cat.id === product.categoryId,
  );
  const user = category
    ? usersFromServer.find(u => u.id === category.ownerId)
    : null;

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [query, setQuery] = useState('');

  const toggleCategory = categoryId => {
    setSelectedCategoryIds(prev => {
      return prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
    });
  };

  const clearCategories = () => setSelectedCategoryIds([]);

  let filteredProducts = selectedUserId
    ? products.filter(prod => prod.user && prod.user.id === selectedUserId)
    : products;

  if (selectedCategoryIds.length > 0) {
    filteredProducts = filteredProducts.filter(
      product =>
        product.category && selectedCategoryIds.includes(product.category.id),
    );
  }

  if (query.trim() !== '') {
    filteredProducts = filteredProducts.filter(product => {
      return product.name.toLowerCase().includes(query.toLowerCase());
    });
  }

  const resetFilters = () => {
    setSelectedUserId(null);
    setSelectedCategoryIds([]);
    setQuery('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                href="#/"
                data-cy="FilterAllUsers"
                className={cn({ 'is-active': selectedUserId === null })}
                onClick={event => {
                  event.preventDefault();
                  setSelectedUserId(null);
                }}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  data-cy="FilterUser"
                  className={cn({ 'is-active': selectedUserId === user.id })}
                  onClick={event => {
                    event.preventDefault();
                    setSelectedUserId(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

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
                  onChange={event => setQuery(event.target.value)}
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
                      onClick={() => setQuery('')}
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
                className={cn('button', 'mr-3', 'my-1', 'is-outlined', {
                  'is-success': selectedCategoryIds.length === 0,
                })}
                onClick={clearCategories}
              >
                All Categories
              </button>
              {categoriesFromServer.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  data-cy="Category"
                  className={cn('button', 'mr-2', 'my-1', {
                    'is-info': selectedCategoryIds.includes(cat.id),
                    'is-outlined': !selectedCategoryIds.includes(cat.id),
                  })}
                  onClick={() => toggleCategory(cat.id)}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            <div className="panel-block">
              <button
                type="button"
                data-cy="ResetAllButton"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </button>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
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
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
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
                        'has-text-link': product.user?.gender === 'm',
                        'has-text-danger': product.user?.gender === 'f',
                      })}
                    >
                      {product.user?.name || 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
