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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Bills</h2>
      <div className="mb-4">
        <input
          type="text"
          className="w-full rounded-lg p-3 border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
          placeholder="Search bills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        {bills.map((bill, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
          >
            <div>
              <h5 className="font-semibold">
                {bill.type === "gst" ? "GST Invoice" : "Invoice"} #{bill.id} — {bill.customerName || "Customer"}
              </h5>
              <p>Date: {bill.date}</p>
              <p>Total: ₹{bill.total.toFixed(2)}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleView(index)} className="bg-indigo-600 text-white rounded px-3 py-1 hover:bg-indigo-700">View</button>
              <button onClick={() => handlePrint(index)} className="bg-gray-500 text-white rounded px-3 py-1 hover:bg-gray-600">Print</button>
              <button onClick={() => handleEdit(index)} className="bg-yellow-500 text-white rounded px-3 py-1 hover:bg-yellow-600">Edit</button>
              <button onClick={() => handleDelete(index)} className="bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {printModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
            <h3 className="text-xl font-bold mb-4">Invoice</h3>
            <div className="border-4 border-gray-800 p-4">
              <div className="flex items-center mb-4">
                <img src={myImg} alt="Company Logo" className="w-16 h-16 mr-4 object-contain" />
                <h2 className="text-2xl font-bold">Cirasthayi Technology PVT. LTD.</h2>
              </div>
              <p>
                <strong>Add:</strong> Marisoft Tower, Pune 411014 <br />
                <strong>Phone:</strong> +91 1234567890
              </p>
            </div>
            <div className="border-2 border-gray-800 p-4 mt-4">
              <div className="flex justify-between mb-3 text-sm">
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
                      <th className="border p-3 text-left">Item Name</th>
                      <th className="border p-3 text-left">Price</th>
                      <th className="border p-3 text-left">Quantity</th>
                      <th className="border p-3 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printModal.bill.items.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-3">{item.name}</td>
                        <td className="border p-3">₹{item.price.toFixed(2)}</td>
                        <td className="border p-3">{item.quantity}</td>
                        <td className="border p-3">₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    {printModal.bill.type === "gst" && (
                      <>
                        <tr>
                          <th colSpan="3" className="border p-3 text-right">Subtotal:</th>
                          <th className="border p-3">₹{printModal.bill.subtotal.toFixed(2)}</th>
                        </tr>
                        <tr>
                          <th colSpan="3" className="border p-3 text-right">GST (18%):</th>
                          <th className="border p-3">₹{printModal.bill.gst.toFixed(2)}</th>
                        </tr>
                      </>
                    )}
                    <tr>
                      <th colSpan="3" className="border p-3 text-right">Total:</th>
                      <th className="border p-3">₹{printModal.bill.total.toFixed(2)}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setPrintModal({ open: false, bill: null })} className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600">Close</button>
              <button onClick={() => window.print()} className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700">Print</button>
            </div>
          </div>
        </div>
      )}

      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Customer Name</h3>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Customer Name:</label>
              <input
                type="text"
                value={editModal.bill.customerName || ""}
                onChange={(e) => handleEditChange("customerName", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setEditModal({ open: false, bill: null, index: null })} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
              <button onClick={saveEditChanges} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBills;
