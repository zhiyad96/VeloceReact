

import React, { useContext, useState } from 'react';
import { Cartcontext } from '../Context/Cartcontext';
import { Authcontext } from '../Context/Authcontext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Cart() {
    const navigate = useNavigate();
    const { cart, removecart, increaseQty, decreaseQty } = useContext(Cartcontext);
    const { placeOrder, user } = useContext(Authcontext);

    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // -----------------Checkout state-----------------
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');

   const handleCheckout = async () => {
    if (!address.trim()) {
        toast.error("Please enter your shipping address!");
        return;
    }

    if (!user?.cart?.length) { 
        toast.error("Cart is empty!");
        return;
    }

    try {
        await placeOrder({ address, paymentMethod }); 
        toast.success("Checkout successful!");
        navigate("/OrederHistory");
    } catch (err) {
        console.log(err);
        toast.error("Checkout failed. Try again!");
    }
};


    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <span className="text-lg text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
                </div>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                            <Link to="/product" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                Explore Products
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:flex-1">
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                {cart.map((item) => (
                                    <div key={item.cartid} className="border-b border-gray-100 last:border-b-0">
                                        <div className="p-6 flex flex-col sm:flex-row gap-4">
                                            <img src={item.image_url} alt={item.name} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg" />
                                            <div className="flex-grow flex flex-col">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                                                <div className="flex items-center gap-4 mt-auto">
                                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                                        <button onClick={() => decreaseQty(item.cartid)} className="px-4 text-gray-600">-</button>
                                                        <span className="px-4 py-2 text-gray-900 font-medium">{item.quantity}</span>
                                                        <button onClick={() => increaseQty(item.cartid)} className="px-4 text-gray-600">+</button>
                                                    </div>
                                                    <div className="text-lg text-gray-600 font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                                                    <button onClick={() => removecart(item.cartid)} className="text-red-600 hover:text-red-700">Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ----------------Order Summary---------------- */}
                        <div className="lg:w-80">
                            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                                
                                <div className="mb-4">
                                    <label className="block mb-1 font-semibold text-gray-600">Shipping Address</label>
                                    <textarea 
                                        className="border p-2 w-full rounded text-gray-600" 
                                        rows={3} 
                                        value={address} 
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-1 font-semibold text-gray-600">Payment Method</label>
                                    <select 
                                        className="border p-2 w-full rounded  text-gray-600" 
                                        value={paymentMethod} 
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <option value="COD">Cash on Delivery</option>
                                        <option value="Online">Online Payment</option>
                                    </select>
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Total</span>
                                    <span className="text-lg font-semibold text-gray-900">${total.toFixed(2)}</span>
                                </div>

                                <button onClick={handleCheckout} className="w-full bg-gray-600/90 text-white py-4 px-6 rounded-lg font-semibold  mb-4">
                                    Proceed to Checkout
                                </button>

                                <Link to="/product" className="w-full border border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 block text-center">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
