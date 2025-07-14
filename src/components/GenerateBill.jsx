import React, { useState, useEffect } from "react";
import myImg from "../assets/CirasthayiTechnology.jpeg";

const GenerateBill = ({ isGST }) => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [total, setTotal] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [productList, setProductList] = useState([]);
  const [printModal, setPrintModal] = useState({ open: false, invoice: null });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("products")) || [];
    setProductList(data);
  }, []);

  const handleItemSelect = (e) => {
    const selectedName = e.target.value;
    setItemName(selectedName);
    const found = productList.find((p) => p.productName === selectedName);
    if (found) {
      setItemPrice(found.productPrice);
    } else {
      setItemPrice("");
    }
  };

  const addItem = () => {
    if (!itemName || itemName.length > 100)
      return alert("Enter valid item name.");
    if (isNaN(itemPrice) || itemPrice <= 0) return alert("Enter valid price.");
    if (isNaN(itemQuantity) || itemQuantity <= 0)
      return alert("Enter valid quantity.");

    setItems([
      ...items,
      {
        name: itemName,
        price: parseFloat(itemPrice),
        quantity: parseInt(itemQuantity),
      },
    ]);
    setItemName("");
    setItemPrice("");
    setItemQuantity("");
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const calculateTotal = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (isGST) {
      const gst = subtotal * 0.18;
      const total = subtotal + gst;
      setTotal(
        `Subtotal: ₹${subtotal.toFixed(2)}, GST: ₹${gst.toFixed(
          2
        )}, Total: ₹${total.toFixed(2)}`
      );
      return { subtotal, gst, total };
    } else {
      setTotal(`Total: ₹${subtotal.toFixed(2)}`);
      return { total: subtotal };
    }
  };

  const generateInvoice = () => {
    if (items.length === 0) return alert("Add at least one item.");

    const totals = calculateTotal();
    const date = new Date().toISOString().split("T")[0];
    const invoiceId = (
      parseInt(localStorage.getItem("lastInvoiceId") || "0") + 1
    )
      .toString()
      .padStart(4, "0");
    const invoice = {
      id: invoiceId,
      date,
      items,
      customerName,
      ...totals,
      type: isGST ? "gst" : "regular",
      status: "Pending",
      paymentDate: null,
    };
    const myBills = JSON.parse(localStorage.getItem("myBills")) || [];
    myBills.push(invoice);
    localStorage.setItem("myBills", JSON.stringify(myBills));
    localStorage.setItem("lastInvoiceId", invoiceId);
    setPrintModal({ open: true, invoice });
    setItems([]);
    setTotal("");
    alert(`${isGST ? "GST " : ""}Invoice saved!`);
  };

  const clearAll = () => {
    setItems([]);
    setTotal("");
  };

  return (
    <div className="p-2 text-[11px] leading-tight">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        {isGST ? "Generate GST Bill" : "Generate Bill"}
      </h2>

      <div className="space-y-2 mb-3">
        <div className="flex flex-col sm:flex-row gap-1">
          <select
            value={itemName}
            onChange={handleItemSelect}
            className="flex-1 rounded p-1.5 border border-gray-300"
          >
            <option value="">Select Product</option>
            {productList.map((p, i) => (
              <option key={i} value={p.productName}>
                {p.productName}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Price"
            step="0.01"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            className="flex-1 rounded p-1 border border-gray-300"
          />
          <input
            type="number"
            placeholder="Qty"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            className="flex-1 rounded p-1 border border-gray-300"
          />
          <button
            onClick={addItem}
            className="bg-indigo-600 text-white rounded px-3 py-1.5 hover:bg-indigo-700"
          >
            Add
          </button>
        </div>

        <ul className="space-y-1">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-50 p-1 rounded border text-[11px]"
            >
              <span>
                {item.name} - ₹{item.price} × {item.quantity}
              </span>
              <button
                onClick={() => removeItem(i)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row gap-1">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="flex-1 rounded p-1 border border-gray-300"
          />
        </div>
        <div className="space-x-1 mt-2">
          <button
            onClick={calculateTotal}
            className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
          >
            Calculate
          </button>
          <button
            onClick={generateInvoice}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700"
          >
            Generate
          </button>
          <button
            onClick={clearAll}
            className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700"
          >
            Clear
          </button>
        </div>
        {total && <p className="mt-1">{total}</p>}
      </div>

      {/* Invoice Modal */}
      {printModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 text-[11px]">
          <div className="bg-white rounded p-4 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-bold">Invoice</h3>
              <button
                onClick={() => setPrintModal({ open: false, invoice: null })}
                className="text-sm bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>

            <div className="border border-gray-400 p-2">
              <div className="flex items-center mb-2">
                <img
                  src={myImg}
                  alt="Logo"
                  className="w-10 h-10 mr-2 object-contain"
                />
                <div>
                  <div className="text-sm font-semibold">
                    Cirasthayi Technology PVT. LTD.
                  </div>
                  <div className="text-xs">
                    Marisoft Tower, Pune 411014 | +91 1234567890
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-300 pt-2 text-xs">
                <div className="flex justify-between mb-1">
                  <span>
                    <strong>ID:</strong> {printModal.invoice.id}
                  </span>
                  <span>
                    <strong>Date:</strong> {printModal.invoice.date}
                  </span>
                </div>
                <table className="w-full border border-gray-300 text-[11px]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-left">Item</th>
                      <th className="border px-2 py-1 text-left">Price</th>
                      <th className="border px-2 py-1 text-left">Qty</th>
                      <th className="border px-2 py-1 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printModal.invoice.items.map((item, i) => (
                      <tr key={i}>
                        <td className="border px-2 py-1">{item.name}</td>
                        <td className="border px-2 py-1">₹{item.price}</td>
                        <td className="border px-2 py-1">{item.quantity}</td>
                        <td className="border px-2 py-1">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    {isGST && (
                      <>
                        <tr>
                          <td
                            colSpan="3"
                            className="border px-2 py-1 text-right font-semibold"
                          >
                            Subtotal:
                          </td>
                          <td className="border px-2 py-1">
                            ₹{printModal.invoice.subtotal.toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="3"
                            className="border px-2 py-1 text-right font-semibold"
                          >
                            GST (18%):
                          </td>
                          <td className="border px-2 py-1">
                            ₹{printModal.invoice.gst.toFixed(2)}
                          </td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td
                        colSpan="3"
                        className="border px-2 py-1 text-right font-semibold"
                      >
                        Total:
                      </td>
                      <td className="border px-2 py-1">
                        ₹{printModal.invoice.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="text-right mt-2">
                <button
                  onClick={() => window.print()}
                  className="bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700"
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateBill;
