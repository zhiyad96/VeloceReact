

import React, { useEffect, useState, useRef } from "react";
import { api } from "../../service/api";
import { useNavigate } from "react-router-dom";

export default function Card() {
  const [product, setProduct] = useState([]);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const fill = product.slice(0, 10);

  useEffect(() => {
    api
      .get("/product")
      .then((res) => setProduct(res.data.slice(0, 15)))
      .catch((err) => console.log(err.message));
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth < 768 ? 240 : 280;
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth < 768 ? 240 : 280;
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  return (
    <section className="py-4 sm:py-6 md:py-12 lg:py-16 bg-gradient-to-br from-gray-50 via-white to-red-50/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-xl md:rounded-2xl bg-gray-500/80 backdrop-blur-xl border border-white/20 shadow-2xl mb-3 sm:mb-4 md:mb-6">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-white rounded-full animate-pulse shadow-lg"></div>
            <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">EXCLUSIVE COLLECTION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-gray-900 via-black to-gray-900 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6 leading-tight">
            Luxury Redefined
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed font-light px-2 sm:px-4">
            Immerse yourself in our curated selection of premium products, where exceptional quality meets sophisticated design
          </p>
        </div>

        {/* Main Cards */}
        <div className="relative">
          <button onClick={scrollLeft} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-20 bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl w-10 h-10 lg:w-12 lg:h-12 items-center justify-center shadow-2xl">
            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button onClick={scrollRight} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-20 bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl w-10 h-10 lg:w-12 lg:h-12 items-center justify-center shadow-2xl">
            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="flex md:hidden justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <button onClick={scrollLeft} className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={scrollRight} className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div ref={scrollContainerRef} className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-3 sm:pb-4 md:pb-6 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {product.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-56 sm:w-64 md:w-72 lg:w-80 snap-center h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px]"
                onClick={() => navigate("/product")}
              >
                <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 overflow-hidden h-full flex flex-col rounded-2xl cursor-pointer">
                  {/* Image */}
                  <div className="relative overflow-hidden h-32 sm:h-36 md:h-44 lg:h-56 bg-gray-100/50">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <span className="text-white bg-gray-500/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-semibold border border-white/30">
                        PREMIUM
                      </span>
                    </div>
                    <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                      <span className="bg-white/90 backdrop-blur-md text-gray-900 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl font-bold text-sm sm:text-base border border-white/60">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-3 sm:p-4 md:p-6 flex-1 flex flex-col min-h-0">
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-3 line-clamp-2 leading-tight">
                      {item.name}
                    </h3>
                    <div className="w-10 sm:w-12 md:w-16 h-0.5 md:h-1 bg-gray-600 rounded-full mb-1 sm:mb-2 md:mb-3"></div>

                    <button className="mt-auto w-full bg-gray-600/90 backdrop-blur-md text-white py-2 rounded-xl font-semibold text-sm border border-white/20">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Cards Section */}
        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16">
          <div className="text-center mb-4 sm:mb-5 md:mb-6 lg:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Featured Selection</h3>
            <div className="w-6 h-0.5 sm:w-8 sm:h-0.5 md:w-12 md:h-1 bg-gray-500 rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {fill.map((f) => (
              <div key={f.id} className="bg-white/80 backdrop-blur-xl border border-white/30 p-2 sm:p-3 md:p-4 shadow-2xl rounded-2xl cursor-pointer">
                <div className="relative overflow-hidden mb-1 sm:mb-2 md:mb-3 rounded-xl">
                  <img src={f.image_url} alt={f.name} className="w-full h-20 sm:h-24 md:h-28 lg:h-32 object-cover" />
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{f.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-black font-bold text-xs sm:text-sm md:text-base">₹{f.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
