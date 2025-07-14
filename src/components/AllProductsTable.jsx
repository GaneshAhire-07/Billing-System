import React, { useState, useEffect } from "react";

const AllProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModal, setEditModal] = useState({
    open: false,
    product: null,
    index: null,
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    displayAllProducts();
  }, [searchTerm, sortConfig]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const displayAllProducts = () => {
    try {
      let storedProducts = JSON.parse(localStorage.getItem("products")) || [];

      const mergedMap = new Map();

      storedProducts.forEach((product, index) => {
        if (mergedMap.has(product.productId)) {
          const existing = mergedMap.get(product.productId);
          existing.quantity += product.quantity;
        } else {
          mergedMap.set(product.productId, {
            ...product,
            _originalIndex: index, // 🔑 Track original index
          });
        }
      });

      const mergedProducts = Array.from(mergedMap.values());

      if (sortConfig.key) {
        mergedProducts.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key])
            return sortConfig.direction === "asc" ? -1 : 1;
          if (a[sortConfig.key] > b[sortConfig.key])
            return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
      }

      const filtered = mergedProducts.filter(
        (product) =>
          !searchTerm ||
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setProducts(filtered);
    } catch (error) {
      console.error("Error displaying products:", error);
      alert("Failed to load products.");
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleEdit = (index) => {
    const product = products[index];
    setEditModal({ open: true, product, index: product._originalIndex }); // ✅ original index
  };

  const handleDelete = (index) => {
    const product = products[index];
    const originalIndex = product._originalIndex; // ✅ original index

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        let storedProducts = JSON.parse(localStorage.getItem("products")) || [];
        storedProducts.splice(originalIndex, 1);
        localStorage.setItem("products", JSON.stringify(storedProducts));
        displayAllProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const { productName, productPrice, quantity } = editModal.product;
    if (!productName || productName.length > 100)
      return alert("Enter valid name.");
    if (isNaN(productPrice) || productPrice <= 0)
      return alert("Enter valid price.");
    if (isNaN(quantity) || quantity <= 0) return alert("Enter valid quantity.");

    try {
      let storedProducts = JSON.parse(localStorage.getItem("products")) || [];
      storedProducts[editModal.index] = {
        ...storedProducts[editModal.index],
        productName,
        productPrice: parseFloat(productPrice),
        quantity: parseInt(quantity),
      };
      localStorage.setItem("products", JSON.stringify(storedProducts));
      setEditModal({ open: false, product: null, index: null });
      displayAllProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save changes.");
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div
      className="p-6 max-w-[70vw] w-full mx-auto my-6"
      style={{ minHeight: "70vh" }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        All Products
      </h2>

      <div className="mb-6">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="w-full border-collapse text-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-semibold">
              <th
                className="border border-gray-200 px-6 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("productName")}
              >
                Name {sortConfig.key === "productName" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="border border-gray-200 px-6 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("productId")}
              >
                ID {sortConfig.key === "productId" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="border border-gray-200 px-6 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("productPrice")}
              >
                Price {sortConfig.key === "productPrice" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="border border-gray-200 px-6 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("quantity")}
              >
                Qty {sortConfig.key === "quantity" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="border border-gray-200 px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 odd:bg-white even:bg-gray-100 transition-colors duration-200"
              >
                <td className="border border-gray-200 px-6 py-3">
                  {product.productName}
                </td>
                <td className="border border-gray-200 px-6 py-3">
                  {product.productId}
                </td>
                <td className="border border-gray-200 px-6 py-3">
                  ₹{parseFloat(product.productPrice).toFixed(2)}
                </td>
                <td className="border border-gray-200 px-6 py-3">
                  {product.quantity}
                </td>
                <td className="border border-gray-200 px-6 py-3">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg mr-2 hover:bg-indigo-700 transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-all duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-all duration-200"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === page
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } transition-all duration-200`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-all duration-200"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Product</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                value={editModal.product.productName}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    product: {
                      ...editModal.product,
                      productName: e.target.value,
                    },
                  })
                }
                placeholder="Product Name"
                required
              />
              <input
                type="number"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                value={editModal.product.productPrice}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    product: {
                      ...editModal.product,
                      productPrice: e.target.value,
                    },
                  })
                }
                placeholder="Price"
                required
              />
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                value={editModal.product.quantity}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    product: { ...editModal.product, quantity: e.target.value },
                  })
                }
                placeholder="Quantity"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setEditModal({ open: false, product: null, index: null })
                  }
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AllProductsTable;
