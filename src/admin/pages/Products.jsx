

import React, { useContext, useEffect, useState } from "react";
import { Edit2, Trash2, Plus, X, AlertTriangle } from "lucide-react";
import { api } from "../../service/api";
import toast from "react-hot-toast";
import Sidebar from "../components/side";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ 
    name: "", 
    price: "", 
    image_url: "",
    catogory: "",
    description: "",
    in_stock: true,
    brand: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const [addModal, setaddModal] = useState({ isOpen: false, product: null });

  // ---------------- Fetch Products ----------------
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/product");
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //  ---------------- Add Product ----------------
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Name and price are required!");
      return;
    }
    try {
      const res = await api.post("/product", newProduct);
      setProducts([ res.data,...products]);
      toast.success("Product added successfully!");
      setNewProduct({ 
        name: "", 
        price: "", 
        image_url: "",
        catogory: "",
        description: "",
        in_stock: true,
        brand: ""
      });
      setShowAddForm(false);
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  // ---------------- Edit Product ----------------
  const handleSaveEdit = async () => {
    if (!editProduct.name || !editProduct.price) {
      toast.error("Name and price are required!");
      return;
    }
    try {
      await api.patch(`/product/${editProduct.id}`, editProduct);
      setProducts(products.map((p) => (p.id === editProduct.id ? editProduct : p)));
      toast.success("Product updated successfully!");
      setEditProduct(null);
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  // ---------------- Delete Product ----------------
  const handleDelete = async (id) => {
    try {
      await api.delete(`/product/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully!");
      setDeleteModal({ isOpen: false, product: null });
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  // ---------------- Open Delete Modal ----------------
  const openDeleteModal = (product) => {
    setDeleteModal({ isOpen: true, product });
  };


   const openaddteModal = (product) => {
    setaddModal({ isOpen: true, product });
  };

  const closeaddModal = () => {
    setaddModal({ isOpen: false, product: null });
  };

  // ---------------- Close Delete Modal ----------------
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, product: null });
  };

  // ---------------- UI Rendering ----------------
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <Sidebar />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Products
            </h1>
            <p className="text-gray-600 mt-2">Manage your product inventory</p>
          </div>
          <button
            onClick={openaddteModal}
            className="flex items-center gap-2 bg-gradient-to-r bg-white text-black px-6 py-3 hover:transition-all duration-300 shadow-lg  hover:shadow-xl hover:scale-105"
          >
            <Plus size={20} />
            <span className="font-medium">Add Product</span>
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="mb-6 bg-white p-6 shadow-xl border border-slate-200 ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Add New Product</h2>
              <button onClick={openaddteModal} className="text-gray-400 hover:text-gray-600 transition">
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              />
              <input
                type="text"
                placeholder="Image URL"
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
              />
              <input
                type="text"
                placeholder="Product Category"
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={newProduct.catogory}
                onChange={(e) => setNewProduct({ ...newProduct, catogory: e.target.value })}
              />
              <input
                type="text"
                placeholder="Product Description"
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Product Brand"
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
              />
            </div>
            <button
              onClick={openaddteModal}
              className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/30 font-medium"
            >
              Add Product
            </button>
          </div>
        )}

        {/* Products Table */}
        {products.length === 0 ? (
          <div className="bg-white shadow-lg p-12 text-center ">
            <div className="w-24 h-24 bg-slate-100  flex items-center justify-center mx-auto mb-4">
              <Plus size={48} className="text-slate-400" />
            </div>
            <p className="text-gray-500 text-lg">No products available. Add your first product!</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl overflow-hidden border border-slate-200 ">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 bg-gradient-to-r bg-gray-400 text-black p-4 font-semibold">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-2">Image</div>
              <div className="col-span-4">Product Name</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-3 text-center">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-200">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-50 transition-colors duration-200 items-center"
                >
                  <div className="col-span-1 text-center font-medium text-slate-600">{index + 1}</div>
                  <div className="col-span-2">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-20 h-20 object-cover"
                    />
                  </div>
                  <div className="col-span-4">
                    <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>
                  </div>
                  <div className="col-span-2">
                    <span className="text-lg font-bold text-slate-700">₹{product.price}</span>
                  </div>
                  <div className="col-span-3 flex justify-center gap-3">
                    <button
                      onClick={() => setEditProduct(product)}
                      className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <Edit2 size={16} />
                      
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="flex items-center gap-2  opacity-60 text-red-600 px-4 py-2 rounded-lg hover:transition-all duration-300  hover:scale-105"
                    >
                      <Trash2 size={16} />
                    
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Edit Product</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="border border-slate-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="border border-slate-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  className="border border-slate-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={editProduct.image_url}
                  onChange={(e) => setEditProduct({ ...editProduct, image_url: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="catogory"
                  className="border border-slate-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={editProduct.catogory}
                  onChange={(e) => setEditProduct({ ...editProduct, catogory: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="brand"
                  className="border border-slate-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={editProduct.brand}
                  onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditProduct(null)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Delete Product</h2>
                <p className="text-gray-600">
                  Are you sure you want to delete <strong>"{deleteModal.product?.name}"</strong>? 
                  This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={closeDeleteModal}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.product?.id)}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/30 font-medium"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {addModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
              {/* <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">add Product</h2>
                <p className="text-gray-600">
                  Are you sure you want to add <strong>"{addModal.product?.name}"</strong>? 
                  This action cannot be undone.
                </p>
              </div> */}
              
                <div>
                  <div className="flex flex-col gap-2">
                      <input
                type="text"
                placeholder="Product Name"
                className="  border border-slate-300 p-3  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
                <input
                type="text"
                placeholder="Product Name"
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price:Number( e.target.value) })}
              />
               <input
                type="text"
                placeholder="Image URL"
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
              />
               <input
                type="text"
                placeholder="Product Category"
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={newProduct.catogory}
                onChange={(e) => setNewProduct({ ...newProduct, catogory: e.target.value })}
              />
              <input
                type="text"
                placeholder="Product Description"
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Product Brand"
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
              />
              
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={closeaddModal}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddProduct(addModal.product?.id)}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/30 font-medium"
                >
                  Yes, add
                </button>
              </div>
              </div>
                  </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}















