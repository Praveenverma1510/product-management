
const ProductTable = ({ products, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="rating-stars">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '½'}
        {'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
        <span className="rating-text">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="product-table-container">
      <div className="table-header">
        <h2>Product List</h2>
        <span className="product-count">{products.length} products</span>
      </div>

      <div className="table-responsive">
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="product-row">
                <td className="product-id">{product.id}</td>
                <td className="product-image">
                  <img
                    src={product.image}
                    alt={product.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3dSEtDvpd9KAn4SdFJVoL0K1lj4Xfc-wVWQ&s';
                    }}
                  />
                </td>
                <td className="product-title">
                  <strong>{product.title}</strong>
                </td>
                <td className="product-category">
                  <span className="category-badge">{product.category}</span>
                </td>
                <td className="product-price">
                  {formatPrice(product.price)}
                </td>
                <td className="product-rating">
                  {getRatingStars(product.rating?.rate || 0)}
                  <small>({product.rating?.count || 0} reviews)</small>
                </td>
                <td className="product-description" title={product.description}>
                  <p>{product.description.substring(0, 100)}...</p>
                </td>
                <td className="product-actions">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(product)}
                    title="Edit Product"
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(product.id)}
                    title="Delete Product"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;