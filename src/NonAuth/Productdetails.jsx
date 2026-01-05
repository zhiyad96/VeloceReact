

import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../service/api';
import { Cartcontext } from '../Context/Cartcontext';
import { Wishcontext } from '../Context/Wishlistcontext';
import Footer from '../pages/Footer'


function Productdetails() {
    const [product, setproduct] = useState({})
    const { id } = useParams();
    const { wish, addtowish } = useContext(Wishcontext)
    const { cart, increaseQty, decreaseQty, addtocart } = useContext(Cartcontext)
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get(`/product/${id}`)
                setproduct(res.data)
            } catch (err) {
                console.log(err.message)
            }
        }
        fetch();
    }, [id])


    const incart = cart.find((item) => item.id === product.id);

    return (
        <div className=" pt-25 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className=" overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">

                        {/* -------------image------------- */}
                        <div className="flex flex-col items-center">

                            <div className="w-full max-w-md  bg-gray-100 ">

                                <img
                                    src={product?.image_url}
                                    alt={product?.name}
                                    className="w-full h-full object-cover "
                                />
                            </div>


                        </div>

                        <div className="flex flex-col justify-center space-y-6">



                            <h1 className="text-3xl font-bold text-gray-900">
                                {product.name}
                            </h1>

                            {/* --------------price-------------- */}
                            <div className="flex items-center space-x-4">
                                <span className="text-2xl font-semibold text-green-600">
                                    ${product.price}
                                </span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="flex text-yellow-400">
                                    {'★'.repeat(5)}
                                </div>
                                <span className="text-gray-600">(4.8 • 120 reviews)</span>


                            </div>
                            <div>
                                <button onClick={() => addtowish(product)} className="bg-white btn  top-80 left-140">
                                    {wish.some((item) => item.id == product.id) ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <p className="text-gray-700 leading-relaxed">
                                {product?.description}
                            </p>

                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center space-x-4 bg-gray-100 rounded-lg p-3">
                                    {/* --------decrease--------- */}
                                    <button onClick={() => decreaseQty(incart.cartid)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors text-gray-700">
                                        <span className="text-lg font-semibold">-</span>
                                    </button>
                                    <span className="text-lg font-semibold" >{incart?.quantity}</span>
                                    {/* ---------increase---------- */}
                                    <button onClick={() => increaseQty(incart.cartid)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors text-gray-700">
                                        <span className="text-lg font-semibold">+</span>
                                    </button>
                                </div>

                                <div className="flex space-x-4 flex-1 py-1 ">
                                    {incart ? null : (<button onClick={() => addtocart(product)} className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold  shadow-md">
                                        Add to Cart
                                    </button>)}
                                    <button
                                        onClick={() => {
                                            navigate("/shippingAdress", {
                                                state: { product },
                                            });
                                        }}
                                        className="flex-1 bg-gray-600 text-black py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 hover:shadow-lg active:scale-95"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>


                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Free shipping</span>
                                    <span>30-day returns</span>
                                    <span>Secure checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <Footer />
        </div>
    )
}

export default Productdetails