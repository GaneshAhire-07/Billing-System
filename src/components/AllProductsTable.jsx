import React, { useState, useEffect } from 'react';

const AllProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModal, setEditModal] = useState({ open: false, product: null, index: null });

  useEffect(() => {
    displayAllProducts();
  }, [searchTerm]);

  const displayAllProducts = () => {
    try {
      const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
      setProducts(
        storedProducts.filter(
          (product) =>
            !searchTerm || product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } catch (error) {
      console.error('Error displaying products:', error);
      alert('Failed to load products.');
    }
  };

  const handleEdit = (index) => {
    const product = products[index];
    setEditModal({ open: true, product, index });
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        let storedProducts = JSON.parse(localStorage.getItem('products')) || [];
        storedProducts.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(storedProducts));
        displayAllProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const { productName, productPrice, quantity } = editModal.product;
    if (!productName || productName.length > 100) return alert('Enter valid name.');
    if (isNaN(productPrice) || productPrice <= 0) return alert('Enter valid price.');
    if (isNaN(quantity) || quantity <= 0) return alert('Enter valid quantity.');

    try {
      let storedProducts = JSON.parse(localStorage.getItem('products')) || [];
      storedProducts[editModal.index] = {
        ...storedProducts[editModal.index],
        productName,
        productPrice: parseFloat(productPrice),
        quantity: parseInt(quantity),
      };
      localStorage.setItem('products', JSON.stringify(storedProducts));
      setEditModal({ open: false, product: null, index: null });
      displayAllProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save changes.');
    }
  };

  return (
    <div className="p-2 text-[11px] leading-tight">
      <h2 className="text-lg font-semibold mb-2">All Products</h2>
      <input
        type="text"
        className="w-full p-1.5 border border-gray-300 rounded mb-2"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="overflow-x-auto rounded shadow border border-gray-300">
  <table className="w-full border-collapse text-[11px]">
    <thead>
      <tr className="bg-gray-200 text-gray-800 text-left font-semibold">
        <th className="border border-gray-300 px-3 py-2">Name</th>
        <th className="border border-gray-300 px-3 py-2">ID</th>
        <th className="border border-gray-300 px-3 py-2">Price</th>
        <th className="border border-gray-300 px-3 py-2">Qty</th>
        <th className="border border-gray-300 px-3 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product, index) => (
        <tr key={index} className="hover:bg-gray-100 odd:bg-white even:bg-gray-50">
          <td className="border border-gray-300 px-3 py-1.5">{product.productName}</td>
          <td className="border border-gray-300 px-3 py-1.5">{product.productId}</td>
          <td className="border border-gray-300 px-3 py-1.5">₹{parseFloat(product.productPrice).toFixed(2)}</td>
          <td className="border border-gray-300 px-3 py-1.5">{product.quantity}</td>
          <td className="border border-gray-300 px-3 py-1.5">
            <button
              onClick={() => handleEdit(index)}
              className="bg-indigo-600 text-white px-2 py-1 rounded mr-1 hover:bg-indigo-700"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(index)}
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-[11px]">
          <div className="bg-white rounded p-4 w-full max-w-sm">
            <h3 className="text-base font-bold mb-2">Edit Product</h3>
            <form onSubmit={handleSaveEdit} className="space-y-2">
              <input
                type="text"
                className="w-full p-1.5 border border-gray-300 rounded"
                value={editModal.product.productName}
                onChange={(e) => setEditModal({ ...editModal, product: { ...editModal.product, productName: e.target.value } })}
                placeholder="Product Name"
                required
              />
              <input
                type="number"
                step="0.01"
                className="w-full p-1.5 border border-gray-300 rounded"
                value={editModal.product.productPrice}
                onChange={(e) => setEditModal({ ...editModal, product: { ...editModal.product, productPrice: e.target.value } })}
                placeholder="Price"
                required
              />
              <input
                type="number"
                className="w-full p-1.5 border border-gray-300 rounded"
                value={editModal.product.quantity}
                onChange={(e) => setEditModal({ ...editModal, product: { ...editModal.product, quantity: e.target.value } })}
                placeholder="Quantity"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditModal({ open: false, product: null, index: null })} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Close</button>
                <button type="submit" className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProductsTable;
