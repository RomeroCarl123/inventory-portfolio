import { useState } from "react";
import api from "../api";
import "./ProductForm.css";

function ProductForm({ token, refresh }) {
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/products", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", price: "", stock: "" });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div>
        <h3 className="product-form__title">Add New Product</h3>
        <p className="product-form__subtitle">
          Quickly add inventory items to your list.
        </p>
      </div>

      <div>
        <label className="product-form__label">Product Name</label>
        <input
          className="product-form__input"
          placeholder="e.g. Wireless Mouse"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="product-form__grid">
        <div>
          <label className="product-form__label">Price</label>
          <input
            className="product-form__input"
            placeholder="0.00"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        <div>
          <label className="product-form__label">Stock</label>
          <input
            className="product-form__input"
            placeholder="0"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>
      </div>

      {error && <p className="product-form__error">{error}</p>}

      <button className="product-form__submit" type="submit">
        Add Product
      </button>
    </form>
  );
}

export default ProductForm;
