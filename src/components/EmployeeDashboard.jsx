import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AddStocksForm from './AddStocksForm';
import AllProductsTable from './AllProductsTable';
import GenerateBill from './GenerateBill';
import MyBills from './MyBills';

const EmployeeDashboard = () => {
  const [activeSection, setActiveSection] = useState('myBills');

  const renderSection = () => {
    switch (activeSection) {
      case 'myBills':
        return <MyBills />;
      case 'generateBill':
        return <GenerateBill isGST={false} />;
      case 'generateGSTBill':
        return <GenerateBill isGST={true} />;
      case 'seeAllProducts':
        return <AllProductsTable />;
      case 'addStocks':
        return <AddStocksForm />;
      case 'calculator':
        return <div className="p-6">Calculator (To be implemented)</div>;
      default:
        return <MyBills />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={false} activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 p-4 md:ml-64 bg-gray-100">
        {renderSection()}
      </div>
    </div>
  );
};

export default EmployeeDashboard;