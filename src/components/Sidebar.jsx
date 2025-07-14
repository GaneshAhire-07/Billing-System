import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isAdmin, activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('loginAs');
    localStorage.removeItem('loginId');
    navigate('/');
  };

  const navItems = isAdmin
    ? [
        { id: 'addStocksLink', label: 'Add Stocks', icon: 'bi-plus-square' },
        { id: 'seeAllProductsLink', label: 'See All Products', icon: 'bi-boxes' },
        { id: 'generateBillLink', label: 'Generate Bill', icon: 'bi-file-earmark-text' },
        { id: 'generateGSTBillLink', label: 'Generate GST Bill', icon: 'bi-file-earmark-spreadsheet' },
        { id: 'myBillsLink', label: 'My Bills', icon: 'bi-receipt' },
        { id: 'paymentHistoryLink', label: 'Payment History', icon: 'bi-credit-card' },
        { id: 'billStatusLink', label: 'Bill Status', icon: 'bi-check-circle' },
        { id: 'calculatorLink', label: 'Calculator', icon: 'bi-calculator' },
      ]
    : [
        { id: 'myBillsLink', label: 'My Bills', icon: 'bi-receipt' },
        { id: 'generateBillLink', label: 'Generate Bill', icon: 'bi-file-earmark-text' },
        { id: 'generateGSTBillLink', label: 'Generate GST Bill', icon: 'bi-file-earmark-spreadsheet' },
        { id: 'seeAllProductsLink', label: 'See All Products', icon: 'bi-boxes' },
        { id: 'addStocksLink', label: 'Add Products', icon: 'bi-plus-square' },
        { id: 'calculatorLink', label: 'Calculator', icon: 'bi-calculator' },
      ];

  return (
    <nav
      id="sidebar"
      className="w-56 bg-gradient-to-b from-gray-800 to-gray-700 text-gray-100 h-screen transition-transform duration-300 md:translate-x-0 fixed top-0 bottom-0 z-50 md:shadow-md rounded-r-lg text-xs"
    >
      <div className="p-3">
        <div className="flex items-center border-b border-gray-600 pb-3">
          <i className="bi bi-building text-xl mr-2"></i>
          <span className="text-base font-semibold">{isAdmin ? 'Admin Panel' : 'Employee Panel'}</span>
        </div>
        <ul className="mt-3 space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id.replace('Link', ''))}
                className={`w-full text-left px-3 py-2 text-gray-300 font-medium hover:bg-gray-600 hover:text-white rounded transition-colors ${
                  activeSection === item.id.replace('Link', '') ? 'bg-indigo-600 text-white' : ''
                }`}
              >
                <i className={`bi ${item.icon} mr-2 text-sm`}></i>
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-gray-300 font-medium hover:bg-gray-600 hover:text-white rounded transition-colors"
            >
              <i className="bi bi-box-arrow-right mr-2 text-sm"></i>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
