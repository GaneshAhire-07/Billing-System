import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AddStocksForm from "./AddStocksForm";
import AllProductsTable from "./AllProductsTable";
import GenerateBill from "./GenerateBill";
import MyBills from "./MyBills";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("addStocks");

  const renderSection = () => {
    switch (activeSection) {
      case "addStocks":
        return <AddStocksForm />;
      case "seeAllProducts":
        return <AllProductsTable />;
      case "generateBill":
        return <GenerateBill isGST={false} />;
      case "generateGSTBill":
        return <GenerateBill isGST={true} />;
      case "myBills":
        return <MyBills />;
      case "paymentHistory":
        return (
          <div className="p-2 text-xs text-gray-700">
            Payment History (To be implemented)
          </div>
        );
      case "billStatus":
        return (
          <div className="p-2 text-xs text-gray-700">
            Bill Status (To be implemented)
          </div>
        );
      case "calculator":
        return (
          <div className="p-2 text-xs text-gray-700">
            Calculator (To be implemented)
          </div>
        );
      default:
        return <AddStocksForm />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-xs leading-tight">
      <Sidebar
        isAdmin={true}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex-1 p-2 md:ml-60">{renderSection()}</div>
    </div>
  );
};

export default AdminDashboard;
