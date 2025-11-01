

import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Authcontext } from "../../Context/Authcontext";
import toast from "react-hot-toast";

export default function ShippingAddress() {
  const navigate = useNavigate();
  const location = useLocation();
  const { placeOrder, user } = useContext(Authcontext);

  
  const buyNowProduct = location.state?.product || null;

  
  const [itemsToCheckout, setItemsToCheckout] = useState(
    buyNowProduct ? [buyNowProduct] : user?.cart || []
  );

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  
  useEffect(() => {
    if (!buyNowProduct) setItemsToCheckout(user?.cart || []);
  }, [user?.cart, buyNowProduct]);

  if (itemsToCheckout.length === 0) {
    return <div className="p-4 text-center">Your cart is empty!</div>;
  }

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter your shipping address!");
      return;
    }

    try {
      await placeOrder({ product: buyNowProduct, address, paymentMethod });
      toast.success("Order placed successfully!");
      navigate("/OrederHistory");
    } catch (err) {
      console.log(err);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
        <textarea
          className="border p-2 w-full rounded"
          placeholder="Enter your complete address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={4}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="Online"
              checked={paymentMethod === "Online"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Online Payment
          </label>
        </div>
      </div>

      <button
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        onClick={handlePlaceOrder}
      >
        Place Order
      </button>
    </div>
  );
}
