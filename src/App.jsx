/* eslint-disable jsx-a11y/accessible-emoji */
import './App.scss';
import 'bulma/css/bulma.css';
import { useState } from 'react';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { ProductTable } from './components/ProductTable';
import { FiltersPanel } from './components/FiltersPanel';

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
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

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
      return (
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.title.toLowerCase().includes(query.toLowerCase()) ||
        product.user.name.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  const sortProducts = items => {
    if (!sortBy) {
      return items;
    }

    return [...items].sort((a, b) => {
      let comp = 0;

      if (sortBy === 'ID') {
        comp = a.id - b.id;
      } else if (sortBy === 'Product') {
        comp = a.name.localeCompare(b.name);
      } else if (sortBy === 'Category') {
        comp = a.category.title.localeCompare(b.category.title);
      } else if (sortBy === 'User') {
        comp = a.user.name.localeCompare(b.user.name);
      }

      return sortDirection === 'asc' ? comp : -comp;
    });
  };

  const onSortClick = title => {
    if (sortBy !== title) {
      setSortBy(title);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortBy('');
      setSortDirection('');
    } else {
      setSortDirection('asc');
    }
  };

  const sortedProducts = sortProducts(filteredProducts);

  const resetFilters = () => {
    setSelectedUserId(null);
    setSelectedCategoryIds([]);
    setQuery('');
    setSortDirection('asc');
    setSortBy('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <FiltersPanel
            users={usersFromServer}
            selectedUserId={selectedUserId}
            onUserSelect={setSelectedUserId}
            categories={categoriesFromServer}
            selectedCategoryIds={selectedCategoryIds}
            onToggleCategory={toggleCategory}
            onClearCategories={clearCategories}
            query={query}
            onQueryChange={setQuery}
            onResetAll={resetFilters}
          />
        </div>
        <ProductTable
          products={sortedProducts}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortClick={onSortClick}
        />
      </div>
    </div>
  );
};
