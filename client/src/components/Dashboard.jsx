import { useEffect, useState } from "react";
import api from "../api";
import ProductForm from "./ProductForm";
import StockChart from "./StockChart";

export default function Dashboard({ token }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const totalProducts = products.length;
  const lowStock = products.filter((p) => Number(p.stock) < 5).length;
  const healthyStock = totalProducts - lowStock;
  const totalStockUnits = products.reduce(
    (sum, p) => sum + Number(p.stock || 0),
    0,
  );

  const fetchProducts = async () => {
    try {
      setError("");
      const res = await api.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load inventory");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-500/20 via-violet-500/10 to-cyan-500/20 p-6">
          <h1 className="text-3xl font-bold text-white">Inventory Dashboard</h1>
          <p className="mt-1 text-sm text-slate-300">
            Track stock trends, monitor low inventory, and add new products.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-slate-900 p-4 shadow-lg">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Total Products
            </p>
            <p className="mt-2 text-2xl font-bold text-white">
              {totalProducts}
            </p>
          </div>
          <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 shadow-lg">
            <p className="text-xs uppercase tracking-wider text-red-200">
              Low Stock
            </p>
            <p className="mt-2 text-2xl font-bold text-red-100">{lowStock}</p>
          </div>
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 shadow-lg">
            <p className="text-xs uppercase tracking-wider text-emerald-200">
              Healthy
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-100">
              {healthyStock}
            </p>
          </div>
          <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-4 shadow-lg">
            <p className="text-xs uppercase tracking-wider text-sky-200">
              Total Units
            </p>
            <p className="mt-2 text-2xl font-bold text-sky-100">
              {totalStockUnits}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-xl">
            <ProductForm token={token} refresh={fetchProducts} />
          </div>
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-xl">
            <StockChart products={products} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Products Table
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-slate-800 text-slate-200">
                  <th className="border border-white/10 px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="border border-white/10 px-4 py-2 text-left">
                    Price
                  </th>
                  <th className="border border-white/10 px-4 py-2 text-left">
                    Stock
                  </th>
                  <th className="border border-white/10 px-4 py-2 text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-white/10 px-4 py-10 text-center text-slate-400"
                    >
                      No products yet. Add your first item using the form above.
                    </td>
                  </tr>
                ) : (
                  products.map((p, idx) => (
                    <tr
                      key={p._id}
                      className={`${
                        p.stock < 5
                          ? "bg-red-500/10 text-red-200"
                          : idx % 2 === 0
                            ? "bg-slate-900 text-slate-100"
                            : "bg-slate-900/70 text-slate-100"
                      } hover:bg-slate-800/60 transition-colors`}
                    >
                      <td className="border border-white/10 px-4 py-2">
                        {p.name}
                      </td>
                      <td className="border border-white/10 px-4 py-2">
                        ₱{p.price}
                      </td>
                      <td className="border border-white/10 px-4 py-2">
                        {p.stock}
                      </td>
                      <td className="border border-white/10 px-4 py-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            p.stock < 5
                              ? "bg-red-500/20 text-red-200"
                              : "bg-emerald-500/20 text-emerald-200"
                          }`}
                        >
                          {p.stock < 5 ? "Low Stock" : "Healthy"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
