
import React, { useEffect, useState } from "react";
import Sidebar from "../components/side";
import { api } from "../../service/api";
import { Trash2, Filter, TrendingUp, Package, CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("all");

  // ---------------------fetch the orders--------------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/users");
        const users = res.data;

      
        const allOrders = users.flatMap((user) =>
          (user.orders || []).map((order) => ({
            id: order.id,
            status: order.status,
            userId: user.id,
            userName: user.name || user.email,
            products: order.items || [],
            createdAt: order.date || new Date().toISOString(),
            total: order.items?.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) || 0
          }))
        );

        setOrders(allOrders);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Delete order
  const handleRemoveOrder = async (orderId) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const userRes = await api.get(`/users/${order.userId}`);
      const user = userRes.data;

      const updatedOrders = user.orders.filter((o) => o.id !== orderId);
      await api.put(`/users/${order.userId}`, { ...user, orders: updatedOrders });

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success("Order cancelled successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove order");
    }
  };

  // -------------------------change the status --------------
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const userRes = await api.get(`/users/${order.userId}`);
      const user = userRes.data;

      const updatedOrders = user.orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      );
      await api.put(`/users/${order.userId}`, { ...user, orders: updatedOrders });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // ----------------------filtred--------------------------
  const filteredOrders = orders.filter(order => {
    if (statusFilter === "All") return true;
    return order.status === statusFilter;
  });

  
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  
  const statusDistribution = [
    { name: 'Pending', value: orders.filter(o => o.status === 'Pending').length, color: '#F59E0B' },
    { name: 'Confirmed', value: orders.filter(o => o.status === 'Confirmed').length, color: '#3B82F6' },
    { name: 'Shipping', value: orders.filter(o => o.status === 'Shipping').length, color: '#8B5CF6' },
    { name: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, color: '#10B981' },
  ];

  // -------------------------------for daily chart-------------------
  const getDailyOrdersData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse();

    return last7Days.map(day => {
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        return orderDate === day;
      });
      return {
        day,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.total, 0)
      };
    });
  };

  const dailyOrdersData = getDailyOrdersData();

  // ----------------------sttusicon-----------------------
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={16} className="text-yellow-600" />;
      case 'Confirmed': return <CheckCircle size={16} className="text-blue-600" />;
      case 'Shipping': return <Truck size={16} className="text-indigo-600" />;
      case 'Delivered': return <CheckCircle size={16} className="text-green-600" />;
      default: return <Package size={16} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-2">Manage customer orders and track order status</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {orders.filter(o => o.status === 'Delivered').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Orders Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Orders Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyOrdersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Filters and Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipping">Shipping</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="py-3 px-4 rounded-l-lg">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Products</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 rounded-r-lg text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => {
                    const totalQuantity = order.products.reduce((sum, p) => sum + (p.quantity || 0), 0);

                    return (
                      <tr key={order.id} className="border-b hover:bg-gray-50 transition-all duration-200">
                        <td className="py-4 px-4 font-medium text-gray-800">
                          #{order.id.toString().slice(-6)}
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{order.userName}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="max-w-xs">
                            {order.products.map((p, idx) => (
                              <div key={idx} className="text-sm mb-1 last:mb-0">
                                <span className="font-medium">{p.name}</span>
                                <span className="text-gray-500 ml-2">
                                  x{p.quantity} · ${p.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 px-4 font-medium">{totalQuantity}</td>
                        <td className="py-4 px-4 font-bold text-green-600">${order.total.toFixed(2)}</td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`border-0 rounded-lg px-3 py-1 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-opacity-50
                                ${
                                  order.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-700 focus:ring-yellow-500"
                                    : order.status === "Confirmed"
                                    ? "bg-blue-100 text-blue-700 focus:ring-blue-500"
                                    : order.status === "Shipping"
                                    ? "bg-indigo-100 text-indigo-700 focus:ring-indigo-500"
                                    :"bg-red-100 text-red-700 focus:ring-red-500"
                                   
                                }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipping">Shipping</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleRemoveOrder(order.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                            title="Delete Order"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}