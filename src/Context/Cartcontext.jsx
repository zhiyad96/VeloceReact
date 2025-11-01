

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../service/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Authcontext } from './Authcontext';

export const Cartcontext = createContext();

function Cartprovider({ children }) {
  const [cart, setCart] = useState([]);
  const { user, setuser } = useContext(Authcontext);
  const [cartlength, setCartLength] = useState(0);
  const navigate = useNavigate();

  // ------------------------------------------renderpage-----------------------------------
  useEffect(() => {
    if (user?.id) {
      setCart(user.cart || []);
      setCartLength(user.cart?.length || 0);
    } else {
      setCart([]);
      setCartLength(0);
    }
  }, [user]);

  // ---------------- Add to cart ----------------
  const addtocart = async (product) => {
    if (!user?.id) {
      toast.error("Please log in to add items to cart");
      navigate("/login");
      return;
    }

    const existing = cart.find(item => item.id === product.id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity ) + 1 }
          : item
      );
    } else {
      const productWithId = { ...product, cartid: `${product.id}-${Date.now()}`, quantity: 1 };
      updatedCart = [...cart, productWithId];
    }

    const updatedUser = { ...user, cart: updatedCart };
    setuser(updatedUser);
    setCart(updatedCart);
    setCartLength(updatedCart.length);

    try {
      await api.patch(`/users/${user.id}`, { cart: updatedCart });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Cart updated successfully");
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to update cart");
    }
  };

  // ---------------- Quantity ----------------
  const updateQty = async (cartid, delta) => {
    if (!user?.id) return;

    const updatedCart = cart.map(item =>
      item.cartid === cartid
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );

    const updatedUser = { ...user, cart: updatedCart };
    setuser(updatedUser);
    setCart(updatedCart);
    setCartLength(updatedCart.length);

    try {
      await api.patch(`/users/${user.id}`, { cart: updatedCart });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Quantity updated");
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to update quantity");
    }
  };

  const increaseQty = (cartid) => updateQty(cartid, 1);
  const decreaseQty = (cartid) => updateQty(cartid, -1);

  // ---------------- Remove from cart ----------------
  const removecart = async (cartid) => {
    if (!user?.id) return;

    const updatedCart = cart.filter(item => item.cartid !== cartid);
    const updatedUser = { ...user, cart: updatedCart };
    setuser(updatedUser);
    setCart(updatedCart);
    setCartLength(updatedCart.length);

    try {
      await api.patch(`/users/${user.id}`, { cart: updatedCart });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Item removed from cart");
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to remove item");
    }
  };

  return (
    <Cartcontext.Provider value={{
      cart,
      cartlength,
      setCart,
      addtocart,
      removecart,
      increaseQty,
      decreaseQty
    }}>
      {children}
    </Cartcontext.Provider>
  );
}

export default Cartprovider;
