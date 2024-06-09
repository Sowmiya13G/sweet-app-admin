import { collection, onSnapshot } from "firebase/firestore"; // Firestore methods
import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout";
import { db } from "./firebaseConfig"; // Import Firestore
import Categories from "./pages/category/categories";
import Dashboard from "./pages/dashboard/dashboard";
import Login from "./pages/login";
import NotFound from "./pages/notFound";
import Orders from "./pages/orders/orders";
import Users from "./pages/users/user";
import notifisound from "./assets/notification.mp3";
import { Howl } from "howler";

function App() {
  const sound = new Howl({
    src: [notifisound],
    volume: 1,
  });

  const playSound = () => {
    sound.play();
  };

  useEffect(() => {
    // Request notification permissions
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Use a flag to skip initial snapshot
    let initialLoad = true;

    // Listen for new orders in real-time using Firestore
    const ordersRef = collection(db, "orders");
    const unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
      if (initialLoad) {
        initialLoad = false; // Skip the initial snapshot
        return;
      }
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newOrder = change.doc.data();
          console.log(newOrder?.orderID);

          // Show toast notification
          toast.success(`New Order: ${newOrder.orderID}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          playSound();
          // Show web notification
          if (Notification.permission === "granted") {
            new Notification("New Order", {
              body: `Order ID: ${newOrder.orderID}`,
              icon: "/path/to/icon.png", // Optional: specify an icon for the notification
            });
          }

          // if (Notification.permission === "granted") {
          //   const audio = new Audio(notifisound); // Correct the path
          //   audio
          //     .play()
          //     .then(() => {
          //       new Notification("New Order", {
          //         body: `Order ID: ${newOrder.orderID}`,
          //         icon: "/path/to/icon.png", // Optional: specify an icon for the notification
          //       });
          //     })
          //     .catch((error) => {
          //       console.error("Error playing sound:", error);
          //     });
          // }
        }
      });
    });

    // Clean up the subscriptions when the component unmounts
    return () => {
      unsubscribeOrders();
    };
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     playSound();
  //   }, 3000);

  //   return () => clearInterval(interval);
  // });
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/categories"
          element={
            <Layout>
              <Categories />
            </Layout>
          }
        />
        <Route
          path="/orders"
          element={
            <Layout>
              <Orders />
            </Layout>
          }
        />
        <Route
          path="/tables"
          element={
            <Layout>
              <Users />
            </Layout>
          }
        />
        <Route
          path="/users"
          element={
            <Layout>
              <Users />
            </Layout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
