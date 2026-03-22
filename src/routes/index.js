  import React from "react";
  import { Routes, Route, Navigate, useParams } from "react-router-dom";

  import MenuPage from "../pages/user/menu";
  import CartPage from "../pages/user/cart";

  import MerchantLogin from "../pages/merchant/merchant-login";
  import MerchantDashboard from "../pages/merchant/dashboard";
  import LiveOrders from "../pages/merchant/live-orders";
  import MenuManagement from "../pages/merchant/menu-management";
  import QRCodeManagement from "../pages/merchant/qr-code-management";
  import BillsPayment from "../pages/merchant/bills-and-payment";
  import SeatingChart from "../pages/merchant/seats-and-reservations";
  import RestaurantRegistration from "../pages/merchant/merchant-sign-up";
  import RegistrationSuccess from "../pages/merchant/success-page";
  import OnboardingRestaurant from "../pages/super-admin/restaurant-onboarding";
  import RestaurantStatus from "../pages/super-admin/restaurant-status";
  import CompanyProfit from "../pages/super-admin/profits";
  import SuperAdminDashboard from "../pages/super-admin/dashboard";
  import OrderTracker from "../pages/user/live-order";
  import RestaurantUpdateForm from "../pages/merchant/update-restaurant";
  import MyOrders from "../pages/user/my-orders";

  import ProtectedRoute from "../components/route-protector";
  import { SocketProvider } from "../context/socketContext";

  // Create a wrapper component for LiveOrders that gets rest_id from params
  const LiveOrdersWithSocket = () => {
    const { rest_id } = useParams();
    
    return (
      <SocketProvider restId={rest_id}>
        <LiveOrders />
      </SocketProvider>
    );
  };

  export default function AppRoutes() {
    return (
      <Routes>
        <Route path="/:rest_id/:table_id" element={<MenuPage />} />
        <Route path="/:rest_id/:table_id/cart" element={<CartPage />} />
        <Route path="/:rest_id/:table_id/orders/:orderId" element={<OrderTracker />} />
        <Route path="/:rest_id/:table_id/my-orders" element={<MyOrders />} />
        <Route path="/:rest_id/:table_id/my-orders/:orderId" element={<OrderTracker />} />

        <Route path="/merchant/login" element={<MerchantLogin />} />
        <Route path="/merchant/sign-up" element={<RestaurantRegistration />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />

        <Route
          path="/merchant/:rest_id/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route index element={<MerchantDashboard />} />
                <Route path="live-orders" element={<LiveOrdersWithSocket />} />
                <Route path="menu-management" element={<MenuManagement />} />
                <Route path="bills-payment" element={<BillsPayment />} />
                <Route path="qr-codes" element={<QRCodeManagement />} />
                <Route path="seating-chart" element={<SeatingChart />} />
                <Route path="update-restaurant" element={<RestaurantUpdateForm />} />
                <Route path="*" element={<Navigate to="." replace />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Super Admin Dashboard - Main landing page */}
        <Route path="/a-secret-code/super-admin" element={<SuperAdminDashboard />} />
        
        {/* Individual pages */}
        <Route path="/a-secret-code/super-admin/onboarding-restaurant" element={<OnboardingRestaurant />} />
        <Route path="/a-secret-code/super-admin/restaurants" element={<RestaurantStatus />} />
        <Route path="/a-secret-code/super-admin/profit" element={<CompanyProfit />} />
      </Routes>
    );
  }