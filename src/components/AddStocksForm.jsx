import React, { useState } from 'react';

const AddStocksForm = () => {
  const [productName, setProductName] = useState('');
  const [productId, setProductId] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const isProductIdExists = (id) => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    return products.some((p) => p.productId === id);
  };

  const saveProduct = (productObj) => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(productObj);
    localStorage.setItem('products', JSON.stringify(products));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName || productName.length > 100) {
      alert('Please enter a valid product name (1-100 characters).');
      return;
    }
    if (!productId || productId.length > 50) {
      alert('Please enter a valid product ID (1-50 characters).');
      return;
    }
    if (isNaN(productPrice) || productPrice <= 0) {
      alert('Please enter a valid price greater than 0.');
      return;
    }
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity greater than 0.');
      return;
    }
    if (isProductIdExists(productId)) {
      alert('Error: Product ID already exists. Please use a unique Product ID.');
    } else {
      saveProduct({
        productName,
        productId,
        productPrice: parseFloat(productPrice),
        quantity: parseInt(quantity),
      });
      setProductName('');
      setProductId('');
      setProductPrice('');
      setQuantity('');
      alert('Stock added successfully!');
    }
  };

  return (
    <div className="p-2 text-[11px] leading-tight max-w-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Add New Stock</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label htmlFor="productName" className="block text-gray-700 mb-0.5">Product Name</label>
          <input
            type="text"
            id="productName"
            className="w-60 rounded-sm px-3 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-0 text-[11px]"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="productId" className="block text-gray-700 mb-0.5">Product ID</label>
          <input
            type="text"
            id="productId"
            className="w-60 rounded-sm px-3 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-0 text-[11px]"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="productPrice" className="block text-gray-700 mb-0.5">Price (₹)</label>
          <input
            type="number"
            step="0.01"
            id="productPrice"
            className="w-60 rounded-sm px-3 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-0 text-[11px]"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-gray-700 mb-0.5">Quantity</label>
          <input
            type="number"
            id="quantity"
            className="w-60 rounded-sm px-3 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-0 text-[11px]"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white rounded-sm px-4 py-2 font-medium text-[11px] hover:bg-indigo-700 transition-all"
        >
          Add Stock
        </button>
      </form>
    </div>
  );
};

export default AddStocksForm;
