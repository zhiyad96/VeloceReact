

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
  const [productsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  const { addtocart, cart } = useContext(Cartcontext);
  const { wish, addtowish } = useContext(Wishcontext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, sortOption, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/product");
      setProducts(response.data);

      // Extract unique categories from products
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        (product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.catogory === selectedCategory);
    }

    // Sort options
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

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-25 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Our Products
      </h1>
      {/* Search, Sort & Categories */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Categories */}
        <div className="w-full sm:w-48 ">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl    dark:text-white"
          >
            <option className='rounded-2xl'value="all" >All Categories</option>
            {categories.map((catogory) => (
              <option  className='rounded-2xl' key={catogory} value={catogory}>
                {catogory}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="w-full sm:w-48">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg  dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="default">Default Sorting</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="name-a-z">Name: A to Z</option>
            <option value="name-z-a">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.id} className="group relative shadow-sm  ">
              {/* Wishlist */}
              <button onClick={() => addtowish(product)} className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform duration-200">
                {wish.some(item => item.id === product.id) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                )}
              </button>

              {/* Image */}
              <div className="relative h-70 sm:h-62 md:h-56 lg:h-60 p-7  " onClick={() => handleProductClick(product.id)}>
                <img src={product.image_url} alt={product.name} className="  w-50 h-50 object-cover items-center " />
                <div />
              </div>

              {/* Info */}
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 flex-1 mr-2">{product.name}</h2>
                  {product.in_stock ?(<div className="badge bg-blue-100 text-black dark:bg-gray-900  font-medium px-2 py-1 rounded-full">In Stock</div>)
                  :(<div className="badge bg-red-100 text-gray-800 dark:bg-gray-900  font-medium px-2 py-1 rounded-full">Out of Stock</div>)}
                </div>
                {product.catogory && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {product.catogory}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                </div>

                {/* Add to Cart / Buy Now */}
                {/* <div className="flex flex-col sm:flex-row gap-2 h-8 items-center-safe"> */}
                <div className="flex flex-col sm:flex-row gap-2  items-center-safe">
                  {cart.find(item => item.id === product.id) ? null : (
                    <button onClick={() => addtocart(product)}   className="flex-1 bg-gray-500 text-black py-0.5 sm:py-0.5 px-1 rounded-lg font-semibold shadow-md hover:scale-105 transition-all duration-200"
>
                      AddtoCart
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/shippingAdress", { state: { product } })}
                    className="flex-1 bg-gray-500  text-black  py-2 sm:py-0.5 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400">No products found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button onClick={prevPage} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' : 'bg-white text-black hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}`}>Previous</button>
          {pageNumbers.map(number => (
            <button key={number} onClick={() => goToPage(number)} className={`px-4 py-2 rounded-lg border ${currentPage === number ? 'bg-gray-600 text-black border-gray-600' : 'bg-white text-black hover:bg-gray-50 dark:bg-gray-700 dark:text-black dark:hover:bg-gray-600'}`}>{number}</button>
          ))}
          <button onClick={nextPage} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' : 'bg-white text-black hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}`}>Next</button>
 
        </div>


      )}
    </div>
  );
}











