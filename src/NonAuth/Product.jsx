

import React, { useContext, useEffect, useState } from 'react';
import { api } from '../service/api';
import { Cartcontext } from '../Context/Cartcontext';
import { Authcontext } from '../Context/Authcontext';
import { useNavigate } from 'react-router-dom';
import { Wishcontext } from '../Context/Wishlistcontext';
import toast from 'react-hot-toast';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm") || '');
  const [sortOption, setSortOption] = useState(localStorage.getItem("sortOption") || 'default');
  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem("selectedCategory") || 'all');
  const [categories, setCategories] = useState([]);

  const { addtocart, cart } = useContext(Cartcontext);
  const { wish, addtowish } = useContext(Wishcontext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
    localStorage.setItem("sortOption", sortOption);
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [searchTerm, sortOption, selectedCategory]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, sortOption, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/product");
      setProducts(response.data);
      const uniqueCategories = [...new Set(response.data.map(product => product.catogory))].filter(Boolean);
      setCategories(uniqueCategories);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        (product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.catogory === selectedCategory);
    }

    switch (sortOption) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-a-z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleProductClick = (productId) => navigate(`/product/${productId}`);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 pt-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Products</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our premium products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex align-middle pointer-events-none">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-7 pl-10 pr-4  border border-gray-300 rounded-full focus:ring-1 focus:ring-gray-800 focus:border-transparent text-gray-700"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-7 px-4  border border-gray-300 rounded-full appearance-none focus:ring-1 focus:gray-800 focus:border-transparent text-gray-700"
            >
              <option value="all" >All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full h-7 px-4 border border-gray-300 rounded-full appearance-none focus:ring-1 focus:ring-gray-800 focus:border-transparent text-gray-700"
            >
              <option value="default">Default Sorting</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-a-z">Name: A to Z</option>
              <option value="name-z-a">Name: Z to A</option>
            </select>
          </div>
        </div>

       

        {/* Simplified Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12 mt-10">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white shadow-2xl border border-gray-200 overflow-hidden  transition-shadow"
              >
                <div 
                  className="relative h-48 bg-gray-100 cursor-pointer" 
                  onClick={() => handleProductClick(product.id)}
                >
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addtowish(product);
                      toast.success(wish.some(item => item.id === product.id) ? 'Removed from wishlist' : 'Added to wishlist');
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-50"
                  >
                    {wish.some(item => item.id === product.id) ? (
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="p-4">
                  <h3 
                    onClick={() => handleProductClick(product.id)}
                    className="text-lg font-medium text-gray-900 mb-1 cursor-pointer  line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  
                  

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {!product.in_stock && (
                      <span className="text-xs text-red-600 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {cart.find(item => item.id === product.id) ? (
                      <button
                        onClick={() => navigate('/cart')}
                        className="flex-1 bg-gray-600/90 text-white h-7 rounded-lg text-sm font-medium"
                      >
                        In Cart
                      </button>
                    ) : (
                      <button
                        onClick={() => addtocart(product)}
                        className="flex-1 bg-gray-600/90 text-white h-7 rounded-lg text-sm font-medium"
                      >
                        Add to Cart
                      </button>
                    )}
                    <button
                      onClick={() => navigate("/shippingAdress", { state: { product } })}
                      className="flex-1 bg-gray-600/90 h-7 text-white  rounded-lg text-sm font-medium"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (null)}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center  space-y-4 sm:space-y-0">
           
            <div className="flex items-center space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 h-7 rounded-lg border ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600/90 text-white '
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => goToPage(number)}
                    className={`w-5 h-7 rounded-lg ${
                      currentPage === number
                        ? 'bg-gray-600/90 text-white'
                        : 'bg-gray-600/90 text-white'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-4 h-7 rounded-lg border ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600/90 text-white'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}