// App.js
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
import { auth, db } from "./firebaseConfig"; // Import Firestore and Auth
import Categories from "./pages/category/categories";
import Dashboard from "./pages/dashboard/dashboard";
// import NotFound from "./pages/NotFound";
import { Howl } from "howler";
import notifisound from "./assets/notification.mp3";
import LocationPage from "./pages/location/location";
import Offers from "./pages/offers/offers";
import Orders from "./pages/orders/orders";
import Tables from "./pages/tables/tables";
import Users from "./pages/users/user";
import Auth from "./pages/auth/login";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSuperAdmin,
  updateHotelData,
  updateHotelID,
} from "./redux/reducers/authSlice";
import HotelManagement from "./pages/hotel/hotel";
import CompleteRegistration from "./pages/completeRegistraton/completeRegistration";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const hotelID = useSelector((state) => state.auth.hotelID);
  console.log(hotelID);
  const dispatch = useDispatch();
  const sound = new Howl({
    src: [notifisound],
    volume: 1,
  });

  const playSound = () => {
    sound.play();
  };

  useEffect(() => {
    // Listen for authentication state changes
    // Listen for authentication state changes
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setLoading(false);
      dispatch(updateHotelID(user.uid));
      if (user?.uid == "phZSUmRR7LZYvlVeIl3TT4IVTSs2") {
        setIsSuperAdmin(true);
        dispatch(updateSuperAdmin(true));
      } else {
        setIsSuperAdmin(false);
        dispatch(updateSuperAdmin(false));
      }
    });
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
            const notification = new Notification("New Order", {
              body: `Order ID: ${newOrder.orderID}`,
              icon: "/path/to/icon.png", // Optional: specify an icon for the notification
            });
            notification.onclick = () => {
              window.open("http://localhost:3000/orders", "_blank"); // Open a new tab to localhost
            };
          }
        }
      });
    });

    // Clean up the subscriptions when the component unmounts
    return () => {
      unsubscribeOrders();
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const hotelRef = collection(db, "hotels");
      const unsubscribeHotel = onSnapshot(hotelRef, (snap) => {
        const data = snap.docs.map((x) => ({
          ...x.data(),
        }));
        if (isSuperAdmin) {
          dispatch(
            updateHotelData(data.filter((x) => x?.uid === hotelID[0].id))
          );
        } else {
          dispatch(updateHotelData(data.filter((x) => x?.uid === user?.uid)));
        }
      });
      return () => {
        unsubscribeHotel();
      };
    }
  }, [user, hotelID]);

  console.log(user?.uid);
  // Protected Route Component
  const ProtectedRoute = ({ element }) => {
    if (loading) {
      return null; // Optionally, render a loading spinner here
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
        {isSuperAdmin && (
          <Route
            path="/hotels"
            element={
              <ProtectedRoute
                element={
                  <Layout>
                    <HotelManagement />
                  </Layout>
                }
              />
            }
          />
        )}

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
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;

// const generateRandomColor = () => {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };
