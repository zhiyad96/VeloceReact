

import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./pages/Navbar";
import Home from "./NonAuth/Home";
import Login from "./Auth/login";
import Registration from "./Auth/registration";
import Product from "./NonAuth/Product";
import Cart from "./NonAuth/Cart";
import Productdetails from "./NonAuth/Productdetails";
import Wishlist from "./NonAuth/Wishlist";
import About from "./pages/About";

import Authprovider from "./Context/Authcontext";
import Cartprovider from "./Context/Cartcontext";
import Wishlistprovider from "./Context/Wishlistcontext";
import { 
  ProtectedRoute, 
  AdminProtectedRoute, 
  PublicUserRoute, 
  PublicNoAdmin 
} from "./NonAuth/ProtectRoute";

import OrederHistory from "./NonAuth/order/OrederHistory";
import ShippingAdress from "./NonAuth/order/shippingAdress";

// --------------admin----------------------
import Dashboard from "./admin/pages/Admindashboard";
import Users from "./admin/pages/users";
import Orders from "./admin/pages/orders";
import Products from "./admin/pages/Products";


function LayoutWrapper() {
  const location = useLocation();

  
  const hideNavbar =
    location.pathname.startsWith("/Admindashboard") ||
    location.pathname==="/users"||
    location.pathname==="/orders"||
    location.pathname==="/products"||
    location.pathname === "/login" ||
    location.pathname === "/registration";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ----------------- Public pages (block admins only) ----------------- */}
        <Route path="/" element={<PublicNoAdmin><Home /></PublicNoAdmin>} />
        <Route path="/product" element={<PublicNoAdmin><Product /></PublicNoAdmin>} />
        <Route path="/product/:id" element={<PublicNoAdmin><Productdetails /></PublicNoAdmin>} />
        <Route path="/about" element={<PublicNoAdmin><About /></PublicNoAdmin>} />

        {/* ----------------- Login/Register (block logged-in users/admins) ----------------- */}
        <Route path="/login" element={<PublicUserRoute><Login /></PublicUserRoute>} />
        <Route path="/registration" element={<PublicUserRoute><Registration /></PublicUserRoute>} />

        {/* ----------------- User-only protected routes ----------------- */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/OrederHistory" element={<ProtectedRoute><OrederHistory /></ProtectedRoute>} />
        <Route path="/shippingAdress" element={<ProtectedRoute><ShippingAdress /></ProtectedRoute>} />

        {/* ----------------- Admin-only route ----------------- */}
        <Route path="/Admindashboard/*" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
        <Route path="/users/*" element={<AdminProtectedRoute><Users/></AdminProtectedRoute>} />
        <Route path="/orders/*" element={<AdminProtectedRoute><Orders/></AdminProtectedRoute>} />
        <Route path="/Products/*" element={<AdminProtectedRoute><Products/></AdminProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Authprovider>
          <Cartprovider>
            <Wishlistprovider>
              <LayoutWrapper />
            </Wishlistprovider>
          </Cartprovider>
        </Authprovider>
      </BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
