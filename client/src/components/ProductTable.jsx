function ProductTable({ products, onDelete }) {
  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p._id}>
            <td>{p.name}</td>
            <td>₱{p.price}</td>
            <td>{p.stock}</td>
            <td>
              <button type="button" onClick={() => onDelete(p._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;
