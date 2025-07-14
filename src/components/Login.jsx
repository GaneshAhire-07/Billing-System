import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (type) => {
    if (type === 'employee') {
      navigate('/employee-login');
    } else {
      navigate('/admin-login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-3xl w-full"> {/* changed from max-w-4xl */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 drop-shadow-md">
          Login As?
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
          <div
            className="bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer w-full max-w-xs flex flex-col justify-center h-36"
            onClick={() => handleLogin('employee')}
          >
            <i className="bi bi-people-fill text-4xl text-indigo-600 mb-2"></i>
            <div className="text-lg font-medium text-gray-800">Employee</div>
          </div>
          <div
            className="bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer w-full max-w-xs flex flex-col justify-center h-36"
            onClick={() => handleLogin('admin')}
          >
            <i className="bi bi-person-gear text-4xl text-indigo-600 mb-2"></i>
            <div className="text-lg font-medium text-gray-800">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
