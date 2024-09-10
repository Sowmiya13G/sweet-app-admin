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
import CompleteRegistration from "./pages/completeRegistraton/completeRegistration";
import Dashboard from "./pages/dashboard/dashboard";
import LocationPage from "./pages/location/location";
import Offers from "./pages/offers/offers";
import Orders from "./pages/orders/orders";
import Tables from "./pages/tables/tables";
import Users from "./pages/users/user";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ProtectedRoute = ({ element }) => {
    if (loading) {
      return null;
    }
    if (!user) {
      return <Navigate to="/login" />;
    }
    return element;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/completeRegistration"
          element={<CompleteRegistration />}
        />
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
          path="/tables"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Tables />
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
        <Route
          path="/location"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <LocationPage />
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
