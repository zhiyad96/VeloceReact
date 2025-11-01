import React, { useContext } from "react";
import { Wishcontext } from "../Context/Wishlistcontext";

function Wishlist() {
  const { wish, addtowish } = useContext(Wishcontext);

  if (!wish) return null;

  return (
    <div className="pt-25 min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text text-transparent mb-4">
            Your Wishlist
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {wish.length === 0
              ? "Your wishlist is empty. Start adding items you love!"
              : `You have ${wish.length} item${wish.length > 1 ? "s" : ""} in your wishlist`}
          </p>
        </div>

        {/* Wishlist Items */}
        {wish.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wish.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className="relative overflow-hidden h-60">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                  {/* Remove Button */}
                  <button
                    onClick={() => addtowish(product)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>

                  {product.price && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-3 py-2 rounded-2xl font-bold text-sm shadow-lg">
                        ₹{product.price}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {product.name}
                  </h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4"></div>
                  <p className="text-gray-600 leading-relaxed line-clamp-3 text-sm mb-6">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-lg border border-white/60">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Your Wishlist is Empty
              </h3>
              <p className="text-gray-600 mb-6">
                Start exploring our collection and add items you'd love to save for later.
              </p>
              <button className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0">
                Start Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
