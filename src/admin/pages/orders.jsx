

// import React, { useEffect, useState } from "react";
// import Sidebar from "../components/side";
// import { api } from "../../service/api";
// import {
//   Trash2,
//   Filter,
//   TrendingUp,
//   Package,
//   CheckCircle,
//   Clock,
//   Truck,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState("All");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await api.get("/users");
//         const users = res.data;
//         const allOrders = users.flatMap((user) =>
//           (user.orders || []).map((order) => ({
//             id: order.id,
//             status: order.status,
//             userId: user.id,
//             userName: user.name || user.email,
//             products: order.items || [],
//             createdAt: order.date || new Date().toISOString(),
//             total:
//               order.items?.reduce(
//                 (sum, item) => sum + item.price * (item.quantity || 1),
//                 0
//               ) || 0,
//           }))
//         );
//         setOrders(allOrders);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to fetch orders");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   const handleRemoveOrder = async (orderId) => {
//     try {
//       const order = orders.find((o) => o.id === orderId);
//       if (!order) return;
//       const userRes = await api.get(`/users/${order.userId}`);
//       const user = userRes.data;
//       const updatedOrders = user.orders.filter((o) => o.id !== orderId);
//       await api.put(`/users/${order.userId}`, { ...user, orders: updatedOrders });
//       setOrders((prev) => prev.filter((o) => o.id !== orderId));
//       toast.success("Order cancelled successfully!");
//     } catch {
//       toast.error("Failed to remove order");
//     }
//   };

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       const order = orders.find((o) => o.id === orderId);
//       if (!order) return;
//       const userRes = await api.get(`/users/${order.userId}`);
//       const user = userRes.data;
//       const updatedOrders = user.orders.map((o) =>
//         o.id === orderId ? { ...o, status: newStatus } : o
//       );
//       await api.put(`/users/${order.userId}`, { ...user, orders: updatedOrders });
//       setOrders((prev) =>
//         prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
//       );
//       toast.success(`Order status updated to ${newStatus}`);
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

//   const filteredOrders =
//     statusFilter === "All"
//       ? orders
//       : orders.filter((order) => order.status === statusFilter);

//   const totalOrders = orders.length;
//   const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

//   const statusDistribution = [
//     { name: "Pending", value: orders.filter((o) => o.status === "Pending").length, color: "#F59E0B" },
//     { name: "Confirmed", value: orders.filter((o) => o.status === "Confirmed").length, color: "#3B82F6" },
//     { name: "Shipping", value: orders.filter((o) => o.status === "Shipping").length, color: "#8B5CF6" },
//     { name: "Delivered", value: orders.filter((o) => o.status === "Delivered").length, color: "#10B981" },
//   ];

//   const getDailyOrdersData = () => {
//     const last7Days = [...Array(7)].map((_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
//     }).reverse();

//     return last7Days.map((day) => {
//       const dayOrders = orders.filter((order) => {
//         const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
//         return orderDate === day;
//       });
//       return {
//         day,
//         orders: dayOrders.length,
//         revenue: dayOrders.reduce((sum, order) => sum + order.total, 0),
//       };
//     });
//   };

//   const dailyOrdersData = getDailyOrdersData();

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Pending":
//         return <Clock size={16} className="text-yellow-600" />;
//       case "Confirmed":
//         return <CheckCircle size={16} className="text-blue-600" />;
//       case "Shipping":
//         return <Truck size={16} className="text-indigo-600" />;
//       case "Delivered":
//         return <CheckCircle size={16} className="text-green-600" />;
//       default:
//         return <Package size={16} />;
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
//       <Sidebar />

//       <div className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 transition-all duration-300">
//         <div className="mb-6 sm:mb-8">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders Management</h1>
//           <p className="text-gray-600 text-sm sm:text-base mt-2">
//             Manage customer orders and track order status
//           </p>
//         </div>

//         {/* Statistic Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
//           {[
//             { title: "Total Orders", value: totalOrders, icon: Package, color: "blue" },
//             { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "green" },
//             {
//               title: "Avg. Order Value",
//               value: `$${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}`,
//               icon: CheckCircle,
//               color: "purple",
//             },
//             {
//               title: "Completed Orders",
//               value: orders.filter((o) => o.status === "Delivered").length,
//               icon: CheckCircle,
//               color: "green",
//             },
//           ].map((stat, i) => (
//             <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{stat.value}</p>
//                 </div>
//                 <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
//                   <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
//             <h3 className="text-gray-600 sm:text-lg font-semibold mb-4">Daily Orders Trend</h3>
//             <div className="h-60 sm:h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={dailyOrdersData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="day" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="orders"
//                     stroke="#3B82F6"
//                     strokeWidth={2}
//                     dot={{ fill: "#3B82F6", r: 3 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
//             <h3 className="text-gray-600 sm:text-lg font-semibold mb-4">Order Status Distribution</h3>
//             <div className="h-60 sm:h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={statusDistribution}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     outerRadius={80}
//                     dataKey="value"
//                   >
//                     {statusDistribution.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Filters + Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//             <div className="flex items-center gap-2 sm:gap-4">
//               <Filter size={18} className="text-gray-600" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 text-sm focus:outline-none text-gray-600"
//               >
//                 <option value="All">All Status</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Confirmed">Confirmed</option>
//                 <option value="Shipping">Shipping</option>
//                 <option value="Delivered">Delivered</option>
//               </select>
//             </div>

//             <div className="text-xs sm:text-sm text-gray-600">
//               Showing {filteredOrders.length} of {orders.length} orders
//             </div>
//           </div>

//           {loading ? (
//             <p className="text-center text-gray-500 py-8">Loading orders...</p>
//           ) : filteredOrders.length === 0 ? (
//             <p className="text-center text-gray-500 py-8">No orders found.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse text-xs sm:text-sm">
//                 <thead className="bg-gray-100 text-gray-700 uppercase">
//                   <tr>
//                     <th className="py-3 px-2 sm:px-4">Order ID</th>
//                     <th className="py-3 px-2 sm:px-4">Customer</th>
//                     <th className="py-3 px-2 sm:px-4">Products</th>
//                     <th className="py-3 px-2 sm:px-4">Qty</th>
//                     <th className="py-3 px-2 sm:px-4">Total</th>
//                     <th className="py-3 px-2 sm:px-4">Status</th>
//                     <th className="py-3 px-2 sm:px-4 text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredOrders.map((order) => {
//                     const totalQty = order.products.reduce(
//                       (sum, p) => sum + (p.quantity || 0),
//                       0
//                     );
//                     return (
//                       <tr key={order.id} className="border-b hover:bg-gray-50">
//                         <td className="py-3 px-2 sm:px-4 font-medium text-gray-800">
//                           #{order.id.toString().slice(-6)}
//                         </td>
//                         <td className=" px-2 sm:px-4">
//                           <p className="font-medium">{order.userName}</p>
//                           <p className="text-xs text-gray-500">
//                             {new Date(order.createdAt).toLocaleDateString()}
//                           </p>
//                         </td>
//                         <td className="text-black px-2 sm:px-4">
//                           {order.products.map((p, idx) => (
//                             <div key={idx} className="text-xs sm:text-sm">
//                               {p.name} x{p.quantity}
//                             </div>
//                           ))}
//                         </td>
//                         <td className="text-black px-2 sm:px-4">{totalQty}</td>
//                         <td className="py-3 px-2 sm:px-4 text-green-600 font-semibold">
//                           ${order.total.toFixed(2)}
//                         </td>
//                         <td className="py-3 px-2 sm:px-4">
//                           <div className="flex items-center gap-2">
//                             {getStatusIcon(order.status)}
//                             <select
//                               value={order.status}
//                               onChange={(e) =>
//                                 handleStatusChange(order.id, e.target.value)
//                               }
//                               className={`rounded-lg text-xs sm:text-sm px-2 py-1 border-0 cursor-pointer focus:ring-2 ${
//                                 order.status === "Pending"
//                                   ? "bg-yellow-100 text-yellow-700 focus:ring-yellow-500"
//                                   : order.status === "Confirmed"
//                                   ? "bg-blue-100 text-blue-700 focus:ring-blue-500"
//                                   : order.status === "Shipping"
//                                   ? "bg-indigo-100 text-indigo-700 focus:ring-indigo-500"
//                                   : "bg-green-100 text-green-700 focus:ring-green-500"
//                               }`}
//                             >
//                               <option value="Pending">Pending</option>
//                               <option value="Confirmed">Confirmed</option>
//                               <option value="Shipping">Shipping</option>
//                               <option value="Delivered">Delivered</option>
//                             </select>
//                           </div>
//                         </td>
//                         <td className="py-3 px-2 sm:px-4 text-center">
//                           <button
//                             onClick={() => handleRemoveOrder(order.id)}
//                             className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
















import React, { useEffect, useState } from "react";
import Sidebar from "../components/side";
import { api } from "../../service/api";
import {
  Trash2,
  Filter,
  TrendingUp,
  Package,
  CheckCircle,
  Clock,
  Truck,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Area,
  Cell,
} from "recharts";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("week");

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
            total:
              order.items?.reduce(
                (sum, item) => sum + item.price * (item.quantity || 1),
                0
              ) || 0,
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
    } catch {
      toast.error("Failed to remove order");
    }
  };

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
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const conversionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  // Get time-based data
  const getTimeBasedData = () => {
    let days;
    let format;
    
    switch(timeFilter) {
      case "week":
        days = 7;
        format = (date) => date.toLocaleDateString("en-US", { weekday: "short" });
        break;
      case "month":
        days = 30;
        format = (date) => `Week ${Math.ceil(date.getDate() / 7)}`;
        break;
      case "quarter":
        days = 90;
        format = (date) => `M${date.getMonth() + 1}`;
        break;
      default:
        days = 7;
        format = (date) => date.toLocaleDateString("en-US", { weekday: "short" });
    }

    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date);
      
      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const compareDate = new Date();
        compareDate.setDate(compareDate.getDate() - i);
        
        if (timeFilter === "week" || timeFilter === "month") {
          return orderDate.toDateString() === compareDate.toDateString();
        } else {
          return orderDate.getDate() === compareDate.getDate() && 
                 orderDate.getMonth() === compareDate.getMonth();
        }
      });
      
      data.push({
        date: dateStr,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.total, 0),
        avgValue: dayOrders.length > 0 ? 
          dayOrders.reduce((sum, order) => sum + order.total, 0) / dayOrders.length : 0,
      });
    }
    
    return data;
  };

  const timeData = getTimeBasedData();

  // Status data for bar chart
  const statusData = [
    { status: "Pending", count: pendingOrders, color: "#F59E0B", icon: Clock },
    { status: "Confirmed", count: orders.filter((o) => o.status === "Confirmed").length, color: "#3B82F6", icon: CheckCircle },
    { status: "Shipping", count: orders.filter((o) => o.status === "Shipping").length, color: "#8B5CF6", icon: Truck },
    { status: "Delivered", count: completedOrders, color: "#10B981", icon: CheckCircle },
  ];

  // Product performance data
  const getProductPerformance = () => {
    const productMap = {};
    orders.forEach(order => {
      order.products.forEach(product => {
        const key = product.name || product.id;
        if (!productMap[key]) {
          productMap[key] = {
            name: product.name || `Product ${product.id}`,
            quantity: 0,
            revenue: 0,
            orders: 0,
          };
        }
        productMap[key].quantity += product.quantity || 1;
        productMap[key].revenue += (product.price || 0) * (product.quantity || 1);
        productMap[key].orders += 1;
      });
    });
    
    return Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const topProducts = getProductPerformance();

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={16} className="text-yellow-600" />;
      case "Confirmed":
        return <CheckCircle size={16} className="text-blue-600" />;
      case "Shipping":
        return <Truck size={16} className="text-indigo-600" />;
      case "Delivered":
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return <Package size={16} />;
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}:</span>
              </div>
              <span className="font-medium">
                {entry.name === "Revenue" || entry.name === "avgValue" 
                  ? `$${entry.value.toFixed(2)}`
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 bg-gray-800/90 bg-clip-text text-transparent">
            Orders Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Real-time order analytics and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            { 
              title: "Total Orders", 
              value: totalOrders, 
              change: "+12.5%", 
              icon: ShoppingBag, 
              color: "blue",
              gradient: "from-blue-500 to-blue-600"
            },
            { 
              title: "Total Revenue", 
              value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
              change: "+15.2%", 
              icon: DollarSign, 
              color: "green",
              gradient: "from-green-500 to-emerald-600"
            },
            { 
              title: "Avg Order Value", 
              value: `$${avgOrderValue.toFixed(2)}`, 
              change: "+8.3%", 
              icon: TrendingUp, 
              color: "purple",
              gradient: "from-purple-500 to-indigo-600"
            },
            { 
              title: "Conversion Rate", 
              value: `${conversionRate.toFixed(1)}%`, 
              change: "+5.7%", 
              icon: CheckCircle, 
              color: "emerald",
              gradient: "from-emerald-500 to-teal-600"
            },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs font-medium text-green-600">{stat.change}</span>
                    <span className="text-xs text-gray-500">from last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Time Series Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                  Order Trends
                </h3>
                <p className="text-sm text-gray-600 mt-1">Performance over time</p>
              </div>
              <div className="flex gap-2 mt-3 sm:mt-0">
                {["week", "month", "quarter"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      timeFilter === period
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={timeData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#10B981"
                    fill="url(#colorOrders)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#1D4ED8" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-purple-600" />
                  Order Status Distribution
                </h3>
                <p className="text-sm text-gray-600 mt-1">Current order status overview</p>
              </div>
              <div className="text-sm text-gray-600">
                <Calendar className="w-5 h-5 inline mr-2" />
                Real-time
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="status"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    formatter={(value, name) => [value, name === "count" ? "Orders" : name]}
                  />
                  <Bar 
                    dataKey="count" 
                    name="Orders"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {statusData.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                    <span className="text-sm font-medium text-gray-700">{status.status}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">{status.count}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({((status.count / totalOrders) * 100 || 0).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products & Orders Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Products */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Products</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">Sold: {product.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${product.revenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{product.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <p className="text-sm text-gray-600 mt-1">Manage and track all orders</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                  <Filter size={16} className="text-gray-600" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-sm focus:outline-none text-gray-700"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  {filteredOrders.length} of {orders.length} orders
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 mt-2">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders found matching your criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.slice(0, 8).map((order) => {
                      const totalQty = order.products.reduce(
                        (sum, p) => sum + (p.quantity || 0),
                        0
                      );
                      return (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">#{order.id.toString().slice(-6)}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-medium text-gray-900">{order.userName}</p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-900">{totalQty} items</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className={`text-sm px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 ${
                                  order.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800 focus:ring-yellow-500"
                                    : order.status === "Confirmed"
                                    ? "bg-blue-100 text-blue-800 focus:ring-blue-500"
                                    : order.status === "Shipping"
                                    ? "bg-indigo-100 text-indigo-800 focus:ring-indigo-500"
                                    : "bg-green-100 text-green-800 focus:ring-green-500"
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipping">Shipping</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleRemoveOrder(order.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel Order"
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
    </div>
  );
}