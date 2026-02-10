import axios from "axios";
import { useState, useEffect } from "react";

const API = "/api";

function ProductForm() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/products`);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load products");
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submit = async (e) => {
    e?.preventDefault();
    setError(null);
    setSuccess(false);
    const parsedPrice = parseFloat(price);
    if (!productName.trim()) {
      setError("Product name is required");
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Please enter a valid price");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/products`, {
        productName: productName.trim(),
        price: parsedPrice,
      });
      setSuccess(true);
      setProductName("");
      setPrice("");
      fetchProducts();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to add product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h2>Products</h2>
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Product name</label>
          <input
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving…" : "Add Product"}
        </button>
      </form>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Product added successfully</div>}
      <div className="list">
        {!Array.isArray(products) || products.length === 0 ? (
          <div className="list-empty">No products yet</div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="list-item">
              <span>{p.productName}</span>
              <span className="price">${Number(p.price).toFixed(2)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductForm;
