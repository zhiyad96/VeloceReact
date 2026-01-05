

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function Hero() {
//     const navigate = useNavigate();

//     // List of background images
//     const images = [
       
//         "https://i.pinimg.com/1200x/45/a9/be/45a9bee47ebf676c88b405208093c2c8.jpg",
//     ];

//     const [bgIndex, setBgIndex] = useState(0);

//     // Change background every 5 seconds
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setBgIndex((prev) => (prev + 1) % images.length);
//         }, 5000);
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div
//             className="hero min-h-screen relative overflow-hidden transition-all duration-1000"
//             style={{
//                 backgroundImage: `url(${images[bgIndex]})`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 transition: "background-image 1s ease-in-out",
//             }}
//         >
          
//             {/* Animated grid overlay */}
//             <div className="absolute inset-0 opacity-10">
//                 <div
//                     className="w-full h-full"
//                     style={{
//                         backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.4) 1px, transparent 1px),
//                                          linear-gradient(90deg, rgba(239, 68, 68, 0.4) 1px, transparent 1px)`,
//                         backgroundSize: '60px 60px',
//                     }}
//                 ></div>
//             </div>

//             {/* Animated accent elements */}
//             <div className="absolute top-20 left-10 w-32 h-32 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
//             <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

//             {/* Hero content */}
//             <div className="pt-15 hero-content text-neutral-content text-center relative z-10">
//                 <div className="max-w-md mx-auto">
//                     {/* Premium badge */}
                  

//                     {/* Main heading */}
//                     <h1 className="mb-6 text-white text-6xl font-black tracking-tight leading-tight animate-slideUp">
//                         <span className="inline-block bg-gradient-to-r bg-white bg-clip-text text-transparent drop-shadow-2xl">
//                             Veloce Garage
//                         </span>
//                         <br />
//                     </h1>

//                     {/* Description */}
//                     <p className="mb-8 text-gray-200 text-lg leading-relaxed animate-slideUp px-4" style={{ animationDelay: '0.2s' }}>
//                         Veloce Garage blends <span className="text-white font-semibold">precision</span>, <span className="text-white font-semibold">passion</span>, and <span className="text-white font-semibold">performance</span> to deliver expert automotive care. From maintenance to tuning, we ensure every ride runs flawlessly and looks stunning on every road.
//                     </p>

//                     {/* Feature pills */}
//                     <div className="flex flex-wrap justify-center gap-3 mb-8 animate-slideUp" style={{ animationDelay: '0.3s' }}>
//                         <div className="px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
//                             <span className="text-gray-300 text-sm">⚡ Expert Service</span>
//                         </div>
//                         <div className="px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
//                             <span className="text-gray-300 text-sm">🔧 Performance Tuning</span>
//                         </div>
//                         <div className="px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
//                             <span className="text-gray-300 text-sm">✨ Premium Care</span>
//                         </div>
//                     </div>

//                     {/* Explore button */}
//                     <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
//                         <button
//                             onClick={() => navigate("/product")}
//                             className="btn text-white hover:bg-gray-900 border-gray-700 bg-gray-600 px-8 py-4 text-lg font-bold rounded-xl shadow-2xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 transition-all duration-300 relative overflow-hidden group"
//                         >
//                             <span className="relative z-10 flex items-center gap-2">
//                                 Explore
//                                 <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                                 </svg>
//                             </span>
//                         </button>
//                     </div>

//                     {/* Scroll indicator */}
//                     <div className="mt-16 animate-bounce">
//                         <div className="inline-block w-6 h-10 border-2 border-white/30 rounded-full p-1">
//                             <div className="w-1.5 h-3 bg-red-600 rounded-full mx-auto animate-scroll"></div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Custom animations */}
//             <style>
//                 {`
//                 @keyframes fadeIn {
//                     from { opacity: 0; transform: translateY(-20px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }

//                 @keyframes slideUp {
//                     from { opacity: 0; transform: translateY(40px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }

//                 @keyframes scroll {
//                     0% { transform: translateY(0); opacity: 1; }
//                     100% { transform: translateY(12px); opacity: 0; }
//                 }

//                 .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
//                 .animate-slideUp { animation: slideUp 0.8s ease-out forwards; opacity: 0; }
//                 .animate-scroll { animation: scroll 1.5s ease-in-out infinite; }
//                 `}
//             </style>
//         </div>
//     );
// }






import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate();

    const images = [
        "https://i.pinimg.com/1200x/45/a9/be/45a9bee47ebf676c88b405208093c2c8.jpg",
    ];

    const [bgIndex, setBgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="hero min-h-screen relative overflow-hidden transition-all duration-1000"
            style={{
                backgroundImage: `url(${images[bgIndex]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "background-image 1s ease-in-out",
            }}
        >
            {/* Animated grid overlay */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.4) 1px, transparent 1px),
                                         linear-gradient(90deg, rgba(239, 68, 68, 0.4) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                ></div>
            </div>

            {/* Animated accent elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Hero content */}
            <div className="pt-20 hero-content text-neutral-content text-center relative z-10 px-4 sm:px-6 md:px-10 lg:px-0">
                <div className="max-w-3xl mx-auto">
                    {/* Main heading */}
                    <h1 className="mb-6 text-white font-black tracking-tight leading-tight animate-slideUp text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                        <span className="inline-block bg-gradient-to-r bg-white bg-clip-text text-transparent drop-shadow-2xl">
                            Veloce Garage
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="mb-8 text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed animate-slideUp px-2 sm:px-4 md:px-0" style={{ animationDelay: '0.2s' }}>
                        Veloce Garage blends <span className="text-white font-semibold">precision</span>, <span className="text-white font-semibold">passion</span>, and <span className="text-white font-semibold">performance</span> to deliver expert automotive care. From maintenance to tuning, we ensure every ride runs flawlessly and looks stunning on every road.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                        <div className="px-3 sm:px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm sm:text-base">
                            ⚡ Expert Service
                        </div>
                        <div className="px-3 sm:px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm sm:text-base">
                            🔧 Performance Tuning
                        </div>
                        <div className="px-3 sm:px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm sm:text-base">
                            ✨ Premium Care
                        </div>
                    </div>

                    {/* Explore button */}
                    <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
                        <button
                            onClick={() => navigate("/product")}
                            className="btn text-white hover:bg-gray-900 border-gray-700 bg-gray-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg md:text-xl font-bold rounded-xl shadow-2xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Explore
                                <svg className="w-4 sm:w-5 h-4 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    {/* Scroll indicator */}
                    <div className="mt-12 sm:mt-16 animate-bounce">
                        <div className="inline-block w-5 sm:w-6 h-8 sm:h-10 border-2 border-white/30 rounded-full p-1">
                            <div className="w-1 h-2 sm:w-1.5 sm:h-3 bg-red-600 rounded-full mx-auto animate-scroll"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom animations */}
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes scroll {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(12px); opacity: 0; }
                }

                .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
                .animate-slideUp { animation: slideUp 0.8s ease-out forwards; opacity: 0; }
                .animate-scroll { animation: scroll 1.5s ease-in-out infinite; }
                `}
            </style>
        </div>
    );
}
