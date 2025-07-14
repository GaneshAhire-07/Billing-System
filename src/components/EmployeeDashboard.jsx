import React, { useState } from 'react';
import Sidebar from './Sidebar';
import GenerateBill from './GenerateBill';

const EmployeeDashboard = () => {
  const [activeSection, setActiveSection] = useState('generateBill');

  const renderSection = () => {
    return <GenerateBill isGST={false} />;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isAdmin={false}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sections={['generateBill']} // ✅ Only GenerateBill allowed
      />
      <div className="flex-1 p-4 md:ml-64 bg-gray-100">
        {renderSection()}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
