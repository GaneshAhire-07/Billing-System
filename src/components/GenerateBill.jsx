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
  const [cashAmount, setCashAmount] = useState("");
  const [onlineAmount, setOnlineAmount] = useState("");
  const [creditAmount, setCreditAmount] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("products")) || [];
    setProductList(data);
  }, []);

  const handleItemSelect = (e) => {
    const selectedName = e.target.value;
    setItemName(selectedName);
    const found = productList.find((p) => p.productName === selectedName);
    setItemPrice(found ? found.productPrice : "");
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

  useEffect(() => {
    // Parse total from the total string (ex: "Total: ₹500.00" or "Subtotal: ₹400.00, GST: ₹72.00, Total: ₹472.00")
    const totalAmt =
      isGST && total
        ? parseFloat(total.split("Total: ₹")[1])
        : total
        ? parseFloat(total.split("₹")[1])
        : 0;

    const cash = cashAmount !== "" ? parseFloat(cashAmount) : 0;
    const online = onlineAmount !== "" ? parseFloat(onlineAmount) : 0;

    if (!isNaN(totalAmt) && (cash !== null || online !== null)) {
      const remaining = parseFloat((totalAmt - (cash + online)).toFixed(2));
      if (remaining >= 0) {
        setCreditAmount(remaining.toString());
      } else {
        setCreditAmount("0"); // if total paid > totalAmt, reset credit
      }
    }
  }, [cashAmount, onlineAmount, total]);

  const generateInvoice = () => {
    if (items.length === 0) return alert("Add at least one item.");

    const totals = calculateTotal();
    const totalAmt = isGST ? totals.total : totals.total;

    const cash = cashAmount !== "" ? parseFloat(cashAmount) : null;
    const online = onlineAmount !== "" ? parseFloat(onlineAmount) : null;
    const credit = creditAmount !== "" ? parseFloat(creditAmount) : null;

    // ✅ Ensure all three values are entered
    if (cash === null || online === null || credit === null) {
      return alert("Please enter all three: Cash, Online, and Credit amounts.");
    }

    // ✅ Prevent invalid or negative values
    if (cash < 0 || online < 0 || credit < 0) {
      return alert("Amounts must be 0 or greater.");
    }

    const paidTotal = cash + online + credit;

    if (paidTotal.toFixed(2) !== totalAmt.toFixed(2)) {
      return alert(
        `Payment mismatch! Total: ₹${totalAmt.toFixed(
          2
        )}, Paid: ₹${paidTotal.toFixed(2)}`
      );
    }

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
      paymentSplit: {
        cash: cash,
        online: online,
        credit: credit,
      },
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
    setCashAmount("");
    setOnlineAmount("");
    setCreditAmount("");

    alert(`${isGST ? "GST " : ""}Invoice saved!`);
  };

  const clearAll = () => {
    setItems([]);
    setTotal("");
    setCashAmount("");
    setOnlineAmount("");
    setCreditAmount("");
  };
  return (
    <div
      className="p-8 max-w-[75vw] w-full mx-auto my-8"
      style={{ minHeight: "60vh" }}
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        {isGST ? "Generate GST Bill" : "Generate Bill"}
      </h2>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={itemName}
            onChange={handleItemSelect}
            className="flex-1 rounded p-1 border border-gray-300"
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
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          />
          <input
            type="number"
            placeholder="Qty"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          />
          <button
            onClick={addItem}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-lg"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm text-lg"
            >
              <span>
                {item.name} - ₹{item.price} × {item.quantity}
              </span>
              <button
                onClick={() => removeItem(i)}
                className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-all duration-200"
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
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          />
        </div>

        {total && (
          <div className="space-y-1 mt-1">
            <p className="text-2xl font-bold text-center text-green-700">
              {total}
            </p>

            <div className="flex flex-col sm:flex-row gap-1">
              <input
                type="number"
                step="0.01"
                placeholder="Cash Amount"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Online Amount"
                value={onlineAmount}
                onChange={(e) => setOnlineAmount(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Credit Amount"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              />
            </div>
          </div>
        )}

        <div className="space-x-1 mt-2">
          <button
            onClick={calculateTotal}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 text-lg"
          >
            Calculate
          </button>
          <button
            onClick={generateInvoice}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-lg"
          >
            Generate
          </button>
          <button
            onClick={clearAll}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 text-lg"
          >
            Clear
          </button>
        </div>
      </div>

      {printModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Invoice</h3>
              <button
                onClick={() => setPrintModal({ open: false, invoice: null })}
                className="bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition-all duration-200 text-lg"
              >
                Close
              </button>
            </div>
            <div className="border border-gray-400 p-2">
              <div className="flex items-center mb-2">
                <img
                  src={myImg}
                  alt="Logo"
                  className="w-16 h-16 mr-4 object-contain"
                />
                <div className="text-lg">
                  <div className="font-semibold">
                    Cirasthayi Technology PVT. LTD.
                  </div>
                  <div className="text-gray-600">
                    Marisoft Tower, Pune 411014 | +91 1234567890
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 text-lg">
                <div className="flex justify-between mb-2">
                  <span>
                    <strong>ID:</strong> {printModal.invoice.id}
                  </span>
                  <span>
                    <strong>Date:</strong> {printModal.invoice.date}
                  </span>
                </div>
                <table className="w-full border border-gray-300 text-lg">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">Item</th>
                      <th className="border px-4 py-2 text-left">Price</th>
                      <th className="border px-4 py-2 text-left">Qty</th>
                      <th className="border px-4 py-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printModal.invoice.items.map((item, i) => (
                      <tr key={i}>
                        <td className="border px-4 py-2">{item.name}</td>
                        <td className="border px-4 py-2">
                          ₹{item.price.toFixed(2)}
                        </td>
                        <td className="border px-4 py-2">{item.quantity}</td>
                        <td className="border px-4 py-2">
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
                            className="border px-4 py-2 text-right font-semibold"
                          >
                            Subtotal:
                          </td>
                          <td className="border px-4 py-2">
                            ₹{printModal.invoice.subtotal.toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="3"
                            className="border px-4 py-2 text-right font-semibold"
                          >
                            GST (18%):
                          </td>
                          <td className="border px-4 py-2">
                            ₹{printModal.invoice.gst.toFixed(2)}
                          </td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td
                        colSpan="3"
                        className="border px-4 py-2 text-right font-semibold"
                      >
                        Total:
                      </td>
                      <td className="border px-4 py-2">
                        ₹{printModal.invoice.total.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan="3"
                        className="border px-2 py-1 text-right font-semibold"
                      >
                        Payment Split:
                      </td>
                      <td className="border px-2 py-1">
                        Cash ₹{printModal.invoice.paymentSplit.cash} / Online ₹
                        {printModal.invoice.paymentSplit.online} / Credit ₹
                        {printModal.invoice.paymentSplit.credit}
                      </td>
                    </tr>

                    <tr>
                      <td
                        colSpan="3"
                        className="border px-2 py-1 text-right font-semibold"
                      >
                        Pending Rs(₹):
                      </td>
                      <td className="border px-2 py-1">
                        {printModal.invoice.paymentSplit.credit}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="text-right mt-4">
                <button
                  onClick={() => window.print()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-lg"
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
