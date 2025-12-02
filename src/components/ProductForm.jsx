import { useState, useEffect } from 'react';


const ProductForm = ({ product, onAddProduct, onUpdateProduct, onCancelEdit, categories }) => {
  const initialFormState = {
    title: '',
    price: '',
    description: '',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setSuccessMessage('');
  };

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        price: product.price?.toString() || '',
        description: product.description || '',
        category: product.category || 'electronics',
        image: product.image || 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
      });
      setIsEditing(true);
    } else {
      resetForm();
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        alert('Please enter a valid price greater than 0');
        return;
      }

      const productData = {
        title: formData.title.trim(),
        price: priceValue,
        description: formData.description.trim(),
        category: formData.category,
        image: formData.image.trim() || initialFormState.image,
        rating: product?.rating || { rate: 0, count: 0 }
      };

      let success;
      if (isEditing && product) {
        success = await onUpdateProduct(product.id, productData);
        if (success) {
          setSuccessMessage('Product updated successfully!');
        }
      } else {
        success = await onAddProduct(productData);
        if (success) {
          setSuccessMessage('Product added successfully!');
          resetForm();
        }
      }

      if (success) {
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    onCancelEdit();
  };

  const handleClearForm = () => {
    resetForm();
  };

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        {isEditing && (
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancelEdit}
          >
            Cancel Edit
          </button>
        )}
      </div>

      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Product Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter product title"
              minLength="3"
              maxLength="100"
            />
            <small className="form-hint">Minimum 3 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (USD) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="0.00"
              min="0.01"
              step="0.01"
            />
            <small className="form-hint">Enter amount in USD</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <small className="form-hint">Optional - uses default if empty</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter product description"
            rows="4"
            minLength="10"
            maxLength="500"
            style={{ resize: 'none' }}
          />
          <small className="form-hint">Minimum 10 characters</small>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small"></span>
                {isEditing ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              isEditing ? 'Update Product' : 'Add Product'
            )}
          </button>

          {!isEditing ? (
            <button
              type="button"
              className="btn-reset"
              onClick={handleClearForm}
              disabled={isSubmitting || (
                formData.title === '' &&
                formData.price === '' &&
                formData.description === '' &&
                formData.category === 'electronics' &&
                formData.image === initialFormState.image
              )}
            >
              Clear Form
            </button>
          ) : (
            <button
              type="button"
              className="btn-reset"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
            >
              Cancel & Reset
            </button>
          )}
        </div>
      </form>

      <div className="form-footer">
        <p className="form-note">
          * Required fields
          {isEditing && (
            <span className="edit-mode-note">
              &nbsp;• Editing Product ID: #{product?.id}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};


export default ProductForm;