import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StaffLogin from './Screens/Accounts/Login';
import CustomerHomeMenu from './Screens/Customer/HomeMenu';
import StaffForgotPassword from './Screens/Accounts/ForgotPasswordAccount';
import Home from './Screens/Home';
import CreateStaffAccount from './Screens/Accounts/CreateAccount';
import KitchenOrderRequests from './Screens/Kitchen/KitchenOrderRequests';
import KitchenOrderRequestsCompleted from './Screens/Kitchen/KitchenOrderRequestsCompleted';
import WaiterOrderRequests from './Screens/Waiter/WaiterOrderRequests';
import WaiterAssistanceRequests from './Screens/Waiter/WaiterAssistanceRequests';
import ManagerMenu from './Screens/Manager/ManagerMenu';
import ManagerCategories from './Screens/Manager/ManagerCategories';
import WaiterBillRequests from './Screens/Waiter/WaiterBillRequests';
import ManagerItemOrdering from './Screens/Manager/ManagerItemOrdering';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>} />

        {/* Staff login/creation */}
        <Route path="/staff/login" element={<StaffLogin/>} />
        <Route path="/staff/forgot-password" element={<StaffForgotPassword/>} />
        <Route path="/staff/create-account" element={<CreateStaffAccount/>} />

        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerHomeMenu/>} />

        {/* Kitchen Routes */}
        <Route path="/kitchen/order-requests" element={<KitchenOrderRequests/>} />
        <Route path="/kitchen/completed-requests" element={<KitchenOrderRequestsCompleted/>} />

        {/* Waiter Routes */}
        <Route path="/waiter/order-requests" element={<WaiterOrderRequests/>} />
        <Route path="/waiter/assistance-requests" element={<WaiterAssistanceRequests/>} />
        <Route path="/waiter/bill-requests" element={<WaiterBillRequests/>} />

        {/* Manager Routes */}
        <Route path="/manager/categories" element={<ManagerCategories/>} />
        <Route path="/manager/menu" element={<ManagerMenu/>} />
        <Route path="/manager/item-ordering" element={<ManagerItemOrdering/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
