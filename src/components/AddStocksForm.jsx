import React, { useState } from 'react';

const AddStocksForm = () => {
  const [productName, setProductName] = useState('');
  const [productId, setProductId] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState({});

  const isProductIdExists = (id) => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    return products.some((p) => p.productId === id);
  };

  const saveProduct = (productObj) => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(productObj);
    localStorage.setItem('products', JSON.stringify(products));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!productName || productName.length > 100) {
      newErrors.productName = 'Product name must be 1-100 characters.';
    }
    if (!productId || productId.length > 50) {
      newErrors.productId = 'Product ID must be 1-50 characters.';
    } else if (isProductIdExists(productId)) {
      newErrors.productId = 'Product ID already exists.';
    }
    if (isNaN(productPrice) || productPrice <= 0) {
      newErrors.productPrice = 'Price must be greater than 0.';
    }
    if (isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

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
    setErrors({});
    alert('Stock added successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-[70vw] w-full mx-auto my-6 sm:p-6" style={{ minHeight: '70vh' }}>
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8 sm:text-2xl">Add New Stock</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="productName" className="block text-lg font-medium text-gray-700 sm:text-base">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            className={`w-full rounded-md px-6 py-3 border text-lg focus:ring-0 focus:border-indigo-500 transition-colors ${
              errors.productName ? 'border-red-500' : 'border-gray-300'
            } sm:text-base sm:px-4 sm:py-2`}
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            aria-describedby={errors.productName ? 'productName-error' : undefined}
          />
          {errors.productName && (
            <p id="productName-error" className="text-red-500 text-sm sm:text-xs">
              {errors.productName}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="productId" className="block text-lg font-medium text-gray-700 sm:text-base">
            Product ID
          </label>
          <input
            type="text"
            id="productId"
            className={`w-full rounded-md px-6 py-3 border text-lg focus:ring-0 focus:border-indigo-500 transition-colors ${
              errors.productId ? 'border-red-500' : 'border-gray-300'
            } sm:text-base sm:px-4 sm:py-2`}
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            aria-describedby={errors.productId ? 'productId-error' : undefined}
          />
          {errors.productId && (
            <p id="productId-error" className="text-red-500 text-sm sm:text-xs">
              {errors.productId}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="productPrice" className="block text-lg font-medium text-gray-700 sm:text-base">
            Price (₹)
          </label>
          <input
            type="number"
            step="0.01"
            id="productPrice"
            className={`w-full rounded-md px-6 py-3 border text-lg focus:ring-0 focus:border-indigo-500 transition-colors ${
              errors.productPrice ? 'border-red-500' : 'border-gray-300'
            } sm:text-base sm:px-4 sm:py-2`}
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
            aria-describedby={errors.productPrice ? 'productPrice-error' : undefined}
          />
          {errors.productPrice && (
            <p id="productPrice-error" className="text-red-500 text-sm sm:text-xs">
              {errors.productPrice}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="quantity" className="block text-lg font-medium text-gray-700 sm:text-base">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            className={`w-full rounded-md px-6 py-3 border text-lg focus:ring-0 focus:border-indigo-500 transition-colors ${
              errors.quantity ? 'border-red-500' : 'border-gray-300'
            } sm:text-base sm:px-4 sm:py-2`}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            aria-describedby={errors.quantity ? 'quantity-error' : undefined}
          />
          {errors.quantity && (
            <p id="quantity-error" className="text-red-500 text-sm sm:text-xs">
              {errors.quantity}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded-md px-6 py-3 text-lg font-medium hover:bg-indigo-700 transition-colors sm:text-base sm:px-4 sm:py-2"
        >
          Add Stock
        </button>
      </form>
    </div>
  );
};

export default AddStocksForm;