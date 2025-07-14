import React, { useState, useEffect } from "react";
import myImg from "../assets/CirasthayiTechnology.jpeg";

const MyBills = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [printModal, setPrintModal] = useState({ open: false, bill: null });
  const [editModal, setEditModal] = useState({ open: false, bill: null, index: null });

  useEffect(() => {
    displayBills();
  }, [searchTerm]);

  const displayBills = () => {
    try {
      const myBills = JSON.parse(localStorage.getItem("myBills")) || [];
      setBills(
        myBills.filter(
          (bill) =>
            !searchTerm ||
            bill.id.toString().includes(searchTerm) ||
            bill.date.includes(searchTerm)
        )
      );
    } catch (error) {
      console.error("Error displaying bills:", error);
      alert("Failed to load bills.");
    }
  };

  const handleRefresh = () => {
    displayBills();
  };

  const handleView = (index) => {
    const bill = bills[index];
    setPrintModal({ open: true, bill });
  };

  const handlePrint = (index) => {
    handleView(index);
    setTimeout(() => window.print(), 500);
  };

  const handleEdit = (index) => {
    const bill = bills[index];
    setEditModal({ open: true, bill: { ...bill }, index });
  };

  const handleEditChange = (field, value) => {
    setEditModal((prev) => ({
      ...prev,
      bill: {
        ...prev.bill,
        [field]: value,
      },
    }));
  };

  const saveEditChanges = () => {
    try {
      const updatedBills = [...bills];
      updatedBills[editModal.index] = editModal.bill;

      const allBills = JSON.parse(localStorage.getItem("myBills")) || [];
      allBills[editModal.index] = editModal.bill;
      localStorage.setItem("myBills", JSON.stringify(allBills));

      setBills(updatedBills);
      setEditModal({ open: false, bill: null, index: null });
      alert("Bill updated successfully!");
    } catch (error) {
      console.error("Failed to save edited bill", error);
      alert("Failed to update bill.");
    }
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        let myBills = JSON.parse(localStorage.getItem("myBills")) || [];
        myBills.splice(index, 1);
        localStorage.setItem("myBills", JSON.stringify(myBills));
        displayBills();
      } catch (error) {
        console.error("Error deleting bill:", error);
        alert("Failed to delete bill.");
      }
    }
  };

  return (
    <div className="p-6 max-w-[75vw] w-full mx-auto my-6" style={{ minHeight: '60vh' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Bills</h2>
        <button
          onClick={handleRefresh}
          className="bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition-all duration-200 text-xs"
        >
          Refresh
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          placeholder="Search bills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="space-y-4">
        {bills.map((bill, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200"
          >
            <div>
              <h5 className="text-base font-semibold">
                {bill.type === "gst" ? "GST Invoice" : "Invoice"} #{bill.id} — {bill.customerName || "Customer"}
              </h5>
              <p className="text-sm text-gray-600">Date: {bill.date}</p>
              <p className="text-sm text-gray-600">Total: ₹{bill.total.toFixed(2)}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleView(index)}
                className="bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-xs"
              >
                View
              </button>
              <button
                onClick={() => handlePrint(index)}
                className="bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-gray-600 transition-all duration-200 text-xs"
              >
                Print
              </button>
              <button
                onClick={() => handleEdit(index)}
                className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-200 text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition-all duration-200 text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {printModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Invoice</h3>
              <button
                onClick={() => setPrintModal({ open: false, bill: null })}
                className="bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-gray-600 transition-all duration-200 text-xs"
              >
                Close
              </button>
            </div>
            <div className="border-4 border-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-6">
                <img
                  src={myImg}
                  alt="Company Logo"
                  className="w-16 h-16 mr-4 object-contain"
                />
                <div className="text-base">
                  <div className="font-bold">Cirasthayi Technology PVT. LTD.</div>
                  <div className="text-gray-600">
                    Marisoft Tower, Pune 411014 | +91 1234567890
                  </div>
                </div>
              </div>
              <div className="border-t-2 border-gray-200 pt-4 text-sm">
                <div className="flex justify-between mb-4">
                  <div>
                    <strong>{printModal.bill.type === "gst" ? "GST Invoice" : "Invoice"} ID:</strong> {printModal.bill.id}
                    {printModal.bill.customerName && (
                      <> — <strong>Customer:</strong> {printModal.bill.customerName}</>
                    )}
                  </div>
                  <div>
                    <strong>Date:</strong> {printModal.bill.date}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left font-semibold">Item Name</th>
                        <th className="border px-4 py-2 text-left font-semibold">Price</th>
                        <th className="border px-4 py-2 text-left font-semibold">Quantity</th>
                        <th className="border px-4 py-2 text-left font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {printModal.bill.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border px-4 py-2">{item.name}</td>
                          <td className="border px-4 py-2">₹{item.price.toFixed(2)}</td>
                          <td className="border px-4 py-2">{item.quantity}</td>
                          <td className="border px-4 py-2">₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      {printModal.bill.type === "gst" && (
                        <>
                          <tr>
                            <th colSpan="3" className="border px-4 py-2 text-right font-semibold text-gray-800">
                              Subtotal:
                            </th>
                            <th className="border px-4 py-2">₹{printModal.bill.subtotal.toFixed(2)}</th>
                          </tr>
                          <tr>
                            <th colSpan="3" className="border px-4 py-2 text-right font-semibold text-gray-800">
                              GST (18%):
                            </th>
                            <th className="border px-4 py-2">₹{printModal.bill.gst.toFixed(2)}</th>
                          </tr>
                        </>
                      )}
                      <tr>
                        <th colSpan="3" className="border px-4 py-2 text-right font-semibold text-gray-800">
                          Total:
                        </th>
                        <th className="border px-4 py-2">₹{printModal.bill.total.toFixed(2)}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setPrintModal({ open: false, bill: null })}
                className="bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-gray-600 transition-all duration-200 text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-xs"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-base font-bold mb-4 text-gray-800">Edit Customer Name</h3>
            <div className="mb-6">
              <label className="block mb-2 font-medium text-sm text-gray-700">Customer Name:</label>
              <input
                type="text"
                value={editModal.bill.customerName || ""}
                onChange={(e) => handleEditChange("customerName", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditModal({ open: false, bill: null, index: null })}
                className="bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-gray-600 transition-all duration-200 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={saveEditChanges}
                className="bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBills;