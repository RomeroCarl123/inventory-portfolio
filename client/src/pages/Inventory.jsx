import { useEffect, useState } from "react";
import api from "../api";
import Dashboard from "../components/Dashboard";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (form) => {
    setError("");
    try {
      await api.post("/products", form);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    setError("");
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />
      <h1>Inventory Management System</h1>
      <Dashboard count={products.length} />
      <ProductForm onAdd={addProduct} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ProductTable products={products} onDelete={deleteProduct} />
    </div>
  );
}

export default Inventory;
