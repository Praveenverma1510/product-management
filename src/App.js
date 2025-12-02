import React, { useState, useEffect } from 'react';
import './App.css';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import SearchFilter from './components/SearchFilter.jsx';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from './services/productService';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      // console.log(data)
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      // console.log(data)
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      const newProduct = await createProduct(productData);
      // console.log(newProduct)
      setProducts([...products, newProduct]);
      setFilteredProducts([...products, newProduct]);
      return true;
    } catch (err) {
      setError('Failed to add product. Please try again.');
      console.error('Error adding product:', err);
      return false;
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      const updatedProduct = await updateProduct(id, productData);
      // console.log(updatedProduct)
      const updatedProducts = products.map(product =>
        product.id === id ? updatedProduct : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setEditingProduct(null);
      return true;
    } catch (err) {
      setError('Failed to update product. Please try again.');
      console.error('Error updating product:', err);
      return false;
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return false;
    }

    try {
      await deleteProduct(id);
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      return true;
    } catch (err) {
      setError('Failed to delete product. Please try again.');
      console.error('Error deleting product:', err);
      return false;
    }
  };

  const handleSearch = (searchTerm, category) => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }

    setFilteredProducts(filtered);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <img
            width="199"
            height="55"
            src="http://webimg.intricare.net/wp-content/uploads/2022/10/10123727/Intricare-Logo.png"
            className="header-logo"
            alt="IntriCare Logo"
          />
          <div className="header-content">
            <h1>Product Management Dashboard</h1>
            <p>All your products in one place.</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        <div className="dashboard-container">
          <div className="form-section">
            <ProductForm
              product={editingProduct}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onCancelEdit={handleCancelEdit}
              categories={categories}
            />
          </div>

          <div className="table-section">
            <SearchFilter
              onSearch={handleSearch}
              categories={['all', ...categories]}
            />

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found. Try a different search or add a new product.</p>
              </div>
            ) : (
              <ProductTable
                products={filteredProducts}
                onEdit={handleEditClick}
                onDelete={handleDeleteProduct}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Intricare Technologies. All Rights Reserved. </p>
      </footer>
    </div>
  );
}

export default App;