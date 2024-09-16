import React, { useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout";
import Auth from "./pages/auth/login";
import Categories from "./pages/category/categories";
import Dashboard from "./pages/dashboard/dashboard";
import Offers from "./pages/offers/offers";
import Orders from "./pages/orders/orders";
import Users from "./pages/users/user";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ProtectedRoute = ({ element }) => {
    // if (loading) {
    //   return null;
    // }
    // if (!user) {
    //   return <Navigate to="/login" />;
    // }
    return element;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        {/* <Route
          path="/completeRegistration"
          element={<CompleteRegistration />}
        /> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Categories />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/offers"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Offers />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Orders />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Users />
                </Layout>
              }
            />
          }
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
